
import React, { useMemo } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { Stethoscope, AlertTriangle, CheckCircle2, ChevronRight, HelpCircle, CheckSquare, Square, XCircle } from 'lucide-react';
import { DiagnosisSymptoms } from '../../../types';

const DiagnosisProbabilityStep: React.FC = () => {
    const { navigateTo } = useNavigation();
    const { patientData, updatePatientData } = usePatientData();
    const { diagnosisSymptoms, ageGroup } = patientData;

    const handleToggleTypical = (field: keyof DiagnosisSymptoms['typical']) => {
        updatePatientData({
            diagnosisSymptoms: {
                ...diagnosisSymptoms,
                typical: {
                    ...diagnosisSymptoms.typical,
                    [field]: !diagnosisSymptoms.typical[field]
                }
            }
        });
    };

    const handleToggleAtypical = (field: keyof DiagnosisSymptoms['atypical']) => {
        updatePatientData({
            diagnosisSymptoms: {
                ...diagnosisSymptoms,
                atypical: {
                    ...diagnosisSymptoms.atypical,
                    [field]: !diagnosisSymptoms.atypical[field]
                }
            }
        });
    };

    const assessmentResult = useMemo(() => {
        const typicalCount = Object.values(diagnosisSymptoms.typical).filter(Boolean).length;
        const atypicalCount = Object.values(diagnosisSymptoms.atypical).filter(Boolean).length;

        if (atypicalCount > 0) {
            return {
                status: 'caution',
                title: 'Decreased Probability / Caution',
                color: 'amber',
                icon: <AlertTriangle className="text-amber-600" size={24} />,
                message: "The presence of atypical features decreases the probability of asthma. Consider alternative diagnoses or further investigation (e.g., chest imaging, referral) before confirming."
            };
        }

        if (typicalCount >= 2) {
            return {
                status: 'high',
                title: 'High Probability of Asthma',
                color: 'emerald',
                icon: <CheckCircle2 className="text-emerald-600" size={24} />,
                message: "The patient presents with multiple characteristic features of asthma and no atypical signs. This pattern strongly supports a clinical diagnosis of asthma."
            };
        }

        return {
            status: 'uncertain',
            title: 'Uncertain Probability',
            color: 'slate',
            icon: <HelpCircle className="text-slate-600" size={24} />,
            message: "Few characteristic features are present. Objective testing (e.g., spirometry with reversibility) is essential to confirm the diagnosis."
        };
    }, [diagnosisSymptoms]);

    const handleContinue = () => {
        // Update confirmed flag provisionally based on probability, 
        // but the next step (GINA Box 1-2) will make the definitive confirmation based on objective tests.
        const confirmed = assessmentResult.status === 'high';
        updatePatientData({ diagnosisConfirmed: confirmed });

        // Route to the specific Diagnostic Criteria step (GINA Box 1-2) for confirmation
        if (ageGroup === 'child') {
            navigateTo('CHILD_DIAGNOSIS_STEP');
        } else {
            navigateTo('ADULT_DIAGNOSIS_STEP');
        }
    };

    const CheckboxItem: React.FC<{ 
        label: string; 
        checked: boolean; 
        onChange: () => void;
        variant: 'typical' | 'atypical';
    }> = ({ label, checked, onChange, variant }) => (
        <div 
            onClick={onChange}
            className={`flex items-center p-3 rounded-lg cursor-pointer border shadow-inner transition-all duration-200 ${
                checked 
                ? (variant === 'typical' ? 'bg-emerald-50 border-emerald-400' : 'bg-amber-50 border-amber-400')
                : 'bg-slate-100 border-slate-300 hover:bg-white'
            }`}
        >
            <div className="mr-3 mt-0.5">
                {checked 
                    ? <CheckSquare size={20} className={variant === 'typical' ? 'text-emerald-600' : 'text-amber-600'} /> 
                    : <Square size={20} className="text-slate-400" />
                }
            </div>
            <span className={`text-sm font-medium ${checked ? 'text-slate-900' : 'text-slate-600'}`}>{label}</span>
        </div>
    );

    return (
        <Card title="Diagnosis Probability Assessment" icon={<Stethoscope className="text-indigo-600" />}>
            <p className="mb-6 text-sm text-slate-600 leading-relaxed">
                Select the features present in the patient's history to assess the probability of asthma (GINA 2025 Box 1-1).
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Typical Features */}
                <div>
                    <h4 className="font-semibold text-emerald-800 mb-3 flex items-center">
                        <CheckCircle2 size={18} className="mr-2"/> Increases Probability
                    </h4>
                    <div className="space-y-3">
                        <CheckboxItem 
                            label="Respiratory symptoms (wheeze, shortness of breath, cough, chest tightness)" 
                            checked={diagnosisSymptoms.typical.symptoms} 
                            onChange={() => handleToggleTypical('symptoms')}
                            variant="typical"
                        />
                        <CheckboxItem 
                            label="Symptoms worsen at night or in early morning" 
                            checked={diagnosisSymptoms.typical.timing} 
                            onChange={() => handleToggleTypical('timing')}
                            variant="typical"
                        />
                        <CheckboxItem 
                            label="Symptoms vary over time and in intensity" 
                            checked={diagnosisSymptoms.typical.variability} 
                            onChange={() => handleToggleTypical('variability')}
                            variant="typical"
                        />
                        <CheckboxItem 
                            label="Triggers present (viral infections, exercise, allergen exposure, weather changes, laughter, irritants)" 
                            checked={diagnosisSymptoms.typical.triggers} 
                            onChange={() => handleToggleTypical('triggers')}
                            variant="typical"
                        />
                    </div>
                </div>

                {/* Atypical Features */}
                <div>
                    <h4 className="font-semibold text-amber-800 mb-3 flex items-center">
                        <XCircle size={18} className="mr-2"/> Decreases Probability
                    </h4>
                    <div className="space-y-3">
                        <CheckboxItem 
                            label="Chronic production of sputum" 
                            checked={diagnosisSymptoms.atypical.sputum} 
                            onChange={() => handleToggleAtypical('sputum')}
                            variant="atypical"
                        />
                        <CheckboxItem 
                            label="Shortness of breath associated with dizziness, light-headedness or peripheral tingling (paresthesia)" 
                            checked={diagnosisSymptoms.atypical.dizziness} 
                            onChange={() => handleToggleAtypical('dizziness')}
                            variant="atypical"
                        />
                        <CheckboxItem 
                            label="Chest pain" 
                            checked={diagnosisSymptoms.atypical.chestPain} 
                            onChange={() => handleToggleAtypical('chestPain')}
                            variant="atypical"
                        />
                        <CheckboxItem 
                            label="Exercise-induced dyspnea with noisy inspiration (stridor)" 
                            checked={diagnosisSymptoms.atypical.noisyInspiration} 
                            onChange={() => handleToggleAtypical('noisyInspiration')}
                            variant="atypical"
                        />
                    </div>
                </div>
            </div>

            {/* Assessment Result */}
            <div className={`mt-8 p-5 rounded-lg border-l-4 shadow-sm bg-${assessmentResult.color}-50 border-${assessmentResult.color}-500`}>
                <div className="flex items-start">
                    <div className="mt-1 mr-3 flex-shrink-0">{assessmentResult.icon}</div>
                    <div>
                        <h3 className={`text-lg font-bold text-${assessmentResult.color}-900`}>{assessmentResult.title}</h3>
                        <p className={`text-sm text-${assessmentResult.color}-800 mt-1`}>
                            {assessmentResult.message}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <Button 
                    onClick={handleContinue} 
                    size="xl" 
                    variant={assessmentResult.status === 'high' ? 'success' : 'primary'}
                    rightIcon={<ChevronRight />}
                >
                    {assessmentResult.status === 'caution' ? 'Acknowledge & Proceed' : 'Confirm & Continue'}
                </Button>
            </div>
        </Card>
    );
};

export default DiagnosisProbabilityStep;
