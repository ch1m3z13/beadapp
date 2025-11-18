import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}

const EmptyState = ({
  title = "No Posts Yet",
  description = "Start by adding your first project to generate AI-powered social media posts.",
  actionText = "Add Project",
  actionHref = "/add-project"
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Icon name="DocumentTextIcon" size={32} className="text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-8 max-w-md">
        {description}
      </p>
      
      <Link
        href={actionHref}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth"
      >
        <Icon name="PlusIcon" size={20} />
        {actionText}
      </Link>
    </div>
  );
};

export default EmptyState;