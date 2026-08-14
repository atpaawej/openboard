import React from 'react';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  className = '',
}) => {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height:
          height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        borderRadius:
          borderRadius !== undefined
            ? typeof borderRadius === 'number'
              ? `${borderRadius}px`
              : borderRadius
            : undefined,
      }}
    />
  );
};

export const BoardCardSkeleton: React.FC = () => {
  return (
    <div className="board-card-skeleton">
      <Skeleton height={140} borderRadius={6} />
      <div className="skeleton-details">
        <Skeleton width="65%" height={16} borderRadius={4} />
        <Skeleton width="90%" height={12} borderRadius={4} />
        <div className="skeleton-meta-row">
          <Skeleton width="35%" height={11} borderRadius={4} />
        </div>
      </div>
    </div>
  );
};
