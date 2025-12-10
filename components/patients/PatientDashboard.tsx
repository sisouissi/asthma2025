import React, { useState, useEffect, useMemo, useRef } from 'react';
import { usePatientRecords } from '../../contexts/PatientRecordsContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { usePatientData } from '../../contexts/PatientDataContext';
import { useUIState } from '../../contexts/UIStateContext';
import { PatientProfile } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { User, PlusCircle, Search, FileText, ChevronRight, Calendar, Trash2, ArrowRight, Users, ChevronLeft, Bell, Lock, Unlock, Key, ShieldCheck, Zap, Activity } from '../../constants/icons';
import { StepId, AgeGroup } from '../../types';
import BackupRestoreModule from './BackupRestoreModule';
import { Sparkles } from 'lucide-react';
import PatientSummaryModal from './PatientSummaryModal';
import ClinicalSummaryCard from './ClinicalSummaryCard';

interface PatientListItemProps {
    patient: PatientProfile;
    onSelect: (id: string) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
    onSummary: (patient: PatientProfile, e: React.MouseEvent) => void;
    annualExacerbations: number;
    isDifficultToTreat: boolean;
}

const PatientListItem: React.FC<PatientListItemProps> = ({ patient, onSelect, onDelete, onSummary, annualExacerbations, isDifficultToTreat }) => (
    <div
        onClick={() => onSelect(patient.id)}
        className="p-4 border border-slate-200 rounded-lg hover:shadow-md cursor-pointer bg-white transition-all flex justify-between items-center group"
    >
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-4">
                <User size={20} />
            </div>
            <div>
                <h4 className="font-semibold text-slate-800 text-lg">{patient.lastName.toUpperCase()}, {patient.firstName}</h4>
                <div className="flex flex-wrap gap-3 text-sm text-slate-500 mt-1">
                    <span><span className="font-medium">File:</span> {patient.fileNumber}</span>
                    <span className="hidden sm:inline">|</span>
                    <span><span className="font-medium">DOB:</span> {patient.dateOfBirth}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
            {isDifficultToTreat && (
                <div className="flex items-center bg-orange-50 text-orange-700 px-2 py-1 rounded-full text-xs font-medium border border-orange-200" title="Patient meets criteria for Difficult-to-Treat Asthma (GINA Step 4/5 with poor control or frequent exacerbations)">
                    <Activity size={12} className="mr-1" />
                    ⚠️ Difficult-to-Treat Risk
                </div>
            )}
            {annualExacerbations > 0 && (
                <div className="flex items-center bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium border border-red-100" title="Exacerbations recorded in the last 12 months">
                    <Zap size={12} className="mr-1 fill-red-600" />
                    {annualExacerbations} Exac. (1y)
                </div>
            )}
            <div className="text-right hidden sm:block">
                <p className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded-full">
                    {patient.consultations.length} Consultations
                </p>
            </div>
            <Button
                onClick={(e) => onSummary(patient, e)}
                variant="secondary"
                size="sm"
                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                title="Generate AI Clinical Summary"
            >
                <Sparkles size={16} className="mr-1" />
                Summary
            </Button>
            <Button
                onClick={(e) => onDelete(patient.id, e)}
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-red-500"
            >
                <Trash2 size={18} />
            </Button>
            <ChevronRight className="text-slate-300 group-hover:text-indigo-500" />
        </div>
    </div>
);

