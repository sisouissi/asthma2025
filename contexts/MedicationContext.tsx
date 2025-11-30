
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Medication } from '../types';

interface MedicationContextType {
    medications: Medication[];
    addMedication: (medication: Omit<Medication, 'id'>) => void;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

const STORAGE_KEY = 'gina_asthma_app_medications';

const DEFAULT_MEDICATIONS: Medication[] = [
    { id: '1', brandName: 'Ventolin', genericName: 'Salbutamol (Albuterol)', defaultDosage: '100mcg MDI' },
    { id: '2', brandName: 'Symbicort', genericName: 'Budesonide/Formoterol', defaultDosage: '200/6 mcg Turbuhaler' },
    { id: '3', brandName: 'Seretide / Advair', genericName: 'Fluticasone/Salmeterol', defaultDosage: '250/50 mcg Diskus' },
    { id: '4', brandName: 'Foster', genericName: 'Beclometasone/Formoterol', defaultDosage: '100/6 mcg NEXThaler' },
    { id: '5', brandName: 'Pulmicort', genericName: 'Budesonide', defaultDosage: '200mcg Turbuhaler' },
    { id: '6', brandName: 'Flixotide', genericName: 'Fluticasone Propionate', defaultDosage: '125mcg MDI' },
    { id: '7', brandName: 'Singulair', genericName: 'Montelukast', defaultDosage: '10mg Tablet' },
    { id: '8', brandName: 'Spiriva Respimat', genericName: 'Tiotropium', defaultDosage: '2.5mcg' },
    { id: '9', brandName: 'Prednisone', genericName: 'Prednisone', defaultDosage: '5mg Tablet' },
    { id: '10', brandName: 'Bricanyl', genericName: 'Terbutaline', defaultDosage: '0.5mg Turbuhaler' },
    { id: '11', brandName: 'Qvar', genericName: 'Beclometasone', defaultDosage: '100mcg MDI' },
    { id: '12', brandName: 'Alvesco', genericName: 'Ciclesonide', defaultDosage: '160mcg MDI' },
];

export const MedicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [medications, setMedications] = useState<Medication[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setMedications(parsed);
                } else {
                    setMedications(DEFAULT_MEDICATIONS);
                }
            } catch {
                setMedications(DEFAULT_MEDICATIONS);
            }
        } else {
            setMedications(DEFAULT_MEDICATIONS);
        }
    }, []);

    useEffect(() => {
        if (medications.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
        }
    }, [medications]);

    const addMedication = useCallback((medication: Omit<Medication, 'id'>) => {
        const newMed = { ...medication, id: crypto.randomUUID() };
        setMedications(prev => [...prev, newMed].sort((a, b) => a.brandName.localeCompare(b.brandName)));
    }, []);

    return (
        <MedicationContext.Provider value={{ medications, addMedication }}>
            {children}
        </MedicationContext.Provider>
    );
};

export const useMedications = (): MedicationContextType => {
    const context = useContext(MedicationContext);
    if (!context) {
        throw new Error('useMedications must be used within a MedicationProvider');
    }
    return context;
};
