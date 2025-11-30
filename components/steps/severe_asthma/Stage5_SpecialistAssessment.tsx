
import React, { useCallback } from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { useNavigation } from '../../../contexts/NavigationContext';
import AssessmentCard from './AssessmentCard';
import Button from '../../ui/Button';
import { Stethoscope, User, Square, CheckSquare, AlertTriangle } from '../../../constants/icons';

const Stage5_SpecialistAssessment: React.FC = () => {
    const { patientData, updatePatientData } = usePatientData();
    const { navigateTo } = useNavigation();
    
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

    const investigationOptions = [
      { key: 'chestXray', label: 'Chest X-ray or HRCT' },
      { key: 'allergyTesting', label: 'Comprehensive allergy testing (skin prick/specific IgE)' },
      { key: 'boneDensity', label: 'Bone density scan (DEXA) - OCS risk' },
      { key: 'parasiteScreen', label: 'Parasite screen (if eosinophils are 300/μL or more)' },
      { key: 'cardiacAssessment', label: 'Cardiac assessment if indicated' }
    ];

    const differentialDiagnoses = [
      "ABPA (Allergic bronchopulmonary aspergillosis)",
      "AERD (Aspirin-exacerbated respiratory disease)",
      "Inducible laryngeal obstruction (ILO/VCD)",
      "Obstructive sleep apnea (OSA)",
      "Bronchiectasis",
      "Tracheobronchomalacia",
      "TB, MAC (Mycobacterium avium complex)",
      "EGPA (if hypereosinophilia >=1500/μL)",
    ];

    return (
        <div>
            <AssessmentCard title="Specialist Investigations & Assessments" icon={<Stethoscope />}>
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <h5 className="font-semibold text-blue-800 mb-2">Multidisciplinary Severe Asthma Clinic</h5>
                    <p className="text-sm text-blue-700">
                    Assessment should ideally involve a multidisciplinary team including certified asthma educators, speech pathology, ENT, and mental health professionals.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h6 className="font-medium mb-3">Diagnostic Investigations:</h6>
                        <div className="space-y-2">
                           {investigationOptions.map(item => (
                                <label 
                                    key={item.key} 
                                    className="flex items-center text-sm cursor-pointer"
                                    onClick={() => updateInvestigation(item.key, !patientData.severeAsthma.investigations[item.key as keyof typeof patientData.severeAsthma.investigations])}
                                >
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={patientData.severeAsthma.investigations[item.key as keyof typeof patientData.severeAsthma.investigations]}
                                    readOnly
                                />
                                {patientData.severeAsthma.investigations[item.key as keyof typeof patientData.severeAsthma.investigations] ? <CheckSquare size={20} className="text-sky-600 mr-2" /> : <Square size={20} className="text-slate-400 mr-2" />}
                                {item.label}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h6 className="font-medium mb-3">Differential Diagnoses to Exclude:</h6>
                        <ul className="text-sm space-y-1 list-disc list-inside">
                            {differentialDiagnoses.map(dx => <li key={dx}>{dx}</li>)}
                        </ul>
                    </div>
                </div>
                 <div className="mt-4 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                    <h6 className="font-semibold text-yellow-800 mb-2">Critical Screening Points:</h6>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <p><strong>{'Blood eosinophils >= 300/μL:'}</strong> Screen for parasites (e.g., Strongyloides serology).</p>
                      <p><strong>{'Hypereosinophilia >= 1500/μL:'}</strong> Consider EGPA and other systemic causes.</p>
                      <p className="text-xs mt-1">Parasitic infection + OCS/biologics could lead to disseminated disease.</p>
                    </div>
                </div>
            </AssessmentCard>
            
            <AssessmentCard title="Psychosocial Support & Research" icon={<User />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h6 className="font-medium mb-2">Psychosocial Support Needs:</h6>
                        <ul className="text-sm space-y-1 list-disc list-inside">
                            <li>Emotional burden of severe asthma</li>
                            <li>Anxiety and depression screening</li>
                            <li>Social and financial impact</li>
                            <li>Work and career limitations</li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="font-medium mb-2">Registry & Research:</h6>
                        <ul className="text-sm space-y-1 list-disc list-inside">
                            <li>Consider severe asthma registry enrollment</li>
                            <li>Assess for clinical trial eligibility</li>
                            <li>Contribute to real-world evidence</li>
                        </ul>
                    </div>
                </div>
            </AssessmentCard>
             <div className="mt-6">
                <AssessmentCard title="Multidisciplinary Assessment Outcome" icon={<AlertTriangle className="text-amber-600"/>}>
                    <p className="text-sm text-slate-700 mb-4 text-center">
                        Based on the comprehensive specialist assessment, were significant modifiable factors or alternative diagnoses identified that need to be addressed before proceeding to phenotype assessment?
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
                        <Button
                            onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_3')}
                            variant="warning"
                            size="lg"
                        >
                            Yes, Re-Optimize Management
                        </Button>
                        <Button
                            onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_6')}
                            variant="success"
                            size="lg"
                        >
                            No, Proceed to Phenotype
                        </Button>
                    </div>
                     <p className="text-xs text-slate-500 mt-4 text-center">
                        <strong>Yes:</strong> An alternative diagnosis was confirmed, or a major modifiable factor (e.g., severe untreated comorbidity, major adherence issue) was found that must be addressed first.
                        <br/>
                        <strong>No:</strong> The diagnosis of severe asthma is upheld, and no new major modifiable factors were identified.
                    </p>
                </AssessmentCard>
            </div>
        </div>
    );
};

export default Stage5_SpecialistAssessment;
