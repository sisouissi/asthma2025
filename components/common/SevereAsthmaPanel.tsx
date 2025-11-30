
import React from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useUIState } from '../../contexts/UIStateContext';
import Button from '../ui/Button';
import { Route, FlaskConical, TestTubeDiagonal, Beaker, Biohazard, Syringe } from 'lucide-react';
import NonT2TreatmentContent from './modal_content/NonT2TreatmentContent';
import NonBiologicT2TreatmentContent from './modal_content/NonBiologicT2TreatmentContent';
import BiologicTherapiesGuideContent from './modal_content/BiologicTherapiesGuideContent';


const SevereAsthmaPanel: React.FC = () => {
    const { navigateTo } = useNavigation();
    const { openInfoModal } = useUIState();

    return (
        <div>
            <h2 className="text-lg font-semibold mb-5 text-slate-700">Severe Asthma Options:</h2>
            <div className="space-y-3">
                <Button
                    onClick={() => navigateTo('SEVERE_ASTHMA_STAGE_1')}
                    leftIcon={<Route />}
                    variant="primary"
                    fullWidth
                    justify="start"
                    aria-label="Launch the Severe Asthma Pathway"
                >
                    Severe Asthma Pathway
                </Button>
                <Button
                    onClick={() => openInfoModal("Biologic Therapies Guide", <BiologicTherapiesGuideContent />)}
                    leftIcon={<Syringe />}
                    variant="secondary"
                    fullWidth
                    justify="start"
                    aria-label="View the Biologic Therapies Guide"
                >
                    Biologic Therapies Guide
                </Button>
                <Button
                    onClick={() => openInfoModal("Other Treatments (Non-Type 2)", <NonT2TreatmentContent />)}
                    leftIcon={<TestTubeDiagonal />}
                    variant="secondary"
                    fullWidth
                    justify="start"
                    aria-label="View other treatments if no evidence of Type 2 inflammation"
                >
                    Other Treatments (non-Type 2)
                </Button>
                 <Button
                    onClick={() => openInfoModal("Non-biologic options (Type 2)", <NonBiologicT2TreatmentContent />)}
                    leftIcon={<Beaker />}
                    variant="secondary"
                    fullWidth
                    justify="start"
                    aria-label="View non-biologic options in Type 2 inflammation"
                >
                    Non-biologic options (Type 2)
                </Button>
            </div>
        </div>
    );
};

export default SevereAsthmaPanel;