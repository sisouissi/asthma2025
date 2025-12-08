
import React, { useMemo } from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { useNavigation } from '../../../contexts/NavigationContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { Stethoscope, CheckCircle2, ChevronRight, CheckSquare, Square, AlertTriangle, TrendingUp, ClipboardList, Activity, Droplets, Pill } from 'lucide-react';
import { GinaDiagnosisCriteria, OnTreatmentDiagnosis } from '../../../types';

const ChildDiagnosisStep: React.FC = () => {
  const { patientData, updatePatientData } = usePatientData();
  const { navigateTo } = useNavigation();
  const { diagnosisCriteria, isOnMaintenanceTreatment, onTreatmentDiagnosis } = patientData;

  const handleToggle = (section: keyof GinaDiagnosisCriteria, field: string) => {
    if (section === 'biomarkers') return;
    updatePatientData({
      diagnosisCriteria: {
        ...diagnosisCriteria,
        [section]: {
          ...diagnosisCriteria[section],
          [field]: !diagnosisCriteria[section][field as keyof typeof diagnosisCriteria[typeof section]]
        }
      }
    });
  };

  const handleBiomarkerChange = (field: 'feNo' | 'bloodEosinophils', value: string) => {
      updatePatientData({
          diagnosisCriteria: {
              ...diagnosisCriteria,
              biomarkers: {
                  ...diagnosisCriteria.biomarkers,
                  [field]: value
              }
          }
      });
  };

  const handleTreatmentStatusChange = (isOnTreatment: boolean) => {
      updatePatientData({ isOnMaintenanceTreatment: isOnTreatment });
  };

  const handleOnTreatmentDiagnosisChange = (field: keyof OnTreatmentDiagnosis, value: any) => {
      updatePatientData({
          onTreatmentDiagnosis: {
              ...onTreatmentDiagnosis,
              [field]: value
          }
      });
  };

  const assessment = useMemo(() => {
    // Logic 1: Standard (Box 1-2) - Not on Treatment
    if (!isOnMaintenanceTreatment) {
        const hasSymptom = Object.values(diagnosisCriteria.symptoms).some(Boolean);
        const hasPattern = Object.values(diagnosisCriteria.patterns).some(Boolean);
        const hasAirflowLimitation = Object.values(diagnosisCriteria.airflowLimitation).some(Boolean);

        const feNo = parseInt(diagnosisCriteria.biomarkers.feNo) || 0;
        const eos = parseInt(diagnosisCriteria.biomarkers.bloodEosinophils) || 0;
        const hasSupportiveBiomarkers = feNo > 35 || eos >= 300;

        if (hasSymptom && hasPattern && hasAirflowLimitation) {
            return { status: 'confirmed', message: 'Criteria Met: Diagnosis Confirmed', color: 'emerald' };
        }

        if (hasSymptom && hasSupportiveBiomarkers) {
            return { 
                status: 'supported', 
                message: 'Supported by Type 2 Biomarkers (FeNO > 35ppb or Eos ≥ 300/μL)', 
                color: 'emerald',
                detail: 'Elevated biomarkers support the diagnosis of asthma even if initial spirometry is negative.'
            };
        }

        if (hasSymptom && hasPattern && !hasAirflowLimitation) {
            return { status: 'probable', message: 'Typical Symptoms Present but Objective Confirmation Missing', color: 'amber' };
        }
        return { status: 'unlikely', message: 'Insufficient Criteria for Diagnosis', color: 'slate' };
    }
    // Logic 2: On Treatment
    else {
        if (onTreatmentDiagnosis.status === 'confirmed_variable') {
             return { status: 'confirmed', message: 'Diagnosis Confirmed (Variable Airflow Present)', color: 'emerald', detail: 'Assess asthma control and review treatment.' };
        }
        if (onTreatmentDiagnosis.status === 'symptoms_no_variable') {
             const fev1 = parseFloat(onTreatmentDiagnosis.fev1_percent);
             if (!isNaN(fev1)) {
                 if (fev1 > 70) {
                     return { 
                         status: 'probable', 
                         message: 'Consider Stepping Down Treatment', 
                         color: 'amber', 
                         detail: 'Consider stepping down controller to unmask variability. Reassess in 2-4 weeks.' 
                     };
                 } else {
                     return { 
                         status: 'probable', 
                         message: 'Consider Stepping Up Treatment', 
                         color: 'amber', 
                         detail: 'Consider stepping up controller for 3 months, then reassess symptoms and lung function. If no response, refer.' 
                     };
                 }
             }
             return { status: 'pending', message: 'Enter FEV1% to view recommendation', color: 'slate' };
        }
        if (onTreatmentDiagnosis.status === 'no_symptoms_normal') {
             return { 
                 status: 'probable', 
                 message: 'Consider Stepping Down Treatment', 
                 color: 'sky', 
                 detail: 'Consider repeated BD responsiveness or step down to lowest effective dose. If symptoms emerge and lung function falls, asthma is confirmed.' 
             };
        }
        return { status: 'pending', message: 'Select current clinical status', color: 'slate' };
    }
  }, [diagnosisCriteria, isOnMaintenanceTreatment, onTreatmentDiagnosis]);

  const handleContinue = () => {
    if (assessment.status === 'confirmed' || assessment.status === 'supported') {
        updatePatientData({ diagnosisConfirmed: true });
        navigateTo('CHILD_RISK_ASSESSMENT_STEP');
    } else {
        updatePatientData({ diagnosisConfirmed: false });
        if (isOnMaintenanceTreatment && assessment.status === 'probable') {
             navigateTo('CHILD_RISK_ASSESSMENT_STEP');
        } else {
             navigateTo('DIAGNOSIS_PENDING_STEP');
        }
    }
  };

  const CheckboxGroup: React.FC<{ 
    section: keyof GinaDiagnosisCriteria;
    items: { key: string; label: string }[]; 
  }> = ({ section, items }) => (
    <div className="space-y-2">
      {items.map((item) => (
        <div 
          key={item.key}
          onClick={() => handleToggle(section, item.key)}
          className={`flex items-center p-3 rounded-md bg-slate-100 border border-slate-300 shadow-inner cursor-pointer hover:bg-white transition-colors`}
        >
          <div className="mr-3 text-slate-500">
             {(diagnosisCriteria[section] as any)[item.key] 
                ? <CheckSquare className="text-emerald-600" size={20} /> 
                : <Square size={20} />
             }
          </div>
          <span className={`text-sm font-medium ${(diagnosisCriteria[section] as any)[item.key] ? 'text-slate-900' : 'text-slate-600'}`}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <Card 
      title="Diagnostic Criteria (GINA Box 1-2)" 
      icon={<Activity className="text-emerald-600" />} 
      titleRightElement={<span className="text-sm font-normal text-slate-500">Children 6-11 years</span>}
    >
      {/* Treatment Status Toggle */}
      <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <h4 className="font-semibold text-emerald-900 mb-3 flex items-center">
              <Pill size={18} className="mr-2"/>
              Treatment Status
          </h4>
          <p className="text-sm text-emerald-800 mb-3">Is the child currently taking controller medication (e.g., ICS)?</p>
          <div className="flex gap-4">
              <Button 
                onClick={() => handleTreatmentStatusChange(true)} 
                variant={isOnMaintenanceTreatment ? 'success' : 'secondary'}
                size="sm"
              >
                  Yes, on Controller
              </Button>
              <Button 
                onClick={() => handleTreatmentStatusChange(false)} 
                variant={!isOnMaintenanceTreatment ? 'success' : 'secondary'}
                size="sm"
              >
                  No, Treatment Naïve / SABA Only
              </Button>
          </div>
      </div>

      {!isOnMaintenanceTreatment ? (
          <div className="space-y-6">
            <p className="text-sm text-slate-600">
                Select all that apply to determine if the child meets the GINA criteria for the initial diagnosis of asthma.
            </p>
            <div>
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center">
                    <ClipboardList size={16} className="mr-2"/> 1. History of Typical Respiratory Symptoms
                </h4>
                <CheckboxGroup 
                    section="symptoms" 
                    items={[
                        { key: 'wheeze', label: 'Wheeze' },
                        { key: 'sob', label: 'Shortness of Breath' },
                        { key: 'chestTightness', label: 'Chest Tightness' },
                        { key: 'cough', label: 'Cough' }
                    ]} 
                />
            </div>

            <div>
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center">
                    <TrendingUp size={16} className="mr-2"/> Pattern of Symptoms
                </h4>
                <CheckboxGroup 
                    section="patterns" 
                    items={[
                        { key: 'variable', label: 'Symptoms vary over time and in intensity' },
                        { key: 'nightWaking', label: 'Symptoms often worse at night or on waking' },
                        { key: 'triggers', label: 'Triggered by exercise, laughter, allergens, cold air' },
                        { key: 'viralWorsening', label: 'Often appear or worsen with viral infections' }
                    ]} 
                />
            </div>

            <div>
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center">
                    <CheckCircle2 size={16} className="mr-2"/> 2. Confirmed Variable Expiratory Airflow
                </h4>
                <p className="text-xs text-slate-500 mb-3">At least one of the following objective tests is positive:</p>
                <CheckboxGroup 
                    section="airflowLimitation" 
                    items={[
                        { key: 'bdReversibility', label: 'Positive BD Reversibility (Increase in FEV1 >12% predicted)' },
                        { key: 'pefVariability', label: 'Excessive variability in twice-daily PEF (>13%)' },
                        { key: 'treatmentTrial', label: 'Significant increase in lung function after 4 weeks anti-inflammatory treatment' },
                        { key: 'challengeTest', label: 'Positive exercise challenge (Fall in FEV1 >12% predicted)' },
                        { key: 'visitVariation', label: 'Excessive variation in FEV1 between visits (>12% predicted)' }
                    ]} 
                />
            </div>
          </div>
      ) : (
          // On Treatment Flow
          <div className="space-y-6">
              <p className="text-sm text-slate-600">
                Select the child's current status to guide further diagnostic steps (GINA Box 1-4).
              </p>
              
              <div className="space-y-3">
                  <div 
                    onClick={() => handleOnTreatmentDiagnosisChange('status', 'confirmed_variable')}
                    className={`p-4 border rounded-lg cursor-pointer ${onTreatmentDiagnosis.status === 'confirmed_variable' ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-300'}`}
                  >
                      <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border mr-3 ${onTreatmentDiagnosis.status === 'confirmed_variable' ? 'bg-emerald-600 border-emerald-600' : 'border-slate-400'}`}></div>
                          <span className="font-medium text-slate-800">Typical symptoms + Confirmed variable airflow</span>
                      </div>
                  </div>

                  <div 
                    onClick={() => handleOnTreatmentDiagnosisChange('status', 'symptoms_no_variable')}
                    className={`p-4 border rounded-lg cursor-pointer ${onTreatmentDiagnosis.status === 'symptoms_no_variable' ? 'bg-amber-50 border-amber-500' : 'bg-white border-slate-300'}`}
                  >
                      <div className="flex items-center mb-2">
                          <div className={`w-4 h-4 rounded-full border mr-3 ${onTreatmentDiagnosis.status === 'symptoms_no_variable' ? 'bg-amber-600 border-amber-600' : 'border-slate-400'}`}></div>
                          <span className="font-medium text-slate-800">Typical symptoms + NO variable airflow</span>
                      </div>
                      {onTreatmentDiagnosis.status === 'symptoms_no_variable' && (
                          <div className="ml-7 mt-2">
                              <label className="block text-xs font-medium text-slate-600 mb-1">Enter current FEV1 (% predicted):</label>
                              <input 
                                type="number" 
                                className="p-2 border border-slate-300 rounded w-32 text-sm"
                                placeholder="e.g. 75"
                                value={onTreatmentDiagnosis.fev1_percent}
                                onChange={(e) => handleOnTreatmentDiagnosisChange('fev1_percent', e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                          </div>
                      )}
                  </div>

                  <div 
                    onClick={() => handleOnTreatmentDiagnosisChange('status', 'no_symptoms_normal')}
                    className={`p-4 border rounded-lg cursor-pointer ${onTreatmentDiagnosis.status === 'no_symptoms_normal' ? 'bg-sky-50 border-sky-500' : 'bg-white border-slate-300'}`}
                  >
                      <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border mr-3 ${onTreatmentDiagnosis.status === 'no_symptoms_normal' ? 'bg-sky-600 border-sky-600' : 'border-slate-400'}`}></div>
                          <span className="font-medium text-slate-800">Few/No symptoms + Normal lung function</span>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* 4. Supportive Biomarkers */}
      <div className="mt-8 pt-6 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center">
                <Droplets size={16} className="mr-2"/> 3. Supportive Evidence: Type 2 Biomarkers
            </h4>
            <p className="text-xs text-slate-500 mb-3">If lung function testing is negative or not available, elevated Type 2 biomarkers can support the diagnosis.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">FeNO (ppb)</label>
                    <input 
                        type="number" 
                        className="w-full p-2 bg-slate-100 border border-slate-300 rounded-md shadow-inner text-slate-800 placeholder-slate-400 focus:bg-white focus:shadow-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., 25"
                        value={diagnosisCriteria.biomarkers.feNo}
                        onChange={(e) => handleBiomarkerChange('feNo', e.target.value)}
                    />
                    <p className="text-[10px] text-slate-500 mt-1">&gt;35 ppb strongly supports diagnosis (Children)</p>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Blood Eosinophils (/μL)</label>
                    <input 
                        type="number" 
                        className="w-full p-2 bg-slate-100 border border-slate-300 rounded-md shadow-inner text-slate-800 placeholder-slate-400 focus:bg-white focus:shadow-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., 300"
                        value={diagnosisCriteria.biomarkers.bloodEosinophils}
                        onChange={(e) => handleBiomarkerChange('bloodEosinophils', e.target.value)}
                    />
                     <p className="text-[10px] text-slate-500 mt-1">≥300/μL supports diagnosis</p>
                </div>
            </div>
        </div>

      {/* Assessment Result */}
      <div className={`mt-8 p-4 rounded-lg border-l-4 bg-${assessment.color}-50 border-${assessment.color}-500 shadow-sm`}>
          <div className="flex items-start">
             <div className={`mt-1 mr-3 text-${assessment.color}-600`}>
                 {assessment.status === 'confirmed' || assessment.status === 'supported' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
             </div>
             <div>
                 <h3 className={`text-lg font-bold text-${assessment.color}-800`}>{assessment.message}</h3>
                 {(assessment as any).detail && <p className="text-sm font-medium mt-1 text-slate-700">{(assessment as any).detail}</p>}
                 {assessment.status === 'confirmed' && !isOnMaintenanceTreatment && <p className="text-sm text-emerald-700">Proceed to Risk Assessment.</p>}
                 {assessment.status === 'probable' && !isOnMaintenanceTreatment && <p className="text-sm text-amber-700">Consider a diagnostic trial or referral for testing.</p>}
             </div>
          </div>
      </div>

      <div className="mt-8">
        <Button 
          onClick={handleContinue} 
          fullWidth 
          size="xl" 
          variant={assessment.status === 'confirmed' || assessment.status === 'supported' || (isOnMaintenanceTreatment && assessment.status === 'probable') ? 'success' : 'primary'}
          rightIcon={<ChevronRight />}
        >
          {assessment.status === 'confirmed' || assessment.status === 'supported' || (isOnMaintenanceTreatment && assessment.status === 'probable') ? 'Confirm & Continue' : 'View Recommendations'}
        </Button>
      </div>
    </Card>
  );
};

export default ChildDiagnosisStep;
