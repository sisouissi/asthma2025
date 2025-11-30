

import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { exacerbationPlanDetails } from '../../../constants/treatmentData';
import { AlertTriangle, ChevronRight, FileText, RotateCcw, Activity, ShieldAlert, Info, ClipboardList, HeartPulse, Monitor } from 'lucide-react';
import DetailSection from '../../common/DetailSection';

const ChildExacerbationPlanStep: React.FC = () => {
  const { navigateTo, resetNavigation } = useNavigation();
  const { patientData } = usePatientData();
  const { exacerbationSeverity } = patientData;

  if (!exacerbationSeverity) {
    return (
      <Card title="Error: Severity Not Assessed" icon={<AlertTriangle className="text-red-500" />} className="border-red-300 bg-red-50">
        <p>Exacerbation severity has not been selected. Please go back.</p>
        <div className="mt-4">
            <Button onClick={() => navigateTo('CHILD_EXACERBATION_SEVERITY_STEP')} variant="secondary">
            Assess Severity
            </Button>
        </div>
      </Card>
    );
  }

  const isMildModerate = exacerbationSeverity === 'mildModerate';
  const plan = isMildModerate
    ? exacerbationPlanDetails.child.mildModerateAtHome 
    : exacerbationPlanDetails.child.severeInER;

  const cardIcon = isMildModerate ? <Activity className="text-amber-600" /> : <ShieldAlert className="text-red-600" />;
  const cardBorderClass = isMildModerate ? "border-amber-400" : "border-red-400";
  const cardBgClass = isMildModerate ? "bg-amber-50" : "bg-red-50";
  

  return (
    <Card 
        title={plan.title} 
        icon={cardIcon}
        className={`${cardBgClass} ${cardBorderClass}`}
    >
      {('steps' in plan) && plan.steps && (
        <DetailSection title="Key Management Steps" icon={<ClipboardList className="text-slate-600"/>}>
          <ul className="list-decimal list-inside space-y-2">
            {plan.steps.map((step, index) => <li key={index}>{step}</li>)}
          </ul>
        </DetailSection>
      )}

      {('keyTreatments' in plan) && plan.keyTreatments && (
         <DetailSection title="Key Emergency Treatments" icon={<HeartPulse className="text-slate-600"/>}>
          <ul className="list-disc list-inside space-y-1">
            {plan.keyTreatments.map((treatment, index) => <li key={index}>{treatment}</li>)}
          </ul>
        </DetailSection>
      )}
      
      {('whenToSeekUrgentHelp' in plan) && plan.whenToSeekUrgentHelp && (
        <div className={`mt-4 p-4 rounded-md border-l-4 ${isMildModerate ? 'bg-red-100 border-red-500' : 'bg-red-100 border-red-600'}`}>
          <h4 className={`font-semibold mb-2 flex items-center ${isMildModerate ? 'text-red-700' : 'text-red-800'}`}>
            <AlertTriangle size={18} className="mr-2"/>
            When to Seek Urgent Medical Attention
          </h4>
          <ul className={`list-disc list-inside space-y-1 pl-4 text-sm ${isMildModerate ? 'text-red-600' : 'text-red-700'}`}>
            {plan.whenToSeekUrgentHelp.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
      )}

      {('monitoring' in plan) && plan.monitoring && (
         <DetailSection title="Monitoring" icon={<Monitor className="text-slate-600"/>} className="mt-4">
          <ul className="list-disc list-inside space-y-1">
            {plan.monitoring.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </DetailSection>
      )}

      {('notes' in plan) && plan.notes && (
        <div className="mt-4 p-3 bg-sky-100 border-l-4 border-sky-400 text-sky-800 text-sm rounded-r-md">
            <h4 className="font-semibold mb-1 flex items-center"><Info size={16} className="mr-2"/>Reference</h4>
            <p className="pl-6">{plan.notes}</p>
        </div>
      )}
       <p className="text-xs text-slate-500 mt-4 font-semibold">
            REMINDER: Always use a spacer with pMDI for children in this age group.
        </p>

      <div className="mt-8 pt-6 border-t border-slate-300">
        <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center">
                <ClipboardList size={18} className="mr-2.5" />
                Post-Exacerbation Follow-up
            </h3>
            <p className="text-sm text-slate-600 mb-3">
                An asthma exacerbation indicates a failure of chronic management. An urgent follow-up with the child and their carers is essential.
            </p>
            <p className="text-sm font-semibold text-slate-700">The goals of this review are to:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 mt-2 pl-4">
                <li>Identify and address modifiable risk factors (e.g., adherence, inhaler technique, triggers).</li>
                <li>Review and adjust the child's ongoing controller treatment.</li>
                <li>Ensure the Asthma Action Plan is understood and up-to-date.</li>
                <li>Assess if specialist referral is required.</li>
            </ul>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button 
            onClick={() => navigateTo('CHILD_TREATMENT_PLAN_STEP')}
            variant="success" 
            fullWidth
            size="lg"
            leftIcon={<FileText />}
        >
            Return to Treatment Plan
        </Button>
        <Button 
            onClick={() => resetNavigation()}
            variant="secondary"
            fullWidth
            size="lg"
            leftIcon={<RotateCcw />}
        >
            Start New Assessment
        </Button>
      </div>
    </Card>
  );
};

export default ChildExacerbationPlanStep;