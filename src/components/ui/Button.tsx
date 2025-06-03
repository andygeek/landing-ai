import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  asChild = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  // Si asChild es true, renderizar solo los children (para uso con Link)
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      className: clsx(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        
        // Variants
        {
          'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary': variant === 'primary',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring': variant === 'secondary',
          'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring': variant === 'ghost',
          'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500': variant === 'destructive',
        },
        
        // Sizes
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4 py-2': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        
        // States
        {
          'opacity-50 cursor-not-allowed': disabled || isLoading,
          'cursor-pointer': !disabled && !isLoading,
        },
        
        className
      )
    });
  }

  return (
    <button
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        
        // Variants
        {
          'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary': variant === 'primary',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring': variant === 'secondary',
          'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring': variant === 'ghost',
          'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500': variant === 'destructive',
        },
        
        // Sizes
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4 py-2': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        
        // States
        {
          'opacity-50 cursor-not-allowed': disabled || isLoading,
          'cursor-pointer': !disabled && !isLoading,
        },
        
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}