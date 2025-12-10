
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

interface UIStateContextType {
  isAIPanelOpen: boolean;
  toggleAIPanel: () => void;
  openAIPanel: () => void;
  closeAIPanel: () => void;

  isGoalsModalOpen: boolean;
  openGoalsModal: () => void;
  closeGoalsModal: () => void;

  isInfoModalOpen: boolean;
  infoModalContent: { title: string; content: React.ReactNode } | null;
  openInfoModal: (title: string, content: React.ReactNode) => void;
  closeInfoModal: () => void;

  isPrintProfileModalOpen: boolean;
  openPrintProfileModal: () => void;
  closePrintProfileModal: () => void;

  activePanel: 'management' | 'diagnosis' | 'severeAsthma' | null;
  openManagementPanel: () => void;
  openDiagnosisPanel: () => void;
  openSevereAsthmaPanel: () => void;
  closeSidePanel: () => void;

  // Auth State
  isAuthenticated: boolean;
  authenticate: () => void;
  hasPin: boolean;
  setAppPin: (pin: string, securityQuestion?: string, securityAnswer?: string) => void;
  resetAppPin: () => void;
  verifySecurityAnswer: (answer: string) => boolean;
  getSecurityQuestion: () => string | null;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export const UIStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);
  const [activePanel, setActivePanel] = useState<'management' | 'diagnosis' | 'severeAsthma' | null>(null);
  const [isPrintProfileModalOpen, setIsPrintProfileModalOpen] = useState(false);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPin, setHasPin] = useState(false);

  useEffect(() => {
    const storedPin = localStorage.getItem('gina_app_pin');
    if (storedPin) {
      setHasPin(true);
    }
  }, []);

  const authenticate = useCallback(() => setIsAuthenticated(true), []);

  const setAppPin = useCallback((pin: string, securityQuestion?: string, securityAnswer?: string) => {
    localStorage.setItem('gina_app_pin', pin);
    if (securityQuestion && securityAnswer) {
      localStorage.setItem('gina_app_security_question', securityQuestion);
      localStorage.setItem('gina_app_security_answer', securityAnswer);
    }
    setHasPin(true);
    setIsAuthenticated(true);
  }, []);

  const resetAppPin = useCallback(() => {
    localStorage.removeItem('gina_app_pin');
    localStorage.removeItem('gina_app_security_question');
    localStorage.removeItem('gina_app_security_answer');
    setHasPin(false);
    setIsAuthenticated(false);
  }, []);

  const verifySecurityAnswer = useCallback((answer: string): boolean => {
    const storedAnswer = localStorage.getItem('gina_app_security_answer');
    return storedAnswer === answer;
  }, []);

  const getSecurityQuestion = useCallback((): string | null => {
    return localStorage.getItem('gina_app_security_question');
  }, []);


  const toggleAIPanel = useCallback(() => setIsAIPanelOpen(prev => !prev), []);
  const openAIPanel = useCallback(() => setIsAIPanelOpen(true), []);
  const closeAIPanel = useCallback(() => setIsAIPanelOpen(false), []);

  const openGoalsModal = useCallback(() => setIsGoalsModalOpen(true), []);
  const closeGoalsModal = useCallback(() => setIsGoalsModalOpen(false), []);

  const openInfoModal = useCallback((title: string, content: React.ReactNode) => {
    setInfoModalContent({ title, content });
    setIsInfoModalOpen(true);
  }, []);

  const closeInfoModal = useCallback(() => {
    setIsInfoModalOpen(false);
    // Delay clearing content to prevent it from disappearing during the closing animation
    setTimeout(() => setInfoModalContent(null), 300);
  }, []);

  const openPrintProfileModal = useCallback(() => setIsPrintProfileModalOpen(true), []);
  const closePrintProfileModal = useCallback(() => setIsPrintProfileModalOpen(false), []);

  const openManagementPanel = useCallback(() => setActivePanel('management'), []);
  const openDiagnosisPanel = useCallback(() => setActivePanel('diagnosis'), []);
  const openSevereAsthmaPanel = useCallback(() => setActivePanel('severeAsthma'), []);
  const closeSidePanel = useCallback(() => setActivePanel(null), []);

  return (
    <UIStateContext.Provider value={{
      isAIPanelOpen, toggleAIPanel, openAIPanel, closeAIPanel,
      isGoalsModalOpen, openGoalsModal, closeGoalsModal,
      isInfoModalOpen, infoModalContent, openInfoModal, closeInfoModal,
      isPrintProfileModalOpen, openPrintProfileModal, closePrintProfileModal,
      activePanel, openManagementPanel, openDiagnosisPanel, openSevereAsthmaPanel, closeSidePanel,
      isAuthenticated, authenticate, hasPin, setAppPin, resetAppPin, verifySecurityAnswer, getSecurityQuestion
    }}>
      {children}
    </UIStateContext.Provider>
  );
};

export const useUIState = (): UIStateContextType => {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  return context;
};
