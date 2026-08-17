import React from 'react';

export type BadgeVariant = 'brand' | 'blue' | 'mono' | 'success' | 'warning' | 'outline' | 'subtle';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'brand',
  size = 'sm',
  icon,
  dot = false,
  className = '',
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    brand: 'bg-blue-600/15 text-blue-400 border-blue-500/30',
    blue: 'bg-blue-600/15 text-blue-400 border-blue-500/30',
    mono: 'bg-[#181920] text-zinc-300 border-white/[0.10] font-mono',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    outline: 'bg-white/[0.02] text-zinc-300 border-white/[0.10]',
    subtle: 'bg-[#161720] text-zinc-400 border-white/[0.06]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 tracking-tight rounded',
    md: 'text-xs px-2.5 py-1 tracking-tight rounded',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-medium select-none ${variantStyles[variant]} ${sizeStyles} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'success'
              ? 'bg-emerald-400'
              : variant === 'warning'
              ? 'bg-amber-400'
              : 'bg-blue-400'
          }`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
