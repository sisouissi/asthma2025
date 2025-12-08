
import React from 'react';
import { PatientDataProvider, usePatientData } from './contexts/PatientDataContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { UIStateProvider } from './contexts/UIStateContext';
import { PatientRecordsProvider } from './contexts/PatientRecordsContext';
import { MedicationProvider } from './contexts/MedicationContext';
import { MainLayout } from './components/layout/MainLayout';

import { InitialStep } from './components/steps/InitialStep';
import DiagnosisPendingStep from './components/steps/common/DiagnosisPendingStep';
import AbbreviationsStep from './components/steps/common/AbbreviationsStep';
import AIAssistantPanel from './components/ai/AIAssistantPanel';
import GoalsModal from './components/common/GoalsModal';
import InfoModal from './components/common/InfoModal';
import PrintProfileModal from './components/common/PrintProfileModal';
import InitialDiagnosisFlowchartStep from './components/steps/common/InitialDiagnosisFlowchartStep';
import StepDownAssessStep from './components/steps/common/step_down/StepDownAssessStep';
import StepDownAdjustStep from './components/steps/common/step_down/StepDownAdjustStep';
import StepDownReviewStep from './components/steps/common/step_down/StepDownReviewStep';
import PatientDashboard from './components/patients/PatientDashboard';
import ConsultationSummaryStep from './components/steps/common/ConsultationSummaryStep';
import PhenotypeAssessmentStep from './components/steps/common/PhenotypeAssessmentStep';
import DiagnosisProbabilityStep from './components/steps/common/DiagnosisProbabilityStep';


// Adult Steps
import AdultDiagnosisStep from './components/steps/adult/AdultDiagnosisStep';
import AdultSymptomFrequencyStep from './components/steps/adult/AdultSymptomFrequencyStep';
import AdultRiskAssessmentStep from './components/steps/adult/AdultRiskAssessmentStep';
import AdultPathwaySelectionStep from './components/steps/adult/AdultPathwaySelectionStep';
import AdultTreatmentPlanStep from './components/steps/adult/AdultTreatmentPlanStep';
import AdultControlAssessmentStep from './components/steps/adult/AdultControlAssessmentStep';
import AdultExacerbationIntroStep from './components/steps/adult/AdultExacerbationIntroStep';
import AdultExacerbationSeverityStep from './components/steps/adult/AdultExacerbationSeverityStep';
import AdultExacerbationPlanStep from './components/steps/adult/AdultExacerbationPlanStep';
import AdultBaselineACTStep from './components/steps/adult/AdultBaselineACTStep';

// Child Steps
import ChildDiagnosisStep from './components/steps/child/ChildDiagnosisStep';
import ChildInitialAssessmentStep from './components/steps/child/ChildInitialAssessmentStep';
import ChildRiskAssessmentStep from './components/steps/child/ChildRiskAssessmentStep';
import ChildPathwaySelectionStep from './components/steps/child/ChildPathwaySelectionStep';
import ChildTreatmentPlanStep from './components/steps/child/ChildTreatmentPlanStep';
import ChildControlAssessmentStep from './components/steps/child/ChildControlAssessmentStep';
import ChildExacerbationIntroStep from './components/steps/child/ChildExacerbationIntroStep';
import ChildExacerbationSeverityStep from './components/steps/child/ChildExacerbationSeverityStep';
import ChildExacerbationPlanStep from './components/steps/child/ChildExacerbationPlanStep';

// Young Child Steps
import YoungChildDiagnosisStep from './components/steps/youngChild/YoungChildDiagnosisStep';
import YoungChildSuspectedAsthmaStep from './components/steps/youngChild/YoungChildSuspectedAsthmaStep';
import YoungChildSymptomPatternStep from './components/steps/youngChild/YoungChildSymptomPatternStep';
import YoungChildRiskAssessmentStep from './components/steps/youngChild/YoungChildRiskAssessmentStep';
import YoungChildTreatmentPlanStep from './components/steps/youngChild/YoungChildTreatmentPlanStep';
import YoungChildControlAssessmentStep from './components/steps/youngChild/YoungChildControlAssessmentStep';
import YoungChildExacerbationIntroStep from './components/steps/youngChild/YoungChildExacerbationIntroStep';
import YoungChildExacerbationSeverityStep from './components/steps/youngChild/YoungChildExacerbationSeverityStep';
import YoungChildExacerbationPlanStep from './components/steps/youngChild/YoungChildExacerbationPlanStep';

// Severe Asthma Containers
import SevereAsthmaPathway from './components/steps/severe_asthma/SevereAsthmaPathway';
import PatientSevereAsthmaManager from './components/steps/severe_asthma/PatientSevereAsthmaManager';


