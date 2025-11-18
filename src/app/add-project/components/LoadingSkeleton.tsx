import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-6 bg-muted rounded w-32"></div>
        <div className="h-4 bg-muted rounded w-48"></div>
      </div>

      {/* Form fields skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-24"></div>
          <div className="h-12 bg-muted rounded"></div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-32"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-28"></div>
          <div className="h-12 bg-muted rounded"></div>
        </div>
      </div>

      {/* Toggle skeleton */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted rounded w-36"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
          <div className="h-6 w-11 bg-muted rounded-full"></div>
        </div>
      </div>

      {/* Actions skeleton */}
      <div className="flex gap-3 pt-6">
        <div className="h-12 bg-muted rounded flex-1"></div>
        <div className="h-12 bg-muted rounded flex-1"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;