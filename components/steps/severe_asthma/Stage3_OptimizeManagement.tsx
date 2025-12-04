import React, { useState } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { usePatientRecords } from '../../../contexts/PatientRecordsContext';
import AssessmentCard from './AssessmentCard';
import Button from '../../ui/Button';
import { Heart, Calendar, CheckSquare, Square, Save, BookOpen, Pill, Activity, ShieldCheck } from '../../../constants/icons';
import PrescriptionWriter from '../../common/PrescriptionWriter';

const interventionsList = [
    {
        category: "Education & Skills",
        icon: <BookOpen size={18} className="text-indigo-600"/>,
        items: [
            "Check & Correct Inhaler Technique (physical demo + teach-back)",
            "Confirm Written Asthma Action Plan (personalized)",
            "Refer to asthma educator (if available)"
        ]
    },
    {
        category: "Optimize Medication",
        icon: <Pill size={18} className="text-emerald-600"/>,
        items: [
            "Switch to ICS-formoterol MART (reduces exacerbation risk)",
            "Address suboptimal adherence (intentional & unintentional)",
            "Consider trial of LAMA or LTRA (if not already tried)",
            "Initiate short-term (3-6mo) trial of High-Dose ICS-LABA",
            "Consider electronic inhaler monitoring"
        ]
    },
    {
        category: "Non-Pharmacological",
        icon: <Activity size={18} className="text-amber-600"/>,
        items: [
            "Smoking/Vaping cessation support",
            "Weight loss / Healthy diet counseling",
            "Physical exercise / Pulmonary rehabilitation",
            "Breathing exercises / Mucus clearance",
            "Vaccinations (Influenza, RSV)",
            "Allergen avoidance (if sensitized & exposed)"
        ]
    },
    {
        category: "Comorbidities & Risk Factors",
        icon: <ShieldCheck size={18} className="text-red-600"/>,
        items: [
            "Treat CRSwNP / CRSsNP (Nasal polyps)",
            "Manage Anxiety/Depression (refer if needed)",
            "Review medications (avoid beta-blockers/NSAIDs if sensitive)",
            "Avoid routine treatment of asymptomatic GERD"
        ]
    }
];

const Stage3_OptimizeManagement: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { patientData, updatePatientData } = usePatientData();
  const { saveConsultation, updateConsultation } = usePatientRecords();
  
  // Initialize from context if available, else empty
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>(
      patientData.severeAsthma.optimizationPlan?.interventions || []
  );
  
  const [followUpDate, setFollowUpDate] = useState<string>(
      patientData.severeAsthma.optimizationPlan?.followUpDate || ''
  );

  const toggleIntervention = (item: string) => {
      setSelectedInterventions(prev => 
          prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      );
  };

  const handleSaveAndStartTrial = () => {
      // 1. Update Patient Data with Plan and Status
      // CRITICAL: Ensure we are spreading the existing severeAsthma object correctly
      // so data from Stage 1 (Basic Info, Symptoms) and Stage 2 (Risk Factors) is preserved.
      const updatedData = {
          ...patientData,
          severeAsthma: {
              ...patientData.severeAsthma, // Preserves basicInfo, symptoms, medications, biomarkers, comorbidities, riskFactors
              status: 'optimizing' as const, 
              optimizationPlan: {
                  dateInitiated: new Date().toISOString(),
                  interventions: selectedInterventions,
                  followUpDate: followUpDate || null
              }
          }
      };
      
      updatePatientData(updatedData);

      // 2. Save to Records
      if (patientData.activePatientId) {
          if (patientData.activeConsultationId) {
              updateConsultation(patientData.activePatientId, patientData.activeConsultationId, updatedData);
          } else {
              saveConsultation(patientData.activePatientId, updatedData);
          }
          // 3. Navigate back to Dashboard to indicate "Consultation Finished, Trial Started"
          navigateTo('PATIENT_DASHBOARD');
      } else {
          // If no active patient (demo mode), just proceed to next stage to show flow
          navigateTo('SEVERE_ASTHMA_STAGE_4');
      }
  };

  return (
    <div>
        <div className="mb-6 p-4 bg-sky-50 border-l-4 border-sky-500 rounded-r-lg">
            <h3 className="font-bold text-sky-800 flex items-center text-lg mb-2">
                <Heart className="mr-2" />
                3. Review and Optimize Management
            </h3>
            <p className="text-sm text-sky-700 leading-relaxed">
                Before considering biologic therapy, ensure that standard care is optimized. 
                Address basics, medications, comorbidities, and lifestyle factors.
            </p>
        </div>

        {/* Intervention Groups */}
        <div className="space-y-6">
            {interventionsList.map((group, idx) => (
                <AssessmentCard key={idx} title={group.category} icon={group.icon}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        {group.items.map((item, i) => (
                            <div 
                                key={i}
                                className="flex items-start p-2 rounded-md hover:bg-slate-50 cursor-pointer transition-colors"
                                onClick={() => toggleIntervention(item)}
                            >
                                <div className="mt-0.5 mr-3 text-sky-600">
                                    {selectedInterventions.includes(item) ? <CheckSquare size={20}/> : <Square size={20}/>}
                                </div>
                                <span className="text-sm text-slate-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </AssessmentCard>
            ))}
        </div>

        <PrescriptionWriter />

        <div className="mt-8 p-5 rounded-lg border border-sky-200 bg-white shadow-sm">
            <div className="flex items-start">
                <Calendar className="text-sky-600 mr-3 mt-1 flex-shrink-0" size={24}/>
                <div className="w-full">
                    <h4 className="font-semibold text-sky-800 text-lg">Schedule Optimization Review</h4>
                    <p className="text-sm text-sky-700 mt-1 mb-4">
                        The interventions listed above should be implemented. Schedule a follow-up in <strong>3-6 months</strong> to assess the patient's response to this optimized management.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <input 
                            type="date" 
                            className="p-2 border border-slate-300 rounded-md text-sm w-full sm:w-auto focus:ring-2 focus:ring-sky-500"
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={() => {
                                const d = new Date(); d.setMonth(d.getMonth() + 3); 
                                setFollowUpDate(d.toISOString().split('T')[0]);
                            }}>3 Months</Button>
                            <Button size="sm" variant="secondary" onClick={() => {
                                const d = new Date(); d.setMonth(d.getMonth() + 6); 
                                setFollowUpDate(d.toISOString().split('T')[0]);
                            }}>6 Months</Button>
                        </div>
                    </div>
                </div>
            </div>
             
             <div className="mt-6 border-t border-sky-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <p className="text-xs text-sky-600 italic">
                     Clicking 'Save' will record the selected interventions and return to the dashboard. The patient status will be updated to 'Optimizing'.
                 </p>
                 <Button 
                    onClick={handleSaveAndStartTrial}
                    size="lg"
                    variant="primary"
                    rightIcon={<Save size={18} />}
                    className="w-full sm:w-auto shadow-md"
                 >
                    Save Consultation & Start Trial
                </Button>
            </div>
        </div>
    </div>
  );
};

export default Stage3_OptimizeManagement;