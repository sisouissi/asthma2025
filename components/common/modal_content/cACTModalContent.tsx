



import React, { useState, useMemo, useCallback } from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { TestResult } from '../../../types';
import Button from '../../ui/Button';
import TestHistory from '../TestHistory';
import { CheckCircle2, AlertTriangle, Save, Lightbulb, User, Users } from 'lucide-react';

const childQuestions = [
  { id: 'cq1', text: 'How is your asthma today?', options: [{ label: 'Very good', value: 3 }, { label: 'Good', value: 2 }, { label: 'Not so good', value: 1 }, { label: 'Bad', value: 0 }] },
  { id: 'cq2', text: 'How much does your asthma bother you when you run, exercise, or play sports?', options: [{ label: 'Not at all', value: 3 }, { label: 'A little bit', value: 2 }, { label: 'Quite a lot', value: 1 }, { label: 'A lot', value: 0 }] },
  { id: 'cq3', text: 'Do you cough because of your asthma?', options: [{ label: 'Not at all', value: 3 }, { label: 'A little bit', value: 2 }, { label: 'Quite a lot', value: 1 }, { label: 'A lot', value: 0 }] },
  { id: 'cq4', text: 'Do you wake up during the night because of your asthma?', options: [{ label: 'Never', value: 3 }, { label: 'Once or twice', value: 2 }, { label: 'A few times', value: 1 }, { label: 'Lots of times', value: 0 }] },
];

const parentQuestions = [
  { id: 'pq1', text: 'During the past 4 weeks, how often did your child have daytime asthma symptoms?', options: [{ label: 'Not at all', value: 5 }, { label: '1 to 3 days', value: 4 }, { label: '4 to 10 days', value: 3 }, { label: '11 to 20 days', value: 2 }, { label: '21 days to every day', value: 1 }, { label: 'Every day', value: 0 }] },
  { id: 'pq2', text: 'During the past 4 weeks, how often did your child wheeze during the day because of asthma?', options: [{ label: 'Not at all', value: 3 }, { label: 'Once or twice', value: 2 }, { label: 'A few times', value: 1 }, { label: 'Lots of times', value: 0 }] },
  { id: 'pq3', text: 'During the past 4 weeks, how often did your child wake up during the night because of asthma?', options: [{ label: 'Not at all', value: 3 }, { label: 'Once or twice', value: 2 }, { label: 'Once a week', value: 1 }, { label: 'More than once a week', value: 0 }] },
];

const cACTModalContent: React.FC = () => {
    const { patientData, updatePatientData } = usePatientData();
    const [answers, setAnswers] = useState<Record<string, number | null>>({});
    const [showResult, setShowResult] = useState(false);
    const [resultSaved, setResultSaved] = useState(false);

    const allQuestions = [...childQuestions, ...parentQuestions];

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
        if (totalScore <= 19) return { text: 'Uncontrolled', Icon: AlertTriangle, color: 'text-red-600' };
        return { text: 'Well Controlled', Icon: CheckCircle2, color: 'text-emerald-600' };
    }, [totalScore]);

    const allAnswered = allQuestions.every(q => answers[q.id] !== null && answers[q.id] !== undefined);

    const handleCalculate = () => {
        if (allAnswered) {
            setShowResult(true);
        }
    };
    
    const handleSaveResult = useCallback(() => {
        if (allAnswered) {
          const newResult: TestResult = { date: new Date().toISOString(), score: totalScore };
          updatePatientData({ cactHistory: [...patientData.cactHistory, newResult] });
          setResultSaved(true);
        }
    }, [totalScore, allAnswered, patientData.cactHistory, updatePatientData]);

    const QuestionSection: React.FC<{title: string; icon: React.ReactElement; questions: any[];}> = ({ title, icon, questions }) => (
        <div className="mb-4">
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center">{icon}{title}</h4>
            {questions.map(q => (
                 <div key={q.id} className="p-3 bg-white rounded-lg border border-slate-200 mb-2">
                    <p className="font-medium text-slate-700 mb-2 text-sm">{q.id.toUpperCase()}. {q.text}</p>
                    <div className="flex flex-wrap gap-2">
                        {q.options.map((opt: any) => (
                            <Button
                                key={opt.value}
                                onClick={() => handleAnswerChange(q.id, opt.value)}
                                variant={answers[q.id] === opt.value ? 'primary' : 'secondary'}
                                size="sm" className="!text-xs !py-1"
                            >
                                {opt.label}
                            </Button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
    
    return (
        <div className="space-y-4">
             <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
                <QuestionSection title="Child's Questions" icon={<User size={18} className="mr-2"/>} questions={childQuestions} />
                <QuestionSection title="Parent's Questions" icon={<Users size={18} className="mr-2"/>} questions={parentQuestions} />
             </div>

            {!showResult && (
                <div className="mt-4 text-center">
                    <Button onClick={handleCalculate} disabled={!allAnswered} size="lg">Calculate Score</Button>
                </div>
            )}

            {showResult && (
                <div className="mt-4 p-4 bg-slate-100 rounded-lg border border-slate-200 text-center">
                    <p className="text-sm text-slate-600">Total cACT Score:</p>
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

            <TestHistory history={patientData.cactHistory} testName="cACT" />

            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 text-sm">
                <Lightbulb className="inline-block mr-2" size={16}/>
                <strong>Interpretation:</strong> A score of 19 or less suggests asthma may be inadequately controlled and a change in treatment may be needed.
            </div>
        </div>
    );
};

export default cACTModalContent;