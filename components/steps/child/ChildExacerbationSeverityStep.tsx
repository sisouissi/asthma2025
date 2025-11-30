

import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useNavigation } from '../../../contexts/NavigationContext';
import { ExacerbationSeverity } from '../../../types';
import { Thermometer, Activity as IconActivity, AlertTriangle, ChevronRight, HelpCircle, ShieldAlert } from 'lucide-react';

const ChildExacerbationSeverityStep: React.FC = () => {
  const { navigateTo } = useNavigation();

  const handleSeveritySelection = (severity: ExacerbationSeverity) => {
    navigateTo('CHILD_EXACERBATION_PLAN_STEP', { exacerbationSeverity: severity });
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
    <Card title="Assess Exacerbation Severity (Child 6-11 years)" icon={<ShieldAlert className="text-red-600" />}>
      <p className="mb-6 text-sm text-slate-600 leading-relaxed">
        Assess the child's symptoms and signs. In children, carefully observe for retractions (chest pulling in) and general condition.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SeverityOptionCard
          title="Mild to Moderate"
          icon={<IconActivity className="text-amber-600" />}
          criteria={[
            "Talks in phrases, prefers sitting",
            "Not agitated",
            "Respiratory rate may be increased",
            "Mild or no retractions",
            "Pulse usually < 120-140 bpm (age-dependent)",
            "SaO2 (on air) > 92-94%",
            "Responds well to SABA",
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
            "Talks in words/short phrases, sits hunched",
            "May be agitated or distressed",
            "Respiratory rate often > 30-40/min (age-dependent)",
            "Moderate to severe retractions, nasal flaring",
            "Pulse often > 140 bpm (age-dependent)",
            "SaO2 (on air) <= 92%",
            "Poor response to initial SABA",
            "Life-threatening signs: Drowsiness, confusion, silent chest, cyanosis, exhaustion.",
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
            <strong>Seek immediate medical attention for any severe exacerbation or if in doubt.</strong> Life-threatening signs (e.g., extreme drowsiness, severe difficulty breathing, cyanosis) require urgent emergency medical care (e.g., ambulance).
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ChildExacerbationSeverityStep;