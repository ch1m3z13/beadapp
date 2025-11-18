'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ApiKey {
  id: string;
  platform: string;
  name: string;
  status: 'connected' | 'disconnected' | 'testing';
  lastTested: string;
}

interface ApiConfigurationSectionProps {
  apiKeys: ApiKey[];
}

const ApiConfigurationSection = ({ apiKeys }: ApiConfigurationSectionProps) => {
  const [keys, setKeys] = useState(apiKeys);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [keyValues, setKeyValues] = useState<Record<string, string>>({});

  const handleTestConnection = (keyId: string) => {
    setKeys(prev => prev.map(key => 
      key.id === keyId 
        ? { ...key, status: 'testing' }
        : key
    ));

    // Mock test delay
    setTimeout(() => {
      setKeys(prev => prev.map(key => 
        key.id === keyId 
          ? { 
              ...key, 
              status: Math.random() > 0.3 ? 'connected' : 'disconnected',
              lastTested: new Date().toLocaleString()
            }
          : key
      ));
    }, 2000);
  };

  const handleSaveKey = (keyId: string) => {
    const newValue = keyValues[keyId];
    if (newValue && newValue.trim()) {
      setKeys(prev => prev.map(key => 
        key.id === keyId 
          ? { ...key, status: 'disconnected' }
          : key
      ));
    }
    setEditingKey(null);
    setKeyValues(prev => ({ ...prev, [keyId]: '' }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <Icon name="CheckCircleIcon" size={16} className="text-success" />;
      case 'testing':
        return <Icon name="ArrowPathIcon" size={16} className="text-warning animate-spin" />;
      case 'disconnected':
      default:
        return <Icon name="XCircleIcon" size={16} className="text-error" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'testing':
        return 'Testing...';
      case 'disconnected':
      default:
        return 'Disconnected';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">API Configuration</h2>
        <Icon name="KeyIcon" size={20} className="text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {keys.map((apiKey) => (
          <div key={apiKey.id} className="border border-border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="LinkIcon" size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{apiKey.name}</h3>
                  <p className="text-sm text-muted-foreground">{apiKey.platform}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(apiKey.status)}
                <span className="text-sm font-medium text-foreground">
                  {getStatusText(apiKey.status)}
                </span>
              </div>
            </div>

            {editingKey === apiKey.id ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">API Key</label>
                  <input
                    type="password"
                    value={keyValues[apiKey.id] || ''}
                    onChange={(e) => setKeyValues(prev => ({ ...prev, [apiKey.id]: e.target.value }))}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="Enter your API key"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveKey(apiKey.id)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingKey(null)}
                    className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-smooth text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {apiKey.status === 'connected' ? (
                    `Last tested: ${apiKey.lastTested}`
                  ) : (
                    'No API key configured'
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingKey(apiKey.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-md transition-smooth"
                  >
                    <Icon name="PencilIcon" size={14} />
                    Edit
                  </button>
                  {apiKey.status !== 'testing' && (
                    <button
                      onClick={() => handleTestConnection(apiKey.id)}
                      disabled={apiKey.status === 'disconnected'}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-secondary hover:bg-secondary/10 rounded-md transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon name="PlayIcon" size={14} />
                      Test
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="InformationCircleIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">API Key Security</p>
            <p>Your API keys are encrypted and stored securely. They are only used to authenticate with the respective platforms for data scraping and posting.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiConfigurationSection;