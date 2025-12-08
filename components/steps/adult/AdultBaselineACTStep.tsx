
import React, { useState, useMemo } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { TestResult } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ClipboardList, CheckCircle2, AlertTriangle, XCircle, ChevronRight, ArrowRight } from '../../../constants/icons';

const questions = [
  { id: 'q1', text: 'During the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?', options: [{ label: 'All of the time', value: 1 }, { label: 'Most of the time', value: 2 }, { label: 'Some of the time', value: 3 }, { label: 'A little of the time', value: 4 }, { label: 'None of the time', value: 5 }] },
  { id: 'q2', text: 'During the past 4 weeks, how often have you had shortness of breath?', options: [{ label: 'More than once a day', value: 1 }, { label: 'Once a day', value: 2 }, { label: '3 to 6 times a week', value: 3 }, { label: 'Once or twice a week', value: 4 }, { label: 'Not at all', value: 5 }] },
  { id: 'q3', text: 'During the past 4 weeks, how often did your asthma symptoms (wheezing, coughing, shortness of breath, chest tightness or pain) wake you up at night or earlier than usual in the morning?', options: [{ label: '4 or more nights a week', value: 1 }, { label: '2 or 3 nights a week', value: 2 }, { label: 'Once a week', value: 3 }, { label: 'Once or twice', value: 4 }, { label: 'Not at all', value: 5 }] },
  { id: 'q4', text: 'During the past 4 weeks, how often have you used your rescue inhaler (such as salbutamol)?', options: [{ label: '3 or more times per day', value: 1 }, { label: '1 or 2 times per day', value: 2 }, { label: '2 or 3 times per week', value: 3 }, { label: 'Once a week or less', value: 4 }, { label: 'Not at all', value: 5 }] },
  { id: 'q5', text: 'How would you rate your asthma control during the past 4 weeks?', options: [{ label: 'Not controlled at all', value: 1 }, { label: 'Poorly controlled', value: 2 }, { label: 'Somewhat controlled', value: 3 }, { label: 'Well controlled', value: 4 }, { label: 'Completely controlled', value: 5 }] },
];

const AdultBaselineACTStep: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { patientData, updatePatientData } = usePatientData();
  const [answers, setAnswers] = useState<Record<string, number | null>>({ q1: null, q2: null, q3: null, q4: null, q5: null });
  const [showResult, setShowResult] = useState(false);

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setShowResult(false);
  };

  const totalScore = useMemo(() => {
    const values = Object.values(answers) as (number | null)[];
    return values.reduce((sum, val) => sum + (val || 0), 0);
  }, [answers]);

  const interpretation = useMemo(() => {
    if (totalScore >= 20) return { text: 'Well Controlled', Icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-500' };
    if (totalScore >= 16) return { text: 'Not Well-Controlled', Icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-500' };
    return { text: 'Very Poorly Controlled', Icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-500' };
  }, [totalScore]);

  const allAnswered = Object.values(answers).every(ans => ans !== null);

  const handleCalculate = () => {
    if (allAnswered) {
      setShowResult(true);
    }
  };

  const handleContinue = () => {
    // Save result to history
    if (showResult && totalScore > 0) {
        const newResult: TestResult = { date: new Date().toISOString(), score: totalScore };
        updatePatientData({ actHistory: [...patientData.actHistory, newResult] });
    }
    navigateTo('ADULT_SYMPTOM_FREQUENCY_STEP');
  };

  const handleSkip = () => {
      navigateTo('ADULT_SYMPTOM_FREQUENCY_STEP');
  }

  return (
    <Card title="Baseline Asthma Control Test (ACT)" icon={<ClipboardList className="text-indigo-600" />}>
      <p className="mb-6 text-sm text-slate-600 leading-relaxed">
        Establish a baseline score for asthma control before initiating or adjusting treatment. This score (ranging from 5 to 25) will serve as a reference for future follow-up visits.
      </p>
      
      <div className="space-y-4 mb-6">
        {questions.map(q => (
          <div key={q.id} className="p-4 bg-slate-100 border border-slate-300 rounded-lg shadow-inner">
            <p className="font-medium text-slate-800 mb-3 text-sm">{q.id.toUpperCase()}. {q.text}</p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {q.options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswerChange(q.id, opt.value)}
                  className={`px-2 py-2 text-xs font-medium rounded-md border transition-all duration-200 shadow-sm ${
                    answers[q.id] === opt.value
                      ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-offset-1 ring-indigo-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {!showResult && (
        <div className="flex justify-center gap-4 mt-6">
             <Button onClick={handleSkip} variant="secondary">Skip Baseline Assessment</Button>
             <Button onClick={handleCalculate} disabled={!allAnswered} size="lg" rightIcon={<ArrowRight/>}>Calculate Score</Button>
        </div>
      )}

      {showResult && (
        <div className={`mt-6 p-5 rounded-lg border-l-4 ${interpretation.bg} ${interpretation.border} animate-pulse-shadow`}>
          <div className="text-center">
            <p className="text-sm text-slate-600 uppercase tracking-wider font-semibold">Baseline ACT Score</p>
            <p className="text-6xl font-bold my-2 text-slate-800">{totalScore}</p>
            <div className={`flex items-center justify-center font-bold text-xl ${interpretation.color}`}>
                <interpretation.Icon className="mr-2" size={28} />
                {interpretation.text}
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button 
                onClick={handleContinue} 
                fullWidth 
                size="xl" 
                variant="primary"
                rightIcon={<ChevronRight />}
            >
                Save Baseline & Continue
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AdultBaselineACTStep;
