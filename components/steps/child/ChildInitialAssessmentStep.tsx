
import React, { useState } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ChevronRight, HelpCircle, ClipboardList, CheckCircle2 } from 'lucide-react';
import { ChildGINASteps } from '../../../types';

const ChildInitialAssessmentStep: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { updatePatientData } = usePatientData();
  
  const [symptoms, setSymptoms] = useState<'rare' | 'occasional' | 'frequent' | null>(null);
  const [nightWaking, setNightWaking] = useState<'rare' | 'frequent' | null>(null);
  const [severePresentation, setSeverePresentation] = useState<boolean | null>(null);

  // Deduce logic for Children 6-11 (GINA Box 4-2)
  const getRecommendation = () => {
    if (severePresentation === true) {
      return {
        step: 4,
        reason: "Severe presentation: Severely uncontrolled asthma or acute exacerbation with low lung function."
      };
    }
    if (symptoms === 'frequent' || nightWaking === 'frequent') {
      return {
        step: 3,
        reason: "Troublesome asthma: Symptoms most days OR waking at night once a week or more."
      };
    }
    if (symptoms === 'occasional') {
      return {
        step: 2,
        reason: "Persistent asthma symptoms: Twice a month or more, but not daily."
      };
    }
    if (symptoms === 'rare') {
      return {
        step: 1,
        reason: "Infrequent symptoms: Less than twice a month."
      };
    }
    return null;
  };

  const recommendation = getRecommendation();

  const handleContinue = () => {
    if (recommendation) {
      // Save answers for summary
      const symptomText = symptoms === 'rare' ? '< Twice a month' : symptoms === 'occasional' ? 'Twice a month or more' : 'Most days';
      const nightText = nightWaking === 'rare' ? 'No / Less than once a week' : 'Yes, once a week or more';

      updatePatientData({
        child_currentGinaStep: recommendation.step as ChildGINASteps,
        child_initialAssessment: {
            symptomFrequency: symptomText,
            nightWaking: nightText,
            severePresentation: severePresentation || false
        }
      });

      navigateTo('CHILD_PATHWAY_SELECTION_STEP');
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
    <Card title="Initial Symptom Assessment (Children 6-11)" icon={<ClipboardList className="text-emerald-600" />}>
      <p className="mb-6 text-sm text-slate-600 leading-relaxed">
        Answer the following to determine the recommended GINA starting step for a child aged 6-11 years.
      </p>
      
      <QuestionBlock label="1. How often does the child have asthma symptoms?">
        <Button 
            variant={symptoms === 'rare' ? 'primary' : 'secondary'} 
            onClick={() => setSymptoms('rare')}
            size="sm"
        >
            &lt; Twice a month
        </Button>
        <Button 
            variant={symptoms === 'occasional' ? 'primary' : 'secondary'} 
            onClick={() => setSymptoms('occasional')}
            size="sm"
        >
            Twice a month or more
        </Button>
        <Button 
            variant={symptoms === 'frequent' ? 'primary' : 'secondary'} 
            onClick={() => setSymptoms('frequent')}
            size="sm"
        >
            Most days
        </Button>
      </QuestionBlock>

      <QuestionBlock label="2. Does the child wake up at night due to asthma?">
         <Button 
            variant={nightWaking === 'rare' ? 'primary' : 'secondary'} 
            onClick={() => setNightWaking('rare')}
            size="sm"
        >
            No / Less than once a week
        </Button>
        <Button 
            variant={nightWaking === 'frequent' ? 'primary' : 'secondary'} 
            onClick={() => setNightWaking('frequent')}
            size="sm"
        >
            Yes, once a week or more
        </Button>
      </QuestionBlock>

      <QuestionBlock label="3. Is this a severe presentation? (Uncontrolled symptoms + Low Lung Function)">
         <Button 
            variant={severePresentation === false ? 'success' : 'secondary'} 
            onClick={() => setSeverePresentation(false)}
            size="sm"
        >
            No
        </Button>
        <Button 
            variant={severePresentation === true ? 'danger' : 'secondary'} 
            onClick={() => setSeverePresentation(true)}
            size="sm"
        >
            Yes
        </Button>
      </QuestionBlock>

      {recommendation && (
        <div className="mt-6 p-5 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg animate-pulse-shadow">
            <div className="flex items-center mb-2">
                <CheckCircle2 size={24} className="text-emerald-600 mr-2"/>
                <h3 className="text-lg font-bold text-emerald-900">Recommended Start: Step {recommendation.step}</h3>
            </div>
            <p className="text-sm text-emerald-800 mb-4">
                {recommendation.reason}
            </p>
            <Button 
                onClick={handleContinue}
                fullWidth
                variant="success"
                rightIcon={<ChevronRight />}
                size="lg"
            >
                Proceed to Step {recommendation.step} Treatment
            </Button>
        </div>
      )}

       <div className="mt-8 p-3 bg-white border border-slate-200 rounded-lg text-sm">
        <div className="flex items-start">
          <HelpCircle size={18} className="mr-2 mt-0.5 text-slate-500 flex-shrink-0" />
          <p className="text-slate-600">
            This tool uses GINA 2025 logic to deduce the initial step. Ensure a diagnosis of asthma is confirmed or suspected before starting treatment.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ChildInitialAssessmentStep;
