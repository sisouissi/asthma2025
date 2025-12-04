export type AgeGroup = 'adult' | 'child' | 'youngChild';

export type StepId = 
  | 'INITIAL_STEP'
  | 'PATIENT_DASHBOARD'
  | 'CONSULTATION_SUMMARY_STEP'
  | 'DIAGNOSIS_PENDING_STEP'
  | 'DIAGNOSIS_PROBABILITY_STEP'
  | 'PHENOTYPE_ASSESSMENT_STEP'
  | 'ABBREVIATIONS_STEP'
  | 'INITIAL_DIAGNOSIS_FLOWCHART_STEP'
  | 'STEP_DOWN_ASSESS_STEP'
  | 'STEP_DOWN_ADJUST_STEP'
  | 'STEP_DOWN_REVIEW_STEP'
  | 'ADULT_DIAGNOSIS_STEP'
  | 'ADULT_BASELINE_ACT_STEP'
  | 'ADULT_SYMPTOM_FREQUENCY_STEP'
  | 'ADULT_RISK_ASSESSMENT_STEP'
  | 'ADULT_PATHWAY_SELECTION_STEP'
  | 'ADULT_TREATMENT_PLAN_STEP'
  | 'ADULT_CONTROL_ASSESSMENT_STEP'
  | 'ADULT_EXACERBATION_INTRO_STEP'
  | 'ADULT_EXACERBATION_SEVERITY_STEP'
  | 'ADULT_EXACERBATION_PLAN_STEP'
  | 'CHILD_DIAGNOSIS_STEP'
  | 'CHILD_INITIAL_ASSESSMENT_STEP'
  | 'CHILD_RISK_ASSESSMENT_STEP'
  | 'CHILD_PATHWAY_SELECTION_STEP'
  | 'CHILD_TREATMENT_PLAN_STEP'
  | 'CHILD_CONTROL_ASSESSMENT_STEP'
  | 'CHILD_EXACERBATION_INTRO_STEP'
  | 'CHILD_EXACERBATION_SEVERITY_STEP'
  | 'CHILD_EXACERBATION_PLAN_STEP'
  | 'YOUNG_CHILD_DIAGNOSIS_STEP'
  | 'YOUNG_CHILD_SUSPECTED_ASTHMA_STEP'
  | 'YOUNG_CHILD_SYMPTOM_PATTERN_STEP'
  | 'YOUNG_CHILD_RISK_ASSESSMENT_STEP'
  | 'YOUNG_CHILD_TREATMENT_PLAN_STEP'
  | 'YOUNG_CHILD_CONTROL_ASSESSMENT_STEP'
  | 'YOUNG_CHILD_EXACERBATION_INTRO_STEP'
  | 'YOUNG_CHILD_EXACERBATION_SEVERITY_STEP'
  | 'YOUNG_CHILD_EXACERBATION_PLAN_STEP'
  | 'SEVERE_ASTHMA_STAGE_1'
  | 'SEVERE_ASTHMA_STAGE_2'
  | 'SEVERE_ASTHMA_STAGE_3'
  | 'SEVERE_ASTHMA_STAGE_4'
  | 'SEVERE_ASTHMA_STAGE_5'
  | 'SEVERE_ASTHMA_STAGE_6'
  | 'SEVERE_ASTHMA_STAGE_7'
  | 'SEVERE_ASTHMA_STAGE_8'
  | 'SEVERE_ASTHMA_STAGE_9'
  | 'SEVERE_ASTHMA_STAGE_10'
  | 'SEVERE_ASTHMA_STAGE_11';

// Control Levels
export type ControlLevel = 'wellControlled' | 'partlyControlled' | 'uncontrolled';

// Test result history
export interface TestResult {
    date: string; // ISO string
    score: number;
}

// Control Assessment detailed answers
export interface ControlAnswers {
  daytimeSymptoms: boolean | null;
  activityLimitation: boolean | null;
  nocturnalSymptoms: boolean | null;
  relieverNeed: boolean | null;
}

// Phenotype Data
export interface PhenotypeData {
    allergicHistory: boolean | null; // Eczema, allergic rhinitis, food/drug allergy
    familyHistory: boolean | null;
    childhoodOnset: boolean | null;
    coughVariant: boolean | null; // Cough is the only symptom
    obesity: boolean | null;
    worseAtWork: boolean | null; // Occupational
    persistentLimitation: boolean | null; // Airflow limitation despite treatment
    identifiedPhenotype: string | null; // The logic-derived conclusion
}

