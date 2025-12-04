import React, { useState } from 'react';
import { usePatientData } from '../../contexts/PatientDataContext';
import { useMedications } from '../../contexts/MedicationContext';
import { usePatientRecords } from '../../contexts/PatientRecordsContext';
import Button from '../ui/Button';
import { PlusCircle, Trash2, Printer, Pill, XCircle, Plus, Edit3, Save } from '../../constants/icons';
import { PrescriptionItem } from '../../types';

const PrescriptionWriter: React.FC = () => {
    const { patientData, updatePatientData } = usePatientData();
    const { medications, addMedication } = useMedications();
    const { getPatient } = usePatientRecords();
    
    const [selectedMedId, setSelectedMedId] = useState('');
    
    // Dosage Fields
    const [puffs, setPuffs] = useState('1');
    const [frequency, setFrequency] = useState('Twice daily');
    
    // Duration Field
    const [duration, setDuration] = useState('1 month');
    
    // Edit Mode State
    const [editingId, setEditingId] = useState<string | null>(null);
    
    const [isAddingCustom, setIsAddingCustom] = useState(false);
    const [customMedData, setCustomMedData] = useState({ brandName: '', genericName: '', defaultDosage: '' });

    const currentPatient = patientData.activePatientId ? getPatient(patientData.activePatientId) : null;

    const puffOptions = ['1', '2', '3', '4'];
    const frequencyOptions = [
        'Once daily', 
        'Twice daily', 
        'Three times daily', 
        'Four times daily', 
        'PRN (As needed)',
        'Morning',
        'Evening'
    ];
    const durationOptions = [
        '7 days', 
        '15 days', 
        '1 month', 
        '2 months', 
        '3 months', 
        '6 months', 
        'Ongoing'
    ];

    const handleAddMedication = () => {
        if (!selectedMedId) return;
        
        const medication = medications.find(m => m.id === selectedMedId);
        if (!medication) return;

        // Combine dosage and frequency into instructions
        const instructions = `${puffs} puff(s), ${frequency}`;

        if (editingId) {
            // Update existing item
            const updatedList = patientData.currentPrescription.map(item => 
                item.id === editingId 
                ? {
                    ...item,
                    medicationId: medication.id,
                    medicationName: `${medication.brandName} (${medication.genericName})`,
                    instructions: instructions,
                    duration: duration
                  }
                : item
            );
            updatePatientData({ currentPrescription: updatedList });
            setEditingId(null);
        } else {
            // Add new item
            const newItem: PrescriptionItem = {
                id: crypto.randomUUID(),
                medicationId: medication.id,
                medicationName: `${medication.brandName} (${medication.genericName})`,
                instructions: instructions,
                duration: duration
            };
            updatePatientData({
                currentPrescription: [...(patientData.currentPrescription || []), newItem]
            });
        }

        // Reset fields to defaults
        setSelectedMedId('');
        setPuffs('1');
        setFrequency('Twice daily');
        setDuration('1 month');
    };

    const handleEditItem = (item: PrescriptionItem) => {
        setSelectedMedId(item.medicationId);
        setDuration(item.duration);
        setEditingId(item.id);

        // Parse instructions to populate dropdowns
        // Expected format: "X puff(s), Frequency"
        const parts = item.instructions.split(' puff(s), ');
        if (parts.length === 2) {
            setPuffs(parts[0]);
            setFrequency(parts[1]);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setSelectedMedId('');
        setPuffs('1');
        setFrequency('Twice daily');
        setDuration('1 month');
    };

    const handleRemoveItem = (id: string) => {
        updatePatientData({
            currentPrescription: patientData.currentPrescription.filter(item => item.id !== id)
        });
        if (editingId === id) {
            handleCancelEdit();
        }
    };

    const handleSaveCustomMed = () => {
        if (customMedData.brandName && customMedData.genericName) {
            addMedication(customMedData);
            setCustomMedData({ brandName: '', genericName: '', defaultDosage: '' });
            setIsAddingCustom(false);
        }
    };

    const handlePrintPrescription = () => {
        const items = patientData.currentPrescription;
        if (items.length === 0) return;

        const printWindow = window.open('', '_blank', 'height=800,width=800');
        if (printWindow) {
            const date = new Date().toLocaleDateString();
            const patientName = currentPatient ? `${currentPatient.lastName.toUpperCase()}, ${currentPatient.firstName}` : 'Unknown Patient';
            const patientDOB = currentPatient ? currentPatient.dateOfBirth : '';
            const doctorName = currentPatient ? currentPatient.treatingPhysician : 'Dr. ________________';

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Prescription - ${patientName}</title>
                        <style>
                            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
                            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                            .doctor-info h2 { margin: 0 0 5px 0; }
                            .patient-info { margin-bottom: 30px; }
                            .patient-info p { margin: 5px 0; font-size: 1.1em; }
                            .rx-symbol { font-size: 3em; font-weight: bold; font-family: serif; margin-bottom: 10px; }
                            .med-list { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                            .med-list th { text-align: left; border-bottom: 1px solid #ccc; padding: 10px 0; }
                            .med-list td { padding: 12px 0; border-bottom: 1px solid #eee; vertical-align: top; }
                            .med-name { font-weight: bold; font-size: 1.1em; }
                            .med-instruction { margin-top: 4px; color: #555; }
                            .med-duration { color: #777; font-size: 0.9em; }
                            .footer { margin-top: 60px; border-top: 1px solid #ccc; padding-top: 20px; display: flex; justify-content: space-between; }
                            .signature-line { border-top: 1px solid #333; width: 250px; margin-top: 40px; text-align: center; padding-top: 5px; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <div class="doctor-info">
                                <h2>${doctorName}</h2>
                                <p>Medical Practitioner</p>
                            </div>
                            <div class="date">
                                <p><strong>Date:</strong> ${date}</p>
                            </div>
                        </div>

                        <div class="patient-info">
                            <p><strong>Patient Name:</strong> ${patientName}</p>
                            <p><strong>Date of Birth:</strong> ${patientDOB}</p>
                        </div>

                        <div class="rx-symbol">Rx</div>

                        <table class="med-list">
                            <thead>
                                <tr>
                                    <th width="60%">Medication & Instructions</th>
                                    <th width="20%">Duration</th>
                                    <th width="20%">Dispensed</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${items.map(item => `
                                    <tr>
                                        <td>
                                            <div class="med-name">${item.medicationName}</div>
                                            <div class="med-instruction">${item.instructions}</div>
                                        </td>
                                        <td class="med-duration">${item.duration}</td>
                                        <td></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>

                        <div class="footer">
                            <div class="signature-block">
                                <div class="signature-line">Signature</div>
                            </div>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };
        }
    };

    return (
        <div className="mt-8 bg-slate-50 border border-slate-300 rounded-xl overflow-hidden">
            <div className="bg-slate-200 px-5 py-3 border-b border-slate-300 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700 flex items-center">
                    <Pill className="mr-2" size={20}/> Prescription Writer
                </h3>
                {patientData.currentPrescription.length > 0 && (
                    <Button onClick={handlePrintPrescription} size="sm" variant="secondary" leftIcon={<Printer size={16}/>}>
                        Print Rx
                    </Button>
                )}
            </div>

            <div className="p-5">
                {/* Input Area */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-end">
                    <div className="md:col-span-4">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Medication</label>
                        <select 
                            className="w-full p-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                            value={selectedMedId}
                            onChange={(e) => setSelectedMedId(e.target.value)}
                        >
                            <option value="">Select Medication...</option>
                            {medications.map(med => (
                                <option key={med.id} value={med.id}>{med.brandName} ({med.genericName})</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Puffs / Amount</label>
                        <select 
                            className="w-full p-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                            value={puffs}
                            onChange={e => setPuffs(e.target.value)}
                        >
                            {puffOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Frequency</label>
                        <select 
                            className="w-full p-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                            value={frequency}
                            onChange={e => setFrequency(e.target.value)}
                        >
                            {frequencyOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Duration</label>
                        <div className="flex gap-2">
                            <select 
                                className="w-full p-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                            >
                                {durationOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            <Button 
                                onClick={handleAddMedication} 
                                disabled={!selectedMedId} 
                                variant={editingId ? "success" : "primary"} 
                                className="!p-2 flex-shrink-0"
                                aria-label={editingId ? "Update Medication" : "Add Medication"}
                            >
                                {editingId ? <Save size={20}/> : <PlusCircle size={20}/>}
                            </Button>
                        </div>
                    </div>
                </div>
                
                {/* Cancel Edit Button */}
                {editingId && (
                    <div className="mb-4 flex justify-end">
                         <button 
                            onClick={handleCancelEdit} 
                            className="text-xs text-red-600 hover:text-red-800 font-medium underline"
                        >
                            Cancel Editing
                        </button>
                    </div>
                )}

                <div className="mb-6">
                    <button 
                        onClick={() => setIsAddingCustom(!isAddingCustom)} 
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                    >
                        {isAddingCustom ? <XCircle size={14} className="mr-1"/> : <Plus size={14} className="mr-1"/>}
                        {isAddingCustom ? 'Cancel Custom Medication' : 'Add New Custom Medication to List'}
                    </button>
                    
                    {isAddingCustom && (
                        <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                            <div>
                                <label className="block text-xs text-indigo-800 mb-1">Brand Name</label>
                                <input type="text" className="w-full p-1.5 text-sm border rounded" value={customMedData.brandName} onChange={e => setCustomMedData({...customMedData, brandName: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs text-indigo-800 mb-1">Generic Name</label>
                                <input type="text" className="w-full p-1.5 text-sm border rounded" value={customMedData.genericName} onChange={e => setCustomMedData({...customMedData, genericName: e.target.value})} />
                            </div>
                            <Button onClick={handleSaveCustomMed} size="sm" variant="primary">Save to List</Button>
                        </div>
                    )}
                </div>

                {/* Prescription List */}
                {patientData.currentPrescription.length > 0 ? (
                    <div className="bg-white rounded-lg border border-slate-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-2">Medication</th>
                                    <th className="px-4 py-2">Instructions</th>
                                    <th className="px-4 py-2">Duration</th>
                                    <th className="px-4 py-2 w-20 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {patientData.currentPrescription.map((item, idx) => (
                                    <tr key={idx} className={`hover:bg-slate-50 ${editingId === item.id ? 'bg-indigo-50' : ''}`}>
                                        <td className="px-4 py-2 font-medium text-slate-800">{item.medicationName}</td>
                                        <td className="px-4 py-2 text-slate-600">{item.instructions}</td>
                                        <td className="px-4 py-2 text-slate-500">{item.duration}</td>
                                        <td className="px-4 py-2 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEditItem(item)} 
                                                    className="text-slate-400 hover:text-indigo-600"
                                                    aria-label="Edit item"
                                                >
                                                    <Edit3 size={16}/>
                                                </button>
                                                <button 
                                                    onClick={() => handleRemoveItem(item.id)} 
                                                    className="text-slate-400 hover:text-red-500"
                                                    aria-label="Delete item"
                                                >
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-400 text-sm">
                        No medications added to prescription yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrescriptionWriter;