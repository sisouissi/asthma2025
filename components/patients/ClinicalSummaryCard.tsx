import React from 'react';
import { Sparkles, Activity, Zap, AlertCircle, ChevronRight, Pill, GitBranch, AlertTriangle, User } from 'lucide-react';
import { PatientProfile } from '../../types';
import Button from '../ui/Button';

interface ClinicalSummaryCardProps {
    patient: PatientProfile;
    annualExacerbations: number;
    isDifficultToTreat?: boolean;
    onGenerate: (patient: PatientProfile, e: React.MouseEvent) => void;
}

const ClinicalSummaryCard: React.FC<ClinicalSummaryCardProps> = ({ patient, annualExacerbations, isDifficultToTreat, onGenerate }) => {
    // Get latest consultation for clinical metrics (Ensure sorted by date desc)
    const latestConsultation = React.useMemo(() => {
        if (!patient.consultations || patient.consultations.length === 0) return null;
        return [...patient.consultations].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
    }, [patient.consultations]);

    const latestData = latestConsultation?.data;

    // Helper to get GINA Step
    const getGinaStep = () => {
        if (!latestData) return 'N/A';
        if (latestData.ageGroup === 'adult') return `Step ${latestData.adult_currentGinaStep || '?'}`;
        if (latestData.ageGroup === 'child') return `Step ${latestData.child_currentGinaStep || '?'}`;
        return 'N/A';
    };

    // Helper to get Control Level
    const getControlLevel = () => {
        if (!latestData) return 'N/A';
        const level = latestData.ageGroup === 'adult'
            ? latestData.adult_controlLevel
            : latestData.ageGroup === 'child'
                ? latestData.child_controlLevel
                : latestData.youngChild_controlLevel;

        if (level === 'wellControlled') return 'Well Controlled';
        if (level === 'partlyControlled') return 'Partly Controlled';
        if (level === 'uncontrolled') return 'Uncontrolled';
        return 'N/A';
    };

    // Helper to get Pathway
    const getPathway = () => {
        if (!latestData) return 'N/A';
        if (latestData.ageGroup === 'adult' && latestData.adult_pathway) {
            return latestData.adult_pathway === 'pathway1' ? 'Pathway 1' : 'Pathway 2';
        }
        if (latestData.ageGroup === 'child' && latestData.child_pathway) {
            return latestData.child_pathway === 'track1' ? 'Track 1' : 'Track 2';
        }
        return 'N/A';
    };

    // Helper to get Phenotype
    const getPhenotype = () => {
        return latestData?.phenotypeData?.identifiedPhenotype || 'Not Assessed';
    };

    // Helper to get Risk Factors
    const getRiskFactors = () => {
        if (!latestData) return [];
        if (latestData.ageGroup === 'adult') return latestData.adult_riskFactors || [];
        if (latestData.ageGroup === 'child') return latestData.child_riskFactors || [];
        return latestData.youngChild_riskFactors || [];
    };

    // Helper to get Control Color
    const getControlColor = () => {
        if (!latestData) return 'text-slate-500';
        const level = latestData.ageGroup === 'adult'
            ? latestData.adult_controlLevel
            : latestData.ageGroup === 'child'
                ? latestData.child_controlLevel
                : latestData.youngChild_controlLevel;

        if (level === 'wellControlled') return 'text-green-600';
        if (level === 'partlyControlled') return 'text-orange-500';
        if (level === 'uncontrolled') return 'text-red-600';
        return 'text-slate-500';
    };

    const riskFactors = getRiskFactors();

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Activity size={18} className="text-indigo-600" />
                    Clinical Status
                </h3>
                {latestConsultation && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        {new Date(latestConsultation.date).toLocaleDateString()}
                    </span>
                )}
            </div>

            {/* Difficult-to-Treat Alert */}
            {isDifficultToTreat && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                    <AlertTriangle size={16} className="text-red-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-red-700">Check for Difficult-to-treat asthma</p>
                    </div>
                </div>
            )}

            {latestConsultation ? (
                <div className="space-y-4">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* GINA Step */}
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 mb-1">GINA Step</p>
                            <p className="font-bold text-slate-800">{getGinaStep()}</p>
                        </div>

                        {/* Exacerbations */}
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 mb-1">Exacerbations</p>
                            <p className={`font-bold ${annualExacerbations > 0 ? 'text-orange-600' : 'text-slate-800'}`}>
                                {annualExacerbations} / yr
                            </p>
                        </div>

                        {/* Control Level */}
                        <div className="col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 mb-1">Control Level</p>
                            <div className="flex items-center gap-2">
                                <Zap size={14} className={getControlColor()} />
                                <p className={`font-bold ${getControlColor()}`}>{getControlLevel()}</p>
                            </div>
                        </div>

                        {/* Pathway */}
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                                <GitBranch size={10} /> Pathway
                            </p>
                            <p className="font-semibold text-sm text-slate-800">{getPathway()}</p>
                        </div>

                        {/* Phenotype */}
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                                <User size={10} /> Phenotype
                            </p>
                            <p className="font-semibold text-sm text-slate-800 truncate" title={getPhenotype()}>
                                {getPhenotype()}
                            </p>
                        </div>
                    </div>

                    {/* Risk Factors Section */}
                    {riskFactors.length > 0 && (
                        <div className="border-t border-slate-100 pt-3">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <AlertTriangle size={12} />
                                Identified Risk Factors
                            </h4>
                            <div className="flex flex-wrap gap-1">
                                {riskFactors.map((rf, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                        {rf}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Prescription Section */}
                    <div className="border-t border-slate-100 pt-3">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Pill size={12} />
                            Last Prescription
                        </h4>
                        {latestData?.currentPrescription && latestData.currentPrescription.length > 0 ? (
                            <ul className="space-y-2">
                                {latestData.currentPrescription.map((item) => (
                                    <li key={item.id} className="text-sm bg-slate-50 p-2 rounded border border-slate-100">
                                        <div className="font-medium text-slate-800">{item.medicationName}</div>
                                        <div className="text-xs text-slate-500">{item.instructions}</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-slate-400 italic">No active prescription recorded.</p>
                        )}
                    </div>

                    <Button
                        onClick={(e) => onGenerate(patient, e)}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-100"
                    >
                        <Sparkles size={14} className="mr-2" />
                        View Full AI Analysis
                    </Button>
                </div>
            ) : (
                <div className="text-center py-6 text-slate-400">
                    <AlertCircle className="mx-auto mb-2 opacity-50" size={24} />
                    <p className="text-sm">No consultation data available.</p>
                </div>
            )}
        </div>
    );
};

export default ClinicalSummaryCard;
