import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface AssessmentCardProps {
    title: string;
    icon: React.ReactElement;
    children: React.ReactNode;
    status?: 'positive' | 'negative' | 'warning' | null;
    className?: string;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ title, icon, children, status = null, className = '' }) => {
    const clonedIcon = React.cloneElement(icon as React.ReactElement<any>, {
        className: `mr-3 text-sky-600 ${(icon.props as { className?: string }).className || ''}`.trim(),
        size: 24,
    });
    
    const finalClassName = ["bg-white rounded-lg shadow-md p-6 mb-4 border border-slate-200", className].filter(Boolean).join(' ');

    return (
        <div className={finalClassName}>
            <div className="flex items-center mb-4">
                {clonedIcon}
                <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                {status && (
                <div className="ml-auto">
                    {status === 'positive' && <CheckCircle className="text-green-500" size={20} />}
                    {status === 'negative' && <XCircle className="text-red-500" size={20} />}
                    {status === 'warning' && <AlertTriangle className="text-yellow-500" size={20} />}
                </div>
                )}
            </div>
            {children}
        </div>
    );
};

export default AssessmentCard;