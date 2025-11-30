
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
  const baseStyles = "font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-px active:translate-y-0";
  
  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500';
      break;
    case 'secondary':
      variantStyles = 'bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-slate-400 shadow-sm';
      break;
    case 'danger':
      variantStyles = 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
      break;
    case 'warning':
      variantStyles = 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-400';
      break;
    case 'success':
      variantStyles = 'bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-400';
      break;
    case 'info':
      variantStyles = 'bg-cyan-500 hover:bg-cyan-600 text-white focus:ring-cyan-400';
      break;
    case 'violet':
      variantStyles = 'bg-violet-600 hover:bg-violet-700 text-white focus:ring-violet-500';
      break;
    case 'yellow':
      variantStyles = 'bg-yellow-400 hover:bg-yellow-500 text-black focus:ring-yellow-300';
      break;
    case 'lime':
      variantStyles = 'bg-lime-500 hover:bg-lime-600 text-white focus:ring-lime-400';
      break;
    case 'teal':
      variantStyles = 'bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-400';
      break;
    case 'orange':
      variantStyles = 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-400';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent hover:bg-slate-100 text-indigo-600 focus:ring-indigo-500 shadow-none hover:shadow-none';
      break;
  }

  let sizeStyles = '';
  let iconSize = 20;
  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1.5 text-xs';
      iconSize = 16;
      break;
    case 'md':
      sizeStyles = 'px-4 py-2 text-sm';
      iconSize = 18;
      break;
    case 'lg':
      sizeStyles = 'px-5 py-2.5 text-base';
      iconSize = 20;
      break;
    case 'xl':
      sizeStyles = 'px-6 py-3 text-lg';
      iconSize = 22;
      break;
  }

  const widthStyles = fullWidth ? 'w-full' : '';
  const justifyClass = `justify-${justify}`;

  let clonedLeftIcon = null;
  if (leftIcon) {
      const iconProps: { size: number; className: string; } = {
          size: iconSize,
          className: 'mr-2',
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
          className: 'ml-2',
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