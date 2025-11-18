'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: 'insights' | 'posts' | 'schedule' | 'system';
}

interface NotificationSectionProps {
  notifications: NotificationSetting[];
}

const NotificationSection = ({ notifications }: NotificationSectionProps) => {
  const [settings, setSettings] = useState(notifications);

  const handleToggle = (id: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id 
        ? { ...setting, enabled: !setting.enabled }
        : setting
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'insights':
        return 'ChartBarIcon';
      case 'posts':
        return 'DocumentTextIcon';
      case 'schedule':
        return 'ClockIcon';
      case 'system':
        return 'CogIcon';
      default:
        return 'BellIcon';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'insights':
        return 'text-primary bg-primary/10';
      case 'posts':
        return 'text-secondary bg-secondary/10';
      case 'schedule':
        return 'text-warning bg-warning/10';
      case 'system':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, NotificationSetting[]>);

  const categoryTitles = {
    insights: 'Project Insights',
    posts: 'Post Generation',
    schedule: 'Scheduling',
    system: 'System Notifications'
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        <Icon name="BellIcon" size={20} className="text-muted-foreground" />
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              {categoryTitles[category as keyof typeof categoryTitles]}
            </h3>
            
            <div className="space-y-3">
              {categorySettings.map((setting) => (
                <div key={setting.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryColor(setting.category)}`}>
                    <Icon name={getCategoryIcon(setting.category) as any} size={16} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground">{setting.title}</h4>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  
                  <button
                    onClick={() => handleToggle(setting.id)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-smooth
                      ${setting.enabled ? 'bg-primary' : 'bg-muted'}
                    `}
                    role="switch"
                    aria-checked={setting.enabled}
                    aria-label={`Toggle ${setting.title}`}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-smooth
                        ${setting.enabled ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="InformationCircleIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Push Notifications</p>
            <p>Notifications help you stay updated on project insights, post generation progress, and scheduled activities. You can customize which types of notifications you receive.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSection;