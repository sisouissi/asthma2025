import React from 'react';
import AssessmentCard from './AssessmentCard';
import Button from '../../ui/Button';
import { useNavigation } from '../../../contexts/NavigationContext';
import { BarChart3, ChevronRight } from 'lucide-react';

const Stage9_MonitorResponse: React.FC = () => {
  const { navigateTo } = useNavigation();
  return (
    <AssessmentCard title="Monitor & Manage Severe Asthma Treatment" icon={<BarChart3 />}>
        
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-md mb-6">
            <h3 className="font-semibold text-green-800 text-lg mb-2">If good response to Type 2-targeted therapy</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-green-700 pl-4">
                <li>Re-evaluate the patient every 3-6 months.</li>
                <li>First, consider decreasing/stopping OCS (and check for adrenal insufficiency) then consider stopping other add-on asthma medications.</li>
                <li>Order of reduction of treatments based on observed benefit, potential side-effects, cost and patient preference.</li>
                <li>Then, if asthma well-controlled for 3-6 months, consider reducing maintenance ICS-LABA dose, but do not stop maintenance ICS-LABA.</li>
                <li>For most patients, biologic therapy should be continued.</li>
            </ul>
        </div>
        
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md">
            <h3 className="font-semibold text-red-800 text-lg mb-2">If no good response to Type 2-targeted therapy</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-red-700 pl-4">
                <li>Stop the biologic therapy.</li>
                <li>Review the basics: differential diagnosis, inhaler technique, adherence, comorbidities, side-effects, emotional support.</li>
                <li>Consider high resolution chest CT (if not done).</li>
                <li>
                    Reassess phenotype and treatment options
                    <ul className="list-circle list-inside pl-5 mt-1">
                        <li>Induced sputum (if available).</li>
                        <li>Consider add-on low dose azithromycin.</li>
                        <li>Consider bronchoscopy for alternative/additional diagnoses.</li>
                        <li>As last resort, consider add-on low dose OCS, but implement strategies to minimize side-effects.</li>
                        <li>Consider bronchial thermoplasty (+ registry).</li>
                    </ul>
                </li>
                 <li>Stop ineffective add-on therapies.</li>
                <li>Do not stop ICS.</li>
            </ul>
        </div>
        
        <p className="text-xs text-slate-500 text-center mt-6">
            Reference: GINA 2025 Report, Box 8-5, p. 145
        </p>

        <div className="mt-6 border-t border-slate-200 pt-5 text-center">
            <Button 
                onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_10')}
                variant="primary"
                size="lg"
                rightIcon={<ChevronRight />}
            >
                Next Stage: Ongoing Care
            </Button>
        </div>

    </AssessmentCard>
  );
};

export default Stage9_MonitorResponse;