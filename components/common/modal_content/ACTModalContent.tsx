



import React, { useState, useMemo, useCallback } from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { TestResult } from '../../../types';
import Button from '../../ui/Button';
import TestHistory from '../TestHistory';
import { CheckCircle2, AlertTriangle, XCircle, Save, Lightbulb } from 'lucide-react';

const questions = [
  { id: 'q1', text: 'During the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?', options: [{ label: 'All of the time', value: 1 }, { label: 'Most of the time', value: 2 }, { label: 'Some of the time', value: 3 }, { label: 'A little of the time', value: 4 }, { label: 'None of the time', value: 5 }] },
  { id: 'q2', text: 'During the past 4 weeks, how often have you had shortness of breath?', options: [{ label: 'More than once a day', value: 1 }, { label: 'Once a day', value: 2 }, { label: '3 to 6 times a week', value: 3 }, { label: 'Once or twice a week', value: 4 }, { label: 'Not at all', value: 5 }] },
  { id: 'q3', text: 'During the past 4 weeks, how often did your asthma symptoms (wheezing, coughing, shortness of breath, chest tightness or pain) wake you up at night or earlier than usual in the morning?', options: [{ label: '4 or more nights a week', value: 1 }, { label: '2 or 3 nights a week', value: 2 }, { label: 'Once a week', value: 3 }, { label: 'Once or twice', value: 4 }, { label: 'Not at all', value: 5 }] },
  { id: 'q4', text: 'During the past 4 weeks, how often have you used your rescue inhaler (such as salbutamol)?', options: [{ label: '3 or more times per day', value: 1 }, { label: '1 or 2 times per day', value: 2 }, { label: '2 or 3 times per week', value: 3 }, { label: 'Once a week or less', value: 4 }, { label: 'Not at all', value: 5 }] },
  { id: 'q5', text: 'How would you rate your asthma control during the past 4 weeks?', options: [{ label: 'Not controlled at all', value: 1 }, { label: 'Poorly controlled', value: 2 }, { label: 'Somewhat controlled', value: 3 }, { label: 'Well controlled', value: 4 }, { label: 'Completely controlled', value: 5 }] },
];

const ACTModalContent: React.FC = () => {
  const { patientData, updatePatientData } = usePatientData();
  const [answers, setAnswers] = useState<Record<string, number | null>>({ q1: null, q2: null, q3: null, q4: null, q5: null });
  const [showResult, setShowResult] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setShowResult(false);
    setResultSaved(false);
  };

  const totalScore = useMemo(() => {
    const values = Object.values(answers) as (number | null)[];
    return values.reduce((sum, val) => sum + (val || 0), 0);
  }, [answers]);

  const interpretation = useMemo(() => {
    if (totalScore >= 20) return { text: 'Well Controlled', Icon: CheckCircle2, color: 'text-emerald-600' };
    if (totalScore >= 16) return { text: 'Not Well-Controlled', Icon: AlertTriangle, color: 'text-amber-600' };
    return { text: 'Very Poorly Controlled', Icon: XCircle, color: 'text-red-600' };
  }, [totalScore]);

  const allAnswered = Object.values(answers).every(ans => ans !== null);

  const handleCalculate = () => {
    if (allAnswered) {
      setShowResult(true);
    }
  };

  const handleSaveResult = useCallback(() => {
    if (totalScore > 0) {
      const newResult: TestResult = { date: new Date().toISOString(), score: totalScore };
      updatePatientData({ actHistory: [...patientData.actHistory, newResult] });
      setResultSaved(true);
    }
  }, [totalScore, patientData.actHistory, updatePatientData]);

  return (
    <div className="space-y-4">
      <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
        {questions.map(q => (
          <div key={q.id} className="p-3 bg-white rounded-lg border border-slate-200">
            <p className="font-medium text-slate-700 mb-2 text-sm">{q.id.toUpperCase()}. {q.text}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {q.options.map(opt => (
                <Button
                  key={opt.value}
                  onClick={() => handleAnswerChange(q.id, opt.value)}
                  variant={answers[q.id] === opt.value ? 'primary' : 'secondary'}
                  size="sm"
                  className="!text-xs !py-1.5"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {!showResult && (
        <div className="mt-4 text-center">
          <Button onClick={handleCalculate} disabled={!allAnswered} size="lg">Calculate Score</Button>
        </div>
      )}

      {showResult && (
        <div className="mt-4 p-4 bg-slate-100 rounded-lg border border-slate-200 text-center">
          <p className="text-sm text-slate-600">Total ACT Score:</p>
          <p className="text-5xl font-bold my-2 text-sky-600">{totalScore}</p>
          <div className={`flex items-center justify-center font-semibold text-lg ${interpretation.color}`}>
            <interpretation.Icon className="mr-2" size={24} />
            {interpretation.text}
          </div>
          {!resultSaved && (
              <Button onClick={handleSaveResult} leftIcon={<Save size={16}/>} variant="success" className="mt-4">
                  Save Result to History
              </Button>
          )}
           {resultSaved && (
                <div className="mt-4 text-sm text-green-600 font-medium flex items-center justify-center">
                    <CheckCircle2 size={16} className="mr-2"/> Result Saved
                </div>
           )}
        </div>
      )}

      <TestHistory history={patientData.actHistory} testName="ACT" />

      <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 text-sm">
        <Lightbulb className="inline-block mr-2" size={16}/>
        <strong>Interpretation:</strong> 25 = Total Control, &lt;20 = Uncontrolled. A score change of 3 points is clinically significant.
      </div>
    </div>
  );
};

export default ACTModalContent;