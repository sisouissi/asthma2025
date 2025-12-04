import React, { useCallback, useEffect, useState } from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { useNavigation } from '../../../contexts/NavigationContext';
import AssessmentCard from './AssessmentCard';
import Button from '../../ui/Button';
import { User, Heart, Info, ChevronRight, AlertTriangle, Stethoscope, Search, Activity, HelpCircle, ArrowRight, CheckSquare, Square, ClipboardList } from '../../../constants/icons';

const Stage1_PatientAssessment: React.FC = () => {
    const { patientData, updatePatientData } = usePatientData();
    const { navigateTo } = useNavigation();
    
    // Check if we are in Clinical Mode (Active Patient) or Training Mode
    const isClinicalMode = !!patientData.activePatientId;

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

    // --- INTERACTIVE QUESTIONNAIRE FOR TRAINING MODE ---
    const [trainingAnswers, setTrainingAnswers] = useState({
        uncontrolled: false,
        highTreatment: false,
        exacerbations: false
    });

    const handleTrainingToggle = (field: keyof typeof trainingAnswers) => {
        setTrainingAnswers(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const trainingClassification = (() => {
        if ((trainingAnswers.uncontrolled || trainingAnswers.exacerbations) && trainingAnswers.highTreatment) {
            return { text: "Difficult-to-Treat Asthma", color: "orange" };
        }
        if (trainingAnswers.uncontrolled || trainingAnswers.exacerbations) {
            return { text: "Uncontrolled Asthma", color: "amber" };
        }
        return { text: "Assessment Pending", color: "slate" };
    })();

    return (
        <div>
            {/* 1. DEFINITION & SCOPE (Updated per GINA 2025) */}
            <div className="mb-6 p-4 bg-slate-50 border-l-4 border-slate-500 rounded-r-lg shadow-sm">
                <h3 className="font-bold text-slate-800 flex items-center text-lg">
                    <Info className="mr-2 text-slate-600" />
                    Definition: Difficult-to-Treat vs. Severe Asthma
                </h3>
                <div className="text-sm text-slate-700 mt-2 space-y-2 leading-relaxed">
                    <p><strong>Difficult-to-treat asthma:</strong> Asthma that is uncontrolled despite GINA Step 4 or 5 treatment (e.g. medium/high dose ICS-LABA or maintenance OCS), or that requires such treatment to maintain control. It does <em>not</em> mean a "difficult patient".</p>
                    <p><strong>Severe asthma:</strong> A subset of difficult-to-treat asthma. It means asthma that is uncontrolled <em>despite</em> adherence to maximal optimized therapy and management of contributory factors, or that worsens when high-dose treatment is decreased.</p>
                    <p className="italic text-xs text-slate-500 border-t border-slate-200 pt-1 mt-1">
                        "Severe asthma" is a retrospective label. Diagnosis can only be confirmed after optimization (Stage 3) and review (Stage 4).
                    </p>
                </div>
            </div>

            {/* --- TRAINING MODE: INTERACTIVE CLASSIFICATION --- */}
            {!isClinicalMode && (
                <AssessmentCard title="Interactive Classification (Training)" icon={<Activity className="text-violet-600"/>}>
                    <p className="text-sm text-slate-600 mb-4">
                        Use this tool to practice classifying patients based on GINA criteria. Select the features present:
                    </p>
                    <div className="space-y-3 mb-4">
                        <div onClick={() => handleTrainingToggle('uncontrolled')} className="flex items-center p-3 bg-white border rounded cursor-pointer hover:bg-slate-50">
                            {trainingAnswers.uncontrolled ? <CheckSquare className="text-violet-600 mr-3"/> : <Square className="text-slate-400 mr-3"/>}
                            <span className="text-sm text-slate-700">Poor Symptom Control (ACQ-5 &gt; 1.5, ACT &lt; 20)</span>
                        </div>
                        <div onClick={() => handleTrainingToggle('exacerbations')} className="flex items-center p-3 bg-white border rounded cursor-pointer hover:bg-slate-50">
                            {trainingAnswers.exacerbations ? <CheckSquare className="text-violet-600 mr-3"/> : <Square className="text-slate-400 mr-3"/>}
                            <span className="text-sm text-slate-700">Frequent Exacerbations (≥2/year requiring OCS)</span>
                        </div>
                         <div onClick={() => handleTrainingToggle('highTreatment')} className="flex items-center p-3 bg-white border rounded cursor-pointer hover:bg-slate-50">
                            {trainingAnswers.highTreatment ? <CheckSquare className="text-violet-600 mr-3"/> : <Square className="text-slate-400 mr-3"/>}
                            <span className="text-sm text-slate-700">Current Rx: Medium/High-dose ICS-LABA or OCS</span>
                        </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg border-l-4 bg-${trainingClassification.color}-50 border-${trainingClassification.color}-500`}>
                        <h4 className={`font-bold text-${trainingClassification.color}-800`}>Result: {trainingClassification.text}</h4>
                        {trainingClassification.text.includes("Difficult") && (
                            <p className="text-xs text-slate-600 mt-1">This patient is a candidate for the full Severe Asthma workup.</p>
                        )}
                    </div>
                </AssessmentCard>
            )}

            {/* --- CLINICAL MODE: STREAMLINED SUMMARY --- */}
            {isClinicalMode && (
                <AssessmentCard title="Imported Clinical Data (Step 5 Assessment)" icon={<ClipboardList className="text-teal-600"/>}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div className="p-3 bg-slate-50 rounded border border-slate-200">
                            <span className="block text-xs text-slate-500 uppercase font-bold">Exacerbations (1y)</span>
                            <span className="text-lg font-semibold text-slate-800">{severeAsthma.basicInfo.exacerbationsLastYear || '0'}</span>
                        </div>
                         <div className="p-3 bg-slate-50 rounded border border-slate-200">
                            <span className="block text-xs text-slate-500 uppercase font-bold">SABA Use (Cans/1y)</span>
                            <span className="text-lg font-semibold text-slate-800">{severeAsthma.basicInfo.sabaUse || '0'}</span>
                        </div>
                         <div className="p-3 bg-slate-50 rounded border border-slate-200">
                            <span className="block text-xs text-slate-500 uppercase font-bold">Current Status</span>
                            <span className="text-lg font-semibold text-orange-700">Difficult-to-Treat</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 italic">
                        Data imported from previous consultation record. Verify if necessary.
                    </p>
                </AssessmentCard>
            )}

            {/* 4. DEMOGRAPHICS FORM (Shared) */}
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
                    {/* Only show inputs if editable/needed, otherwise read-only view for clinical mode could be better, but keep editable for correction */}
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
            
            {/* ... (Remaining sections: Confirm Diagnosis, Referral Criteria etc. kept as is) ... */}
             <AssessmentCard title="1. Confirm Diagnosis & Exclude Differentials" icon={<Stethoscope />}>
                {/* ... Content from previous update ... */}
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
                            <div className="p-2 bg-slate-50 rounded border border-slate-200"><span className="font-bold block text-slate-700">Dyspnea mimics:</span>COPD, Obesity, Cardiac disease, Deconditioning.</div>
                            <div className="p-2 bg-slate-50 rounded border border-slate-200"><span className="font-bold block text-slate-700">Cough mimics:</span>VCD, Post-nasal drip, GERD, Bronchiectasis, ACE inhibitors.</div>
                            <div className="p-2 bg-slate-50 rounded border border-slate-200"><span className="font-bold block text-slate-700">Wheeze mimics:</span>Obesity, COPD, Tracheobronchomalacia, VCD.</div>
                        </div>
                    </div>
                </div>
            </AssessmentCard>

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

            <div className="mt-6 p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-start">
                    <Info className="text-sky-600 mr-3 mt-1" size={20} />
                    <div>
                        <h4 className="font-semibold text-sky-800 mb-2">Current Assessment Status</h4>
                        <div className="space-y-2 text-sm">
                            <p className="text-orange-700 font-medium">
                                <strong>Status:</strong> Difficult-to-Treat Asthma (Confirmed)
                            </p>
                             <p className="text-slate-600 text-xs">
                                Note: Diagnosis of "Severe Asthma" can only be confirmed retrospectively after optimization (Stage 3) and review (Stage 4).
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 border-t border-slate-300 pt-4">
                     <Button 
                        onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_2')}
                        fullWidth
                        size="lg"
                        variant="primary"
                        rightIcon={<ChevronRight />}
                     >
                        Proceed to Risk Factor Assessment (Stage 2)
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