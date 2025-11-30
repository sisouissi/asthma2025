import React from 'react';
import AssessmentCard from './AssessmentCard';
import Button from '../../ui/Button';
import { useNavigation } from '../../../contexts/NavigationContext';
import { User, FileText } from 'lucide-react';

const Stage10_OngoingCare: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <AssessmentCard title="Ongoing Collaborative Care" icon={<User />}>
      <div className="space-y-4">
        <h4 className="font-semibold text-lg text-slate-800">Long-term Management Goals:</h4>
        <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
          <li>Achieve clinical remission on treatment if possible.</li>
          <li>Minimize OCS exposure and related side effects.</li>
          <li>Optimize quality of life and functional status.</li>
          <li>Address social and emotional needs of the patient.</li>
          <li>Continue collaboration between specialist, primary care, and the patient.</li>
          <li>Consider patient enrollment in registries and/or clinical trials to advance knowledge.</li>
        </ul>
        <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
          <p className="text-sm font-medium text-green-800">
            Remember: Do not completely stop ICS-containing therapy, even with an excellent response to biologic treatment, as this leads to a high risk of relapse.
          </p>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center">
          <Button
            onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_11')}
            variant="success"
            size="lg"
            leftIcon={<FileText />}
          >
            View Final Report
          </Button>
        </div>

      </div>
    </AssessmentCard>
  );
};

export default Stage10_OngoingCare;