// Diagnosis Symptoms (Probability Assessment)
export interface DiagnosisSymptoms {
  typical: {
    symptoms: boolean; // Wheeze, SOB, etc
    timing: boolean; // Night/Morning
    variability: boolean; // Time/Intensity
    triggers: boolean; // Viral, exercise, etc
  };
  atypical: {
    sputum: boolean;
    dizziness: boolean;
    chestPain: boolean;
    noisyInspiration: boolean;
  };
}

// NEW: Detailed GINA Box 1-2 Diagnosis Criteria
export interface GinaDiagnosisCriteria {
    // 1. History of typical symptoms
    symptoms: {
        wheeze: boolean;
        sob: boolean; // Shortness of breath
        chestTightness: boolean;
        cough: boolean;
    };
    // Pattern characteristics
    patterns: {
        variable: boolean; // Vary over time and in intensity
        nightWaking: boolean; // Worse at night or on waking
        triggers: boolean; // Triggered by exercise, laughter, allergens, cold
        viralWorsening: boolean; // Worsen with viral infections
    };
    // 2. Confirmed Variable Expiratory Airflow
    airflowLimitation: {
        bdReversibility: boolean; // Positive Bronchodilator Reversibility
        pefVariability: boolean; // Excessive variability in twice-daily PEF
        treatmentTrial: boolean; // Increase after 4 weeks of anti-inflammatory
        challengeTest: boolean; // Positive bronchial provocation
        visitVariation: boolean; // Excessive variation between visits
    };
    // 3. Supportive Biomarkers (Type 2)
    biomarkers: {
        feNo: string; // ppb
        bloodEosinophils: string; // cells/muL
    };
}

// Diagnosis on Treatment (GINA Box 1-4)
export interface OnTreatmentDiagnosis {
    status: 'confirmed_variable' | 'symptoms_no_variable' | 'no_symptoms_normal' | null;
    fev1_percent: string;
}

// Initial Assessment Answers (for storing Q&A)
export interface InitialAssessmentAnswers {
    symptomFrequency: string;
    nightWaking: string;
    severePresentation: boolean;
}


// Adult specific types
export type AdultSymptomFrequency =
  | 'lessThanTwiceAMonth'
  | 'twiceAMonthOrMore'
  | 'mostDaysOrWakingWeekly'
  | 'severeDailyOrExacerbation';

export type AdultPathway = 'pathway1' | 'pathway2'; // Pathway 1: ICS-formoterol MART, Pathway 2: SABA + other controller

// Child (6-11) specific types
export type ChildGINASteps = 1 | 2 | 3 | 4;
export type ChildPathway = 'track1' | 'track2'; // Track 1: MART, Track 2: Classic SABA reliever


// Young Child (<=5) specific types
export type YoungChildSymptomPattern =
  | 'infrequentViralWheeze' 
  | 'persistentAsthmaOrFrequentWheeze'; 

export type YoungChildGinaSteps = 1 | 2 | 3 | 4;
// Identifies the chosen treatment strategy within a GINA step, 'preferred' or an alternative's ID.
export type YoungChildTreatmentStrategyKey = string; // e.g., 'DAILY_LTRA', 'INTERMITTENT_ICS_STEP1' etc.

export interface YoungChildDiagnosisCriteria {
  criterion1: boolean; // Recurrent episodes
  criterion2: boolean; // No alternative cause
  criterion3: boolean; // Response to treatment
}

export type ExacerbationSeverity = 'mildModerate' | 'severe';

// --- Prescription Types ---
export interface Medication {
    id: string;
    brandName: string;
    genericName: string;
    defaultDosage?: string;
}

export interface PrescriptionItem {
    id: string;
    medicationId: string;
    medicationName: string; // Store name denormalized in case med is deleted/changed
    instructions: string; // e.g. "2 puffs morning and evening"
    duration: string; // e.g. "3 months"
}

// --- Severe Asthma Data Structure (New 11-stage flow) ---
export interface OptimizationPlan {
    dateInitiated: string;
    interventions: string[];
    followUpDate: string | null;
    comorbidityPlan?: string; // Added for Stage 5
}

export interface SevereAsthmaBasicInfo {
    age: string;
    diagnosis: 'unconfirmed' | 'confirmed';
    asthmaOnset: 'childhood' | 'adult';
    exacerbationsLastYear: string;
    hospitalizationsLastYear: string;
    sabaUse: string;
}

export interface SevereAsthmaSymptoms {
    poorControl: boolean;
    frequentExacerbations: boolean;
    nightWaking: boolean;
    activityLimitation: boolean;
    frequentSabaUse: boolean;
    allergenDriven: boolean;
}

