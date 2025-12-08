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
    <header className="glass-header sticky top-0 z-30 no-print py-6">
      <div className="container mx-auto max-w-7xl px-4 flex items-center justify-between gap-6">
        <div
          className="flex items-center gap-4 cursor-pointer group"
          onClick={resetNavigation}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#004b85] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-[#004b85] to-[#003366] p-3 rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-200">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 group-hover:text-[#004b85] transition-colors font-heading leading-tight">Asthma Guide 2025</h1>
            <p className="text-lg font-medium bg-gradient-to-r from-slate-800 to-blue-900 bg-clip-text text-transparent hidden sm:block">Evidence-based Management & Prevention</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {currentStepId !== 'PATIENT_DASHBOARD' && (
            <Button
              onClick={() => navigateTo('PATIENT_DASHBOARD')}
              leftIcon={<User size={18} />}
              aria-label="Patient Access"
              variant="primary"
              size="md"
              className="hidden sm:inline-flex shadow-lg shadow-teal-500/20 font-semibold"
            >
              Patient Access
            </Button>
          )}
          {/* Mobile Icon Button for Patient Access if needed */}
          {currentStepId !== 'PATIENT_DASHBOARD' && (
            <button
              onClick={() => navigateTo('PATIENT_DASHBOARD')}
              className="sm:hidden p-2.5 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-100 transition-colors"
            >
              <User size={24} />
            </button>
          )}

          <Button
            onClick={resetNavigation}
            leftIcon={<Home size={18} />}
            aria-label="Go to Home"
            variant="ghost"
            size="md"
            className="hidden md:inline-flex font-medium text-slate-600 hover:bg-slate-100"
          >
            Home
          </Button>

          {currentStepId !== 'ABBREVIATIONS_STEP' && (
            <Button
              onClick={() => navigateTo('ABBREVIATIONS_STEP')}
              leftIcon={<BookOpen size={18} />}
              aria-label="View abbreviations"
              variant="ghost"
              size="md"
              className="font-medium text-slate-600 hover:bg-slate-100"
            >
              <span className="hidden lg:inline">Abbr.</span>
              <span className="lg:hidden">Abbr.</span>
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
      if (prevHistory.length > 0) {
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
    <footer className="pb-12 pt-8 no-print mt-auto relative z-10">
      <div className="container mx-auto max-w-7xl px-4 space-y-8">

        {/* Active Patient Bar */}
        {currentPatient && currentStepId !== 'PATIENT_DASHBOARD' && currentStepId !== 'CONSULTATION_SUMMARY_STEP' && (
          <div className="glass-panel rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in border-l-4 border-teal-500">
            <div className="flex items-center text-slate-700">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mr-4 text-white font-bold text-lg shadow-md">
                {currentPatient.firstName[0]}
              </div>
              <div>
                <p className="text-xs text-teal-500 uppercase font-bold tracking-wider mb-0.5">Active Patient</p>
                <p className="font-bold text-slate-900 text-lg">{currentPatient.lastName.toUpperCase()}, {currentPatient.firstName}</p>
              </div>
            </div>
            <Button
              onClick={handleSaveAndExit}
              size="lg"
              variant="success"
              leftIcon={<Save size={20} />}
              className="w-full sm:w-auto font-semibold shadow-emerald-500/20 shadow-lg"
            >
              Save & Exit Consultation
            </Button>
          </div>
        )}

        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          <div className="w-full md:w-auto">
            {history.length > 1 ? (
              <Button
                onClick={handleGoBack}
                variant="white"
                leftIcon={<ArrowLeft size={20} />}
                aria-label="Go to previous step"
                size="lg"
                className="font-medium shadow-sm hover:shadow-md transition-shadow"
              >
                Back
              </Button>
            ) : (
              <span className="text-slate-400 text-sm font-medium pl-2">Start of guide</span>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto p-2 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
            {currentStepId !== 'INITIAL_STEP' && (
              <Button
                onClick={() => resetNavigation()}
                variant="ghost"
                leftIcon={<RotateCcw size={18} />}
                aria-label="Restart guide"
                className="text-slate-500 hover:text-red-600 font-medium hover:bg-white"
                size="md"
              >
                Restart
              </Button>
            )}

            {/* Quick Links Bar */}
            <Button
              onClick={openSevereAsthmaPanel}
              variant="ghost"
              size="md"
              className="text-slate-600 hover:text-red-600 hover:bg-white font-medium"
            >
              Severe Asthma
            </Button>
            <Button
              onClick={openManagementPanel}
              variant="ghost"
              size="md"
              className="text-slate-600 hover:text-teal-600 hover:bg-white font-medium"
            >
              Management
            </Button>
            <Button
              onClick={openDiagnosisPanel}
              variant="ghost"
              size="md"
              className="text-slate-600 hover:text-sky-600 hover:bg-white font-medium"
            >
              Diagnosis
            </Button>
            <Button
              onClick={() => openInfoModal("Asthma Phenotypes", <ClinicalPhenotypesContent />)}
              variant="ghost"
              size="md"
              className="text-slate-600 hover:text-teal-600 hover:bg-white font-medium"
            >
              Phenotypes
            </Button>
            <Button
              onClick={openGoalsModal}
              variant="ghost"
              size="md"
              className="text-slate-600 hover:text-emerald-600 hover:bg-white font-medium"
            >
              Goals
            </Button>
          </div>
        </div>

        <div className="border-t border-slate-200/60 pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-xs text-slate-500">
            <Info size={18} className="text-slate-400 flex-shrink-0" />
            <p className="leading-relaxed max-w-4xl">
              <strong>Disclaimer:</strong> This application is a clinical decision support tool based on the Global Initiative for Asthma (GINA) 2025 strategy.
              It is intended for use by healthcare professionals. It does not replace professional clinical judgment.
            </p>
            <div className="ml-auto text-slate-400 whitespace-nowrap font-medium opacity-60">
              © Dr. Zouhair Souissi
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { openAIPanel } = useUIState();
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 flex-grow relative z-10">
        {children}
      </main>
      <Footer />

      {/* Floating AI Button */}
      <div className="fixed bottom-6 right-6 z-40 no-print animate-float">
        <button
          onClick={openAIPanel}
          className="group relative w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full shadow-2xl hover:shadow-teal-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center ring-4 ring-white/30"
          aria-label="Ask the Expert"
        >
          <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          <MessageCircle size={32} className="text-white" />
          <span className="absolute 0 top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500 border-2 border-white"></span>
          </span>
        </button>
      </div>
    </div>
  );
};