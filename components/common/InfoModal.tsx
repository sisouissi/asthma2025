
import React from 'react';
import { useUIState } from '../../contexts/UIStateContext';
import Button from '../ui/Button';
import { XCircle, Info } from '../../constants/icons';

const InfoModal: React.FC = () => {
  const { isInfoModalOpen, closeInfoModal, infoModalContent } = useUIState();

  if (!isInfoModalOpen || !infoModalContent) {
    return null;
  }

  const { title, content } = infoModalContent;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={closeInfoModal}
      aria-modal="true"
      role="dialog"
    >
        <div 
            className="w-full max-w-3xl bg-slate-50 shadow-2xl rounded-lg z-50 flex flex-col transform transition-all duration-300 max-h-[90vh]"
            onClick={e => e.stopPropagation()}
        >
            <header className="flex items-center justify-between p-4 bg-white text-slate-800 rounded-t-lg border-b border-slate-200 sticky top-0">
                <div className="flex items-center">
                    <Info className="text-cyan-500 mr-3" size={24} />
                    <h2 className="text-lg font-semibold">{title}</h2>
                </div>
                <Button variant="ghost" onClick={closeInfoModal} size="sm" className="!p-2 text-slate-500 hover:text-slate-800" aria-label="Close modal">
                    <XCircle size={20} />
                </Button>
            </header>

            <main className="p-6 space-y-5 overflow-y-auto">
                {content}
            </main>
            
            <footer className="p-4 bg-slate-100 rounded-b-lg text-right sticky bottom-0 border-t border-slate-200">
                <Button onClick={closeInfoModal} variant="secondary">
                    Close
                </Button>
            </footer>
        </div>
    </div>
  );
};

export default InfoModal;