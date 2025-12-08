import React from 'react';
import { Sparkles, FileText, Clock, ChevronRight } from 'lucide-react';
import { PatientProfile } from '../../types';
import Button from '../ui/Button';

interface ClinicalSummaryCardProps {
    patient: PatientProfile;
    onGenerate: (patient: PatientProfile, e: React.MouseEvent) => void;
}

const ClinicalSummaryCard: React.FC<ClinicalSummaryCardProps> = ({ patient, onGenerate }) => {
    const latestSummary = patient.aiSummaries && patient.aiSummaries.length > 0
        ? patient.aiSummaries[0]
        : null;

    // Function to strip markdown and get plain text for preview
    const getPreviewText = (markdown: string) => {
        return markdown
            .replace(/[#*`]/g, '') // Remove basic markdown chars
            .replace(/\n/g, ' ')   // Replace newlines with spaces
            .substring(0, 150) + '...';
    };

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-600" />
                    AI Clinical Summary
                </h3>
                {latestSummary && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(latestSummary.date).toLocaleDateString()}
                    </span>
                )}
            </div>

            {latestSummary ? (
                <div className="space-y-3">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {getPreviewText(latestSummary.content)}
                    </p>
                    <Button
                        onClick={(e) => onGenerate(patient, e)}
                        variant="ghost"
                        size="sm"
                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-0 h-auto font-medium"
                        rightIcon={<ChevronRight size={14} />}
                    >
                        View Full Analysis
                    </Button>
                </div>
            ) : (
                <div className="text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <p className="text-sm text-slate-500 mb-3">No AI summary available yet.</p>
                    <Button
                        onClick={(e) => onGenerate(patient, e)}
                        variant="secondary"
                        size="sm"
                        className="w-full justify-center"
                    >
                        <Sparkles size={14} className="mr-2" />
                        Generate Summary
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ClinicalSummaryCard;
