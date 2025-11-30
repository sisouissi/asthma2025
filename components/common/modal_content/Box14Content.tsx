
import React from 'react';
import { ArrowRight, TrendingDown, TrendingUp } from '../../../constants/icons';

const FlowStep: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex items-start">
        <ArrowRight size={16} className="text-slate-500 mr-3 mt-1 flex-shrink-0" />
        <div className="text-sm text-slate-700">{children}</div>
    </div>
);

const Box14Content: React.FC = () => {
    return (
        <div className="space-y-4">
            <p className="text-sm text-slate-600">
                For a patient already taking ICS-containing treatment, confirming the diagnosis of asthma can be challenging. The following approach is recommended.
            </p>

            <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-3">
                <FlowStep>
                    <strong>Assess symptom patterns and lung function.</strong> If features are consistent with asthma and lung function is variable, the diagnosis is supported.
                </FlowStep>
                <FlowStep>
                    If evidence is still not definitive, consider <strong>stepping down the controller treatment.</strong> Find the lowest effective dose that maintains control.
                </FlowStep>
                <FlowStep>
                    If the patient is on low-dose controller, consider <strong>stopping the controller completely.</strong> This should be done with caution and close supervision.
                </FlowStep>
                <FlowStep>
                    <strong>Measure FEV1 before and after stopping treatment.</strong>{' A significant decrease after cessation ('}<TrendingDown size={14} className="text-red-600"/>{') and improvement on restarting ('}<TrendingUp size={14} className="text-emerald-600"/>{') confirms the diagnosis.'}
                </FlowStep>
                <FlowStep>
                    If symptoms do not recur and lung function remains stable after stopping the controller for 2-4 weeks, the diagnosis of asthma is unlikely.
                </FlowStep>
            </div>

            <div className="p-3 bg-amber-50 border-l-4 border-amber-400 text-amber-800 text-sm">
                <strong>Caution:</strong> This process requires careful clinical judgment and patient communication. Ensure the patient has a clear action plan in case symptoms worsen after treatment reduction or cessation.
            </div>
        </div>
    );
};

export default Box14Content;
