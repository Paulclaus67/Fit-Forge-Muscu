// src/components/ui/PrimaryButton.tsx
import React from 'react';
import { Link } from 'react-router-dom';

type CommonProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

type ButtonProps =
  | (CommonProps & {
      as?: 'button';
      onClick?: () => void;
      to?: never;
      type?: 'button' | 'submit' | 'reset';
    })
  | (CommonProps & {
      as: 'link';
      to: string;
      onClick?: never;
      type?: never;
    });

const sizeClasses = {
  sm: 'px-3 py-2 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
};

const variantClasses = {
  primary:
    'btn-primary text-app font-semibold shadow-md hover:shadow-lg',
  secondary:
    'btn-secondary text-app font-medium hover:bg-app',
  danger:
    'btn-danger font-semibold shadow-md hover:shadow-lg',
  ghost:
    'bg-transparent text-primary font-medium hover:bg-primary/10',
};

const baseClasses =
  'inline-flex justify-center items-center font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

export const PrimaryButton: React.FC<ButtonProps> = (props) => {
  const {
    children,
    className = '',
    disabled,
    variant = 'primary',
    size = 'md',
  } = props;

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (props.as === 'link') {
    return (
      <Link
        to={props.to}
        className={`${classes} text-decoration-none`}
        {...(disabled ? { onClick: (e) => e.preventDefault() } : {})}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type || 'button'}
      onClick={props.onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
};
