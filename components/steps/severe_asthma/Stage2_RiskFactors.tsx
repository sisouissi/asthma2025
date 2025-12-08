
import React, { useCallback, useState } from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { useNavigation } from '../../../contexts/NavigationContext';
import AssessmentCard from './AssessmentCard';
import Button from '../../ui/Button';
import { FileText, AlertTriangle, CheckSquare, Square, ChevronRight, ShieldAlert, Activity, User, Pill, HelpCircle } from 'lucide-react';
import { comorbidityOptions, riskFactorOptions } from '../../../constants/severeAsthmaData';

const CheckboxGroup: React.FC<{ options: string[]; selected: string[]; onToggle: (item: string) => void; }> = ({ options, selected, onToggle }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        {options.map((option) => (
             <div key={option} className="flex items-start p-1 cursor-pointer hover:bg-slate-50 rounded" onClick={() => onToggle(option)}>
                <div className="mt-0.5 mr-3">
                    {selected.includes(option) ? <CheckSquare size={20} className="text-sky-600"/> : <Square size={20} className="text-slate-400"/>}
                </div>
                <span className="text-sm text-slate-700">{option}</span>
            </div>
        ))}
    </div>
);

const Stage2_RiskFactors: React.FC = () => {
    const { patientData, updatePatientData } = usePatientData();
    const { navigateTo } = useNavigation();

    const updateSevereAsthmaArray = useCallback((field: 'comorbidities' | 'riskFactors', value: string) => {
        const currentArray = patientData.severeAsthma[field];
        const newArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value];
        const updates = {
            ...patientData,
            severeAsthma: {
                ...patientData.severeAsthma,
                [field]: newArray
            }
        };
        updatePatientData(updates);
    }, [patientData, updatePatientData]);

    return (
        <div>
             <div className="mb-6 p-4 bg-sky-50 border-l-4 border-sky-500 rounded-r-lg">
                <h3 className="font-bold text-sky-800 flex items-center text-lg mb-2">
                    <Activity className="mr-2" />
                    2. Look for factors contributing to symptoms
                </h3>
                <p className="text-sm text-sky-700 leading-relaxed">
                    Systematically consider modifiable factors contributing to uncontrolled symptoms, exacerbations, or poor quality of life.
                </p>
            </div>

            {/* 1. INHALER TECHNIQUE & ADHERENCE - CRITICAL FIRST STEP */}
            <AssessmentCard title="Technique & Adherence (Critical)" icon={<ShieldAlert className="text-red-600" />}>
                <div className="space-y-4">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <h4 className="font-semibold text-slate-800 text-sm mb-2">Incorrect Inhaler Technique (up to 80% patients)</h4>
                        <p className="text-xs text-slate-600 mb-2">Ask the patient to show you how they use their inhaler. Compare with a checklist or video.</p>
                        <CheckboxGroup 
                            options={["Technique checked and incorrect", "Physical demonstration provided today"]} 
                            selected={patientData.severeAsthma.riskFactors} 
                            onToggle={(item) => updateSevereAsthmaArray('riskFactors', item)} 
                        />
                    </div>

                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <h4 className="font-semibold text-slate-800 text-sm mb-2">Suboptimal Adherence (up to 75% patients)</h4>
                        <p className="text-xs text-slate-600 mb-2 italic">
                            "Many patients don't use their inhaler as prescribed. In the last 4 weeks, how many days a week have you been taking it?"
                        </p>
                        <div className="text-xs text-slate-600 mb-3 space-y-1">
                            <p>• Ask about barriers: cost, concerns about necessity/side-effects.</p>
                            <p>• Check dispensing data or use electronic monitoring if available.</p>
                            <p>• <strong>Consider FeNO suppression test:</strong> Reduced FeNO after 1 week of directly observed high-dose ICS indicates prior non-adherence.</p>
                        </div>
                         <CheckboxGroup 
                            options={["Suboptimal adherence identified", "Barriers to adherence discussed", "FeNO suppression test considered"]} 
                            selected={patientData.severeAsthma.riskFactors} 
                            onToggle={(item) => updateSevereAsthmaArray('riskFactors', item)} 
                        />
                    </div>
                </div>
            </AssessmentCard>

            {/* 2. COMORBIDITIES */}
            <AssessmentCard title="Comorbidities" icon={<FileText />}>
                <p className="text-sm text-slate-600 mb-3">
                    Review history/exam for conditions contributing to symptoms or poor QoL. Investigate according to suspicion.
                </p>
                <CheckboxGroup 
                    options={comorbidityOptions} 
                    selected={patientData.severeAsthma.comorbidities} 
                    onToggle={(item) => updateSevereAsthmaArray('comorbidities', item)} 
                />
            </AssessmentCard>

            {/* 3. SABA OVERUSE & RISK FACTORS */}
            <AssessmentCard title="Modifiable Risk Factors & Triggers" icon={<AlertTriangle className="text-amber-600"/>}>
                 <div className="mb-4 p-3 bg-amber-50 rounded border border-amber-200">
                    <h4 className="font-semibold text-amber-800 text-sm mb-1 flex items-center"><Pill size={16} className="mr-1"/> SABA Overuse Risks</h4>
                    <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
                        <li><strong>≥3 canisters/year:</strong> Increased risk of ED visit or hospitalization.</li>
                        <li><strong>≥12 canisters/year:</strong> Substantially increased risk of death.</li>
                        <li>Regular use causes beta-receptor downregulation (reduced response).</li>
                    </ul>
                </div>
                
                 <CheckboxGroup 
                    options={riskFactorOptions} 
                    selected={patientData.severeAsthma.riskFactors} 
                    onToggle={(item) => updateSevereAsthmaArray('riskFactors', item)} 
                />
            </AssessmentCard>
            
            {/* 4. PSYCHOSOCIAL & SIDE EFFECTS */}
             <AssessmentCard title="Psychosocial & Side Effects" icon={<User />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-semibold text-slate-700 mb-2">Psychosocial Factors</h4>
                        <p className="text-xs text-slate-600 mb-2">
                            Anxiety, depression, and social/economic problems are common in difficult asthma and contribute to poor adherence.
                        </p>
                         <CheckboxGroup 
                            options={["Anxiety/Depression identified", "Social/Economic barriers identified"]} 
                            selected={patientData.severeAsthma.riskFactors} 
                            onToggle={(item) => updateSevereAsthmaArray('riskFactors', item)} 
                        />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-700 mb-2">Medication Side Effects</h4>
                        <p className="text-xs text-slate-600 mb-2">
                            Systemic (OCS) or local (dysphonia, candidiasis) side effects reduce QoL and adherence. Check interactions (e.g., P450 inhibitors like itraconazole).
                        </p>
                         <CheckboxGroup 
                            options={["Local side-effects (thrush, voice)", "Systemic side-effects (OCS related)"]} 
                            selected={patientData.severeAsthma.riskFactors} 
                            onToggle={(item) => updateSevereAsthmaArray('riskFactors', item)} 
                        />
                    </div>
                </div>
            </AssessmentCard>

            <div className="mt-6 border-t border-slate-300 pt-6">
                 <Button 
                    onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_3')}
                    fullWidth
                    size="lg"
                    variant="primary"
                    rightIcon={<ChevronRight />}
                 >
                    Proceed to Optimization (Stage 3)
                </Button>
            </div>
        </div>
    );
};

export default Stage2_RiskFactors;
