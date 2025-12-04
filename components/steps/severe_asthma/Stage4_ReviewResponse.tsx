import React, { useState } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { usePatientRecords } from '../../../contexts/PatientRecordsContext';
import AssessmentCard from './AssessmentCard';
import Button from '../../ui/Button';
import { Calendar, CheckCircle2, AlertTriangle, ListChecks, ArrowRight, Square, CheckSquare, History, XCircle, Pill, Activity, ClipboardList, HelpCircle, ChevronRight, TrendingDown, ShieldCheck, Save } from '../../../constants/icons';
import PrescriptionWriter from '../../common/PrescriptionWriter';

interface ControlAnswers {
  [key: string]: boolean | null;
}

const questions = [
  { id: 'q1', text: 'In the past 4 weeks, has the patient had daytime symptoms more than twice a week?' },
  { id: 'q2', text: 'In the past 4 weeks, has the patient had any night waking due to asthma?' },
  { id: 'q3', text: 'In the past 4 weeks, has the patient needed SABA or ICS-formoterol for relief more than twice a week?' },
  { id: 'q4', text: 'In the past 4 weeks, has the patient had any activity limitation due to asthma?' },
];

const reviewChecklist = [
    "Symptom control (frequency, reliever use, night waking, activity)",
    "Exacerbations since previous visit and management",
    "Medication side-effects",
    "Inhaler technique and adherence",
    "Lung function",
    "Patient satisfaction and concerns"
];

const Stage4_ReviewResponse: React.FC = () => {
    const { navigateTo } = useNavigation();
    const { patientData, updatePatientData } = usePatientData();
    const { saveConsultation, updateConsultation } = usePatientRecords();
    const { optimizationPlan, status, basicInfo } = patientData.severeAsthma;
    const { currentPrescription } = patientData;

    const [answers, setAnswers] = useState<ControlAnswers>({});
    const [controlResult, setControlResult] = useState<'controlled' | 'uncontrolled' | null>(null);
    const [stepDownResult, setStepDownResult] = useState<'yes' | 'no' | null>(null);
    const [nextReviewDate, setNextReviewDate] = useState<string>('');


    const handleAnswer = (id: string, value: boolean) => {
        setAnswers(prev => ({...prev, [id]: value}));
        setControlResult(null); 
        setStepDownResult(null);
    };
    
    const handleStepDownAnswer = (value: 'yes' | 'no') => {
        setStepDownResult(value);
        // Set default next review date to 3 months from now if 'no' (controlled)
        if (value === 'no') {
            const d = new Date();
            d.setMonth(d.getMonth() + 3);
            setNextReviewDate(d.toISOString().split('T')[0]);
        }
    };

    const allAnswered = questions.every(q => answers[q.id] !== undefined && answers[q.id] !== null);

    const assessControl = () => {
        const isUncontrolled = Object.values(answers).some(answer => answer === true);
        setControlResult(isUncontrolled ? 'uncontrolled' : 'controlled');
    };

    const handleSaveAndExit = (newStatus: 'confirmed_severe' | 'rejected_severe' | 'controlled_on_optimization') => {
         const updatedData = {
            ...patientData,
            severeAsthma: {
                ...patientData.severeAsthma,
                status: newStatus
            },
            adult_reviewReminderDate: nextReviewDate || patientData.adult_reviewReminderDate
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
            navigateTo('SEVERE_ASTHMA_STAGE_3'); // Fallback for demo
         }
    };

    const updateStatus = (newStatus: 'confirmed_severe' | 'rejected_severe') => {
         updatePatientData({
            severeAsthma: {
                ...patientData.severeAsthma,
                status: newStatus
            }
        });
        if (newStatus === 'confirmed_severe') {
             if (status === 'addressing_factors') navigateTo('SEVERE_ASTHMA_STAGE_6');
             else navigateTo('SEVERE_ASTHMA_STAGE_5');
        } else {
            handleSaveAndExit('rejected_severe');
        }
    };
    
    const isAddressingFactors = status === 'addressing_factors';
    const wasControlledBefore = status === 'controlled_on_optimization';

    return (
        <div>
            {/* Context Display (Same as before) */}
            {(status === 'optimizing' || isAddressingFactors || wasControlledBefore) && optimizationPlan && (
                <div className="mb-8 p-5 bg-slate-50 border border-slate-300 rounded-xl shadow-sm">
                    <div className="flex items-center mb-4 pb-3 border-b border-slate-200">
                        <History size={24} className="text-indigo-600 mr-3"/>
                        <div>
                            <h4 className="font-bold text-slate-800 text-lg">
                                {isAddressingFactors ? 'Specialist Intervention Context' : 'Optimization Trial Context'}
                            </h4>
                            <p className="text-sm text-slate-500">
                                Reviewing outcome of plan initiated on: <span className="font-semibold text-slate-700">{new Date(optimizationPlan.dateInitiated).toLocaleDateString()}</span>
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                                    <ClipboardList size={14} className="mr-1.5"/> Interventions Implemented
                                </h5>
                                {optimizationPlan.interventions.length > 0 ? (
                                    <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 bg-white p-3 rounded-md border border-slate-200">
                                        {optimizationPlan.interventions.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                ) : <p className="text-sm italic text-slate-400">No specific interventions recorded.</p>}
                            </div>
                             <div>
                                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                                    <Activity size={14} className="mr-1.5"/> Baseline Status
                                </h5>
                                <div className="bg-white p-3 rounded-md border border-slate-200 text-sm text-slate-700 grid grid-cols-2 gap-2">
                                    <div><span className="text-slate-500 text-xs block">Exacerbations (Year)</span><span className="font-medium">{basicInfo.exacerbationsLastYear || 'N/A'}</span></div>
                                    <div><span className="text-slate-500 text-xs block">SABA Use (Cans/Year)</span><span className="font-medium">{basicInfo.sabaUse || 'N/A'}</span></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                                <Pill size={14} className="mr-1.5"/> Optimization Treatment
                            </h5>
                            {currentPrescription && currentPrescription.length > 0 ? (
                                <div className="bg-white p-3 rounded-md border border-slate-200 space-y-2">
                                    {currentPrescription.map((med) => (
                                        <div key={med.id} className="pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                                            <p className="font-semibold text-indigo-700 text-sm">{med.medicationName}</p>
                                            <p className="text-xs text-slate-600">{med.instructions} &bull; {med.duration}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-sm italic text-slate-500 bg-white p-3 rounded-md border border-slate-200">No prescription data recorded.</p>}
                        </div>
                    </div>
                </div>
            )}

            <AssessmentCard title={isAddressingFactors ? "Review After Specialist Intervention" : "Review Response"} icon={<Calendar />}>
                 {/* Review Checklist */}
                <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <h4 className="font-semibold text-indigo-900 mb-2 flex items-center"><ListChecks size={18} className="mr-2"/>Review Checklist</h4>
                    <ul className="list-disc list-inside text-sm text-indigo-700 grid grid-cols-1 md:grid-cols-2 gap-1">
                        {reviewChecklist.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>

                {!controlResult && (
                    <>
                        <h4 className="text-md font-bold text-slate-800 mb-3">Q1: Is asthma still uncontrolled, despite optimized therapy?</h4>
                        <div className="space-y-3">
                            {questions.map(q => (
                                <div key={q.id} className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-center">
                                    <p className="font-medium text-slate-700 text-sm mr-4">{q.text}</p>
                                    <div className="flex space-x-2 flex-shrink-0">
                                    <Button onClick={() => handleAnswer(q.id, true)} variant={answers[q.id] === true ? 'warning' : 'secondary'} size="sm" leftIcon={answers[q.id] === true ? <CheckSquare size={16}/> : <Square size={16}/>}>Yes</Button>
                                    <Button onClick={() => handleAnswer(q.id, false)} variant={answers[q.id] === false ? 'success' : 'secondary'} size="sm" leftIcon={answers[q.id] === false ? <CheckSquare size={16}/> : <Square size={16}/>}>No</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 border-t border-slate-200 pt-5">
                            <Button onClick={assessControl} disabled={!allAnswered} fullWidth size="lg" leftIcon={<Activity/>}>Determine Control Status</Button>
                        </div>
                    </>
                )}

                {/* UNCONTROLLED SCENARIOS */}
                {controlResult === 'uncontrolled' && (
                     <>
                        {wasControlledBefore ? (
                            // Patient was controlled, now failing -> Uncontrolled on Step-Down
                            <div className="mt-4 p-5 bg-amber-50 border-l-4 border-amber-500 rounded-r-md animate-fade-in">
                                <h4 className="font-bold text-amber-800 flex items-center mb-2 text-lg"><AlertTriangle size={24} className="mr-2"/>YES: Uncontrolled on Step-Down</h4>
                                <p className="text-sm text-amber-700 mb-4">The patient was controlled at the last visit but symptoms have returned after stepping down. This confirms the need for higher-dose therapy.</p>
                                <p className="text-sm text-amber-700 mb-4"><strong>Diagnosis: Severe Asthma is likely.</strong></p>
                                <ul className="text-sm text-amber-800 list-disc list-inside mb-4 font-medium">
                                    <li>Restore previous effective dose.</li>
                                    <li>Proceed to confirm severe asthma diagnosis.</li>
                                </ul>
                                <Button onClick={() => updateStatus('confirmed_severe')} variant="warning" rightIcon={<ChevronRight />} size="lg">Confirm Severe Asthma & Proceed</Button>
                            </div>
                        ) : (
                            // Standard failure to control
                            <div className="mt-4 p-5 bg-red-50 border-l-4 border-red-500 rounded-r-md animate-fade-in">
                                <h4 className="font-bold text-red-800 flex items-center mb-2 text-lg"><XCircle size={24} className="mr-2"/>YES: Asthma is still uncontrolled</h4>
                                <p className="text-sm text-red-700 mb-4">Since asthma is still uncontrolled despite optimized therapy, the diagnosis of <strong>Severe Asthma</strong> is likely.</p>
                                <p className="text-sm text-red-700 mb-4 font-semibold italic">
                                    "Severe asthma is asthma that is uncontrolled despite adherence to maximal optimized high-dose ICS-LABA treatment and management of contributory factors." (GINA 2025)
                                </p>
                                <Button onClick={() => updateStatus('confirmed_severe')} variant="danger" rightIcon={<ChevronRight />} size="lg">Confirm Severe Asthma & Proceed</Button>
                            </div>
                        )}
                     </>
                )}
                
                {/* CONTROLLED SCENARIO - Step Down Loop */}
                {controlResult === 'controlled' && (
                    <div className="mt-4 p-5 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-md animate-fade-in">
                        <h4 className="font-bold text-emerald-800 flex items-center mb-2 text-lg"><CheckCircle2 size={24} className="mr-2"/>NO: Asthma is now well controlled</h4>
                        
                         {isAddressingFactors ? (
                            // Coming from Specialist Factor Treatment -> Success -> Difficult to Treat Asthma
                            <>
                                <p className="text-sm text-emerald-700 mb-4">Symptoms improved after treating comorbidities/factors. This confirms <strong>"Difficult-to-Treat Asthma"</strong> (NOT Severe Asthma).</p>
                                <p className="text-xs text-emerald-600 mb-4 italic">Asthma is not classified as severe if it markedly improves when contributory factors such as inhaler technique and adherence are addressed.</p>
                                <div className="bg-white p-4 rounded-lg border border-emerald-200 mb-4">
                                    <h6 className="text-sm font-medium text-slate-700 mb-2">Prescribe Maintenance Treatment</h6>
                                    <PrescriptionWriter />
                                </div>
                                <Button onClick={() => updateStatus('rejected_severe')} variant="success" rightIcon={<Save />} size="lg" fullWidth>Save & Exit Severe Pathway</Button>
                            </>
                         ) : (
                            // Standard Optimization Success -> Monitoring Loop
                            <>
                                <div className="text-sm text-emerald-700 space-y-2 mb-6">
                                    <p>This indicates <strong>Difficult-to-Treat Asthma</strong> that is now managed, rather than Refractory Severe Asthma.</p>
                                    <p>Consider stepping down treatment to find the minimum effective dose. Do not stop ICS.</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-emerald-200 mb-4">
                                    <h6 className="text-sm font-medium text-slate-700 mb-2">Prescribe Step-Down Regimen</h6>
                                    <PrescriptionWriter />
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-emerald-200 mb-4">
                                    <h6 className="text-sm font-medium text-slate-700 mb-2">Schedule Step-Down Review</h6>
                                    <div className="flex items-center gap-4">
                                        <input type="date" className="p-2 border border-slate-300 rounded text-sm" value={nextReviewDate} onChange={(e) => setNextReviewDate(e.target.value)} />
                                        <span className="text-xs text-slate-500">(Recommended: 3 months)</span>
                                    </div>
                                </div>
                                <Button onClick={() => handleSaveAndExit('controlled_on_optimization')} variant="primary" rightIcon={<Save />} size="lg" fullWidth>Save & Monitor (3 Months)</Button>
                            </>
                         )}
                    </div>
                )}
            </AssessmentCard>
        </div>
    );
};

export default Stage4_ReviewResponse;