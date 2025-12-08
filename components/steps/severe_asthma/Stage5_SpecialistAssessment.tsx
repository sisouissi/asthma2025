import React, { useCallback, useState } from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientRecords } from '../../../contexts/PatientRecordsContext';
import AssessmentCard from './AssessmentCard';
import Button from '../../ui/Button';
import { Stethoscope, User, Square, CheckSquare, AlertTriangle, Calendar, Save, ChevronRight, Microscope, Scan, HeartPulse, Users, Activity } from '../../../constants/icons';
import PrescriptionWriter from '../../common/PrescriptionWriter';

const Stage5_SpecialistAssessment: React.FC = () => {
    const { patientData, updatePatientData } = usePatientData();
    const { navigateTo } = useNavigation();
    const { saveConsultation, updateConsultation } = usePatientRecords();
    const [showTreatmentPlan, setShowTreatmentPlan] = useState(false);
    const [followUpDate, setFollowUpDate] = useState('');
    const [comorbidityPlan, setComorbidityPlan] = useState('');
    
    const updateInvestigation = useCallback((key: string, value: boolean) => {
        const updates = {
            ...patientData,
            severeAsthma: {
                ...patientData.severeAsthma,
                investigations: {
                    ...patientData.severeAsthma.investigations,
                    [key]: value,
                }
            }
        };
        updatePatientData(updates);
    }, [patientData, updatePatientData]);

    const handleSaveAndTreat = () => {
        const updatedData = {
            ...patientData,
            severeAsthma: {
                ...patientData.severeAsthma,
                status: 'addressing_factors' as const,
                optimizationPlan: {
                    dateInitiated: new Date().toISOString(),
                    interventions: ["Specialist treatment of comorbidities/factors (Stage 5)"], 
                    followUpDate: followUpDate || null,
                    comorbidityPlan: comorbidityPlan 
                }
            },
            // Explicitly set reminder for dashboard
            adult_reviewReminderDate: followUpDate || null
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
             navigateTo('SEVERE_ASTHMA_STAGE_4');
        }
    };

    const investigationChecklist = [
        { 
            title: "Imaging & Structure",
            icon: <Scan size={18} className="text-indigo-600"/>,
            items: [
                { key: 'chestXray', label: 'Chest X-ray or High Resolution CT (HRCT)' },
                { key: 'boneDensity', label: 'Bone Density Scan (DEXA) - if OCS/high-dose ICS risk' },
                { key: 'cardiacAssessment', label: 'Cardiac Assessment (Echocardiogram) if indicated' }
            ]
        },
        {
            title: "Allergy & Immunology",
            icon: <Microscope size={18} className="text-emerald-600"/>,
            items: [
                 { key: 'allergyTesting', label: 'Skin Prick Test or Specific IgE (if not already done)' },
                 { key: 'parasiteScreen', label: 'Parasite Screen (Strongyloides) - Mandatory if Eos ≥300/µL' },
                 { key: 'adrenalFunction', label: 'Morning Serum Cortisol (Adrenal Insufficiency check)' }
            ]
        }
    ];

    const differentialDiagnoses = [
      "CRSwNP (Chronic Rhinosinusitis w/ Nasal Polyps)",
      "AERD (Aspirin-Exacerbated Respiratory Disease)",
      "ABPA (Allergic Bronchopulmonary Aspergillosis)",
      "Inducible Laryngeal Obstruction (ILO / VCD)",
      "Obstructive Sleep Apnea (OSA)",
      "Bronchiectasis / Tracheobronchomalacia",
      "Infection (TB, NTM/MAC)",
      "EGPA (Consider if Eos ≥1500/µL)",
      "Cardiac Failure / Pulmonary Embolism"
    ];

    return (
        <div>
            <div className="mb-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg">
                <h3 className="font-bold text-indigo-800 flex items-center text-lg mb-2">
                    <Stethoscope className="mr-2" />
                    5. Specialist Assessment & Further Investigation
                </h3>
                <p className="text-sm text-indigo-700 leading-relaxed">
                    Confirm diagnosis by excluding mimics. Identify and treat specific comorbidities.
                    Ideally performed in a multidisciplinary severe asthma clinic.
                </p>
            </div>

            <AssessmentCard title="Diagnostic Investigations" icon={<Activity />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {investigationChecklist.map((section) => (
                        <div key={section.title}>
                            <h6 className="font-semibold text-slate-700 mb-3 flex items-center text-sm">
                                {section.icon}
                                <span className="ml-2">{section.title}</span>
                            </h6>
                            <div className="space-y-2">
                                {section.items.map(item => (
                                    <label 
                                        key={item.key} 
                                        className="flex items-start text-sm cursor-pointer p-2 hover:bg-slate-50 rounded transition-colors"
                                        onClick={() => updateInvestigation(item.key, !patientData.severeAsthma.investigations[item.key as keyof typeof patientData.severeAsthma.investigations])}
                                    >
                                        <div className="mt-0.5 mr-3">
                                             {patientData.severeAsthma.investigations[item.key as keyof typeof patientData.severeAsthma.investigations] 
                                                ? <CheckSquare size={18} className="text-indigo-600" /> 
                                                : <Square size={18} className="text-slate-400" />
                                             }
                                        </div>
                                        <span className="text-slate-700">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                 <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h6 className="font-bold text-yellow-800 mb-2 text-sm flex items-center">
                        <AlertTriangle size={16} className="mr-2"/> Critical Eosinophil Thresholds:
                    </h6>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-yellow-800">
                        <div className="bg-yellow-100 p-2 rounded">
                             <strong>Blood Eos ≥ 300/µL:</strong><br/>
                             Screen for parasites (e.g. Strongyloides). <em className="text-xs block mt-1">Risk of disseminated disease with OCS/biologics if untreated.</em>
                        </div>
                        <div className="bg-yellow-100 p-2 rounded">
                             <strong>Blood Eos ≥ 1500/µL:</strong><br/>
                             Consider EGPA (Eosinophilic Granulomatosis with Polyangiitis) or other hypereosinophilic syndromes.
                        </div>
                    </div>
                </div>
            </AssessmentCard>

            <AssessmentCard title="Differentials & Comorbidities to Exclude" icon={<HeartPulse />}>
                 <p className="text-sm text-slate-600 mb-4">
                    Before confirming severe asthma, actively investigate and treat these conditions based on clinical suspicion:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {differentialDiagnoses.map(dx => (
                        <div key={dx} className="text-xs bg-slate-50 border border-slate-200 p-2 rounded text-slate-700 font-medium">
                            {dx}
                        </div>
                    ))}
                </div>
            </AssessmentCard>
            
             <div className="mt-6">
                <AssessmentCard title="Assessment Outcome & Decision" icon={<AlertTriangle className="text-amber-600"/>}>
                    {!showTreatmentPlan ? (
                        <>
                            <p className="text-sm text-slate-700 mb-6 text-center font-medium">
                                Have significant comorbidities or alternative diagnoses been identified that require treatment <br/> 
                                <em>before</em> confirming severe asthma and proceeding to phenotyping?
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <Button
                                    onClick={() => setShowTreatmentPlan(true)}
                                    variant="warning"
                                    size="lg"
                                    className="w-full sm:w-auto"
                                >
                                    Yes, Treat Factors First
                                </Button>
                                <Button
                                    onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_6')}
                                    variant="success"
                                    size="lg"
                                    rightIcon={<ChevronRight />}
                                    className="w-full sm:w-auto"
                                >
                                    No, Confirm Severe Asthma
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="animate-fade-in">
                            <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-md mb-6">
                                <h4 className="font-bold text-amber-800 mb-2">Comorbidity Management Plan</h4>
                                <textarea 
                                    className="w-full p-2 border border-amber-300 rounded-md text-sm text-slate-800 focus:ring-2 focus:ring-amber-500"
                                    rows={3}
                                    placeholder="Describe interventions (e.g., 'Initiating nasal steroids for CRSwNP', 'Referral to ENT', 'PPI trial for GERD')..."
                                    value={comorbidityPlan}
                                    onChange={(e) => setComorbidityPlan(e.target.value)}
                                />
                            </div>
                            
                            <PrescriptionWriter />

                            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    <div className="flex items-center text-slate-700 font-medium whitespace-nowrap">
                                        <Calendar size={20} className="mr-2 text-indigo-600"/>
                                        Review Date:
                                    </div>
                                    <input 
                                        type="date" 
                                        className="p-2 border border-slate-300 rounded-md text-sm w-full sm:w-auto"
                                        value={followUpDate}
                                        onChange={(e) => setFollowUpDate(e.target.value)}
                                    />
                                     <span className="text-xs text-slate-500">(Recommended: 1 month)</span>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between items-center">
                                <Button onClick={() => setShowTreatmentPlan(false)} variant="ghost">Cancel</Button>
                                <Button 
                                    onClick={handleSaveAndTreat} 
                                    variant="primary" 
                                    size="lg"
                                    leftIcon={<Save size={18}/>}
                                >
                                    Save & Treat Comorbidities
                                </Button>
                            </div>
                        </div>
                    )}
                </AssessmentCard>
            </div>
        </div>
    );
};

export default Stage5_SpecialistAssessment;