

import React, { useCallback, useEffect } from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { useNavigation } from '../../../contexts/NavigationContext';
import AssessmentCard from './AssessmentCard';
import Button from '../../ui/Button';
import { BarChart3, Calendar, Square, CheckSquare, ChevronRight, ClipboardList } from 'lucide-react';

const Stage6_PhenotypeAssessment: React.FC = () => {
    const { patientData, updatePatientData } = usePatientData();
    const { navigateTo } = useNavigation();

    // Scroll to top on mount to ensure user sees the input form
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const updateBiomarker = useCallback((field: string, value: any) => {
        const updates = {
            ...patientData,
            severeAsthma: {
                ...patientData.severeAsthma,
                biomarkers: {
                    ...patientData.severeAsthma.biomarkers,
                    [field]: value,
                }
            }
        };
        updatePatientData(updates);
    }, [patientData, updatePatientData]);

    const { biomarkers, symptoms } = patientData.severeAsthma;

    return (
        <div>
            <AssessmentCard title="Type 2 Inflammation Assessment" icon={<BarChart3 />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Blood Eosinophils (/μL)" type="number" value={biomarkers.bloodEosinophils} onChange={(e: any) => updateBiomarker('bloodEosinophils', e.target.value)} placeholder="e.g., 300" note="150/μL or more suggests Type 2 inflammation" />
                    <InputField label="FeNO (ppb)" type="number" value={biomarkers.feNo} onChange={(e: any) => updateBiomarker('feNo', e.target.value)} placeholder="e.g., 25" note="More than 25 ppb suggests Type 2 inflammation" />
                    <InputField label="Sputum Eosinophils (%)" type="number" value={biomarkers.sputumEosinophils} onChange={(e: any) => updateBiomarker('sputumEosinophils', e.target.value)} placeholder="e.g., 3" note="2% or more suggests Type 2 inflammation" />
                    <InputField label="Total IgE (IU/mL)" type="number" value={biomarkers.totalIgE} onChange={(e: any) => updateBiomarker('totalIgE', e.target.value)} placeholder="e.g., 400" note="For omalizumab: 30-1500 IU/mL" />
                    <InputField label="FEV1 (% predicted)" type="number" value={biomarkers.fev1Predicted} onChange={(e: any) => updateBiomarker('fev1Predicted', e.target.value)} placeholder="e.g., 65" note="Less than 65% may predict better anti-IL5 response" />
                </div>
                <div className="mt-4">
                    <h6 className="font-medium text-sm mb-2">Allergy Assessment:</h6>
                    <Checkbox label="Clinically allergen-driven symptoms" checked={symptoms.allergenDriven} onChange={(e: any) => {
                        const updates = { ...patientData, severeAsthma: { ...patientData.severeAsthma, symptoms: { ...patientData.severeAsthma.symptoms, allergenDriven: e.target.checked } } };
                        updatePatientData(updates);
                    }} />
                    <Checkbox label="Specific IgE testing positive for relevant allergens" checked={biomarkers.specificIgE} onChange={(e: any) => updateBiomarker('specificIgE', e.target.checked)} />
                    <Checkbox label="Skin prick testing positive for inhaled allergens" checked={biomarkers.skinPrickTest} onChange={(e: any) => updateBiomarker('skinPrickTest', e.target.checked)} />
                </div>
            </AssessmentCard>

            <AssessmentCard title="Biomarker Timing & Considerations" icon={<Calendar />}>
                <div className="bg-yellow-50 p-3 rounded-lg">
                    <h6 className="font-semibold text-yellow-800 mb-2">Important Assessment Notes:</h6>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                        <li>Biomarkers should be assessed on high-dose ICS or daily OCS.</li>
                        <li>OCS suppresses eosinophils, sputum eosinophils, and FeNO.</li>
                        <li>Consider repeating up to 3 times before excluding Type 2 inflammation if initial results are low.</li>
                    </ul>
                </div>
            </AssessmentCard>

            <AssessmentCard title="Data Summary for Phenotype Evaluation" icon={<ClipboardList />}>
                <div className="space-y-2 text-sm">
                    <p>Please review the entered biomarker data before proceeding.</p>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1 p-2 bg-slate-50 rounded-md">
                        <li><strong>Eosinophils:</strong> {biomarkers.bloodEosinophils || "N/A"} /μL</li>
                        <li><strong>FeNO:</strong> {biomarkers.feNo || "N/A"} ppb</li>
                        <li><strong>Sputum Eos:</strong> {biomarkers.sputumEosinophils || "N/A"} %</li>
                        <li><strong>Allergen Driven:</strong> {symptoms.allergenDriven ? "Yes" : "No"}</li>
                    </ul>
                </div>
            </AssessmentCard>

            <div className="mt-6 border-t border-slate-300 pt-6">
                <Button
                    onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_7')}
                    fullWidth
                    size="lg"
                    variant="primary"
                    rightIcon={<ChevronRight />}
                >
                    View Treatment Options
                </Button>
            </div>
        </div>
    );
};


const InputField: React.FC<any> = ({ label, note, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input className="w-full p-2 bg-slate-100 border border-slate-300 rounded-md shadow-inner text-slate-800 placeholder-slate-500 focus:bg-white focus:shadow-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200" {...props} />
        {note && <p className="text-xs text-gray-600 mt-1">{note}</p>}
    </div>
);

const Checkbox: React.FC<any> = ({ label, checked, onChange }) => (
    <label className="flex items-center cursor-pointer text-sm">
        <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
        {checked ? <CheckSquare size={20} className="text-sky-600 mr-2" /> : <Square size={20} className="text-slate-400 mr-2" />}
        {label}
    </label>
);

export default Stage6_PhenotypeAssessment;