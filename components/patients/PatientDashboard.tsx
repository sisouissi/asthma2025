
import React, { useState, useEffect, useMemo } from 'react';
import { usePatientRecords } from '../../contexts/PatientRecordsContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { usePatientData } from '../../contexts/PatientDataContext';
import { useUIState } from '../../contexts/UIStateContext';
import { PatientProfile } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { User, PlusCircle, Search, FileText, ChevronRight, Calendar, Trash2, ArrowRight, Users, ChevronLeft, Bell, Lock, Unlock, Key, ShieldCheck } from '../../constants/icons';
import { StepId, AgeGroup } from '../../types';

interface PatientListItemProps {
    patient: PatientProfile;
    onSelect: (id: string) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
}

const PatientListItem: React.FC<PatientListItemProps> = ({ patient, onSelect, onDelete }) => (
    <div 
        onClick={() => onSelect(patient.id)}
        className="p-4 border border-slate-200 rounded-lg hover:shadow-md cursor-pointer bg-white transition-all flex justify-between items-center group"
    >
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-4">
                <User size={20} />
            </div>
            <div>
                <h4 className="font-semibold text-slate-800 text-lg">{patient.lastName.toUpperCase()}, {patient.firstName}</h4>
                <div className="flex flex-wrap gap-3 text-sm text-slate-500 mt-1">
                    <span><span className="font-medium">File:</span> {patient.fileNumber}</span>
                    <span className="hidden sm:inline">|</span>
                    <span><span className="font-medium">DOB:</span> {patient.dateOfBirth}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <p className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded-full">
                    {patient.consultations.length} Consultations
                </p>
            </div>
            <Button 
                onClick={(e) => onDelete(patient.id, e)} 
                variant="ghost" 
                size="sm" 
                className="text-slate-300 hover:text-red-500"
            >
                <Trash2 size={18} />
            </Button>
            <ChevronRight className="text-slate-300 group-hover:text-indigo-500" />
        </div>
    </div>
);

