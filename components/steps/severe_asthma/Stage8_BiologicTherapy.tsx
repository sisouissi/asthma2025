import React, { useState } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import AssessmentCard from './AssessmentCard';
import Button from '../../ui/Button';
import { Heart, HelpCircle, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ChevronRight, RotateCcw } from 'lucide-react';

type EvaluationStep = 'initial' | 'unclear_followup' | 'good_response' | 'no_response';
type ResponseType = 'good' | 'unclear' | 'no' | null;

export default function Stage8_BiologicTherapy() {
    const { navigateTo } = useNavigation();
    const [evaluationStep, setEvaluationStep] = useState<EvaluationStep>('initial');
    const [response, setResponse] = useState<ResponseType>(null);
    const [extendedResponse, setExtendedResponse] = useState<ResponseType>(null);

    const handleInitialResponse = (res: ResponseType) => {
        setResponse(res);
        if (res === 'good') setEvaluationStep('good_response');
        if (res === 'no') setEvaluationStep('no_response');
        if (res === 'unclear') setEvaluationStep('unclear_followup');
    };

    const handleExtendedResponse = (res: ResponseType) => {
        setExtendedResponse(res);
    };

    const handleSwitchBiologic = () => {
        setResponse(null);
        setExtendedResponse(null);
        setEvaluationStep('initial');
    };
    
    const GoodResponseContent = () => (
         <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-md">
            <h4 className="font-semibold text-green-800 flex items-center mb-2">
                <CheckCircle2 size={20} className="mr-2"/>
                Good Response to Biologic Therapy
            </h4>
            <div className="text-sm text-green-700 pl-7 space-y-2">
                <p><strong>Continue the biologic therapy</strong> and maintain regular follow-up every 3-6 months to assess asthma control, exacerbations, lung function, comorbidities, and patient satisfaction.</p>
                <p><strong>Gradually reduce add-on treatments,</strong> especially oral corticosteroids (OCS) if the patient is taking them, to limit side effects. This reduction should be cautious and individualized.</p>
                <p>For inhaled corticosteroids (ICS), it is advisable to maintain at least a <strong>moderate dose,</strong> with the possibility of reduction after 3-6 months of good response.</p>
            </div>
            <div className="pl-7 mt-4">
                <Button onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_9')} rightIcon={<ChevronRight/>}>
                    Go to Monitoring (Stage 9)
                </Button>
            </div>
        </div>
    );
    
     const NoResponseContent = () => (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md">
            <h4 className="font-semibold text-red-800 flex items-center mb-2">
                <XCircle size={20} className="mr-2"/>
                No Good Response to Biologic Therapy
            </h4>
            <p className="text-sm text-red-700 pl-7 mb-4">
                As per GINA guidelines, if there is no good response, stop the current biologic therapy and reassess the patient. Choose one of the following options:
            </p>
            <div className="pl-7 flex flex-col sm:flex-row gap-4">
                <Button onClick={handleSwitchBiologic} variant="warning" leftIcon={<RotateCcw/>}>
                    Switch to Another Biologic
                </Button>
                <Button onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_10')} variant="danger" rightIcon={<ArrowRight/>}>
                    Stop Biologics & Continue Other Care
                </Button>
            </div>
        </div>
    );


    return (
        <div>
            <AssessmentCard title="Biologic Therapy Trial & Evaluation" icon={<Heart />}>
                <p className="text-sm text-slate-600 mb-4">
                    The patient is eligible for and has access to biologic therapy. Start a therapeutic trial for at least 4 months, then evaluate the response.
                </p>

                {/* Initial 4-Month Evaluation */}
                <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="font-medium text-slate-700 mb-3">After 4 months, what is the response to therapy?</h4>
                     <div className="flex flex-wrap gap-3">
                        <Button onClick={() => handleInitialResponse('good')} variant={response === 'good' ? 'success' : 'secondary'}>Good Response</Button>
                        <Button onClick={() => handleInitialResponse('unclear')} variant={response === 'unclear' ? 'warning' : 'secondary'}>Unclear / Partial</Button>
                        <Button onClick={() => handleInitialResponse('no')} variant={response === 'no' ? 'danger' : 'secondary'}>No Good Response</Button>
                    </div>
                </div>

                {/* Conditional Content based on response */}
                <div className="mt-4">
                    {response === 'good' && <GoodResponseContent />}
                    {response === 'no' && <NoResponseContent />}

                    {response === 'unclear' && (
                        <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-md">
                            <h4 className="font-semibold text-amber-800 flex items-center mb-2">
                                <HelpCircle size={20} className="mr-2"/>
                                Unclear / Partial Response
                            </h4>
                            <p className="text-sm text-amber-700 pl-7 mb-4">
                                Prolong the treatment trial for a total of 6 to 12 months, then re-evaluate the response.
                            </p>
                            <div className="mt-4 pt-4 border-t border-amber-200 pl-7">
                                <h5 className="font-medium text-slate-700 mb-3">After 6-12 months, is the response now good?</h5>
                                <div className="flex flex-wrap gap-3">
                                    <Button onClick={() => handleExtendedResponse('good')} variant={extendedResponse === 'good' ? 'success' : 'secondary'}>Yes, response is now good</Button>
                                    <Button onClick={() => handleExtendedResponse('no')} variant={extendedResponse === 'no' ? 'danger' : 'secondary'}>No, still no good response</Button>
                                </div>

                                <div className="mt-4">
                                    {extendedResponse === 'good' && <GoodResponseContent/>}
                                    {extendedResponse === 'no' && <NoResponseContent/>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </AssessmentCard>
        </div>
    );
};
