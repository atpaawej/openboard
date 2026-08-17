import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricBoxProps {
  value: string;
  label: string;
  detail: string;
  icon?: LucideIcon;
  variant?: 'blue' | 'emerald' | 'default';
  className?: string;
  withBorderRight?: boolean;
  withBorderBottom?: boolean;
}

export function MetricBox({
  value,
  label,
  detail,
  icon: Icon,
  variant = 'default',
  className = '',
  withBorderRight = true,
  withBorderBottom = true,
}: MetricBoxProps) {
  const valueColor = {
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    default: 'text-white',
  }[variant];

  const borderClass = [
    withBorderRight ? 'border-r border-white/[0.08]' : '',
    withBorderBottom ? 'border-b border-white/[0.08]' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`p-5 sm:p-6 bg-[#121318] hover:bg-[#161720] transition-colors flex flex-col justify-between ${borderClass} ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${valueColor}`}>
          {value}
        </span>
        {Icon && (
          <div className="w-7 h-7 rounded bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h4 className="text-xs sm:text-sm font-bold text-zinc-100 tracking-tight">{label}</h4>
        <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}
