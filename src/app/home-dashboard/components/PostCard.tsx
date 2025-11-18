'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface PostCardProps {
  post: {
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
  };
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onApprove: (postId: string) => void;
  onReject: (postId: string) => void;
  onRegenerate: (postId: string) => void;
}

const PostCard = ({ post, onLike, onShare, onApprove, onReject, onRegenerate }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLocalLikes(prev => isLiked ? prev - 1 : prev + 1);
    onLike(post.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-success bg-success/10 border-success/20';
      case 'rejected':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-warning bg-warning/10 border-warning/20';
    }
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'X' ? 'XMarkIcon' : 'ChatBubbleLeftRightIcon';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-subtle hover:shadow-elevated transition-smooth">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <AppImage
            src={post.projectImage}
            alt={post.projectImageAlt}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium text-foreground">{post.projectName}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name={getPlatformIcon(post.platform) as any} size={14} />
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-foreground leading-relaxed">{post.content}</p>
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Icon name="HeartIcon" size={16} />
          <span>{localLikes}</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon name="ShareIcon" size={16} />
          <span>{post.shares}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth ${
              isLiked 
                ? 'text-error bg-error/10 hover:bg-error/20' :'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name="HeartIcon" size={16} variant={isLiked ? 'solid' : 'outline'} />
            <span>Like</span>
          </button>
          <button
            onClick={() => onShare(post.id)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
          >
            <Icon name="ShareIcon" size={16} />
            <span>Share</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {post.status === 'pending' && (
            <>
              <button
                onClick={() => onReject(post.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-smooth"
              >
                <Icon name="XMarkIcon" size={16} />
                <span>Reject</span>
              </button>
              <button
                onClick={() => onApprove(post.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-success hover:bg-success/10 transition-smooth"
              >
                <Icon name="CheckIcon" size={16} />
                <span>Approve</span>
              </button>
            </>
          )}
          <button
            onClick={() => onRegenerate(post.id)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-smooth"
          >
            <Icon name="ArrowPathIcon" size={16} />
            <span>Regenerate</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;