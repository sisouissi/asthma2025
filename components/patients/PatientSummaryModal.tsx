
import React, { useState, useEffect } from 'react';
import { PatientProfile, AIReport } from '../../types';
import MarkdownRenderer from '../ui/MarkdownRenderer';
import { Printer, Save, X, RefreshCw, Sparkles, FileText } from 'lucide-react';
import { usePatientRecords } from '../../contexts/PatientRecordsContext';
import { generateClinicalSummary } from '../../services/aiService';

interface PatientSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient: PatientProfile;
}

const PatientSummaryModal: React.FC<PatientSummaryModalProps> = ({ isOpen, onClose, patient }) => {
    const { updatePatient } = usePatientRecords();
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (isOpen && patient) {
            generateSummary();
        }
    }, [isOpen, patient.id]);

    const generateSummary = async () => {
        setIsLoading(true);
        setError(null);
        setIsSaved(false);
        setSummary('');

        try {
            await generateClinicalSummary(patient, (chunk) => {
                setSummary(prev => prev + chunk);
            });
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred while generating the summary.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        if (!summary) return;

        const newReport: AIReport = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            content: summary
        };

        const currentSummaries = patient.aiSummaries || [];
        updatePatient(patient.id, {
            aiSummaries: [newReport, ...currentSummaries]
        });
        setIsSaved(true);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Patient Summary - ${patient.lastName} ${patient.firstName}</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; line-height: 1.6; color: #333; }
                        h1 { border-bottom: 2px solid #333; padding-bottom: 10px; }
                        h2, h3 { color: #2c3e50; margin-top: 20px; }
                        ul { padding-left: 20px; }
                        strong { color: #000; }
                    </style>
                </head>
                <body>
                    <h1>Clinical Evaluation Summary (GINA 2025)</h1>
                    <p><strong>Patient:</strong> ${patient.lastName.toUpperCase()}, ${patient.firstName}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <hr/>
                    <div id="content"></div>
                    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
                    <script>
                        document.getElementById('content').innerHTML = marked.parse(${JSON.stringify(summary)});
                        window.onload = function() { window.print(); }
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative z-[10000]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-indigo-50 rounded-t-xl">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-indigo-600" />
                        <h2 className="text-lg font-bold text-slate-800">AI Clinical Summary</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading && !summary && (
                        <div className="flex flex-col items-center justify-center h-full py-10 space-y-4">
                            <Sparkles className="animate-pulse text-indigo-400" size={48} />
                            <p className="text-slate-500 font-medium">Analyzing patient data & generating summary...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-center">
                            <p className="font-bold mb-2">Generation failed.</p>
                            <p className="text-sm mb-4">{error}</p>
                            <button
                                type="button"
                                onClick={generateSummary}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                            >
                                <RefreshCw size={14} />
                                Retry
                            </button>
                        </div>
                    )}

                    {summary && (
                        <div className="prose prose-slate max-w-none ai-summary-content">
                            <style dangerouslySetInnerHTML={{
                                __html: `
                                .ai-summary-content ol {
                                    list-style: none;
                                    counter-reset: item;
                                    padding-left: 0;
                                }
                                .ai-summary-content ol > li {
                                    counter-increment: item;
                                    margin-bottom: 1.5rem;
                                    padding-left: 2.5rem;
                                    position: relative;
                                }
                                .ai-summary-content ol > li::before {
                                    content: counter(item) ".";
                                    position: absolute;
                                    left: 0;
                                    font-weight: 700;
                                    font-size: 1.1rem;
                                    color: #4f46e5;
                                }
                                .ai-summary-content ol > li > strong:first-child,
                                .ai-summary-content ol > li > b:first-child {
                                    display: block;
                                    font-size: 1.05rem;
                                    color: #1e293b;
                                    margin-bottom: 0.5rem;
                                }
                                .ai-summary-content ul {
                                    margin-top: 0.75rem;
                                    margin-bottom: 0.75rem;
                                }
                                .ai-summary-content h1, .ai-summary-content h2 {
                                    color: #4f46e5;
                                    margin-top: 1.5rem;
                                    margin-bottom: 1rem;
                                }
                                .ai-summary-content p {
                                    margin-bottom: 0.75rem;
                                }
                            ` }} />
                            <MarkdownRenderer content={summary} />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50 rounded-b-xl">
                    <div className="text-xs text-slate-500 italic text-center sm:text-left">
                        Generated by AI (Gemini Flash). Verify all details before clinical use.
                    </div>
                    <div className="flex gap-3 flex-wrap justify-center sm:justify-end">
                        {summary && !isLoading && (
                            <>
                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                                >
                                    <Printer size={18} />
                                    Print
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSaved}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isSaved
                                        ? 'bg-slate-200 text-slate-600 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                        }`}
                                >
                                    {isSaved ? <FileText size={18} /> : <Save size={18} />}
                                    {isSaved ? "Saved to Record" : "Save Summary"}
                                </button>
                            </>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientSummaryModal;
