
import React from 'react';
import { biologicOptions } from '../../../constants/severeAsthmaData';
import { Syringe } from '../../../constants/icons';

const DetailItem: React.FC<{ label: string, value?: string }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="py-1.5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
            <p className="text-sm text-slate-700">{value}</p>
        </div>
    );
};


const BiologicCard: React.FC<{ biologic: any }> = ({ biologic }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
        <h3 className="font-bold text-lg text-sky-700 mb-2 flex items-center">
            <Syringe size={18} className="mr-2" />
            {biologic.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <DetailItem label="Indication" value={biologic.indication} />
            <DetailItem label="Predictive Biomarkers / Criteria" value={biologic.predictors || biologic.criteria} />
            <DetailItem label="Mechanism" value={biologic.mechanism} />
            <DetailItem label="Dose & Administration" value={biologic.administration} />
            <DetailItem label="Efficacy" value={biologic.efficacy} />
            <DetailItem label="Other Indications" value={biologic.benefits} />
            <DetailItem label="Key Adverse Effects" value={biologic.safety} />
        </div>
    </div>
);


const BiologicTherapiesGuideContent: React.FC = () => {
    return (
        <div className="space-y-4">
            <p className="text-sm text-slate-600">
                This guide provides an overview of the biologic therapies available for severe asthma, based on GINA 2025 recommendations. The choice of biologic depends on the patient's clinical phenotype and biomarker profile.
            </p>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-3 -mr-1">
                {biologicOptions
                    .sort((a,b) => a.name.localeCompare(b.name))
                    .map((biologic, index) => (
                    <BiologicCard key={index} biologic={biologic} />
                ))}
            </div>
        </div>
    );
};

export default BiologicTherapiesGuideContent;
