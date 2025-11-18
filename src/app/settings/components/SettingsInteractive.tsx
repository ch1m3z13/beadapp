'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useConnect, useDisconnect, useAccount } from 'wagmi';
import { sdk } from '@farcaster/frame-sdk';
import { supabase } from '@/lib/supabase';
import BottomTabNavigation from '@/components/common/BottomTabNavigation';

interface UserSettings {
  notifications_enabled: boolean;
  email_notifications: boolean;
  daily_summary: boolean;
  real_time_alerts: boolean;
}

const SettingsInteractive = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [fid, setFid] = useState<number | null>(null);
  const [username, setUsername] = useState<string>('');
  const [settings, setSettings] = useState<UserSettings>({
    notifications_enabled: false,
    email_notifications: false,
    daily_summary: true,
    real_time_alerts: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showWalletSelect, setShowWalletSelect] = useState(false);
  const [miniAppAdded, setMiniAppAdded] = useState(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const initFarcaster = async () => {
      try {
        const context = await sdk.context;
        setIsSDKLoaded(true);

        if (context.client.added) {
          setMiniAppAdded(true);
        }

        if (context.user?.fid) {
          const userFid = context.user.fid;
          setFid(userFid);
          setUsername(context.user.username || `User ${userFid}`);
          await fetchSettings(userFid);
        }

        sdk.actions.ready();
      } catch (error) {
        console.error('Farcaster init failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initFarcaster();
  }, []);

  const fetchSettings = async (userFid: number) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('fid', userFid)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings({
          notifications_enabled: data.notifications_enabled || false,
          email_notifications: data.email_notifications || false,
          daily_summary: data.daily_summary !== false,
          real_time_alerts: data.real_time_alerts || false,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleAddMiniApp = async () => {
    if (!isSDKLoaded) {
      alert('SDK not loaded');
      return;
    }

    try {
      await sdk.actions.addFrame();
      const context = await sdk.context;

      if (context.client.added) {
        setMiniAppAdded(true);

        if (context.client.notificationDetails && fid) {
          await updateSetting('notifications_enabled', true);
        }
      }
    } catch (error) {
      console.error('Error adding mini app:', error);
      alert('Failed to add mini app');
    }
  };

  const updateSetting = async (key: keyof UserSettings, value: boolean) => {
    if (!fid) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          fid,
          [key]: value,
        });

      if (error) throw error;

      setSettings((prev) => ({ ...prev, [key]: value }));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error updating setting:', error);
      alert('Failed to update setting');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleNotifications = async () => {
    if (!miniAppAdded) {
      return handleAddMiniApp();
    }
    await updateSetting('notifications_enabled', !settings.notifications_enabled);
  };

  const handleWalletConnect = (connector: any) => {
    connect({ connector });
    setShowWalletSelect(false);
  };

  const handleWalletDisconnect = () => {
    if (confirm('Disconnect wallet?')) {
      disconnect();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-muted-foreground hover:text-foreground transition mb-3"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* User Profile */}
        <div className="bg-card rounded-xl p-5 shadow-subtle border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">Profile</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center font-bold text-white text-2xl">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-foreground">{username}</p>
              {fid && <p className="text-sm text-muted-foreground">FID: {fid}</p>}
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-card rounded-xl p-5 shadow-subtle border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">Notifications</h2>

          {!miniAppAdded && (
            <div className="bg-accent/10 border border-accent rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Enable Mini App</p>
                  <p className="text-xs text-muted-foreground">
                    Add Bead as a mini app to enable notifications
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Main Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  {miniAppAdded ? 'Receive updates about your projects' : 'Enable mini app first'}
                </p>
              </div>
              <button
                onClick={toggleNotifications}
                disabled={isSaving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications_enabled && miniAppAdded ? 'bg-success' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications_enabled && miniAppAdded ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Daily Summary */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">Daily Summary</p>
                <p className="text-sm text-muted-foreground">Get a daily digest of all updates</p>
              </div>
              <button
                onClick={() => updateSetting('daily_summary', !settings.daily_summary)}
                disabled={isSaving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.daily_summary ? 'bg-success' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.daily_summary ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Real-time Alerts */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">Real-time Alerts</p>
                <p className="text-sm text-muted-foreground">Immediate updates for important events</p>
              </div>
              <button
                onClick={() => updateSetting('real_time_alerts', !settings.real_time_alerts)}
                disabled={isSaving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.real_time_alerts ? 'bg-success' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.real_time_alerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="bg-card rounded-xl p-5 shadow-subtle border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">Wallet</h2>

          {isConnected && address ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
                <div>
                  <p className="text-sm font-semibold text-foreground">Connected</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </p>
                </div>
                <div className="w-3 h-3 bg-success rounded-full"></div>
              </div>
              <button
                onClick={handleWalletDisconnect}
                className="w-full py-3 bg-error/10 hover:bg-error/20 text-error rounded-lg font-semibold transition"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-3">
                Connect a wallet to enable on-chain tracking features
              </p>
              {showWalletSelect ? (
                <div className="space-y-2">
                  {connectors.map((connector) => (
                    <button
                      key={connector.id}
                      onClick={() => handleWalletConnect(connector)}
                      className="w-full py-3 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-semibold transition"
                    >
                      {connector.name}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowWalletSelect(false)}
                    className="w-full py-3 bg-background hover:bg-muted text-muted-foreground rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowWalletSelect(true)}
                  className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          )}
        </div>

        {/* App Info */}
        <div className="bg-card rounded-xl p-5 shadow-subtle border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">About</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="text-foreground font-semibold">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network</span>
              <span className="text-foreground font-semibold">Base</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-success text-white px-6 py-3 rounded-lg shadow-elevated flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Settings saved
          </div>
        </div>
      )}

      <BottomTabNavigation />
    </div>
  );
};

export default SettingsInteractive;
