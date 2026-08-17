import React from 'react';

interface TechnicalFrameProps {
  children: React.ReactNode;
  className?: string;
  withGuides?: boolean;
  withOuterBorders?: boolean;
  withTicks?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  id?: string;
}

export function TechnicalFrame({
  children,
  className = '',
  withGuides = false,
  withOuterBorders = true,
  withTicks = true,
  maxWidth = 'lg',
  id,
}: TechnicalFrameProps) {
  const maxWClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-full',
  }[maxWidth];

  return (
    <div
      id={id}
      className={`w-full mx-auto relative ${maxWClasses} ${
        withOuterBorders ? 'border-x border-white/[0.08]' : ''
      } ${className}`}
    >
      {/* Optional subtle 12-column vertical dashed construction guides */}
      {withGuides && (
        <div className="absolute inset-0 pointer-events-none hidden lg:grid grid-cols-12 gap-0 z-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`h-full border-r ${
                i === 11 ? 'border-r-0' : 'border-dashed border-white/[0.04]'
              }`}
            />
          ))}
        </div>
      )}

      {/* Structural Corner Ticks */}
      {withOuterBorders && withTicks && (
        <>
          <span
            className="absolute -top-2.5 -left-2 text-zinc-500 font-mono text-xs select-none pointer-events-none z-20"
            aria-hidden="true"
          >
            +
          </span>
          <span
            className="absolute -top-2.5 -right-2 text-zinc-500 font-mono text-xs select-none pointer-events-none z-20"
            aria-hidden="true"
          >
            +
          </span>
          <span
            className="absolute -bottom-2.5 -left-2 text-zinc-500 font-mono text-xs select-none pointer-events-none z-20"
            aria-hidden="true"
          >
            +
          </span>
          <span
            className="absolute -bottom-2.5 -right-2 text-zinc-500 font-mono text-xs select-none pointer-events-none z-20"
            aria-hidden="true"
          >
            +
          </span>
        </>
      )}

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function SectionFrame({
  children,
  className = '',
  withBottomRule = true,
  withTopRule = false,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  withBottomRule?: boolean;
  withTopRule?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`w-full relative ${
        withTopRule ? 'border-t border-white/[0.08]' : ''
      } ${withBottomRule ? 'border-b border-white/[0.08]' : ''} ${className}`}
    >
      {children}
    </section>
  );
}
