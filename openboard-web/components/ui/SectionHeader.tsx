import React, { ReactNode } from 'react';
import { Badge, BadgeVariant } from './Badge';

interface SectionHeaderProps {
  index?: string;
  eyebrow?: string;
  eyebrowVariant?: BadgeVariant;
  eyebrowIcon?: ReactNode;
  title: string | ReactNode;
  description?: string | ReactNode;
  align?: 'center' | 'left';
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  index,
  eyebrow,
  eyebrowVariant = 'blue',
  eyebrowIcon,
  title,
  description,
  align = 'center',
  action,
  className = '',
}: SectionHeaderProps) {
  const isCentered = align === 'center';

  return (
    <div
      className={`space-y-3 ${
        isCentered
          ? 'text-center max-w-3xl mx-auto'
          : 'flex flex-col md:flex-row md:items-end justify-between gap-4'
      } ${className}`}
    >
      <div className={isCentered ? 'space-y-2' : 'space-y-2 max-w-2xl'}>
        {(index || eyebrow) && (
          <div className={`flex items-center gap-2 ${isCentered ? 'justify-center' : ''}`}>
            {index && (
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold select-none">
                {index}
              </span>
            )}
            {index && eyebrow && <span className="text-zinc-600 text-xs font-mono">//</span>}
            {eyebrow && (
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold">
                {eyebrow}
              </span>
            )}
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {title}
        </h2>

        {description && (
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
            {description}
          </p>
        )}
      </div>

      {!isCentered && action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
