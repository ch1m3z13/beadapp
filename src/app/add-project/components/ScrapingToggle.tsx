'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ScrapingToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  isProcessing: boolean;
}

const ScrapingToggle = ({ enabled, onToggle, isProcessing }: ScrapingToggleProps) => {
  return (
    <div className="bg-muted/30 rounded-lg p-4 border border-border">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon 
              name="BoltIcon" 
              size={20} 
              className="text-warning"
            />
            <h3 className="font-medium text-foreground">Immediate Scraping</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Start scraping project updates and insights immediately after creation. 
            You can monitor progress in the project detail view.
          </p>
          
          {enabled && (
            <div className="flex items-center gap-2 text-xs text-primary">
              <Icon name="InformationCircleIcon" size={14} />
              <span>Initial scraping will begin once the project is created</span>
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={() => onToggle(!enabled)}
            disabled={isProcessing}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-smooth
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${enabled ? 'bg-primary' : 'bg-muted-foreground/30'}
            `}
            role="switch"
            aria-checked={enabled}
            aria-label="Toggle immediate scraping"
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-smooth
                ${enabled ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </div>

      {isProcessing && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Icon 
              name="ArrowPathIcon" 
              size={16} 
              className="text-primary animate-spin"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Setting up project...</p>
              <p className="text-xs text-muted-foreground">
                Validating URL and preparing scraping configuration
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrapingToggle;