import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface EmptyProjectsStateProps {
  hasSearchQuery: boolean;
  searchQuery?: string;
  onClearSearch?: () => void;
}

const EmptyProjectsState = ({ 
  hasSearchQuery, 
  searchQuery, 
  onClearSearch 
}: EmptyProjectsStateProps) => {
  if (hasSearchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="MagnifyingGlassIcon" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No projects found
        </h3>
        <p className="text-muted-foreground text-center mb-4 max-w-sm">
          No projects match "{searchQuery}". Try adjusting your search or filters.
        </p>
        <button
          onClick={onClearSearch}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
        >
          Clear Search
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Icon name="FolderPlusIcon" size={32} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No projects yet
      </h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        Start tracking your social media projects by adding your first project from X or Farcaster.
      </p>
      <Link
        href="/add-project"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth font-medium"
      >
        <Icon name="PlusIcon" size={20} />
        Add Your First Project
      </Link>
      
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md w-full">
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Icon name="XMarkIcon" size={16} className="text-gray-900" />
            </div>
            <span className="font-medium text-foreground">X Projects</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Track tweets, engagement, and trending topics
          </p>
        </div>
        
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Icon name="ChatBubbleLeftRightIcon" size={16} className="text-purple-600" />
            </div>
            <span className="font-medium text-foreground">Farcaster</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Monitor casts, channels, and community activity
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyProjectsState;