import React, { ReactNode } from 'react';
import Link from 'next/link';

export type ButtonVariant = 'brand' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'terminal';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  ariaLabel?: string;
}

export function Button({
  children,
  variant = 'brand',
  size = 'md',
  href,
  external,
  icon,
  iconRight,
  className = '',
  onClick,
  type = 'button',
  disabled,
  ariaLabel,
}: ButtonProps) {
  const sizeClasses: Record<ButtonSize, string> = {
    xs: 'px-2 py-0.5 text-xs gap-1.5 rounded',
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-md',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2 rounded-md',
    lg: 'px-5 py-2.5 text-sm sm:text-base gap-2.5 rounded-md',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    brand:
      'text-white bg-blue-600 hover:bg-blue-500 font-semibold border border-blue-500/40 shadow-sm shadow-blue-950/40 focus-visible:ring-2 focus-visible:ring-blue-500/50 active:scale-[0.98]',
    primary:
      'text-white bg-blue-600 hover:bg-blue-500 font-semibold border border-blue-500/40 shadow-sm shadow-blue-950/40 focus-visible:ring-2 focus-visible:ring-blue-500/50 active:scale-[0.98]',
    secondary:
      'text-zinc-200 bg-[#161720] hover:bg-[#1e2029] hover:text-white font-medium border border-white/[0.10] hover:border-white/[0.20] active:scale-[0.98]',
    outline:
      'text-zinc-300 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] font-medium border border-white/[0.10] hover:border-blue-500/40 active:scale-[0.98]',
    ghost:
      'text-zinc-400 hover:text-white hover:bg-white/[0.04] font-medium active:scale-[0.98]',
    terminal:
      'text-zinc-300 bg-[#0c0d10] hover:bg-[#121318] font-mono border border-white/[0.10] hover:border-white/[0.20] active:scale-[0.98]',
  };

  const disabledClasses = disabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : '';

  const combinedClass = `inline-flex items-center justify-center font-sans tracking-tight transition-all duration-150 cursor-pointer select-none focus:outline-none ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`;

  const content = (
    <>
      {icon && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
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
          onClick={onClick}
          aria-label={ariaLabel}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClass} onClick={onClick} aria-label={ariaLabel}>
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
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
