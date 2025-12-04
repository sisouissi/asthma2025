
import React from 'react';
import { usePatientData } from '../../contexts/PatientDataContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { useUIState } from '../../contexts/UIStateContext';
import { AgeGroup, ControlLevel } from '../../types';
import Button from '../ui/Button';
import SetReminderModalContent from './modal_content/SetReminderModalContent';
import { ListChecks, Route, Calendar, Bell, XCircle, Info, Zap, Printer } from '../../constants/icons';

interface ManagementCycleWidgetProps {
    ageGroup: AgeGroup;
}

const ManagementCycleWidget: React.FC<ManagementCycleWidgetProps> = ({ ageGroup }) => {
    const { patientData, updatePatientData } = usePatientData();
    const { navigateTo } = useNavigation();
    const { openInfoModal, openPrintProfileModal } = useUIState();

    // Restriction removed to allow simulation in all modes
    
    const controlLevel = patientData[`${ageGroup}_controlLevel` as const] as ControlLevel | null;
    const reminderDate = patientData[`${ageGroup}_reviewReminderDate` as const] as string | null;
    const assessmentStep: Record<AgeGroup, string> = {
        'adult': 'ADULT_CONTROL_ASSESSMENT_STEP',
        'child': 'CHILD_CONTROL_ASSESSMENT_STEP',
        'youngChild': 'YOUNG_CHILD_CONTROL_ASSESSMENT_STEP',
    };
    const exacerbationStep: Record<AgeGroup, string> = {
        'adult': 'ADULT_EXACERBATION_INTRO_STEP',
        'child': 'CHILD_EXACERBATION_INTRO_STEP',
        'youngChild': 'YOUNG_CHILD_EXACERBATION_INTRO_STEP',
    };

    const handleSetReminder = () => {
        openInfoModal("Set Review Reminder", <SetReminderModalContent ageGroup={ageGroup} />);
    };
    
    const handleClearReminder = () => {
        updatePatientData({ [`${ageGroup}_reviewReminderDate`]: null });
    };

    const CycleStep: React.FC<{ icon: React.ReactElement, title: string, active?: boolean }> = ({ icon, title, active }) => (
        <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${active ? 'bg-sky-500 border-sky-600 text-white shadow-lg' : 'bg-slate-200 border-slate-300 text-slate-500'}`}>
                {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
            </div>
            <p className={`mt-2 text-sm font-semibold ${active ? 'text-sky-700' : 'text-slate-600'}`}>{title}</p>
        </div>
    );
    
    return (
        <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">Asthma Management Cycle</h3>
            <div className="flex justify-around items-center mb-6">
                <CycleStep icon={<ListChecks />} title="1. Assess" active={!controlLevel} />
                <div className="flex-1 h-1 bg-slate-300 mx-2"></div>
                <CycleStep icon={<Route />} title="2. Adjust" active={!!controlLevel} />
                <div className="flex-1 h-1 bg-slate-300 mx-2"></div>
                <CycleStep icon={<Calendar />} title="3. Review" active={!!reminderDate} />
            </div>

            <div className="p-4 bg-white rounded-md border border-slate-200 text-center">
                <h4 className="font-medium text-slate-700 mb-3">Next Actions:</h4>
                <div className="flex flex-wrap justify-center gap-3">
                    <Button
                        onClick={() => navigateTo(assessmentStep[ageGroup] as any)}
                        variant="primary"
                        leftIcon={<ListChecks size={18} />}
                        aria-label="Assess Current Asthma Control"
                    >
                        {controlLevel ? "Re-assess Control" : "Assess Current Control"}
                    </Button>

                    {controlLevel === 'wellControlled' && !reminderDate && (
                         <Button onClick={handleSetReminder} variant="success" leftIcon={<Bell size={18} />}>
                            Set Review Reminder
                        </Button>
                    )}
                    
                    <Button 
                        onClick={() => navigateTo(exacerbationStep[ageGroup] as any)} 
                        variant="warning" 
                        leftIcon={<Zap size={18} />}
                        aria-label="View exacerbation plan"
                    >
                        Manage Exacerbation
                    </Button>
                     <Button 
                        onClick={openPrintProfileModal} 
                        variant="teal"
                        leftIcon={<Printer size={18} />}
                        aria-label="Print Clinical Profile"
                    >
                        Print Profile
                    </Button>
                </div>

                 {reminderDate && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center gap-4">
                        <div className="flex items-center text-blue-700">
                           <Calendar size={18} className="mr-2"/>
                           <span className="text-sm font-medium">Next review scheduled for: {new Date(reminderDate).toLocaleDateString()}</span>
                        </div>
                        <Button onClick={handleClearReminder} variant="ghost" size="sm" className="!p-1 text-slate-400 hover:text-red-500">
                            <XCircle size={18}/>
                        </Button>
                    </div>
                 )}
                 {!reminderDate && controlLevel === 'wellControlled' && (
                     <div className="mt-3 p-2 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center justify-center gap-2">
                        <Info size={14}/>
                        Asthma is well-controlled. Consider setting a reminder for a 3-month follow-up.
                    </div>
                 )}
            </div>
        </div>
    );
};

export default ManagementCycleWidget;
