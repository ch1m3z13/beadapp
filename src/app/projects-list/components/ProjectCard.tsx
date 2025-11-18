import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import ProjectStatusIndicator from '@/components/common/ProjectStatusIndicator';

export interface Project {
  id: string;
  name: string;
  platform: 'x' | 'farcaster';
  status: 'active' | 'paused' | 'error' | 'idle';
  lastScraped: string;
  totalInsights: number;
  postsGenerated: number;
  avatar?: string;
  url: string;
  tags?: string[];
  createdAt: string;
}

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onOpenSettings: (id: string) => void;
}

const ProjectCard = ({ 
  project, 
  isSelected, 
  onSelect, 
  onToggleStatus, 
  onOpenSettings 
}: ProjectCardProps) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'x':
        return 'XMarkIcon';
      case 'farcaster':
        return 'ChatBubbleLeftRightIcon';
      default:
        return 'GlobeAltIcon';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'x':
        return 'text-gray-900 bg-gray-100';
      case 'farcaster':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`
      bg-card border border-border rounded-lg p-4 transition-smooth
      hover:shadow-subtle hover:border-primary/20
      ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
    `}>
      {/* Header with checkbox and platform */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(project.id)}
            className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
            aria-label={`Select ${project.name}`}
          />
          <div className="flex items-center gap-2">
            {project.avatar && (
              <AppImage
                src={project.avatar}
                alt={`${project.name} project avatar showing social media profile picture`}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div className={`
              flex items-center justify-center w-6 h-6 rounded-full ${getPlatformColor(project.platform)}
            `}>
              <Icon 
                name={getPlatformIcon(project.platform) as any}
                size={12}
              />
            </div>
          </div>
        </div>
        
        <ProjectStatusIndicator 
          status={project.status}
          size="sm"
          animated={project.status === 'active'}
        />
      </div>

      {/* Project name and URL */}
      <div className="mb-3">
        <Link 
          href="/project-detail"
          className="block group"
        >
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth mb-1">
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {project.url}
          </p>
        </Link>
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {project.totalInsights}
          </div>
          <div className="text-xs text-muted-foreground">
            Insights
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {project.postsGenerated}
          </div>
          <div className="text-xs text-muted-foreground">
            Posts
          </div>
        </div>
      </div>

      {/* Last scraped */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
        <span>Last scraped:</span>
        <span>{formatDate(project.lastScraped)}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleStatus(project.id)}
          className={`
            flex-1 px-3 py-2 rounded-md text-sm font-medium transition-smooth
            ${project.status === 'active' ?'bg-warning/10 text-warning hover:bg-warning/20' :'bg-primary/10 text-primary hover:bg-primary/20'
            }
          `}
        >
          <Icon 
            name={project.status === 'active' ? 'PauseIcon' : 'PlayIcon'}
            size={14}
            className="inline mr-1"
          />
          {project.status === 'active' ? 'Pause' : 'Resume'}
        </button>
        
        <Link
          href="/project-detail"
          className="px-3 py-2 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-md text-sm font-medium transition-smooth"
        >
          View
        </Link>
        
        <button
          onClick={() => onOpenSettings(project.id)}
          className="p-2 hover:bg-muted rounded-md transition-smooth"
          aria-label={`Settings for ${project.name}`}
        >
          <Icon name="Cog6ToothIcon" size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;