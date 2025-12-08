
import React, { useState } from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { useNavigation } from '../../../contexts/NavigationContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { Baby, ChevronRight, Lightbulb, CheckSquare, Square, AlertTriangle } from 'lucide-react';
import { YoungChildDiagnosisCriteria } from '../../../types';

const diagnosisCriteriaList = [
    { 
        id: 'criterion1' as keyof YoungChildDiagnosisCriteria, 
        label: 'Recurrent Acute Wheezing Episode(s)',
        details: "History of 2 or more wheezing episodes in the past year, OR 1 episode with asthma-like symptoms in between."
    },
    { 
        id: 'criterion2' as keyof YoungChildDiagnosisCriteria, 
        label: 'No Likely Alternative Cause',
        details: "A thorough medical history and examination suggests no other condition is causing the symptoms (except a concurrent viral infection)."
    },
    { 
        id: 'criterion3' as keyof YoungChildDiagnosisCriteria, 
        label: 'Timely Clinical Response to Treatment',
        details: "Improvement confirmed after SABA, or after a 2-3 month trial of daily low-dose ICS."
    },
];

const YoungChildDiagnosisStep: React.FC = () => {
  const { patientData } = usePatientData();
  const { navigateTo } = useNavigation();
  const [criteria, setCriteria] = useState<YoungChildDiagnosisCriteria>({
    criterion1: false,
    criterion2: false,
    criterion3: false,
  });

  const handleToggleCriterion = (criterionId: keyof YoungChildDiagnosisCriteria) => {
    setCriteria(prev => ({ ...prev, [criterionId]: !prev[criterionId] }));
  };

  const handleDetermineDiagnosis = () => {
    const metCriteriaCount = Object.values(criteria).filter(Boolean).length;
    if (metCriteriaCount === 3) {
      // Confirmed Asthma
      navigateTo('YOUNG_CHILD_SYMPTOM_PATTERN_STEP', { 
        diagnosisConfirmed: true, 
        youngChild_diagnosisCriteria: criteria 
      });
    } else if (metCriteriaCount >= 1) {
      // Suspected Asthma
      navigateTo('YOUNG_CHILD_SUSPECTED_ASTHMA_STEP', { 
        diagnosisConfirmed: false, // It's provisional
        youngChild_diagnosisCriteria: criteria 
      });
    } else {
      // Asthma Unlikely
      navigateTo('DIAGNOSIS_PENDING_STEP', { 
        diagnosisConfirmed: false,
        youngChild_diagnosisCriteria: criteria 
      });
    }
  };

  return (
    <Card 
      title="Clinical Diagnosis of Asthma (Child <=5 years)" 
      icon={<Baby className="text-violet-600" />} 
      titleRightElement={<span className="text-sm font-normal text-slate-500">Age: {patientData.age}</span>}
    >
      <div className="mb-6 p-4 bg-violet-50 border border-violet-200 rounded-lg">
        <div className="flex items-start">
          <Lightbulb size={24} className="mr-3 mt-1 text-violet-500 flex-shrink-0" />
          <div>
            <h3 className="text-md font-semibold text-violet-800">GINA 2025 Three-Criteria Approach</h3>
            <p className="text-sm text-slate-600 mt-1">
              Diagnosis is primarily clinical. According to GINA 2025, <strong>all three criteria below</strong> must be fulfilled for a confirmed diagnosis of asthma.
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-4 text-center text-slate-700">Which of the following criteria are met for this child?</h3>
      
      <div className="space-y-3 mb-8">
        {diagnosisCriteriaList.map((item) => {
            const isSelected = criteria[item.id];
            return (
                <div
                key={item.id}
                onClick={() => handleToggleCriterion(item.id)}
                role="checkbox"
                aria-checked={isSelected}
                className={`flex items-start p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                    isSelected 
                    ? 'bg-violet-50 border-violet-400' 
                    : 'bg-white border-slate-300 hover:bg-slate-50'
                }`}
                >
                {isSelected ? (
                    <CheckSquare size={20} className="text-violet-600 mr-3 mt-0.5 flex-shrink-0" />
                ) : (
                    <Square size={20} className="text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-grow">
                    <span className={`text-sm ${isSelected ? 'font-semibold text-slate-800' : 'text-slate-700'}`}>
                    {item.label}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{item.details}</p>
                </div>
                </div>
            )
        })}
      </div>

      <Button
          onClick={handleDetermineDiagnosis}
          variant="violet"
          fullWidth
          size="xl"
          rightIcon={<ChevronRight />}
          aria-label="Determine diagnosis based on selected criteria"
        >
          Determine Diagnosis
        </Button>
    </Card>
  );
};

export default YoungChildDiagnosisStep;
