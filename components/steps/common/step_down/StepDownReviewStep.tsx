import React from 'react';
import { useNavigation } from '../../../../contexts/NavigationContext';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import { TrendingDown, Calendar, CheckCircle2, XCircle, ArrowLeft, RotateCcw, HelpCircle } from '../../../../constants/icons';

const StepDownReviewStep: React.FC = () => {
    const { goBack, resetNavigation } = useNavigation();

    return (
        <Card
            title="Step Down Guide: 3. Review Response"
            icon={<TrendingDown className="text-sky-600" />}
        >
            <p className="mb-6 text-sm text-slate-600">
                A thorough review after stepping down treatment is crucial to confirm that asthma control has been maintained and to plan the next steps.
            </p>

            {/* Initial Actions */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg mb-6">
                 <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                    <Calendar size={20} className="mr-2 text-sky-600" />
                    Actions at Time of Step-Down
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 pl-4">
                    <li><strong>Schedule Follow-up:</strong> Book a review appointment in 1-3 months to assess the outcome.</li>
                    <li><strong>Provide Action Plan:</strong> Give the patient an updated, written asthma action plan. It must clearly state what to do if symptoms worsen and how to resume their previous effective dose.</li>
                    <li><strong>Document the Change:</strong> Clearly record the new, lower treatment regimen in the patient's medical record.</li>
                </ul>
            </div>

            {/* During the Follow-up Visit */}
            <div className="p-5 bg-white border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                    <HelpCircle size={20} className="mr-2 text-sky-600" />
                    At the Follow-up Visit: Assess the Outcome
                </h3>
                <div className="space-y-4">
                    {/* Outcome 1: Maintained Control */}
                    <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-md">
                        <h4 className="font-semibold text-emerald-800 flex items-center">
                            <CheckCircle2 size={18} className="mr-2" />
                            If control is maintained:
                        </h4>
                        <ul className="list-disc list-inside text-sm text-emerald-700 mt-2 pl-6 space-y-1">
                            <li>The new lower dose becomes the patient's current controller therapy.</li>
                            <li>Continue regular monitoring.</li>
                            <li>Consider a further step down after another 3 months if control remains stable.</li>
                        </ul>
                    </div>

                    {/* Outcome 2: Lost Control */}
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-md">
                        <h4 className="font-semibold text-red-800 flex items-center">
                            <XCircle size={18} className="mr-2" />
                            If control is lost:
                        </h4>
                         <ul className="list-disc list-inside text-sm text-red-700 mt-2 pl-6 space-y-1">
                            <li>Promptly return to the previous dose that provided good control.</li>
                            <li>Do not leave the patient on an inadequate treatment dose.</li>
                            <li>Investigate the reason for the loss of control (e.g., viral infection, poor adherence, or the dose was simply too low).</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 flex justify-between items-center">
                <Button
                    onClick={goBack}
                    variant="secondary"
                    leftIcon={<ArrowLeft />}
                >
                    Back to Adjust
                </Button>
                 <Button
                    onClick={() => resetNavigation()}
                    variant="success"
                    rightIcon={<RotateCcw />}
                >
                    Finish Guide
                </Button>
            </div>
        </Card>
    );
};

export default StepDownReviewStep;