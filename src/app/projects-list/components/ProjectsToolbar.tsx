'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProjectsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  selectedCount: number;
  onBulkAction: (action: string) => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

const ProjectsToolbar = ({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  selectedCount,
  onBulkAction,
  onToggleFilters,
  showFilters
}: ProjectsToolbarProps) => {
  const filterOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'error', label: 'Error' },
    { value: 'x', label: 'X Platform' },
    { value: 'farcaster', label: 'Farcaster' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Recent Activity' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'created', label: 'Date Created' },
    { value: 'insights', label: 'Most Insights' }
  ];

  return (
    <div className="bg-card border-b border-border">
      {/* Main toolbar */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Icon 
              name="MagnifyingGlassIcon" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={onToggleFilters}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-smooth"
            aria-label="Toggle filters"
          >
            <Icon name="AdjustmentsHorizontalIcon" size={20} />
          </button>

          {/* Desktop filters */}
          <div className="hidden lg:flex items-center gap-2">
            <select
              value={selectedFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedCount > 0 && (
          <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">
                {selectedCount} project{selectedCount > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onBulkAction('pause')}
                  className="px-3 py-1 text-sm bg-warning/10 text-warning hover:bg-warning/20 rounded-md transition-smooth"
                >
                  Pause All
                </button>
                <button
                  onClick={() => onBulkAction('resume')}
                  className="px-3 py-1 text-sm bg-success/10 text-success hover:bg-success/20 rounded-md transition-smooth"
                >
                  Resume All
                </button>
                <button
                  onClick={() => onBulkAction('export')}
                  className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-md transition-smooth"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile filters panel */}
      {showFilters && (
        <div className="lg:hidden border-t border-border p-4 bg-muted/30">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Filter by
              </label>
              <select
                value={selectedFilter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsToolbar;