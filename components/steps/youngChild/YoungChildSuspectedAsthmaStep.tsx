

import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { HelpCircle, ChevronRight, AlertTriangle } from 'lucide-react';
import { YoungChildSymptomPattern, YoungChildGinaSteps } from '../../../types';

const YoungChildSuspectedAsthmaStep: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { patientData } = usePatientData();

  const metCriteriaCount = Object.values(patientData.youngChild_diagnosisCriteria || {}).filter(Boolean).length;

  const handleSelection = (
    pattern: YoungChildSymptomPattern,
    initialGinaStep: YoungChildGinaSteps
  ) => {
    navigateTo('YOUNG_CHILD_RISK_ASSESSMENT_STEP', {
      youngChild_symptomPattern: pattern,
      youngChild_currentGinaStep: initialGinaStep,
      youngChild_currentTreatmentStrategy: 'preferred',
    });
  };

  const options = [
    {
      label: "Infrequent viral wheeze AND few interval symptoms",
      description: "Less than 3 episodes/year, asymptomatic between. GINA Step 1 considered.",
      pattern: 'infrequentViralWheeze' as YoungChildSymptomPattern,
      initialGinaStep: 1 as YoungChildGinaSteps,
      ginaRef: "GINA 2025 Box 11-2, Step 1"
    },
    {
      label: "Asthma diagnosis OR wheezing episodes 3 or more times per year OR interval symptoms",
      description: "More frequent wheezing or intercurrent symptoms. GINA Step 2 considered.",
      pattern: 'persistentAsthmaOrFrequentWheeze' as YoungChildSymptomPattern,
      initialGinaStep: 2 as YoungChildGinaSteps,
      ginaRef: "GINA 2025 Box 11-2, Step 2"
    },
    {
      label: "Severe symptoms or uncertain diagnosis, OR failure of initial therapies",
      description: "Requires specialist assessment. GINA Step 4 (Referral).",
      pattern: 'persistentAsthmaOrFrequentWheeze' as YoungChildSymptomPattern,
      initialGinaStep: 4 as YoungChildGinaSteps,
      ginaRef: "GINA 2025 Box 11-2, Step 4 (Referral)"
    }
  ];

  return (
    <Card
      title="Provisional Diagnosis & Treatment Trial"
      icon={<AlertTriangle className="text-amber-600" />}
      className="border-amber-300 bg-amber-50"
    >
      <div className="mb-4 p-4 bg-white border border-slate-200 rounded-md">
        <p className="text-slate-700 leading-relaxed">
          The child meets <strong>{metCriteriaCount} of the 3 required criteria</strong> for a confirmed diagnosis of asthma, leading to a provisional diagnosis of 'suspected asthma'.
        </p>
        <div className="mt-4 flex items-start">
          <HelpCircle size={22} className="mr-3 mt-0.5 text-slate-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">GINA 2025 Guidance</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              "...a provisional diagnosis of 'suspected asthma' should be given and treatment considered, with periodic reassessment to document the response..."
            </p>
            <p className="text-xs text-slate-500 mt-2">(GINA 2025, p. 180)</p>
          </div>
        </div>
      </div>

      <p className="text-center font-medium text-slate-700 mb-4">
        Select the child's symptom pattern below to determine the appropriate initial controller treatment for a diagnostic trial.
      </p>

      <div className="space-y-3">
        {options.map((opt) => (
          <Button
            key={opt.label}
            onClick={() => handleSelection(opt.pattern, opt.initialGinaStep)}
            variant="secondary"
            fullWidth
            justify="between"
            size="lg"
            className="!py-4 text-left h-auto"
            aria-label={`${opt.label}. ${opt.description}. ${opt.ginaRef}`}
          >
            <div className="flex-grow">
              <h3 className="font-semibold text-violet-700 text-base whitespace-normal">{opt.label}</h3>
              <p className="text-sm text-slate-600 mt-1 font-normal whitespace-normal">{opt.description}</p>
              <p className="text-xs text-violet-500 mt-1.5 font-medium whitespace-normal">{opt.ginaRef}</p>
            </div>
            <ChevronRight size={20} className="text-slate-400 flex-shrink-0 ml-2" />
          </Button>
        ))}
      </div>
      <div className="mt-6 p-3 bg-slate-100 border border-slate-200 rounded-lg text-sm">
        <div className="flex items-start">
          <HelpCircle size={18} className="mr-2 mt-0.5 text-slate-500 flex-shrink-0" />
          <p className="text-slate-600">
            This assessment helps select an initial management approach. Ensure correct inhaler technique (pMDI with spacer and age-appropriate facemask).
          </p>
        </div>
      </div>
    </Card>
  );
};

export default YoungChildSuspectedAsthmaStep;