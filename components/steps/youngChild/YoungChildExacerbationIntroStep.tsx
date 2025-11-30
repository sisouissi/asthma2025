
import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useNavigation } from '../../../contexts/NavigationContext';
import { AlertTriangle, ChevronRight, BookOpen, Baby, Zap } from 'lucide-react';

const YoungChildExacerbationIntroStep: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <Card title="Managing Wheezing Episodes (Young Child ≤5 years)" icon={<Zap className="text-red-600"/>}>
      <p className="text-base text-slate-700 leading-relaxed mb-4">
        Wheezing episodes or asthma exacerbations in young children can be distressing and require prompt action.
      </p>
      <p className="mb-6 text-sm text-slate-600">
        This section will guide you in assessing severity and appropriate management steps based on GINA recommendations.
      </p>
      
      <div className="mb-6 p-4 bg-violet-50 border border-violet-200 rounded-lg"> {/* Violet theme */}
        <div className="flex items-start">
          <Baby size={20} className="mr-3 mt-1 text-violet-500 flex-shrink-0" />
          <div>
            <h3 className="text-md font-semibold text-violet-800">Key Principles for Young Children:</h3>
            <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1">
              <li>Always use a pMDI with a dedicated valved holding chamber and facemask.</li>
              <li>Early recognition by parents/carers and prompt treatment are crucial.</li>
              <li>Parents should have a clear written action plan.</li>
              <li>Assess severity (general appearance, alertness, respiratory rate, signs of distress, ability to feed/talk).</li>
              <li>SaO2 monitoring is useful if available.</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="mb-6 text-center font-medium text-slate-700">
        Let's start by determining the severity of the current wheezing episode.
      </p>

      <div className="text-center">
        <Button 
          onClick={() => navigateTo('YOUNG_CHILD_EXACERBATION_SEVERITY_STEP')} 
          variant="danger" 
          size="xl"
          leftIcon={<AlertTriangle />}
          rightIcon={<ChevronRight />}
          aria-label="Assess Episode Severity"
        >
          Assess Severity
        </Button>
      </div>
    </Card>
  );
};

export default YoungChildExacerbationIntroStep;