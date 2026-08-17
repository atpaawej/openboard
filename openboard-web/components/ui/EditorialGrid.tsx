import React from 'react';

export type EditorialComposition =
  | '12'
  | '8-4'
  | '7-5'
  | '6-6'
  | '5-7'
  | '4-4-4'
  | '3-3-3-3'
  | 'custom';

interface EditorialGridProps {
  children: React.ReactNode;
  composition?: EditorialComposition;
  className?: string;
  withOuterBorder?: boolean;
  dashedDividers?: boolean;
}

export function EditorialGrid({
  children,
  composition = '6-6',
  className = '',
  withOuterBorder = true,
  dashedDividers = false,
}: EditorialGridProps) {
  const getGridClasses = () => {
    switch (composition) {
      case '12':
        return 'grid grid-cols-1';
      case '8-4':
        return 'grid grid-cols-1 lg:grid-cols-12';
      case '7-5':
        return 'grid grid-cols-1 lg:grid-cols-12';
      case '5-7':
        return 'grid grid-cols-1 lg:grid-cols-12';
      case '6-6':
        return 'grid grid-cols-1 lg:grid-cols-2';
      case '4-4-4':
        return 'grid grid-cols-1 md:grid-cols-3';
      case '3-3-3-3':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      case 'custom':
      default:
        return 'grid grid-cols-1';
    }
  };

  const borderClass = withOuterBorder ? 'border border-white/[0.08]' : '';

  return (
    <div
      className={`w-full bg-[#0c0d10] overflow-hidden ${borderClass} ${getGridClasses()} ${className}`}
    >
      {children}
    </div>
  );
}
