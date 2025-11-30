
import React from 'react';
import { Users, Stethoscope, TestTubeDiagonal, Activity, ShieldAlert, ClipboardList } from 'lucide-react';

const ClinicalPhenotypesContent: React.FC = () => {

    return (
  <div className="space-y-6">
            <div className="text-sm text-slate-600 leading-relaxed">
                <p className="mb-4">
                    Clinical asthma phenotypes are recognizable clusters of demographic, clinical, and/or pathophysiological characteristics that are often used in clinical practice (GINA 2025, Table 1-2 & Box 3-6).
                </p>
            </div>

            <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <div className="flex items-start">
                        <Users className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="font-semibold text-blue-800 mb-2">Allergic Asthma</h3>
                            <p className="text-sm text-blue-700 leading-relaxed">
                                This is the most easily recognized asthma phenotype, which often commences in childhood and is associated with a past and/or family history of allergic disease such as eczema, allergic rhinitis, or food or drug allergy. Examination of the sputum of these patients before treatment often reveals eosinophilic airway inflammation.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                    <div className="flex items-start">
                        <Stethoscope className="text-orange-600 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="font-semibold text-orange-800 mb-2">Non-allergic Asthma</h3>
                            <p className="text-sm text-orange-700 leading-relaxed">
                                Some adults have asthma that is not associated with allergy. The sputum of these patients may be eosinophilic, neutrophilic, or contain only a few inflammatory cells (paucigranulocytic). Patients with non-allergic asthma often respond less well to inhaled corticosteroids.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg">
                    <div className="flex items-start">
                        <ClipboardList className="text-teal-600 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="font-semibold text-teal-800 mb-2">Cough Variant Asthma</h3>
                            <p className="text-sm text-teal-700 leading-relaxed">
                                Cough is the only respiratory symptom. It is associated with airway eosinophilia and airway hyperresponsiveness. It often responds well to ICS.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                    <div className="flex items-start">
                        <Activity className="text-purple-600 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="font-semibold text-purple-800 mb-2">Late-onset Asthma</h3>
                            <p className="text-sm text-purple-700 leading-relaxed">
                                Some adults, particularly women, present with asthma for the first time in adult life. These patients tend to be non-allergic, and often require higher doses of ICS or are relatively refractory to corticosteroid treatment.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <div className="flex items-start">
                        <TestTubeDiagonal className="text-green-600 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="font-semibold text-green-800 mb-2">Asthma with Fixed Airflow Limitation</h3>
                            <p className="text-sm text-green-700 leading-relaxed">
                                Some patients with long-standing asthma develop fixed airflow limitation that is thought to be due to airway remodeling. These patients have reduced reversibility to bronchodilator despite treatment with oral corticosteroids.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex items-start">
                        <ShieldAlert className="text-red-600 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="font-semibold text-red-800 mb-2">Asthma with Obesity</h3>
                            <p className="text-sm text-red-700 leading-relaxed">
                                Some obese patients with asthma have prominent respiratory symptoms and little eosinophilic airway inflammation. These patients often have comorbidities and may show less symptomatic improvement with standard asthma medications.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2 text-sm">Clinical Utility</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                    These phenotypes may be useful for predicting likely treatment responses and outcomes, but their clinical utility is still being evaluated. The presence of multiple phenotypic features in individual patients is common.
                </p>
            </div>
        </div>
    );
};

export default ClinicalPhenotypesContent;
