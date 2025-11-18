'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const FloatingActionButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't show FAB on certain pages
  const hiddenPaths = ['/add-project', '/settings'];
  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  const actions = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      label: 'Add Project',
      onClick: () => {
        setIsExpanded(false);
        router.push('/add-project');
      },
      color: 'from-primary to-secondary',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      label: 'Projects',
      onClick: () => {
        setIsExpanded(false);
        router.push('/projects-list');
      },
      color: 'from-secondary to-success',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Settings',
      onClick: () => {
        setIsExpanded(false);
        router.push('/settings');
      },
      color: 'from-accent to-warning',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Action Buttons */}
      <div className="fixed bottom-24 right-4 z-50 flex flex-col-reverse gap-3">
        {isExpanded &&
          actions.map((action, index) => (
            <div
              key={index}
              className="flex items-center gap-3 animate-in slide-in-from-bottom-2 fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="bg-card text-foreground text-sm font-semibold px-3 py-2 rounded-lg shadow-elevated border border-border whitespace-nowrap">
                {action.label}
              </span>
              <button
                onClick={action.onClick}
                className={`w-14 h-14 bg-gradient-to-r ${action.color} text-white rounded-full shadow-floating hover:shadow-elevated transition-all duration-200 flex items-center justify-center hover:scale-110`}
              >
                {action.icon}
              </button>
            </div>
          ))}

        {/* Main FAB Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-16 h-16 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-floating hover:shadow-elevated transition-all duration-200 flex items-center justify-center ml-auto ${
            isExpanded ? 'rotate-45 scale-110' : 'hover:scale-110'
          }`}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default FloatingActionButton;