const PatientDashboard: React.FC = () => {
    const { patients, addPatient, deletePatient } = usePatientRecords();
    const { navigateTo } = useNavigation();
    const { patientData, updatePatientData, resetPatientData } = usePatientData();
    const { isAuthenticated, authenticate, hasPin, setAppPin } = useUIState();
    
    // PIN Authentication Local Input State
    const [pinInput, setPinInput] = useState('');
    const [confirmPinInput, setConfirmPinInput] = useState('');
    const [authError, setAuthError] = useState('');

    // Views: List (Tabs), Create Form, Details
    const [view, setView] = useState<'list' | 'create' | 'details'>('list');
    // Tabs: 'all' or 'today'
    const [activeTab, setActiveTab] = useState<'all' | 'today'>('all');
    
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Sync with global context
    useEffect(() => {
        if (patientData.activePatientId) {
            setSelectedPatientId(patientData.activePatientId);
            setView('details');
        }
    }, [patientData.activePatientId]);
    
    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Form State
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        dateOfBirth: '',
        fileNumber: '',
        treatingPhysician: ''
    });

    const selectedPatient = patients.find(p => p.id === selectedPatientId);

    // --- Auth Handlers ---

    const handlePinSetup = (e: React.FormEvent) => {
        e.preventDefault();
        if (pinInput.length < 4) {
            setAuthError("PIN must be at least 4 digits.");
            return;
        }
        if (pinInput !== confirmPinInput) {
            setAuthError("PINs do not match.");
            return;
        }
        setAppPin(pinInput); // Set in global context
        setAuthError('');
    };

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        const storedPin = localStorage.getItem('gina_app_pin');
        if (pinInput === storedPin) {
            authenticate(); // Set global authenticated state
            setAuthError('');
        } else {
            setAuthError("Incorrect PIN.");
            setPinInput('');
        }
    };

    // --- Helper Functions ---

    const calculateAge = (dobString: string): number => {
        const dob = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    };

    const getLatestReminderDate = (patient: PatientProfile): string | null => {
        if (!patient.consultations || patient.consultations.length === 0) return null;
        // Sort consultations by date descending
        const sorted = [...patient.consultations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const latestData = sorted[0].data;
        
        // Check all possible reminder fields
        return latestData.adult_reviewReminderDate || 
               latestData.child_reviewReminderDate || 
               latestData.youngChild_reviewReminderDate || null;
    };

    // --- Filtering & Pagination Logic ---

    const filteredAllPatients = useMemo(() => {
        return patients.filter(p => 
            p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.fileNumber.includes(searchTerm)
        );
    }, [patients, searchTerm]);

    const todaysPatients = useMemo(() => {
        const today = new Date();
        return patients.filter(p => {
            const reminderString = getLatestReminderDate(p);
            if (!reminderString) return false;
            
            // Use local date comparison to match "Today" correctly
            const reminder = new Date(reminderString);
            return reminder.getDate() === today.getDate() &&
                   reminder.getMonth() === today.getMonth() &&
                   reminder.getFullYear() === today.getFullYear();
        });
    }, [patients]);

    const totalPages = Math.ceil(filteredAllPatients.length / itemsPerPage);
    const paginatedPatients = filteredAllPatients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // --- Actions ---

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.lastName || !formData.firstName) return;
        
        // Generate random file number if empty: P-XXXXXX
        const finalFileNumber = formData.fileNumber.trim() || `P-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        addPatient({
            ...formData,
            fileNumber: finalFileNumber
        });
        setFormData({ lastName: '', firstName: '', dateOfBirth: '', fileNumber: '', treatingPhysician: '' });
        setView('list');
        setActiveTab('all'); // Switch to all list to see new patient
    };

    const handleSelectPatient = (id: string) => {
        setSelectedPatientId(id);
        setView('details');
        updatePatientData({ activePatientId: id });
    };

    const handleBackToList = () => {
        setView('list');
        setSelectedPatientId(null);
        updatePatientData({ activePatientId: null });
    };

    const handleNewConsultation = () => {
        if (!selectedPatientId || !selectedPatient) return;
        
        // Reset clinical data but keep patient ID context
        resetPatientData(true); 
        
        // Determine age group automatically based on DOB
        let nextStep: StepId = 'INITIAL_STEP';
        let ageGroup: AgeGroup | null = null;
        let ageLabel: string | null = null;

        const age = selectedPatient.dateOfBirth ? calculateAge(selectedPatient.dateOfBirth) : 0;

        if (age >= 12) {
            ageGroup = 'adult';
            ageLabel = '12+ years';
            nextStep = 'DIAGNOSIS_PROBABILITY_STEP';
        } else if (age >= 6) {
            ageGroup = 'child';
            ageLabel = '6-11 years';
            nextStep = 'DIAGNOSIS_PROBABILITY_STEP';
        } else {
            ageGroup = 'youngChild';
            ageLabel = '<=5 years';
            nextStep = 'YOUNG_CHILD_DIAGNOSIS_STEP';
        }

        const hasPriorConsultations = selectedPatient.consultations.length > 0;
        const consultationType = hasPriorConsultations ? 'followup' : 'initial';
        
        let updates: any = {
            activePatientId: selectedPatientId,
            age: ageLabel,
            ageGroup: ageGroup,
            consultationType: consultationType
        };

        if (hasPriorConsultations) {
            const sortedConsultations = [...selectedPatient.consultations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const lastConsultation = sortedConsultations[0];

            // --- SEVERE ASTHMA CHECK ---
            const severeStatus = lastConsultation.data.severeAsthma?.status;
            const isSevereActive = severeStatus && severeStatus !== 'screening' && severeStatus !== 'rejected_severe';

            if (isSevereActive) {
                updates.severeAsthma = lastConsultation.data.severeAsthma;
                updates.severeAsthmaAssessment = lastConsultation.data.severeAsthmaAssessment;
                nextStep = 'SEVERE_ASTHMA_STAGE_1'; 
            } else {
                // --- STANDARD ASTHMA FOLLOW-UP ---
                const aggregatedACT = sortedConsultations.flatMap(c => c.data.actHistory || []);
                const aggregatedACQ = sortedConsultations.flatMap(c => c.data.acqHistory || []);
                const aggregatedcACT = sortedConsultations.flatMap(c => c.data.cactHistory || []);

                const uniqueACT = Array.from(new Map(aggregatedACT.map(item => [item.date, item])).values());
                const uniqueACQ = Array.from(new Map(aggregatedACQ.map(item => [item.date, item])).values());
                const uniquecACT = Array.from(new Map(aggregatedcACT.map(item => [item.date, item])).values());

                updates.actHistory = uniqueACT;
                updates.acqHistory = uniqueACQ;
                updates.cactHistory = uniquecACT;

                if (ageGroup === 'adult') {
                    updates.adult_currentGinaStep = lastConsultation.data.adult_currentGinaStep;
                    updates.adult_pathway = lastConsultation.data.adult_pathway;
                    nextStep = 'ADULT_CONTROL_ASSESSMENT_STEP';
                } else if (ageGroup === 'child') {
                    updates.child_currentGinaStep = lastConsultation.data.child_currentGinaStep;
                    updates.child_pathway = lastConsultation.data.child_pathway;
                    nextStep = 'CHILD_CONTROL_ASSESSMENT_STEP';
                } else if (ageGroup === 'youngChild') {
                    updates.youngChild_currentGinaStep = lastConsultation.data.youngChild_currentGinaStep;
                    updates.youngChild_currentTreatmentStrategy = lastConsultation.data.youngChild_currentTreatmentStrategy;
                    nextStep = 'YOUNG_CHILD_CONTROL_ASSESSMENT_STEP';
                }
            }
        }

        updatePatientData(updates);
        navigateTo(nextStep);
    };

    const handleLoadConsultation = (consultation: any) => {
        if (!selectedPatientId) return;
        updatePatientData({ 
            ...consultation.data, 
            activePatientId: selectedPatientId, 
            activeConsultationId: consultation.id 
        });
        navigateTo('CONSULTATION_SUMMARY_STEP'); 
    };

    const handleDeletePatient = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        deletePatient(id);
        if (selectedPatientId === id) {
            setSelectedPatientId(null);
            setView('list');
        }
    };

    const inputStyle = "w-full p-2 bg-slate-100 border border-slate-300 rounded-md shadow-inner text-slate-800 placeholder-slate-500 focus:bg-white focus:shadow-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200";

    // --- Auth Guard ---
    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto mt-12 px-4">
                <Card 
                    title={hasPin ? "Patient Access Locked" : "Security Setup"} 
                    icon={hasPin ? <Lock className="text-indigo-600"/> : <ShieldCheck className="text-violet-600"/>}
                    className="text-center shadow-xl"
                >
                    <div className="py-6">
                        {hasPin ? (
                            <form onSubmit={handleUnlock} className="space-y-6">
                                <p className="text-slate-600 mb-4">Please enter your security PIN to access patient records.</p>
                                <div>
                                    <input 
                                        type="password" 
                                        inputMode="numeric"
                                        autoFocus
                                        className="w-48 text-center text-3xl tracking-[0.5em] p-3 border-b-2 border-indigo-300 focus:border-indigo-600 focus:outline-none bg-transparent text-slate-800 font-bold placeholder-slate-300"
                                        value={pinInput}
                                        onChange={(e) => setPinInput(e.target.value)}
                                        placeholder="••••"
                                    />
                                </div>
                                {authError && <p className="text-red-500 text-sm font-medium animate-pulse">{authError}</p>}
                                <div className="pt-2">
                                    <Button type="submit" fullWidth variant="primary" size="lg" rightIcon={<Unlock size={20}/>}>
                                        Unlock Dashboard
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handlePinSetup} className="space-y-6">
                                <div className="bg-violet-50 p-3 rounded-lg text-sm text-violet-800 mb-4">
                                    First-time access: Please create a secure PIN to protect patient data.
                                </div>
                                <div className="space-y-4 text-left">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 pl-1">Create PIN</label>
                                        <input 
                                            type="password" 
                                            inputMode="numeric"
                                            className="w-full text-center text-2xl tracking-widest p-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                                            value={pinInput}
                                            onChange={(e) => setPinInput(e.target.value)}
                                            placeholder="••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 pl-1">Confirm PIN</label>
                                        <input 
                                            type="password" 
                                            inputMode="numeric"
                                            className="w-full text-center text-2xl tracking-widest p-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                                            value={confirmPinInput}
                                            onChange={(e) => setConfirmPinInput(e.target.value)}
                                            placeholder="••••"
                                        />
                                    </div>
                                </div>
                                {authError && <p className="text-red-500 text-sm font-medium">{authError}</p>}
                                <Button type="submit" fullWidth variant="violet" size="lg" rightIcon={<Key size={20}/>}>
                                    Set PIN & Access
                                </Button>
                            </form>
                        )}
                    </div>
                </Card>
            </div>
        );
    }

    // --- Render Components ---
    const renderMainList = () => (
        <Card 
            title="Patient Directory" 
            icon={<Users className="text-indigo-600"/>}
            titleRightElement={
                <Button onClick={() => setView('create')} size="sm" leftIcon={<PlusCircle size={16}/>}>
                    New Patient
                </Button>
            }
        >
            {/* Tabs */}
            <div className="flex space-x-4 border-b border-slate-200 mb-6">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`pb-2 px-4 font-medium text-sm transition-colors relative ${
                        activeTab === 'all' 
                        ? 'text-indigo-600' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    All Patients
                    {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('today')}
                    className={`pb-2 px-4 font-medium text-sm transition-colors relative flex items-center ${
                        activeTab === 'today' 
                        ? 'text-indigo-600' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Appointments Today
                    {todaysPatients.length > 0 && (
                        <span className="ml-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            {todaysPatients.length}
                        </span>
                    )}
                    {activeTab === 'today' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></div>}
                </button>
            </div>

            {/* Tab Content: ALL PATIENTS */}
            {activeTab === 'all' && (
                <>
                    <div className="mb-6 relative">
                        <input 
                            type="text" 
                            placeholder="Search by Name or File Number..." 
                            className={`pl-10 pr-4 py-3 rounded-lg ${inputStyle}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
                    </div>

                    {paginatedPatients.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            <User className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                            <p className="text-slate-500 font-medium">No patients found matching your search.</p>
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="text-indigo-600 text-sm mt-2 hover:underline">
                                    Clear search
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {paginatedPatients.map(patient => (
                                <PatientListItem 
                                    key={patient.id} 
                                    patient={patient} 
                                    onSelect={handleSelectPatient}
                                    onDelete={handleDeletePatient}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {filteredAllPatients.length > itemsPerPage && (
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
                            <div className="text-sm text-slate-500">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAllPatients.length)} of {filteredAllPatients.length} patients
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    variant="secondary"
                                    size="sm"
                                    leftIcon={<ChevronLeft size={16}/>}
                                >
                                    Previous
                                </Button>
                                <Button 
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    variant="secondary"
                                    size="sm"
                                    rightIcon={<ChevronRight size={16}/>}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Tab Content: APPOINTMENTS TODAY */}
            {activeTab === 'today' && (
                <>
                    {todaysPatients.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                            <p className="text-slate-500 font-medium">No appointments scheduled for today.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-md border border-blue-200 mb-4 flex items-center">
                                <Bell size={16} className="mr-2" />
                                Showing patients with a review scheduled for {new Date().toLocaleDateString()}.
                            </div>
                            {todaysPatients.map(patient => (
                                <PatientListItem 
                                    key={patient.id} 
                                    patient={patient} 
                                    onSelect={handleSelectPatient}
                                    onDelete={handleDeletePatient}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </Card>
    );

    const renderCreate = () => (
        <Card title="Register New Patient" icon={<PlusCircle className="text-indigo-600"/>}>
            <form onSubmit={handleCreateSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                        <input required type="text" className={inputStyle} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                        <input required type="text" className={inputStyle} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                        <input type="date" className={inputStyle} value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">File Number</label>
                        <input 
                            type="text" 
                            className={inputStyle} 
                            value={formData.fileNumber} 
                            onChange={e => setFormData({...formData, fileNumber: e.target.value})} 
                            placeholder="Auto-generated if empty"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Treating Physician</label>
                        <input type="text" className={inputStyle} value={formData.treatingPhysician} onChange={e => setFormData({...formData, treatingPhysician: e.target.value})} />
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <Button type="button" variant="secondary" onClick={() => setView('list')}>Cancel</Button>
                    <Button type="submit" variant="primary">Save Patient Record</Button>
                </div>
            </form>
        </Card>
    );

    const renderDetails = () => {
        const age = selectedPatient?.dateOfBirth ? calculateAge(selectedPatient.dateOfBirth) : 'N/A';
        
        return (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{selectedPatient?.lastName.toUpperCase()}, {selectedPatient?.firstName}</h2>
                        <div className="mt-2 text-slate-600 flex flex-wrap gap-4 text-sm">
                            <p><span className="font-medium text-slate-900">DOB:</span> {selectedPatient?.dateOfBirth || 'N/A'} (Age: {age})</p>
                            <p><span className="font-medium text-slate-900">File:</span> {selectedPatient?.fileNumber || 'N/A'}</p>
                            <p><span className="font-medium text-slate-900">MD:</span> {selectedPatient?.treatingPhysician || 'N/A'}</p>
                        </div>
                    </div>
                    <Button onClick={handleBackToList} variant="secondary" leftIcon={<ArrowRight className="rotate-180"/>}>Back to List</Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Actions */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5 text-center shadow-sm">
                            <h3 className="font-semibold text-indigo-900 mb-2 text-lg">New Consultation</h3>
                            <p className="text-sm text-indigo-700 mb-4">Start a new GINA-based assessment. The guide adapts to the patient's current age.</p>
                            <Button onClick={handleNewConsultation} fullWidth variant="primary" size="lg" rightIcon={<ArrowRight/>}>
                                Start Consultation
                            </Button>
                        </div>
                        
                        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                            <h3 className="font-semibold text-slate-800 mb-3">Quick Stats</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Total Visits:</span>
                                    <span className="font-medium">{selectedPatient?.consultations.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">First Visit:</span>
                                    <span className="font-medium">{selectedPatient?.consultations.length ? new Date(selectedPatient.consultations[selectedPatient.consultations.length - 1].date).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                 <div className="flex justify-between">
                                    <span className="text-slate-600">Last Visit:</span>
                                    <span className="font-medium">{selectedPatient?.consultations.length ? new Date(selectedPatient.consultations[0].date).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - History */}
                    <div className="w-full lg:w-2/3">
                        <Card title="Consultation History" icon={<FileText className="text-slate-600"/>}>
                            {selectedPatient?.consultations.length === 0 ? (
                                <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                    <FileText className="mx-auto h-10 w-10 mb-2 opacity-50" />
                                    No previous consultations recorded.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedPatient?.consultations.map(consult => (
                                        <div key={consult.id} className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow flex justify-between items-center">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-bold text-slate-800 text-lg">{new Date(consult.date).toLocaleDateString()}</span>
                                                    <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                                                        {new Date(consult.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${consult.data.consultationType === 'initial' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {consult.data.consultationType === 'initial' ? 'Initial' : 'Follow-up'}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{consult.data.ageGroup ? consult.data.ageGroup.charAt(0).toUpperCase() + consult.data.ageGroup.slice(1) : 'Unknown Group'}</span>
                                                </div>
                                            </div>
                                            <Button onClick={() => handleLoadConsultation(consult)} size="sm" variant="secondary" rightIcon={<ChevronRight size={16}/>}>Review</Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        );
    };

    // Main layout container extended to max-w-7xl
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {view === 'list' && renderMainList()}
            {view === 'create' && renderCreate()}
            {view === 'details' && renderDetails()}
        </div>
    );
};

export default PatientDashboard;