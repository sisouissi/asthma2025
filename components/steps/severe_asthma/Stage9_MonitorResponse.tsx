import React, { useState, useEffect } from 'react';
import AssessmentCard from './AssessmentCard';
import Button from '../../ui/Button';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { usePatientRecords } from '../../../contexts/PatientRecordsContext';
import { BarChart3, ChevronRight, Save, Calendar, Pill, AlertTriangle } from '../../../constants/icons';
import PrescriptionWriter from '../../common/PrescriptionWriter';
import { PrescriptionItem } from '../../../types';
import { biologicOptions } from '../../../constants/severeAsthmaData';

const Stage9_MonitorResponse: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { patientData, updatePatientData } = usePatientData();
  const { saveConsultation, updateConsultation } = usePatientRecords();
  
  const { biologicResponse, selectedBiologic } = patientData.severeAsthma;
  const [nextReviewDate, setNextReviewDate] = useState('');

  // Auto-set default review date and pre-fill prescription on mount
  useEffect(() => {
      if (!nextReviewDate) {
          const d = new Date();
          // If Good/Partial -> 6 months. If No -> 1-3 months (closer monitoring)
          d.setMonth(d.getMonth() + (biologicResponse === 'no' ? 3 : 6)); 
          setNextReviewDate(d.toISOString().split('T')[0]);
      }
      
      // --- PRESCRIPTION AUTO-POPULATION LOGIC ---
      const currentMeds = [...patientData.currentPrescription];
      let medsUpdated = false;

      // 1. If Good/Partial: Ensure Biologic is present
      if ((biologicResponse === 'good' || biologicResponse === 'partial') && selectedBiologic) {
          const bioExists = currentMeds.some(m => m.medicationName.includes(selectedBiologic.split(' (')[0]));
          if (!bioExists) {
               const drugNameClean = selectedBiologic.split(' (')[0]; 
               const drugInfo = biologicOptions.find(b => b.name.includes(drugNameClean));

               if (drugInfo) {
                   const newBioItem: PrescriptionItem = {
                        id: crypto.randomUUID(),
                        medicationId: 'bio-' + crypto.randomUUID(),
                        medicationName: selectedBiologic,
                        instructions: drugInfo.administration || 'SC Injection',
                        duration: '6 months'
                   };
                   currentMeds.push(newBioItem);
                   medsUpdated = true;
               }
          }
      }
      // 2. If NO Response: Remove Biologic from list automatically?
      // This is safer to leave to the doctor, but we can filter out the *specific* failed biologic.
      if (biologicResponse === 'no' && selectedBiologic) {
          const bioIndex = currentMeds.findIndex(m => m.medicationName.includes(selectedBiologic.split(' (')[0]));
          if (bioIndex > -1) {
              currentMeds.splice(bioIndex, 1);
              medsUpdated = true;
          }
      }

      if (medsUpdated) {
          updatePatientData({ currentPrescription: currentMeds });
      }

  }, [biologicResponse, selectedBiologic]); 

  const handleSaveAndExit = () => {
        const updatedData = {
            ...patientData,
            adult_reviewReminderDate: nextReviewDate || patientData.adult_reviewReminderDate
        };
        updatePatientData(updatedData);
        
        if (patientData.activePatientId) {
            if (patientData.activeConsultationId) {
                updateConsultation(patientData.activePatientId, patientData.activeConsultationId, updatedData);
            } else {
                saveConsultation(patientData.activePatientId, updatedData);
            }
            // If No Response, we might want to go to Summary immediately, but usually back to dashboard is standard
            navigateTo('PATIENT_DASHBOARD');
        } else {
             navigateTo('SEVERE_ASTHMA_STAGE_11');
        }
  };
  
  const handleGoToFinalReport = () => {
        // Similar save logic but navigating to Stage 11
         const updatedData = {
            ...patientData,
            adult_reviewReminderDate: nextReviewDate || patientData.adult_reviewReminderDate
        };
        updatePatientData(updatedData);
        navigateTo('SEVERE_ASTHMA_STAGE_11');
  }


  // DEFAULT VIEW 
  if (!biologicResponse) {
      return (
        <AssessmentCard title="Monitor & Manage Severe Asthma" icon={<BarChart3 />}>
            <p className="text-sm text-slate-600 mb-4">Continue regular monitoring of symptom control, exacerbations, and side effects.</p>
            <Button onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_10')} variant="primary" size="lg" rightIcon={<ChevronRight />}>
                Next Stage: Ongoing Care
            </Button>
        </AssessmentCard>
      );
  }

  // GOOD RESPONSE VIEW
  if (biologicResponse === 'good') {
      return (
        <AssessmentCard title="Monitoring: Good Response to Biologic" icon={<BarChart3 className="text-green-600"/>}>
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-md mb-6">
                <h3 className="font-semibold text-green-800 text-lg mb-2">Management Plan (GINA)</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-green-700 pl-4">
                    <li><strong>Continue Biologic Therapy:</strong> Maintain current dose of {selectedBiologic || 'biologic'}.</li>
                    <li><strong>Re-evaluate:</strong> Every 3-6 months.</li>
                    <li><strong>Step Down:</strong> 
                        <ul className="list-disc list-inside pl-4 mt-1">
                            <li>First, decrease/stop OCS (check for adrenal insufficiency).</li>
                            <li>Then stop other add-on meds.</li>
                            <li>Finally, consider reducing ICS dose (do not stop).</li>
                        </ul>
                    </li>
                </ul>
            </div>
            
            <div className="mb-6">
                <h4 className="font-semibold text-slate-700 mb-3 flex items-center"><Pill size={18} className="mr-2 text-emerald-600"/> Update Prescription (Continue/Adjust)</h4>
                <PrescriptionWriter />
            </div>

            <div className="mb-6 p-4 bg-white border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-slate-700 mb-3 flex items-center"><Calendar size={18} className="mr-2 text-sky-600"/> Next Review</h4>
                 <div className="flex items-center gap-4">
                    <input type="date" className="p-2 border border-slate-300 rounded text-sm" value={nextReviewDate} onChange={(e) => setNextReviewDate(e.target.value)} />
                    <span className="text-xs text-slate-500">(Recommended: 6 months)</span>
                </div>
            </div>

            <Button onClick={handleSaveAndExit} variant="success" size="lg" rightIcon={<Save />}>
                Save & Continue Monitoring
            </Button>
        </AssessmentCard>
      );
  }
  
  // PARTIAL RESPONSE VIEW
  if (biologicResponse === 'partial') {
      return (
        <AssessmentCard title="Monitoring: Partial Response (Trial Extension)" icon={<BarChart3 className="text-amber-600"/>}>
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-md mb-6">
                <h3 className="font-semibold text-amber-800 text-lg mb-2">Management Plan</h3>
                <p className="text-sm text-amber-700 mb-2">
                    Response is unclear or partial. <strong>Extend the trial to 6-12 months</strong> before deciding to stop.
                </p>
            </div>
             <div className="mb-6">
                <h4 className="font-semibold text-slate-700 mb-3 flex items-center"><Pill size={18} className="mr-2"/> Extend Prescription (6 Months)</h4>
                <PrescriptionWriter />
            </div>
             <div className="mb-6 p-4 bg-white border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-slate-700 mb-3 flex items-center"><Calendar size={18} className="mr-2 text-sky-600"/> Next Review</h4>
                 <div className="flex items-center gap-4">
                    <input type="date" className="p-2 border border-slate-300 rounded text-sm" value={nextReviewDate} onChange={(e) => setNextReviewDate(e.target.value)} />
                    <span className="text-xs text-slate-500">(Recommended: 6 months)</span>
                </div>
            </div>
            <Button onClick={handleSaveAndExit} variant="warning" size="lg" rightIcon={<Save />}>
                Save Extension Plan
            </Button>
        </AssessmentCard>
      );
  }

  // NO RESPONSE VIEW
  if (biologicResponse === 'no') {
      return (
        <AssessmentCard title="Monitoring: No Response (Stop & Reassess)" icon={<BarChart3 className="text-red-600"/>}>
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md mb-6">
                <h3 className="font-semibold text-red-800 text-lg mb-2 flex items-center"><AlertTriangle className="mr-2" size={20}/> Management Plan</h3>
                 <ul className="list-disc list-inside space-y-2 text-sm text-red-700 pl-4">
                    <li><strong>Stop the biologic therapy.</strong></li>
                    <li>Review basics: Inhaler technique, adherence, comorbidities, side-effects, emotional support.</li>
                    <li>Consider high-resolution chest CT (if not done).</li>
                    <li>Reassess phenotype and treatment options (Induced sputum).</li>
                    <li>Consider add-on low dose azithromycin.</li>
                    <li>As last resort, consider add-on low dose OCS.</li>
                    <li>Consider bronchial thermoplasty (+ registry).</li>
                    <li>Stop ineffective add-on therapies. <strong>Do not stop ICS.</strong></li>
                </ul>
            </div>
             <div className="mb-6">
                <h4 className="font-semibold text-slate-700 mb-3 flex items-center"><Pill size={18} className="mr-2"/> Revised Prescription</h4>
                <p className="text-xs text-slate-500 mb-2">The biologic has been removed. Update maintenance therapy.</p>
                <PrescriptionWriter />
            </div>
             <div className="mb-6 p-4 bg-white border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-slate-700 mb-3 flex items-center"><Calendar size={18} className="mr-2 text-sky-600"/> Follow-up</h4>
                 <div className="flex items-center gap-4">
                    <input type="date" className="p-2 border border-slate-300 rounded text-sm" value={nextReviewDate} onChange={(e) => setNextReviewDate(e.target.value)} />
                    <span className="text-xs text-slate-500">(Close monitoring required)</span>
                </div>
            </div>
            <div className="flex justify-between gap-4">
                 <Button onClick={handleSaveAndExit} variant="secondary" size="lg" rightIcon={<Save />}>
                    Save & Exit
                </Button>
                <Button onClick={handleGoToFinalReport} variant="danger" size="lg" rightIcon={<ChevronRight />}>
                    Save & View Final Report (Stage 11)
                </Button>
            </div>
        </AssessmentCard>
      );
  }

  return null;
};

export default Stage9_MonitorResponse;