import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { PatientProfile, ConsultationRecord, PatientData } from '../types';

interface PatientRecordsContextType {
    patients: PatientProfile[];
    addPatient: (profile: Omit<PatientProfile, 'id' | 'consultations' | 'createdAt'>) => void;
    updatePatient: (id: string, updates: Partial<PatientProfile>) => void;
    deletePatient: (id: string) => void;
    saveConsultation: (patientId: string, consultationData: PatientData) => void;
    updateConsultation: (patientId: string, consultationId: string, consultationData: PatientData) => void;
    getPatient: (id: string) => PatientProfile | undefined;
    importPatients: (patients: PatientProfile[]) => void;
}

const PatientRecordsContext = createContext<PatientRecordsContextType | undefined>(undefined);

const STORAGE_KEY = 'gina_asthma_app_patients';

// Helper to create a past date
const getPastDate = (monthsAgo: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() - monthsAgo);
    return d.toISOString();
};

const DUMMY_PATIENTS: PatientProfile[] = [
    {
        id: 'dummy-adult-1',
        lastName: 'Dupont',
        firstName: 'Jean',
        dateOfBirth: '1980-05-15', // ~44 years old
        fileNumber: 'A-1001',
        treatingPhysician: 'Dr. House',
        createdAt: getPastDate(12),
        consultations: [
            {
                id: 'consult-adult-1',
                date: getPastDate(6),
                data: {
                    activePatientId: 'dummy-adult-1',
                    activeConsultationId: 'consult-adult-1',
                    consultationType: 'initial',
                    age: '12+ years',
                    ageGroup: 'adult',
                    diagnosisConfirmed: true,
                    diagnosisSymptoms: {
                        typical: { symptoms: true, timing: true, variability: true, triggers: true },
                        atypical: { sputum: false, dizziness: false, chestPain: false, noisyInspiration: false }
                    },
                    diagnosisCriteria: {
                        symptoms: { wheeze: true, sob: true, chestTightness: true, cough: true },
                        patterns: { variable: true, nightWaking: true, triggers: true, viralWorsening: false },
                        airflowLimitation: { bdReversibility: true, pefVariability: false, treatmentTrial: false, challengeTest: false, visitVariation: false },
                        biomarkers: { feNo: '45', bloodEosinophils: '350' }
                    },
                    isOnMaintenanceTreatment: false,
                    onTreatmentDiagnosis: { status: null, fev1_percent: '' },
                    phenotypeData: {
                        allergicHistory: true,
                        familyHistory: true,
                        childhoodOnset: true,
                        coughVariant: false,
                        obesity: false,
                        worseAtWork: false,
                        persistentLimitation: false,
                        identifiedPhenotype: "Allergic Asthma"
                    },
                    adult_symptomFrequency: 'mostDaysOrWakingWeekly',
                    adult_initialAssessment: {
                        symptomFrequency: 'Most days',
                        nightWaking: 'Yes, once a week or more',
                        severePresentation: false
                    },
                    adult_currentGinaStep: 4,
                    adult_pathway: 'pathway1',
                    adult_controlLevel: null,
                    adult_controlAssessmentAnswers: null,
                    adult_riskFactors: ['smoking'],
                    adult_reviewReminderDate: getPastDate(3),
                    actHistory: [{ date: getPastDate(6), score: 14 }],
                    currentPrescription: [
                        {
                            id: 'rx-hist-1',
                            medicationId: '2',
                            medicationName: 'Symbicort (Budesonide/Formoterol)',
                            instructions: '200/6, 2 puffs twice daily',
                            duration: '3 months'
                        }
                    ],
                    // Defaults
                    acqHistory: [], cactHistory: [], child_currentGinaStep: null, child_initialAssessment: null, child_pathway: null, child_controlLevel: null, child_controlAssessmentAnswers: null, child_riskFactors: [], child_reviewReminderDate: null, youngChild_symptomPattern: null, youngChild_currentGinaStep: null, youngChild_currentTreatmentStrategy: null, youngChild_diagnosisCriteria: null, youngChild_controlLevel: null, youngChild_controlAssessmentAnswers: null, youngChild_riskFactors: [], youngChild_reviewReminderDate: null, exacerbationSeverity: 'severe', severeAsthma: { basicInfo: { age: '', diagnosis: 'unconfirmed', asthmaOnset: 'adult', exacerbationsLastYear: '', hospitalizationsLastYear: '', sabaUse: '' }, symptoms: { poorControl: false, frequentExacerbations: false, nightWaking: false, activityLimitation: false, frequentSabaUse: false, allergenDriven: false }, medications: { icsLaba: true, icsDose: 'high', ocs: false, maintenanceOcs: false, ocsDose: '', adherence: 'good', inhalerTechnique: 'correct', mart: false, lama: false, ltra: false, azithromycin: false, biologicsAvailable: null }, biomarkers: { bloodEosinophils: '', feNo: '', sputumEosinophils: '', totalIgE: '', specificIgE: false, skinPrickTest: false, fev1: '', fev1Predicted: '' }, comorbidities: [], riskFactors: [], investigations: { chestXray: false, hrct: false, allergyTesting: false, boneDensity: false, parasiteScreen: false, cardiacAssessment: false } }, severeAsthmaAssessment: { difficultToTreat: false, severeAsthma: false, type2Inflammation: false, eligibleForBiologics: false }
                }
            },
            {
                id: 'consult-adult-2',
                date: getPastDate(0), // Today/Recent
                data: {
                    activePatientId: 'dummy-adult-1',
                    activeConsultationId: 'consult-adult-2',
                    consultationType: 'followup',
                    age: '12+ years',
                    ageGroup: 'adult',
                    diagnosisConfirmed: true,
                    diagnosisSymptoms: {
                        typical: { symptoms: true, timing: true, variability: true, triggers: true },
                        atypical: { sputum: false, dizziness: false, chestPain: false, noisyInspiration: false }
                    },
                    diagnosisCriteria: {
                        symptoms: { wheeze: true, sob: true, chestTightness: true, cough: true },
                        patterns: { variable: true, nightWaking: true, triggers: true, viralWorsening: false },
                        airflowLimitation: { bdReversibility: true, pefVariability: false, treatmentTrial: false, challengeTest: false, visitVariation: false },
                        biomarkers: { feNo: '45', bloodEosinophils: '350' }
                    },
                    isOnMaintenanceTreatment: true,
                    onTreatmentDiagnosis: { status: null, fev1_percent: '' },
                    phenotypeData: {
                        allergicHistory: true,
                        familyHistory: true,
                        childhoodOnset: true,
                        coughVariant: false,
                        obesity: false,
                        worseAtWork: false,
                        persistentLimitation: false,
                        identifiedPhenotype: "Allergic Asthma"
                    },
                    adult_symptomFrequency: 'mostDaysOrWakingWeekly',
                    adult_initialAssessment: null,
                    adult_currentGinaStep: 5,
                    adult_pathway: 'pathway1',
                    adult_controlLevel: 'uncontrolled',
                    adult_controlAssessmentAnswers: {
                        daytimeSymptoms: true,
                        activityLimitation: true,
                        nocturnalSymptoms: true,
                        relieverNeed: true
                    },
                    adult_riskFactors: ['smoking', 'exacerbation_history'],
                    adult_reviewReminderDate: getPastDate(-1), // Future
                    actHistory: [{ date: getPastDate(6), score: 14 }, { date: getPastDate(0), score: 12 }],
                    currentPrescription: [
                        {
                            id: 'rx-hist-2',
                            medicationId: '8',
                            medicationName: 'Spiriva Respimat (Tiotropium)',
                            instructions: '2.5mcg, 2 puffs once daily',
                            duration: 'Ongoing'
                        }
                    ],
                    // Set Status to Addressing Factors to test loop
                    exacerbationSeverity: 'severe',
                    severeAsthma: {
                        basicInfo: { age: '44', diagnosis: 'confirmed', asthmaOnset: 'adult', exacerbationsLastYear: '2', hospitalizationsLastYear: '0', sabaUse: '5' },
                        symptoms: { poorControl: true, frequentExacerbations: true, nightWaking: true, activityLimitation: true, frequentSabaUse: true, allergenDriven: true },
                        medications: { icsLaba: true, icsDose: 'high', ocs: false, maintenanceOcs: false, ocsDose: '', adherence: 'good', inhalerTechnique: 'correct', mart: true, lama: true, ltra: false, azithromycin: false, biologicsAvailable: 'yes' },
                        biomarkers: { bloodEosinophils: '450', feNo: '45', sputumEosinophils: '', totalIgE: '600', specificIgE: true, skinPrickTest: true, fev1: '55', fev1Predicted: '55' },
                        comorbidities: ['Chronic rhinosinusitis with nasal polyps (CRSwNP)'],
                        riskFactors: ['Smoking/Vaping'],
                        investigations: { chestXray: true, hrct: false, allergyTesting: true, boneDensity: false, parasiteScreen: false, cardiacAssessment: false },
                        status: 'addressing_factors',
                        optimizationPlan: {
                            dateInitiated: getPastDate(1),
                            interventions: ['Check & Correct Inhaler Technique', 'Treat CRSwNP / CRSsNP (Nasal polyps)', 'Smoking/Vaping cessation support'],
                            followUpDate: null
                        }
                    },
                    severeAsthmaAssessment: { difficultToTreat: true, severeAsthma: true, type2Inflammation: true, eligibleForBiologics: true },
                    // Defaults
                    acqHistory: [], cactHistory: [], child_currentGinaStep: null, child_initialAssessment: null, child_pathway: null, child_controlLevel: null, child_controlAssessmentAnswers: null, child_riskFactors: [], child_reviewReminderDate: null, youngChild_symptomPattern: null, youngChild_currentGinaStep: null, youngChild_currentTreatmentStrategy: null, youngChild_diagnosisCriteria: null, youngChild_controlLevel: null, youngChild_controlAssessmentAnswers: null, youngChild_riskFactors: [], youngChild_reviewReminderDate: null
                }
            }
        ]
    },
    {
        id: 'dummy-child-1',
        lastName: 'Petit',
        firstName: 'Lucas',
        dateOfBirth: '2016-08-20', // ~8 years old
        fileNumber: 'C-2002',
        treatingPhysician: 'Dr. Strange',
        createdAt: getPastDate(4),
        consultations: [
            {
                id: 'consult-child-1',
                date: getPastDate(3), // 3 months ago
                data: {
                    activePatientId: 'dummy-child-1',
                    activeConsultationId: 'consult-child-1',
                    consultationType: 'initial',
                    age: '6-11 years',
                    ageGroup: 'child',
                    diagnosisConfirmed: true,
                    diagnosisSymptoms: {
                        typical: { symptoms: true, timing: true, variability: true, triggers: true },
                        atypical: { sputum: false, dizziness: false, chestPain: false, noisyInspiration: false }
                    },
                    diagnosisCriteria: {
                        symptoms: { wheeze: true, sob: true, chestTightness: false, cough: true },
                        patterns: { variable: true, nightWaking: false, triggers: true, viralWorsening: true },
                        airflowLimitation: { bdReversibility: true, pefVariability: false, treatmentTrial: false, challengeTest: false, visitVariation: false },
                        biomarkers: { feNo: '', bloodEosinophils: '' }
                    },
                    isOnMaintenanceTreatment: false,
                    onTreatmentDiagnosis: { status: null, fev1_percent: '' },
                    phenotypeData: {
                        allergicHistory: true,
                        familyHistory: false,
                        childhoodOnset: true,
                        coughVariant: false,
                        obesity: false,
                        worseAtWork: false,
                        persistentLimitation: false,
                        identifiedPhenotype: "Allergic Asthma"
                    },
                    child_currentGinaStep: 3,
                    child_pathway: 'track1',
                    child_initialAssessment: {
                        symptomFrequency: 'Most days',
                        nightWaking: 'Yes, once a week or more',
                        severePresentation: false
                    },
                    child_riskFactors: ['allergen_exposure'],
                    cactHistory: [{ date: getPastDate(3), score: 18 }],
                    exacerbationSeverity: 'mildModerate',
                    currentPrescription: [
                        {
                            id: 'rx-child-1',
                            medicationId: '2', // Symbicort
                            medicationName: 'Symbicort (Budesonide/Formoterol)',
                            instructions: '100/6, 1 puff daily + PRN (MART)',
                            duration: '3 months'
                        }
                    ],
                    // Defaults
                    actHistory: [], acqHistory: [], adult_symptomFrequency: null, adult_initialAssessment: null, adult_controlLevel: null, adult_controlAssessmentAnswers: null, adult_pathway: null, adult_currentGinaStep: null, adult_riskFactors: [], adult_reviewReminderDate: null, child_controlLevel: null, child_controlAssessmentAnswers: null, child_reviewReminderDate: null, youngChild_symptomPattern: null, youngChild_currentGinaStep: null, youngChild_currentTreatmentStrategy: null, youngChild_diagnosisCriteria: null, youngChild_controlLevel: null, youngChild_controlAssessmentAnswers: null, youngChild_riskFactors: [], youngChild_reviewReminderDate: null, severeAsthma: { basicInfo: { age: '', diagnosis: 'unconfirmed', asthmaOnset: 'adult', exacerbationsLastYear: '', hospitalizationsLastYear: '', sabaUse: '' }, symptoms: { poorControl: false, frequentExacerbations: false, nightWaking: false, activityLimitation: false, frequentSabaUse: false, allergenDriven: false }, medications: { icsLaba: true, icsDose: 'high', ocs: false, maintenanceOcs: false, ocsDose: '', adherence: 'good', inhalerTechnique: 'correct', mart: false, lama: false, ltra: false, azithromycin: false, biologicsAvailable: null }, biomarkers: { bloodEosinophils: '', feNo: '', sputumEosinophils: '', totalIgE: '', specificIgE: false, skinPrickTest: false, fev1: '', fev1Predicted: '' }, comorbidities: [], riskFactors: [], investigations: { chestXray: false, hrct: false, allergyTesting: false, boneDensity: false, parasiteScreen: false, cardiacAssessment: false }, status: 'screening', optimizationPlan: undefined }, severeAsthmaAssessment: { difficultToTreat: false, severeAsthma: false, type2Inflammation: false, eligibleForBiologics: false }
                }
            }
        ]
    },
    {
        id: 'dummy-young-1',
        lastName: 'Moreau',
        firstName: 'Chloé',
        dateOfBirth: '2021-11-10', // ~3 years old
        fileNumber: 'Y-3003',
        treatingPhysician: 'Dr. Who',
        createdAt: getPastDate(2),
        consultations: [
            {
                id: 'consult-young-1',
                date: getPastDate(1),
                data: {
                    activePatientId: 'dummy-young-1',
                    activeConsultationId: 'consult-young-1',
                    consultationType: 'initial',
                    age: '<=5 years',
                    ageGroup: 'youngChild',
                    diagnosisConfirmed: true,
                    diagnosisSymptoms: {
                        typical: { symptoms: true, timing: false, variability: false, triggers: true },
                        atypical: { sputum: false, dizziness: false, chestPain: false, noisyInspiration: false }
                    },
                    isOnMaintenanceTreatment: false,
                    youngChild_diagnosisCriteria: { criterion1: true, criterion2: true, criterion3: true },
                    youngChild_symptomPattern: 'infrequentViralWheeze',
                    youngChild_currentGinaStep: 1,
                    youngChild_currentTreatmentStrategy: 'preferred',
                    youngChild_controlLevel: 'wellControlled',
                    exacerbationSeverity: 'mildModerate', // History of one mild exacerbation
                    currentPrescription: [
                        {
                            id: 'rx-young-1',
                            medicationId: '1',
                            medicationName: 'Ventolin (Salbutamol)',
                            instructions: '2 puffs via spacer as needed',
                            duration: 'PRN'
                        }
                    ],
                    // Defaults
                    diagnosisCriteria: { symptoms: { wheeze: false, sob: false, chestTightness: false, cough: false }, patterns: { variable: false, nightWaking: false, triggers: false, viralWorsening: false }, airflowLimitation: { bdReversibility: false, pefVariability: false, treatmentTrial: false, challengeTest: false, visitVariation: false }, biomarkers: { feNo: '', bloodEosinophils: '' } }, onTreatmentDiagnosis: { status: null, fev1_percent: '' }, phenotypeData: { allergicHistory: null, familyHistory: null, childhoodOnset: null, coughVariant: null, obesity: null, worseAtWork: null, persistentLimitation: null, identifiedPhenotype: null }, adult_symptomFrequency: null, adult_initialAssessment: null, adult_controlLevel: null, adult_controlAssessmentAnswers: null, adult_pathway: null, adult_currentGinaStep: null, adult_riskFactors: [], adult_reviewReminderDate: null, child_currentGinaStep: null, child_initialAssessment: null, child_pathway: null, child_controlLevel: null, child_controlAssessmentAnswers: null, child_riskFactors: [], child_reviewReminderDate: null, youngChild_controlAssessmentAnswers: null, youngChild_riskFactors: [], youngChild_reviewReminderDate: null, actHistory: [], acqHistory: [], cactHistory: [], severeAsthma: { basicInfo: { age: '', diagnosis: 'unconfirmed', asthmaOnset: 'adult', exacerbationsLastYear: '', hospitalizationsLastYear: '', sabaUse: '' }, symptoms: { poorControl: false, frequentExacerbations: false, nightWaking: false, activityLimitation: false, frequentSabaUse: false, allergenDriven: false }, medications: { icsLaba: true, icsDose: 'high', ocs: false, maintenanceOcs: false, ocsDose: '', adherence: 'good', inhalerTechnique: 'correct', mart: false, lama: false, ltra: false, azithromycin: false, biologicsAvailable: null }, biomarkers: { bloodEosinophils: '', feNo: '', sputumEosinophils: '', totalIgE: '', specificIgE: false, skinPrickTest: false, fev1: '', fev1Predicted: '' }, comorbidities: [], riskFactors: [], investigations: { chestXray: false, hrct: false, allergyTesting: false, boneDensity: false, parasiteScreen: false, cardiacAssessment: false }, status: 'screening', optimizationPlan: undefined }, severeAsthmaAssessment: { difficultToTreat: false, severeAsthma: false, type2Inflammation: false, eligibleForBiologics: false }
                }
            }
        ]
    },
    {
        id: 'dummy-adult-2',
        lastName: 'Currie',
        firstName: 'Marie',
        dateOfBirth: '1990-11-07',
        fileNumber: 'A-1005',
        treatingPhysician: 'Dr. Banner',
        createdAt: getPastDate(1),
        consultations: [
            {
                id: 'consult-adult-marie-1',
                date: getPastDate(1),
                data: {
                    activePatientId: 'dummy-adult-2',
                    activeConsultationId: 'consult-adult-marie-1',
                    consultationType: 'followup',
                    age: '12+ years',
                    ageGroup: 'adult',
                    diagnosisConfirmed: true,
                    adult_currentGinaStep: 4,
                    adult_pathway: 'pathway1',
                    adult_controlLevel: 'uncontrolled',
                    adult_controlAssessmentAnswers: { daytimeSymptoms: true, activityLimitation: false, nocturnalSymptoms: true, relieverNeed: true },
                    currentPrescription: [
                        { id: 'rx-m1', medicationId: '2', medicationName: 'Symbicort 200/6', instructions: '2 puffs twice daily', duration: '3 months' }
                    ],
                    // Defaults
                    diagnosisSymptoms: { typical: { symptoms: true, timing: true, variability: true, triggers: true }, atypical: { sputum: false, dizziness: false, chestPain: false, noisyInspiration: false } }, diagnosisCriteria: { symptoms: { wheeze: false, sob: false, chestTightness: false, cough: false }, patterns: { variable: false, nightWaking: false, triggers: false, viralWorsening: false }, airflowLimitation: { bdReversibility: false, pefVariability: false, treatmentTrial: false, challengeTest: false, visitVariation: false }, biomarkers: { feNo: '', bloodEosinophils: '' } }, isOnMaintenanceTreatment: true, onTreatmentDiagnosis: { status: null, fev1_percent: '' }, phenotypeData: { allergicHistory: null, familyHistory: null, childhoodOnset: null, coughVariant: null, obesity: null, worseAtWork: null, persistentLimitation: null, identifiedPhenotype: null }, adult_symptomFrequency: null, adult_initialAssessment: null, adult_riskFactors: [], adult_reviewReminderDate: null, child_currentGinaStep: null, child_initialAssessment: null, child_pathway: null, child_controlLevel: null, child_controlAssessmentAnswers: null, child_riskFactors: [], child_reviewReminderDate: null, youngChild_symptomPattern: null, youngChild_currentGinaStep: null, youngChild_currentTreatmentStrategy: null, youngChild_diagnosisCriteria: null, youngChild_controlLevel: null, youngChild_controlAssessmentAnswers: null, youngChild_riskFactors: [], youngChild_reviewReminderDate: null, exacerbationSeverity: null, severeAsthma: { basicInfo: { age: '', diagnosis: 'unconfirmed', asthmaOnset: 'adult', exacerbationsLastYear: '', hospitalizationsLastYear: '', sabaUse: '' }, symptoms: { poorControl: false, frequentExacerbations: false, nightWaking: false, activityLimitation: false, frequentSabaUse: false, allergenDriven: false }, medications: { icsLaba: true, icsDose: 'high', ocs: false, maintenanceOcs: false, ocsDose: '', adherence: 'good', inhalerTechnique: 'correct', mart: false, lama: false, ltra: false, azithromycin: false, biologicsAvailable: null }, biomarkers: { bloodEosinophils: '', feNo: '', sputumEosinophils: '', totalIgE: '', specificIgE: false, skinPrickTest: false, fev1: '', fev1Predicted: '' }, comorbidities: [], riskFactors: [], investigations: { chestXray: false, hrct: false, allergyTesting: false, boneDensity: false, parasiteScreen: false, cardiacAssessment: false }, status: 'screening', optimizationPlan: undefined }, severeAsthmaAssessment: { difficultToTreat: false, severeAsthma: false, type2Inflammation: false, eligibleForBiologics: false }, actHistory: [], acqHistory: [], cactHistory: []
                }
            }
        ]
    }
];

