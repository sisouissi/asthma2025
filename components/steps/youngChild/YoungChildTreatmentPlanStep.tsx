
import React from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { usePatientRecords } from '../../../contexts/PatientRecordsContext';
import { useNavigation } from '../../../contexts/NavigationContext';
import { useUIState } from '../../../contexts/UIStateContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { youngChildTreatments } from '../../../constants/treatmentData';
import { TreatmentDetail, YoungChildGinaSteps, YoungChildTreatmentStrategyKey, YoungChildStepTreatment, ControlLevel, YoungChildAlternativeTreatment } from '../../../types';
import { Pill, PlusCircle, MinusCircle, AlertTriangle, Baby, Zap, HelpCircle, CheckCircle2, XCircle, Info, ShieldCheck, TrendingUp, Save, Calendar, FileText, Ruler, TrendingDown, Search } from 'lucide-react';
import DetailSection from '../../common/DetailSection';
import ManagementCycleWidget from '../../common/ManagementCycleWidget';
import PrescriptionWriter from '../../common/PrescriptionWriter';
import LowDoseICSModalContent from '../../common/modal_content/LowDoseICSModalContent';

const YoungChildTreatmentPlanStep: React.FC = () => {
  const { patientData, updatePatientData } = usePatientData();
  const { saveConsultation, updateConsultation } = usePatientRecords();
  const { navigateTo } = useNavigation();
  const { openInfoModal } = useUIState();
  const { youngChild_currentGinaStep, youngChild_currentTreatmentStrategy, youngChild_controlLevel, consultationType, youngChild_reviewReminderDate } = patientData;

  if (!youngChild_currentGinaStep || !youngChild_currentTreatmentStrategy) {
    return (
      <Card title="Error: Missing Data" icon={<AlertTriangle className="text-red-500" />} className="border-red-300 bg-red-50">
        <p>Information about GINA step or therapeutic strategy is missing. Please return to previous steps.</p>
        <div className="mt-4">
            <Button onClick={() => navigateTo('YOUNG_CHILD_SYMPTOM_PATTERN_STEP')} variant="secondary">
            Return to Pattern Selection
            </Button>
        </div>
      </Card>
    );
  }

  const currentStepDetails: YoungChildStepTreatment | undefined = youngChildTreatments[youngChild_currentGinaStep as YoungChildGinaSteps];
  
  let activeTreatment: TreatmentDetail | YoungChildAlternativeTreatment | undefined = currentStepDetails?.preferred;
  let activeStrategyName = currentStepDetails?.preferred.name || "Preferred Treatment";

  if (youngChild_currentTreatmentStrategy !== 'preferred' && currentStepDetails?.alternatives) {
    const alternative = currentStepDetails.alternatives.find(alt => alt.id === youngChild_currentTreatmentStrategy);
    if (alternative) {
      activeTreatment = alternative;
      activeStrategyName = alternative.name;
    }
  }
  
  const currentStepDisplay = currentStepDetails?.stepDescription || `GINA Step ${youngChild_currentGinaStep}`;

  const canStepUp = youngChild_currentGinaStep < 4; // Step 4 is referral only
  const canStepDown = youngChild_currentGinaStep > 1;

  const handleStepChange = (newStep: number) => {
    if (newStep >= 1 && newStep <= 4) {
      updatePatientData({ 
        youngChild_currentGinaStep: newStep as YoungChildGinaSteps,
        youngChild_currentTreatmentStrategy: 'preferred',
        youngChild_controlLevel: null,
        youngChild_reviewReminderDate: null,
      });
    }
  };

  const handleStrategyChange = (strategyId: YoungChildTreatmentStrategyKey) => {
    updatePatientData({ youngChild_currentTreatmentStrategy: strategyId });
  };

  const handleDateChange = (date: string) => {
      updatePatientData({ youngChild_reviewReminderDate: date });
  };

  const setQuickDate = (daysOrMonths: number, unit: 'days' | 'months') => {
      const d = new Date();
      if (unit === 'days') {
          d.setDate(d.getDate() + daysOrMonths);
      } else {
          d.setMonth(d.getMonth() + daysOrMonths);
      }
      updatePatientData({ youngChild_reviewReminderDate: d.toISOString().split('T')[0] });
  };

  const handleSaveAndExit = () => {
    if (patientData.activePatientId) {
        if (patientData.activeConsultationId) {
            // We are editing an existing consultation
            updateConsultation(patientData.activePatientId, patientData.activeConsultationId, patientData);
        } else {
            // We are saving a new consultation
            saveConsultation(patientData.activePatientId, patientData);
        }
        navigateTo('PATIENT_DASHBOARD');
    }
  };

  const ControlResultDisplay: React.FC<{ level: ControlLevel | null }> = ({ level }) => {
    if (!level) return null;

    const styles = {
        wellControlled: { bg: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-700', icon: <CheckCircle2 size={24} className="text-emerald-600 mr-3" /> },
        partlyControlled: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700', icon: <AlertTriangle size={24} className="text-amber-600 mr-3" /> },
        uncontrolled: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', icon: <XCircle size={24} className="text-red-600 mr-3" /> },
    };

    const style = styles[level];
    const levelText = level === 'wellControlled' ? 'Well Controlled' : level === 'partlyControlled' ? 'Partly Controlled' : 'Uncontrolled';
    const advice = {
        wellControlled: "Maintain current treatment. Reassess need for treatment periodically (e.g., every 3-6 months).",
        partlyControlled: "Check adherence, inhaler technique, and environmental control before stepping up. Consider stepping up if needed.",
        uncontrolled: "Step up treatment (e.g., from Step 2 to Step 3). Referral to a specialist is strongly recommended."
    };
    
    return (
        <div className={`my-6 p-4 rounded-lg border-l-4 ${style.bg} ${style.border}`}>
            <div className="flex items-center">
                {style.icon}
                <h3 className={`text-lg font-semibold ${style.text}`}>
                Asthma Control is {levelText}
                </h3>
            </div>
            <p className={`text-sm ${style.text} mt-2 pl-9`}>{advice[level]}</p>
            <div className="mt-3 pl-9">
                {(level === 'partlyControlled' || level === 'uncontrolled') && canStepUp && (
                    <Button onClick={() => handleStepChange(youngChild_currentGinaStep + 1)} variant="warning" size="sm" leftIcon={<TrendingUp size={16} />}>
                        Step-Up Treatment
                    </Button>
                )}
            </div>
        </div>
    );
  };


  return (
    <Card title="Treatment Plan (Young Child ≤5 years)" icon={<Baby className="text-violet-600" />}>
      <ManagementCycleWidget ageGroup="youngChild" />
      
      <div className="mb-6 p-4 bg-violet-50 border border-violet-200 rounded-lg">
        <p className="text-md font-semibold text-violet-700">{currentStepDisplay}</p>
        <p className="text-2xl font-bold text-violet-800">{activeStrategyName}</p>
        <p className="text-xs text-slate-500 mt-1">Based on GINA 2025, Box 11-2.</p>
      </div>

      <ControlResultDisplay level={youngChild_controlLevel} />

      {activeTreatment ? (
        <div className="space-y-3 bg-white p-4 rounded-md border border-slate-200">
          {activeTreatment.controller && (
            <DetailSection title="Controller Treatment" icon={<ShieldCheck className="text-emerald-500"/>}>
              <p>{activeTreatment.controller}</p>
            </DetailSection>
          )}
          {activeTreatment.reliever && (
            <DetailSection title="Reliever Treatment" icon={<Zap className="text-blue-500"/>}>
              <p>{activeTreatment.reliever}</p>
            </DetailSection>
          )}
          {activeTreatment.keyPoints && activeTreatment.keyPoints.length > 0 && (
             <DetailSection title="Key Points" icon={<Info className="text-sky-500"/>}>
              <ul className="list-disc list-inside space-y-0.5">
                {activeTreatment.keyPoints.map((point, i) => <li key={i}>{point}</li>)}
              </ul>
            </DetailSection>
          )}
          {activeTreatment.additional && (
            <DetailSection title="Additional Considerations" icon={<PlusCircle className="text-cyan-500"/>}>
              {typeof activeTreatment.additional === 'string' ? <p>{activeTreatment.additional}</p> : 
                <ul className="list-disc list-inside space-y-0.5">{activeTreatment.additional.map((item, i) => <li key={i}>{item}</li>)}</ul>}
            </DetailSection>
          )}
          {activeTreatment.notes && (
            <div className="mt-2 p-2.5 bg-slate-50 border border-slate-100 rounded-md text-xs">
                <h4 className="font-semibold text-slate-500 mb-0.5">Notes:</h4>
                {typeof activeTreatment.notes === 'string' ? <p className="text-slate-600">{activeTreatment.notes}</p> : 
                 <ul className="list-disc list-inside pl-3 text-slate-600 space-y-0.5">{activeTreatment.notes.map((item, i) => <li key={i}>{item}</li>)}</ul>}
            </div>
          )}
          {activeTreatment.referral && (
            <div className="mt-3 p-2.5 bg-amber-50 border-l-4 border-amber-400 rounded-r-md">
              <h4 className="font-semibold text-amber-700 text-sm flex items-center"><AlertTriangle size={16} className="mr-2"/>Specialist Referral</h4>
              <p className="text-sm text-amber-600 pl-6">{activeTreatment.referral}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-slate-600">No specific treatment details found for this selection.</p>
      )}
      
      <div className="mt-6 mb-6">
        <Button 
            onClick={() => openInfoModal("Low Dose ICS Reference (Child <=5y)", <LowDoseICSModalContent />)} 
            variant="secondary" 
            fullWidth 
            leftIcon={<FileText size={18}/>}
            className="border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100"
        >
            View Low Dose ICS Table (Box 11-3)
        </Button>
      </div>

      {/* Clinical Guidance: Reviewing Response */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 flex items-center mb-3">
            <Info className="mr-2 text-blue-600" size={20} /> 
            Clinical Guidance: Review & Adjust
          </h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <h5 className="text-sm font-bold text-blue-800 flex items-center">
                    <Ruler size={14} className="mr-1.5"/> Routine Assessment
                </h5>
                <ul className="text-xs text-blue-800 list-disc pl-4 space-y-1">
                    <li>Assess symptom control, risk factors, and side-effects at every visit.</li>
                    <li><strong>Measure height</strong> at least once every year.</li>
                    <li>Asthma-like symptoms often remit. Re-assess the need for continued controller treatment regularly (e.g. every 3-6 months).</li>
                </ul>
            </div>
            
            <div className="space-y-2">
                <h5 className="text-sm font-bold text-blue-800 flex items-center">
                    <TrendingDown size={14} className="mr-1.5"/> Stepping Down / Stopping
                </h5>
                <ul className="text-xs text-blue-800 list-disc pl-4 space-y-1">
                    <li>If treatment is stepped down or discontinued, schedule a follow-up visit in <strong>3-6 weeks</strong> to check for symptom recurrence.</li>
                    <li>For seasonal symptoms: Discontinue daily controller 4 weeks after the season ends.</li>
                </ul>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-blue-200">
             <h5 className="text-sm font-bold text-blue-800 mb-1 flex items-center">
                <Search size={14} className="mr-1.5"/> Before Stepping Up Treatment
             </h5>
             <p className="text-xs text-blue-700 mb-2 italic">If symptom control is poor despite 2-3 months of adequate therapy, check the following before stepping up:</p>
             <ul className="text-xs text-blue-800 list-disc pl-4 grid sm:grid-cols-2 gap-x-4 gap-y-1">
                <li>Confirm diagnosis (symptoms due to asthma?)</li>
                <li>Check inhaler technique.</li>
                <li>Confirm good adherence.</li>
                <li>Review risk factors (smoke, allergens).</li>
             </ul>
          </div>
      </div>

      <PrescriptionWriter />

      {/* Next Appointment Section */}
      <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-3 flex items-center">
              <Calendar size={18} className="mr-2 text-violet-600"/>
              Schedule Next Appointment
          </h4>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full sm:w-auto">
                  <input 
                      type="date" 
                      value={youngChild_reviewReminderDate ? new Date(youngChild_reviewReminderDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-md shadow-inner text-slate-800 focus:ring-2 focus:ring-violet-500"
                  />
              </div>
              <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                  <Button onClick={() => setQuickDate(4, 'days')} variant="secondary" size="sm">4 Weeks (Season End)</Button>
                  <Button onClick={() => setQuickDate(6, 'days')} variant="secondary" size="sm">6 Weeks (Step Down)</Button>
                  <Button onClick={() => setQuickDate(3, 'months')} variant="secondary" size="sm">3 Months</Button>
              </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
              Review response 1-3 months after starting treatment. Use 3-6 weeks for step-down review.
          </p>
      </div>

      {currentStepDetails?.alternatives && currentStepDetails.alternatives.length > 0 && youngChild_currentGinaStep <= 3 && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 text-center mb-4">Choose another option for Step {youngChild_currentGinaStep}:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
                onClick={() => handleStrategyChange('preferred')}
                variant={youngChild_currentTreatmentStrategy === 'preferred' ? 'violet' : 'secondary'}
              >
                {currentStepDetails.preferred.name || "Preferred"}
            </Button>
            {currentStepDetails.alternatives.map((alt) => (
              <Button
                key={alt.id}
                onClick={() => handleStrategyChange(alt.id)}
                variant={youngChild_currentTreatmentStrategy === alt.id ? 'violet' : 'secondary'}
              >
                {alt.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Show Adjustment Steps ALWAYS for simulation */}
      {youngChild_currentGinaStep !== 4 && ( 
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 text-center mb-4">Adjust Treatment Step:</h3>
            <div className="flex justify-center items-center space-x-3 mb-2">
            <Button 
                onClick={() => handleStepChange(youngChild_currentGinaStep - 1)} 
                disabled={!canStepDown}
                variant="secondary"
                leftIcon={<MinusCircle />}
                aria-label="Decrease treatment step"
                size="md"
            >
                Step Down
            </Button>
            <Button 
                onClick={() => handleStepChange(youngChild_currentGinaStep + 1)} 
                disabled={!canStepUp}
                variant="secondary"
                leftIcon={<PlusCircle />}
                aria-label="Increase treatment step"
                size="md"
            >
                Step Up
            </Button>
            </div>
            <p className="text-xs text-slate-500 text-center">
            Step up if poorly controlled after review. Step down if well controlled for 3 months. Referral at Steps 3 and 4.
            </p>
        </div>
      )}
      {(youngChild_currentGinaStep === 3 || youngChild_currentGinaStep === 4) && (
        <div className="mt-6 p-3 bg-amber-100 border-l-4 border-amber-500 rounded-lg">
            <div className="flex items-start">
                <HelpCircle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0"/>
                <p className="text-sm text-amber-700">
                    Specialist referral is <strong className="font-semibold">strongly recommended</strong> at Step 3 and <strong className="font-semibold">essential</strong> at Step 4.
                </p>
            </div>
        </div>
      )}
      {patientData.activePatientId && (
            <div className="mt-8 border-t border-slate-300 pt-6 flex justify-center">
                <Button 
                    onClick={handleSaveAndExit} 
                    variant="success" 
                    size="lg" 
                    leftIcon={<Save />}
                    className="bg-emerald-700 hover:bg-emerald-800 shadow-lg"
                >
                    Save Consultation & Return to Patient List
                </Button>
            </div>
        )}
    </Card>
  );
};

export default YoungChildTreatmentPlanStep;
