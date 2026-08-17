import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Badge, BadgeVariant } from './Badge';

interface ContentCellProps {
  children?: React.ReactNode;
  metadata?: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
  icon?: LucideIcon;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  colSpan?: string;
  variant?: 'default' | 'raised' | 'subtle' | 'interactive';
  withBorderRight?: boolean;
  withBorderBottom?: boolean;
  withBorderTop?: boolean;
  withBorderLeft?: boolean;
  dashedBorder?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function ContentCell({
  children,
  metadata,
  badge,
  badgeVariant = 'subtle',
  icon: Icon,
  title,
  description,
  action,
  className = '',
  colSpan = '',
  variant = 'default',
  withBorderRight = true,
  withBorderBottom = true,
  withBorderTop = false,
  withBorderLeft = false,
  dashedBorder = false,
  padding = 'md',
}: ContentCellProps) {
  const bgStyles = {
    default: 'bg-[#121318]',
    subtle: 'bg-[#0c0d10]',
    raised: 'bg-[#181920]',
    interactive: 'bg-[#121318] hover:bg-[#161722] transition-colors duration-150',
  }[variant];

  const borderStyle = dashedBorder ? 'border-dashed border-white/[0.12]' : 'border-white/[0.08]';

  const borderClasses = [
    withBorderRight ? `border-r ${borderStyle}` : '',
    withBorderBottom ? `border-b ${borderStyle}` : '',
    withBorderTop ? `border-t ${borderStyle}` : '',
    withBorderLeft ? `border-l ${borderStyle}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }[padding];

  return (
    <div
      className={`relative flex flex-col justify-between ${bgStyles} ${borderClasses} ${colSpan} ${paddingStyles} ${className}`}
    >
      <div className="space-y-3">
        {(metadata || badge || Icon) && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {Icon && (
                <div className="w-7 h-7 rounded bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-blue-400">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              )}
              {metadata && (
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold select-none">
                  {metadata}
                </span>
              )}
            </div>
            {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
          </div>
        )}

        {title && (
          typeof title === 'string' ? (
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
              {title}
            </h3>
          ) : (
            title
          )
        )}

        {description && (
          typeof description === 'string' ? (
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              {description}
            </p>
          ) : (
            description
          )
        )}

        {children}
      </div>

      {action && <div className="pt-4 mt-2 border-t border-white/[0.06]">{action}</div>}
    </div>
  );
}
