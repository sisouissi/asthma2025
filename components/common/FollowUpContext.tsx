
import React, { useMemo } from 'react';
import { usePatientRecords } from '../../contexts/PatientRecordsContext';
import { usePatientData } from '../../contexts/PatientDataContext';
import { PatientData } from '../../types';
import { History, ClipboardList, Activity, ArrowRight, Calendar, Pill } from '../../constants/icons';

const FollowUpContext: React.FC = () => {
    const { patientData } = usePatientData();
    const { getPatient } = usePatientRecords();
    const { activePatientId, consultationType } = patientData;

    // Only render this component if we are in a follow-up context and have a patient
    if (consultationType !== 'followup' || !activePatientId) {
        return null;
    }

    const patient = getPatient(activePatientId);
    if (!patient || patient.consultations.length === 0) return null;

    // Find the Initial Consultation (Anamnesis) - Assuming sorting by date, the last one is oldest
    // or filter by 'initial' type if available
    const consultations = [...patient.consultations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const initialConsultation = consultations.find(c => c.data.consultationType === 'initial') || consultations[consultations.length - 1];
    const lastConsultation = consultations[0];

    const initialData = initialConsultation.data;
    const lastData = lastConsultation.data;

    // Extract Phenotype
    const phenotype = initialData.phenotypeData.identifiedPhenotype || "Not specified";
    
    // Extract Initial Risk Factors
    const initialRiskFactorsCount = 
        (initialData.adult_riskFactors?.length || 0) + 
        (initialData.child_riskFactors?.length || 0) + 
        (initialData.youngChild_riskFactors?.length || 0);

    // Extract Scores from History (Use current session's aggregated history)
    // Get last 3 scores
    const getLast3Scores = (history: any[]) => {
        if (!history || history.length === 0) return [];
        return [...history]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);
    };

    const actScores = getLast3Scores(patientData.actHistory);
    const acqScores = getLast3Scores(patientData.acqHistory);
    const cactScores = getLast3Scores(patientData.cactHistory);

    const hasScores = actScores.length > 0 || acqScores.length > 0 || cactScores.length > 0;

    // Extract Last Prescription
    const lastPrescription = lastData.currentPrescription || [];

    return (
        <div className="mb-6 bg-slate-50 rounded-lg border border-slate-300 shadow-sm overflow-hidden">
            <div className="bg-slate-200 px-4 py-2 flex items-center border-b border-slate-300">
                <History size={18} className="text-slate-600 mr-2"/>
                <h3 className="font-semibold text-slate-700 text-sm">Patient Context & History</h3>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Initial Anamnesis */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                        <ClipboardList size={14} className="mr-1"/> Initial Anamnesis
                    </h4>
                    <div className="text-sm text-slate-700">
                        <p><span className="font-medium">Diagnosis:</span> {initialData.diagnosisConfirmed ? 'Confirmed' : 'Provisional'}</p>
                        <p><span className="font-medium">Phenotype:</span> {phenotype}</p>
                        <p><span className="font-medium">Initial Risk Factors:</span> {initialRiskFactorsCount} identified</p>
                        <p className="text-xs text-slate-500 mt-1">Recorded: {new Date(initialConsultation.date).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Column 2: Score Evolution */}
                <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                        <Activity size={14} className="mr-1"/> Score Evolution
                    </h4>
                    {hasScores ? (
                        <div className="space-y-2 text-sm">
                            {actScores.length > 0 && (
                                <div>
                                    <span className="font-medium text-indigo-700">ACT: </span>
                                    {actScores.map((res, i) => (
                                        <span key={i} className="inline-block mr-2">
                                            {res.score} <span className="text-xs text-slate-400">({new Date(res.date).toLocaleDateString()})</span>
                                            {i < actScores.length - 1 && <ArrowRight size={10} className="inline mx-1 text-slate-400"/>}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {acqScores.length > 0 && (
                                <div>
                                    <span className="font-medium text-teal-700">ACQ-5: </span>
                                    {acqScores.map((res, i) => (
                                        <span key={i} className="inline-block mr-2">
                                            {res.score}
                                            {i < acqScores.length - 1 && <ArrowRight size={10} className="inline mx-1 text-slate-400"/>}
                                        </span>
                                    ))}
                                </div>
                            )}
                             {cactScores.length > 0 && (
                                <div>
                                    <span className="font-medium text-violet-700">cACT: </span>
                                    {cactScores.map((res, i) => (
                                        <span key={i} className="inline-block mr-2">
                                            {res.score}
                                            {i < cactScores.length - 1 && <ArrowRight size={10} className="inline mx-1 text-slate-400"/>}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 italic">No previous scores recorded.</p>
                    )}
                </div>

                {/* Column 3: Last Treatment Plan */}
                <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                        <Calendar size={14} className="mr-1"/> Last Consultation
                    </h4>
                    <div className="text-sm text-slate-700">
                        <p><span className="font-medium">Date:</span> {new Date(lastConsultation.date).toLocaleDateString()}</p>
                        {patientData.ageGroup === 'adult' && lastData.adult_currentGinaStep && (
                            <p><span className="font-medium">Plan:</span> GINA Step {lastData.adult_currentGinaStep} (Pathway {lastData.adult_pathway === 'pathway1' ? '1' : '2'})</p>
                        )}
                        {patientData.ageGroup === 'child' && lastData.child_currentGinaStep && (
                            <p><span className="font-medium">Plan:</span> GINA Step {lastData.child_currentGinaStep}</p>
                        )}
                        {patientData.ageGroup === 'youngChild' && lastData.youngChild_currentGinaStep && (
                            <p><span className="font-medium">Plan:</span> GINA Step {lastData.youngChild_currentGinaStep}</p>
                        )}
                        
                        {/* Display Last Prescription */}
                        {lastPrescription.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-slate-200">
                                <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center">
                                    <Pill size={12} className="mr-1"/> Prescribed Meds:
                                </p>
                                <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                                    {lastPrescription.map(item => (
                                        <li key={item.id} className="truncate">
                                            <span className="font-medium">{item.medicationName}</span> <span className="text-slate-400">- {item.instructions}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FollowUpContext;
