

import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useNavigation } from '../../../contexts/NavigationContext';
import { ExacerbationSeverity } from '../../../types';
import { Thermometer, Activity, AlertTriangle, ChevronRight, HelpCircle, Baby, ShieldAlert } from 'lucide-react';

const YoungChildExacerbationSeverityStep: React.FC = () => {
  const { navigateTo } = useNavigation();

  const handleSeveritySelection = (severity: ExacerbationSeverity) => {
    navigateTo('YOUNG_CHILD_EXACERBATION_PLAN_STEP', { exacerbationSeverity: severity });
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
    <Card title="Assess Episode Severity (Young Child <=5 years)" icon={<ShieldAlert className="text-red-600" />}>
      <p className="mb-6 text-sm text-slate-600 leading-relaxed">
        Assess the child's symptoms and signs. Pay close attention to signs of respiratory distress (retractions, nasal flaring, grunting), alertness, and ability to feed.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <SeverityOptionCard
          title="Mild to Moderate Episode"
          icon={<Activity className="text-amber-600" />}
          criteria={[
            "Alert, interactive",
            "Retractions absent or mild",
            "Respiratory rate may be mildly increased",
            "Able to feed/drink",
            "No cyanosis",
            "Responds to initial SABA",
            "SaO2 typically > 92-94% (if measurable)",
          ]}
          buttonLabel="Select Mild to Moderate"
          onClick={() => handleSeveritySelection('mildModerate')}
          variant="warning"
          className="border-amber-400 bg-amber-50 text-amber-800"
        />

        <SeverityOptionCard
          title="Severe Episode"
          icon={<AlertTriangle className="text-red-600" />}
          criteria={[
            "Reduced alertness, lethargic, or agitated",
            "Marked retractions, nasal flaring, grunting",
            "Rapid respiratory rate",
            "Difficulty feeding/speaking",
            "Cyanosis (blue lips/tongue)",
            "Poor/minimal response to initial SABA",
            "SaO2 <= 92% (if measurable)",
            "Life-threatening signs: Extreme lethargy, exhaustion, silent chest, very slow breathing/apnea.",
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
            <strong>Seek immediate medical attention for any severe episode or if in doubt.</strong> Life-threatening signs (e.g., severe lethargy, major breathing difficulty, cyanosis) require urgent emergency medical care.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default YoungChildExacerbationSeverityStep;