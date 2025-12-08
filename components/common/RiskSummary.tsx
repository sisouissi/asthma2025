
import React from 'react';
import { ShieldCheck, ShieldAlert } from '../../constants/icons';

interface RiskSummaryProps {
  score: number;
  selectedFactors: string[];
}

const RiskSummary: React.FC<RiskSummaryProps> = ({ score, selectedFactors }) => {
  if (selectedFactors.length === 0) {
    return null;
  }

  let riskLevel: 'Low' | 'Moderate' | 'High';
  let colorClasses: string;
  let Icon: React.ElementType;

  if (score >= 4) {
    riskLevel = 'High';
    colorClasses = 'bg-red-50 border-red-500 text-red-800';
    Icon = ShieldAlert;
  } else if (score >= 1) {
    riskLevel = 'Moderate';
    colorClasses = 'bg-amber-50 border-amber-500 text-amber-800';
    Icon = ShieldAlert;
  } else {
    riskLevel = 'Low';
    colorClasses = 'bg-emerald-50 border-emerald-500 text-emerald-800';
    Icon = ShieldCheck;
  }

  const riskAdvice = {
    Low: "Patient has a low number of risk factors. Continue routine monitoring.",
    Moderate: "Patient has a moderate risk of future exacerbations. Address identified factors and consider closer follow-up.",
    High: "Patient has a high risk of future exacerbations. Pathway 1 (ICS-formoterol reliever) is strongly recommended. Address factors urgently and ensure a robust action plan.",
  };

  return (
    <div className={`mt-6 p-4 rounded-lg border-l-4 ${colorClasses}`}>
      <div className="flex items-center">
        <Icon className="h-6 w-6 mr-3 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-lg">{riskLevel} Risk Profile</h3>
          <p className="text-sm">{riskAdvice[riskLevel]}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-2 pl-9">
        {selectedFactors.length} risk factor(s) identified.
      </p>
    </div>
  );
};

export default RiskSummary;