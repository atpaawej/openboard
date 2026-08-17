import React from 'react';

interface StructuralRuleProps {
  variant?: 'solid' | 'dashed' | 'dotted';
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

export function StructuralRule({
  variant = 'solid',
  orientation = 'horizontal',
  label,
  className = '',
}: StructuralRuleProps) {
  const isHorizontal = orientation === 'horizontal';

  const lineStyle = {
    solid: 'border-white/[0.08]',
    dashed: 'border-dashed border-white/[0.14]',
    dotted: 'border-dotted border-white/[0.16]',
  }[variant];

  if (!isHorizontal) {
    return (
      <div
        className={`h-full border-r ${lineStyle} pointer-events-none select-none relative ${className}`}
      />
    );
  }

  if (label) {
    return (
      <div className={`w-full flex items-center gap-3 my-0 py-0 ${className}`}>
        <div className={`flex-1 border-t ${lineStyle}`} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 select-none px-1">
          {label}
        </span>
        <div className={`flex-1 border-t ${lineStyle}`} />
      </div>
    );
  }

  return (
    <div
      className={`w-full border-t ${lineStyle} pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
}

export function DashedDivider({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-full border-t border-dashed border-white/[0.12] pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
