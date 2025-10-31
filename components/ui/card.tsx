'use client';

import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outline' | 'modern' | 'flat';
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
    default: 'bg-card shadow-md border border-border/60 hover:shadow-lg hover:border-border/80 transition-all duration-300',
    elevated: 'bg-card shadow-xl border border-border/30 hover:shadow-2xl transition-all duration-300',
    outline: 'bg-card border-2 border-border shadow-sm hover:shadow-md transition-all duration-300',
    modern: 'bg-gradient-to-br from-card to-card/95 shadow-lg border border-border/40 hover:shadow-xl hover:border-border/60 transition-all duration-300 backdrop-blur-sm',
    flat: 'bg-card shadow-none border border-border/40 hover:shadow-md transition-all duration-300',
  };

  return (
    <div 
      className={clsx(
        'rounded-2xl overflow-hidden', 
        variantStyles[variant], 
        className
      )} 
      {...props}
    >
      {header && (
        <div className="px-6 py-5 border-b border-border/40 bg-gradient-to-r from-card via-card/98 to-background/20">
          {header}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <div className="px-6 py-5 border-t border-border/40 bg-gradient-to-r from-background/10 via-card/98 to-card">
          {footer}
        </div>
      )}
    </div>
  );
};
