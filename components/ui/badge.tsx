'use client';

import React from 'react';
import clsx from 'clsx';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  size = 'md', 
  className, 
  children, 
  ...props 
}) => {
  const variantStyles = {
    default: 'bg-secondary text-secondary-foreground',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span 
      className={clsx(
        'inline-flex items-center rounded-full font-semibold', 
        variantStyles[variant], 
        sizeStyles[size], 
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
};
