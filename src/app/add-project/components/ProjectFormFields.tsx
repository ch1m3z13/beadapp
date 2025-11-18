import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProjectFormFieldsProps {
  formData: {
    name: string;
    platform: 'x' | 'farcaster' | '';
    url: string;
    tags: string;
    description: string;
  };
  onFormDataChange: (field: string, value: string) => void;
  urlError: string;
  isValidating: boolean;
}

const ProjectFormFields = ({ 
  formData, 
  onFormDataChange, 
  urlError, 
  isValidating 
}: ProjectFormFieldsProps) => {
  const platforms = [
    { id: 'x', label: 'X (Twitter)', icon: 'AtSymbolIcon' },
    { id: 'farcaster', label: 'Farcaster', icon: 'ChatBubbleLeftRightIcon' }
  ];

  return (
    <div className="space-y-6">
      {/* Project Name */}
      <div className="space-y-2">
        <label htmlFor="project-name" className="block text-sm font-medium text-foreground">
          Project Name *
        </label>
        <input
          id="project-name"
          type="text"
          value={formData.name}
          onChange={(e) => onFormDataChange('name', e.target.value)}
          placeholder="Enter project name"
          className="w-full px-4 py-3 bg-input border border-border rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                   text-foreground placeholder-muted-foreground transition-smooth"
          required
        />
      </div>

      {/* Platform Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Source Platform *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {platforms.map((platform) => (
            <label
              key={platform.id}
              className={`
                flex items-center gap-3 p-4 border rounded-lg cursor-pointer
                transition-smooth hover:bg-muted/50
                ${formData.platform === platform.id 
                  ? 'border-primary bg-primary/5 text-primary' :'border-border bg-card text-foreground'
                }
              `}
            >
              <input
                type="radio"
                name="platform"
                value={platform.id}
                checked={formData.platform === platform.id}
                onChange={(e) => onFormDataChange('platform', e.target.value)}
                className="sr-only"
              />
              <Icon 
                name={platform.icon as any}
                size={20}
                className={formData.platform === platform.id ? 'text-primary' : 'text-muted-foreground'}
              />
              <span className="font-medium">{platform.label}</span>
              {formData.platform === platform.id && (
                <Icon 
                  name="CheckCircleIcon"
                  size={16}
                  variant="solid"
                  className="text-primary ml-auto"
                />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <label htmlFor="project-url" className="block text-sm font-medium text-foreground">
          Project URL *
        </label>
        <div className="relative">
          <input
            id="project-url"
            type="url"
            value={formData.url}
            onChange={(e) => onFormDataChange('url', e.target.value)}
            placeholder={
              formData.platform === 'x' ?'https://x.com/username/status/...' 
                : formData.platform === 'farcaster' ?'https://warpcast.com/username/...'
                : 'Select platform first'
            }
            disabled={!formData.platform}
            className={`
              w-full px-4 py-3 pr-10 bg-input border rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
              text-foreground placeholder-muted-foreground transition-smooth
              disabled:opacity-50 disabled:cursor-not-allowed
              ${urlError ? 'border-error focus:ring-error' : 'border-border'}
            `}
            required
          />
          {isValidating && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon 
                name="ArrowPathIcon"
                size={16}
                className="text-muted-foreground animate-spin"
              />
            </div>
          )}
        </div>
        {urlError && (
          <p className="text-sm text-error flex items-center gap-2">
            <Icon name="ExclamationTriangleIcon" size={16} />
            {urlError}
          </p>
        )}
        {formData.url && !urlError && !isValidating && (
          <p className="text-sm text-success flex items-center gap-2">
            <Icon name="CheckCircleIcon" size={16} />
            Valid {formData.platform === 'x' ? 'X' : 'Farcaster'} URL
          </p>
        )}
      </div>

      {/* Optional Fields */}
      <div className="space-y-6 pt-4 border-t border-border">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Icon name="AdjustmentsHorizontalIcon" size={16} />
          Optional Settings
        </h3>

        {/* Tags */}
        <div className="space-y-2">
          <label htmlFor="project-tags" className="block text-sm font-medium text-foreground">
            Tags
          </label>
          <input
            id="project-tags"
            type="text"
            value={formData.tags}
            onChange={(e) => onFormDataChange('tags', e.target.value)}
            placeholder="crypto, defi, nft (comma separated)"
            className="w-full px-4 py-3 bg-input border border-border rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                     text-foreground placeholder-muted-foreground transition-smooth"
          />
          <p className="text-xs text-muted-foreground">
            Add tags to organize and categorize your projects
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="project-description" className="block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="project-description"
            value={formData.description}
            onChange={(e) => onFormDataChange('description', e.target.value)}
            placeholder="Brief description of the project..."
            rows={3}
            className="w-full px-4 py-3 bg-input border border-border rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                     text-foreground placeholder-muted-foreground transition-smooth resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Optional context about the project for better content generation
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormFields;