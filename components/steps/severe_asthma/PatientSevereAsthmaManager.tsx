
import React, { useEffect } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { usePatientRecords } from '../../../contexts/PatientRecordsContext';
import { StepId } from '../../../types';
import { ChevronDown, ChevronUp, ArrowLeft, ArrowRight, User, Activity } from 'lucide-react';
import Button from '../../ui/Button';

// Re-using the same stages as the main pathway
import Stage1 from './Stage1_PatientAssessment';
import Stage2 from './Stage2_RiskFactors';
import Stage3 from './Stage3_OptimizeManagement';
import Stage4 from './Stage4_ReviewResponse';
import Stage5 from './Stage5_SpecialistAssessment';
import Stage6 from './Stage6_PhenotypeAssessment';
import Stage7 from './Stage7_TreatmentOptions';
import Stage8 from './Stage8_BiologicTherapy';
import Stage9 from './Stage9_MonitorResponse';
import Stage10 from './Stage10_OngoingCare';
import Stage11 from './Stage11_SummaryReport';

const stages = [
    { id: 1, stepId: 'SEVERE_ASTHMA_STAGE_1', title: "Patient Assessment", color: "bg-teal-600" },
    { id: 2, stepId: 'SEVERE_ASTHMA_STAGE_2', title: "Risk Factors", color: "bg-teal-600" },
    { id: 3, stepId: 'SEVERE_ASTHMA_STAGE_3', title: "Optimize Management", color: "bg-teal-600" },
    { id: 4, stepId: 'SEVERE_ASTHMA_STAGE_4', title: "Review Response", color: "bg-teal-600" },
    { id: 5, stepId: 'SEVERE_ASTHMA_STAGE_5', title: "Specialist Assessment", color: "bg-indigo-600" },
    { id: 6, stepId: 'SEVERE_ASTHMA_STAGE_6', title: "Phenotype Assessment", color: "bg-indigo-600" },
    { id: 7, stepId: 'SEVERE_ASTHMA_STAGE_7', title: "Treatment Options", color: "bg-indigo-600" },
    { id: 8, stepId: 'SEVERE_ASTHMA_STAGE_8', title: "Biologic Therapy", color: "bg-indigo-600" },
    { id: 9, stepId: 'SEVERE_ASTHMA_STAGE_9', title: "Monitor Response", color: "bg-amber-600" },
    { id: 10, stepId: 'SEVERE_ASTHMA_STAGE_10', title: "Ongoing Care", color: "bg-amber-600" },
    { id: 11, stepId: 'SEVERE_ASTHMA_STAGE_11', title: "Summary Report", color: "bg-slate-700" }
];

const StageHeader: React.FC<{ stage: any, isActive: boolean, onClick: () => void }> = ({ stage, isActive, onClick }) => (
    <div 
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive ? `${stage.color} text-white shadow-lg` : 'bg-gray-100 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">Stage {stage.id}: {stage.title}</span>
        {isActive ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
    </div>
);

const PatientSevereAsthmaManager: React.FC = () => {
    const { currentStepId, navigateTo } = useNavigation();
    const { patientData } = usePatientData();
    const { getPatient } = usePatientRecords();
    
    const activeStage = stages.find(s => s.stepId === currentStepId);
    const activeStageId = activeStage ? activeStage.id : 1;
    const stagesWithInternalNav = [1, 2, 3, 4, 5, 7, 8]; // Stages that manage their own "Next" logic
    const patientProfile = patientData.activePatientId ? getPatient(patientData.activePatientId) : null;

    // --- SMART ROUTING LOGIC FOR PATIENT CARE ---
    useEffect(() => {
        // Only run logic if we are at the entry point (Stage 1) to avoid overriding user navigation within the module
        if (currentStepId === 'SEVERE_ASTHMA_STAGE_1') {
            const status = patientData.severeAsthma.status;
            
            // 1. If patient is returning for 3-6 month review (Optimizing) OR returning after treating factors
            if (status === 'optimizing' || status === 'addressing_factors') {
                navigateTo('SEVERE_ASTHMA_STAGE_4');
            }
            // 2. If severe asthma is confirmed (e.g. on biologics), go straight to monitoring
            else if (status === 'confirmed_severe') {
                navigateTo('SEVERE_ASTHMA_STAGE_9');
            }
        }
    }, [patientData.severeAsthma.status, currentStepId, navigateTo]);

    const handleStageClick = (stepId: StepId) => {
        navigateTo(stepId);
    };

    const handlePreviousStage = () => {
        if (activeStageId > 1) {
            const prevStage = stages.find(s => s.id === activeStageId - 1);
            if (prevStage) navigateTo(prevStage.stepId as StepId);
        }
    };
    
    const handleNextStage = () => {
        if (activeStageId < stages.length) {
             const nextStage = stages.find(s => s.id === activeStageId + 1);
             if (nextStage) navigateTo(nextStage.stepId as StepId);
        }
    };
    
    const renderCurrentStage = () => {
        switch(currentStepId) {
            case 'SEVERE_ASTHMA_STAGE_1': return <Stage1 />;
            case 'SEVERE_ASTHMA_STAGE_2': return <Stage2 />;
            case 'SEVERE_ASTHMA_STAGE_3': return <Stage3 />;
            case 'SEVERE_ASTHMA_STAGE_4': return <Stage4 />;
            case 'SEVERE_ASTHMA_STAGE_5': return <Stage5 />;
            case 'SEVERE_ASTHMA_STAGE_6': return <Stage6 />;
            case 'SEVERE_ASTHMA_STAGE_7': return <Stage7 />;
            case 'SEVERE_ASTHMA_STAGE_8': return <Stage8 />;
            case 'SEVERE_ASTHMA_STAGE_9': return <Stage9 />;
            case 'SEVERE_ASTHMA_STAGE_10': return <Stage10 />;
            case 'SEVERE_ASTHMA_STAGE_11': return <Stage11 />;
            default: return <Stage1 />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header matching the SevereAsthmaPathway style but with patient context */}
            <header className="bg-white rounded-lg shadow-md p-6 mb-6 no-print flex flex-col md:flex-row justify-between items-center border-l-8 border-indigo-600">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center">
                        <Activity className="mr-3 text-indigo-600" />
                        Severe Asthma Protocol
                    </h1>
                    <p className="text-slate-600 ml-9">Clinical Management Mode</p>
                </div>
                {patientProfile && (
                    <div className="mt-4 md:mt-0 flex items-center bg-indigo-50 px-4 py-2 rounded-full border border-indigo-200">
                        <User size={18} className="text-indigo-600 mr-2"/>
                        <span className="font-semibold text-indigo-900">{patientProfile.lastName.toUpperCase()}, {patientProfile.firstName}</span>
                        <span className="mx-2 text-indigo-300">|</span>
                        <span className="text-xs text-indigo-700">DOB: {patientProfile.dateOfBirth}</span>
                    </div>
                )}
            </header>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation - Matches SevereAsthmaPathway */}
                <div className="w-full lg:w-80 flex-shrink-0 no-print">
                    <div className="bg-white rounded-lg shadow-md p-4 sticky top-6">
                        <h2 className="text-lg font-semibold mb-4 text-center text-slate-800">Protocol Stages</h2>
                        <div className="space-y-2">
                            {stages.map((stage) => (
                                <StageHeader
                                key={stage.id}
                                stage={stage}
                                isActive={activeStageId === stage.id}
                                onClick={() => handleStageClick(stage.stepId as StepId)}
                                />
                            ))}
                        </div>
            
                        <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-slate-100">
                            <Button
                                onClick={handlePreviousStage}
                                disabled={activeStageId === 1}
                                variant="secondary"
                                fullWidth
                                leftIcon={<ArrowLeft/>}
                            >
                                Previous Stage
                            </Button>
                            <Button
                                onClick={handleNextStage}
                                disabled={activeStageId >= stages.length}
                                variant="primary"
                                fullWidth
                                rightIcon={<ArrowRight/>}
                            >
                                Next Stage
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area - Matches SevereAsthmaPathway */}
                <div className="flex-1 min-w-0">
                    <div className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 ${currentStepId === 'SEVERE_ASTHMA_STAGE_11' ? 'printable-area' : ''}`}>
                        {renderCurrentStage()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientSevereAsthmaManager;
