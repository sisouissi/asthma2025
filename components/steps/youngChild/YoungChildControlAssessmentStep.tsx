
import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { useUIState } from '../../../contexts/UIStateContext';
import { ControlLevel, ControlAnswers } from '../../../types';
import { ChevronRight, ListChecks, Baby } from 'lucide-react';
import CACTModalContent from '../../common/modal_content/cACTModalContent';
import FollowUpContext from '../../common/FollowUpContext';
import ManagementCycleWidget from '../../common/ManagementCycleWidget';

interface ControlQuestion {
  id: keyof ControlAnswers;
  questionText: string;
  options: { label: string; value: boolean }[];
}

const questions: ControlQuestion[] = [
  {
    id: 'daytimeSymptoms',
    questionText: 'In the past 4 weeks, has the child had daytime asthma symptoms more than twice a week?',
    options: [{ label: 'Yes', value: true }, { label: 'No', value: false }],
  },
  {
    id: 'activityLimitation',
    questionText: 'In the past 4 weeks, has the child had any activity limitation (e.g., runs/plays less, tires easily)?',
    options: [{ label: 'Yes', value: true }, { label: 'No', value: false }],
  },
  {
    id: 'nocturnalSymptoms',
    questionText: 'In the past 4 weeks, has the child had any night waking or coughing due to asthma?',
    options: [{ label: 'Yes', value: true }, { label: 'No', value: false }],
  },
  {
    id: 'relieverNeed',
    questionText: 'In the past 4 weeks, has the child needed SABA reliever for symptoms more than twice a week?',
    options: [{ label: 'Yes', value: true }, { label: 'No', value: false }],
  },
];

const YoungChildControlAssessmentStep: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { updatePatientData } = usePatientData();
  const { openInfoModal } = useUIState();

  const [answers, setAnswers] = useState<ControlAnswers>({
    daytimeSymptoms: null,
    activityLimitation: null,
    nocturnalSymptoms: null,
    relieverNeed: null,
  });

  const handleAnswerChange = (questionId: keyof ControlAnswers, value: boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const assessAndNavigate = () => {
    const score = Object.values(answers).filter(val => val === true).length;
    let level: ControlLevel;
    if (score === 0) {
      level = 'wellControlled';
    } else if (score >= 1 && score <= 2) {
      level = 'partlyControlled';
    } else {
      level = 'uncontrolled';
    }
    navigateTo('YOUNG_CHILD_TREATMENT_PLAN_STEP', { 
        youngChild_controlLevel: level,
        youngChild_controlAssessmentAnswers: answers 
    });
  };

  const allQuestionsAnswered = Object.values(answers).every(ans => ans !== null);

  return (
    <Card title="Asthma Control Assessment (Child ≤5 years)" icon={<Baby className="text-violet-600" />}>
      <ManagementCycleWidget ageGroup="youngChild" />
      <FollowUpContext />
      <p className="mb-1 text-sm text-slate-600">
        Based on parent/caregiver report for the <strong>past 4 weeks</strong>, assess the level of symptom control (based on GINA 2025, Box 11-1).
      </p>
      
      <div className="space-y-6 mt-6">
        {questions.map(q => (
          <div key={q.id} className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
            <p className="font-medium text-slate-700 mb-3 text-sm">{q.questionText}</p>
            <div className="flex space-x-2">
              {q.options.map(opt => (
                <Button
                  key={String(opt.value)}
                  onClick={() => handleAnswerChange(q.id, opt.value)}
                  variant={answers[q.id] === opt.value ? (opt.value === true ? 'warning' : 'success') : 'secondary'}
                  size="md"
                  fullWidth
                  aria-pressed={answers[q.id] === opt.value}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button 
            onClick={assessAndNavigate} 
            disabled={!allQuestionsAnswered} 
            fullWidth 
            rightIcon={<ChevronRight />} 
            variant="violet" 
            size="xl"
        >
          Complete Assessment & Review Plan
        </Button>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-200">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 text-center mb-4">Or use a validated tool for assessment and tracking:</h3>
        <div className="flex justify-center gap-4">
            <Button onClick={() => openInfoModal("Childhood Asthma Control Test (cACT)", <CACTModalContent />)} variant="violet" size="lg">
                Take cACT
            </Button>
        </div>
        <p className="text-xs text-center text-slate-500 mt-2">
            Note: cACT is validated for children aged 4-11 years.
        </p>
      </div>
    </Card>
  );
};

export default YoungChildControlAssessmentStep;