export interface SevereAsthmaMedications {
    icsLaba: boolean;
    icsDose: 'low' | 'medium' | 'high';
    ocs: boolean;
    maintenanceOcs: boolean;
    ocsDose: string;
    adherence: 'good' | 'suboptimal' | 'poor' | 'unknown';
    inhalerTechnique: 'correct' | 'incorrect' | 'unknown';
    mart: boolean;
    lama: boolean;
    ltra: boolean;
    azithromycin: boolean;
    biologicsAvailable: 'yes' | 'no' | null;
}

export interface SevereAsthmaBiomarkers {
    bloodEosinophils: string;
    feNo: string;
    sputumEosinophils: string;
    totalIgE: string;
    specificIgE: boolean;
    skinPrickTest: boolean;
    fev1: string;
    fev1Predicted: string;
}

export interface SevereAsthmaInvestigations {
    chestXray: boolean;
    hrct: boolean;
    allergyTesting: boolean;
    boneDensity: boolean;
    parasiteScreen: boolean;
    cardiacAssessment: boolean;
}

export interface SevereAsthmaPatientData {
    basicInfo: SevereAsthmaBasicInfo;
    symptoms: SevereAsthmaSymptoms;
    medications: SevereAsthmaMedications;
    biomarkers: SevereAsthmaBiomarkers;
    comorbidities: string[];
    riskFactors: string[];
    investigations: SevereAsthmaInvestigations;
    status?: 'screening' | 'optimizing' | 'controlled_on_optimization' | 'addressing_factors' | 'confirmed_severe' | 'rejected_severe' | 'biologic_trial' | 'biologic_failure' | null;
    optimizationPlan?: OptimizationPlan;
    selectedBiologic?: string; 
    biologicResponse?: 'good' | 'partial' | 'no' | null;
}

export interface SevereAsthmaAssessmentResults {
    difficultToTreat: boolean;
    severeAsthma: boolean;
    type2Inflammation: boolean;
    eligibleForBiologics: boolean;
}

// --- Patient Records Types ---
export interface ConsultationRecord {
    id: string;
    date: string;
    data: PatientData;
    summary?: string;
}

export interface PatientProfile {
    id: string;
    lastName: string;
    firstName: string;
    dateOfBirth: string;
    fileNumber: string;
    treatingPhysician: string;
    consultations: ConsultationRecord[];
    createdAt: string;
}


export interface PatientData {
  // Context for Record Keeping
  activePatientId: string | null;
  activeConsultationId: string | null;
  consultationType: 'initial' | 'followup';

  age: string | null; // e.g., "12+ years", "6-11 years", "<=5 years"
  ageGroup: AgeGroup | null;
  diagnosisConfirmed: boolean | null;
  
  // New Diagnosis Probability Data (Symptom checking)
  diagnosisSymptoms: DiagnosisSymptoms;
  
  // New GINA Box 1-2 Criteria (Detailed Confirmation)
  isOnMaintenanceTreatment: boolean;
  onTreatmentDiagnosis: OnTreatmentDiagnosis;
  diagnosisCriteria: GinaDiagnosisCriteria;

  // Phenotype Assessment
  phenotypeData: PhenotypeData;

  // Adult specific
  adult_symptomFrequency: AdultSymptomFrequency | null;
  adult_initialAssessment: InitialAssessmentAnswers | null; // Stored answers
  adult_controlLevel: ControlLevel | null;
  adult_controlAssessmentAnswers: ControlAnswers | null;
  adult_pathway: AdultPathway | null;
  adult_currentGinaStep: 1 | 2 | 3 | 4 | 5 | null;
  adult_riskFactors: string[];
  adult_reviewReminderDate: string | null;

  // Child (6-11) specific
  child_currentGinaStep: ChildGINASteps | null;
  child_initialAssessment: InitialAssessmentAnswers | null; // Stored answers
  child_pathway: ChildPathway | null;
  child_controlLevel: ControlLevel | null;
  child_controlAssessmentAnswers: ControlAnswers | null;
  child_riskFactors: string[];
  child_reviewReminderDate: string | null;


  // Young Child (<=5) specific
  youngChild_symptomPattern: YoungChildSymptomPattern | null;
  youngChild_currentGinaStep: YoungChildGinaSteps | null;
  youngChild_currentTreatmentStrategy: YoungChildTreatmentStrategyKey | null; 
  youngChild_diagnosisCriteria: YoungChildDiagnosisCriteria | null;
  youngChild_controlLevel: ControlLevel | null;
  youngChild_controlAssessmentAnswers: ControlAnswers | null;
  youngChild_riskFactors: string[];
  youngChild_reviewReminderDate: string | null;
  
  // Common for exacerbations
  exacerbationSeverity: ExacerbationSeverity | null;

  // Prescription
  currentPrescription: PrescriptionItem[];

  // Severe Asthma
  severeAsthma: SevereAsthmaPatientData;
  severeAsthmaAssessment: SevereAsthmaAssessmentResults;

