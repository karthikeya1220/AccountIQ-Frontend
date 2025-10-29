'use client';

import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outline';
}

export const Card: React.FC<CardProps> = ({ 
  header, 
  footer, 
  children, 
  className, 
  variant = 'default', 
  ...props 
}) => {
  const variantStyles = {
    default: 'bg-card shadow-sm border border-border hover:shadow-md transition-shadow duration-200',
    elevated: 'bg-card shadow-lg border border-border/50',
    outline: 'bg-card border-2 border-border',
  };

  return (
    <div 
      className={clsx(
        'rounded-xl overflow-hidden', 
        variantStyles[variant], 
        className
      )} 
      {...props}
    >
      {header && (
        <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-background/50 to-transparent">
          {header}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <div className="px-6 py-5 border-t border-border bg-gradient-to-r from-background/50 to-transparent">
          {footer}
        </div>
      )}
    </div>
  );
};
