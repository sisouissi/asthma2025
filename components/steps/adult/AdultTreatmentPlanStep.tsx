
import React, { useState } from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { usePatientRecords } from '../../../contexts/PatientRecordsContext';
import { useNavigation } from '../../../contexts/NavigationContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { adultTreatments } from '../../../constants/treatmentData';
import { TreatmentDetail, ControlLevel } from '../../../types';
import { Pill, PlusCircle, MinusCircle, AlertTriangle, Wind, ShieldCheck, Route, FileText, Info, CheckCircle2, XCircle, TrendingDown, TrendingUp, Save, Calendar, Stethoscope, ArrowRight } from 'lucide-react';
import DetailSection from '../../common/DetailSection';
import ManagementCycleWidget from '../../common/ManagementCycleWidget';
import PrescriptionWriter from '../../common/PrescriptionWriter';

const AdultTreatmentPlanStep: React.FC = () => {
  const { patientData, updatePatientData } = usePatientData();
  const { saveConsultation, updateConsultation, getPatient } = usePatientRecords();
  const { navigateTo } = useNavigation();
  const { adult_pathway, adult_currentGinaStep, adult_controlLevel, consultationType, adult_reviewReminderDate, adult_controlAssessmentAnswers } = patientData;

  // Local state for the Severe Asthma Bridge inputs
  const [screeningData, setScreeningData] = useState({
      exacerbations: '',
      hospitalizations: '',
      sabaUse: ''
  });

  if (!adult_pathway || !adult_currentGinaStep) {
    return (
      <Card title="Error: Missing Data" icon={<AlertTriangle className="text-red-500" />} className="border-red-300 bg-red-50">
        <p>Information about the therapeutic pathway or GINA step is missing. Please return to previous steps.</p>
        <div className="mt-4">
            <Button onClick={() => navigateTo('ADULT_PATHWAY_SELECTION_STEP')} variant="secondary">
            Return to Pathway Selection
            </Button>
        </div>
      </Card>
    );
  }

  const pathwayTreatments = adult_pathway === 'pathway1' ? adultTreatments.pathway1 : adultTreatments.pathway2;
  const treatment: TreatmentDetail | undefined = pathwayTreatments[adult_currentGinaStep as keyof typeof pathwayTreatments];

  const currentStepName = `GINA Step ${adult_currentGinaStep}`;
  const pathwayName = adult_pathway === 'pathway1' ? 'Pathway 1 (ICS-formoterol reliever)' : 'Pathway 2 (SABA reliever)';

  const canStepUp = adult_currentGinaStep < 5;
  const canStepDown = adult_currentGinaStep > 1;

  const handleStepChange = (newStep: number) => {
    if (newStep >= 1 && newStep <= 5) {
      updatePatientData({ 
        adult_currentGinaStep: newStep as 1 | 2 | 3 | 4 | 5,
        adult_controlLevel: null, // Reset control level when step is changed
        adult_reviewReminderDate: null,
      });
    }
  };

  const handleDateChange = (date: string) => {
      updatePatientData({ adult_reviewReminderDate: date });
  };

  const setQuickDate = (months: number) => {
      const d = new Date();
      d.setMonth(d.getMonth() + months);
      updatePatientData({ adult_reviewReminderDate: d.toISOString().split('T')[0] });
  };

  const handleSaveAndExit = () => {
    if (patientData.activePatientId) {
        if (patientData.activeConsultationId) {
            updateConsultation(patientData.activePatientId, patientData.activeConsultationId, patientData);
        } else {
            saveConsultation(patientData.activePatientId, patientData);
        }
        navigateTo('PATIENT_DASHBOARD');
    }
  };

  const handleTransitionToSevereAsthma = () => {
      let ageToSet = '';

      // 1. Try to calculate exact age from Patient Profile (if active)
      if (patientData.activePatientId) {
          const profile = getPatient(patientData.activePatientId);
          if (profile && profile.dateOfBirth) {
              const dob = new Date(profile.dateOfBirth);
              const today = new Date();
              let age = today.getFullYear() - dob.getFullYear();
              const m = today.getMonth() - dob.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                  age--;
              }
              ageToSet = age.toString();
          }
      }

      // 2. Fallback to extracting from the category label if no profile found (e.g. demo/guest mode)
      if (!ageToSet && patientData.age) {
           ageToSet = patientData.age.replace(/\D/g, '');
      }

      // 3. Process Clinical Data for Transfer
      const exacCount = parseInt(screeningData.exacerbations) || 0;
      const hospCount = parseInt(screeningData.hospitalizations) || 0;
      const sabaCount = parseInt(screeningData.sabaUse) || 0;
      
      const isUncontrolled = adult_controlLevel === 'uncontrolled' || adult_controlLevel === 'partlyControlled';

      // Pre-fill the Severe Asthma context with data collected in this bridge and inferred data
      updatePatientData({
          severeAsthma: {
              ...patientData.severeAsthma,
              basicInfo: {
                  ...patientData.severeAsthma.basicInfo,
                  age: ageToSet, 
                  exacerbationsLastYear: screeningData.exacerbations,
                  hospitalizationsLastYear: screeningData.hospitalizations,
                  sabaUse: screeningData.sabaUse,
                  diagnosis: 'confirmed', // Assuming diagnosis confirmed if they are at Step 5
                  asthmaOnset: 'adult' // Default, user can change in the form
              },
              symptoms: {
                  ...patientData.severeAsthma.symptoms,
                  // Transfer answers from Control Assessment
                  nightWaking: adult_controlAssessmentAnswers?.nocturnalSymptoms ?? false,
                  activityLimitation: adult_controlAssessmentAnswers?.activityLimitation ?? false,
                  poorControl: isUncontrolled,
                  frequentExacerbations: exacCount >= 2 || hospCount >= 1,
                  frequentSabaUse: sabaCount >= 3,
                  // allergenDriven: defaults to false, user sets in Stage 1
              },
              medications: {
                  ...patientData.severeAsthma.medications,
                  icsLaba: true, // Implied by Step 4/5
                  icsDose: 'high', // Implied by Step 5
              }
          }
      });
      // Navigate to the start of the severe asthma flow
      navigateTo('SEVERE_ASTHMA_STAGE_1');
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
        wellControlled: "Maintain current step. Consider stepping down after 3 months of stability.",
        partlyControlled: "Consider stepping up treatment. Review adherence, inhaler technique, and modifiable risk factors.",
        uncontrolled: "Step up treatment. Review adherence, technique, and risk factors. Consider a short course of OCS if severe."
    };
    
    return (
        <div className={`my-6 p-4 rounded-lg border-l-4 ${style.bg} ${style.border}`}>
            <div className="flex items-center">
                {style.icon}
                <h3 className={`text-lg font-semibold ${style.text}`}>
                Asthma is {levelText}
                </h3>
            </div>
            <p className={`text-sm ${style.text} mt-2 pl-9`}>{advice[level]}</p>
            <div className="mt-3 pl-9">
                {level === 'wellControlled' && canStepDown && (
                    <Button onClick={() => navigateTo('STEP_DOWN_ASSESS_STEP')} variant="secondary" size="sm" leftIcon={<TrendingDown size={16}/>}>
                        View Step-Down Guide
                    </Button>
                )}
                {(level === 'partlyControlled' || level === 'uncontrolled') && canStepUp && (
                    <Button onClick={() => handleStepChange(adult_currentGinaStep + 1)} variant="warning" size="sm" leftIcon={<TrendingUp size={16}/>}>
                        Step-Up Treatment
                    </Button>
                )}
            </div>
        </div>
    );
  };

  // Determine if we should show the Severe Asthma Bridge
  // Logic: At Step 5 OR Uncontrolled at Step 4/5
  const showSevereAsthmaBridge = adult_currentGinaStep === 5 || (adult_currentGinaStep >= 4 && adult_controlLevel === 'uncontrolled');

  return (
    <Card title="Adult Asthma Treatment Plan" icon={<Pill className="text-sky-600" />}>
      <ManagementCycleWidget ageGroup="adult" />

      <div className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-lg">
        <p className="text-md font-semibold text-sky-700">{pathwayName}</p>
        <p className="text-2xl font-bold text-sky-800">{currentStepName}</p>
        <p className="text-sm font-semibold text-slate-600 mt-1">{treatment?.name}</p>
      </div>

      <ControlResultDisplay level={adult_controlLevel} />

      {/* SEVERE ASTHMA BRIDGE */}
      {showSevereAsthmaBridge && (
          <div className="mb-8 p-5 bg-red-50 border-2 border-red-200 rounded-xl shadow-sm">
              <div className="flex items-start mb-4">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                      <Stethoscope className="text-red-600" size={24}/>
                  </div>
                  <div>
                      <h3 className="text-lg font-bold text-red-900">Treatment Failure / Severe Asthma Assessment</h3>
                      <p className="text-sm text-red-800 mt-1">
                          The patient is at Step 5 or remains uncontrolled on high-dose therapy. It is critical to differentiate between "Difficult-to-treat" and "Severe" asthma.
                      </p>
                  </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-red-100 mb-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Clinical Impact Screening</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Exacerbations (last year)</label>
                          <input 
                              type="number" 
                              className="w-full p-2 border border-slate-300 rounded text-sm"
                              placeholder="#"
                              value={screeningData.exacerbations}
                              onChange={(e) => setScreeningData({...screeningData, exacerbations: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Hospitalizations (last year)</label>
                          <input 
                              type="number" 
                              className="w-full p-2 border border-slate-300 rounded text-sm"
                              placeholder="#"
                              value={screeningData.hospitalizations}
                              onChange={(e) => setScreeningData({...screeningData, hospitalizations: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">SABA Canisters (per year)</label>
                          <input 
                              type="number" 
                              className="w-full p-2 border border-slate-300 rounded text-sm"
                              placeholder="#"
                              value={screeningData.sabaUse}
                              onChange={(e) => setScreeningData({...screeningData, sabaUse: e.target.value})}
                          />
                          <p className="text-[10px] text-red-500 mt-1">{parseInt(screeningData.sabaUse) >= 3 ? 'High Risk' : ''}</p>
                      </div>
                  </div>
              </div>

              <Button 
                  onClick={handleTransitionToSevereAsthma} 
                  variant="danger" 
                  fullWidth 
                  size="lg" 
                  rightIcon={<ArrowRight />}
                  className="shadow-md"
              >
                  Launch Severe Asthma Protocol
              </Button>
          </div>
      )}

      <div className="space-y-1">
        {treatment ? (
          <div className="space-y-1 bg-white p-4 rounded-md border border-slate-200">
            {treatment.controller && (
              <DetailSection title="Controller" icon={<ShieldCheck className="text-emerald-500"/>}>
                <p>{treatment.controller}</p>
              </DetailSection>
            )}
            {treatment.reliever && (
              <DetailSection title="Reliever" icon={<Wind className="text-blue-500"/>}>
                <p>{treatment.reliever}</p>
              </DetailSection>
            )}
            {treatment.additional && (
              <DetailSection title="Additional / Alternative Controller Options" icon={<PlusCircle className="text-cyan-500"/>}>
                 {typeof treatment.additional === 'string' ? <p>{treatment.additional}</p> : <ul className="list-disc list-inside space-y-1">{treatment.additional.map((item, i) => <li key={i}>{item}</li>)}</ul>}
              </DetailSection>
            )}
            {treatment.keyPoints && treatment.keyPoints.length > 0 && (
               <DetailSection title="Key Points" icon={<Info className="text-sky-500"/>}>
                <ul className="list-disc list-inside space-y-1">
                  {treatment.keyPoints.map((point, index) => <li key={index}>{point}</li>)}
                </ul>
              </DetailSection>
            )}
             {treatment.notes && (
               <DetailSection title="Notes" icon={<FileText className="text-slate-500"/>}>
                {typeof treatment.notes === 'string' ? <p>{treatment.notes}</p> : <ul className="list-disc list-inside space-y-1">{treatment.notes.map((item, i) => <li key={i}>{item}</li>)}</ul>}
              </DetailSection>
            )}
            {treatment.referral && (
                <div className="mt-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-md">
                    <h4 className="font-semibold text-amber-800 flex items-center text-sm"><AlertTriangle size={16} className="mr-2"/>Specialist Referral</h4>
                    <p className="text-sm text-amber-700 mt-1 pl-6">{treatment.referral}</p>
                </div>
            )}
          </div>
        ) : (
          <p className="text-slate-600">No specific treatment details found for this step/pathway combination.</p>
        )}

        <div className="space-y-2 bg-white p-4 rounded-md border border-slate-200 mt-4">
          <DetailSection title="Non-Pharmacological Strategies" icon={<Route className="text-indigo-500"/>}>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Smoking/Vaping Cessation:</strong> Strongly advise quitting and provide support. Avoid environmental tobacco smoke.</li>
              <li><strong>Physical Activity:</strong> Encourage regular physical activity. Advise on preventing exercise-induced symptoms.</li>
              <li><strong>Trigger Management:</strong> Identify and avoid confirmed triggers (e.g., allergens, occupational exposures, medications like NSAIDs).</li>
              <li><strong>Action Plan:</strong> Provide and explain a written asthma action plan.</li>
            </ul>
          </DetailSection>
        </div>
      </div>
      
      <PrescriptionWriter />

      {/* Next Appointment Section */}
      <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-3 flex items-center">
              <Calendar size={18} className="mr-2 text-indigo-600"/>
              Schedule Next Appointment
          </h4>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full sm:w-auto">
                  <input 
                      type="date" 
                      value={adult_reviewReminderDate ? new Date(adult_reviewReminderDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-md shadow-inner text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                  <Button onClick={() => setQuickDate(1)} variant="secondary" size="sm">1 Month</Button>
                  <Button onClick={() => setQuickDate(3)} variant="secondary" size="sm">3 Months</Button>
              </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
              Ideally schedule a review 1-3 months after starting treatment, then every 3-12 months.
          </p>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-200">
         {/* Only show Adjustment Steps during follow-up consultations */}
         {consultationType === 'followup' && (
             <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 text-center mb-4">Adjust Treatment Step:</h3>
                <div className="flex justify-center items-center space-x-3 mb-2">
                <Button 
                    onClick={() => handleStepChange(adult_currentGinaStep - 1)} 
                    disabled={!canStepDown}
                    variant="secondary"
                    leftIcon={<MinusCircle />}
                    aria-label="Decrease treatment step"
                    size="sm"
                >
                    Step Down
                </Button>
                <span className="text-lg font-bold text-sky-600 w-24 text-center py-1.5 border border-slate-300 rounded-md bg-slate-50">Step {adult_currentGinaStep}</span>
                <Button 
                    onClick={() => handleStepChange(adult_currentGinaStep + 1)} 
                    disabled={!canStepUp}
                    variant="secondary"
                    leftIcon={<PlusCircle />}
                    aria-label="Increase treatment step"
                    size="sm"
                >
                    Step Up
                </Button>
                </div>
                <p className="text-xs text-slate-500 text-center">
                Step up if poorly controlled. Step down if well controlled for 3 months. Review factors before stepping up.
                </p>
            </div>
         )}

        {patientData.activePatientId && (
            <div className="mt-4 border-t border-slate-300 pt-6 flex justify-center">
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
      </div>
    </Card>
  );
};

export default AdultTreatmentPlanStep;
