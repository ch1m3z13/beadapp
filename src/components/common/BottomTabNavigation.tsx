'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface TabItem {
  label: string;
  path: string;
  icon: string;
  badge?: number | null;
}

interface BottomTabNavigationProps {
  className?: string;
}

const BottomTabNavigation = ({ className = '' }: BottomTabNavigationProps) => {
  const pathname = usePathname();

  const tabs: TabItem[] = [
    {
      label: 'Home',
      path: '/home-dashboard',
      icon: 'HomeIcon',
      badge: null
    },
    {
      label: 'Projects',
      path: '/projects-list',
      icon: 'FolderIcon',
      badge: null
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: 'CogIcon',
      badge: null
    }
  ];

  const isActiveTab = (tabPath: string) => {
    if (tabPath === '/home-dashboard') {
      return pathname === '/home-dashboard' || pathname === '/';
    }
    if (tabPath === '/projects-list') {
      return pathname === '/projects-list' || pathname === '/project-detail' || pathname === '/add-project';
    }
    return pathname === tabPath;
  };

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 bg-card border-t border-border z-100 ${className}`}
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-15 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = isActiveTab(tab.path);
          
          return (
            <Link
              key={tab.path}
              href={tab.path}
              role="tab"
              aria-selected={isActive}
              aria-label={`Navigate to ${tab.label}`}
              className={`
                flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 
                transition-smooth hover:bg-muted/50 rounded-lg relative
                ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
              `}
            >
              <div className="relative">
                <Icon 
                  name={tab.icon as any}
                  size={24}
                  variant={isActive ? 'solid' : 'outline'}
                  className="mb-1"
                />
                {tab.badge && tab.badge > 0 && (
                  <span 
                    className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs 
                             rounded-full min-w-5 h-5 flex items-center justify-center px-1"
                    aria-label={`${tab.badge} notifications`}
                  >
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium truncate max-w-full">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabNavigation;