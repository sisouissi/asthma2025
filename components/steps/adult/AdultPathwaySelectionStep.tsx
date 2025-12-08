
import React from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { usePatientData } from '../../../contexts/PatientDataContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { AdultPathway } from '../../../types';
import { ListChecks, ChevronRight, HelpCircle, Route, AlertTriangle } from 'lucide-react';

const AdultPathwaySelectionStep: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { patientData } = usePatientData();

  const startingAtHigherStep = patientData.adult_currentGinaStep && patientData.adult_currentGinaStep >= 3;

  const handlePathwaySelection = (pathway: AdultPathway) => {
    navigateTo('ADULT_TREATMENT_PLAN_STEP', { adult_pathway: pathway });
  };

  return (
    <Card title="Select Therapeutic Pathway (Adults & Adolescents)" icon={<Route className="text-indigo-600" />}>
      
      {startingAtHigherStep && (
         <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-md">
            <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0"/>
                <div>
                    <h3 className="font-semibold text-amber-800">High Symptom Burden Detected</h3>
                    <p className="text-sm text-amber-700 mt-1">
                        The patient is starting at Step {patientData.adult_currentGinaStep}. <strong>Pathway 1 (MART) is strongly preferred</strong> as it provides both maintenance and reliever therapy in one inhaler, reducing the risk of severe exacerbations.
                    </p>
                </div>
            </div>
        </div>
      )}
      
      <p className="mb-6 text-sm text-slate-600 leading-relaxed">
        GINA offers two pathways for asthma management. The choice depends on shared decision-making, medication availability, and patient-specific factors.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pathway 1 */}
        <div className="flex flex-col p-5 bg-white border-2 border-indigo-500 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
          <h3 className="text-xl font-bold text-indigo-700 mb-2">Pathway 1 (Preferred)</h3>
          <p className="text-xs text-indigo-600 mb-3 font-medium uppercase tracking-wider">ICS-Formoterol Reliever</p>
          
          <ul className="text-sm space-y-2 mb-4 text-slate-600 flex-grow list-disc list-inside pl-2">
            <li>Reliever is low-dose ICS-formoterol.</li>
            <li>Reduces risk of severe exacerbations.</li>
            <li>Simplifies treatment (single inhaler for relief, and for maintenance in MART at Steps 3-5).</li>
          </ul>
          <Button 
            onClick={() => handlePathwaySelection('pathway1')} 
            fullWidth 
            variant="primary"
            rightIcon={<ChevronRight />}
            aria-label="Select Pathway 1"
            className="mt-auto"
          >
            Choose Pathway 1
          </Button>
        </div>

        {/* Pathway 2 */}
        <div className="flex flex-col p-5 bg-white border-2 border-slate-300 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
          <h3 className="text-xl font-bold text-slate-700 mb-2">Pathway 2 (Alternative)</h3>
          <p className="text-xs text-slate-600 mb-3 font-medium uppercase tracking-wider">SABA Reliever</p>

          <ul className="text-sm space-y-2 mb-4 text-slate-600 flex-grow list-disc list-inside pl-2">
             <li>Reliever is a Short-Acting Beta2-Agonist (SABA).</li>
             <li>Requires a separate daily controller medication (ICS or ICS-LABA) from Step 2 onwards.</li>
             <li>Adherence to the daily controller is crucial to reduce exacerbation risk.</li>
          </ul>
          <Button 
            onClick={() => handlePathwaySelection('pathway2')} 
            fullWidth
            variant="secondary"
            rightIcon={<ChevronRight />}
            aria-label="Select Pathway 2"
            className="mt-auto"
          >
            Choose Pathway 2
          </Button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-slate-100 border border-slate-200 rounded-lg text-sm">
        <div className="flex items-start">
          <HelpCircle size={20} className="mr-3 mt-0.5 flex-shrink-0 text-slate-500" />
          <div>
            <p className="font-semibold text-slate-700">Considerations for Pathway 2:</p>
            <p className="mt-1 text-slate-600">
             This pathway is an alternative if Pathway 1 is not possible or not preferred by the patient. It may also be appropriate for patients who are already stable on a separate ICS controller and SABA reliever, with good adherence and no exacerbations in the past year.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AdultPathwaySelectionStep;