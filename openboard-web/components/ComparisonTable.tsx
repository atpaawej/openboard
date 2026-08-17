import React from 'react';
import { Check, X, Sparkles, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
  const renderCell = (val: boolean | string) => {
    if (typeof val === 'boolean') {
      return val ? (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400">
          <Check className="w-4 h-4" />
        </span>
      ) : (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/10 text-red-400">
          <X className="w-4 h-4" />
        </span>
      );
    }
    return <span className="text-xs sm:text-sm font-medium">{val}</span>;
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121318] overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-[#0e0f14]">
              <th className="p-4 sm:p-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Feature / Capability
              </th>
              <th className="p-4 sm:p-5 text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-950/20 border-x border-blue-500/20">
                ✦ OpenBoard
              </th>
              <th className="p-4 sm:p-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {competitorName}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
            {features.map((item, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 sm:p-5">
                  <div className="font-semibold text-gray-100">{item.feature}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>
                </td>
                <td className="p-4 sm:p-5 text-blue-200 bg-blue-950/10 border-x border-blue-500/20 font-medium">
                  {renderCell(item.openboard)}
                </td>
                <td className="p-4 sm:p-5 text-gray-400">
                  {renderCell(item.competitor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {compareSlug && (
        <div className="p-4 bg-[#0e0f14] border-t border-white/5 flex items-center justify-between text-xs">
          <span className="text-gray-400">100% Free &amp; MIT Licensed. No credit card or account needed.</span>
          <Link
            href={`/compare/${compareSlug}`}
            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
          >
            <span>Read full {competitorName} comparison breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
