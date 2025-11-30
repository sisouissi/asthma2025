
import React from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ChildPathway } from '../../../types';
import { ChevronRight, HelpCircle, Route, Zap, Activity } from 'lucide-react';

const ChildPathwaySelectionStep: React.FC = () => {
  const { navigateTo } = useNavigation();

  const handlePathwaySelection = (pathway: ChildPathway) => {
    navigateTo('CHILD_TREATMENT_PLAN_STEP', { child_pathway: pathway });
  };

  return (
    <Card title="Select Therapeutic Pathway (Children 6-11 years)" icon={<Route className="text-emerald-600" />}>
      <p className="mb-6 text-sm text-slate-600 leading-relaxed">
        GINA 2025 recommendations for children aged 6-11 years include a choice between two main approaches, primarily differing by the reliever medication used.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Track 1 */}
        <div className="flex flex-col p-5 bg-white border-2 border-teal-500 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
          <h3 className="text-xl font-bold text-teal-700 mb-2">Track 1 (MART)</h3>
          <p className="text-xs text-teal-600 mb-3 font-medium uppercase tracking-wider">ICS-Formoterol Reliever Based</p>
          
          <ul className="text-sm space-y-2 mb-4 text-slate-600 flex-grow list-disc list-inside pl-2">
            <li>Reliever is low-dose ICS-formoterol.</li>
            <li>Introduced at Step 3 as Maintenance And Reliever Therapy (MART).</li>
            <li>Studies show a large reduction in exacerbations with this strategy.</li>
          </ul>
          <Button 
            onClick={() => handlePathwaySelection('track1')} 
            fullWidth 
            variant="teal" 
            rightIcon={<ChevronRight />}
            aria-label="Select Track 1 (MART)"
            className="mt-auto"
          >
            Choose Track 1 (MART)
          </Button>
        </div>

        {/* Track 2 */}
        <div className="flex flex-col p-5 bg-white border-2 border-emerald-500 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
          <h3 className="text-xl font-bold text-emerald-700 mb-2">Track 2 (Classic)</h3>
          <p className="text-xs text-emerald-600 mb-3 font-medium uppercase tracking-wider">SABA Reliever Based</p>

          <ul className="text-sm space-y-2 mb-4 text-slate-600 flex-grow list-disc list-inside pl-2">
            <li>Reliever is a Short-Acting Beta2-Agonist (SABA).</li>
            <li>Requires a separate daily controller medication (ICS or ICS-LABA).</li>
            <li>Adherence to the daily controller is critical to reduce exacerbation risk.</li>
          </ul>
          <Button 
            onClick={() => handlePathwaySelection('track2')} 
            fullWidth
            variant="success" 
            rightIcon={<ChevronRight />}
            aria-label="Select Track 2 (Classic)"
            className="mt-auto"
          >
            Choose Track 2 (Classic)
          </Button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-slate-100 border border-slate-200 rounded-lg text-sm">
        <div className="flex items-start">
          <HelpCircle size={20} className="mr-3 mt-0.5 flex-shrink-0 text-slate-500" />
          <div>
            <p className="font-semibold text-slate-700">Important Considerations (Children 6-11 years):</p>
            <ul className="list-disc list-inside mt-1 text-slate-600 space-y-1">
              <li>Track 1 (MART) is a preferred option from Step 3, simplifying treatment to a single inhaler and reducing exacerbations.</li>
              <li>Track 2 is the standard approach for Steps 1 & 2 and remains a valid option for all steps, especially if MART is not available or preferred.</li>
              <li>Ensure the child and parents fully understand the chosen strategy and inhaler technique (always with a spacer).</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChildPathwaySelectionStep;