import React, { useMemo } from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientRecords } from '../../../contexts/PatientRecordsContext';
import AssessmentCard from './AssessmentCard';
import { User, Droplets, FlaskConical, ShieldAlert, CheckCircle, XCircle, FileText, ClipboardList, Printer, Heart, Stethoscope, Calendar, Activity, Syringe, Save } from '../../../constants/icons';
import { getBiologicRecommendation } from '../../../constants/severeAsthmaData';
import Button from '../../ui/Button';

const SummarySection: React.FC<{ title: string; icon: React.ReactElement; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="py-4 border-b border-slate-200 last:border-b-0 break-inside-avoid">
        <h3 className="font-semibold text-slate-800 mb-3 flex items-center text-md">
            {React.cloneElement(icon as React.ReactElement<any>, { size: 20, className: "mr-2.5 text-slate-500"})}
            {title}
        </h3>
        <div className="pl-8 space-y-2 text-sm text-slate-700">
            {children}
        </div>
    </div>
);

const SummaryItem: React.FC<{ label: string; value: string | number | boolean | null | undefined }> = ({ label, value }) => {
    let displayValue: React.ReactNode = value;
    if (typeof value === 'boolean') {
        displayValue = value ? 
            <span className="flex items-center text-green-700"><CheckCircle size={14} className="mr-1"/> Yes</span> : 
            <span className="flex items-center text-slate-400"><XCircle size={14} className="mr-1"/> No</span>;
    }
    if (value === null || value === '' || value === undefined || (Array.isArray(value) && value.length === 0)) {
        displayValue = <span className="text-slate-400 italic">Not specified</span>;
    }
    return (
        <div className="flex justify-between items-start py-1 border-b border-slate-50 last:border-0">
            <span className="font-medium text-slate-600 mr-4">{label}:</span>
            <span className="text-right font-semibold text-slate-800">{displayValue}</span>
        </div>
    );
};

const ListBlock: React.FC<{ title?: string; items: string[] }> = ({ title, items }) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="mt-2">
            {title && <p className="font-medium text-slate-600 mb-1 text-xs uppercase tracking-wider">{title}:</p>}
            <ul className="list-disc list-inside text-sm text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100">
                {items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </div>
    );
};

