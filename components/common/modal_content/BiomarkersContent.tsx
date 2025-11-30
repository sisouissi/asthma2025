

import React from 'react';
import { Activity, Droplets } from '../../../constants/icons';

const BiomarkerCard: React.FC<{ title: string; icon: React.ReactElement; children: React.ReactNode }> = ({ title, icon, children }) => {
    let clonedIcon = null;
    if (icon) {
        const existingClassName = (icon.props as any).className || '';
        let newClassName = 'mr-2.5';
        if (existingClassName) newClassName += ' ' + existingClassName;

        const iconProps = {
            size: 20,
            className: newClassName,
        };
        clonedIcon = React.cloneElement(icon as React.ReactElement<any>, iconProps);
    }
    return (
        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center text-md">
                {clonedIcon}
                {title}
            </h3>
            <div className="pl-[30px] space-y-2 text-slate-700 text-sm">
                {children}
            </div>
        </div>
    );
};

const BiomarkersContent: React.FC = () => {
    return (
        <div className="space-y-5">
            <p className="text-sm text-slate-600">
                Biomarkers can provide supportive evidence for a diagnosis of asthma, particularly for identifying Type 2 inflammation, which predicts a good response to ICS treatment.
            </p>

            <BiomarkerCard title="Fractional Exhaled Nitric Oxide (FeNO)" icon={<Activity className="text-sky-600" />}>
                <p>FeNO is a marker of eosinophilic airway inflammation.</p>
                <ul className="list-disc list-inside">
                    <li><strong>{'FeNO > 50 ppb:'}</strong> Strongly supports a diagnosis of eosinophilic asthma and likelihood of ICS response.</li>
                    <li><strong>FeNO 25-50 ppb:</strong> Intermediate. May support diagnosis in the context of suggestive symptoms.</li>
                    <li><strong>{'FeNO < 25 ppb:'}</strong> Low probability of eosinophilic inflammation. Does not rule out asthma, but suggests other mechanisms or non-adherence to ICS.</li>
                </ul>
                <p className="text-xs text-slate-500 mt-2">
                    Note: FeNO levels can be affected by smoking, diet, and medications.
                </p>
            </BiomarkerCard>

            <BiomarkerCard title="Blood Eosinophil Count" icon={<Droplets className="text-red-600" />}>
                <p>A peripheral blood eosinophil count can also indicate Type 2 inflammation.</p>
                 <ul className="list-disc list-inside">
                    <li><strong>{'Eosinophils >= 300 cells/µL:'}</strong> Considered a good predictor of ICS responsiveness. Supports a diagnosis of Type 2 asthma.</li>
                    <li><strong>Eosinophils 150-300 cells/µL:</strong> Intermediate. May provide some support.</li>
                    <li><strong>{'Eosinophils < 150 cells/µL:'}</strong> Lower likelihood of a major response to ICS, but does not exclude asthma.</li>
                </ul>
                <p className="text-xs text-slate-500 mt-2">
                    Note: Eosinophil counts can be variable and are influenced by factors like infections and OCS use.
                </p>
            </BiomarkerCard>

             <div className="p-3 bg-slate-100 border-l-4 border-slate-400 text-slate-800 text-sm">
                <strong>Important:</strong> Biomarkers are supportive tools. The diagnosis of asthma remains clinical, based on a history of characteristic symptoms and demonstration of variable airflow limitation.
            </div>
        </div>
    );
};

export default BiomarkersContent;
