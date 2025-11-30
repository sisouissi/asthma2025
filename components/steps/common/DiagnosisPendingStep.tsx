
import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useNavigation } from '../../../contexts/NavigationContext';
import { HelpCircle, ArrowLeft, AlertTriangle } from 'lucide-react';

const DiagnosisPendingStep: React.FC = () => {
  const { goBack } = useNavigation();

  return (
    <Card 
      title="Diagnostic Confirmation Needed" 
      icon={<AlertTriangle className="text-amber-500" />}
      className="border-amber-300 bg-amber-50"
    >
      <p className="text-slate-700 leading-relaxed mb-4">
        The diagnosis of asthma must be confirmed before proceeding with this management guide.
        A thorough clinical assessment is required.
      </p>
      <div className="mb-6 p-4 bg-white border border-slate-200 rounded-md">
        <h3 className="font-semibold text-slate-800 mb-2">Key Diagnostic Criteria for Asthma (GINA):</h3>
        <ul className="list-disc list-inside mb-2 pl-4 space-y-1 text-slate-600 text-sm">
          <li>History of variable respiratory symptoms (wheeze, shortness of breath, chest tightness, cough).</li>
          <li>Confirmation of excessive variability in lung function (e.g., spirometry with bronchodilator reversibility, PEF variability).</li>
        </ul>
        <p className="text-xs text-slate-500">
          Please refer to GINA Boxes 1-1 and 1-2 for detailed diagnostic criteria and procedures.
          It is important to consider alternative diagnoses if symptoms are atypical or do not respond to asthma treatment.
        </p>
      </div>
      
      <div className="text-center">
        <Button onClick={goBack} variant="secondary" leftIcon={<ArrowLeft />} size="lg">
          Back
        </Button>
      </div>
    </Card>
  );
};

export default DiagnosisPendingStep;