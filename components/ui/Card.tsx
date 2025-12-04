import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  icon?: React.ReactElement;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  actions?: ReactNode; // For buttons or links at the bottom of the card
  footer?: ReactNode; // For less prominent info below actions or main content
  titleRightElement?: ReactNode; // Element to align to the right of the title
}

const Card: React.FC<CardProps> = ({ title, icon, children, className = '', titleClassName = '', actions, footer, titleRightElement }) => {
  let clonedIcon = null;
  if (icon) {
      const iconProps: { size: number; className: string; } = {
          size: 28,
          className: 'mr-3 text-slate-600 group-hover:text-indigo-600 transition-colors duration-200',
      };
      if ((icon.props as any).className) {
        iconProps.className = `mr-3 ${(icon.props as any).className}`;
      }
      clonedIcon = React.cloneElement(icon as React.ReactElement<any>, iconProps);
  }
  
  // Modern card style: white bg, larger rounded corners, subtle shadow that lifts on hover (optional)
  const finalClassName = ['bg-white', 'rounded-2xl', 'shadow-sm', 'border', 'border-slate-100', 'overflow-hidden', className].filter(Boolean).join(' ');
  const finalTitleClassName = ['text-xl', 'sm:text-2xl', 'font-bold', 'text-slate-800', 'tracking-tight', titleClassName].filter(Boolean).join(' ');

  return (
    <div className={finalClassName}>
      {title && (
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/50">
          <div className="flex items-center">
            {clonedIcon}
            <h2 className={finalTitleClassName}>{title}</h2>
          </div>
          {titleRightElement && <div>{titleRightElement}</div>}
        </div>
      )}
      <div className="p-5 sm:p-6 text-slate-600 space-y-5 leading-relaxed">
        {children}
      </div>
      {actions && (
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-3 items-center justify-end rounded-b-2xl">
          {actions}
        </div>
      )}
       {footer && !actions && ( // If footer exists but no actions, add border top to content
        <div className="p-4 sm:p-5 border-t border-slate-100 text-xs text-slate-400 bg-slate-50/30 rounded-b-2xl">
          {footer}
        </div>
      )}
      {footer && actions && ( // If footer exists with actions, it's outside the actions div
         <div className="px-6 pb-4 pt-2 text-xs text-slate-400 bg-slate-50/50 rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;