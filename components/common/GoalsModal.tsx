import React from 'react';
import { useUIState } from '../../contexts/UIStateContext';
import Button from '../ui/Button';
import { ShieldCheck, XCircle, CheckCircle2, AlertTriangle } from '../../constants/icons';

const goals = {
    longTerm: [
        "To prevent exacerbations and asthma-related death.",
        "To preserve lung function for as long as possible.",
        "To prevent adverse effects from medications."
    ],
    shortTerm: [
        "To achieve good control of asthma symptoms.",
        "To maintain normal activity levels.",
    ]
};

const GoalsModal: React.FC = () => {
  const { isGoalsModalOpen, closeGoalsModal } = useUIState();

  if (!isGoalsModalOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={closeGoalsModal}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="w-full max-w-2xl bg-slate-50 shadow-2xl rounded-lg z-50 flex flex-col transform transition-all duration-300 max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 bg-white text-slate-800 rounded-t-lg border-b border-slate-200">
          <div className="flex items-center">
            <ShieldCheck className="text-emerald-500 mr-3" size={24} />
            <h2 className="text-lg font-semibold">GINA Goals of Asthma Management</h2>
          </div>
          <Button variant="ghost" onClick={closeGoalsModal} size="sm" className="!p-2 text-slate-500 hover:text-slate-800" aria-label="Close modal">
            <XCircle size={20} />
          </Button>
        </header>

        <main className="p-6 space-y-5 overflow-y-auto">
          <p className="text-sm text-slate-600">
            The long-term goals of asthma management are to achieve both good symptom control and to minimize the risk of future adverse outcomes.
          </p>

          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
              <CheckCircle2 size={20} className="mr-2 text-emerald-600" />
              Symptom Control
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
              {goals.shortTerm.map((goal, index) => <li key={`short-${index}`}>{goal}</li>)}
            </ul>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
              <AlertTriangle size={20} className="mr-2 text-amber-600" />
              Risk Reduction
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
              {goals.longTerm.map((goal, index) => <li key={`long-${index}`}>{goal}</li>)}
            </ul>
          </div>
          <p className="text-xs text-slate-500 text-center">Reference: GINA 2025 Report, Box 2-1</p>
        </main>

        <footer className="p-4 bg-slate-100 rounded-b-lg text-right border-t border-slate-200">
          <Button onClick={closeGoalsModal} variant="secondary">
            Close
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default GoalsModal;