'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={clsx(
            'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
            'w-[calc(100%-1.5rem)] sm:w-full',
            sizeStyles[size],
            'bg-card rounded-xl shadow-2xl border border-border',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-border">
            <Dialog.Title className="text-lg sm:text-xl font-bold text-foreground truncate pr-2">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-accent transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Content */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 max-h-[70vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 border-t border-border bg-muted/30 flex-wrap">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
