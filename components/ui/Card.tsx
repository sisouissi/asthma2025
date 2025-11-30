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
          className: 'mr-3 text-slate-700',
      };
      if ((icon.props as any).className) {
        iconProps.className += ' ' + (icon.props as any).className;
      }
      clonedIcon = React.cloneElement(icon as React.ReactElement<any>, iconProps);
  }
  
  const finalClassName = ['bg-white', 'rounded-xl', 'shadow-md', className].filter(Boolean).join(' ');
  const finalTitleClassName = ['text-2xl', 'font-bold', 'text-slate-900', 'tracking-tight', titleClassName].filter(Boolean).join(' ');

  return (
    <div className={finalClassName}>
      {title && (
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200">
          <div className="flex items-center">
            {clonedIcon}
            <h2 className={finalTitleClassName}>{title}</h2>
          </div>
          {titleRightElement && <div>{titleRightElement}</div>}
        </div>
      )}
      <div className="p-4 sm:p-6 text-slate-700 space-y-4">
        {children}
      </div>
      {actions && (
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          {actions}
        </div>
      )}
       {footer && !actions && ( // If footer exists but no actions, add border top to content
        <div className="p-4 sm:p-5 border-t border-slate-200 text-xs text-slate-500">
          {footer}
        </div>
      )}
      {footer && actions && ( // If footer exists with actions, it's outside the actions div
         <div className="p-3 sm:p-4 border-t border-slate-200 text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;