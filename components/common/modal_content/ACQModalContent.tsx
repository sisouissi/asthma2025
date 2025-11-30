
import React, { useState, useMemo, useCallback } from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { TestResult } from '../../../types';
import Button from '../../ui/Button';
import TestHistory from '../TestHistory';
import { CheckCircle2, AlertTriangle, XCircle, Save, Lightbulb } from 'lucide-react';

const questions = [
    { id: 'q1', text: 'On average during the past week, how often did you wake up during the night because of your asthma?' },
    { id: 'q2', text: 'On average during the past week, how bad were your asthma symptoms when you woke up in the morning?' },
    { id: 'q3', text: 'On average during the past week, how limited have you been in your daily activities because of your asthma?' },
    { id: 'q4', text: 'On average during the past week, how much shortness of breath did you have because of your asthma?' },
    { id: 'q5', text: 'On average during the past week, how much of the time did you wheeze?' },
];

const options = [
    { label: 'Not at all', value: 0 }, { label: 'Hardly at all', value: 1 }, { label: 'A little', value: 2 },
    { label: 'Moderately', value: 3 }, { label: 'Quite a lot', value: 4 }, { label: 'A great deal', value: 5 }, { label: 'Extremely', value: 6 }
];

const ACQModalContent: React.FC = () => {
    const { patientData, updatePatientData } = usePatientData();
    const [answers, setAnswers] = useState<Record<string, number | null>>({ q1: null, q2: null, q3: null, q4: null, q5: null });
    const [showResult, setShowResult] = useState(false);
    const [resultSaved, setResultSaved] = useState(false);

    const handleAnswerChange = (questionId: string, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
        setShowResult(false);
        setResultSaved(false);
    };

    const meanScore = useMemo(() => {
        const answeredValues = Object.values(answers).filter(v => v !== null) as number[];
        if (answeredValues.length === 0) return 0;
        const sum = answeredValues.reduce((acc, val) => acc + val, 0);
        return parseFloat((sum / answeredValues.length).toFixed(2));
    }, [answers]);

    const interpretation = useMemo(() => {
        if (meanScore <= 0.75) return { text: 'Well Controlled', Icon: CheckCircle2, color: 'text-emerald-600' };
        if (meanScore < 1.5) return { text: 'Grey Zone', Icon: AlertTriangle, color: 'text-amber-600' };
        return { text: 'Poorly Controlled', Icon: XCircle, color: 'text-red-600' };
    }, [meanScore]);

    const allAnswered = Object.values(answers).every(ans => ans !== null);

    const handleCalculate = () => {
        if (allAnswered) {
            setShowResult(true);
        }
    };
    
    const handleSaveResult = useCallback(() => {
        if (allAnswered) {
          const newResult: TestResult = { date: new Date().toISOString(), score: meanScore };
          updatePatientData({ acqHistory: [...patientData.acqHistory, newResult] });
          setResultSaved(true);
        }
    }, [meanScore, allAnswered, patientData.acqHistory, updatePatientData]);

    return (
        <div className="space-y-4">
            <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
                {questions.map(q => (
                    <div key={q.id} className="p-3 bg-white rounded-lg border border-slate-200">
                        <p className="font-medium text-slate-700 mb-2 text-sm">{q.id.toUpperCase()}. {q.text}</p>
                        <div className="flex flex-wrap gap-2">
                            {options.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleAnswerChange(q.id, opt.value)}
                                    className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                                        answers[q.id] === opt.value
                                            ? 'bg-sky-600 text-white border-sky-600'
                                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                    }`}
                                >
                                    {opt.label} ({opt.value})
                                </button>
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
                    <p className="text-sm text-slate-600">Mean ACQ-5 Score:</p>
                    <p className="text-5xl font-bold my-2 text-sky-600">{meanScore}</p>
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

            <TestHistory history={patientData.acqHistory} testName="ACQ-5" />

             <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 text-sm">
                <Lightbulb className="inline-block mr-2" size={16}/>
                <strong>Interpretation:</strong> Score &le;0.75 suggests good control; score &ge;1.5 suggests poor control. A change of 0.5 is clinically significant.
            </div>
        </div>
    );
};

export default ACQModalContent;
