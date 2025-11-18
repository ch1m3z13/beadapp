'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sentiment from 'sentiment';
import BaseTxButton from '@/components/common/BaseTxButton';
import BottomTabNavigation from '@/components/common/BottomTabNavigation';

type TabType = 'summary' | 'post-gen' | 'track';

interface UpdateLine {
  text: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

const ProjectDetailInteractive = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const project = searchParams.get('project') || '@MorphLayer';
  
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState('');
  const [summaryLines, setSummaryLines] = useState<UpdateLine[]>([]);
  const [postIdea, setPostIdea] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const sentiment = new Sentiment();

  const getUpdate = async () => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      const res = await fetch(`/api/update?project=${encodeURIComponent(project)}`);
      
      if (!res.ok) throw new Error('Fetch failed');
      
      const { summary, isLive, postCount, errorType, waitUntil } = await res.json();
      
      const fullUpdate = `${isLive ? '🔴 Live' : '🔵 Mock'} Update (${postCount} posts):\n${summary}${
        errorType === 'rate_limit' ? `\n⏳ Resets: ${waitUntil}` : ''
      }`;
      
      setUpdate(fullUpdate);
      
      // Parse summary lines with sentiment
      const lines = summary.split('\n').filter((line: string) => line.trim());
      const analyzedLines = lines.map((text: string) => {
        const analysis = sentiment.analyze(text);
        let sentimentType: 'bullish' | 'bearish' | 'neutral' = 'neutral';
        
        if (analysis.score > 0) sentimentType = 'bullish';
        else if (analysis.score < 0) sentimentType = 'bearish';
        
        return { text, sentiment: sentimentType };
      });
      
      setSummaryLines(analyzedLines);
    } catch (error) {
      setUpdate('Error fetching update—check console or use mock.');
      console.error(error);
      setErrorMessage('Failed to get update. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const genPost = () => {
    if (!update) {
      alert('Get an update first!');
      return;
    }
    
    const analysis = sentiment.analyze(update);
    const score = analysis.score;
    let tone = 'neutral 📊';
    let sentimentEmoji = '📊';
    
    if (score > 0) {
      tone = 'bullish 🚀';
      sentimentEmoji = '🚀';
    } else if (score < 0) {
      tone = 'cautious ⚠️';
      sentimentEmoji = '⚠️';
    }

    const ideas = [
      `${sentimentEmoji} ${tone} vibe on ${project}: ${summaryLines[0]?.text || 'Update'}. As a holder, I'm ${
        score > 0 ? 'excited' : 'watching closely'
      }! #Web3 #${project.replace('@', '')}`,
      `${sentimentEmoji} Quick ${tone} take: ${summaryLines[1]?.text || 'Check it out'}. Who's joining? #Crypto`,
      `${sentimentEmoji} ${tone} insights from ${project}: ${summaryLines[2]?.text || 'More to come'}. Bridge now? #${project.replace('@', '')}`
    ];

    setPostIdea(ideas.join('\n\n'));
    setActiveTab('post-gen');
  };

  const getSentimentIcon = (sentiment: 'bullish' | 'bearish' | 'neutral') => {
    switch (sentiment) {
      case 'bullish':
        return '🚀';
      case 'bearish':
        return '⚠️';
      default:
        return '📊';
    }
  };

  const getSentimentColor = (sentiment: 'bullish' | 'bearish' | 'neutral') => {
    switch (sentiment) {
      case 'bullish':
        return 'from-success to-success/80';
      case 'bearish':
        return 'from-warning to-warning/80';
      default:
        return 'from-primary to-primary/80';
    }
  };

  useEffect(() => {
    // Auto-fetch update on mount
    getUpdate();
  }, [project]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-muted-foreground hover:text-foreground transition mb-3"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{project}</h1>
              <p className="text-sm text-muted-foreground">Live updates & insights</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'summary'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              📰 Summary
            </button>
            <button
              onClick={() => setActiveTab('post-gen')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'post-gen'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              ✨ Post Gen
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'track'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              ⛓️ Track
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            {/* Refresh Button */}
            <button
              onClick={getUpdate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Fetching Latest...
                </div>
              ) : (
                '🔄 Refresh Updates'
              )}
            </button>

            {/* Summary Cards */}
            {summaryLines.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Latest Activity
                </h3>
                {summaryLines.map((line, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl p-4 shadow-subtle border border-border hover:border-primary transition"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${getSentimentColor(
                          line.sentiment
                        )} rounded-lg flex items-center justify-center text-lg flex-shrink-0`}
                      >
                        {getSentimentIcon(line.sentiment)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground leading-relaxed">{line.text}</p>
                        <span
                          className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                            line.sentiment === 'bullish'
                              ? 'bg-success/10 text-success'
                              : line.sentiment === 'bearish'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {line.sentiment}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl p-8 text-center border border-border">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-muted-foreground">
                  {loading ? 'Loading updates...' : 'Click "Refresh Updates" to fetch the latest activity'}
                </p>
              </div>
            )}

            {/* Generate Post Button */}
            {summaryLines.length > 0 && (
              <button
                onClick={genPost}
                className="w-full bg-secondary hover:bg-secondary/90 text-white py-4 rounded-xl font-semibold transition"
              >
                ✨ Generate Post from Updates
              </button>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-error/10 border border-error rounded-xl p-4">
                <p className="text-sm text-error">{errorMessage}</p>
              </div>
            )}
          </div>
        )}

        {/* Post Gen Tab */}
        {activeTab === 'post-gen' && (
          <div className="space-y-4">
            {postIdea ? (
              <>
                <div className="bg-card rounded-xl p-5 shadow-subtle border border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Generated Post Ideas
                  </h3>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap mb-4">
                    {postIdea}
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition">
                      Cast to Farcaster
                    </button>
                    <button
                      onClick={genPost}
                      className="px-4 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition"
                      title="Regenerate"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-card rounded-xl p-8 text-center border border-border">
                <div className="text-4xl mb-3">✨</div>
                <p className="text-muted-foreground mb-4">
                  No post generated yet. Get updates first, then generate posts.
                </p>
                <button
                  onClick={() => setActiveTab('summary')}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Go to Summary
                </button>
              </div>
            )}
          </div>
        )}

        {/* Track Tab */}
        {activeTab === 'track' && (
          <div className="space-y-4">
            <div className="bg-card rounded-xl p-5 shadow-subtle border border-border">
              <h3 className="text-lg font-bold text-foreground mb-2">Track On-Chain</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Record your tracking activity on Base blockchain. This creates a permanent on-chain record
                of your project monitoring.
              </p>
              
              {/* Base Transaction Button */}
              <BaseTxButton project={project} />
            </div>

            {/* Benefits */}
            <div className="bg-muted/50 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-foreground mb-3">Why Track On-Chain?</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Permanent, immutable record of your research</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Prove your early interest in projects</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Build your on-chain reputation as a researcher</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Low gas fees on Base network</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <BottomTabNavigation />
    </div>
  );
};

export default ProjectDetailInteractive;