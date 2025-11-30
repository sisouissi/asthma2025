import React, { useMemo } from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import AssessmentCard from './AssessmentCard';
import { User, Droplets, FlaskConical, ShieldAlert, CheckCircle, XCircle, FileText, ClipboardList, Printer } from 'lucide-react';
import { getBiologicRecommendation } from '../../../constants/severeAsthmaData';
import Button from '../../ui/Button';

const SummarySection: React.FC<{ title: string; icon: React.ReactElement; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="py-3 border-b border-slate-200 last:border-b-0">
        <h3 className="font-semibold text-slate-800 mb-3 flex items-center text-md">
            {React.cloneElement(icon as React.ReactElement<any>, { size: 20, className: "mr-2.5 text-slate-500"})}
            {title}
        </h3>
        <div className="pl-9 space-y-2 text-sm text-slate-700">
            {children}
        </div>
    </div>
);

const SummaryItem: React.FC<{ label: string; value: string | number | boolean | null }> = ({ label, value }) => {
    let displayValue: React.ReactNode = value;
    if (typeof value === 'boolean') {
        displayValue = value ? 
            <CheckCircle size={16} className="text-green-600 inline-block" /> : 
            <XCircle size={16} className="text-red-600 inline-block" />;
    }
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        displayValue = <span className="text-slate-400 italic">Not specified</span>;
    }
    return (
        <div className="flex justify-between items-center py-1">
            <span className="font-medium text-slate-600">{label}:</span>
            <span className="text-right font-semibold text-slate-800">{displayValue}</span>
        </div>
    );
};

const Stage11_SummaryReport: React.FC = () => {
    const { patientData } = usePatientData();
    const { severeAsthma: data, severeAsthmaAssessment: assessment } = patientData;
    const topRecommendation = useMemo(() => getBiologicRecommendation(patientData)?.[0], [patientData]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div id="summary-report-content">
            <AssessmentCard title="Patient Summary Report" icon={<FileText />} className="printable-card">
                <SummarySection title="Demographics & History" icon={<User />}>
                    <SummaryItem label="Age" value={data.basicInfo.age || 'N/A'} />
                    <SummaryItem label="Asthma Onset" value={data.basicInfo.asthmaOnset} />
                    <SummaryItem label="Exacerbations (Last Year)" value={data.basicInfo.exacerbationsLastYear || 'N/A'} />
                    <SummaryItem label="Adherence" value={data.medications.adherence} />
                    <SummaryItem label="Inhaler Technique" value={data.medications.inhalerTechnique} />
                </SummarySection>

                <SummarySection title="Key Assessment Findings" icon={<ClipboardList />}>
                    <SummaryItem label="Difficult-to-Treat Asthma" value={assessment.difficultToTreat} />
                    <SummaryItem label="Severe Asthma Confirmed" value={assessment.severeAsthma} />
                    <SummaryItem label="Inflammatory Phenotype" value={assessment.type2Inflammation ? 'Type 2-High' : 'Low Type 2 Biomarkers'} />
                </SummarySection>

                <SummarySection title="Biomarkers" icon={<FlaskConical />}>
                    <SummaryItem label="Blood Eosinophils (/μL)" value={data.biomarkers.bloodEosinophils || 'N/A'} />
                    <SummaryItem label="FeNO (ppb)" value={data.biomarkers.feNo || 'N/A'} />
                    <SummaryItem label="Total IgE (IU/mL)" value={data.biomarkers.totalIgE || 'N/A'} />
                    <SummaryItem label="Allergen Sensitized" value={data.biomarkers.specificIgE || data.biomarkers.skinPrickTest} />
                </SummarySection>

                <SummarySection title="Key Comorbidities & Risk Factors" icon={<ShieldAlert />}>
                    <p className="font-medium text-slate-600 mb-1">Comorbidities:</p>
                    {data.comorbidities.length > 0 ? (
                        <ul className="list-disc list-inside text-xs">
                            {data.comorbidities.map(item => <li key={item}>{item}</li>)}
                        </ul>
                    ) : <p className="text-slate-400 italic text-xs">None specified.</p>}

                    <p className="font-medium text-slate-600 mt-2 mb-1">Risk Factors:</p>
                     {data.riskFactors.length > 0 ? (
                        <ul className="list-disc list-inside text-xs">
                            {data.riskFactors.map(item => <li key={item}>{item}</li>)}
                        </ul>
                    ) : <p className="text-slate-400 italic text-xs">None specified.</p>}
                </SummarySection>
                
                 {assessment.eligibleForBiologics && topRecommendation && (
                    <SummarySection title="Top Biologic Recommendation" icon={<Droplets />}>
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <h4 className="font-bold text-lg text-emerald-800">{topRecommendation.drug}</h4>
                            <p className="text-sm mt-1">{topRecommendation.reason}</p>
                        </div>
                    </SummarySection>
                )}
            </AssessmentCard>
            <div className="mt-8 text-center no-print">
                <Button onClick={handlePrint} variant="secondary" leftIcon={<Printer />}>
                    Print Report
                </Button>
            </div>
        </div>
    );
};

export default Stage11_SummaryReport;