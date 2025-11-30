
import React, { useCallback, useEffect, useState } from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { useNavigation } from '../../../contexts/NavigationContext';
import AssessmentCard from './AssessmentCard';
import Button from '../../ui/Button';
import { User, Heart, Info, ChevronRight, AlertTriangle, Stethoscope, Search, Activity, HelpCircle, ArrowRight, CheckSquare, Square } from 'lucide-react';

const Stage1_PatientAssessment: React.FC = () => {
    const { patientData, updatePatientData } = usePatientData();
    const { navigateTo } = useNavigation();
    const [showDifferentials, setShowDifferentials] = useState(false);

    const updateSevereAsthmaData = useCallback((section: string, field: string, value: any) => {
        const updates = {
            ...patientData,
            severeAsthma: {
                ...patientData.severeAsthma,
                [section]: {
                    ...(patientData.severeAsthma[section as keyof typeof patientData.severeAsthma] as object),
                    [field]: value
                }
            }
        };
        updatePatientData(updates);
    }, [patientData, updatePatientData]);

    const { severeAsthma, severeAsthmaAssessment } = patientData;
    const { age, asthmaOnset } = severeAsthma.basicInfo;

    // Automatically set asthma onset if age is < 18
    useEffect(() => {
        const ageNum = parseInt(age);
        if (!isNaN(ageNum) && ageNum < 18) {
            if (asthmaOnset !== 'childhood') {
                updateSevereAsthmaData('basicInfo', 'asthmaOnset', 'childhood');
            }
        }
    }, [age, asthmaOnset, updateSevereAsthmaData]);
    
    const isAgeUnder18 = !isNaN(parseInt(age)) && parseInt(age) < 18;

    return (
        <div>
            {/* 1. DEFINITION & SCOPE */}
            <div className="mb-6 p-4 bg-slate-50 border-l-4 border-slate-500 rounded-r-lg shadow-sm">
                <h3 className="font-bold text-slate-800 flex items-center text-lg">
                    <Info className="mr-2 text-slate-600" />
                    Definition: Difficult-to-Treat Asthma
                </h3>
                <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                    Patients with persistent symptoms and/or exacerbations despite medium/high-dose ICS + controller (LABA/OCS), or those requiring high-dose treatment to maintain control. 
                    <br/><span className="italic text-xs text-slate-500">Note: Difficult-to-treat asthma does not mean a "difficult patient".</span>
                </p>
            </div>

            {/* 2. DIAGNOSIS CONFIRMATION (Enriched) */}
            <AssessmentCard title="1. Confirm Diagnosis & Exclude Differentials" icon={<Stethoscope />}>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md mb-4">
                    <div className="flex items-start">
                        <AlertTriangle className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" size={18} />
                        <p className="text-xs text-amber-800 font-medium">
                            <strong>Crucial:</strong> In 12–50% of people assumed to have severe asthma, asthma is NOT the correct diagnosis. Confirmation is mandatory.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm text-slate-700 mb-2 flex items-center">
                            <Search size={16} className="mr-2 text-indigo-600"/>
                            Are symptoms typically asthma?
                        </h4>
                        <p className="text-xs text-slate-500 mb-2">Check history and exam to rule out mimics:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            <div className="p-2 bg-slate-50 rounded border border-slate-200">
                                <span className="font-bold block text-slate-700">Dyspnea mimics:</span>
                                COPD, Obesity, Cardiac disease, Deconditioning.
                            </div>
                            <div className="p-2 bg-slate-50 rounded border border-slate-200">
                                <span className="font-bold block text-slate-700">Cough mimics:</span>
                                Inducible Laryngeal Obstruction (VCD), Post-nasal drip, GERD, Bronchiectasis, ACE inhibitors.
                            </div>
                            <div className="p-2 bg-slate-50 rounded border border-slate-200">
                                <span className="font-bold block text-slate-700">Wheeze mimics:</span>
                                Obesity, COPD, Tracheobronchomalacia, VCD.
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                        <h4 className="font-semibold text-sm text-slate-700 mb-2 flex items-center">
                            <Activity size={16} className="mr-2 text-emerald-600"/>
                            Objective Confirmation
                        </h4>
                        <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                            <li><strong>Spirometry:</strong> Assess baseline lung function. Check flow-volume curve for upper airway obstruction.</li>
                            <li><strong>Reversibility:</strong> Increase in FEV1 &gt;12% AND &gt;200mL.</li>
                            <li><strong>If Initial Test Negative:</strong> Repeat when symptomatic or after withholding BD. Consider stepping treatment up/down before further tests.</li>
                            <li><strong>Alternative:</strong> PEF variability (increase &ge;20%). Bronchial provocation if spirometry normal.</li>
                        </ul>
                    </div>
                </div>
            </AssessmentCard>

            {/* 3. REFERRAL CRITERIA (New Section) */}
            <AssessmentCard title="Criteria for Early Specialist Referral" icon={<ArrowRight className="text-red-500"/>}>
                <p className="text-sm text-slate-600 mb-3">Consider referral to a severe asthma clinic at <strong>any stage</strong> if:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                     <ReferralCheckItem label="Difficulty confirming diagnosis" />
                     <ReferralCheckItem label="Frequent urgent healthcare utilization" />
                     <ReferralCheckItem label="Need for frequent or maintenance OCS" />
                     <ReferralCheckItem label="Suspected occupational asthma" />
                     <ReferralCheckItem label="Confirmed food allergy / Anaphylaxis history (Risk of death)" />
                     <ReferralCheckItem label="Symptoms suggestive of cardiac/infective cause" />
                     <ReferralCheckItem label="Complications (e.g. Bronchiectasis)" />
                     <ReferralCheckItem label="Multimorbidity present" />
                </div>
            </AssessmentCard>

            {/* 4. DEMOGRAPHICS (Existing) */}
            <AssessmentCard title="Patient Demographics & Clinical History" icon={<User />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Age" type="number" value={age} onChange={(e: any) => updateSevereAsthmaData('basicInfo', 'age', e.target.value)} placeholder="Age in years" />
                    <SelectField 
                        label="Asthma Onset" 
                        value={asthmaOnset} 
                        onChange={(e: any) => updateSevereAsthmaData('basicInfo', 'asthmaOnset', e.target.value)} 
                        options={[{ value: 'childhood', label: 'Childhood onset (< 18 years)' }, { value: 'adult', label: 'Adult onset (>=18 years)' }]} 
                        disabled={isAgeUnder18}
                        note={isAgeUnder18 ? 'Automatically set due to age < 18.' : ''}
                    />
                    <InputField label="Exacerbations Last Year" type="number" value={severeAsthma.basicInfo.exacerbationsLastYear} onChange={(e: any) => updateSevereAsthmaData('basicInfo', 'exacerbationsLastYear', e.target.value)} placeholder="Number requiring OCS" />
                    <InputField label="Hospitalizations Last Year" type="number" value={severeAsthma.basicInfo.hospitalizationsLastYear} onChange={(e: any) => updateSevereAsthmaData('basicInfo', 'hospitalizationsLastYear', e.target.value)} placeholder="Severe exacerbations" />
                    <InputField label="SABA Use (canisters/year)" type="number" value={severeAsthma.basicInfo.sabaUse} onChange={(e: any) => updateSevereAsthmaData('basicInfo', 'sabaUse', e.target.value)} placeholder="3 or more/year = high risk" />
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <Checkbox 
                        label="Clinically allergen-driven symptoms (e.g. cat, pollen)" 
                        checked={severeAsthma.symptoms.allergenDriven} 
                        onChange={(e: any) => updateSevereAsthmaData('symptoms', 'allergenDriven', e.target.checked)} 
                    />
                </div>
            </AssessmentCard>

            <AssessmentCard title="Current Medications & Treatment Response" icon={<Heart />}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField label="ICS Dose" value={severeAsthma.medications.icsDose} onChange={(e: any) => updateSevereAsthmaData('medications', 'icsDose', e.target.value)} options={[{ value: 'low', label: 'Low dose' }, { value: 'medium', label: 'Medium dose' }, { value: 'high', label: 'High dose' }]} />
                        <SelectField label="Inhaler Technique" value={severeAsthma.medications.inhalerTechnique} onChange={(e: any) => updateSevereAsthmaData('medications', 'inhalerTechnique', e.target.value)} options={[{ value: 'correct', label: 'Correct technique' }, { value: 'incorrect', label: 'Incorrect (up to 80% patients)' }, { value: 'unknown', label: 'Not assessed' }]} />
                    </div>
                    <Checkbox label="Currently on ICS-LABA combination" checked={severeAsthma.medications.icsLaba} onChange={(e: any) => updateSevereAsthmaData('medications', 'icsLaba', e.target.checked)} />
                    <Checkbox label="Maintenance oral corticosteroids (OCS)" checked={severeAsthma.medications.maintenanceOcs} onChange={(e: any) => updateSevereAsthmaData('medications', 'maintenanceOcs', e.target.checked)} />
                    <SelectField label="Medication Adherence" value={severeAsthma.medications.adherence} onChange={(e: any) => updateSevereAsthmaData('medications', 'adherence', e.target.value)} options={[{ value: 'good', label: 'Good adherence (>80%)' }, { value: 'suboptimal', label: 'Suboptimal adherence (50-80%)' }, { value: 'poor', label: 'Poor adherence (<50%)' }]} note="Up to 75% of asthma patients have suboptimal adherence" />
                </div>
            </AssessmentCard>
            
            <div className="mt-6 p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-start">
                    <Info className="text-sky-600 mr-3 mt-1" size={20} />
                    <div>
                        <h4 className="font-semibold text-sky-800 mb-2">Live Assessment Results</h4>
                        <div className="space-y-2 text-sm">
                            <p className={severeAsthmaAssessment.difficultToTreat ? "text-orange-700 font-medium" : "text-green-700"}>
                                <strong>Difficult-to-treat asthma:</strong> {severeAsthmaAssessment.difficultToTreat ? "Yes" : "No"}
                            </p>
                            <p className={severeAsthmaAssessment.severeAsthma ? "text-red-700 font-medium" : "text-green-700"}>
                                <strong>Severe asthma:</strong> {severeAsthmaAssessment.severeAsthma ? "Likely" : "No"}
                            </p>
                        </div>
                    </div>
                </div>

                {(severeAsthmaAssessment.difficultToTreat || severeAsthmaAssessment.severeAsthma) && (
                    <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-md">
                        <div className="flex items-center">
                            <AlertTriangle size={20} className="text-red-600 mr-3" />
                            <h4 className="font-semibold text-red-800">Referral Recommended</h4>
                        </div>
                        <p className="text-sm text-red-700 mt-1 pl-8">
                            Based on GINA criteria, referral for expert advice is recommended.
                        </p>
                    </div>
                )}

                <div className="mt-6 border-t border-slate-300 pt-4">
                     <Button 
                        onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_2')}
                        fullWidth
                        size="lg"
                        variant="primary"
                        rightIcon={<ChevronRight />}
                     >
                        Confirm Assessment & Assess Risk Factors
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Helper sub-components for form fields
const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input className="w-full p-2 bg-slate-100 border border-slate-300 rounded-md shadow-inner text-slate-800 placeholder-slate-500 focus:bg-white focus:shadow-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200" {...props} />
    </div>
);

const SelectField: React.FC<any> = ({ label, options, note, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <select className="w-full p-2 bg-slate-100 border border-slate-300 rounded-md shadow-inner text-slate-800 focus:bg-white focus:shadow-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none" {...props}>
            {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {note && <p className="text-xs text-gray-600 mt-1">{note}</p>}
    </div>
);

const Checkbox: React.FC<any> = ({ label, ...props }) => (
     <label className="flex items-center cursor-pointer text-sm mb-2">
        <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500" {...props} />
        {label}
    </label>
);

// Local helper for referral checklist (visual only for this stage)
const ReferralCheckItem: React.FC<{label: string}> = ({ label }) => {
    const [checked, setChecked] = useState(false);
    return (
        <div 
            className={`flex items-start p-2 rounded cursor-pointer border ${checked ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}
            onClick={() => setChecked(!checked)}
        >
            <div className={`mr-2 mt-0.5 ${checked ? 'text-red-500' : 'text-slate-300'}`}>
                {checked ? <CheckSquare size={16}/> : <Square size={16}/>}
            </div>
            <span className={`${checked ? 'text-red-800 font-medium' : 'text-slate-600'}`}>{label}</span>
        </div>
    );
}

export default Stage1_PatientAssessment;
