import React from 'react';
import { User, AlertTriangle, Route, ClipboardList, Activity, Stethoscope, Calendar, CheckCircle2, Droplets, Pill, Zap, ShieldCheck } from '../../constants/icons';
import { adultRiskFactorsList, childRiskFactorsList, youngChildRiskFactorsList } from '../../constants/riskFactorData';
import { adultTreatments, childTreatments, youngChildTreatments } from '../../constants/treatmentData';
import { TreatmentDetail, ControlAnswers, PatientData, PatientProfile, PhenotypeData } from '../../types';

const controlQuestionLabels: Record<keyof ControlAnswers, string> = {
    daytimeSymptoms: 'Daytime symptoms >2x/week?',
    nocturnalSymptoms: 'Any night waking?',
    relieverNeed: 'Reliever need >2x/week?',
    activityLimitation: 'Any activity limitation?',
};

const SummarySection: React.FC<{ title: string; icon: React.ReactElement; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="py-4 border-b border-slate-200 last:border-b-0 break-inside-avoid">
        <h3 className="font-semibold text-slate-800 mb-3 flex items-center text-lg">
            {React.cloneElement(icon as React.ReactElement<any>, { size: 22, className: "mr-3 text-slate-500"})}
            {title}
        </h3>
        <div className="pl-10 space-y-2 text-sm text-slate-700">
            {children}
        </div>
    </div>
);

const SummaryItem: React.FC<{ label: string; value: string | number | boolean | null | undefined }> = ({ label, value }) => {
    let displayValue: React.ReactNode;
    if (typeof value === 'boolean') {
        displayValue = value ? 'Yes' : 'No';
    } else if (value === null || value === undefined || value === '') {
        displayValue = <span className="text-slate-400 italic">Not specified</span>;
    } else {
        displayValue = String(value);
    }
    
    return (
        <div className="flex justify-between items-start py-1">
            <span className="font-medium text-slate-600 mr-4">{label}:</span>
            <span className="text-right font-semibold text-slate-800">{displayValue}</span>
        </div>
    );
};

const ListSummary: React.FC<{ label: string; items: string[] }> = ({ label, items }) => (
    <div>
        <span className="font-medium text-slate-600">{label}:</span>
        {items.length > 0 ? (
            <ul className="list-disc list-inside mt-1 pl-2">
                {items.map(item => <li key={item} className="text-slate-800 font-semibold">{item}</li>)}
            </ul>
        ) : (
            <span className="text-slate-400 italic ml-2">None specified</span>
        )}
    </div>
);

interface ClinicalProfileSummaryProps {
    patientData: PatientData;
    patientProfile?: PatientProfile;
}

