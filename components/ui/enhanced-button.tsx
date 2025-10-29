'use client';

import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const EnhancedButton: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'text-primary-foreground bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg focus:ring-primary',
    secondary: 'text-secondary-foreground bg-secondary hover:bg-secondary/80 border border-border focus:ring-primary',
    danger: 'text-white bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg focus:ring-red-500',
    success: 'text-white bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg focus:ring-green-500',
    outline: 'text-foreground bg-transparent hover:bg-accent border-2 border-border hover:border-primary focus:ring-primary',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-2',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-3',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        (loading || disabled) && 'opacity-60 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
      )}
      {children}
    </button>
  );
};
