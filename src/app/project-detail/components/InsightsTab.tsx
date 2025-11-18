import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Insight {
  id: string;
  date: string;
  source: string;
  sourceUrl: string;
  title: string;
  content: string;
  type: 'update' | 'milestone' | 'announcement' | 'discussion';
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
  };
}

interface InsightsTabProps {
  insights: Insight[];
}

const InsightsTab = ({ insights }: InsightsTabProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'update':
        return 'ArrowPathIcon';
      case 'milestone':
        return 'FlagIcon';
      case 'announcement':
        return 'MegaphoneIcon';
      case 'discussion':
        return 'ChatBubbleLeftRightIcon';
      default:
        return 'DocumentTextIcon';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'update':
        return 'text-blue-600 bg-blue-50';
      case 'milestone':
        return 'text-green-600 bg-green-50';
      case 'announcement':
        return 'text-purple-600 bg-purple-50';
      case 'discussion':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Icon name="DocumentTextIcon" size={48} className="text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Insights Yet</h3>
        <p className="text-muted-foreground max-w-md">
          Insights will appear here as we scrape updates from the project source. 
          Make sure scraping is enabled to start collecting data.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {insights.map((insight, index) => (
          <div key={insight.id} className="relative">
            {/* Timeline line */}
            {index < insights.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-full bg-border" />
            )}
            
            <div className="flex gap-4">
              {/* Timeline dot */}
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                ${getTypeColor(insight.type)}
              `}>
                <Icon 
                  name={getTypeIcon(insight.type) as any}
                  size={20}
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="bg-card border border-border rounded-lg p-4 shadow-subtle">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground mb-1 line-clamp-2">
                        {insight.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{insight.date}</span>
                        <span>•</span>
                        <a 
                          href={insight.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-smooth"
                        >
                          {insight.source}
                        </a>
                      </div>
                    </div>
                    
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-md capitalize
                      ${getTypeColor(insight.type)}
                    `}>
                      {insight.type}
                    </span>
                  </div>
                  
                  <p className="text-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {insight.content}
                  </p>
                  
                  {insight.engagement && (
                    <div className="flex items-center gap-4 pt-3 border-t border-border">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Icon name="HeartIcon" size={14} />
                        <span>{insight.engagement.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Icon name="ArrowPathRoundedSquareIcon" size={14} />
                        <span>{insight.engagement.shares}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Icon name="ChatBubbleLeftIcon" size={14} />
                        <span>{insight.engagement.comments}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsTab;