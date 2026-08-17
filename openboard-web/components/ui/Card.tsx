import React from 'react';

export type CardVariant = 'default' | 'raised' | 'interactive' | 'outline' | 'brand';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  onClick?: () => void;
}

export function Card({
  children,
  variant = 'default',
  className = '',
  onClick,
}: CardProps) {
  const variantStyles: Record<CardVariant, string> = {
    default: 'bg-[#0e1017] border border-white/[0.08]',
    raised: 'bg-[#141722] border border-white/[0.10]',
    interactive:
      'bg-[#0e1017] border border-white/[0.08] hover:border-white/[0.20] hover:bg-[#121520] transition-all duration-200 cursor-pointer',
    outline: 'bg-transparent border border-white/[0.08]',
    brand:
      'bg-gradient-to-b from-[#141620] to-[#0e1017] border border-orange-500/30',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-xl relative overflow-hidden ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-5 sm:p-6 pb-2 sm:pb-3 ${className}`}>{children}</div>;
}

export function CardTitle({
  children,
  className = '',
  as: Component = 'h3',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'h2' | 'h3' | 'h4' | 'div';
}) {
  return (
    <Component className={`text-base sm:text-lg font-bold text-white tracking-tight ${className}`}>
      {children}
    </Component>
  );
}

export function CardDescription({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-xs sm:text-sm text-zinc-400 leading-relaxed mt-1.5 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-5 sm:p-6 pt-2 sm:pt-3 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`px-5 sm:px-6 py-3 sm:py-4 border-t border-white/[0.06] bg-black/20 flex items-center justify-between text-xs text-zinc-400 ${className}`}
    >
      {children}
    </div>
  );
}
