
import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useNavigation } from '../../../contexts/NavigationContext';
import { useUIState } from '../../../contexts/UIStateContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { ControlLevel, ControlAnswers } from '../../../types';
import { CheckCircle2, AlertTriangle, XCircle, ChevronRight, ListChecks } from 'lucide-react';
import ACTModalContent from '../../common/modal_content/ACTModalContent';
import ACQModalContent from '../../common/modal_content/ACQModalContent';
import FollowUpContext from '../../common/FollowUpContext';


interface ControlQuestion {
  id: keyof ControlAnswers;
  questionText: string;
  options: { label: string; value: boolean }[];
}

const questions: ControlQuestion[] = [
  {
    id: 'daytimeSymptoms',
    questionText: 'In the past 4 weeks, have you had daytime asthma symptoms more than twice a week?',
    options: [{ label: 'Yes', value: true }, { label: 'No', value: false }],
  },
  {
    id: 'activityLimitation',
    questionText: 'In the past 4 weeks, have you had any activity limitation due to asthma?',
    options: [{ label: 'Yes', value: true }, { label: 'No', value: false }],
  },
  {
    id: 'nocturnalSymptoms',
    questionText: 'In the past 4 weeks, have you had any night waking or morning symptoms due to asthma?',
    options: [{ label: 'Yes', value: true }, { label: 'No', value: false }],
  },
  {
    id: 'relieverNeed',
    questionText: 'In the past 4 weeks, have you needed to use your SABA reliever for symptoms more than twice a week? (Not including preventive use before exercise)',
    options: [{ label: 'Yes', value: true }, { label: 'No', value: false }],
  },
];

const AdultControlAssessmentStep: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { openInfoModal } = useUIState();
  const { updatePatientData } = usePatientData();

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
    
    navigateTo('ADULT_TREATMENT_PLAN_STEP', { 
      adult_controlLevel: level,
      adult_controlAssessmentAnswers: answers 
    });
  };

  const allQuestionsAnswered = Object.values(answers).every(ans => ans !== null);

  return (
    <Card title="Asthma Control Assessment (Adult)" icon={<ListChecks className="text-sky-600" />}>
      <FollowUpContext />
      
      <p className="mb-1 text-sm text-slate-600">
        Answer the following questions regarding the patient's <strong>past 4 weeks</strong> to assess the level of symptom control based on GINA 2025 (Box 2-2A).
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
                  aria-label={`${q.questionText} - Answer: ${opt.label}`}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button onClick={assessAndNavigate} disabled={!allQuestionsAnswered} fullWidth rightIcon={<ChevronRight />} variant="primary" size="xl">
          Complete Assessment & Review Plan
        </Button>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 text-center mb-4">Or use a validated tool for assessment and tracking:</h3>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => openInfoModal("Asthma Control Test (ACT)", <ACTModalContent />)} variant="info" size="lg">
                Take ACT
            </Button>
            <Button onClick={() => openInfoModal("Asthma Control Questionnaire (ACQ-5)", <ACQModalContent />)} variant="teal" size="lg">
                Take ACQ-5
            </Button>
        </div>
      </div>
    </Card>
  );
};

export default AdultControlAssessmentStep;
