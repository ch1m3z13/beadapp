'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterControlsProps {
  selectedProject: string;
  selectedStatus: string;
  sortBy: string;
  onProjectChange: (project: string) => void;
  onStatusChange: (status: string) => void;
  onSortChange: (sort: string) => void;
  projects: Array<{ id: string; name: string; }>;
}

const FilterControls = ({
  selectedProject,
  selectedStatus,
  sortBy,
  onProjectChange,
  onStatusChange,
  onSortChange,
  projects
}: FilterControlsProps) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most-liked', label: 'Most Liked' },
    { value: 'most-shared', label: 'Most Shared' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="FunnelIcon" size={20} className="text-muted-foreground" />
        <h2 className="font-medium text-foreground">Filter Posts</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Project Filter */}
        <div>
          <label htmlFor="project-filter" className="block text-sm font-medium text-foreground mb-2">
            Project
          </label>
          <select
            id="project-filter"
            value={selectedProject}
            onChange={(e) => onProjectChange(e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-foreground mb-2">
            Status
          </label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label htmlFor="sort-filter" className="block text-sm font-medium text-foreground mb-2">
            Sort By
          </label>
          <select
            id="sort-filter"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;