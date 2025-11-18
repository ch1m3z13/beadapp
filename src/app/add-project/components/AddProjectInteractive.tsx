'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { sdk } from '@farcaster/frame-sdk';

interface ValidationError {
  field: string;
  message: string;
}

interface WatchlistProject {
  id?: string;
  project: string;
  fid: number;
  created_at?: string;
}

const AddProjectInteractive = () => {
  const router = useRouter();
  const [projectHandle, setProjectHandle] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState<'X' | 'Farcaster'>('X');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [fid, setFid] = useState<number | null>(null);
  const [username, setUsername] = useState<string>('');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize Farcaster SDK
  useEffect(() => {
    const initFarcaster = async () => {
      try {
        const context = await sdk.context;
        
        if (context.user?.fid) {
          setFid(context.user.fid);
          setUsername(context.user.username || `User ${context.user.fid}`);
          await fetchWatchlist(context.user.fid);
        }
        
        sdk.actions.ready();
      } catch (error) {
        console.error('Farcaster init failed:', error);
      }
    };

    initFarcaster();
  }, []);

  // Fetch existing watchlist
  const fetchWatchlist = async (userFid: number) => {
    try {
      const { data, error } = await supabase
        .from('watchlists')
        .select('project')
        .eq('fid', userFid);

      if (error) throw error;
      if (data) {
        setWatchlist(data.map(item => item.project));
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  // Validate project handle
  const validateProjectHandle = (handle: string): ValidationError[] => {
    const validationErrors: ValidationError[] = [];

    // Check if empty
    if (!handle.trim()) {
      validationErrors.push({
        field: 'projectHandle',
        message: 'Project handle is required'
      });
      return validationErrors;
    }

    // Check if starts with @
    if (!handle.startsWith('@')) {
      validationErrors.push({
        field: 'projectHandle',
        message: 'Project handle must start with @'
      });
    }

    // Check length (@ + at least 1 character)
    if (handle.length < 2) {
      validationErrors.push({
        field: 'projectHandle',
        message: 'Project handle must have at least 1 character after @'
      });
    }

    // Check for invalid characters (only alphanumeric and underscore after @)
    const handleWithoutAt = handle.slice(1);
    if (!/^[a-zA-Z0-9_]+$/.test(handleWithoutAt)) {
      validationErrors.push({
        field: 'projectHandle',
        message: 'Project handle can only contain letters, numbers, and underscores'
      });
    }

    // Check if already in watchlist
    if (watchlist.includes(handle)) {
      validationErrors.push({
        field: 'projectHandle',
        message: 'This project is already in your watchlist'
      });
    }

    return validationErrors;
  };

  // Handle input change with auto-formatting
  const handleProjectHandleChange = (value: string) => {
    // Auto-add @ if user starts typing without it
    if (value && !value.startsWith('@')) {
      value = '@' + value;
    }
    
    setProjectHandle(value);
    
    // Clear errors on change
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Add project to watchlist
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const validationErrors = validateProjectHandle(projectHandle);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check if user is authenticated
    if (!fid) {
      setErrors([{
        field: 'auth',
        message: 'Please connect your Farcaster account first'
      }]);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      // Add to Supabase watchlist
      const { error } = await supabase
        .from('watchlists')
        .insert({
          fid,
          project: projectHandle,
          platform,
          description: description || null
        });

      if (error) throw error;

      // Update local watchlist
      setWatchlist([...watchlist, projectHandle]);

      // Show success message
      setShowSuccess(true);

      // Reset form
      setProjectHandle('');
      setDescription('');
      setPlatform('X');

      // Hide success message and redirect after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/home-dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('Error adding project:', error);
      setErrors([{
        field: 'submit',
        message: error.message || 'Failed to add project to watchlist'
      }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove project from watchlist
  const handleRemoveProject = async (project: string) => {
    if (!fid) return;

    try {
      const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('fid', fid)
        .eq('project', project);

      if (error) throw error;

      setWatchlist(watchlist.filter(p => p !== project));
    } catch (error) {
      console.error('Error removing project:', error);
    }
  };

  const getErrorMessage = (field: string) => {
    const error = errors.find(e => e.field === field);
    return error ? error.message : null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-muted-foreground hover:text-foreground transition mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Add Project</h1>
          <p className="text-muted-foreground">
            Track a new Web3 project and get AI-powered updates
          </p>
        </div>

        {/* User Info */}
        {fid && (
          <div className="bg-card rounded-xl p-4 mb-6 shadow-subtle border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center font-bold text-white">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-foreground">{username}</p>
                <p className="text-sm text-muted-foreground">
                  Tracking {watchlist.length} {watchlist.length === 1 ? 'project' : 'projects'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add Project Form */}
        <div className="bg-card rounded-xl p-6 shadow-subtle border border-border mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Handle Input */}
            <div>
              <label htmlFor="projectHandle" className="block text-sm font-semibold text-foreground mb-2">
                Project Handle *
              </label>
              <input
                type="text"
                id="projectHandle"
                value={projectHandle}
                onChange={(e) => handleProjectHandleChange(e.target.value)}
                placeholder="@MorphLayer"
                className={`w-full px-4 py-3 rounded-lg border ${
                  getErrorMessage('projectHandle')
                    ? 'border-error bg-error/5'
                    : 'border-border bg-input'
                } text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition`}
                disabled={isSubmitting}
              />
              {getErrorMessage('projectHandle') && (
                <p className="mt-2 text-sm text-error">{getErrorMessage('projectHandle')}</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                Enter the project's X or Farcaster handle (e.g., @ProjectName)
              </p>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Platform
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPlatform('X')}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                    platform === 'X'
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border bg-background text-muted-foreground hover:border-muted'
                  }`}
                >
                  𝕏 X (Twitter)
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform('Farcaster')}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                    platform === 'Farcaster'
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border bg-background text-muted-foreground hover:border-muted'
                  }`}
                >
                  🟣 Farcaster
                </button>
              </div>
            </div>

            {/* Description (Optional) */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-foreground mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes about this project..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Error Messages */}
            {(getErrorMessage('auth') || getErrorMessage('submit')) && (
              <div className="bg-error/10 border border-error rounded-lg p-4">
                <p className="text-sm text-error">
                  {getErrorMessage('auth') || getErrorMessage('submit')}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !fid}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Project...
                </div>
              ) : (
                '+ Add to Watchlist'
              )}
            </button>
          </form>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-2xl p-8 max-w-sm mx-4 shadow-elevated border border-success text-center">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Project Added!</h3>
              <p className="text-muted-foreground">
                You'll start receiving updates about this project
              </p>
            </div>
          </div>
        )}

        {/* Current Watchlist */}
        {watchlist.length > 0 && (
          <div className="bg-card rounded-xl p-6 shadow-subtle border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Your Watchlist ({watchlist.length})
            </h2>
            <div className="space-y-3">
              {watchlist.map((project, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
                      {project.charAt(1).toUpperCase()}
                    </div>
                    <span className="font-semibold text-foreground">{project}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveProject(project)}
                    className="p-2 text-error hover:bg-error/10 rounded-lg transition"
                    aria-label="Remove project"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProjectInteractive;