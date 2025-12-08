
import React from 'react';
import { useNavigation } from '../../../../contexts/NavigationContext';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import { TrendingDown, ArrowRight, ArrowLeft } from '../../../../constants/icons';

const StepDownAdjustStep: React.FC = () => {
    const { navigateTo, goBack } = useNavigation();
    
    const StrategyItem: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <h4 className="font-semibold text-sky-700">{title}</h4>
            <p className="text-sm text-slate-600 mt-1">{children}</p>
        </div>
    );

    return (
        <Card
            title="Step Down Guide: 2. Adjust"
            icon={<TrendingDown className="text-sky-600" />}
        >
            <p className="mb-6 text-sm text-slate-600">
                Once assessment is complete, choose a step-down strategy based on the patient's current treatment. Document the change clearly.
            </p>

            <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-3">
                <h3 className="font-semibold text-slate-800 mb-2">Common Step-Down Strategies:</h3>
                 <StrategyItem title="From High or Medium Dose ICS-LABA">
                    Reduce the ICS dose by 25-50%. Do not stop the LABA component at this stage if asthma is severe.
                </StrategyItem>
                 <StrategyItem title="From Low Dose ICS-LABA (Fixed Dose)">
                    Switch to a once-daily regimen if available, or reduce ICS component dose. Alternatively, switch to low-dose ICS alone.
                </StrategyItem>
                <StrategyItem title="From Low Dose ICS-Formoterol MART">
                    Reduce the maintenance dose to once daily, then advise patient to continue using it for relief only (this becomes AIR therapy).
                </StrategyItem>
                <StrategyItem title="From Low Dose ICS alone">
                    Switch to taking ICS only when SABA is taken, or for children ≤5, consider stopping controller if asymptomatic for 6-12 months.
                </StrategyItem>
            </div>

            <div className="mt-8 flex justify-between items-center">
                <Button
                    onClick={goBack}
                    variant="secondary"
                    leftIcon={<ArrowLeft />}
                >
                    Back to Assess
                </Button>
                <Button
                    onClick={() => navigateTo('STEP_DOWN_REVIEW_STEP')}
                    rightIcon={<ArrowRight />}
                >
                    Next: Review Response
                </Button>
            </div>
        </Card>
    );
};

export default StepDownAdjustStep;
