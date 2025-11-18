'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface GeneratedPost {
  id: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'scheduled' | 'published';
  createdAt: string;
  scheduledFor?: string;
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
  };
  platform: 'x' | 'farcaster';
}

interface GeneratedPostsTabProps {
  posts: GeneratedPost[];
  onApprove: (postId: string) => void;
  onReject: (postId: string) => void;
  onRegenerate: (postId: string) => void;
  onEdit: (postId: string) => void;
}

const GeneratedPostsTab = ({ 
  posts, 
  onApprove, 
  onReject, 
  onRegenerate, 
  onEdit 
}: GeneratedPostsTabProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'text-warning bg-warning/10', label: 'Pending Review' };
      case 'approved':
        return { color: 'text-success bg-success/10', label: 'Approved' };
      case 'rejected':
        return { color: 'text-error bg-error/10', label: 'Rejected' };
      case 'scheduled':
        return { color: 'text-primary bg-primary/10', label: 'Scheduled' };
      case 'published':
        return { color: 'text-success bg-success/10', label: 'Published' };
      default:
        return { color: 'text-muted-foreground bg-muted', label: 'Unknown' };
    }
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'x' ? 'XMarkIcon' : 'ChatBubbleLeftRightIcon';
  };

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Icon name="PencilSquareIcon" size={48} className="text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Posts Generated</h3>
        <p className="text-muted-foreground max-w-md">
          AI-generated posts will appear here based on scraped insights. 
          Enable scraping and wait for insights to generate content automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const statusConfig = getStatusConfig(post.status);
          
          return (
            <div key={post.id} className="bg-card border border-border rounded-lg p-4 shadow-subtle">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon 
                    name={getPlatformIcon(post.platform) as any}
                    size={16}
                    className="text-muted-foreground"
                  />
                  <span className="text-xs text-muted-foreground">
                    {post.createdAt}
                  </span>
                </div>
                
                <span className={`px-2 py-1 text-xs font-medium rounded-md ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-foreground leading-relaxed line-clamp-4">
                  {post.content}
                </p>
              </div>
              
              {post.scheduledFor && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <Icon name="CalendarIcon" size={12} />
                  <span>Scheduled for {post.scheduledFor}</span>
                </div>
              )}
              
              {post.engagement && (
                <div className="flex items-center gap-3 mb-4 pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon name="HeartIcon" size={12} />
                    <span>{post.engagement.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon name="ArrowPathRoundedSquareIcon" size={12} />
                    <span>{post.engagement.shares}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon name="ChatBubbleLeftIcon" size={12} />
                    <span>{post.engagement.comments}</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                {post.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onApprove(post.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-success bg-success/10 hover:bg-success/20 rounded-md transition-smooth"
                    >
                      <Icon name="CheckIcon" size={12} />
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(post.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-error bg-error/10 hover:bg-error/20 rounded-md transition-smooth"
                    >
                      <Icon name="XMarkIcon" size={12} />
                      Reject
                    </button>
                  </>
                )}
                
                {(post.status === 'rejected' || post.status === 'approved') && (
                  <button
                    onClick={() => onRegenerate(post.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-smooth"
                  >
                    <Icon name="ArrowPathIcon" size={12} />
                    Regenerate
                  </button>
                )}
                
                <button
                  onClick={() => onEdit(post.id)}
                  className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted hover:bg-muted/80 rounded-md transition-smooth"
                >
                  <Icon name="PencilIcon" size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GeneratedPostsTab;