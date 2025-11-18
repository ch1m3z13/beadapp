import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-subtle animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-full"></div>
          <div>
            <div className="h-4 bg-muted rounded w-24 mb-1"></div>
            <div className="h-3 bg-muted rounded w-16"></div>
          </div>
        </div>
        <div className="h-6 bg-muted rounded-full w-16"></div>
      </div>

      {/* Content Skeleton */}
      <div className="mb-4 space-y-2">
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-4/5"></div>
        <div className="h-4 bg-muted rounded w-3/5"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded w-6"></div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded w-6"></div>
        </div>
      </div>

      {/* Actions Skeleton */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 bg-muted rounded w-16"></div>
          <div className="h-8 bg-muted rounded w-16"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 bg-muted rounded w-20"></div>
          <div className="h-8 bg-muted rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;