const PatientDashboard: React.FC = () => {
    const { patients, addPatient, deletePatient } = usePatientRecords();
    const { navigateTo } = useNavigation();
    const { patientData, updatePatientData, resetPatientData } = usePatientData();
    const { isAuthenticated, authenticate, hasPin, setAppPin, resetAppPin, verifySecurityAnswer, getSecurityQuestion } = useUIState();

    // PIN Authentication Local Input State
    const [pinInput, setPinInput] = useState('');
    const [confirmPinInput, setConfirmPinInput] = useState('');
    const [authError, setAuthError] = useState('');
    const pinInputRef = useRef<HTMLInputElement>(null);

    // Security Question State
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [isResettingPin, setIsResettingPin] = useState(false);
    const [resetAnswerInput, setResetAnswerInput] = useState('');

    // Views: List (Tabs), Create Form, Details
    const [view, setView] = useState<'list' | 'create' | 'details'>('list');
    // Tabs: 'all' or 'today'
    const [activeTab, setActiveTab] = useState<'all' | 'today'>('all');

    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Form State
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        dateOfBirth: '',
        fileNumber: '',
        treatingPhysician: ''
    });

    // AI Summary Modal State
    const [summaryModalOpen, setSummaryModalOpen] = useState(false);
    const [summaryPatient, setSummaryPatient] = useState<PatientProfile | null>(null);

    const handleOpenSummary = (patient: PatientProfile, e: React.MouseEvent) => {
        e.stopPropagation();
        setSummaryPatient(patient);
        setSummaryModalOpen(true);
    };

    // Sync with global context
    useEffect(() => {
        if (patientData.activePatientId) {
            setSelectedPatientId(patientData.activePatientId);
            setView('details');
        }
    }, [patientData.activePatientId]);

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const selectedPatient = patients.find(p => p.id === selectedPatientId);

    // --- Helper Functions ---

    const calculateAge = (dobString: string): number => {
        const dob = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    };

    const getLatestReminderDate = (patient: PatientProfile): string | null => {
        if (!patient.consultations || patient.consultations.length === 0) return null;
        // Sort consultations by date descending
        const sorted = [...patient.consultations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const latestData = sorted[0].data;

        // Check all possible reminder fields
        return latestData.adult_reviewReminderDate ||
            latestData.child_reviewReminderDate ||
            latestData.youngChild_reviewReminderDate || null;
    };

    // Helper: Calculate annual exacerbations
    const getAnnualExacerbations = (patient: PatientProfile): number => {
        if (!patient.consultations) return 0;
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        return patient.consultations.filter(c => {
            const date = new Date(c.date);
            // Check if within last year AND has recorded exacerbation severity
            return date >= oneYearAgo && c.data.exacerbationSeverity != null;
        }).length;
    };

    // Helper: Detect Difficult-to-Treat Asthma (GINA criteria)
    const getPatientAlerts = (patient: PatientProfile): boolean => {
        if (!patient.consultations || patient.consultations.length === 0) return false;

        // Get latest consultation data
        const sortedConsultations = [...patient.consultations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const latestData = sortedConsultations[0].data;

        // Age group filter: Only adult and child (6+ years), exclude young children (<6 years)
        const ageGroup = latestData.ageGroup;
        if (ageGroup !== 'adult' && ageGroup !== 'child') return false;

        // Criterion 1: GINA Step 5 only (not Step 4)
        const isStep5 = (latestData.adult_currentGinaStep === 5) ||
            (latestData.child_currentGinaStep === 4); // Child max is Step 4

        if (!isStep5) return false;

        // Criterion 2: 2 or more exacerbations in the last year (>=2)
        const exacerbationCount = getAnnualExacerbations(patient);
        if (exacerbationCount < 2) return false;

        // Criterion 3: Poor control demonstrated by ONE of the following:
        // 3a) Uncontrolled in successive consultations (last 2 consultations)
        // 3b) Repeated poor ACQ scores (≥1.5)
        // 3c) Repeated poor ACT scores (≤19)

        // Check 3a: Successive uncontrolled consultations
        let hasSuccessiveUncontrolled = false;
        if (sortedConsultations.length >= 2) {
            const lastTwoConsultations = sortedConsultations.slice(0, 2);
            hasSuccessiveUncontrolled = lastTwoConsultations.every(consult => {
                const data = consult.data;
                return data.adult_controlLevel === 'uncontrolled' ||
                    data.child_controlLevel === 'uncontrolled';
            });
        }

        // Check 3b: Repeated poor ACQ scores (≥1.5)
        const acqHistory = latestData.acqHistory || [];
        const recentACQ = acqHistory.slice(-2); // Last 2 ACQ scores
        const hasRepeatedPoorACQ = recentACQ.length >= 2 &&
            recentACQ.every(test => test.score >= 1.5);

        // Check 3c: Repeated poor ACT scores (≤19)
        const actHistory = latestData.actHistory || [];
        const recentACT = actHistory.slice(-2); // Last 2 ACT scores
        const hasRepeatedPoorACT = recentACT.length >= 2 &&
            recentACT.every(test => test.score <= 19);

        // Patient qualifies if any of the control criteria are met
        const hasPoorControl = hasSuccessiveUncontrolled || hasRepeatedPoorACQ || hasRepeatedPoorACT;

        return hasPoorControl;
    };

    // --- Filtering & Pagination Logic ---

    const filteredAllPatients = useMemo(() => {
        return patients.filter(p =>
            p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.fileNumber.includes(searchTerm)
        );
    }, [patients, searchTerm]);

    const todaysPatients = useMemo(() => {
        const today = new Date();
        return patients.filter(p => {
            const reminderString = getLatestReminderDate(p);
            if (!reminderString) return false;

            // Use local date comparison to match "Today" correctly
            const reminder = new Date(reminderString);
            return reminder.getDate() === today.getDate() &&
                reminder.getMonth() === today.getMonth() &&
                reminder.getFullYear() === today.getFullYear();
        });
    }, [patients]);

    const totalPages = Math.ceil(filteredAllPatients.length / itemsPerPage);
    const paginatedPatients = filteredAllPatients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // --- Actions ---

    const handlePinSetup = (e: React.FormEvent) => {
        e.preventDefault();
        if (pinInput.length < 4) {
            setAuthError("PIN must be at least 4 digits.");
            return;
        }
        if (pinInput !== confirmPinInput) {
            setAuthError("PINs do not match.");
            return;
        }
        setAppPin(pinInput); // Set in global context
        setAuthError('');
    };

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        const storedPin = localStorage.getItem('gina_app_pin');
        if (pinInput === storedPin) {
            authenticate(); // Set global authenticated state
            setAuthError('');
        } else {
            setAuthError("Incorrect PIN.");
            setPinInput('');
        }
    };

    const handlePinChange = (val: string) => {
        if (!/^\d*$/.test(val)) return;
        setPinInput(val);
    };

    const handleConfirmChange = (val: string) => {
        if (!/^\d*$/.test(val)) return;
        setConfirmPinInput(val);
    };

    // Auto-submit unlock when 4 digits are entered
    useEffect(() => {
        if (hasPin && pinInput.length === 4) {
            const storedPin = localStorage.getItem('gina_app_pin');
            if (pinInput === storedPin) {
                authenticate();
                setAuthError('');
            } else {
                setAuthError("Incorrect PIN.");
                setPinInput('');
                setTimeout(() => pinInputRef.current?.focus(), 100);
            }
        }
    }, [pinInput, hasPin, authenticate]);

    const handleSetupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pinInput.length < 4) {
            setAuthError("PIN must be at least 4 digits.");
            return;
        }
        if (pinInput !== confirmPinInput) {
            setAuthError("PINs do not match.");
            return;
        }
        if (!securityQuestion || !securityAnswer) {
            setAuthError("Please set a security question and answer.");
            return;
        }
        setAppPin(pinInput, securityQuestion, securityAnswer);
        setAuthError('');
    };

    const handleForgotPin = () => {
        const question = getSecurityQuestion();
        if (question) {
            setIsResettingPin(true);
            setAuthError('');
        } else {
            // Fallback for legacy PINs without security question
            if (window.confirm("No security question found. Resetting your PIN will allow you to create a new one. Are you sure?")) {
                resetAppPin();
                setPinInput('');
                setAuthError('');
            }
        }
    };

    const handleResetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (verifySecurityAnswer(resetAnswerInput)) {
            resetAppPin();
            setIsResettingPin(false);
            setResetAnswerInput('');
            setPinInput('');
            setAuthError('');
        } else {
            setAuthError("Incorrect answer.");
        }
    };

    const handleCancelReset = () => {
        setIsResettingPin(false);
        setResetAnswerInput('');
        setAuthError('');
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.lastName || !formData.firstName) return;
        const finalFileNumber = formData.fileNumber.trim() || `P-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        addPatient({ ...formData, fileNumber: finalFileNumber });
        setFormData({ lastName: '', firstName: '', dateOfBirth: '', fileNumber: '', treatingPhysician: '' });
        setView('list'); setActiveTab('all');
    };

    const handleSelectPatient = (id: string) => {
        setSelectedPatientId(id);
        setView('details');
        updatePatientData({ activePatientId: id });
    };

    const handleBackToList = () => {
        setView('list');
        setSelectedPatientId(null);
        updatePatientData({ activePatientId: null });
    };

    const handleNewConsultation = () => {
        if (!selectedPatientId || !selectedPatient) return;

        // Reset clinical data but keep patient ID context
        resetPatientData(true);

        // Determine age group automatically based on DOB
        let nextStep: StepId = 'INITIAL_STEP';
        let ageGroup: AgeGroup | null = null;
        let ageLabel: string | null = null;

        const age = selectedPatient.dateOfBirth ? calculateAge(selectedPatient.dateOfBirth) : 0;

        if (age >= 12) {
            ageGroup = 'adult';
            ageLabel = '12+ years';
            nextStep = 'DIAGNOSIS_PROBABILITY_STEP';
        } else if (age >= 6) {
            ageGroup = 'child';
            ageLabel = '6-11 years';
            nextStep = 'DIAGNOSIS_PROBABILITY_STEP';
        } else {
            ageGroup = 'youngChild';
            ageLabel = '<=5 years';
            nextStep = 'YOUNG_CHILD_DIAGNOSIS_STEP';
        }

        const hasPriorConsultations = selectedPatient.consultations.length > 0;
        const consultationType = hasPriorConsultations ? 'followup' : 'initial';

        let updates: any = {
            activePatientId: selectedPatientId,
            age: ageLabel,
            ageGroup: ageGroup,
            consultationType: consultationType
        };

        if (hasPriorConsultations) {
            const sortedConsultations = [...selectedPatient.consultations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const lastConsultation = sortedConsultations[0];

            // --- SEVERE ASTHMA CHECK ---
            const severeStatus = lastConsultation.data.severeAsthma?.status;
            // Explicitly include biologic_trial in active check
            const isSevereActive = severeStatus && severeStatus !== 'screening' && severeStatus !== 'rejected_severe';

            if (isSevereActive) {
                updates.severeAsthma = lastConsultation.data.severeAsthma;
                updates.severeAsthmaAssessment = lastConsultation.data.severeAsthmaAssessment;
                // Force route to Severe Asthma entry point, Manager will handle internal routing based on status
                nextStep = 'SEVERE_ASTHMA_STAGE_1';
            } else {
                // --- STANDARD ASTHMA FOLLOW-UP ---
                const aggregatedACT = sortedConsultations.flatMap(c => c.data.actHistory || []);
                const aggregatedACQ = sortedConsultations.flatMap(c => c.data.acqHistory || []);
                const aggregatedcACT = sortedConsultations.flatMap(c => c.data.cactHistory || []);

                const uniqueACT = Array.from(new Map(aggregatedACT.map(item => [item.date, item])).values());
                const uniqueACQ = Array.from(new Map(aggregatedACQ.map(item => [item.date, item])).values());
                const uniquecACT = Array.from(new Map(aggregatedcACT.map(item => [item.date, item])).values());

                updates.actHistory = uniqueACT;
                updates.acqHistory = uniqueACQ;
                updates.cactHistory = uniquecACT;

                if (ageGroup === 'adult') {
                    updates.adult_currentGinaStep = lastConsultation.data.adult_currentGinaStep;
                    updates.adult_pathway = lastConsultation.data.adult_pathway;
                    nextStep = 'ADULT_CONTROL_ASSESSMENT_STEP';
                } else if (ageGroup === 'child') {
                    updates.child_currentGinaStep = lastConsultation.data.child_currentGinaStep;
                    updates.child_pathway = lastConsultation.data.child_pathway;
                    nextStep = 'CHILD_CONTROL_ASSESSMENT_STEP';
                } else if (ageGroup === 'youngChild') {
                    updates.youngChild_currentGinaStep = lastConsultation.data.youngChild_currentGinaStep;
                    updates.youngChild_currentTreatmentStrategy = lastConsultation.data.youngChild_currentTreatmentStrategy;
                    nextStep = 'YOUNG_CHILD_CONTROL_ASSESSMENT_STEP';
                }
            }
        }

        updatePatientData(updates);
        navigateTo(nextStep);
    };

    const handleLoadConsultation = (consultation: any) => {
        if (!selectedPatientId) return;
        updatePatientData({
            ...consultation.data,
            activePatientId: selectedPatientId,
            activeConsultationId: consultation.id
        });
        navigateTo('CONSULTATION_SUMMARY_STEP');
    };

    const handleDeletePatient = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        deletePatient(id);
        if (selectedPatientId === id) {
            setSelectedPatientId(null);
            setView('list');
        }
    };

    const inputStyle = "w-full p-2 bg-slate-100 border border-slate-300 rounded-md shadow-inner text-slate-800 placeholder-slate-500 focus:bg-white focus:shadow-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200";

    // --- Auth Guard ---
    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto mt-12 px-4">
                <Card
                    title={hasPin ? "Patient Access Locked" : "Security Setup"}
                    icon={hasPin ? <Lock className="text-indigo-600" /> : <ShieldCheck className="text-violet-600" />}
                    className="text-center shadow-xl"
                >
                    <div className="py-6">
                        {hasPin ? (
                            <div className="space-y-6">
                                <p className="text-slate-600 mb-4">Enter your PIN to unlock.</p>
                                <div>
                                    <input
                                        ref={pinInputRef}
                                        type="password"
                                        inputMode="numeric"
                                        maxLength={4}
                                        autoFocus
                                        className="w-48 text-center text-4xl tracking-[0.5em] p-3 border-b-2 border-indigo-300 focus:border-indigo-600 focus:outline-none bg-transparent text-slate-800 font-bold placeholder-slate-300"
                                        value={pinInput}
                                        onChange={(e) => handlePinChange(e.target.value)}
                                        placeholder="••••"
                                    />
                                </div>
                                {authError && <p className="text-red-500 text-sm font-medium animate-pulse">{authError}</p>}
                                <p className="text-xs text-slate-400">Enter 4 digits to unlock automatically</p>
                                <button
                                    onClick={handleForgotPin}
                                    className="text-xs text-indigo-400 hover:text-indigo-600 underline mt-2"
                                >
                                    Forgot PIN?
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSetupSubmit} className="space-y-6">
                                <div className="bg-violet-50 p-3 rounded-lg text-sm text-violet-800 mb-4">
                                    First-time access: Create a secure 4-digit PIN and a security question.
                                </div>
                                <div className="space-y-4 text-left">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 pl-1">Create PIN</label>
                                            <input
                                                type="password"
                                                inputMode="numeric"
                                                maxLength={4}
                                                className="w-full text-center text-2xl tracking-widest p-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                                                value={pinInput}
                                                onChange={(e) => handlePinChange(e.target.value)}
                                                placeholder="••••"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 pl-1">Confirm PIN</label>
                                            <input
                                                type="password"
                                                inputMode="numeric"
                                                maxLength={4}
                                                className="w-full text-center text-2xl tracking-widest p-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                                                value={confirmPinInput}
                                                onChange={(e) => handleConfirmChange(e.target.value)}
                                                placeholder="••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-200">
                                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 pl-1">Security Question</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 bg-slate-100 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all mb-3"
                                            value={securityQuestion}
                                            onChange={(e) => setSecurityQuestion(e.target.value)}
                                            placeholder="e.g., Name of your first pet?"
                                        />
                                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 pl-1">Answer</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 bg-slate-100 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                                            value={securityAnswer}
                                            onChange={(e) => setSecurityAnswer(e.target.value)}
                                            placeholder="Your answer..."
                                        />
                                    </div>
                                </div>
                                {authError && <p className="text-red-500 text-sm font-medium">{authError}</p>}
                                <Button type="submit" fullWidth variant="violet" size="lg" rightIcon={<Key size={20} />}>
                                    Set PIN & Access
                                </Button>
                            </form>
                        )}
                    </div>
                </Card>

                {/* Forgot PIN Modal */}
                {isResettingPin && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Reset PIN</h3>
                            <p className="text-slate-600 text-sm mb-4">Please answer your security question to reset your PIN.</p>

                            <form onSubmit={handleResetSubmit}>
                                <div className="mb-4">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Question</label>
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium text-sm">
                                        {getSecurityQuestion()}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Answer</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={resetAnswerInput}
                                        onChange={(e) => setResetAnswerInput(e.target.value)}
                                        placeholder="Enter your answer..."
                                    />
                                </div>

                                {authError && <p className="text-red-500 text-sm font-medium mb-4">{authError}</p>}

                                <div className="flex justify-end gap-3">
                                    <Button type="button" variant="ghost" onClick={handleCancelReset}>Cancel</Button>
                                    <Button type="submit" variant="primary">Verify & Reset</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // --- Render Main ---
    const renderMainList = () => (
        <div className="space-y-6">
            <div className="flex justify-end">
                <BackupRestoreModule />
            </div>
            <Card
                title="Patient Directory"
                icon={<Users className="text-indigo-600" />}
                titleRightElement={
                    <Button onClick={() => setView('create')} size="sm" leftIcon={<PlusCircle size={16} />}>
                        New Patient
                    </Button>
                }
            >
                {/* Tabs */}
                <div className="flex space-x-4 border-b border-slate-200 mb-6">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`pb-2 px-4 font-medium text-sm transition-colors relative ${activeTab === 'all'
                            ? 'text-indigo-600'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        All Patients
                        {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('today')}
                        className={`pb-2 px-4 font-medium text-sm transition-colors relative flex items-center ${activeTab === 'today'
                            ? 'text-indigo-600'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Appointments Today
                        {todaysPatients.length > 0 && (
                            <span className="ml-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                {todaysPatients.length}
                            </span>
                        )}
                        {activeTab === 'today' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></div>}
                    </button>
                </div>

                {/* Tab Content: ALL PATIENTS */}
                {activeTab === 'all' && (
                    <>
                        <div className="mb-6 relative">
                            <input
                                type="text"
                                placeholder="Search by Name or File Number..."
                                className={`pl-10 pr-4 py-3 rounded-lg ${inputStyle}`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
                        </div>

                        {paginatedPatients.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                <User className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                <p className="text-slate-500 font-medium">No patients found matching your search.</p>
                                {searchTerm && (
                                    <button onClick={() => setSearchTerm('')} className="text-indigo-600 text-sm mt-2 hover:underline">
                                        Clear search
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {paginatedPatients.map(patient => (
                                    <PatientListItem
                                        key={patient.id}
                                        patient={patient}
                                        onSelect={handleSelectPatient}
                                        onDelete={handleDeletePatient}
                                        onSummary={handleOpenSummary}
                                        annualExacerbations={getAnnualExacerbations(patient)}
                                        isDifficultToTreat={getPatientAlerts(patient)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {filteredAllPatients.length > itemsPerPage && (
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
                                <div className="text-sm text-slate-500">
                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAllPatients.length)} of {filteredAllPatients.length} patients
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        variant="secondary"
                                        size="sm"
                                        leftIcon={<ChevronLeft size={16} />}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        variant="secondary"
                                        size="sm"
                                        rightIcon={<ChevronRight size={16} />}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Tab Content: APPOINTMENTS TODAY */}
                {activeTab === 'today' && (
                    <>
                        {todaysPatients.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                <p className="text-slate-500 font-medium">No appointments scheduled for today.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-md border border-blue-200 mb-4 flex items-center">
                                    <Bell size={16} className="mr-2" />
                                    Showing patients with a review scheduled for {new Date().toLocaleDateString()}.
                                </div>
                                {todaysPatients.map(patient => (
                                    <PatientListItem
                                        key={patient.id}
                                        patient={patient}
                                        onSelect={handleSelectPatient}
                                        onDelete={handleDeletePatient}
                                        onSummary={handleOpenSummary}
                                        annualExacerbations={getAnnualExacerbations(patient)}
                                        isDifficultToTreat={getPatientAlerts(patient)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </Card>
        </div>
    );

    const renderCreate = () => (
        <Card title="Register New Patient" icon={<PlusCircle className="text-indigo-600" />}>
            <form onSubmit={handleCreateSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                        <input required type="text" className={inputStyle} value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                        <input required type="text" className={inputStyle} value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                        <input type="date" className={inputStyle} value={formData.dateOfBirth} onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">File Number</label>
                        <input
                            type="text"
                            className={inputStyle}
                            value={formData.fileNumber}
                            onChange={e => setFormData({ ...formData, fileNumber: e.target.value })}
                            placeholder="Auto-generated if empty"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Treating Physician</label>
                        <input type="text" className={inputStyle} value={formData.treatingPhysician} onChange={e => setFormData({ ...formData, treatingPhysician: e.target.value })} />
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <Button type="button" variant="secondary" onClick={() => setView('list')}>Cancel</Button>
                    <Button type="submit" variant="primary">Save Patient Record</Button>
                </div>
            </form>
        </Card>
    );

    const renderDetails = () => {
        const age = selectedPatient?.dateOfBirth ? calculateAge(selectedPatient.dateOfBirth) : 'N/A';

        return (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{selectedPatient?.lastName.toUpperCase()}, {selectedPatient?.firstName}</h2>
                        <div className="mt-2 text-slate-600 flex flex-wrap gap-4 text-sm">
                            <p><span className="font-medium text-slate-900">DOB:</span> {selectedPatient?.dateOfBirth || 'N/A'} (Age: {age})</p>
                            <p><span className="font-medium text-slate-900">File:</span> {selectedPatient?.fileNumber || 'N/A'}</p>
                            <p><span className="font-medium text-slate-900">MD:</span> {selectedPatient?.treatingPhysician || 'N/A'}</p>
                        </div>
                    </div>
                    <Button onClick={handleBackToList} variant="secondary" leftIcon={<ArrowRight className="rotate-180" />}>Back to List</Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Actions */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5 text-center shadow-sm">
                            <h3 className="font-semibold text-indigo-900 mb-2 text-lg">New Consultation</h3>
                            <p className="text-sm text-indigo-700 mb-4">Start a new GINA-based assessment. The guide adapts to the patient's current age.</p>
                            <Button onClick={handleNewConsultation} fullWidth variant="primary" size="lg" rightIcon={<ArrowRight />}>
                                Start Consultation
                            </Button>
                        </div>

                        {selectedPatient && (
                            <ClinicalSummaryCard
                                patient={selectedPatient}
                                annualExacerbations={getAnnualExacerbations(selectedPatient)}
                                isDifficultToTreat={getPatientAlerts(selectedPatient)}
                                onGenerate={handleOpenSummary}
                            />
                        )}

                        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                            <h3 className="font-semibold text-slate-800 mb-3">Quick Stats</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Total Visits:</span>
                                    <span className="font-medium">{selectedPatient?.consultations.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Annual Exacerbations:</span>
                                    <span className="font-bold text-red-600">{selectedPatient ? getAnnualExacerbations(selectedPatient) : 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Last Visit:</span>
                                    <span className="font-medium">{selectedPatient?.consultations.length ? new Date(selectedPatient.consultations[0].date).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - History */}
                    <div className="w-full lg:w-2/3">
                        <Card title="Consultation History" icon={<FileText className="text-slate-600" />}>
                            {selectedPatient?.consultations.length === 0 ? (
                                <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                    <FileText className="mx-auto h-10 w-10 mb-2 opacity-50" />
                                    No previous consultations recorded.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedPatient?.consultations.map(consult => {
                                        const date = new Date(consult.date);
                                        const type = consult.data.consultationType === 'initial' ? 'Initial Consultation' : 'Follow-up';
                                        const severeStatus = consult.data.severeAsthma?.status;

                                        let diagnosisLabel = "";
                                        if (severeStatus && severeStatus !== 'screening' && severeStatus !== 'rejected_severe') {
                                            if (severeStatus === 'confirmed_severe' || severeStatus === 'biologic_trial') {
                                                const drug = consult.data.severeAsthma.selectedBiologic ? consult.data.severeAsthma.selectedBiologic.split('(')[0].trim() : '';
                                                diagnosisLabel = `Severe Asthma${drug ? ` (${drug})` : ''}`;
                                            } else if (severeStatus === 'optimizing' || severeStatus === 'addressing_factors') {
                                                diagnosisLabel = "Difficult-to-Treat Asthma (Evaluating)";
                                            }
                                        } else {
                                            const step = consult.data.adult_currentGinaStep || consult.data.child_currentGinaStep || consult.data.youngChild_currentGinaStep;
                                            diagnosisLabel = step ? `GINA Step ${step}` : 'Assessment';
                                        }

                                        return (
                                            <div key={consult.id} className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow flex justify-between items-center">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="font-bold text-slate-800 text-lg">{date.toLocaleDateString()}</span>
                                                        <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                                                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {consult.data.exacerbationSeverity && (
                                                            <span className="flex items-center bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full ml-2 border border-red-200">
                                                                <Zap size={10} className="mr-1 fill-red-600" />
                                                                {consult.data.exacerbationSeverity === 'severe' ? 'Severe Exac.' : 'Mild/Mod Exac.'}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${consult.data.consultationType === 'initial' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                {type}
                                                            </span>
                                                            <span>•</span>
                                                            <span>{consult.data.ageGroup ? consult.data.ageGroup.charAt(0).toUpperCase() + consult.data.ageGroup.slice(1) : 'Unknown Group'}</span>
                                                        </div>

                                                        {/* Diagnosis Info */}
                                                        <div className="flex items-center gap-3 text-xs mt-1">
                                                            <span className="font-medium text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                                                                {diagnosisLabel}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button onClick={() => handleLoadConsultation(consult)} size="sm" variant="secondary" rightIcon={<ChevronRight size={16} />}>Review</Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {view === 'list' && renderMainList()}
            {view === 'create' && renderCreate()}
            {view === 'details' && renderDetails()}

            {summaryPatient && (
                <PatientSummaryModal
                    isOpen={summaryModalOpen}
                    onClose={() => setSummaryModalOpen(false)}
                    patient={summaryPatient}
                />
            )}
        </div>
    );
};

export default PatientDashboard;