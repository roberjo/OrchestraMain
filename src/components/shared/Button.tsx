import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
  children: ReactNode;
}

const variantClasses = {
  primary: 'bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] disabled:bg-[var(--color-primary-300)]',
  secondary: 'border border-[var(--color-border-light)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] disabled:text-[var(--color-text-tertiary)]',
  danger: 'bg-[var(--color-danger-600)] text-white hover:bg-[var(--color-danger-700)] disabled:bg-[var(--color-danger-300)]',
};

const sizeClasses = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
};

export function Button({ variant = 'secondary', size = 'md', children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded font-medium transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
