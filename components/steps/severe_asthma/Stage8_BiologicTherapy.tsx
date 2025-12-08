import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { usePatientRecords } from '../../../contexts/PatientRecordsContext';
import AssessmentCard from './AssessmentCard';
import Button from '../../ui/Button';
import { Heart, HelpCircle, CheckCircle2, XCircle, ArrowRight, ChevronRight, RotateCcw, Save, Calendar, Syringe, Pill, ClipboardList, AlertTriangle } from '../../../constants/icons';
import PrescriptionWriter from '../../common/PrescriptionWriter';
import { PrescriptionItem } from '../../../types';
import { biologicOptions } from '../../../constants/severeAsthmaData';

type ResponseType = 'good' | 'unclear' | 'no' | null;

export default function Stage8_BiologicTherapy() {
    const { navigateTo } = useNavigation();
    const { patientData, updatePatientData } = usePatientData();
    const { saveConsultation, updateConsultation } = usePatientRecords();
    
    const { selectedBiologic, status, optimizationPlan } = patientData.severeAsthma;
    
    const [response, setResponse] = useState<ResponseType>(null);
    const [extendedResponse, setExtendedResponse] = useState<ResponseType>(null);
    const [trialStartDate, setTrialStartDate] = useState('');
    const [reviewDate, setReviewDate] = useState('');
    
    // LOGIC: Determine Mode based on Status
    const isEvaluationMode = status === 'biologic_trial' || status === 'confirmed_severe';

    // LOGIC: Detect previous biologic failures
    const priorBiologicTrialsCount = useMemo(() => {
        if (!optimizationPlan?.interventions) return 0;
        return optimizationPlan.interventions.filter(i => 
            i.includes("Biologic Trial") || i.includes("Initiated Biologic")
        ).length;
    }, [optimizationPlan]);

    const isSecondFailure = priorBiologicTrialsCount >= 2;

    // --- INITIATION LOGIC ---
    useEffect(() => {
        if (!isEvaluationMode && selectedBiologic) {
            const today = new Date().toISOString().split('T')[0];
            if (!trialStartDate) setTrialStartDate(today);
            
            if (!reviewDate) {
                const d = new Date();
                d.setMonth(d.getMonth() + 4);
                setReviewDate(d.toISOString().split('T')[0]);
            }
            
            // Pre-fill Prescription Writer
            const drugNameClean = selectedBiologic.split(' (')[0]; 
            const drugInfo = biologicOptions.find(b => b.name.includes(drugNameClean));

            if (drugInfo) {
                 const exists = patientData.currentPrescription.some(p => p.medicationName.includes(drugNameClean));
                 if (!exists) {
                    const newItem: PrescriptionItem = {
                        id: crypto.randomUUID(),
                        medicationId: 'bio-' + crypto.randomUUID(),
                        medicationName: selectedBiologic,
                        instructions: drugInfo.administration || 'SC Injection',
                        duration: '4 months (Trial)'
                    };
                    updatePatientData({
                        currentPrescription: [...patientData.currentPrescription, newItem]
                    });
                 }
            }
        }
    }, [isEvaluationMode, selectedBiologic]);

    const handleSaveAndInitiate = () => {
        const updatedData = {
            ...patientData,
            severeAsthma: {
                ...patientData.severeAsthma,
                status: 'biologic_trial' as const, 
                optimizationPlan: {
                    ...patientData.severeAsthma.optimizationPlan,
                    dateInitiated: trialStartDate,
                    // Append this new trial to history
                    interventions: [...(patientData.severeAsthma.optimizationPlan?.interventions || []), `Biologic Trial Initiated: ${selectedBiologic}`]
                } as any
            },
            adult_reviewReminderDate: reviewDate
        };
        
        updatePatientData(updatedData);

        if (patientData.activePatientId) {
             if (patientData.activeConsultationId) {
                updateConsultation(patientData.activePatientId, patientData.activeConsultationId, updatedData);
            } else {
                saveConsultation(patientData.activePatientId, updatedData);
            }
            navigateTo('PATIENT_DASHBOARD');
        } else {
             updatePatientData({
                 severeAsthma: { ...patientData.severeAsthma, status: 'biologic_trial' }
             });
        }
    };

    // --- EVALUATION LOGIC ---

    const handleResponseSelection = (res: ResponseType) => {
        setResponse(res);
        setExtendedResponse(null);
    };

    const handleConfirmGoodResponse = () => {
         const updatedData = {
            ...patientData,
            severeAsthma: {
                ...patientData.severeAsthma,
                status: 'confirmed_severe' as const,
                biologicResponse: 'good' as const
            }
        };
        updatePatientData(updatedData);
        navigateTo('SEVERE_ASTHMA_STAGE_9');
    };
    
    const handlePartialResponse = () => {
         const updatedData = {
            ...patientData,
            severeAsthma: {
                ...patientData.severeAsthma,
                biologicResponse: 'partial' as const
            }
        };
        updatePatientData(updatedData);
        navigateTo('SEVERE_ASTHMA_STAGE_9');
    };

    const handleNoResponse_Stop = () => {
         const updatedData = {
            ...patientData,
            severeAsthma: {
                ...patientData.severeAsthma,
                status: 'biologic_failure' as const, // Updated to specific failure status
                biologicResponse: 'no' as const
            }
        };
        updatePatientData(updatedData);
        navigateTo('SEVERE_ASTHMA_STAGE_9');
    };

    const handleNoResponse_Switch = () => {
        const updatedData = {
            ...patientData,
            severeAsthma: {
                ...patientData.severeAsthma,
                status: 'screening' as const, // Reset to allow selection
                selectedBiologic: undefined 
            }
        };
        updatePatientData(updatedData);
        navigateTo('SEVERE_ASTHMA_STAGE_7'); 
    };


    // --- RENDER: INITIATION VIEW ---
    if (!isEvaluationMode) {
        return (
             <AssessmentCard title={`Initiate Biologic Therapy: ${selectedBiologic || 'Selected Agent'}`} icon={<Syringe className="text-indigo-600"/>}>
                <div className="mb-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg">
                    <h4 className="font-bold text-indigo-900 mb-1">Therapeutic Trial Protocol</h4>
                    <p className="text-sm text-indigo-800">
                        You are about to initiate a biologic trial. The recommended duration is at least <strong>4 months</strong> to adequately assess response.
                    </p>
                </div>

                <div className="mb-6">
                    <h4 className="font-semibold text-slate-700 mb-3 flex items-center"><Pill size={18} className="mr-2 text-emerald-600"/> Prescription</h4>
                    <p className="text-xs text-slate-500 mb-3">The selected biologic has been automatically added below. Please add or adjust other maintenance medications (e.g. ICS-LABA).</p>
                    <PrescriptionWriter />
                </div>
                
                <div className="mb-6 p-5 bg-slate-50 border border-slate-200 rounded-lg">
                     <h4 className="font-semibold text-slate-700 mb-4 flex items-center"><Calendar size={18} className="mr-2 text-sky-600"/> Schedule Review Appointment</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Trial Start Date</label>
                            <input type="date" className="w-full p-2 border border-slate-300 rounded text-sm" value={trialStartDate} onChange={(e) => setTrialStartDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Review Date (4 Months)</label>
                            <input type="date" className="w-full p-2 border border-slate-300 rounded text-sm" value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} />
                        </div>
                     </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200">
                    <Button 
                        onClick={handleSaveAndInitiate} 
                        size="lg" 
                        variant="primary" 
                        rightIcon={<Save size={18}/>}
                        className="shadow-lg"
                    >
                        Save Prescription & Initiate Trial
                    </Button>
                </div>
            </AssessmentCard>
        );
    }

    // --- RENDER: EVALUATION VIEW ---
    return (
        <div>
            <AssessmentCard title="Biologic Therapy Response Evaluation" icon={<Heart />}>
                <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start">
                         <ClipboardList size={20} className="text-slate-500 mr-3 mt-1"/>
                         <div>
                             <h4 className="font-semibold text-slate-800">Trial Context</h4>
                             <p className="text-sm text-slate-600">
                                 Patient has been on <strong>{selectedBiologic}</strong> since {new Date(optimizationPlan?.dateInitiated || '').toLocaleDateString()}.
                                 <br/>Current duration: ~4 months.
                             </p>
                         </div>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <h4 className="font-bold text-slate-800">Assess Response to Treatment:</h4>
                    <p className="text-sm text-slate-600">Compare current status to baseline. Look for:</p>
                    <ul className="list-disc list-inside text-sm text-slate-600 ml-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                        <li>Reduced exacerbation frequency</li>
                        <li>Improved symptom control (ACT/ACQ)</li>
                        <li>Reduced OCS dose</li>
                        <li>Improved lung function</li>
                    </ul>
                </div>

                <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm mb-6">
                    <h4 className="font-medium text-center text-slate-800 mb-4 text-lg">How would you classify the response?</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button 
                            onClick={() => handleResponseSelection('good')} 
                            variant={response === 'good' ? 'success' : 'secondary'} 
                            className="h-auto py-4 flex flex-col items-center text-center"
                        >
                            <CheckCircle2 size={28} className="mb-2"/>
                            <span className="font-bold">Good Response</span>
                            <span className="text-xs font-normal mt-1 opacity-80">Clear improvement</span>
                        </Button>
                        <Button 
                            onClick={() => handleResponseSelection('unclear')} 
                            variant={response === 'unclear' ? 'warning' : 'secondary'}
                            className="h-auto py-4 flex flex-col items-center text-center"
                        >
                            <HelpCircle size={28} className="mb-2"/>
                            <span className="font-bold">Unclear / Partial</span>
                            <span className="text-xs font-normal mt-1 opacity-80">Some benefit, not optimal</span>
                        </Button>
                        <Button 
                            onClick={() => handleResponseSelection('no')} 
                            variant={response === 'no' ? 'danger' : 'secondary'}
                            className="h-auto py-4 flex flex-col items-center text-center"
                        >
                            <XCircle size={28} className="mb-2"/>
                            <span className="font-bold">No Response</span>
                            <span className="text-xs font-normal mt-1 opacity-80">No clear benefit</span>
                        </Button>
                    </div>
                </div>

                <div className="mt-6">
                    {response === 'good' && (
                        <div className="p-5 bg-green-50 border-l-4 border-green-500 rounded-r-md animate-fade-in">
                            <h4 className="font-bold text-green-800 mb-2 text-lg">Outcome: Continue Therapy</h4>
                            <p className="text-sm text-green-700 mb-4">
                                The patient has responded well. The diagnosis of <strong>Severe Asthma</strong> responsive to Type 2 therapy is confirmed.
                            </p>
                            <Button onClick={handleConfirmGoodResponse} rightIcon={<ChevronRight/>} variant="success" size="lg">
                                Confirm & Go to Monitoring (Stage 9)
                            </Button>
                        </div>
                    )}

                    {response === 'no' && (
                         <div className="p-5 bg-red-50 border-l-4 border-red-500 rounded-r-md animate-fade-in">
                            <h4 className="font-bold text-red-800 mb-2 text-lg">Outcome: Stop & Switch</h4>
                            
                            {isSecondFailure ? (
                                // SECOND FAILURE SCENARIO
                                <>
                                     <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded text-sm text-red-800 font-medium flex items-start">
                                        <AlertTriangle size={20} className="mr-2 mt-0.5 flex-shrink-0"/>
                                        Multiple biologic failures detected. GINA recommends stopping biologic therapy and focusing on optimized standard care.
                                    </div>
                                    <p className="text-sm text-red-700 mb-4">
                                        Stop the current biologic. Do not switch again immediately without specialized re-evaluation.
                                    </p>
                                    <Button onClick={handleNoResponse_Stop} variant="danger" rightIcon={<ArrowRight/>} fullWidth>
                                        Stop Biologics & Continue Other Care (Stage 9)
                                    </Button>
                                </>
                            ) : (
                                // FIRST FAILURE SCENARIO
                                <>
                                    <p className="text-sm text-red-700 mb-4">
                                        If there is no good response after 4 months, stop the current biologic. Re-evaluate phenotype or consider switching to a different class.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button onClick={handleNoResponse_Switch} variant="warning" leftIcon={<RotateCcw/>} fullWidth justify="start">
                                            Option 1: Switch to Different Biologic (Return to Stage 7)
                                        </Button>
                                        <Button onClick={handleNoResponse_Stop} variant="danger" rightIcon={<ArrowRight/>} fullWidth justify="start">
                                            Option 2: Stop Biologic & Reassess (Go to Stage 9)
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {response === 'unclear' && (
                        <div className="p-5 bg-amber-50 border-l-4 border-amber-500 rounded-r-md animate-fade-in">
                            <h4 className="font-bold text-amber-800 mb-2 text-lg">Outcome: Extend Trial</h4>
                            <p className="text-sm text-amber-700 mb-4">
                                If response is partial, it is recommended to extend the trial to 6-12 months before deciding to stop.
                            </p>
                            <Button onClick={handlePartialResponse} variant="warning" rightIcon={<ArrowRight/>}>
                                Extend Trial (Go to Stage 9 for Plan)
                            </Button>
                        </div>
                    )}
                </div>
            </AssessmentCard>
        </div>
    );
};