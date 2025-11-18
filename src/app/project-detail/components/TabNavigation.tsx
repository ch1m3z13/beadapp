'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{
    id: string;
    label: string;
    icon: string;
    count?: number;
  }>;
}

const TabNavigation = ({ activeTab, onTabChange, tabs }: TabNavigationProps) => {
  return (
    <div className="bg-card border-b border-border">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium
              transition-smooth border-b-2 hover:bg-muted/50
              ${activeTab === tab.id
                ? 'text-primary border-primary bg-primary/5' :'text-muted-foreground border-transparent hover:text-foreground'
              }
            `}
          >
            <Icon 
              name={tab.icon as any}
              size={16}
              variant={activeTab === tab.id ? 'solid' : 'outline'}
            />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`
                px-1.5 py-0.5 text-xs rounded-full min-w-5 h-5 flex items-center justify-center
                ${activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {tab.count > 99 ? '99+' : tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;