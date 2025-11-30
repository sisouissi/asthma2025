import React, { useState } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import AssessmentCard from './AssessmentCard';
import Button from '../../ui/Button';
import { Calendar, CheckCircle2, AlertTriangle, ListChecks, ArrowRight, Square, CheckSquare, History, XCircle, Pill, Activity, ClipboardList, HelpCircle, ChevronRight } from '../../../constants/icons';

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
    const { optimizationPlan, status, basicInfo } = patientData.severeAsthma;
    const { currentPrescription } = patientData;

    const [answers, setAnswers] = useState<ControlAnswers>({});
    const [controlResult, setControlResult] = useState<'controlled' | 'uncontrolled' | null>(null);
    const [stepDownResult, setStepDownResult] = useState<'yes' | 'no' | null>(null);

    const handleAnswer = (id: string, value: boolean) => {
        setAnswers(prev => ({...prev, [id]: value}));
        setControlResult(null); 
        setStepDownResult(null);
    };
    
    const handleStepDownAnswer = (value: 'yes' | 'no') => {
        setStepDownResult(value);
    };

    const allAnswered = questions.every(q => answers[q.id] !== undefined && answers[q.id] !== null);

    const assessControl = () => {
        const isUncontrolled = Object.values(answers).some(answer => answer === true);
        setControlResult(isUncontrolled ? 'uncontrolled' : 'controlled');
    };

    const updateStatus = (newStatus: 'confirmed_severe' | 'rejected_severe') => {
        updatePatientData({
            severeAsthma: {
                ...patientData.severeAsthma,
                status: newStatus
            }
        });
        
        if (newStatus === 'confirmed_severe') {
            if (status === 'addressing_factors') {
                navigateTo('SEVERE_ASTHMA_STAGE_6');
            } else {
                navigateTo('SEVERE_ASTHMA_STAGE_5');
            }
        } else {
            // Rejected / Difficult-to-treat -> Exit
            navigateTo('SEVERE_ASTHMA_STAGE_3'); 
        }
    };

    const isAddressingFactors = status === 'addressing_factors';

    return (
        <div>
            {/* ENHANCED Context from Previous Visit */}
            {(status === 'optimizing' || isAddressingFactors) && optimizationPlan && (
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
                        {/* Column 1: Interventions & Baseline */}
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
                                    <Activity size={14} className="mr-1.5"/> Baseline Status (Pre-Trial)
                                </h5>
                                <div className="bg-white p-3 rounded-md border border-slate-200 text-sm text-slate-700 grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-slate-500 text-xs block">Exacerbations (Year)</span>
                                        <span className="font-medium">{basicInfo.exacerbationsLastYear || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 text-xs block">SABA Use (Cans/Year)</span>
                                        <span className="font-medium">{basicInfo.sabaUse || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Prescribed Treatment */}
                        <div>
                            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                                <Pill size={14} className="mr-1.5"/> Optimization Treatment Prescribed
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
                            ) : (
                                <p className="text-sm italic text-slate-500 bg-white p-3 rounded-md border border-slate-200">
                                    No specific prescription data recorded for this trial.
                                </p>
                            )}
                            
                            <div className="mt-4 bg-blue-50 p-3 rounded-md text-xs text-blue-800 border border-blue-100">
                                <strong>Decision Guide:</strong> If the patient has remained uncontrolled despite the interventions and high-dose treatment listed here, the diagnosis of <em>Severe Asthma</em> is confirmed.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <AssessmentCard title={isAddressingFactors ? "Review After Specialist Intervention" : "Review Response"} icon={<Calendar />}>
                
                {/* Review Checklist */}
                <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <h4 className="font-semibold text-indigo-900 mb-2 flex items-center">
                        <ListChecks size={18} className="mr-2"/>
                        Review Checklist
                    </h4>
                    <p className="text-sm text-indigo-800 mb-2">When assessing the response to treatment, specifically review:</p>
                    <ul className="list-disc list-inside text-sm text-indigo-700 grid grid-cols-1 md:grid-cols-2 gap-1">
                        {reviewChecklist.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>

                {!controlResult && (
                    <>
                        <h4 className="text-md font-bold text-slate-800 mb-3">Q1: Is asthma still uncontrolled, despite optimized therapy?</h4>
                        <p className="text-sm text-slate-600 mb-4">
                            Assess control based on the last 4 weeks:
                        </p>

                        <div className="space-y-3">
                            {questions.map(q => (
                                <div key={q.id} className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-center">
                                    <p className="font-medium text-slate-700 text-sm mr-4">{q.text}</p>
                                    <div className="flex space-x-2 flex-shrink-0">
                                    <Button
                                        onClick={() => handleAnswer(q.id, true)}
                                        variant={answers[q.id] === true ? 'warning' : 'secondary'}
                                        size="sm"
                                        leftIcon={answers[q.id] === true ? <CheckSquare size={16}/> : <Square size={16}/>}
                                    >Yes</Button>
                                    <Button
                                        onClick={() => handleAnswer(q.id, false)}
                                        variant={answers[q.id] === false ? 'success' : 'secondary'}
                                        size="sm"
                                        leftIcon={answers[q.id] === false ? <CheckSquare size={16}/> : <Square size={16}/>}
                                    >No</Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 border-t border-slate-200 pt-5">
                            <Button 
                                onClick={assessControl} 
                                disabled={!allAnswered} 
                                fullWidth 
                                size="lg" 
                                leftIcon={<Activity/>}
                            >
                                Determine Control Status
                            </Button>
                        </div>
                    </>
                )}

                {/* RESULT: YES (Uncontrolled) */}
                {controlResult === 'uncontrolled' && (
                    <div className="mt-4 p-5 bg-red-50 border-l-4 border-red-500 rounded-r-md">
                        <h4 className="font-bold text-red-800 flex items-center mb-2 text-lg">
                            <XCircle size={24} className="mr-2"/>
                            YES: Asthma is still uncontrolled
                        </h4>
                        <p className="text-sm text-red-700 mb-4">
                            Since asthma is still uncontrolled despite optimized therapy, the diagnosis of <strong>Severe Asthma</strong> is likely.
                        </p>
                        <p className="text-sm text-red-700 mb-4 font-semibold">
                            Action: If not done by now, refer the patient to a specialist or severe asthma clinic if possible.
                        </p>
                        <Button 
                            onClick={() => updateStatus('confirmed_severe')} 
                            variant="danger"
                            rightIcon={<ChevronRight />}
                            size="lg"
                        >
                            Confirm Severe Asthma & Proceed
                        </Button>
                    </div>
                )}
                
                {/* RESULT: NO (Controlled) -> Ask Question 2 */}
                {controlResult === 'controlled' && (
                    <div className="mt-4 p-5 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-md animate-fade-in">
                        <h4 className="font-bold text-emerald-800 flex items-center mb-2 text-lg">
                            <CheckCircle2 size={24} className="mr-2"/>
                            NO: Asthma is now well controlled
                        </h4>
                        <div className="text-sm text-emerald-700 space-y-2 mb-6">
                            <p>Consider stepping down treatment. Recommended order:</p>
                            <ol className="list-decimal list-inside pl-2 space-y-1 font-medium">
                                <li>Decrease/cease OCS first (if used) - check for adrenal insufficiency.</li>
                                <li>Remove other add-on therapy.</li>
                                <li>Decrease ICS dose (do not stop ICS).</li>
                            </ol>
                            <p className="text-xs text-emerald-600 mt-2">See GINA Box 4-13 (p.102) for how to gradually down-titrate.</p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-emerald-200">
                             <h4 className="font-bold text-slate-800 flex items-center mb-3 text-md">
                                <HelpCircle size={20} className="mr-2 text-sky-600"/>
                                Q2: Does asthma become uncontrolled when treatment is stepped down?
                            </h4>
                            
                            {!stepDownResult && (
                               <div className="flex gap-4 mt-4">
                                   <Button onClick={() => handleStepDownAnswer('yes')} variant="warning" size="lg" className="flex-1">
                                       YES (Loss of Control)
                                   </Button>
                                   <Button onClick={() => handleStepDownAnswer('no')} variant="success" size="lg" className="flex-1">
                                       NO (Remains Controlled)
                                   </Button>
                               </div>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Q2 RESULT: YES (Loss of Control) */}
                {stepDownResult === 'yes' && (
                    <div className="mt-4 p-5 bg-amber-50 border-l-4 border-amber-500 rounded-r-md">
                        <h4 className="font-bold text-amber-800 flex items-center mb-2 text-lg">
                            <AlertTriangle size={24} className="mr-2"/>
                            YES: Uncontrolled on Step-Down
                        </h4>
                        <p className="text-sm text-amber-700 mb-4">
                            If asthma symptoms become uncontrolled or an exacerbation occurs when high-dose treatment is stepped down, the diagnosis of <strong>Severe Asthma</strong> is likely.
                        </p>
                         <ul className="text-sm text-amber-800 list-disc list-inside mb-4 font-medium">
                             <li>Restore the patient's previous dose to regain good asthma control.</li>
                             <li>Refer to a specialist or severe asthma clinic if not done already.</li>
                         </ul>
                         <Button 
                            onClick={() => updateStatus('confirmed_severe')} 
                            variant="warning"
                            rightIcon={<ChevronRight />}
                            size="lg"
                        >
                            Confirm Severe Asthma & Proceed
                        </Button>
                    </div>
                )}

                {/* Q2 RESULT: NO (Remains Controlled) */}
                {stepDownResult === 'no' && (
                     <div className="mt-4 p-5 bg-sky-50 border-l-4 border-sky-500 rounded-r-md">
                        <h4 className="font-bold text-sky-800 flex items-center mb-2 text-lg">
                            <CheckCircle2 size={24} className="mr-2"/>
                            NO: Remains Controlled
                        </h4>
                        <p className="text-sm text-sky-700 mb-4">
                            If symptoms and exacerbations remain well controlled despite treatment being stepped down, the patient does <strong>not</strong> have severe asthma.
                        </p>
                        <p className="text-sm text-sky-800 font-semibold mb-4">
                            Action: Continue optimizing management and consider further step-down if appropriate.
                        </p>
                         <Button 
                            onClick={() => updateStatus('rejected_severe')} 
                            variant="primary"
                            rightIcon={<ArrowRight />}
                            size="lg"
                        >
                            Exit Severe Pathway & Continue Care
                        </Button>
                    </div>
                )}
            </AssessmentCard>
        </div>
    );
};

export default Stage4_ReviewResponse;