

import React, { ReactNode } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useUIState } from '../../contexts/UIStateContext';
import { usePatientData } from '../../contexts/PatientDataContext';
import { usePatientRecords } from '../../contexts/PatientRecordsContext';
import Button from '../ui/Button'; 
import { ArrowLeft, RotateCcw, Info, BookOpen, MessageCircle, ShieldCheck, Stethoscope, ClipboardList, ShieldAlert, Users, Leaf, Home, Lightbulb, User, Save, CheckCircle2 } from '../../constants/icons';
import NonPharmacologicalStrategyContent from '../common/modal_content/NonPharmacologicalStrategyContent';
import ClinicalPhenotypesContent from '../common/modal_content/ClinicalPhenotypesContent';

const Header: React.FC = () => {
  const { currentStepId, navigateTo, resetNavigation } = useNavigation();

  return (
    <header className="bg-white text-slate-800 shadow-sm no-print border-b border-slate-200">
      <div className="container mx-auto max-w-7xl p-4 flex items-center gap-4">
        <div className="flex items-center flex-1 min-w-0">
            <Lightbulb className="w-10 h-10 mr-4 text-indigo-600 flex-shrink-0" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 truncate">Asthma : A Tool for using the GINA approach</h1>
        </div>
        <div className="flex items-center flex-shrink-0 space-x-3">
           {currentStepId !== 'PATIENT_DASHBOARD' && (
             <Button
                onClick={() => navigateTo('PATIENT_DASHBOARD')}
                leftIcon={<User size={18} />}
                aria-label="Patient Access"
                variant="primary"
                className="bg-indigo-700 hover:bg-indigo-800"
              >
                Patient Access
              </Button>
           )}
          <Button
            onClick={resetNavigation}
            leftIcon={<Home size={18} />}
            aria-label="Go to Home"
            variant="secondary"
          >
            Home
          </Button>
          {currentStepId !== 'ABBREVIATIONS_STEP' && (
            <Button
              onClick={() => navigateTo('ABBREVIATIONS_STEP')}
              leftIcon={<BookOpen size={18} />}
              aria-label="View abbreviations"
              variant="yellow"
            >
              Abbreviations
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => {
  const { history, goBack, resetNavigation, currentStepId, navigateTo } = useNavigation();
  const { openGoalsModal, openManagementPanel, openDiagnosisPanel, openSevereAsthmaPanel, openInfoModal } = useUIState();
  const { patientData } = usePatientData();
  const { saveConsultation, getPatient } = usePatientRecords();

  const handleGoBack = () => {
    if (currentStepId === 'ABBREVIATIONS_STEP') {
      const prevHistory = [...history];
      prevHistory.pop(); 
      if(prevHistory.length > 0) {
         goBack(); 
      } else {
        resetNavigation();
      }
    } else {
      goBack();
    }
  };

  const handleSaveAndExit = () => {
    if (patientData.activePatientId) {
        saveConsultation(patientData.activePatientId, patientData);
        navigateTo('PATIENT_DASHBOARD');
    }
  };

  const currentPatient = patientData.activePatientId ? getPatient(patientData.activePatientId) : null;


  return (
    <footer className="py-8 no-print">
      <div className="container mx-auto max-w-7xl px-4">
        
        {/* Active Patient Indicator */}
        {currentPatient && currentStepId !== 'PATIENT_DASHBOARD' && currentStepId !== 'CONSULTATION_SUMMARY_STEP' && (
            <div className="mb-4 bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex justify-between items-center">
                <div className="flex items-center text-indigo-800">
                    <User size={20} className="mr-2"/>
                    <span className="font-semibold">Consultation for: {currentPatient.lastName.toUpperCase()}, {currentPatient.firstName}</span>
                </div>
                <Button 
                    onClick={handleSaveAndExit} 
                    size="sm" 
                    variant="success" 
                    leftIcon={<Save size={16}/>}
                >
                    Save & Exit
                </Button>
            </div>
        )}

        <div className="flex justify-between items-center mb-8">
          {history.length > 1 ? (
            <Button
              onClick={handleGoBack}
              variant="secondary"
              leftIcon={<ArrowLeft size={18} />}
              aria-label="Go to previous step"
            >
              Back
            </Button>
          ) : (
            <div></div> // Placeholder if no back possible
          )}
          <div className="flex items-center space-x-3">
            {currentStepId !== 'INITIAL_STEP' && (
               <Button
                  onClick={() => resetNavigation()}
                  variant="secondary"
                  leftIcon={<RotateCcw size={18} />}
                  aria-label="Restart guide"
                >
                  Restart
              </Button>
            )}
             {currentStepId === 'INITIAL_STEP' && (
                <div className="flex flex-wrap gap-3 justify-end">
                  <Button
                      onClick={openSevereAsthmaPanel}
                      variant="danger"
                      leftIcon={<ShieldAlert size={18} />}
                      aria-label="View Severe Asthma Guide"
                  >
                      Severe Asthma
                  </Button>
                   <Button
                      onClick={openManagementPanel}
                      variant="primary"
                      leftIcon={<ClipboardList size={18} />}
                      aria-label="Start Management Guide"
                  >
                      Management
                  </Button>
                  <Button
                      onClick={openDiagnosisPanel}
                      variant="info"
                      leftIcon={<Stethoscope size={18} />}
                      aria-label="View GINA Initial Diagnosis Guide"
                  >
                      Diagnosis
                  </Button>
                   <Button
                      onClick={() => openInfoModal("Asthma Phenotypes", <ClinicalPhenotypesContent />)}
                      variant="teal"
                      leftIcon={<Users size={18} />}
                      aria-label="View Asthma Phenotypes"
                  >
                      Phenotypes
                  </Button>
                   <Button
                      onClick={openGoalsModal}
                      variant="success"
                      leftIcon={<ShieldCheck size={18} />}
                      aria-label="View GINA Goals of Management"
                  >
                      Goals
                  </Button>
                </div>
            )}
            {currentStepId !== 'INITIAL_STEP' && (
                 <Button
                    onClick={openGoalsModal}
                    variant="success"
                    leftIcon={<ShieldCheck size={18} />}
                    aria-label="View GINA Goals of Management"
                >
                    Goals
                </Button>
            )}
          </div>
        </div>

        <div className="bg-slate-100 border border-slate-200 p-4 rounded-lg text-slate-700 text-sm">
          <div className="flex items-start">
            <Info size={20} className="mr-3 mt-0.5 flex-shrink-0 text-slate-500" />
            <div>
              <p className="font-semibold text-slate-800">IMPORTANT DISCLAIMER</p>
              <p className="leading-relaxed">
                This tool is a decision aid based on GINA recommendations. It does NOT replace professional
                clinical judgment. All treatment decisions must be individualized by a healthcare professional.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-600 mt-6">
          © Application developed by Dr. Zouhair Souissi
        </p>
      </div>
    </footer>
  );
};

export const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { openAIPanel } = useUIState();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto max-w-7xl p-4 sm:p-6 md:p-8">
        {children}
      </main>
      <Footer />
      <div className="fixed bottom-6 right-6 z-30 no-print">
        <Button
            onClick={openAIPanel}
            variant="primary"
            className="rounded-full w-16 h-16 shadow-xl hover:shadow-2xl focus:shadow-xl flex items-center justify-center animate-pulse-shadow"
            aria-label="Ask the Expert"
        >
            <MessageCircle size={28} />
        </Button>
      </div>
    </div>
  );
};