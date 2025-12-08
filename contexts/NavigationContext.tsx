

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { StepId, PatientData } from '../types'; 
import { usePatientData } from './PatientDataContext';
import { useUIState } from './UIStateContext';


interface NavigationContextType {
  currentStepId: StepId;
  history: StepId[];
  navigateTo: (stepId: StepId, updates?: Partial<PatientData>) => void;
  goBack: () => void;
  resetNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStepId, setCurrentStepId] = useState<StepId>('INITIAL_STEP');
  const [history, setHistory] = useState<StepId[]>(['INITIAL_STEP']);
  const { updatePatientData: updatePatientDataContext, resetPatientData } = usePatientData();
  const { closeSidePanel } = useUIState();


  const navigateTo = useCallback((stepId: StepId, updates?: Partial<PatientData>) => {
    if (updates) {
      updatePatientDataContext(updates);
    }
    // Close any open side panels when navigating to a new step
    closeSidePanel();
    setCurrentStepId(stepId);
    setHistory(prevHistory => [...prevHistory, stepId]);
  }, [updatePatientDataContext, closeSidePanel]);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); 
      const previousStepId = newHistory[newHistory.length - 1]; 
      
      setCurrentStepId(previousStepId);
      setHistory(newHistory);
    }
  }, [history]);

  const resetNavigation = useCallback(() => {
    // Determine if we are in a patient context to decide how to reset
    // However, usually "Home" means exit everything. 
    // To implement "Start New Consultation" for SAME patient, we handle that in the Dashboard directly, 
    // here resetNavigation implies a full reset to app root.
    resetPatientData(false); 
    closeSidePanel();
    setCurrentStepId('INITIAL_STEP');
    setHistory(['INITIAL_STEP']);
  }, [resetPatientData, closeSidePanel]);

  return (
    <NavigationContext.Provider value={{ currentStepId, history, navigateTo, goBack, resetNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};