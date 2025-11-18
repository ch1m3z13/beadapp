'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface DataPrivacySectionProps {
  className?: string;
}

const DataPrivacySection = ({ className = '' }: DataPrivacySectionProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = () => {
    setIsExporting(true);
    // Mock export delay
    setTimeout(() => {
      setIsExporting(false);
      setShowExportDialog(false);
      // Mock download trigger
      const link = document.createElement('a');
      link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
        exported_at: new Date().toISOString(),
        user_data: "Mock user data export",
        projects: "Mock projects data",
        posts: "Mock posts data"
      }));
      link.download = 'beadapp-data-export.json';
      link.click();
    }, 3000);
  };

  const privacyOptions = [
    {
      id: 'analytics',
      title: 'Usage Analytics',
      description: 'Help improve BeadApp by sharing anonymous usage data',
      enabled: true
    },
    {
      id: 'marketing',
      title: 'Marketing Communications',
      description: 'Receive updates about new features and improvements',
      enabled: false
    },
    {
      id: 'data_processing',
      title: 'Enhanced Data Processing',
      description: 'Allow advanced AI processing for better post generation',
      enabled: true
    }
  ];

  const [privacySettings, setPrivacySettings] = useState(privacyOptions);

  const handlePrivacyToggle = (id: string) => {
    setPrivacySettings(prev => prev.map(setting => 
      setting.id === id 
        ? { ...setting, enabled: !setting.enabled }
        : setting
    ));
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Data & Privacy</h2>
        <Icon name="ShieldCheckIcon" size={20} className="text-muted-foreground" />
      </div>

      <div className="space-y-6">
        {/* Privacy Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Privacy Preferences
          </h3>
          
          {privacySettings.map((setting) => (
            <div key={setting.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="EyeIcon" size={16} className="text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground">{setting.title}</h4>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
              
              <button
                onClick={() => handlePrivacyToggle(setting.id)}
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

        {/* Data Management */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Data Management
          </h3>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowExportDialog(true)}
              className="w-full flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-smooth text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Icon name="ArrowDownTrayIcon" size={20} className="text-secondary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Export Your Data</h4>
                <p className="text-sm text-muted-foreground">Download a copy of all your data</p>
              </div>
              <Icon name="ChevronRightIcon" size={16} className="text-muted-foreground" />
            </button>

            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-full flex items-center gap-4 p-4 rounded-lg border border-error/20 hover:border-error/50 hover:bg-error/5 transition-smooth text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
                <Icon name="TrashIcon" size={20} className="text-error" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-error">Delete Account</h4>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Icon name="ChevronRightIcon" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      {showExportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="ArrowDownTrayIcon" size={24} className="text-secondary" />
              <h3 className="text-lg font-semibold text-foreground">Export Your Data</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              This will create a downloadable file containing all your projects, posts, and account information. The export may take a few moments to complete.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-smooth disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Icon name="ArrowDownTrayIcon" size={16} />
                    Export Data
                  </>
                )}
              </button>
              <button
                onClick={() => setShowExportDialog(false)}
                disabled={isExporting}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-smooth disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="ExclamationTriangleIcon" size={24} className="text-error" />
              <h3 className="text-lg font-semibold text-foreground">Delete Account</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              This action cannot be undone. This will permanently delete your account, all projects, generated posts, and remove all associated data from our servers.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Mock delete action
                  setShowDeleteDialog(false);
                }}
                className="px-4 py-2 bg-error text-error-foreground rounded-md hover:bg-error/90 transition-smooth"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPrivacySection;