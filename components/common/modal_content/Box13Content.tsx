
import React from 'react';
import { Users, Baby, AlertTriangle, PersonStanding } from '../../../constants/icons';

const AgeGroupSection: React.FC<{ title: string; icon: React.ReactElement; children: React.ReactNode }> = ({ title, icon, children }) => {
    let clonedIcon = null;
    if (icon) {
        const iconProps: { size: number; className: string } = {
            size: 22,
            className: 'mr-3'
        };
        const existingClassName = (icon.props as any).className;
        if (existingClassName) {
            iconProps.className += ' ' + existingClassName;
        }
        clonedIcon = React.cloneElement(icon as React.ReactElement<any>, iconProps);
    }

    return (
        <div className="mb-6">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center text-lg border-b border-slate-200 pb-2">
                {clonedIcon}
                {title}
            </h3>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
};


const DiagnosisRow: React.FC<{ symptoms: string; condition: string }> = ({ symptoms, condition }) => (
    <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center">
        <div className="md:w-1/2 text-sm text-slate-600 mb-2 md:mb-0 md:pr-4">{symptoms}</div>
        <div className="md:w-1/2 text-sm font-semibold text-sky-700 md:border-l md:border-slate-200 md:pl-4">{condition}</div>
    </div>
);

const KeyPoints: React.FC<{ points: string[] }> = ({ points }) => (
    <div className="mt-6 p-4 bg-sky-50 border-l-4 border-sky-400 rounded-r-lg">
        <h4 className="font-semibold text-sky-800 mb-2 flex items-center">
            <AlertTriangle size={18} className="mr-2" />
            Key Points
        </h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-sky-700">
            {points.map(point => <li key={point}>{point}</li>)}
        </ul>
    </div>
);

const Box13Content: React.FC = () => {
    const allAgesData = [
        { symptoms: 'Chronic cough without dyspnea or triggers', condition: 'Upper airway cough syndrome, GERD' },
        { symptoms: 'Symptoms only with upper respiratory infections', condition: 'Viral infection' },
        { symptoms: 'Hoarse voice, stridor, difficulty swallowing', condition: 'Vocal cord dysfunction, laryngeal obstruction' },
        { symptoms: 'Significant dyspnea without wheezing', condition: 'Vocal cord dysfunction' },
        { symptoms: 'Symptoms only with intense exercise', condition: 'Exercise-induced bronchoconstriction' },
        { symptoms: 'Isolated reduced peak expiratory flow', condition: 'Upper airway obstruction' },
    ];

    const childrenData = [
        { symptoms: 'Symptoms from birth, failure to thrive', condition: 'Cystic fibrosis, bronchopulmonary dysplasia' },
        { symptoms: 'Recurrent infections, growth retardation', condition: 'Immunodeficiency, ciliary dyskinesia' },
        { symptoms: 'Sudden onset with cough, localized wheezing', condition: 'Inhaled foreign body' },
        { symptoms: 'Vomiting, feeding difficulties', condition: 'Vascular ring, tracheoesophageal fistula' },
    ];

    const adultsData = [
        { symptoms: 'Heavy smoking, progressive exertional dyspnea', condition: 'COPD' },
        { symptoms: 'Acute dyspnea, chest pain, risk factors', condition: 'Pulmonary embolism' },
        { symptoms: 'Orthopneic dyspnea, peripheral edema', condition: 'Heart failure' },
        { symptoms: 'Occupational/environmental exposure', condition: 'Hypersensitivity pneumonitis, pneumoconiosis' },
        { symptoms: 'Progressive dry cough, exertional dyspnea', condition: 'Idiopathic pulmonary fibrosis' },
    ];

    const elderlyData = [
        { symptoms: 'Dyspnea with pleural effusion', condition: 'Lung cancer' },
        { symptoms: 'Asthma-COPD overlap syndrome', condition: 'ACO (Asthma-COPD Overlap)' },
        { symptoms: 'Medications (ACE inhibitors, beta-blockers, NSAIDs)', condition: 'Drug-induced cough or bronchospasm' },
    ];

    const keyPointsData = [
        'Actively search for these differential diagnoses if the clinical presentation is atypical.',
        'Coexistence of multiple conditions is possible (e.g., asthma + GERD).',
        'Inadequate response to anti-asthmatic treatment should prompt reconsideration of the diagnosis.',
        'Additional investigations may be necessary depending on the clinical context.',
    ];

    return (
        <div className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">
                Consider alternative diagnoses, especially if symptoms are atypical, response to treatment is poor, or clinical suspicion points elsewhere. The differential varies by age group and presentation.
            </p>

            <AgeGroupSection title="All Ages" icon={<Users className="text-slate-600" />}>
                {allAgesData.map(item => <DiagnosisRow key={item.symptoms} {...item} />)}
            </AgeGroupSection>

            <AgeGroupSection title="Children" icon={<Baby className="text-violet-600" />}>
                {childrenData.map(item => <DiagnosisRow key={item.symptoms} {...item} />)}
            </AgeGroupSection>

            <AgeGroupSection title="Adults" icon={<Users className="text-sky-600" />}>
                {adultsData.map(item => <DiagnosisRow key={item.symptoms} {...item} />)}
            </AgeGroupSection>

             <AgeGroupSection title="Elderly" icon={<PersonStanding className="text-teal-600" />}>
                {elderlyData.map(item => <DiagnosisRow key={item.symptoms} {...item} />)}
            </AgeGroupSection>

            <KeyPoints points={keyPointsData} />
        </div>
    );
};

export default Box13Content;