const Stage11_SummaryReport: React.FC = () => {
    const { patientData } = usePatientData();
    const { navigateTo } = useNavigation();
    const { saveConsultation, updateConsultation } = usePatientRecords();
    
    const { severeAsthma: data, severeAsthmaAssessment: assessment } = patientData;
    const topRecommendation = useMemo(() => getBiologicRecommendation(patientData)?.[0], [patientData]);

    const handlePrint = () => {
        window.print();
    };

    const handleSaveAndExit = () => {
        if (patientData.activePatientId) {
            if (patientData.activeConsultationId) {
                updateConsultation(patientData.activePatientId, patientData.activeConsultationId, patientData);
            } else {
                saveConsultation(patientData.activePatientId, patientData);
            }
            navigateTo('PATIENT_DASHBOARD');
        }
    };

    // Prepare lists for display
    const investigationsDone = Object.entries(data.investigations)
        .filter(([_, done]) => done)
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));

    return (
        <div id="summary-report-content">
             {data.status === 'biologic_failure' && (
                 <div className="mb-6 p-4 bg-red-50 border-l-8 border-red-600 rounded-lg shadow-sm printable-card">
                    <h2 className="text-xl font-bold text-red-800 flex items-center">
                        <XCircle size={24} className="mr-3"/>
                        Biologic Therapy Failed
                    </h2>
                    <p className="text-sm text-red-700 mt-2">
                        This patient has not responded to biologic therapy trials. Management should focus on optimizing standard care, minimizing OCS side-effects, and regular monitoring.
                    </p>
                 </div>
             )}

            <AssessmentCard title="Severe Asthma Clinical Summary" icon={<FileText />} className="printable-card">
                
                {/* 1. Demographics & History */}
                <SummarySection title="Patient Profile & History" icon={<User />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div>
                            <SummaryItem label="Age" value={data.basicInfo.age} />
                            <SummaryItem label="Asthma Onset" value={data.basicInfo.asthmaOnset} />
                            <SummaryItem label="Diagnosis Confirmed" value={data.basicInfo.diagnosis === 'confirmed'} />
                        </div>
                        <div>
                            <SummaryItem label="Exacerbations (Last Year)" value={data.basicInfo.exacerbationsLastYear} />
                            <SummaryItem label="Hospitalizations (Last Year)" value={data.basicInfo.hospitalizationsLastYear} />
                            <SummaryItem label="SABA Use (Cans/Year)" value={data.basicInfo.sabaUse} />
                        </div>
                    </div>
                </SummarySection>

                {/* 2. Current Management & Adherence */}
                <SummarySection title="Current Management Status" icon={<Heart />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div>
                            <SummaryItem label="High Dose ICS-LABA" value={data.medications.icsLaba && data.medications.icsDose === 'high'} />
                            <SummaryItem label="Maintenance OCS" value={data.medications.maintenanceOcs} />
                            {data.medications.maintenanceOcs && <SummaryItem label="OCS Dose" value={data.medications.ocsDose} />}
                        </div>
                        <div>
                            <SummaryItem label="Adherence" value={data.medications.adherence} />
                            <SummaryItem label="Inhaler Technique" value={data.medications.inhalerTechnique} />
                            <SummaryItem label="Allergen Driven Symptoms" value={data.symptoms.allergenDriven} />
                        </div>
                    </div>
                </SummarySection>

                {/* 3. Risk Factors & Comorbidities */}
                <SummarySection title="Risk Factors & Comorbidities (Stage 2)" icon={<ShieldAlert />}>
                    <ListBlock title="Identified Risk Factors" items={data.riskFactors} />
                    <ListBlock title="Comorbidities" items={data.comorbidities} />
                </SummarySection>

                {/* 4. Optimization Trial */}
                {data.optimizationPlan && (
                    <SummarySection title="Optimization Trial (Stage 3)" icon={<Activity />}>
                        <SummaryItem label="Trial Initiated" value={data.optimizationPlan.dateInitiated ? new Date(data.optimizationPlan.dateInitiated).toLocaleDateString() : 'N/A'} />
                        <ListBlock title="Interventions Implemented" items={data.optimizationPlan.interventions} />
                    </SummarySection>
                )}

                {/* 5. Review Outcome */}
                {data.status && (
                    <SummarySection title="Assessment Outcome (Stage 4/5)" icon={<ClipboardList />}>
                         <SummaryItem label="Current Status" value={data.status.replace('_', ' ').toUpperCase()} />
                         <SummaryItem label="Difficult-to-Treat Asthma" value={assessment.difficultToTreat} />
                         <SummaryItem label="Severe Asthma Diagnosis" value={assessment.severeAsthma} />
                         {investigationsDone.length > 0 && <ListBlock title="Investigations Performed" items={investigationsDone} />}
                    </SummarySection>
                )}

                {/* 6. Phenotype & Biomarkers */}
                <SummarySection title="Phenotype & Biomarkers (Stage 6)" icon={<FlaskConical />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div>
                            <SummaryItem label="Blood Eosinophils" value={`${data.biomarkers.bloodEosinophils || '--'} /μL`} />
                            <SummaryItem label="FeNO" value={`${data.biomarkers.feNo || '--'} ppb`} />
                            <SummaryItem label="Sputum Eosinophils" value={`${data.biomarkers.sputumEosinophils || '--'} %`} />
                        </div>
                        <div>
                            <SummaryItem label="Total IgE" value={`${data.biomarkers.totalIgE || '--'} IU/mL`} />
                            <SummaryItem label="Allergen Sensitization" value={data.biomarkers.specificIgE || data.biomarkers.skinPrickTest} />
                            <SummaryItem label="FEV1 (% predicted)" value={`${data.biomarkers.fev1Predicted || '--'} %`} />
                        </div>
                    </div>
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm font-medium text-blue-800 text-center">
                        Inflammatory Phenotype: {assessment.type2Inflammation ? 'Type 2-High' : 'Low Type 2 / Non-Eosinophilic'}
                    </div>
                </SummarySection>

                {/* 7. Biologic Recommendation */}
                {assessment.eligibleForBiologics && topRecommendation && (
                    <SummarySection title="Biologic Therapy Plan (Stage 7/8)" icon={<Syringe />}>
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-emerald-900">{topRecommendation.drug}</h4>
                                <span className="text-xs font-bold px-2 py-1 bg-emerald-200 text-emerald-800 rounded-full">Top Choice</span>
                            </div>
                            <p className="text-sm text-emerald-800 mt-1">{topRecommendation.reason}</p>
                        </div>
                        <SummaryItem label="Biologics Available?" value={data.medications.biologicsAvailable === 'yes'} />
                    </SummarySection>
                )}

                {/* 8. Ongoing Care */}
                <SummarySection title="Long-term Plan" icon={<Calendar />}>
                    <p className="text-sm text-slate-600 italic">
                        Plan: Continue optimized management. Monitor every 3-6 months. 
                        {assessment.severeAsthma ? ' Aim for remission and OCS reduction.' : ' Continue standard GINA Step 5 care.'}
                    </p>
                </SummarySection>

            </AssessmentCard>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 no-print pb-8">
                <Button onClick={handlePrint} variant="secondary" size="lg" leftIcon={<Printer />}>
                    Print Report
                </Button>
                {patientData.activePatientId && (
                    <Button 
                        onClick={handleSaveAndExit} 
                        variant="success" 
                        size="lg" 
                        leftIcon={<Save />}
                        className="bg-emerald-700 hover:bg-emerald-800 shadow-lg"
                    >
                        Save & Return to Dashboard
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Stage11_SummaryReport;