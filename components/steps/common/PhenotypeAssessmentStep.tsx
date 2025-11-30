
import React, { useEffect, useMemo } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { Users, Activity, ChevronRight, ClipboardList, Stethoscope, CheckSquare, Square } from '../../../constants/icons';
import { PhenotypeData } from '../../../types';

const PhenotypeAssessmentStep: React.FC = () => {
    const { navigateTo } = useNavigation();
    const { patientData, updatePatientData } = usePatientData();
    const { phenotypeData, ageGroup } = patientData;

    // Initialize phenotype data if missing
    useEffect(() => {
        if (phenotypeData.allergicHistory === null) {
            updatePatientData({
                phenotypeData: {
                    allergicHistory: false,
                    familyHistory: false,
                    childhoodOnset: false,
                    coughVariant: false,
                    obesity: false,
                    worseAtWork: false,
                    persistentLimitation: false,
                    identifiedPhenotype: null
                } as unknown as PhenotypeData
            });
        }
    }, []);

    const handleToggle = (field: keyof PhenotypeData) => {
        const current = phenotypeData[field];
        updatePatientData({
            phenotypeData: {
                ...phenotypeData,
                [field]: !current
            }
        });
    };

    // Logic to infer phenotype
    const suggestedPhenotype = useMemo(() => {
        const { allergicHistory, familyHistory, childhoodOnset, coughVariant, obesity, worseAtWork, persistentLimitation } = phenotypeData;
        
        if (coughVariant) return "Cough Variant Asthma";
        if (persistentLimitation) return "Asthma with Persistent Airflow Limitation";
        if (obesity) return "Asthma with Obesity";
        if (worseAtWork && ageGroup === 'adult') return "Occupational / Work-Exacerbated Asthma";
        
        if (allergicHistory || familyHistory || childhoodOnset) return "Allergic Asthma";
        
        if (!childhoodOnset && !allergicHistory && ageGroup === 'adult') return "Adult-onset (Non-allergic) Asthma";
        
        return "Classic Asthma (Unspecified)";
    }, [phenotypeData, ageGroup]);

    const handleContinue = () => {
        // Save the inferred phenotype
        updatePatientData({
            phenotypeData: {
                ...phenotypeData,
                identifiedPhenotype: suggestedPhenotype
            }
        });

        // Navigate based on age group
        if (ageGroup === 'adult') {
            // Navigate to Baseline ACT before Symptom Frequency for Adults
            navigateTo('ADULT_BASELINE_ACT_STEP');
        } else if (ageGroup === 'child') {
            navigateTo('CHILD_INITIAL_ASSESSMENT_STEP');
        } else {
            // Fallback, though YoungChild usually skips this
            navigateTo('YOUNG_CHILD_SYMPTOM_PATTERN_STEP');
        }
    };

    const ToggleQuestion: React.FC<{ label: string; field: keyof PhenotypeData }> = ({ label, field }) => (
        <div 
            onClick={() => handleToggle(field)}
            className="flex items-center p-3 rounded-md bg-slate-100 border border-slate-300 shadow-inner cursor-pointer hover:bg-white transition-colors"
        >
            <div className="mr-3 text-slate-500">
                {phenotypeData[field] ? <CheckSquare className="text-indigo-600" size={20} /> : <Square size={20} />}
            </div>
            <span className={`text-sm font-medium ${phenotypeData[field] ? 'text-slate-900' : 'text-slate-600'}`}>{label}</span>
        </div>
    );

    return (
        <Card title="Clinical Phenotype Assessment" icon={<Users className="text-indigo-600" />}>
            <p className="mb-6 text-sm text-slate-600">
                Recognizing clinical phenotypes can help tailor management strategies (GINA 2025, Box 1-2). Answer the following to identify the most likely phenotype.
            </p>

            <div className="space-y-6">
                <div>
                    <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center">
                        <Stethoscope size={16} className="mr-2"/> Clinical History & Allergy
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                        <ToggleQuestion label="History of allergic disease (eczema, allergic rhinitis, food/drug allergy)?" field="allergicHistory" />
                        <ToggleQuestion label="Family history of asthma or allergy?" field="familyHistory" />
                        <ToggleQuestion label="Did symptoms start in childhood?" field="childhoodOnset" />
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center">
                        <Activity size={16} className="mr-2"/> Symptom Characteristics
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                        <ToggleQuestion label="Is cough the ONLY respiratory symptom?" field="coughVariant" />
                        <ToggleQuestion label="Is the patient obese (BMI ≥ 30) with prominent respiratory symptoms?" field="obesity" />
                        {ageGroup === 'adult' && (
                            <ToggleQuestion label="Do symptoms worsen specifically at work?" field="worseAtWork" />
                        )}
                        <ToggleQuestion label="Persistent airflow limitation despite treatment?" field="persistentLimitation" />
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg">
                <h4 className="font-semibold text-indigo-900 flex items-center">
                    <ClipboardList size={20} className="mr-2"/>
                    Likely Phenotype: {suggestedPhenotype}
                </h4>
                <p className="text-xs text-indigo-700 mt-1">
                    Based on the provided responses. This helps guide treatment choices (e.g., responsiveness to ICS).
                </p>
            </div>

            <div className="mt-8">
                <Button 
                    onClick={handleContinue} 
                    fullWidth 
                    size="xl" 
                    rightIcon={<ChevronRight />}
                    variant="primary"
                >
                    Confirm & Continue to Baseline Assessment
                </Button>
            </div>
        </Card>
    );
};

export default PhenotypeAssessmentStep;
