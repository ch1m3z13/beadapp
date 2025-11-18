'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { sdk } from '@farcaster/frame-sdk';
import BottomTabNavigation from '@/components/common/BottomTabNavigation';

interface Project {
  id: string;
  project: string;
  platform: 'X' | 'Farcaster';
  description?: string;
  created_at: string;
  lastUpdate?: string;
  updateCount?: number;
}

const ProjectsListInteractive = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fid, setFid] = useState<number | null>(null);
  const [username, setUsername] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'x' | 'farcaster'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const initFarcaster = async () => {
      try {
        const context = await sdk.context;
        
        if (context.user?.fid) {
          const userFid = context.user.fid;
          setFid(userFid);
          setUsername(context.user.username || `User ${userFid}`);
          await fetchProjects(userFid);
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

  const fetchProjects = async (userFid: number) => {
    try {
      const { data, error } = await supabase
        .from('watchlists')
        .select('*')
        .eq('fid', userFid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        // Enrich with mock update data
        const enrichedProjects = data.map((proj, idx) => ({
          ...proj,
          lastUpdate: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          updateCount: Math.floor(Math.random() * 50) + 10
        }));
        setProjects(enrichedProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleRemoveProject = async (projectId: string) => {
    if (!confirm('Remove this project from your watchlist?')) return;

    try {
      const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error removing project:', error);
      alert('Failed to remove project');
    }
  };

  const openProject = (projectName: string) => {
    router.push(`/project-detail?project=${encodeURIComponent(projectName)}`);
  };

  const filteredProjects = projects
    .filter(project => {
      // Filter by tab
      if (activeTab === 'x' && project.platform !== 'X') return false;
      if (activeTab === 'farcaster' && project.platform !== 'Farcaster') return false;
      
      // Filter by search
      if (searchQuery && !project.project.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center font-bold text-white">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">My Projects</h1>
                <p className="text-xs text-muted-foreground">
                  {projects.length} {projects.length === 1 ? 'project' : 'projects'} tracked
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/add-project')}
              className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full px-4 py-2 pl-10 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('x')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'x'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              𝕏 ({projects.filter(p => p.platform === 'X').length})
            </button>
            <button
              onClick={() => setActiveTab('farcaster')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'farcaster'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              🟣 ({projects.filter(p => p.platform === 'Farcaster').length})
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 py-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {searchQuery ? 'No matching projects' : 'No projects yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'Try a different search term' : 'Start tracking Web3 projects to get AI-powered updates'}
            </p>
            <button
              onClick={() => router.push('/add-project')}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Add Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => openProject(project.project)}
                className="bg-card rounded-xl p-5 shadow-subtle border border-border hover:border-primary hover:shadow-elevated transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                        {project.project}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {project.platform === 'X' ? '𝕏' : '🟣'}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    📊
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span>{project.updateCount} updates</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{project.lastUpdate ? getTimeAgo(project.lastUpdate) : 'Never'}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveProject(project.id);
                    }}
                    className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg transition"
                    aria-label="Remove project"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomTabNavigation />
    </div>
  );
};

export default ProjectsListInteractive;
