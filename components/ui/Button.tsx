import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'warning' | 'success' | 'info' | 'violet' | 'yellow' | 'lime' | 'teal' | 'orange';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  justify?: 'start' | 'center' | 'end' | 'between';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  justify = 'center',
  ...props
}) => {
  // Modern button base: rounded-xl, font-medium, smooth transitions, subtle active state
  const baseStyles = "font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  let variantStyles = '';
  switch (variant) {
    case 'primary': // Indigo
      variantStyles = 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 focus:ring-indigo-500 border border-transparent';
      break;
    case 'secondary': // Slate/White
      variantStyles = 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm focus:ring-slate-200';
      break;
    case 'danger': // Red
      variantStyles = 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-200 focus:ring-red-500 border border-transparent';
      break;
    case 'warning': // Amber
      variantStyles = 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-200 focus:ring-amber-400 border border-transparent';
      break;
    case 'success': // Emerald
      variantStyles = 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 focus:ring-emerald-500 border border-transparent';
      break;
    case 'info': // Sky
      variantStyles = 'bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-200 focus:ring-sky-400 border border-transparent';
      break;
    case 'violet': // Violet
      variantStyles = 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200 focus:ring-violet-500 border border-transparent';
      break;
    case 'yellow': // Yellow (High viz)
      variantStyles = 'bg-yellow-400 hover:bg-yellow-500 text-slate-900 shadow-md shadow-yellow-200 focus:ring-yellow-300 border border-transparent';
      break;
    case 'lime': // Lime
      variantStyles = 'bg-lime-500 hover:bg-lime-600 text-white shadow-md shadow-lime-200 focus:ring-lime-400 border border-transparent';
      break;
    case 'teal': // Teal
      variantStyles = 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-200 focus:ring-teal-500 border border-transparent';
      break;
    case 'orange': // Orange
      variantStyles = 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200 focus:ring-orange-400 border border-transparent';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-indigo-600 focus:ring-indigo-500 shadow-none border border-transparent';
      break;
  }

  let sizeStyles = '';
  let iconSize = 20;
  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1.5 text-xs';
      iconSize = 14;
      break;
    case 'md':
      sizeStyles = 'px-4 py-2 text-sm';
      iconSize = 18;
      break;
    case 'lg':
      sizeStyles = 'px-6 py-3 text-base';
      iconSize = 20;
      break;
    case 'xl':
      sizeStyles = 'px-8 py-4 text-lg';
      iconSize = 24;
      break;
  }

  const widthStyles = fullWidth ? 'w-full' : '';
  const justifyClass = `justify-${justify}`;

  let clonedLeftIcon = null;
  if (leftIcon) {
      const iconProps: { size: number; className: string; } = {
          size: iconSize,
          className: 'mr-2 -ml-0.5',
      };
      if ((leftIcon.props as any).className) {
        iconProps.className += ' ' + (leftIcon.props as any).className;
      }
      clonedLeftIcon = React.cloneElement(leftIcon as React.ReactElement<any>, iconProps);
  }

  let clonedRightIcon = null;
  if (rightIcon) {
      const iconProps: { size: number; className: string; } = {
          size: iconSize,
          className: 'ml-2 -mr-0.5',
      };
      if ((rightIcon.props as any).className) {
        iconProps.className += ' ' + (rightIcon.props as any).className;
      }
      clonedRightIcon = React.cloneElement(rightIcon as React.ReactElement<any>, iconProps);
  }

  const finalClassName = [baseStyles, variantStyles, sizeStyles, widthStyles, justifyClass, className].filter(Boolean).join(' ');

  return (
    <button
      className={finalClassName}
      {...props}
    >
      {clonedLeftIcon}
      {children}
      {clonedRightIcon}
    </button>
  );
};

export default Button;