
import React, { useState, useMemo } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { AlertTriangle, ChevronRight, CheckSquare, Square, Baby } from '../../../constants/icons';
import { youngChildRiskFactorsList } from '../../../constants/riskFactorData';
import RiskSummary from '../../common/RiskSummary';

const YoungChildRiskAssessmentStep: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { patientData, updatePatientData } = usePatientData();
  const [selectedFactors, setSelectedFactors] = useState<string[]>(patientData.youngChild_riskFactors || []);

  const handleToggleFactor = (factorId: string) => {
    setSelectedFactors(prev =>
      prev.includes(factorId) ? prev.filter(id => id !== factorId) : [...prev, factorId]
    );
  };

  const handleContinue = () => {
    updatePatientData({ youngChild_riskFactors: selectedFactors });
    navigateTo('YOUNG_CHILD_TREATMENT_PLAN_STEP');
  };

  const riskScore = useMemo(() => {
    return selectedFactors.reduce((score, factorId) => {
      const factor = youngChildRiskFactorsList.find(f => f.id === factorId);
      return score + (factor ? factor.weight : 0);
    }, 0);
  }, [selectedFactors]);

  return (
    <Card title="Assess Risk Factors for Exacerbations (Child ≤5 years)" icon={<Baby className="text-violet-600" />}>
      <p className="mb-6 text-sm text-slate-600 leading-relaxed">
        Identify any modifiable risk factors for future wheezing episodes or exacerbations (based on GINA 2025, Box 11-1). This is a critical step for all children, regardless of symptom frequency.
      </p>
      
      <div className="space-y-2">
        {youngChildRiskFactorsList.map((factor) => {
          const isSelected = selectedFactors.includes(factor.id);
          return (
            <div
              key={factor.id}
              onClick={() => handleToggleFactor(factor.id)}
              role="checkbox"
              aria-checked={isSelected}
              className={`flex items-start p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                isSelected 
                ? 'bg-violet-50 border-violet-400' 
                : 'bg-white border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="mt-0.5 mr-3">
                {isSelected ? (
                    <CheckSquare size={20} className="text-violet-600 flex-shrink-0" />
                ) : (
                    <Square size={20} className="text-slate-400 flex-shrink-0" />
                )}
               </div>
              <span className={`flex-grow text-sm ${isSelected ? 'font-semibold text-slate-800' : 'text-slate-700'}`}>
                {factor.label}
              </span>
            </div>
          );
        })}
      </div>

      <RiskSummary score={riskScore} selectedFactors={selectedFactors} />

      <div className="mt-8">
        <Button onClick={handleContinue} fullWidth size="xl" rightIcon={<ChevronRight />} variant="violet">
          Continue to Treatment Plan
        </Button>
      </div>
    </Card>
  );
};

export default YoungChildRiskAssessmentStep;