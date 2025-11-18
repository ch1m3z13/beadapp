'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ScheduledPost {
  id: string;
  content: string;
  scheduledFor: string;
  platform: 'x' | 'farcaster';
  status: 'scheduled' | 'published' | 'failed';
}

interface ScheduleTabProps {
  scheduledPosts: ScheduledPost[];
  onReschedule: (postId: string, newDate: string) => void;
  onCancel: (postId: string) => void;
}

const ScheduleTab = ({ scheduledPosts, onReschedule, onCancel }: ScheduleTabProps) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { color: 'text-primary bg-primary/10', label: 'Scheduled', icon: 'ClockIcon' };
      case 'published':
        return { color: 'text-success bg-success/10', label: 'Published', icon: 'CheckCircleIcon' };
      case 'failed':
        return { color: 'text-error bg-error/10', label: 'Failed', icon: 'ExclamationTriangleIcon' };
      default:
        return { color: 'text-muted-foreground bg-muted', label: 'Unknown', icon: 'QuestionMarkCircleIcon' };
    }
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'x' ? 'XMarkIcon' : 'ChatBubbleLeftRightIcon';
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  if (scheduledPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Icon name="CalendarIcon" size={48} className="text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Scheduled Posts</h3>
        <p className="text-muted-foreground max-w-md">
          Approved posts will appear here when scheduled for publishing. 
          Set up posting schedules to automate your content workflow.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-foreground">Posting Schedule</h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
              viewMode === 'list' ?'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon name="ListBulletIcon" size={16} />
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
              viewMode === 'calendar' ?'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon name="CalendarIcon" size={16} />
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-4">
          {scheduledPosts.map((post) => {
            const statusConfig = getStatusConfig(post.status);
            const dateTime = formatDateTime(post.scheduledFor);
            
            return (
              <div key={post.id} className="bg-card border border-border rounded-lg p-4 shadow-subtle">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusConfig.color}`}>
                      <Icon name={statusConfig.icon as any} size={20} />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon 
                          name={getPlatformIcon(post.platform) as any}
                          size={16}
                          className="text-muted-foreground"
                        />
                        <span className={`px-2 py-1 text-xs font-medium rounded-md ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">{dateTime.date}</div>
                        <div className="text-xs text-muted-foreground">{dateTime.time}</div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-foreground leading-relaxed mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    
                    {post.status === 'scheduled' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onReschedule(post.id, post.scheduledFor)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-smooth"
                        >
                          <Icon name="CalendarIcon" size={12} />
                          Reschedule
                        </button>
                        <button
                          onClick={() => onCancel(post.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-error bg-error/10 hover:bg-error/20 rounded-md transition-smooth"
                        >
                          <Icon name="XMarkIcon" size={12} />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-center py-12">
            <Icon name="CalendarDaysIcon" size={48} className="text-muted-foreground mb-4 mx-auto" />
            <h4 className="text-lg font-medium text-foreground mb-2">Calendar View</h4>
            <p className="text-muted-foreground">
              Calendar view will show scheduled posts in a monthly grid format.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleTab;