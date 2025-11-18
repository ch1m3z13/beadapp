'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

type StatusType = 'active' | 'success' | 'pending' | 'error' | 'idle';

interface ProjectStatusIndicatorProps {
  status: StatusType;
  label?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const ProjectStatusIndicator = ({
  status,
  label,
  showLabel = true,
  size = 'md',
  className = '',
  animated = true
}: ProjectStatusIndicatorProps) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'active':
        return {
          color: 'text-primary bg-primary/10 border-primary/20',
          icon: 'ArrowPathIcon',
          defaultLabel: 'Active',
          dotColor: 'bg-primary'
        };
      case 'success':
        return {
          color: 'text-success bg-success/10 border-success/20',
          icon: 'CheckCircleIcon',
          defaultLabel: 'Completed',
          dotColor: 'bg-success'
        };
      case 'pending':
        return {
          color: 'text-warning bg-warning/10 border-warning/20',
          icon: 'ClockIcon',
          defaultLabel: 'Pending',
          dotColor: 'bg-warning'
        };
      case 'error':
        return {
          color: 'text-error bg-error/10 border-error/20',
          icon: 'ExclamationTriangleIcon',
          defaultLabel: 'Error',
          dotColor: 'bg-error'
        };
      case 'idle':
      default:
        return {
          color: 'text-muted-foreground bg-muted border-border',
          icon: 'PauseIcon',
          defaultLabel: 'Idle',
          dotColor: 'bg-muted-foreground'
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1 text-xs',
          icon: 12,
          dot: 'w-2 h-2'
        };
      case 'lg':
        return {
          container: 'px-4 py-2 text-base',
          icon: 20,
          dot: 'w-3 h-3'
        };
      case 'md':
      default:
        return {
          container: 'px-3 py-1.5 text-sm',
          icon: 16,
          dot: 'w-2.5 h-2.5'
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);
  const displayLabel = label || config.defaultLabel;

  if (!showLabel) {
    return (
      <div 
        className={`relative inline-flex items-center justify-center ${className}`}
        title={displayLabel}
      >
        <div 
          className={`
            ${sizeClasses.dot} ${config.dotColor} rounded-full
            ${animated && status === 'active' ? 'animate-pulse' : ''}
          `}
        />
      </div>
    );
  }

  return (
    <div 
      className={`
        inline-flex items-center gap-2 ${sizeClasses.container} 
        ${config.color} rounded-full border font-medium
        transition-smooth ${className}
      `}
    >
      <Icon 
        name={config.icon as any}
        size={sizeClasses.icon}
        className={`
          ${animated && status === 'active' ? 'animate-spin' : ''}
          flex-shrink-0
        `}
      />
      {showLabel && (
        <span className="truncate">
          {displayLabel}
        </span>
      )}
    </div>
  );
};

export default ProjectStatusIndicator;