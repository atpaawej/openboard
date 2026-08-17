import React, { ReactNode } from 'react';
import Link from 'next/link';

interface ButtonProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  external?: boolean;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  external,
  icon,
  className = '',
  onClick,
  type = 'button',
  disabled,
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-xs sm:text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm sm:text-base gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'text-white bg-blue-600 hover:bg-blue-500 font-semibold shadow-sm shadow-blue-600/20 active:scale-[0.98]',
    secondary:
      'text-gray-200 bg-[#16171e] hover:bg-[#1e2029] hover:text-white font-medium border border-white/10 hover:border-blue-500/40 active:scale-[0.98]',
    outline:
      'text-blue-400 hover:text-blue-300 bg-blue-950/20 hover:bg-blue-950/40 font-semibold border border-blue-500/30 hover:border-blue-500/60 active:scale-[0.98]',
    ghost:
      'text-gray-400 hover:text-white hover:bg-white/5 font-medium',
  }[variant];

  const combinedClass = `inline-flex items-center justify-center rounded-lg transition-all ${sizeClasses} ${variantClasses} ${className}`;

  const content = (
    <>
      {icon}
      {children && <span>{children}</span>}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClass}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClass}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClass}
    >
      {content}
    </button>
  );
}
