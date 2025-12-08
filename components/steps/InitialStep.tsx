import React from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useUIState } from '../../contexts/UIStateContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Users, User, Baby, FileText, Link, BookOpen, Leaf, Activity, ShieldCheck } from '../../constants/icons';
import { StepId, AgeGroup } from '../../types';
import DiagnosisPanel from '../common/DiagnosisPanel';
import SevereAsthmaPanel from '../common/SevereAsthmaPanel';
import NonPharmacologicalStrategyContent from '../common/modal_content/NonPharmacologicalStrategyContent';

const AgeSelectionPanel: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { openInfoModal } = useUIState();

  const handleAgeSelection = (
    ageGroup: AgeGroup,
    age: string,
    nextStep: StepId
  ) => {
    navigateTo(nextStep, { ageGroup, age });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Management Options (Simulation):</h3>
      <p className="text-sm text-slate-600 mb-4">Select an age group to explore the GINA guidelines step-by-step.</p>
      <div className="space-y-3">
        <Button
          onClick={() => handleAgeSelection('adult', '12+ years', 'ADULT_DIAGNOSIS_STEP')}
          leftIcon={<Users />}
          variant="primary" // Sky blue
          fullWidth
          aria-label="Adults & Adolescents, 12 years and older"
        >
          Adults & Adolescents <span className="font-normal opacity-80 ml-1">(12+ years)</span>
        </Button>

        <Button
          onClick={() => handleAgeSelection('child', '6-11 years', 'CHILD_DIAGNOSIS_STEP')}
          leftIcon={<User />} // Using User for child 6-11
          variant="success" // Emerald green
          fullWidth
          aria-label="Children, 6 to 11 years"
        >
          Children <span className="font-normal opacity-80 ml-1">(6-11 years)</span>
        </Button>

        <Button
          onClick={() => handleAgeSelection('youngChild', '<=5 years', 'YOUNG_CHILD_DIAGNOSIS_STEP')}
          leftIcon={<Baby />}
          variant="violet"
          fullWidth
          aria-label="Young Children, 5 years and under"
        >
          Young Children <span className="font-normal opacity-80 ml-1">{'<=5 years'}</span>
        </Button>
      </div>
      <div className="mt-6 pt-5 border-t border-slate-200">
        <Button
          onClick={() => openInfoModal("Non-Pharmacological Strategies", <NonPharmacologicalStrategyContent />)}
          leftIcon={<Leaf />}
          variant="lime"
          fullWidth
          aria-label="View Non-Pharmacological Strategies"
        >
          Non-Pharmacological Strategies
        </Button>
      </div>
    </div>
  );
};

export const InitialStep: React.FC = () => {
  const { activePanel } = useUIState();

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
      {/* Sidebar for panels - conditional */}
      {activePanel && (
        <div className="w-full lg:w-1/3 lg:max-w-sm xl:max-w-md bg-white p-6 rounded-xl shadow-lg border border-slate-200 order-1 lg:order-none animate-fade-in">
          {activePanel === 'management' && <AgeSelectionPanel />}
          {activePanel === 'diagnosis' && <DiagnosisPanel />}
          {activePanel === 'severeAsthma' && <SevereAsthmaPanel />}
        </div>
      )}

      {/* Main content area */}
      <div className={`w-full ${activePanel ? 'lg:w-2/3 order-none lg:order-1' : ''}`}>

        <Card
          icon={<FileText className="text-[#004b85]" />}
          title="Asthma : A Tool for using the GINA approach"
          titleClassName="text-3xl"
        >
          <div className="text-slate-700 leading-relaxed space-y-4 text-justify">
            <p>
              GINA is an annually updated, comprehensive, evidence-based reference guide for the diagnosis and management of asthma. This interactive tool provides a quick method for clinicians to use the GINA information to help decide if someone has asthma and a quickly decide on appropriate management and follow up. However, clinicians should refer to the{' '}
              <a
                href="https://ginasthma.org/2025-gina-summary-guide/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#004b85] hover:text-[#003865] underline font-medium inline-flex items-center"
              >
                GINA Summary
                <Link size={12} className="ml-1" />
              </a>
              {' '}and if more detail is needed then refer to the{' '}
              <a
                href="https://ginasthma.org/2025-gina-strategy-report/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#004b85] hover:text-[#003865] underline font-medium inline-flex items-center"
              >
                GINA Strategy documents
                <Link size={12} className="ml-1" />
              </a>.
            </p>

            <div className="p-4 bg-[#004b85]/5 rounded-lg border border-[#004b85]/10 mt-4">
              <p className="font-semibold text-[#004b85] mb-2">This tool is designed for healthcare professionals and offers a dual pathway:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-[#003865] ml-1">
                <li><strong>Training & Simulation Mode:</strong> Freely explore diagnostic and treatment algorithms (Adult, Child, Severe Asthma) without saving data.</li>
                <li><strong>Patient Follow-up Mode (Clinical):</strong> Locally create patient records, record consultations, track progress (ACT/ACQ), and manage complex severe asthma cases with a complete history.</li>
              </ol>
            </div>
          </div>
        </Card>

        {!activePanel && (
          <div className="mt-6 space-y-6">
            <Card
              title="What is Asthma? (GINA 2025 Definition)"
              icon={<BookOpen className="text-[#004b85]" />}
              titleClassName="text-3xl"
            >
              <div className="text-slate-700 leading-relaxed text-justify">
                <p>
                  Asthma is a heterogeneous disease, usually characterized by chronic airway inflammation. It is defined by the history of respiratory symptoms such as wheeze, shortness of breath, chest tightness and cough that vary over time and in intensity, together with variable expiratory airflow limitation.
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};