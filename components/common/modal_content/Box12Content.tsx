

import React from 'react';
import { ClipboardList, TrendingUp } from '../../../constants/icons';

const SectionCard: React.FC<{ title: string, icon: React.ReactElement, children: React.ReactNode }> = ({ title, icon, children }) => {
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
            <div className="pl-[30px] space-y-3 text-slate-700 text-sm">
                {children}
            </div>
        </div>
    );
};

const Box12Content: React.FC = () => {
  return (
    <div className="space-y-5">
      <SectionCard title="Symptom Pattern" icon={<ClipboardList className="text-sky-600" />}>
         <p>The diagnosis is suggested by a history of characteristic symptoms:</p>
         <ul className="list-disc list-inside space-y-1">
            <li>Wheeze</li>
            <li>Shortness of breath</li>
            <li>Chest tightness</li>
            <li>Cough</li>
         </ul>
         <p>These symptoms typically:</p>
         <ul className="list-disc list-inside space-y-1">
            <li>Vary over time and in intensity.</li>
            <li>Are often worse at night or upon waking.</li>
            <li>Are triggered by factors like exercise, laughter, allergens, or cold air.</li>
            <li>Frequently appear or worsen with viral infections.</li>
         </ul>
      </SectionCard>
      
      <SectionCard title="Confirmation with Lung Function Variability" icon={<TrendingUp className="text-emerald-600" />}>
         <p>Diagnosis should be confirmed with documented evidence of excessive variability in lung function. Any of the following can be used:</p>
          <ul className="space-y-2">
              <li><strong>Positive Bronchodilator (BD) Reversibility:</strong>
                  <span className="block text-xs pl-4 text-slate-600">{'Adults: Increase in FEV1 >12% and >200mL. Children: Increase in FEV1 >12% of predicted.'}</span>
              </li>
              <li><strong>Excessive PEF Variability:</strong>
                  <span className="block text-xs pl-4 text-slate-600">{'Adults: Daily diurnal variability >10%. Children: >13%.'}</span>
              </li>
              <li><strong>Significant FEV1 increase after 4 weeks of controller treatment:</strong>
                   <span className="block text-xs pl-4 text-slate-600">{'Adults: Increase >12% and >200mL.'}</span>
              </li>
              <li><strong>Positive Exercise Challenge Test:</strong>
                   <span className="block text-xs pl-4 text-slate-600">{'Adults: Fall in FEV1 >10% and >200mL. Children: Fall in FEV1 >12%.'}</span>
              </li>
              <li><strong>Positive Bronchial Challenge Test:</strong>
                   <span className="block text-xs pl-4 text-slate-600">{'Fall in FEV1 >=20% with methacholine/histamine.'}</span>
              </li>
               <li><strong>Excessive Variation in Lung Function Between Visits:</strong>
                   <span className="block text-xs pl-4 text-slate-600">{'Adults: Variation in FEV1 >12% and >200mL.'}</span>
              </li>
          </ul>
      </SectionCard>
    </div>
  );
};

export default Box12Content;
