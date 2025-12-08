
import React, { useState } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { YoungChildSymptomPattern, YoungChildGinaSteps } from '../../../types';
import { ChevronRight, HelpCircle, Baby, CheckCircle2, AlertTriangle } from 'lucide-react';

const YoungChildSymptomPatternStep: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { updatePatientData } = usePatientData();

  const [triggers, setTriggers] = useState<'viral' | 'multiple' | null>(null);
  const [interval, setInterval] = useState<'none' | 'present' | null>(null);
  const [frequency, setFrequency] = useState<'infrequent' | 'frequent' | 'severe' | null>(null);

  // Deduction Logic based on GINA Box 11-2
  const getRecommendation = () => {
    if (frequency === 'severe') {
        return {
            step: 3, // Suggest Step 3 for severe/uncontrolled
            pattern: 'persistentAsthmaOrFrequentWheeze' as YoungChildSymptomPattern,
            reason: "Severe or clearly uncontrolled symptoms. Consider starting at Step 3 (Double low dose ICS) and consider specialist referral.",
            color: 'amber' // Warning color due to severity
        };
    }

    if (triggers === 'multiple' || interval === 'present' || frequency === 'frequent') {
        return {
            step: 2,
            pattern: 'persistentAsthmaOrFrequentWheeze' as YoungChildSymptomPattern,
            reason: "Symptom pattern consistent with asthma (multiple triggers, interval symptoms, or frequent episodes). Start Step 2 (Daily low dose ICS).",
            color: 'violet'
        };
    }

    if (triggers === 'viral' && interval === 'none' && frequency === 'infrequent') {
        return {
            step: 1,
            pattern: 'infrequentViralWheeze' as YoungChildSymptomPattern,
            reason: "Infrequent viral wheeze with no interval symptoms. Start Step 1 (As-needed SABA).",
            color: 'violet'
        };
    }

    return null;
  };

  const recommendation = getRecommendation();

  const handleContinue = () => {
    if (recommendation) {
      // Implicitly save the result by setting the Step and Pattern
      updatePatientData({
          youngChild_symptomPattern: recommendation.pattern,
          youngChild_currentGinaStep: recommendation.step as YoungChildGinaSteps,
          youngChild_currentTreatmentStrategy: 'preferred',
      });
      
      navigateTo('YOUNG_CHILD_RISK_ASSESSMENT_STEP');
    }
  };

  const QuestionBlock: React.FC<{
    label: string;
    children: React.ReactNode;
  }> = ({ label, children }) => (
    <div className="p-4 bg-slate-100 border border-slate-300 rounded-lg shadow-inner mb-4">
        <h4 className="font-medium text-slate-800 mb-3 text-sm">{label}</h4>
        <div className="flex flex-wrap gap-2">
            {children}
        </div>
    </div>
  );

  return (
    <Card title="Symptom Pattern Assessment (Child ≤5 years)" icon={<Baby className="text-violet-600" />}>
      <p className="mb-6 text-sm text-slate-600 leading-relaxed">
        Answer the following to determine the symptom pattern and appropriate GINA starting step (Box 11-2).
      </p>

      <QuestionBlock label="1. What triggers the respiratory symptoms?">
        <Button
            variant={triggers === 'viral' ? 'primary' : 'secondary'}
            onClick={() => setTriggers('viral')}
            size="sm"
        >
            Viral infections only (colds)
        </Button>
        <Button
            variant={triggers === 'multiple' ? 'primary' : 'secondary'}
            onClick={() => setTriggers('multiple')}
            size="sm"
        >
            Multiple (virus, play, laughing, crying, allergens)
        </Button>
      </QuestionBlock>

      <QuestionBlock label="2. Are there symptoms between episodes?">
        <Button
            variant={interval === 'none' ? 'primary' : 'secondary'}
            onClick={() => setInterval('none')}
            size="sm"
        >
            No, completely well between episodes
        </Button>
        <Button
            variant={interval === 'present' ? 'primary' : 'secondary'}
            onClick={() => setInterval('present')}
            size="sm"
        >
            Yes (cough, wheeze, or heavy breathing)
        </Button>
      </QuestionBlock>

      <QuestionBlock label="3. How frequent or severe are the episodes?">
        <Button
            variant={frequency === 'infrequent' ? 'primary' : 'secondary'}
            onClick={() => setFrequency('infrequent')}
            size="sm"
        >
            Infrequent (&lt;3 per year)
        </Button>
        <Button
            variant={frequency === 'frequent' ? 'primary' : 'secondary'}
            onClick={() => setFrequency('frequent')}
            size="sm"
        >
            Frequent (≥3 per year)
        </Button>
         <Button
            variant={frequency === 'severe' ? 'danger' : 'secondary'}
            onClick={() => setFrequency('severe')}
            size="sm"
        >
            Severe / Uncontrolled
        </Button>
      </QuestionBlock>

      {recommendation && (
        <div className={`mt-6 p-5 bg-${recommendation.color}-50 border-l-4 border-${recommendation.color}-500 rounded-r-lg animate-pulse-shadow`}>
            <div className="flex items-center mb-2">
                {recommendation.color === 'amber' ? <AlertTriangle size={24} className="text-amber-600 mr-2"/> : <CheckCircle2 size={24} className="text-violet-600 mr-2"/>}
                <h3 className={`text-lg font-bold text-${recommendation.color}-900`}>Recommended Start: Step {recommendation.step}</h3>
            </div>
            <p className={`text-sm text-${recommendation.color}-800 mb-4`}>
                {recommendation.reason}
            </p>
            <Button
                onClick={handleContinue}
                fullWidth
                variant={recommendation.color === 'amber' ? 'warning' : 'violet'}
                rightIcon={<ChevronRight />}
                size="lg"
            >
                Proceed to Step {recommendation.step} Plan
            </Button>
        </div>
      )}

       <div className="mt-8 p-3 bg-white border border-slate-200 rounded-lg text-sm">
        <div className="flex items-start">
          <HelpCircle size={18} className="mr-2 mt-0.5 text-slate-500 flex-shrink-0" />
          <p className="text-slate-600">
            Note: If the diagnosis is in doubt, a trial of treatment (e.g. with Step 2) can help confirm the diagnosis of asthma.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default YoungChildSymptomPatternStep;
