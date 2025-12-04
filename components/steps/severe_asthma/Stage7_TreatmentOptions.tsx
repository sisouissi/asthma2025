import React, { useMemo, useCallback } from 'react';
import { usePatientData } from '../../../contexts/PatientDataContext';
import { useNavigation } from '../../../contexts/NavigationContext';
import AssessmentCard from './AssessmentCard';
import Button from '../../ui/Button';
import { Droplets, TestTubeDiagonal, ShieldCheck, TrendingUp, HelpCircle, ChevronRight, ArrowRight, CheckCircle2 } from '../../../constants/icons';
import { getBiologicRecommendation } from '../../../constants/severeAsthmaData';

const RecommendationItem: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
        <h4 className="font-semibold text-slate-700">{title}</h4>
        <div className="text-sm text-slate-600 mt-1">{children}</div>
    </div>
);

const RecommendationCard: React.FC<{ rec: any, rank: number, onSelect: (drug: string) => void, isSelected: boolean }> = ({ rec, rank, onSelect, isSelected }) => {
    const colors = {
        0: { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-800', bar: 'bg-emerald-500' },
        1: { border: 'border-sky-500', bg: 'bg-sky-50', text: 'text-sky-800', bar: 'bg-sky-500' },
        2: { border: 'border-slate-400', bg: 'bg-slate-50', text: 'text-slate-800', bar: 'bg-slate-500' },
    };
    const medals = ['🥇', '🥈', '🥉'];
    const style = colors[rank as keyof typeof colors] || colors[2];
    
    const containerClass = isSelected 
        ? `border-4 ${style.border.replace('border', 'border-indigo')} bg-white shadow-xl transform scale-105 z-10` 
        : `border-2 ${style.border} ${style.bg} shadow-md hover:shadow-lg`;

    return (
        <div className={`rounded-xl p-4 transition-all duration-200 relative ${containerClass}`}>
            {isSelected && (
                <div className="absolute -top-3 -right-3 bg-indigo-600 text-white rounded-full p-1 shadow-md">
                    <CheckCircle2 size={24} />
                </div>
            )}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h4 className={`font-bold text-xl ${style.text}`}>{medals[rank]} {rec.drug}</h4>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${rec.strength.includes('Strongly') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{rec.strength}</span>
                </div>
                <div className="text-right"><div className={`text-3xl font-bold ${style.text}`}>{rec.score}</div><div className="text-xs text-slate-500">Score/100</div></div>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
                <p><strong>Clinical Rationale:</strong> {rec.reason}</p>
                <p><strong>Eligibility:</strong> {rec.eligibility}</p>
            </div>
            <div className="mt-3"><div className="w-full bg-slate-200 rounded-full h-2.5"><div className={`h-2.5 rounded-full transition-all duration-300 ${style.bar}`} style={{ width: `${rec.score}%` }}></div></div></div>
            
            <div className="mt-4 pt-3 border-t border-slate-200/50">
                <Button 
                    onClick={() => onSelect(rec.drug)} 
                    variant={isSelected ? "primary" : "secondary"} 
                    fullWidth 
                    size="sm"
                >
                    {isSelected ? "Selected for Trial" : "Select this Therapy"}
                </Button>
            </div>
        </div>
    );
};

const Stage7_TreatmentOptions: React.FC = () => {
    const { patientData, updatePatientData } = usePatientData();
    const { navigateTo } = useNavigation();
    const { type2Inflammation, eligibleForBiologics } = patientData.severeAsthmaAssessment;
    const { biologicsAvailable } = patientData.severeAsthma.medications;
    const { selectedBiologic } = patientData.severeAsthma;
    const recommendations = useMemo(() => getBiologicRecommendation(patientData), [patientData]);

     const handleBiologicsAvailableChange = useCallback((value: 'yes' | 'no') => {
        const updates = {
            ...patientData,
            severeAsthma: {
                ...patientData.severeAsthma,
                medications: {
                    ...patientData.severeAsthma.medications,
                    biologicsAvailable: value,
                }
            }
        };
        updatePatientData(updates);
    }, [patientData, updatePatientData]);

    const handleSelectBiologic = (drugName: string) => {
        updatePatientData({
            severeAsthma: {
                ...patientData.severeAsthma,
                selectedBiologic: drugName
            }
        });
    };


    const renderType2HighContent = () => (
        <>
            <AssessmentCard title="Phenotype: Type 2-High Severe Asthma" icon={<Droplets className="text-teal-600" />}>
                {eligibleForBiologics && recommendations && recommendations.length > 0 ? (
                     <div className="space-y-4">
                        <p className="text-sm text-slate-600">Based on the patient's data, the following biologic therapies are recommended. Select one to proceed with a prescription.</p>
                        {recommendations.slice(0, 3).map((rec, index) => (
                            <RecommendationCard 
                                key={index} 
                                rec={rec} 
                                rank={index} 
                                onSelect={handleSelectBiologic}
                                isSelected={selectedBiologic === rec.drug}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                        <h4 className="font-semibold text-amber-800 mb-2 text-md">Biologic Therapy Not Indicated</h4>
                        <p className="text-sm text-amber-700">
                            Although Type 2 inflammation is present, the patient does not currently meet the full GINA criteria for severe asthma requiring biologic therapy.
                        </p>
                    </div>
                )}
            </AssessmentCard>

            {eligibleForBiologics && (
                 <AssessmentCard title="Biologic Therapy Availability" icon={<HelpCircle className="text-sky-600"/>}>
                    <p className="text-sm text-center text-slate-700 mb-3">Is Add-on Type 2 biologic therapy available / affordable for this patient?</p>
                    <div className="flex justify-center gap-4">
                        <Button 
                            onClick={() => handleBiologicsAvailableChange('yes')} 
                            variant={biologicsAvailable === 'yes' ? 'success' : 'secondary'}
                            aria-pressed={biologicsAvailable === 'yes'}
                        >Yes</Button>
                        <Button 
                            onClick={() => handleBiologicsAvailableChange('no')}
                            variant={biologicsAvailable === 'no' ? 'warning' : 'secondary'}
                             aria-pressed={biologicsAvailable === 'no'}
                        >No</Button>
                    </div>
                 </AssessmentCard>
            )}
            
            {biologicsAvailable === 'yes' && eligibleForBiologics && (
                <div className="mt-4 text-center p-4 bg-slate-50 border rounded-lg">
                    <p className="text-sm text-slate-600 mb-3">
                        {selectedBiologic ? `Selected: ${selectedBiologic}` : "Please select a biologic therapy from the list above."}
                    </p>
                    <Button 
                        onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_8')} 
                        size="lg" 
                        rightIcon={<ChevronRight/>}
                        disabled={!selectedBiologic}
                    >
                        Proceed to Prescription (Stage 8)
                    </Button>
                </div>
            )}
            
            {biologicsAvailable === 'no' && eligibleForBiologics && (
                <AssessmentCard title="Alternative Treatment (Biologics Not Available)" icon={<TrendingUp className="text-amber-600"/>}>
                    <p className="text-sm text-slate-600 mb-3">According to GINA (p.152, Section 7.3), if Type 2-targeted biologic therapy is not available/affordable, consider the following options:</p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                        <li>Consider higher dose ICS-LABA.</li>
                        <li>Consider other add-on therapy (LAMA, LTRA, low-dose azithromycin).</li>
                        <li>As last resort, consider add-on low-dose OCS (monitor side-effects).</li>
                    </ul>
                    <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4 border-t border-slate-200 pt-4">
                        <Button onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_3')} variant="secondary" leftIcon={<ArrowRight className="transform -rotate-180"/>}>Return to Optimization</Button>
                        <Button onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_10')} variant="primary" rightIcon={<ArrowRight/>}>Proceed to Ongoing Care (Stage 10)</Button>
                    </div>
                </AssessmentCard>
            )}
        </>
    );

    const renderLowType2Content = () => (
        <>
            <AssessmentCard title="Phenotype: Severe Asthma with Low Type 2 Biomarkers" icon={<TestTubeDiagonal className="text-slate-600" />}>
                <div className="space-y-4">
                     <RecommendationItem title="Review the Basics">
                         <div className="flex items-center">
                            <ShieldCheck size={16} className="text-sky-600 mr-2 flex-shrink-0" />
                            <span>Re-confirm the diagnosis, inhaler technique, adherence, and management of comorbidities.</span>
                        </div>
                    </RecommendationItem>
                     <RecommendationItem title="Consider Trial of Add-on Treatments">
                         <ul className="list-disc list-inside space-y-1">
                            <li><strong>LAMA:</strong> Add-on tiotropium.</li>
                            <li><strong>Low-dose Azithromycin:</strong> Screen for contraindications (QTc, mycobacteria).</li>
                            <li><strong>Tezepelumab (Anti-TSLP):</strong> Effective across phenotypes.</li>
                        </ul>
                    </RecommendationItem>
                </div>
            </AssessmentCard>
            <div className="mt-4 text-center p-4 bg-slate-50 border rounded-lg">
                <Button onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_10')} size="lg" rightIcon={<ChevronRight/>}>Proceed to Ongoing Care (Stage 10)</Button>
            </div>
        </>
    );
    
    return (
        <div>
            {type2Inflammation ? renderType2HighContent() : renderLowType2Content()}
        </div>
    );
};

export default Stage7_TreatmentOptions;