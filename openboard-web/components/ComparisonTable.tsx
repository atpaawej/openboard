import React from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight } from 'lucide-react';

interface FeatureRow {
  feature: string;
  openboard: boolean | string;
  competitor: boolean | string;
  description: string;
}

interface ComparisonTableProps {
  competitorName: string;
  features: FeatureRow[];
  compareSlug?: string;
}

export function ComparisonTable({ competitorName, features, compareSlug }: ComparisonTableProps) {
  const renderCell = (val: boolean | string, isBrand = false) => {
    if (typeof val === 'boolean') {
      return val ? (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
          <Check className="w-3.5 h-3.5" />
        </span>
      ) : (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
          <X className="w-3.5 h-3.5" />
        </span>
      );
    }
    return (
      <span className={`text-xs font-mono font-medium ${isBrand ? 'text-blue-300' : 'text-zinc-300'}`}>
        {val}
      </span>
    );
  };

  return (
    <div className="w-full border border-white/[0.08] bg-[#0c0d10] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-[#121318]">
              <th className="p-4 sm:p-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                Engineering Requirement
              </th>
              <th className="p-4 sm:p-5 text-xs font-bold text-blue-400 uppercase tracking-wider font-mono bg-blue-600/10 border-x border-blue-500/20">
                OpenBoard (Localhost)
              </th>
              <th className="p-4 sm:p-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                {competitorName}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] text-xs sm:text-sm">
            {features.map((item, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 sm:p-5">
                  <div className="font-semibold text-zinc-100">{item.feature}</div>
                  <div className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{item.description}</div>
                </td>
                <td className="p-4 sm:p-5 bg-blue-600/[0.03] border-x border-blue-500/20">
                  {renderCell(item.openboard, true)}
                </td>
                <td className="p-4 sm:p-5 text-zinc-400">
                  {renderCell(item.competitor, false)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {compareSlug && (
        <div className="p-4 bg-[#121318] border-t border-white/[0.08] flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-zinc-400">100% Free &amp; MIT Licensed. Zero credit card or account needed.</span>
          <Link
            href={`/compare/${compareSlug}`}
            className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            <span>Full {competitorName} comparison breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
