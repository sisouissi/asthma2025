
import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useNavigation } from '../../../contexts/NavigationContext';
import { useUIState } from '../../../contexts/UIStateContext';
import { Route, HelpCircle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

type QuestionId = 'symptoms' | 'history' | 'tests';
type Answer = 'yes' | 'no' | null;

const InitialDiagnosisFlowchartStep: React.FC = () => {
    const { navigateTo } = useNavigation();
    const { openManagementPanel } = useUIState();
    const [answers, setAnswers] = useState<{ [key in QuestionId]: Answer }>({
        symptoms: null,
        history: null,
        tests: null,
    });

    const handleAnswer = (questionId: QuestionId, answer: 'yes' | 'no') => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleProceedToManagement = () => {
        // First, navigate back to the home screen. This also closes any currently open panels.
        navigateTo('INITIAL_STEP');
        // Then, open the management panel specifically.
        openManagementPanel();
    };

    const renderResult = () => {
        if (answers.symptoms === 'no') {
            return (
                <ResultCard
                    title="Asthma Unlikely"
                    icon={<XCircle className="text-red-600" />}
                    className="bg-red-50 border-red-200"
                >
                    <p>The patient does not have respiratory symptoms typical of asthma. Consider alternative diagnoses. You can return to the previous screen to explore differential diagnoses.</p>
                </ResultCard>
            );
        }

        if (answers.symptoms === 'yes' && answers.history === 'yes' && answers.tests === 'yes') {
            return (
                 <ResultCard
                    title="Asthma Diagnosis Confirmed"
                    icon={<CheckCircle2 className="text-emerald-600" />}
                    className="bg-emerald-50 border-emerald-200"
                >
                    <p>The patient has typical symptoms, a supportive history, and confirmed variable airflow limitation. The diagnosis of asthma is confirmed.</p>
                    <Button onClick={handleProceedToManagement} className="mt-4" rightIcon={<ArrowRight />}>
                        Proceed to Management
                    </Button>
                </ResultCard>
            );
        }

        if (answers.symptoms === 'yes' && (answers.history === 'no' || answers.tests === 'no')) {
            return (
                 <ResultCard
                    title="Further Investigation Needed"
                    icon={<HelpCircle className="text-amber-600" />}
                    className="bg-amber-50 border-amber-200"
                >
                   <p>The clinical picture is suggestive of asthma, but is not fully confirmed. The likelihood is lower if both history and tests are unsupportive.</p>
                   <ul className="list-disc list-inside mt-2 space-y-1">
                        {answers.history === 'no' && <li>The clinical history is not typical. Re-evaluate for other conditions.</li>}
                        {answers.tests === 'no' && <li>Initial lung function tests are negative. Consider repeating tests, a therapeutic trial, or referral.</li>}
                   </ul>
                </ResultCard>
            )
        }
        
        return null;
    };

    const ResultCard: React.FC<{ title: string; icon: React.ReactElement; className?: string; children: React.ReactNode; }> = ({ title, icon, children, className }) => (
        <div className={`mt-6 p-4 rounded-lg border ${className}`}>
            <h3 className="font-semibold text-lg flex items-center mb-2">
                {icon}
                <span className="ml-2">{title}</span>
            </h3>
            <div className="pl-8 text-sm">{children}</div>
        </div>
    );
    
    return (
        <Card title="Interactive Diagnostic Flowchart (GINA Box 1-1)" icon={<Route className="text-sky-600" />}>
            <p className="text-sm text-slate-600 mb-6">
                Answer the following questions to work through the GINA diagnostic algorithm for patients with respiratory symptoms.
            </p>

            <div className="space-y-5">
                <QuestionBlock
                    question="Does the patient have respiratory symptoms (wheeze, cough, shortness of breath, chest tightness)?"
                    questionId="symptoms"
                    onAnswer={handleAnswer}
                    currentAnswer={answers.symptoms}
                />

                {answers.symptoms === 'yes' && (
                     <QuestionBlock
                        question="Is the history and examination supportive of asthma (e.g., variable, triggers, worse at night, atopic history)?"
                        questionId="history"
                        onAnswer={handleAnswer}
                        currentAnswer={answers.history}
                    />
                )}
                 {answers.history === 'yes' && (
                     <QuestionBlock
                        question="Is variable expiratory airflow limitation confirmed by spirometry or other tests?"
                        questionId="tests"
                        onAnswer={handleAnswer}
                        currentAnswer={answers.tests}
                    />
                )}
            </div>

            {renderResult()}

        </Card>
    );
};

const QuestionBlock: React.FC<{
    question: string;
    questionId: QuestionId;
    onAnswer: (id: QuestionId, answer: 'yes' | 'no') => void;
    currentAnswer: Answer;
}> = ({ question, questionId, onAnswer, currentAnswer }) => (
    <div className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
        <p className="font-medium text-slate-700 mb-3 text-sm">{question}</p>
        <div className="flex space-x-2">
            <Button
                onClick={() => onAnswer(questionId, 'yes')}
                variant={currentAnswer === 'yes' ? 'success' : 'secondary'}
                size="md"
                fullWidth
            >
                Yes
            </Button>
            <Button
                onClick={() => onAnswer(questionId, 'no')}
                variant={currentAnswer === 'no' ? 'warning' : 'secondary'}
                size="md"
                fullWidth
            >
                No
            </Button>
        </div>
    </div>
);

export default InitialDiagnosisFlowchartStep;
