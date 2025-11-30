
import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useNavigation } from '../../../contexts/NavigationContext';
import { AlertTriangle, ChevronRight, BookOpen, Zap, Activity } from 'lucide-react';

const ChildExacerbationIntroStep: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <Card title="Managing Exacerbations (Child 6-11 years)" icon={<Zap className="text-red-600"/>}>
      <p className="text-base text-slate-700 leading-relaxed mb-4">
        Asthma exacerbations in children require prompt and appropriate management.
      </p>
      <p className="mb-6 text-sm text-slate-600">
        This section helps assess the severity of an exacerbation and outlines recommended actions based on GINA guidelines.
      </p>
      
      <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
        <div className="flex items-start">
          <BookOpen size={20} className="mr-3 mt-1 text-emerald-500 flex-shrink-0" />
          <div>
            <h3 className="text-md font-semibold text-emerald-800">Key Principles for Children:</h3>
            <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1">
              <li>Use a spacer with the pMDI for reliever medication.</li>
              <li>Early recognition and treatment are vital.</li>
              <li>Parents/carers should have a written asthma action plan.</li>
              <li>Assess severity based on symptoms, ability to talk, respiratory rate, and signs of respiratory distress.</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="mb-6 text-center font-medium text-slate-700">
        Let's determine the severity of the current exacerbation.
      </p>

      <div className="text-center">
        <Button 
          onClick={() => navigateTo('CHILD_EXACERBATION_SEVERITY_STEP')} 
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

export default ChildExacerbationIntroStep;