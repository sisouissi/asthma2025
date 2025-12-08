import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { usePatientRecords } from '../../../contexts/PatientRecordsContext';
import { exacerbationPlanDetails } from '../../../constants/treatmentData';
import { AlertTriangle, ChevronRight, FileText, Activity, ShieldAlert, Info, ClipboardList, HeartPulse, Monitor, Printer, Save } from '../../../constants/icons';
import DetailSection from '../../common/DetailSection';

const ChildExacerbationPlanStep: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { patientData } = usePatientData();
  const { saveConsultation, updateConsultation } = usePatientRecords();
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
  
  const handlePrint = () => {
      window.print();
  };

  const handleSave = () => {
      if (patientData.activePatientId) {
        if (patientData.activeConsultationId) {
            updateConsultation(patientData.activePatientId, patientData.activeConsultationId, patientData);
        } else {
            saveConsultation(patientData.activePatientId, patientData);
        }
        // Redirect back to Treatment Plan
        navigateTo('CHILD_TREATMENT_PLAN_STEP');
      }
  };

  return (
    <Card 
        title={plan.title} 
        icon={cardIcon}
        className={`${cardBgClass} ${cardBorderClass} printable-card`}
    >
      {/* ... Content sections same as before ... */}
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

      <div className="mt-8 pt-6 border-t border-slate-300 no-print">
         <div className="flex flex-col gap-3">
            <div className="flex gap-3">
                <Button 
                    onClick={handlePrint}
                    variant="secondary"
                    fullWidth
                    size="lg"
                    leftIcon={<Printer />}
                >
                    Print Action Plan
                </Button>
                 {patientData.activePatientId && (
                    <Button 
                        onClick={handleSave}
                        variant="danger"
                        fullWidth
                        size="lg"
                        leftIcon={<Save />}
                    >
                        Save Exacerbation Record
                    </Button>
                )}
            </div>
            <Button 
                onClick={() => navigateTo('CHILD_TREATMENT_PLAN_STEP')}
                variant="success" 
                fullWidth
                size="lg"
                leftIcon={<FileText />}
            >
                Return to Treatment Plan
            </Button>
         </div>
      </div>
    </Card>
  );
};

export default ChildExacerbationPlanStep;