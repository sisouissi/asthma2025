import React, { useState, useMemo } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { AlertTriangle, ChevronRight, CheckSquare, Square } from '../../../constants/icons';
import { childRiskFactorsList } from '../../../constants/riskFactorData';
import RiskSummary from '../../common/RiskSummary';

const ChildRiskAssessmentStep: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { patientData, updatePatientData } = usePatientData();
  const [selectedFactors, setSelectedFactors] = useState<string[]>(patientData.child_riskFactors || []);

  const handleToggleFactor = (factorId: string) => {
    setSelectedFactors(prev =>
      prev.includes(factorId) ? prev.filter(id => id !== factorId) : [...prev, factorId]
    );
  };

  const handleContinue = () => {
    updatePatientData({ child_riskFactors: selectedFactors });
    // Navigate to Phenotype Assessment
    navigateTo('PHENOTYPE_ASSESSMENT_STEP');
  };

  const riskScore = useMemo(() => {
    return selectedFactors.reduce((score, factorId) => {
      const factor = childRiskFactorsList.find(f => f.id === factorId);
      return score + (factor ? factor.weight : 0);
    }, 0);
  }, [selectedFactors]);

  return (
    <Card title="Assess Risk Factors for Exacerbations (Children 6-11)" icon={<AlertTriangle className="text-amber-600" />}>
      <p className="mb-6 text-sm text-slate-600 leading-relaxed">
        Identify any modifiable risk factors for future exacerbations, which is essential for comprehensive asthma management in children (GINA Box 2-2B and 2-3).
      </p>
      
      <div className="space-y-2">
        {childRiskFactorsList.map((factor) => {
          const isSelected = selectedFactors.includes(factor.id);
          return (
            <div
              key={factor.id}
              onClick={() => handleToggleFactor(factor.id)}
              role="checkbox"
              aria-checked={isSelected}
              className={`flex items-start p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                isSelected 
                ? 'bg-emerald-50 border-emerald-400' 
                : 'bg-white border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="mt-0.5 mr-3">
                {isSelected ? (
                    <CheckSquare size={20} className="text-emerald-600 flex-shrink-0" />
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
        <Button onClick={handleContinue} fullWidth size="xl" rightIcon={<ChevronRight />} variant="success">
          Continue to Phenotype Assessment
        </Button>
      </div>
    </Card>
  );
};

export default ChildRiskAssessmentStep;