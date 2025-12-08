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
      size: 24,
      className: 'mr-3 text-[#004b85] group-hover:text-[#003865] transition-colors duration-200',
    };
    if ((icon.props as any).className) {
      iconProps.className = `mr-3 ${(icon.props as any).className}`;
    }
    clonedIcon = React.cloneElement(icon as React.ReactElement<any>, iconProps);
  }

  // Modern card style: glass effect, hover lift, subtle border
  const finalClassName = [
    'bg-white/90',
    'backdrop-blur-sm',
    'rounded-2xl',
    'shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
    'border',
    'border-white/50',
    'overflow-hidden',
    'card-hover', // My custom utility
    'group',
    className
  ].filter(Boolean).join(' ');

  const finalTitleClassName = ['text-2xl', 'font-bold', 'text-slate-800', 'tracking-tight', titleClassName].filter(Boolean).join(' ');

  return (
    <div className={finalClassName}>
      {title && (
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-white/50 to-transparent">
          <div className="flex items-center">
            {clonedIcon}
            <h2 className={finalTitleClassName}>{title}</h2>
          </div>
          {titleRightElement && <div>{titleRightElement}</div>}
        </div>
      )}
      <div className="p-6 text-slate-600 space-y-4 leading-relaxed relative">
        {/* Subtle decorative background blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#004b85]/5 rounded-full blur-3xl -z-10 translate-x-12 -translate-y-12"></div>
        {children}
      </div>
      {actions && (
        <div className="p-4 sm:p-6 border-t border-slate-100/60 bg-slate-50/30 flex flex-wrap gap-3 items-center justify-end rounded-b-2xl">
          {actions}
        </div>
      )}
      {footer && !actions && (
        <div className="px-6 py-4 border-t border-slate-100/60 text-xs text-slate-400 bg-slate-50/30">
          {footer}
        </div>
      )}
      {footer && actions && (
        <div className="px-6 pb-4 pt-2 text-xs text-slate-400 bg-slate-50/30">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;