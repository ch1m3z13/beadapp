'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface AppearanceSectionProps {
  className?: string;
}

const AppearanceSection = ({ className = '' }: AppearanceSectionProps) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
    setTheme(savedTheme);
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    if (!isHydrated) return;
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme to document
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  if (!isHydrated) {
    return (
      <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-32 mb-6"></div>
          <div className="space-y-4">
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const themeOptions = [
    {
      id: 'light',
      name: 'Light',
      description: 'Clean and bright interface',
      icon: 'SunIcon'
    },
    {
      id: 'dark',
      name: 'Dark',
      description: 'Easy on the eyes in low light',
      icon: 'MoonIcon'
    },
    {
      id: 'system',
      name: 'System',
      description: 'Matches your device settings',
      icon: 'ComputerDesktopIcon'
    }
  ];

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
        <Icon name="PaintBrushIcon" size={20} className="text-muted-foreground" />
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-4">
          Choose how BeadApp looks to you. Select a single theme, or sync with your system and automatically switch between day and night themes.
        </p>

        {themeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleThemeChange(option.id as 'light' | 'dark' | 'system')}
            className={`
              w-full flex items-center gap-4 p-4 rounded-lg border transition-smooth
              ${theme === option.id 
                ? 'border-primary bg-primary/5 text-foreground' 
                : 'border-border hover:border-border/60 hover:bg-muted/50 text-foreground'
              }
            `}
          >
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center
              ${theme === option.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
            `}>
              <Icon name={option.icon as any} size={20} />
            </div>
            
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{option.name}</h3>
                {theme === option.id && (
                  <Icon name="CheckIcon" size={16} className="text-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="LightBulbIcon" size={20} className="text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Theme Tip</p>
            <p>Dark mode can help reduce eye strain during extended use and may help preserve battery life on OLED displays.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSection;