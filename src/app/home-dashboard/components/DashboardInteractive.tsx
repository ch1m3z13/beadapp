'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PostCard from './PostCard';
import FilterControls from './FilterControls';
import PostSkeleton from './PostSkeleton';
import EmptyState from './EmptyState';
import ToastNotification from './ToastNotification';
import BottomTabNavigation from '@/components/common/BottomTabNavigation';
import FloatingActionButton from '@/components/common/FloatingActionButton';
import { supabase } from '@/lib/supabase';
import { sdk } from '@farcaster/frame-sdk';

interface Post {
  id: string;
  content: string;
  projectName: string;
  projectImage: string;
  projectImageAlt: string;
  timestamp: string;
  likes: number;
  shares: number;
  status: 'pending' | 'approved' | 'rejected';
  platform: 'X' | 'Farcaster';
  projectId: string;
}

interface Project {
  id: string;
  name: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
}

interface UserStats {
  fid: number | null;
  username: string;
  followerCount: number;
  followingCount: number;
}

interface WatchlistItem {
  project: string;
  created_at: string;
}

const DashboardInteractive = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [toast, setToast] = useState<Toast>({ message: '', type: 'info', isVisible: false });
  
  // Bead features
  const [userStats, setUserStats] = useState<UserStats>({
    fid: null,
    username: 'Guest',
    followerCount: 0,
    followingCount: 0
  });
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [dailySummary, setDailySummary] = useState<string>('');
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  // Mock data
  const mockProjects: Project[] = [
    { id: '1', name: 'TechStartup X' },
    { id: '2', name: 'CryptoDAO' },
    { id: '3', name: 'NFT Collection' },
    { id: '4', name: 'DeFi Protocol' }
  ];

  const mockPosts: Post[] = [
    {
      id: '1',
      content: "🚀 Just shipped our latest feature! The community response has been incredible. Sometimes the best innovations come from listening to your users. What's your take on user-driven development? #TechStartup #Innovation",
      projectName: 'TechStartup X',
      projectImage: "https://images.unsplash.com/photo-1667391551176-9070c1dc52e0",
      projectImageAlt: 'Modern tech startup office with glass walls and collaborative workspace',
      timestamp: '2 hours ago',
      likes: 42,
      shares: 8,
      status: 'pending',
      platform: 'X',
      projectId: '1'
    },
    {
      id: '2',
      content: "💎 The future of decentralized governance is here! Our latest proposal just passed with 89% community approval. Democracy in action, powered by blockchain. Who says crypto can't be inclusive? 🗳️ #DAO #Crypto",
      projectName: 'CryptoDAO',
      projectImage: "https://images.unsplash.com/photo-1667808931689-00d08946d9c7",
      projectImageAlt: 'Digital cryptocurrency coins and blockchain network visualization on dark background',
      timestamp: '4 hours ago',
      likes: 156,
      shares: 23,
      status: 'approved',
      platform: 'Farcaster',
      projectId: '2'
    },
    {
      id: '3',
      content: "🎨 Art meets technology in ways we never imagined. Our latest NFT drop sold out in 3 minutes! The intersection of creativity and blockchain continues to amaze us. What's your favorite NFT project? #NFT #DigitalArt",
      projectName: 'NFT Collection',
      projectImage: "https://images.unsplash.com/photo-1514480528757-fabb827ff382",
      projectImageAlt: 'Colorful digital art NFT collection display with geometric patterns and vibrant colors',
      timestamp: '6 hours ago',
      likes: 89,
      shares: 15,
      status: 'approved',
      platform: 'X',
      projectId: '3'
    },
    {
      id: '4',
      content: "⚡ DeFi just got faster! Our new protocol reduces transaction costs by 70% while maintaining security. Sometimes the best solutions are the simplest ones. Ready to experience lightning-fast DeFi? #DeFi #Blockchain",
      projectName: 'DeFi Protocol',
      projectImage: "https://images.unsplash.com/photo-1659018966825-43297e655ccf",
      projectImageAlt: 'Futuristic DeFi protocol interface with financial charts and blockchain connections',
      timestamp: '8 hours ago',
      likes: 234,
      shares: 45,
      status: 'rejected',
      platform: 'Farcaster',
      projectId: '4'
    }
  ];

  // Initialize Farcaster SDK and fetch user data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize Farcaster SDK
        const context = await sdk.context;
        setIsSDKLoaded(true);

        if (context.user?.fid) {
          const userFid = context.user.fid;
          setUserStats(prev => ({
            ...prev,
            fid: userFid,
            username: context.user.username || `User ${userFid}`
          }));

          // Fetch user's watchlist and stats
          await Promise.all([
            fetchWatchlist(userFid),
            fetchUserStats(userFid),
            fetchDailySummary(userFid)
          ]);
        }

        sdk.actions.ready();
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error);
        // Continue with mock data
      }
    };

    initializeApp();
  }, []);

  // Fetch watchlist from Supabase
  const fetchWatchlist = async (userFid: number) => {
    try {
      const { data, error } = await supabase
        .from('watchlists')
        .select('project')
        .eq('fid', userFid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setWatchlist(data.map((item: WatchlistItem) => item.project));
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      showToast('Failed to load watchlist', 'error');
    }
  };

  // Fetch user stats (can be extended with Neynar API)
  const fetchUserStats = async (userFid: number) => {
    try {
      // Placeholder for Neynar API integration
      // const stats = await getUserStats(userFid);
      // setUserStats(prev => ({ ...prev, ...stats }));
      
      // Mock data for now
      setUserStats(prev => ({
        ...prev,
        followerCount: 1234,
        followingCount: 567
      }));
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  // Fetch daily summary
  const fetchDailySummary = async (userFid: number) => {
    try {
      const { data, error } = await supabase
        .from('daily_summaries')
        .select('summary')
        .eq('fid', userFid)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setDailySummary(data.summary);
      }
    } catch (error) {
      console.error('Error fetching daily summary:', error);
    }
  };

  useEffect(() => {
    setIsHydrated(true);
    // Simulate loading
    const timer = setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort posts
  useEffect(() => {
    if (!isHydrated) return;

    let filtered = [...posts];

    // Filter by project
    if (selectedProject !== 'all') {
      filtered = filtered.filter((post) => post.projectId === selectedProject);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((post) => post.status === selectedStatus);
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'most-liked':
          return b.likes - a.likes;
        case 'most-shared':
          return b.shares - a.shares;
        case 'newest':
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

    setFilteredPosts(filtered);
  }, [posts, selectedProject, selectedStatus, sortBy, isHydrated]);

  const showToast = useCallback((message: string, type: Toast['type']) => {
    setToast({ message, type, isVisible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const handleLike = useCallback((postId: string) => {
    setPosts((prev) => prev.map((post) =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
    showToast('Post liked!', 'success');
  }, [showToast]);

  const handleShare = useCallback((postId: string) => {
    setPosts((prev) => prev.map((post) =>
      post.id === postId ? { ...post, shares: post.shares + 1 } : post
    ));
    showToast('Post shared successfully!', 'success');
  }, [showToast]);

  const handleApprove = useCallback((postId: string) => {
    setPosts((prev) => prev.map((post) =>
      post.id === postId ? { ...post, status: 'approved' as const } : post
    ));
    showToast('Post approved for publishing!', 'success');
  }, [showToast]);

  const handleReject = useCallback((postId: string) => {
    setPosts((prev) => prev.map((post) =>
      post.id === postId ? { ...post, status: 'rejected' as const } : post
    ));
    showToast('Post rejected', 'warning');
  }, [showToast]);

  const handleRegenerate = useCallback((postId: string) => {
    showToast('Regenerating post with AI...', 'info');
    setTimeout(() => {
      showToast('New post generated successfully!', 'success');
    }, 2000);
  }, [showToast]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 pb-20">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 pb-20">
        {/* User Stats Header */}
        <div className="bg-card rounded-xl p-4 mb-6 shadow-subtle border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center font-bold text-white">
                {userStats.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{userStats.username}</h2>
                <p className="text-sm text-muted-foreground">
                  {userStats.followerCount} followers · {userStats.followingCount} following
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Tracking</div>
              <div className="text-2xl font-bold text-primary">{watchlist.length}</div>
            </div>
          </div>
        </div>

        {/* Daily Summary */}
        {dailySummary && (
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-accent mb-2">📊 Today's Summary</h3>
            <p className="text-sm text-foreground">{dailySummary}</p>
          </div>
        )}

        {/* Watchlist Preview */}
        {watchlist.length > 0 && (
          <div className="bg-card rounded-xl p-4 mb-6 shadow-subtle border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Your Watchlist</h3>
              <button
                onClick={() => router.push('/add-project')}
                className="text-sm text-primary hover:text-primary/80 transition"
              >
                View All →
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {watchlist.slice(0, 5).map((project, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                >
                  {project}
                </span>
              ))}
              {watchlist.length > 5 && (
                <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                  +{watchlist.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        <FilterControls
          selectedProject={selectedProject}
          selectedStatus={selectedStatus}
          sortBy={sortBy}
          onProjectChange={setSelectedProject}
          onStatusChange={setSelectedStatus}
          onSortChange={setSortBy}
          projects={mockProjects}
        />

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}
          </div>
        ) : filteredPosts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onShare={handleShare}
                onApprove={handleApprove}
                onReject={handleReject}
                onRegenerate={handleRegenerate}
              />
            ))}
          </div>
        )}
      </div>

      <FloatingActionButton />
      <BottomTabNavigation />
      
      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default DashboardInteractive;