

import React from 'react';
import { HelpCircle, TrendingUp, ListChecks, Droplets, ShieldCheck, ArrowRight } from '../../../constants/icons';

const Step: React.FC<{
  stepNumber: number;
  title: string;
  icon: React.ReactElement;
  children: React.ReactNode;
}> = ({ stepNumber, title, icon, children }) => {
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
    <div className="flex items-start">
      <div className="flex flex-col items-center mr-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-bold text-lg">
          {stepNumber}
        </div>
        {stepNumber < 5 && <div className="w-px h-12 bg-slate-300 my-1"></div>}
      </div>
      <div className="flex-1 p-4 bg-white rounded-lg border border-slate-200 shadow-sm mt-1">
        <h3 className="font-semibold text-slate-800 mb-2 flex items-center text-md">
            {clonedIcon}
            {title}
        </h3>
        <div className="text-slate-700 text-sm space-y-2">
            {children}
        </div>
      </div>
    </div>
  );
};


const Box15Content: React.FC = () => {
    return (
        <div className="space-y-0">
            <p className="text-sm text-slate-600 mb-6">
                Confirming a diagnosis of asthma is a process of gathering evidence. Follow these steps for a structured approach based on GINA recommendations.
            </p>

            <Step stepNumber={1} title="Clinical Suspicion" icon={<HelpCircle className="text-sky-600" />}>
                <p>Start with a detailed history of respiratory symptoms (wheeze, cough, shortness of breath, chest tightness).</p>
                <ul className="list-disc list-inside pl-2">
                    <li>Are symptoms variable over time and in intensity?</li>
                    <li>Are there typical triggers (e.g., exercise, allergens, viral infections)?</li>
                    <li>Is there a personal or family history of atopy (asthma, eczema, allergic rhinitis)?</li>
                </ul>
            </Step>

            <Step stepNumber={2} title="Objective Testing (Spirometry)" icon={<TrendingUp className="text-emerald-600" />}>
                <p>Perform spirometry with a bronchodilator (BD) test. A positive BD reversibility test is strong evidence for asthma.</p>
                <p className="text-xs text-slate-500">If the test is negative, it does not rule out asthma, especially if the patient is currently well or already on treatment.</p>
            </Step>

            <Step stepNumber={3} title="Further Objective Testing" icon={<ListChecks className="text-amber-600" />}>
                <p>If initial spirometry is non-diagnostic, consider other tests to document variable airflow limitation:</p>
                <ul className="list-disc list-inside pl-2">
                    <li><strong>PEF Monitoring:</strong> Assess diurnal variability over 2 weeks.</li>
                    <li><strong>Bronchial Challenge Test:</strong> With methacholine or exercise, if available and safe.</li>
                    <li><strong>Therapeutic Trial:</strong> A trial of ICS for 4-8 weeks, with objective measurement of lung function before and after, can be diagnostic.</li>
                </ul>
            </Step>

            <Step stepNumber={4} title="Assess for Type 2 Inflammation" icon={<Droplets className="text-red-500" />}>
                 <p>Measuring biomarkers like FeNO or blood eosinophils is recommended.</p>
                 <ul className="list-disc list-inside pl-2">
                    <li>Elevated markers support a diagnosis of Type 2 asthma.</li>
                    <li>They strongly predict a good response to ICS, which can increase confidence in a therapeutic trial.</li>
                </ul>
            </Step>

            <Step stepNumber={5} title="Synthesize and Conclude" icon={<ShieldCheck className="text-violet-600" />}>
                <p>Combine all evidence to make a final diagnostic conclusion:</p>
                <div className="mt-2 space-y-2">
                    <div className="flex items-start"><ArrowRight size={14} className="mr-2 mt-1 text-emerald-600 flex-shrink-0" /><div><strong>Diagnosis Confirmed:</strong> Typical symptoms + objective evidence of variable airflow limitation.</div></div>
                    <div className="flex items-start"><ArrowRight size={14} className="mr-2 mt-1 text-red-600 flex-shrink-0" /><div><strong>Diagnosis Unlikely:</strong> Atypical symptoms AND consistently normal lung function tests. Investigate alternatives.</div></div>
                     <div className="flex items-start"><ArrowRight size={14} className="mr-2 mt-1 text-amber-600 flex-shrink-0" /><div><strong>Diagnosis Uncertain:</strong> Inconsistent findings. May require specialist referral or further observation.</div></div>
                </div>
            </Step>
        </div>
    );
};

export default Box15Content;