  // Test Histories for longitudinal tracking
  actHistory: TestResult[];
  acqHistory: TestResult[];
  cactHistory: TestResult[];
}

// Treatment Interfaces
export interface TreatmentDetail {
  name: string;
  reliever?: string;
  controller?: string;
  keyPoints?: string[];
  notes?: string[] | string;
  additional?: string[] | string;
  referral?: string;
}

export interface AdultTreatmentOptions {
  pathway1: Record<number, TreatmentDetail>;
  pathway2: Record<number, TreatmentDetail>;
}

export interface ChildTreatmentOptions {
  track1: Record<number, TreatmentDetail>;
  track2: Record<number, TreatmentDetail>;
}

export interface YoungChildAlternativeTreatment extends TreatmentDetail {
    id: string;
}

export interface YoungChildStepTreatment {
    stepDescription: string;
    preferred: TreatmentDetail;
    alternatives?: YoungChildAlternativeTreatment[];
}

export interface YoungChildTreatmentOptions {
    [key: number]: YoungChildStepTreatment;
}

// AI Chat Interface
export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// Initial Data Constant
export const initialPatientData: PatientData = {
  activePatientId: null,
  activeConsultationId: null,
  consultationType: 'initial',
  age: null,
  ageGroup: null,
  diagnosisConfirmed: null,
  diagnosisSymptoms: {
    typical: { symptoms: false, timing: false, variability: false, triggers: false },
    atypical: { sputum: false, dizziness: false, chestPain: false, noisyInspiration: false }
  },
  isOnMaintenanceTreatment: false,
  onTreatmentDiagnosis: { status: null, fev1_percent: '' },
  diagnosisCriteria: {
    symptoms: { wheeze: false, sob: false, chestTightness: false, cough: false },
    patterns: { variable: false, nightWaking: false, triggers: false, viralWorsening: false },
    airflowLimitation: { bdReversibility: false, pefVariability: false, treatmentTrial: false, challengeTest: false, visitVariation: false },
    biomarkers: { feNo: '', bloodEosinophils: '' }
  },
  phenotypeData: {
    allergicHistory: null,
    familyHistory: null,
    childhoodOnset: null,
    coughVariant: null,
    obesity: null,
    worseAtWork: null,
    persistentLimitation: null,
    identifiedPhenotype: null
  },
  adult_symptomFrequency: null,
  adult_initialAssessment: null,
  adult_controlLevel: null,
  adult_controlAssessmentAnswers: null,
  adult_pathway: null,
  adult_currentGinaStep: null,
  adult_riskFactors: [],
  adult_reviewReminderDate: null,
  child_currentGinaStep: null,
  child_initialAssessment: null,
  child_pathway: null,
  child_controlLevel: null,
  child_controlAssessmentAnswers: null,
  child_riskFactors: [],
  child_reviewReminderDate: null,
  youngChild_symptomPattern: null,
  youngChild_currentGinaStep: null,
  youngChild_currentTreatmentStrategy: null,
  youngChild_diagnosisCriteria: null,
  youngChild_controlLevel: null,
  youngChild_controlAssessmentAnswers: null,
  youngChild_riskFactors: [],
  youngChild_reviewReminderDate: null,
  exacerbationSeverity: null,
  currentPrescription: [],
  severeAsthma: {
    basicInfo: { age: '', diagnosis: 'unconfirmed', asthmaOnset: 'adult', exacerbationsLastYear: '', hospitalizationsLastYear: '', sabaUse: '' },
    symptoms: { poorControl: false, frequentExacerbations: false, nightWaking: false, activityLimitation: false, frequentSabaUse: false, allergenDriven: false },
    medications: { icsLaba: false, icsDose: 'medium', ocs: false, maintenanceOcs: false, ocsDose: '', adherence: 'unknown', inhalerTechnique: 'unknown', mart: false, lama: false, ltra: false, azithromycin: false, biologicsAvailable: null },
    biomarkers: { bloodEosinophils: '', feNo: '', sputumEosinophils: '', totalIgE: '', specificIgE: false, skinPrickTest: false, fev1: '', fev1Predicted: '' },
    comorbidities: [],
    riskFactors: [],
    investigations: { chestXray: false, hrct: false, allergyTesting: false, boneDensity: false, parasiteScreen: false, cardiacAssessment: false },
    status: 'screening',
    optimizationPlan: undefined,
    selectedBiologic: undefined,
    biologicResponse: null
  },
  severeAsthmaAssessment: { difficultToTreat: false, severeAsthma: false, type2Inflammation: false, eligibleForBiologics: false },
  actHistory: [],
  acqHistory: [],
  cactHistory: []
};