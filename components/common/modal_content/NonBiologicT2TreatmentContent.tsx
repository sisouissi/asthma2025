
import React from 'react';
import { Pill, Activity, ShieldAlert, Droplets } from '../../../constants/icons';

const TreatmentItem: React.FC<{ title: string; icon: React.ReactElement; children: React.ReactNode; }> = ({ title, icon, children }) => {
    const clonedIcon = React.cloneElement(icon as React.ReactElement<any>, {
        size: 20,
        className: `mr-2.5 flex-shrink-0 ${(icon.props as any).className || ''}`
    });

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

const NonBiologicT2TreatmentContent: React.FC = () => {
    return (
        <div className="space-y-5">
            <p className="text-sm text-slate-600">
                For patients with Type 2 severe asthma, if biologic therapies are not available, affordable, or preferred, other add-on treatments may be considered by a specialist.
            </p>

            <TreatmentItem title="House Dust Mite (HDM) SLIT" icon={<Droplets className="text-teal-600"/>}>
                <p>For adults with allergic asthma sensitized to house dust mite (HDM) who have allergic rhinitis, consider a trial of HDM Sublingual Immunotherapy if:</p>
                <ul className="list-disc list-inside mt-1">
                    <li>The FEV1 is greater than 70% predicted.</li>
                    <li>Asthma is uncontrolled on low- to medium-dose ICS.</li>
                </ul>
                <p>This may modestly reduce the risk of exacerbations but is not a substitute for standard controller medications.</p>
            </TreatmentItem>

             <TreatmentItem title="Add-on LAMA" icon={<Activity className="text-emerald-600"/>}>
                <p>A Long-Acting Muscarinic Antagonist (e.g., tiotropium) can be added to ICS-LABA.</p>
                <p>This provides a modest improvement in lung function and may reduce exacerbations. It should be considered before escalating to more complex therapies.</p>
            </TreatmentItem>

            <TreatmentItem title="Add-on LTRA" icon={<Pill className="text-sky-600"/>}>
                <p>A Leukotriene Receptor Antagonist (e.g., montelukast) can be added to ICS therapy.</p>
                <p>Its effect is small in most patients and less effective than adding a LABA. Consider if there are contraindications to LABA or for patients with concurrent allergic rhinitis.</p>
            </TreatmentItem>

            <TreatmentItem title="Low-dose maintenance OCS" icon={<ShieldAlert className="text-red-600"/>}>
                <p className="font-bold">This is a last-resort option due to the high risk of serious and often irreversible side-effects.</p>
                <p>If used, the goal is to find the lowest possible dose that maintains control. A systematic risk mitigation strategy must be in place, including monitoring for:</p>
                 <ul className="list-disc list-inside mt-1 text-xs">
                    <li>Osteoporosis</li>
                    <li>Diabetes</li>
                    <li>Adrenal suppression</li>
                    <li>Cataracts & Glaucoma</li>
                    <li>Obesity & Hypertension</li>
                </ul>
            </TreatmentItem>

            <div className="p-3 bg-slate-100 border-l-4 border-slate-400 text-slate-800 text-sm">
                <strong>Specialist Recommendation:</strong> Biologics are generally preferred over maintenance OCS for Type 2 severe asthma due to their targeted action and significantly better long-term safety profile.
            </div>
            <p className="text-xs text-slate-500 text-center">Reference: GINA 2025 Report, p. 151-152</p>
        </div>
    );
};

export default NonBiologicT2TreatmentContent;
