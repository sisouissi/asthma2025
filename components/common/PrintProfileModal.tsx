

import React from 'react';
import { useUIState } from '../../contexts/UIStateContext';
import { usePatientData } from '../../contexts/PatientDataContext';
import Button from '../ui/Button';
import { XCircle, Printer } from '../../constants/icons';
import ClinicalProfileSummary from './ClinicalProfileSummary';

const PrintProfileModal: React.FC = () => {
    const { isPrintProfileModalOpen, closePrintProfileModal } = useUIState();
    const { patientData } = usePatientData();

    if (!isPrintProfileModalOpen) {
        return null;
    }
    
    const handlePrint = () => {
        const printContent = document.getElementById('print-profile-content')?.innerHTML;
        
        if (printContent) {
            const printWindow = window.open('', '_blank', 'height=800,width=800');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Clinical Profile Report</title>
                            <script src="https://cdn.tailwindcss.com"></script>
                            <style>
                                body { 
                                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; 
                                    padding: 1rem; 
                                }
                                @media print {
                                    body {
                                        -webkit-print-color-adjust: exact;
                                        print-color-adjust: exact;
                                    }
                                }
                            </style>
                        </head>
                        <body>
                            <h1 class="text-2xl font-bold mb-4 border-b pb-2">Asthma Clinical Profile Report</h1>
                            ${printContent}
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.onload = () => { // Ensure styles are loaded
                    printWindow.focus();
                    printWindow.print();
                    printWindow.close();
                };
            }
        }
    };

    return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={closePrintProfileModal}
          aria-modal="true"
          role="dialog"
        >
            <div 
                className="w-full max-w-2xl bg-slate-50 shadow-2xl rounded-lg z-50 flex flex-col transform transition-all duration-300 max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 bg-white text-slate-800 rounded-t-lg border-b border-slate-200 no-print">
                    <div className="flex items-center">
                        <Printer className="text-teal-500 mr-3" size={24} />
                        <h2 className="text-lg font-semibold">Clinical Profile Report</h2>
                    </div>
                    <Button variant="ghost" onClick={closePrintProfileModal} size="sm" className="!p-2 text-slate-500 hover:text-slate-800" aria-label="Close modal">
                        <XCircle size={20} />
                    </Button>
                </header>

                <main className="overflow-y-auto">
                    <div id="print-profile-content">
                        {patientData.ageGroup ? (
                            <ClinicalProfileSummary patientData={patientData} />
                        ) : (
                            <p className="text-center text-slate-500 p-8">Please select an age group to generate a profile.</p>
                        )}
                    </div>
                </main>
                
                <footer className="p-4 bg-slate-100 rounded-b-lg text-right sticky bottom-0 border-t border-slate-200 no-print">
                    <div className="flex justify-between">
                         <Button onClick={closePrintProfileModal} variant="secondary">
                            Close
                        </Button>
                        <Button onClick={handlePrint} variant="success" leftIcon={<Printer />}>
                            Print Report
                        </Button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PrintProfileModal;
