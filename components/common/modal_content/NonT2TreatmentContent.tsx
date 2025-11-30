

import React from 'react';
import { Pill, Activity, ShieldAlert } from '../../../constants/icons';

const TreatmentItem: React.FC<{ title: string; icon: React.ReactElement; children: React.ReactNode }> = ({ title, icon, children }) => {
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
            <h3 className="font-semibold text-slate-800 mb-2 flex items-center text-md">
                {clonedIcon}
                {title}
            </h3>
            <div className="pl-[30px] space-y-2 text-slate-700 text-sm">
                {children}
            </div>
        </div>
    );
};


const NonT2TreatmentContent: React.FC = () => {
    return (
        <div className="space-y-5">
            <p className="text-sm text-slate-600">
                For patients with severe asthma who do not show evidence of Type 2 inflammation, treatment options are limited and should be managed by a specialist.
            </p>

            <TreatmentItem title="Azithromycin (add-on)" icon={<Pill className="text-sky-600"/>}>
                <p>Long-term low-dose azithromycin may be considered as an add-on therapy for adults with persistent symptoms despite Step 5 treatment.</p>
                <ul className="list-disc list-inside mt-1">
                    <li>It may reduce exacerbations, but has little effect on lung function or symptoms.</li>
                    <li><strong>Important:</strong> Must screen for non-tuberculous mycobacterial infection, check ECG for QTc prolongation, and be aware of increasing antimicrobial resistance.</li>
                </ul>
            </TreatmentItem>

             <TreatmentItem title="LAMA (add-on)" icon={<Activity className="text-emerald-600"/>}>
                <p>If not already added, a LAMA (e.g., tiotropium) should be trialed as it can improve lung function and reduce exacerbations in some patients, regardless of phenotype.</p>
            </TreatmentItem>

            <TreatmentItem title="Low dose OCS" icon={<ShieldAlert className="text-red-600"/>}>
                <p>This should be considered a last resort due to the significant risk of long-term side-effects.</p>
                <ul className="list-disc list-inside mt-1">
                    <li>Use the lowest possible dose that maintains control.</li>
                    <li>Implement strategies to monitor and mitigate side-effects (e.g., bone density scans, metabolic monitoring).</li>
                </ul>
            </TreatmentItem>

            <p className="text-xs text-slate-500 text-center">Reference: GINA 2025 Report, p. 151</p>
        </div>
    );
};

export default NonT2TreatmentContent;