import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    sourceUrl: string;
    platform: 'x' | 'farcaster';
    tags: string[];
    lastUpdate: string;
    avatar?: string;
    isScrapingActive: boolean;
  };
}

const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'x':
        return 'XMarkIcon';
      case 'farcaster':
        return 'ChatBubbleLeftRightIcon';
      default:
        return 'LinkIcon';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'x':
        return 'text-gray-900 bg-gray-100';
      case 'farcaster':
        return 'text-purple-700 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-card border-b border-border p-6">
      <div className="flex items-start gap-4">
        {project.avatar && (
          <div className="flex-shrink-0">
            <AppImage
              src={project.avatar}
              alt={`${project.name} project avatar showing brand logo or representative image`}
              className="w-16 h-16 rounded-lg object-cover border border-border"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-foreground truncate">
              {project.name}
            </h1>
            
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${getPlatformColor(project.platform)}`}>
              <Icon 
                name={getPlatformIcon(project.platform) as any}
                size={12}
              />
              {project.platform.toUpperCase()}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <Icon name="LinkIcon" size={14} className="text-muted-foreground" />
            <a 
              href={project.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/80 transition-smooth truncate"
            >
              {project.sourceUrl}
            </a>
          </div>
          
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="ClockIcon" size={14} />
              <span>Last updated: {project.lastUpdate}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                project.isScrapingActive 
                  ? 'text-success bg-success/10' :'text-muted-foreground bg-muted'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  project.isScrapingActive ? 'bg-success animate-pulse' : 'bg-muted-foreground'
                }`} />
                {project.isScrapingActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;