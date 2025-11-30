

import React from 'react';
import { useNavigation } from '../../../../contexts/NavigationContext';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import { TrendingDown, ShieldCheck, AlertTriangle, Users, ArrowRight } from '../../../../constants/icons';

const StepDownAssessStep: React.FC = () => {
    const { navigateTo } = useNavigation();

    const ListItem: React.FC<{ icon: React.ReactElement; children: React.ReactNode; }> = ({ icon, children }) => {
        let clonedIcon = null;
        if (icon) {
            const existingClassName = (icon.props as any).className || '';
            let newClassName = 'mr-3 mt-1 text-sky-600 flex-shrink-0';
            if (existingClassName) newClassName += ' ' + existingClassName;

            const iconProps = {
                size: 20,
                className: newClassName,
            };
            clonedIcon = React.cloneElement(icon as React.ReactElement<any>, iconProps);
        }
        
        return (
            <li className="flex items-start">
                {clonedIcon}
                <span className="text-slate-700">{children}</span>
            </li>
        );
    };

    return (
        <Card
            title="Step Down Guide: 1. Assess"
            icon={<TrendingDown className="text-sky-600" />}
        >
            <p className="mb-6 text-sm text-slate-600">
                Before reducing controller treatment, ensure it is safe and appropriate to do so. This assessment is the crucial first step.
            </p>

            <div className="p-5 bg-white border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-3">Key Assessment Criteria:</h3>
                <ul className="space-y-3 text-sm">
                    <ListItem icon={<ShieldCheck />}>
                        <strong>Good Asthma Control:</strong> Symptoms and exacerbations have been well-controlled for at least 3 months.
                    </ListItem>
                    <ListItem icon={<AlertTriangle />}>
                        <strong>Low Exacerbation Risk:</strong> Patient has no current risk factors for exacerbations (e.g., recent severe attack, low FEV1, high SABA use).
                    </ListItem>
                    <ListItem icon={<Users />}>
                        <strong>Stable Life Circumstances:</strong> Patient is not pregnant, travelling, or preparing for major exams.
                    </ListItem>
                     <ListItem icon={<Users />}>
                        <strong>Shared Decision:</strong> The decision to step down is made in partnership with the patient, who understands the plan.
                    </ListItem>
                </ul>
            </div>

            <div className="mt-8">
                <Button
                    onClick={() => navigateTo('STEP_DOWN_ADJUST_STEP')}
                    fullWidth
                    size="xl"
                    rightIcon={<ArrowRight />}
                >
                    Next: Adjust Treatment
                </Button>
            </div>
        </Card>
    );
};

export default StepDownAssessStep;