export const PatientRecordsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [patients, setPatients] = useState<PatientProfile[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // If storage exists but is empty (user has no patients), load dummy data for demo
                if (Array.isArray(parsed) && parsed.length === 0) {
                    setPatients(DUMMY_PATIENTS);
                } else {
                    setPatients(parsed);
                }
            } catch (e) {
                console.error("Failed to parse patient records", e);
                setPatients(DUMMY_PATIENTS);
            }
        } else {
            // If no storage key exists at all, load dummy data
            setPatients(DUMMY_PATIENTS);
        }
    }, []);

    // Save to local storage whenever patients change
    useEffect(() => {
        if (patients.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
        }
    }, [patients]);

    const addPatient = useCallback((profileData: Omit<PatientProfile, 'id' | 'consultations' | 'createdAt'>) => {
        const newPatient: PatientProfile = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            consultations: [],
            ...profileData
        };
        setPatients(prev => [...prev, newPatient]);
    }, []);

    const updatePatient = useCallback((id: string, updates: Partial<PatientProfile>) => {
        setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }, []);

    const deletePatient = useCallback((id: string) => {
        if (window.confirm("Are you sure you want to delete this patient and all their records?")) {
            setPatients(prev => prev.filter(p => p.id !== id));
        }
    }, []);

    const saveConsultation = useCallback((patientId: string, consultationData: PatientData) => {
        const newConsultation: ConsultationRecord = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            data: consultationData
        };

        setPatients(prev => prev.map(p => {
            if (p.id === patientId) {
                return {
                    ...p,
                    consultations: [newConsultation, ...p.consultations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Ensure newest first
                };
            }
            return p;
        }));
    }, []);

    const updateConsultation = useCallback((patientId: string, consultationId: string, consultationData: PatientData) => {
        setPatients(prev => prev.map(p => {
            if (p.id === patientId) {
                return {
                    ...p,
                    consultations: p.consultations.map(c =>
                        c.id === consultationId
                            ? { ...c, data: consultationData } // Update data, keep original date/id
                            : c
                    )
                };
            }
            return p;
        }));
    }, []);

    const getPatient = useCallback((id: string) => {
        return patients.find(p => p.id === id);
    }, [patients]);

    const importPatients = useCallback((newPatients: PatientProfile[]) => {
        setPatients(prev => {
            const currentIds = new Set(prev.map(p => p.id));
            const uniqueNewPatients = newPatients.filter(p => !currentIds.has(p.id));

            if (uniqueNewPatients.length === 0) {
                alert("No new patients found to import (all IDs already exist).");
                return prev;
            }

            alert(`Successfully imported ${uniqueNewPatients.length} new patient records.`);
            return [...prev, ...uniqueNewPatients];
        });
    }, []);

    return (
        <PatientRecordsContext.Provider value={{ patients, addPatient, updatePatient, deletePatient, saveConsultation, updateConsultation, getPatient, importPatients }}>
            {children}
        </PatientRecordsContext.Provider>
    );
};

export const usePatientRecords = (): PatientRecordsContextType => {
    const context = useContext(PatientRecordsContext);
    if (!context) {
        throw new Error('usePatientRecords must be used within a PatientRecordsProvider');
    }
    return context;
};