
import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useNavigation } from '../../../contexts/NavigationContext';
import { AlertTriangle, ChevronRight, BookOpen, Zap } from 'lucide-react';

const AdultExacerbationIntroStep: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <Card title="Managing Asthma Exacerbations (Adults)" icon={<Zap className="text-red-600"/>}>
      <p className="text-base text-slate-700 leading-relaxed mb-4">
        An asthma exacerbation (attack) is an acute or sub-acute worsening of symptoms and lung function from the patient's usual status.
      </p>
      <p className="mb-6 text-sm text-slate-600">
        Prompt recognition and management are essential to prevent severe outcomes.
        This section will guide you through assessing severity and appropriate actions based on GINA recommendations.
      </p>
      
      <div className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-lg">
        <div className="flex items-start">
          <BookOpen size={20} className="mr-3 mt-1 text-sky-500 flex-shrink-0" />
          <div>
            <h3 className="text-md font-semibold text-sky-800">Key Management Principles:</h3>
            <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1">
              <li>Quickly assess exacerbation severity.</li>
              <li>Promptly initiate appropriate reliever treatment.</li>
              <li>For moderate to severe exacerbations, systemic corticosteroids are usually required.</li>
              <li>Identify and address trigger factors if possible.</li>
              <li>Provide or update a written asthma action plan.</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="mb-6 text-center font-medium text-slate-700">
        Let's start by determining the severity of the current exacerbation.
      </p>

      <div className="text-center">
        <Button 
          onClick={() => navigateTo('ADULT_EXACERBATION_SEVERITY_STEP')} 
          variant="danger" 
          size="xl"
          leftIcon={<AlertTriangle />}
          rightIcon={<ChevronRight />}
          aria-label="Assess Exacerbation Severity"
        >
          Assess Severity
        </Button>
      </div>
    </Card>
  );
};

export default AdultExacerbationIntroStep;