const StepRenderer: React.FC = () => {
  const { currentStepId } = useNavigation();
  const { patientData } = usePatientData();

  switch (currentStepId) {
    case 'INITIAL_STEP':
      return <InitialStep />;
    case 'PATIENT_DASHBOARD':
    case 'PATIENT_DASHBOARD_LIST':
    case 'PATIENT_DASHBOARD_CREATE':
    case 'PATIENT_DASHBOARD_DETAILS':
      return <PatientDashboard />;
    case 'CONSULTATION_SUMMARY_STEP':
      return <ConsultationSummaryStep />;
    case 'DIAGNOSIS_PENDING_STEP':
      return <DiagnosisPendingStep />;
    case 'DIAGNOSIS_PROBABILITY_STEP':
      return <DiagnosisProbabilityStep />;
    case 'PHENOTYPE_ASSESSMENT_STEP':
      return <PhenotypeAssessmentStep />;
    case 'ABBREVIATIONS_STEP':
      return <AbbreviationsStep />;
    case 'INITIAL_DIAGNOSIS_FLOWCHART_STEP':
      return <InitialDiagnosisFlowchartStep />;
    case 'STEP_DOWN_ASSESS_STEP':
      return <StepDownAssessStep />;
    case 'STEP_DOWN_ADJUST_STEP':
      return <StepDownAdjustStep />;
    case 'STEP_DOWN_REVIEW_STEP':
      return <StepDownReviewStep />;

    // Adult Pathway
    case 'ADULT_DIAGNOSIS_STEP':
      return <AdultDiagnosisStep />;
    case 'ADULT_BASELINE_ACT_STEP':
      return <AdultBaselineACTStep />;
    case 'ADULT_SYMPTOM_FREQUENCY_STEP':
      return <AdultSymptomFrequencyStep />;
    case 'ADULT_RISK_ASSESSMENT_STEP':
      return <AdultRiskAssessmentStep />;
    case 'ADULT_PATHWAY_SELECTION_STEP':
      return <AdultPathwaySelectionStep />;
    case 'ADULT_TREATMENT_PLAN_STEP':
      return <AdultTreatmentPlanStep />;
    case 'ADULT_CONTROL_ASSESSMENT_STEP':
      return <AdultControlAssessmentStep />;
    case 'ADULT_EXACERBATION_INTRO_STEP':
      return <AdultExacerbationIntroStep />;
    case 'ADULT_EXACERBATION_SEVERITY_STEP':
      return <AdultExacerbationSeverityStep />;
    case 'ADULT_EXACERBATION_PLAN_STEP':
      return <AdultExacerbationPlanStep />;

    // Child Pathway
    case 'CHILD_DIAGNOSIS_STEP':
      return <ChildDiagnosisStep />;
    case 'CHILD_INITIAL_ASSESSMENT_STEP':
      return <ChildInitialAssessmentStep />;
    case 'CHILD_RISK_ASSESSMENT_STEP':
      return <ChildRiskAssessmentStep />;
    case 'CHILD_PATHWAY_SELECTION_STEP':
      return <ChildPathwaySelectionStep />;
    case 'CHILD_TREATMENT_PLAN_STEP':
      return <ChildTreatmentPlanStep />;
    case 'CHILD_CONTROL_ASSESSMENT_STEP':
      return <ChildControlAssessmentStep />;
    case 'CHILD_EXACERBATION_INTRO_STEP':
      return <ChildExacerbationIntroStep />;
    case 'CHILD_EXACERBATION_SEVERITY_STEP':
      return <ChildExacerbationSeverityStep />;
    case 'CHILD_EXACERBATION_PLAN_STEP':
      return <ChildExacerbationPlanStep />;

    // Young Child Pathway
    case 'YOUNG_CHILD_DIAGNOSIS_STEP':
      return <YoungChildDiagnosisStep />;
    case 'YOUNG_CHILD_SUSPECTED_ASTHMA_STEP':
      return <YoungChildSuspectedAsthmaStep />;
    case 'YOUNG_CHILD_SYMPTOM_PATTERN_STEP':
      return <YoungChildSymptomPatternStep />;
    case 'YOUNG_CHILD_RISK_ASSESSMENT_STEP':
      return <YoungChildRiskAssessmentStep />;
    case 'YOUNG_CHILD_TREATMENT_PLAN_STEP':
      return <YoungChildTreatmentPlanStep />;
    case 'YOUNG_CHILD_CONTROL_ASSESSMENT_STEP':
      return <YoungChildControlAssessmentStep />;
    case 'YOUNG_CHILD_EXACERBATION_INTRO_STEP':
      return <YoungChildExacerbationIntroStep />;
    case 'YOUNG_CHILD_EXACERBATION_SEVERITY_STEP':
      return <YoungChildExacerbationSeverityStep />;
    case 'YOUNG_CHILD_EXACERBATION_PLAN_STEP':
      return <YoungChildExacerbationPlanStep />;

    // Severe Asthma Pathway (11-Stage Flow)
    case 'SEVERE_ASTHMA_STAGE_1':
    case 'SEVERE_ASTHMA_STAGE_2':
    case 'SEVERE_ASTHMA_STAGE_3':
    case 'SEVERE_ASTHMA_STAGE_4':
    case 'SEVERE_ASTHMA_STAGE_5':
    case 'SEVERE_ASTHMA_STAGE_6':
    case 'SEVERE_ASTHMA_STAGE_7':
    case 'SEVERE_ASTHMA_STAGE_8':
    case 'SEVERE_ASTHMA_STAGE_9':
    case 'SEVERE_ASTHMA_STAGE_10':
    case 'SEVERE_ASTHMA_STAGE_11':
      // Differentiate between Training Mode and Patient Care Mode
      if (patientData.activePatientId) {
        return <PatientSevereAsthmaManager />;
      }
      return <SevereAsthmaPathway />;

    default:
      return <InitialStep />;
  }
};

const App: React.FC = () => {
  return (
    <PatientRecordsProvider>
      <PatientDataProvider>
        <MedicationProvider>
          <UIStateProvider>
            <NavigationProvider>
              <MainLayout>
                <StepRenderer />
              </MainLayout>
              <AIAssistantPanel />
              <GoalsModal />
              <InfoModal />
              <PrintProfileModal />
            </NavigationProvider>
          </UIStateProvider>
        </MedicationProvider>
      </PatientDataProvider>
    </PatientRecordsProvider>
  );
};

export default App;
