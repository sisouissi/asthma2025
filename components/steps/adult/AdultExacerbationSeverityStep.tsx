

import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useNavigation } from '../../../contexts/NavigationContext';
import { ExacerbationSeverity } from '../../../types';
import { Thermometer, Activity, AlertTriangle, ChevronRight, HelpCircle, ShieldAlert } from 'lucide-react';

const AdultExacerbationSeverityStep: React.FC = () => {
  const { navigateTo } = useNavigation();

  const handleSeveritySelection = (severity: ExacerbationSeverity) => {
    navigateTo('ADULT_EXACERBATION_PLAN_STEP', { exacerbationSeverity: severity });
  };

  const SeverityOptionCard: React.FC<{
    title: string;
    icon: React.ReactElement;
    criteria: React.ReactNode[];
    buttonLabel: string;
    onClick: () => void;
    variant: 'warning' | 'danger';
    className?: string;
  }> = ({ title, icon, criteria, buttonLabel, onClick, variant, className }) => {
    let clonedIcon = null;
    if (icon) {
        const iconProps: { size: number, className: string } = {
            size: 24,
            className: 'mr-2',
        };
        const existingClassName = (icon.props as any).className;
        if (existingClassName) {
            iconProps.className = iconProps.className + ' ' + existingClassName;
        }
        clonedIcon = React.cloneElement(icon as React.ReactElement<any>, iconProps);
    }

    return (
      <div className={`p-5 border-2 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col ${className}`}>
        <div className="flex items-center mb-3">
          {clonedIcon}
          <h3 className={`text-xl font-semibold`}>{title}</h3>
        </div>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 pl-2 mb-4 flex-grow">
          {criteria.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
        <Button 
          onClick={onClick} 
          fullWidth 
          variant={variant}
          rightIcon={<ChevronRight />}
          aria-label={buttonLabel}
          className="mt-auto"
          size="lg"
        >
          {buttonLabel}
        </Button>
      </div>
    );
  };


  return (
    <Card title="Assess Exacerbation Severity (Adults & Adolescents)" icon={<ShieldAlert className="text-red-600" />}>
      <p className="mb-6 text-sm text-slate-600 leading-relaxed">
        Assess the patient's symptoms and signs to classify exacerbation severity.
        This will guide the immediate management plan (based on GINA 2025, Box 9-4).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SeverityOptionCard
          title="Mild to Moderate"
          icon={<Activity className="text-amber-600" />}
          criteria={[
            "Talks in phrases",
            "Prefers sitting to lying",
            "Not agitated",
            "Respiratory rate increased",
            "Accessory muscles not used",
            "Pulse 100-120 bpm",
            "SaO2 (on air) 90-95%",
            "PEF > 50% predicted or best",
          ]}
          buttonLabel="Select Mild to Moderate"
          onClick={() => handleSeveritySelection('mildModerate')}
          variant="warning"
          className="border-amber-400 bg-amber-50 text-amber-800"
        />

        <SeverityOptionCard
          title="Severe"
          icon={<AlertTriangle className="text-red-600" />}
          criteria={[
            "Talks in words",
            "Sits hunched forwards",
            "Agitated",
            "Respiratory rate > 30/min",
            "Accessory muscles used",
            "Pulse > 120 bpm",
            "SaO2 (on air) < 90%",
            "PEF <= 50% predicted or best",
            "Life-threatening signs: Drowsiness, confusion, silent chest.",
          ]}
          buttonLabel="Select Severe"
          onClick={() => handleSeveritySelection('severe')}
          variant="danger"
          className="border-red-500 bg-red-50 text-red-800"
        />
      </div>
      <div className="mt-8 p-4 bg-slate-100 border border-slate-200 rounded-lg text-sm">
        <div className="flex items-start">
          <HelpCircle size={20} className="mr-3 mt-0.5 flex-shrink-0 text-slate-500" />
          <p className="text-slate-600 leading-relaxed">
            <strong>Always consider life-threatening signs:</strong> Drowsiness, confusion, or a silent chest indicate an exacerbation requiring immediate emergency medical intervention, regardless of other signs.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AdultExacerbationSeverityStep;