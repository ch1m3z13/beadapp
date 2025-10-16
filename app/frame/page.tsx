'use client'
import { useState, useEffect } from 'react'
import nextDynamic from 'next/dynamic'
import { useConnect, useDisconnect } from 'wagmi'
import { sdk } from '@farcaster/miniapp-sdk'
import Sentiment from 'sentiment'
import { supabase } from '../../lib/supabase'

export const dynamic = 'force-dynamic'

const DynamicBaseTxButton = nextDynamic(() => import('../../components/BaseTxButton'), { ssr: false })

export default function WingmanFrame() {
  const [view, setView] = useState<'list' | 'project'>('list')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [project, setProject] = useState('@MorphLayer')
  const [update, setUpdate] = useState('')
  const [summaryLines, setSummaryLines] = useState<string[]>([])
  const [postIdea, setPostIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [showWalletSelect, setShowWalletSelect] = useState(false)
  const [fid, setFid] = useState<number | null>(null)
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [username, setUsername] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'saved'>('all')
  const [sentimentPoll, setSentimentPoll] = useState({ bullish: 0, neutral: 0, cautious: 0 })
  const [dailySummary, setDailySummary] = useState<string>('') // New: Daily summary for list view

  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const sentiment = new Sentiment()

  useEffect(() => {
    const initFarcaster = async () => {
      try {
        await sdk.actions.ready()
        
        const { token } = await sdk.quickAuth.getToken()
        const payload = JSON.parse(atob(token.split('.')[1]))
        const userFid = payload.sub
        setFid(userFid)
        setUsername(payload.username || `User ${userFid}`)
        
        await Promise.all([
          fetchWatchlist(userFid),
          fetchNotificationStatus(userFid),
          fetchDailySummary(userFid) // New: Load daily summary on init
        ])
      } catch (error) {
        console.error('Farcaster init failed:', error)
        setErrorMessage('Failed to authenticate with Farcaster')
        
        try {
          await sdk.actions.ready()
        } catch (readyError) {
          console.error('Ready call failed:', readyError)
        }
      }
    }

    initFarcaster()
  }, [])

  const fetchNotificationStatus = async (userFid: number) => {
    const { data } = await supabase.from('users').select('notifications_enabled').eq('fid', userFid).single()
    if (data) setNotificationsEnabled(data.notifications_enabled || false)
  }

  const fetchWatchlist = async (userFid: number) => {
    if (!userFid) return
    const { data, error } = await supabase.from('watchlists').select('project').eq('fid', userFid)
    if (data) setWatchlist(data.map(item => item.project))
    if (error) {
      console.error('Watchlist fetch error:', error)
      setErrorMessage('Failed to fetch watchlist')
    }
  }

  // New: Fetch combined daily summary for all watchlist projects
  const fetchDailySummary = async (userFid: number) => {
    if (!userFid) return
    const { data: projects } = await supabase.from('watchlists').select('project').eq('fid', userFid)
    if (!projects || projects.length === 0) return

    let summary = 'Daily Summary:\n'
    for (const { project } of projects) {
      const res = await fetch(`/api/update?project=${encodeURIComponent(project)}`)
      if (res.ok) {
        const { summary: projSummary } = await res.json()
        summary += `${project}: ${projSummary.slice(0, 50)}...\n`
      }
    }
    setDailySummary(summary)
  }

  const addToWatchlist = async () => {
    if (!fid) return alert('Connect Farcaster wallet first')
    const { error } = await supabase.from('watchlists').insert({ fid, project })
    if (error) {
      console.error('Add watchlist error:', error)
      setErrorMessage(error.message || 'Unknown error adding to watchlist.')
    } else {
      setWatchlist([...watchlist, project])
      alert('Added to watchlist!')
      fetchDailySummary(fid) // Refresh summary
    }
  }

  const openProject = (projectName: string) => {
    setProject(projectName)
    setSelectedProject(projectName)
    setView('project')
    getUpdateForProject(projectName)
  }

  const getUpdate = async () => {
    await getUpdateForProject(project)
  }

  const getUpdateForProject = async (projectName: string) => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const res = await fetch(`/api/update?project=${encodeURIComponent(projectName)}`)
      if (!res.ok) throw new Error('Fetch failed')
      const { summary, isLive, postCount, errorType, waitUntil } = await res.json()
      const fullUpdate = `${isLive ? '🔴 Live' : '🔵 Mock'} Update (${postCount} posts):\n${summary}${errorType === 'rate_limit' ? `\n⏳ Resets: ${waitUntil}` : ''}`
      setUpdate(fullUpdate)
      setSummaryLines(summary.split('\n').filter(line => line.trim()))
    } catch (error) {
      setUpdate('Error fetching update—check console or use mock.')
      console.error(error)
      setErrorMessage('Failed to get update. Try again.')
    }
    setLoading(false)
  }

  const genPost = () => {
    if (!update) return alert('Get an update first!')
    const analysis = sentiment.analyze(update)
    const score = analysis.score
    let tone = 'neutral 📊'
    let sentimentEmoji = '📊'
    if (score > 0) {
      tone = 'bullish 🚀'
      sentimentEmoji = '🚀'
    } else if (score < 0) {
      tone = 'cautious ⚠️'
      sentimentEmoji = '⚠️'
    }

    const ideas = [
      `${sentimentEmoji} ${tone} vibe on ${project}: ${summaryLines[0] || 'Update'}. As a holder, I'm ${score > 0 ? 'excited' : 'watching closely'}! #Web3 #${project.replace('@', '')}`,
      `${sentimentEmoji} Quick ${tone} take: ${summaryLines[1] || 'Check it out'}. Who's joining? #Crypto`,
      `${sentimentEmoji} ${tone} insights from ${project}: ${summaryLines[2] || 'More to come'}. Bridge now? #${project.replace('@', '')}`
    ]

    setPostIdea(ideas.join('\n\n'))
  }

  const handleSentimentVote = (vote: 'bullish' | 'neutral' | 'cautious') => {
    setSentimentPoll(prev => ({ ...prev, [vote]: prev[vote] + 1 }))
    // Optional: Send to Supabase for global stats
  }

  const handleAddMiniApp = async () => {
    if (!isSDKLoaded) return alert('SDK not loaded')
    
    const result = await addMiniApp()
    if (result.added && result.notificationDetails) {
      setNotificationEnabled(true)
      alert('Mini App added and notifications enabled!')
    } else if (result.added) {
      alert('Mini App added, but notifications not enabled.')
    } else {
      alert('Failed to add Mini App: ' + result.reason)
    }
  }

  const toggleNotifications = async () => {
    if (!fid) return alert('Connect Farcaster wallet first')
    const newEnabled = !notificationsEnabled
    const { error } = await supabase.from('users').upsert({ fid, notifications_enabled: newEnabled })
    if (error) console.error('Notifications toggle error:', error)
    else setNotificationsEnabled(newEnabled)
  }

  const handleConnect = (connector: any) => {
    connect({ connector }, { onSuccess: () => setShowWalletSelect(false) })
  }

  // LIST VIEW - Sketch-inspired: "My Watchlist" with projects as rectangular cards, Add New Project at top
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-black text-white p-4 space-y-4">
        {/* Top Add New Project */}
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-700">
          <h2 className="text-white font-bold text-lg mb-3">Add New Project</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="@MorphLayer"
              className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
            />
            <button
              onClick={addToWatchlist}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              +
            </button>
          </div>
        </div>

        {/* My Watchlist Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-white font-bold text-xl">My Watchlist</h1>
          <span className="text-gray-400 text-sm">{watchlist.length} projects</span>
        </div>

        {/* Project Cards - Rectangular blocks */}
        <div className="space-y-3">
          {watchlist.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👀</div>
              <p className="text-gray-400 mb-2">No projects tracked yet</p>
              <p className="text-gray-500 text-sm">Add a project above to get started</p>
            </div>
          ) : (
            watchlist.map((proj, idx) => (
              <div
                key={idx}
                onClick={() => openProject(proj)}
                className="bg-gray-900 rounded-2xl p-4 border border-gray-700 cursor-pointer hover:border-purple-500 hover:bg-gray-800 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-bold text-lg">{proj}</h3>
                  <div className="text-gray-400 text-sm">View</div>
                </div>
                <p className="text-gray-500 text-sm">Tap to see updates</p>
              </div>
            ))
          )}
        </div>

        {/* Daily Summary Card - Prominent block */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-4 border border-purple-500">
          <h3 className="text-purple-400 font-bold text-sm mb-2">Daily Summary</h3>
          <p className="text-gray-300 text-xs leading-relaxed">{dailySummary || 'No updates today. Check back soon!'}</p>
          <button
            onClick={() => fetchDailySummary(fid)}
            className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-xs font-semibold transition"
          >
            Refresh
          </button>
        </div>

        {/* Wallet Toggle */}
        <button 
          onClick={() => setShowWalletSelect(!showWalletSelect)} 
          className="w-full p-1 text-xs text-gray-400 mt-2"
        >
          {showWalletSelect ? 'Hide' : 'Change Wallet'}
        </button>
      </div>
    )
  }

  // PROJECT VIEW - Sketch: Back, Summary, Post Gen, Track on Base (auto-adds)
  return (
    <div className="min-h-screen bg-black text-white p-4 space-y-4">
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setView('list')}
          className="text-gray-400 hover:text-white"
        >
          ← Back
        </button>
        <h1 className="text-white font-bold text-xl flex-1">{project}</h1>
      </div>

      {/* Summary - Auto-generated on open */}
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-700 space-y-3">
        <h2 className="text-white font-bold text-lg">Summary</h2>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {summaryLines.map((line, i) => (
              <p key={i} className="text-gray-300 text-sm">{line}</p>
            ))}
          </div>
        )}
      </div>

      {/* Post Gen */}
      <button
        onClick={genPost}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold text-lg transition"
        disabled={!update}
      >
        ✨ Generate Post Idea
      </button>

      {postIdea && (
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-700">
          <h3 className="text-white font-bold text-lg mb-3">Your Post Idea</h3>
          <p className="text-gray-300 text-sm whitespace-pre-wrap mb-3">{postIdea}</p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition">
            Cast to Farcaster
          </button>
        </div>
      )}

      {/* Track on Base - Auto-adds to watchlist */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-4 border border-purple-500">
        <DynamicBaseTxButton project={project} />
        <p className="text-purple-400 text-xs mt-2 text-center">* Auto-adds to watchlist on success</p>
      </div>

      {errorMessage && (
        <div className="bg-red-900/20 border border-red-500 rounded-2xl p-4">
          <p className="text-red-400 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Wallet Selector */}
      {showWalletSelect && (
        <div className="mt-2 space-y-1">
          <select 
            onChange={(e) => handleConnect(connectors.find(c => c.name === e.target.value))}
            className="w-full p-2 bg-gray-800 rounded text-xs"
          >
            <option value="">Select Wallet</option>
            {connectors.map((connector) => (
              <option key={connector.id} value={connector.name}>
                {connector.name} {isPending && connector.id === 'pending' ? '(connecting...)' : ''}
              </option>
            ))}
          </select>
          <button onClick={() => setShowWalletSelect(false)} className="w-full p-1 text-xs text-gray-400 rounded">
            Cancel
          </button>
        </div>
      )}
      <button 
        onClick={() => setShowWalletSelect(!showWalletSelect)} 
        className="w-full p-1 text-xs text-gray-400 mt-2"
      >
        {showWalletSelect ? 'Hide' : 'Change Wallet'}
      </button>
    </div>
  )
}