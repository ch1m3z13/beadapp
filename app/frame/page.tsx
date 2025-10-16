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

  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const sentiment = new Sentiment()

  useEffect(() => {
    const initFarcaster = async () => {
      await sdk.actions.ready()
      
      try {
        const { token } = await sdk.quickAuth.getToken()
        const payload = JSON.parse(atob(token.split('.')[1]))
        const userFid = payload.sub
        setFid(userFid)
        setUsername(payload.username || `User ${userFid}`)
        fetchWatchlist(userFid)
        fetchNotificationStatus(userFid)
      } catch (error) {
        console.error('Farcaster quick auth failed:', error)
        setErrorMessage('Failed to authenticate with Farcaster')
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

  const addToWatchlist = async () => {
    if (!fid) return alert('Connect Farcaster wallet first')
    const { error } = await supabase.from('watchlists').insert({ fid, project })
    setProject('');
    if (error) {
      console.error('Add watchlist error:', error)
      setErrorMessage(error.message || 'Unknown error adding to watchlist.')
    } else {
      setWatchlist([...watchlist, project])
      alert('Added to watchlist!')
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

  const handleConnect = (connector: any) => {
    connect({ connector }, { onSuccess: () => setShowWalletSelect(false) })
  }

  const toggleNotifications = async () => {
    if (!fid) return alert('Connect Farcaster wallet first')
    const newEnabled = !notificationsEnabled
    const { error } = await supabase.from('users').upsert({ fid, notifications_enabled: newEnabled })
    if (error) console.error('Notifications toggle error:', error)
    else setNotificationsEnabled(newEnabled)
  }


  const handleTrackOnBase = async () => {
    if (!fid || !project) return alert('Connect Farcaster wallet first')
    try {
      const { data, error } = await supabase
        .from('watchlists')
        .upsert({ fid, project })

      if (error) {
        console.error('Auto-add watchlist error:', error)
        setErrorMessage('Failed to sync watchlist.')
      } else {
        if (!watchlist.includes(project)) {
          setWatchlist([...watchlist, project])
        }
        console.log(`✅ ${project} added to watchlist on Track on Base`)
      }
    } catch (err) {
      console.error('Track on Base handler error:', err)
    }
  }


  if (view === 'list') {
    return (
      <div className="p-4 bg-black text-white max-w-md min-h-screen">
        {/* Profile Header */}
        <div className="flex items-center mb-6 pb-4 border-b border-gray-700">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-xl">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <h2 className="font-bold text-lg">{username}</h2>
            <p className="text-xs text-gray-400">My Watchlist</p>
          </div>
        </div>

        {/* Watchlist Projects */}
        <div className="mb-4">
          <h3 className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Projects</h3>
          {watchlist.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No projects yet</p>
              <p className="text-xs mt-2">Add one below to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {watchlist.map((proj, idx) => (
                <div 
                  key={idx}
                  onClick={() => openProject(proj)}
                  className="p-4 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800 transition border border-gray-800 hover:border-purple-500"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{proj}</p>
                      <p className="text-xs text-gray-400">Tap to view updates</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Project */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h3 className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Add New Project</h3>
          <input
            type="text"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="@MorphLayer"
            className="w-full p-3 mb-2 bg-gray-900 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
          />
          <button 
            onClick={addToWatchlist} 
            className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
          >
            + Add to Watchlist
          </button>
          {errorMessage && <p className="text-red-400 mt-2 text-xs">{errorMessage}</p>}
        </div>

        {/* Settings */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <button 
            onClick={toggleNotifications} 
            className="w-full p-3 bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center justify-between transition"
          >
            <span>Daily Notifications</span>
            <div className={`w-12 h-6 rounded-full transition ${notificationsEnabled ? 'bg-green-500' : 'bg-gray-700'}`}>
              <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </button>
        </div>
      </div>
    )
  }


  return (
    <div className="p-4 bg-black text-white max-w-md min-h-screen">
      {/* Back button */}
      <button 
        onClick={() => setView('list')}
        className="flex items-center text-gray-400 hover:text-white mb-4 transition"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Project Header */}
      <div className="mb-6 pb-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">{project}</h1>
        <p className="text-sm text-gray-400">Summary & Post Generator</p>
      </div>

      {/* Get Update Button */}
      <button 
        onClick={getUpdate} 
        className="w-full p-3 mb-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition disabled:opacity-50" 
        disabled={loading}
      >
        {loading ? 'Fetching...' : '🔄 Get Update'}
      </button>

      {loading && (
        <div className="w-full flex justify-center mb-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {errorMessage && <p className="text-red-400 mb-4 text-sm">{errorMessage}</p>}

      {/* Summary Display */}
      {update && summaryLines.length > 0 && (
        <div className="mb-4 max-h-64 overflow-y-auto">
          <h3 className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Latest Updates</h3>
          {summaryLines.map((line, i) => (
            <div 
              key={i} 
              className="p-3 bg-gray-900 rounded-lg mb-2 text-sm border border-gray-800 hover:border-gray-700 transition"
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 mb-4">
        <button 
          onClick={genPost} 
          className="w-full p-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
        >
          ✨ Gen Post Idea
        </button>
        
        <div onClick={handleTrackOnBase}>
          <DynamicBaseTxButton project={project} />
        </div>

      </div>

      {/* Generated Post */}
      {postIdea && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <h3 className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Generated Post</h3>
          <p className="text-sm font-mono whitespace-pre-wrap">{postIdea}</p>
        </div>
      )}

      {/* Wallet Management */}
      {showWalletSelect && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg">
          <select 
            onChange={(e) => handleConnect(connectors.find(c => c.name === e.target.value))}
            className="w-full p-2 bg-gray-800 rounded mb-2"
          >
            <option value="">Select Wallet</option>
            {connectors.map((connector) => (
              <option key={connector.id} value={connector.name}>
                {connector.name} {isPending && '(connecting...)'}
              </option>
            ))}
          </select>
          <button 
            onClick={() => setShowWalletSelect(false)} 
            className="w-full p-2 text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      )}
      
      <button 
        onClick={() => setShowWalletSelect(!showWalletSelect)} 
        className="w-full p-2 text-xs text-gray-400 hover:text-white mt-2"
      >
        {showWalletSelect ? 'Hide' : 'Change Wallet'}
      </button>
    </div>
  )
}