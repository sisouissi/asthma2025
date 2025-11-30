
import React from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { usePatientRecords } from '../../../contexts/PatientRecordsContext';
import { useNavigation } from '../../../contexts/NavigationContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { FileText, ArrowLeft, RotateCcw, Edit3, Printer } from '../../../constants/icons';
import ClinicalProfileSummary from '../../common/ClinicalProfileSummary';
import { StepId } from '../../../types';

const ConsultationSummaryStep: React.FC = () => {
    const { patientData } = usePatientData();
    const { getPatient } = usePatientRecords();
    const { navigateTo } = useNavigation();

    const patientProfile = patientData.activePatientId ? getPatient(patientData.activePatientId) : undefined;

    const handleEdit = () => {
        const { ageGroup, consultationType, severeAsthma } = patientData;
        
        // 1. Check if this is a Severe Asthma consultation
        // If status is anything other than 'screening' (default) or 'rejected', it's an active severe asthma case.
        const isSevereAsthma = severeAsthma?.status && 
                               severeAsthma.status !== 'screening' && 
                               severeAsthma.status !== 'rejected_severe';

        if (isSevereAsthma) {
            // Navigate to the entry point of the Severe Asthma Manager.
            // The PatientSevereAsthmaManager component will handle internal routing (e.g. to Stage 4 or 9) automatically.
            navigateTo('SEVERE_ASTHMA_STAGE_1');
            return;
        }

        // 2. Standard GINA Consultation Logic
        let targetStep: StepId | null = null;

        if (consultationType === 'initial') {
            if (ageGroup === 'adult') targetStep = 'ADULT_DIAGNOSIS_STEP';
            else if (ageGroup === 'child') targetStep = 'CHILD_DIAGNOSIS_STEP';
            else if (ageGroup === 'youngChild') targetStep = 'YOUNG_CHILD_DIAGNOSIS_STEP';
        } else {
            // Follow-up
            if (ageGroup === 'adult') targetStep = 'ADULT_CONTROL_ASSESSMENT_STEP';
            else if (ageGroup === 'child') targetStep = 'CHILD_CONTROL_ASSESSMENT_STEP';
            else if (ageGroup === 'youngChild') targetStep = 'YOUNG_CHILD_CONTROL_ASSESSMENT_STEP';
        }

        if (targetStep) {
            // Navigate without resetting data, preserving the activeConsultationId
            navigateTo(targetStep);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Card 
            title={`Consultation Summary (${patientData.consultationType === 'initial' ? 'Initial' : 'Follow-up'})`} 
            icon={<FileText className="text-indigo-600" />}
        >
            <ClinicalProfileSummary patientData={patientData} patientProfile={patientProfile} />
            
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-4 no-print">
                <Button 
                    onClick={() => navigateTo('PATIENT_DASHBOARD')} 
                    variant="secondary" 
                    leftIcon={<ArrowLeft />}
                >
                    Back to Dashboard
                </Button>
                
                <div className="flex gap-3 flex-wrap justify-end">
                    <Button
                        onClick={handlePrint}
                        variant="teal"
                        leftIcon={<Printer size={18} />}
                    >
                        Print Summary
                    </Button>
                    <Button
                        onClick={handleEdit}
                        variant="warning"
                        leftIcon={<Edit3 size={18} />}
                    >
                        Edit Consultation
                    </Button>
                    <Button
                        onClick={() => navigateTo('PATIENT_DASHBOARD')} 
                        variant="primary" 
                        leftIcon={<RotateCcw />}
                    >
                        Start New Consultation
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ConsultationSummaryStep;
