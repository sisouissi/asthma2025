import React, { useState, useRef } from 'react';
import { encryptData, decryptData } from '../../services/encryptionService';
import { usePatientRecords } from '../../contexts/PatientRecordsContext';
import Button from '../ui/Button';
import { Save, Upload, Lock, AlertTriangle, ShieldCheck, Download, FileJson } from '../../constants/icons';
import Card from '../ui/Card';

const BackupRestoreModule: React.FC = () => {
    const { patients, restorePatients } = usePatientRecords();
    const [mode, setMode] = useState<'view' | 'backup' | 'restore'>('view');
    const [password, setPassword] = useState('');
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetState = () => {
        setMode('view');
        setPassword('');
        setStatusMsg(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleBackup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!password || password.length < 4) {
                setStatusMsg({ type: 'error', text: 'Password must be at least 4 characters.' });
                return;
            }

            setStatusMsg({ type: 'info', text: 'Encrypting data...' });

            // Use the new encryption service
            const encryptedPackage = await encryptData(patients, password);

            const blob = new Blob([encryptedPackage], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const date = new Date().toISOString().split('T')[0];
            link.href = url;
            link.download = `gina_patients_backup_${date}.json`; // Changed extension to .json
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setStatusMsg({ type: 'success', text: 'Backup file downloaded successfully.' });
            setTimeout(resetState, 2000);
        } catch (err) {
            console.error(err);
            setStatusMsg({ type: 'error', text: 'Encryption failed.' });
        }
    };

    const handleRestoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // If file selected, verify password
        if (!password) {
            setStatusMsg({ type: 'error', text: 'Please enter the decryption password first.' });
            e.target.value = ''; // Reset file input
            return;
        }

        setStatusMsg({ type: 'info', text: 'Decrypting and restoring...' });

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const fileContent = event.target?.result as string;
                if (!fileContent) return;

                // Use the new encryption service
                const restoredData = await decryptData(fileContent, password);

                if (!Array.isArray(restoredData)) {
                    throw new Error("Invalid data format: Expected an array of patients.");
                }

                restorePatients(restoredData);
                setStatusMsg({ type: 'success', text: 'Patients restored successfully.' });
                setTimeout(resetState, 2000);

            } catch (err) {
                console.error(err);
                setStatusMsg({ type: 'error', text: 'Restoration failed. Incorrect password or corrupted file.' });
            }
        };
        reader.readAsText(file);
    };


    if (mode === 'view') {
        return (
            <div className="flex gap-2">
                <Button
                    onClick={() => setMode('backup')}
                    variant="secondary"
                    size="sm"
                    leftIcon={<Save size={16} />}
                >
                    Backup Data
                </Button>
                <Button
                    onClick={() => setMode('restore')}
                    variant="secondary"
                    size="sm"
                    leftIcon={<Upload size={16} />}
                >
                    Restore Data
                </Button>
            </div>
        );
    }

    return (
        <Card title={mode === 'backup' ? "Secure Backup" : "Restore Data"} className="mb-6 shadow-lg border-indigo-100">
            <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-indigo-50 text-indigo-800 rounded-lg text-sm">
                    <ShieldCheck className="flex-shrink-0 mt-0.5" />
                    <p>
                        {mode === 'backup'
                            ? "Encrypt your patient database with a password before downloading."
                            : "Enter the password used to encrypt the backup file to restore."}
                    </p>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">Encryption Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password..."
                        className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                {statusMsg && (
                    <div className={`text-sm font-medium p-2 rounded ${statusMsg.type === 'error' ? 'text-red-600 bg-red-50' :
                        statusMsg.type === 'success' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600'
                        }`}>
                        {statusMsg.text}
                    </div>
                )}

                <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                    <Button onClick={resetState} variant="ghost" size="sm">Cancel</Button>

                    {mode === 'backup' && (
                        <Button
                            onClick={handleBackup}
                            variant="primary"
                            size="sm"
                            leftIcon={<Download size={16} />}
                            disabled={!password}
                        >
                            Download Backup
                        </Button>
                    )}

                    {mode === 'restore' && (
                        <div className="relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleRestoreChange}
                                accept=".gina,.json"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={!password}
                            />
                            <Button
                                onClick={() => { }}
                                variant="primary"
                                size="sm"
                                leftIcon={<Upload size={16} />}
                                className={!password ? 'opacity-50 cursor-not-allowed' : ''}
                            >
                                Select & Restore File
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default BackupRestoreModule;
