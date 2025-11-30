
import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { AdultSymptomFrequency } from '../../../types';
import { ClipboardList, ChevronRight, HelpCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

const AdultSymptomFrequencyStep: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { updatePatientData } = usePatientData();
  const [symptoms, setSymptoms] = useState<'rare' | 'occasional' | 'frequent' | null>(null);
  const [nightWaking, setNightWaking] = useState<'rare' | 'frequent' | null>(null);
  const [severePresentation, setSeverePresentation] = useState<boolean | null>(null);

  // Deduce logic
  const getRecommendation = () => {
    if (severePresentation === true) {
      return {
        step: 4,
        frequency: 'severeDailyOrExacerbation' as AdultSymptomFrequency,
        reason: "Patient presents with severely uncontrolled asthma or an acute exacerbation."
      };
    }
    if (symptoms === 'frequent' || nightWaking === 'frequent') {
      return {
        step: 3,
        frequency: 'mostDaysOrWakingWeekly' as AdultSymptomFrequency,
        reason: "Patient has troublesome symptoms most days OR wakes due to asthma once a week or more."
      };
    }
    if (symptoms === 'occasional') {
      return {
        step: 2,
        frequency: 'twiceAMonthOrMore' as AdultSymptomFrequency,
        reason: "Patient has symptoms twice a month or more, but less than daily."
      };
    }
    if (symptoms === 'rare') {
      return {
        step: 1,
        frequency: 'lessThanTwiceAMonth' as AdultSymptomFrequency,
        reason: "Patient has infrequent symptoms (less than twice a month)."
      };
    }
    return null;
  };

  const recommendation = getRecommendation();

  const handleContinue = () => {
    if (recommendation) {
      // Save specific answers to context for summary
      const symptomText = symptoms === 'rare' ? '< Twice a month' : symptoms === 'occasional' ? 'Twice a month or more' : 'Most days';
      const nightText = nightWaking === 'rare' ? 'No / Rarely' : 'Yes, once a week or more';
      
      updatePatientData({
          adult_symptomFrequency: recommendation.frequency,
          adult_currentGinaStep: recommendation.step as 1 | 2 | 3 | 4,
          adult_initialAssessment: {
              symptomFrequency: symptomText,
              nightWaking: nightText,
              severePresentation: severePresentation || false
          }
      });

      navigateTo('ADULT_PATHWAY_SELECTION_STEP');
    }
  };

  const QuestionBlock: React.FC<{ 
    label: string; 
    children: React.ReactNode; 
  }> = ({ label, children }) => (
    <div className="p-4 bg-slate-100 border border-slate-300 rounded-lg shadow-inner mb-4">
        <h4 className="font-medium text-slate-800 mb-3">{label}</h4>
        <div className="flex flex-wrap gap-2">
            {children}
        </div>
    </div>
  );

  return (
    <Card title="Initial Symptom Assessment (Adults)" icon={<ClipboardList className="text-sky-600" />}>
      <p className="mb-6 text-sm text-slate-600 leading-relaxed">
        Answer the following questions to determine the recommended GINA starting step (GINA 2025 Box 2-4).
      </p>
      
      <QuestionBlock label="1. How often does the patient have asthma symptoms?">
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

      <QuestionBlock label="2. Does the patient wake up at night due to asthma?">
         <Button 
            variant={nightWaking === 'rare' ? 'primary' : 'secondary'} 
            onClick={() => setNightWaking('rare')}
            size="sm"
        >
            No / Rarely
        </Button>
        <Button 
            variant={nightWaking === 'frequent' ? 'primary' : 'secondary'} 
            onClick={() => setNightWaking('frequent')}
            size="sm"
        >
            Yes, once a week or more
        </Button>
      </QuestionBlock>

      <QuestionBlock label="3. Is this a severe presentation? (Severely uncontrolled or acute exacerbation)">
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
        <div className="mt-6 p-5 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg animate-pulse-shadow">
            <div className="flex items-center mb-2">
                <CheckCircle2 size={24} className="text-indigo-600 mr-2"/>
                <h3 className="text-lg font-bold text-indigo-900">Recommended Start: Step {recommendation.step}</h3>
            </div>
            <p className="text-sm text-indigo-800 mb-4">
                {recommendation.reason}
            </p>
            <Button 
                onClick={handleContinue}
                fullWidth
                variant="primary"
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
            This tool uses GINA 2025 criteria to deduce the appropriate starting step. You can always adjust the step later if clinical judgment suggests otherwise.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AdultSymptomFrequencyStep;