const ClinicalProfileSummary: React.FC<ClinicalProfileSummaryProps> = ({ patientData, patientProfile }) => {
    const { ageGroup, phenotypeData, diagnosisSymptoms, diagnosisCriteria, isOnMaintenanceTreatment, onTreatmentDiagnosis, exacerbationSeverity, severeAsthma } = patientData;
    
    if (!ageGroup) {
        return <p className="text-center text-slate-500 p-8">Incomplete data.</p>
    }
    
    const riskFactorIds = patientData[`${ageGroup}_riskFactors`] || [];
    let sourceList: { id: string, label: string }[] = [];
    switch (ageGroup) {
        case 'adult': sourceList = adultRiskFactorsList; break;
        case 'child': sourceList = childRiskFactorsList; break;
        case 'youngChild': sourceList = youngChildRiskFactorsList; break;
    }
    const riskFactorLabels = riskFactorIds.map(id => {
        const factor = sourceList.find(f => f.id === id);
        return factor ? factor.label : id; 
    });

    const ginaStep = patientData[`${ageGroup}_currentGinaStep`];
    const controlLevel = patientData[`${ageGroup}_controlLevel`];
    const controlAnswers = patientData[`${ageGroup}_controlAssessmentAnswers`];
    const pathway = patientData[`${ageGroup}_pathway` as const] || patientData.youngChild_symptomPattern;
    const pathwayLabel = ageGroup === 'adult' ? 'Pathway' : ageGroup === 'child' ? 'Track' : 'Symptom Pattern';
    const pathwayValue = ageGroup === 'adult' 
        ? (pathway === 'pathway1' ? '1 (ICS-formoterol reliever)' : '2 (SABA reliever)')
        : ageGroup === 'child' 
        ? (pathway === 'track1' ? '1 (MART)' : '2 (Classic SABA)')
        : (pathway === 'infrequentViralWheeze' ? 'Infrequent Viral Wheeze' : 'Frequent Wheeze / Persistent Asthma');

    let treatmentDetails: TreatmentDetail | undefined;
    if (ageGroup === 'adult') {
        const { adult_pathway, adult_currentGinaStep } = patientData;
        if (adult_pathway && adult_currentGinaStep) treatmentDetails = adultTreatments[adult_pathway]?.[adult_currentGinaStep];
    } else if (ageGroup === 'child') {
        const { child_pathway, child_currentGinaStep } = patientData;
        if (child_pathway && child_currentGinaStep) treatmentDetails = childTreatments[child_pathway]?.[child_currentGinaStep];
    } else if (ageGroup === 'youngChild') {
        const { youngChild_currentGinaStep, youngChild_currentTreatmentStrategy } = patientData;
        if (youngChild_currentGinaStep && youngChild_currentTreatmentStrategy) {
            const stepDetails = youngChildTreatments[youngChild_currentGinaStep];
            if (stepDetails) treatmentDetails = youngChild_currentTreatmentStrategy === 'preferred' ? stepDetails.preferred : stepDetails.alternatives?.find(alt => alt.id === youngChild_currentTreatmentStrategy);
        }
    }

    const typicalFeatures = Object.entries(diagnosisSymptoms.typical).filter(([_, val]) => val).map(([key]) => key === 'symptoms' ? "Respiratory symptoms (Wheeze/SOB/Cough)" : key === 'timing' ? "Worse at night/early morning" : key === 'variability' ? "Variable over time/intensity" : "Triggered by viral/exercise/allergens");
    const atypicalFeatures = Object.entries(diagnosisSymptoms.atypical).filter(([_, val]) => val).map(([key]) => key === 'sputum' ? "Chronic sputum production" : key === 'dizziness' ? "Dizziness/Paresthesia" : key === 'chestPain' ? "Chest pain" : "Noisy inspiration (stridor)");
    
    const criteriaMet = [];
    if (diagnosisCriteria.symptoms.wheeze) criteriaMet.push("Symptom: Wheeze");
    if (diagnosisCriteria.symptoms.sob) criteriaMet.push("Symptom: Shortness of Breath");
    if (diagnosisCriteria.patterns.variable) criteriaMet.push("Pattern: Variable symptoms");
    if (diagnosisCriteria.patterns.nightWaking) criteriaMet.push("Pattern: Worse at night");
    if (diagnosisCriteria.airflowLimitation.bdReversibility) criteriaMet.push("Evidence: BD Reversibility");
    if (diagnosisCriteria.airflowLimitation.pefVariability) criteriaMet.push("Evidence: PEF Variability");
    if (diagnosisCriteria.airflowLimitation.treatmentTrial) criteriaMet.push("Evidence: Positive Treatment Trial");
    if (diagnosisCriteria.airflowLimitation.challengeTest) criteriaMet.push("Evidence: Positive Challenge Test");

    const phenotypePositives = [];
    if (phenotypeData.allergicHistory) phenotypePositives.push("History of Allergic Disease");
    if (phenotypeData.familyHistory) phenotypePositives.push("Family History");
    if (phenotypeData.childhoodOnset) phenotypePositives.push("Childhood Onset");
    if (phenotypeData.coughVariant) phenotypePositives.push("Cough as only symptom");
    if (phenotypeData.obesity) phenotypePositives.push("Obesity");
    if (phenotypeData.worseAtWork) phenotypePositives.push("Worse at Work");
    if (phenotypeData.persistentLimitation) phenotypePositives.push("Persistent Airflow Limitation");

    const initialAnswers = ageGroup === 'adult' ? patientData.adult_initialAssessment : ageGroup === 'child' ? patientData.child_initialAssessment : null;
    const baselineACT = patientData.actHistory.length > 0 ? patientData.actHistory[patientData.actHistory.length - 1].score : null;
    
    let treatmentStatusLabel = "";
    if (onTreatmentDiagnosis.status === 'confirmed_variable') treatmentStatusLabel = "Typical symptoms + Confirmed variable airflow";
    else if (onTreatmentDiagnosis.status === 'symptoms_no_variable') treatmentStatusLabel = `Typical symptoms + No variable airflow (FEV1: ${onTreatmentDiagnosis.fev1_percent}%)`;
    else if (onTreatmentDiagnosis.status === 'no_symptoms_normal') treatmentStatusLabel = "Few/No symptoms + Normal lung function";

    const hasSevereAsthmaData = severeAsthma?.status && severeAsthma.status !== 'screening';

    return (
        <div className="p-6 space-y-1">
            <SummarySection title="Patient Demographics" icon={<User />}>
                {patientProfile && (
                    <>
                        <SummaryItem label="Patient Name" value={`${patientProfile.lastName.toUpperCase()}, ${patientProfile.firstName}`} />
                        <SummaryItem label="Date of Birth" value={patientProfile.dateOfBirth} />
                        <SummaryItem label="File Number" value={patientProfile.fileNumber} />
                        <SummaryItem label="Treating Physician" value={patientProfile.treatingPhysician} />
                        <div className="border-t border-slate-100 my-2"></div>
                    </>
                )}
                <SummaryItem label="Age Group" value={patientData.age || undefined} />
                <SummaryItem label="Diagnosis Confirmed" value={patientData.diagnosisConfirmed} />
            </SummarySection>
            
            {exacerbationSeverity && (
                <div className="bg-red-50 rounded-md border border-red-200 mb-2">
                    <SummarySection title="Acute Exacerbation Management" icon={<Zap className="text-red-600"/>}>
                        <SummaryItem label="Episode Severity" value={exacerbationSeverity === 'severe' ? 'Severe (Emergency Care)' : 'Mild to Moderate'} />
                        <div className="mt-2 text-xs text-red-800 pl-2 border-l-2 border-red-300">
                            <strong>Action Plan Implemented:</strong> {exacerbationSeverity === 'severe' ? 'Immediate transfer to acute care facility (ER).' : 'Managed at home/clinic with increased reliever + OCS.'}
                        </div>
                    </SummarySection>
                </div>
            )}

            {/* --- SEVERE ASTHMA SECTION (PRIORITY DISPLAY) --- */}
            {hasSevereAsthmaData && (
                 <div className="bg-slate-50 rounded-md border border-indigo-200 mb-4 p-2">
                    <SummarySection title="Severe Asthma Protocol Status" icon={<Activity className="text-indigo-600"/>}>
                        <SummaryItem label="Pathway Status" value={severeAsthma.status ? severeAsthma.status.replace(/_/g, ' ').toUpperCase() : 'Active'} />
                        
                        {/* Basic Info from Stage 1 */}
                        <div className="mt-3 border-t border-slate-200 pt-2">
                            <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Initial Assessment (Stage 1)</h5>
                            <SummaryItem label="Exacerbations (Last Year)" value={severeAsthma.basicInfo.exacerbationsLastYear} />
                            <SummaryItem label="Hospitalizations" value={severeAsthma.basicInfo.hospitalizationsLastYear} />
                            <SummaryItem label="SABA Use (Cans/Year)" value={severeAsthma.basicInfo.sabaUse} />
                        </div>

                        {/* Optimization Plan from Stage 3 */}
                        {severeAsthma.optimizationPlan && (
                            <div className="mt-3 border-t border-slate-200 pt-2">
                                <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Optimization Trial (Stage 3)</h5>
                                <SummaryItem label="Date Initiated" value={new Date(severeAsthma.optimizationPlan.dateInitiated).toLocaleDateString()} />
                                <ListSummary label="Interventions" items={severeAsthma.optimizationPlan.interventions} />
                                {severeAsthma.optimizationPlan.comorbidityPlan && (
                                    <div className="mt-1">
                                        <span className="font-medium text-slate-600">Comorbidity Plan:</span>
                                        <p className="text-slate-800 text-sm pl-2 italic">{severeAsthma.optimizationPlan.comorbidityPlan}</p>
                                    </div>
                                )}
                            </div>
                        )}

                         {/* Biomarkers from Stage 6 */}
                        {(severeAsthma.biomarkers.bloodEosinophils || severeAsthma.biomarkers.feNo) && (
                             <div className="mt-3 border-t border-slate-200 pt-2">
                                <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Type 2 Biomarkers (Stage 6)</h5>
                                {severeAsthma.biomarkers.bloodEosinophils && <SummaryItem label="Blood Eosinophils" value={`${severeAsthma.biomarkers.bloodEosinophils} /μL`} />}
                                {severeAsthma.biomarkers.feNo && <SummaryItem label="FeNO" value={`${severeAsthma.biomarkers.feNo} ppb`} />}
                                {severeAsthma.biomarkers.totalIgE && <SummaryItem label="Total IgE" value={`${severeAsthma.biomarkers.totalIgE} IU/mL`} />}
                            </div>
                        )}
                    </SummarySection>
                 </div>
            )}

            <SummarySection title="Treatment Status at Diagnosis" icon={<Pill />}>
                <SummaryItem label="On Controller Medication" value={isOnMaintenanceTreatment} />
                {isOnMaintenanceTreatment && treatmentStatusLabel && (
                    <SummaryItem label="Clinical Scenario (Box 1-4)" value={treatmentStatusLabel} />
                )}
            </SummarySection>

            {!isOnMaintenanceTreatment && criteriaMet.length > 0 && (
                <SummarySection title="Diagnostic Criteria Met (Box 1-2)" icon={<Stethoscope />}>
                    <ListSummary label="Positive Findings" items={criteriaMet} />
                </SummarySection>
            )}
            
            {(diagnosisCriteria.biomarkers.feNo || diagnosisCriteria.biomarkers.bloodEosinophils) && (
                <SummarySection title="Diagnostic Biomarkers (Standard)" icon={<Droplets />}>
                    {diagnosisCriteria.biomarkers.feNo && <SummaryItem label="FeNO (ppb)" value={diagnosisCriteria.biomarkers.feNo} />}
                    {diagnosisCriteria.biomarkers.bloodEosinophils && <SummaryItem label="Blood Eosinophils (/μL)" value={diagnosisCriteria.biomarkers.bloodEosinophils} />}
                </SummarySection>
            )}

            <SummarySection title="Symptom Probability Check" icon={<Activity />}>
                <ListSummary label="Typical Features" items={typicalFeatures} />
                {atypicalFeatures.length > 0 && <div className="mt-2 text-amber-700"><ListSummary label="Atypical Features (Caution)" items={atypicalFeatures} /></div>}
            </SummarySection>

            <SummarySection title="Clinical Phenotype" icon={<Activity />}>
                <SummaryItem label="Suggested Phenotype" value={phenotypeData.identifiedPhenotype || 'Not evaluated'} />
                <ListSummary label="Positive Features" items={phenotypePositives} />
            </SummarySection>

            {patientData.consultationType === 'initial' && initialAnswers && (
                <SummarySection title="Initial Assessment & GINA Step" icon={<ClipboardList />}>
                    <SummaryItem label="Symptom Frequency" value={initialAnswers.symptomFrequency} />
                    <SummaryItem label="Night Waking" value={initialAnswers.nightWaking} />
                    <SummaryItem label="Severe Presentation" value={initialAnswers.severePresentation} />
                    <div className="mt-2 pt-2 border-t border-slate-100">
                        <SummaryItem label="Assigned GINA Step" value={ginaStep} />
                    </div>
                </SummarySection>
            )}

            {ageGroup === 'adult' && baselineACT !== null && (
                 <SummarySection title="Baseline Assessment" icon={<Calendar />}>
                    <SummaryItem label="Baseline ACT Score" value={baselineACT} />
                 </SummarySection>
            )}

            <SummarySection title="Risk Factor Assessment" icon={<AlertTriangle />}>
                <ListSummary label="Identified Risk Factors" items={riskFactorLabels} />
            </SummarySection>

            {patientData.consultationType === 'followup' && (
                <SummarySection title="Current Control Level" icon={<CheckCircle2 />}>
                    <SummaryItem label="Assessment Result" value={controlLevel ? controlLevel.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) : 'Not Assessed'} />
                    {controlAnswers && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                            <h4 className="font-medium text-slate-600 mb-2">Detailed Assessment:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                {Object.entries(controlQuestionLabels).map(([key, label]) => (
                                    <div key={key} className="flex justify-between items-center p-2 bg-slate-100 rounded">
                                        <span className="text-slate-500">{label}</span>
                                        <span className={`font-bold ${controlAnswers[key as keyof ControlAnswers] ? 'text-red-600' : 'text-emerald-600'}`}>
                                            {controlAnswers[key as keyof ControlAnswers] === null ? 'N/A' : (controlAnswers[key as keyof ControlAnswers] ? 'Yes' : 'No')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </SummarySection>
            )}

            <SummarySection title="Treatment Plan" icon={<Route />}>
                <SummaryItem label="GINA Step" value={ginaStep || 'Not Determined'} />
                <SummaryItem label={pathwayLabel} value={pathway ? pathwayValue : 'Not Determined'} />
                {ageGroup === 'youngChild' && <SummaryItem label="Treatment Strategy" value={patientData.youngChild_currentTreatmentStrategy || 'Not set'} />}
                {treatmentDetails && (
                    <div className="mt-3 pt-3 border-t border-slate-200 space-y-3">
                        {treatmentDetails.controller && <div><span className="font-medium text-slate-600">Controller:</span><p className="text-slate-800 font-semibold pl-2">{treatmentDetails.controller}</p></div>}
                        {treatmentDetails.reliever && <div><span className="font-medium text-slate-600">Reliever:</span><p className="text-slate-800 font-semibold pl-2">{treatmentDetails.reliever}</p></div>}
                        {treatmentDetails.additional && <div><ListSummary label="Additional Options" items={Array.isArray(treatmentDetails.additional) ? treatmentDetails.additional : [treatmentDetails.additional]} /></div>}
                    </div>
                )}
            </SummarySection>

            {patientData.currentPrescription && patientData.currentPrescription.length > 0 && (
                <SummarySection title="Prescribed Medications (Rx)" icon={<Pill />}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="py-2 px-2">Medication</th>
                                    <th className="py-2 px-2">Instructions</th>
                                    <th className="py-2 px-2">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {patientData.currentPrescription.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-2 px-2 font-semibold text-slate-800">{item.medicationName}</td>
                                        <td className="py-2 px-2 text-slate-600">{item.instructions}</td>
                                        <td className="py-2 px-2 text-slate-600">{item.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SummarySection>
            )}
        </div>
    );
};

export default ClinicalProfileSummary;