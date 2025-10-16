'use client'
import { useState, useEffect } from 'react'
import nextDynamic from 'next/dynamic'
import { useConnect, useDisconnect } from 'wagmi'
import { sdk } from '@farcaster/frame-sdk'
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
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [miniAppAdded, setMiniAppAdded] = useState(false)
  const [notificationDetails, setNotificationDetails] = useState<any>(null)

  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const sentiment = new Sentiment()

  useEffect(() => {
    const initFarcaster = async () => {
      try {

        const context = await sdk.context
        setIsSDKLoaded(true)
        

        if (context.client.added) {
          setMiniAppAdded(true)
          setNotificationDetails(context.client.notificationDetails)
          setNotificationsEnabled(!!context.client.notificationDetails)
        }
        

        if (context.user?.fid) {
          const userFid = context.user.fid
          setFid(userFid)
          setUsername(context.user.username || `User ${userFid}`)
          
          await Promise.all([
            fetchWatchlist(userFid),
            fetchNotificationStatus(userFid)
          ])
        }
        

        sdk.actions.ready()
      } catch (error) {
        console.error('Farcaster init failed:', error)
        setErrorMessage('Failed to authenticate with Farcaster')
        
        try {
          sdk.actions.ready()
          setIsSDKLoaded(true)
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

  const addToWatchlist = async () => {
    if (!fid) return alert('Connect Farcaster wallet first')
    const { error } = await supabase.from('watchlists').insert({ fid, project })
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

  const handleAddMiniApp = async () => {
    if (!isSDKLoaded) return alert('SDK not loaded')
    
    try {
      const result = await sdk.actions.addFrame()
      
      if (result.added) {
        setMiniAppAdded(true)
        

        if (result.notificationDetails) {
          setNotificationDetails(result.notificationDetails)
          setNotificationsEnabled(true)
          

          console.log('Notifications enabled:', result.notificationDetails)
          
          if (fid) {
            await supabase.from('users').upsert({ 
              fid, 
              notifications_enabled: true 
            })
          }
        }
      }
    } catch (error) {
      console.error('Error adding mini app:', error)
      setErrorMessage('Failed to add mini app')
    }
  }

  const toggleNotifications = async () => {
    if (!miniAppAdded) {

      return handleAddMiniApp()
    }
    
    if (!fid) return alert('Connect Farcaster wallet first')
    
    const newEnabled = !notificationsEnabled
    const { error } = await supabase.from('users').upsert({ fid, notifications_enabled: newEnabled })
    if (error) console.error('Notifications toggle error:', error)
    else setNotificationsEnabled(newEnabled)
  }


  if (view === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
        {/* Header with balance */}
        <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Bead</h1>
                <p className="text-gray-400 text-xs">by {username}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-white text-sm font-semibold">{watchlist.length}</span>
            </div>
          </div>
        </div>

        {/* Mini App Add Banner - Show if not added */}
        {!miniAppAdded && (
          <div className="mx-4 mt-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 border border-purple-400">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1">Enable Notifications</h3>
                <p className="text-purple-100 text-xs">Get daily updates about your tracked projects</p>
              </div>
              <button
                onClick={handleAddMiniApp}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-50 transition"
              >
                Add App
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
              activeTab === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
              activeTab === 'trending'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            TRENDING <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">🔥</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
              activeTab === 'saved'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            SAVED <span className="ml-1 text-xs">{watchlist.length}</span>
          </button>
        </div>

        {/* Project Cards */}
        <div className="p-4 space-y-3">
          {watchlist.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👀</div>
              <p className="text-gray-400 mb-2">No projects tracked yet</p>
              <p className="text-gray-500 text-sm">Add a project below to get started</p>
            </div>
          ) : (
            watchlist.map((proj, idx) => (
              <div
                key={idx}
                onClick={() => openProject(proj)}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-200 border border-gray-700 hover:border-purple-500"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg mb-1">{proj}</h3>
                      <p className="text-gray-400 text-sm">What's the latest buzz?</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-2xl">
                      📊
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-gray-900"></div>
                        <div className="w-6 h-6 bg-pink-500 rounded-full border-2 border-gray-900"></div>
                        <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-900"></div>
                      </div>
                      <span className="text-gray-400 text-xs">+{Math.floor(Math.random() * 500)} tracking</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      💬 <span>{Math.floor(Math.random() * 50)} updates</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Project - Sticky Bottom */}
        <div className="sticky bottom-0 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent p-4 pt-8">
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <label className="text-gray-400 text-xs uppercase tracking-wide mb-2 block">Track New Project</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="@MorphLayer"
                className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={addToWatchlist}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition"
              >
                +
              </button>
            </div>
            {errorMessage && <p className="text-red-400 mt-2 text-xs">{errorMessage}</p>}
          </div>

          {/* Settings Toggle */}
          <button
            onClick={toggleNotifications}
            className="w-full mt-3 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl flex items-center justify-between px-4 transition"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">Daily Updates</span>
              {!miniAppAdded && <span className="text-xs bg-purple-600 px-2 py-0.5 rounded-full">Enable</span>}
            </div>
            <div className={`w-11 h-6 rounded-full transition ${notificationsEnabled && miniAppAdded ? 'bg-green-500' : 'bg-gray-600'}`}>
              <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition transform ${notificationsEnabled && miniAppAdded ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </button>
        </div>

        {/* Bottom Nav */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 flex items-center justify-around py-3">
          <button className="flex flex-col items-center gap-1 text-purple-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium">Activity</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    )
  }

  // PROJECT VIEW - Enhanced card style
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 p-4">
        <button
          onClick={() => setView('list')}
          className="flex items-center text-gray-400 hover:text-white transition mb-3"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-white text-2xl font-bold">{project}</h1>
        <p className="text-gray-400 text-sm">Live updates & insights</p>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Action Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-700">
          <button
            onClick={getUpdate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Fetching...
              </div>
            ) : (
              '🔄 Get Latest Update'
            )}
          </button>
        </div>

        {/* Updates Feed */}
        {summaryLines.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-gray-400 text-xs uppercase tracking-wide px-1">Latest Buzz</h3>
            {summaryLines.map((line, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700 hover:border-purple-500 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                    {i === 0 ? '🔥' : i === 1 ? '📈' : '💡'}
                  </div>
                  <p className="text-white text-sm flex-1 leading-relaxed">{line}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={genPost}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold transition"
          >
            ✨ Generate Post
          </button>
          <DynamicBaseTxButton project={project} />
        </div>

        {/* Generated Post */}
        {postIdea && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-700">
            <h3 className="text-gray-400 text-xs uppercase tracking-wide mb-3">Your Post</h3>
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{postIdea}</p>
            <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition">
              Cast to Farcaster
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-900/20 border border-red-500 rounded-xl p-4">
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  )
}