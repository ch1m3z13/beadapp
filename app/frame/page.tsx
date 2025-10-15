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
  const [project, setProject] = useState('@MorphLayer')
  const [update, setUpdate] = useState('')
  const [summaryLines, setSummaryLines] = useState<string[]>([])
  const [postIdea, setPostIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [showWalletSelect, setShowWalletSelect] = useState(false)
  const [fid, setFid] = useState<number | null>(null)
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null) 

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
        fetchWatchlist(userFid)
      } catch (error) {
        console.error('Farcaster quick auth failed:', error)
        alert('Failed to authenticate with Farcaster. Please try again.')
      }
    }

    initFarcaster()
  }, [])

  const fetchWatchlist = async (userFid: number) => {
    if (!userFid) return
    const { data, error } = await supabase.from('watchlists').select('project').eq('fid', userFid)
    if (data) setWatchlist(data.map(item => item.project))
    if (error) {
      console.error('Watchlist fetch error:', error)
      setErrorMessage('Failed to fetch watchlist. Try again.')
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

  const getUpdate = async () => {
    setLoading(true)
    setErrorMessage(null) 
    try {
      const res = await fetch(`/api/update?project=${encodeURIComponent(project)}`) 
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
    if (!update) return alert("Get an update first!")
    const analysis = sentiment.analyze(update)
    const score = analysis.score
    let tone = 'neutral'
    if (score > 0) tone = 'bullish'
    else if (score < 0) tone = 'cautious'

    const ideas = [
      `"${project}'s latest: ${tone} vibe! Key: ${summaryLines[0] || 'Update'}. Thoughts? #Web3 #${project.replace('@', '')}"`,
      `"${tone} on ${project}: ${summaryLines[1] || 'Check it out'}. As a holder, I'm ${score > 0 ? 'excited' : 'watching'}! Who's in? #Crypto"`,
      `"Quick ${tone} take on ${project}: ${summaryLines[2] || 'More to come'}. Bridge now? #${project.replace('@', '')}"`
    ]

    setPostIdea(ideas.join('\n\n'))
  }

  const handleConnect = (connector: any) => {
    connect({ connector }, { onSuccess: () => setShowWalletSelect(false) })
  }

  return (
    <div className="p-4 bg-black text-white max-w-md h-[600px] flex flex-col min-h-screen md:min-h-[600px]">
      <h1 className="text-xl font-bold mb-4 text-center">Web3 Wingman 🚀</h1>
      <input
        type="text"
        value={project}
        onChange={(e) => setProject(e.target.value)}
        placeholder="Add project (e.g., @MorphLayer)"
        className="w-full p-2 mb-2 bg-gray-800 rounded text-sm md:text-base"
        disabled={loading}
      />
      <button onClick={getUpdate} className="w-full p-2 mb-2 bg-blue-600 rounded text-sm md:text-base" disabled={loading}>
        {loading ? 'Fetching...' : 'Get Update'}
      </button>
      {loading && (
        <div className="w-full flex justify-center mb-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {errorMessage && <p className="text-red-400 mb-2 text-sm">{errorMessage}</p>} 
      {update && (
        <div className="mb-4 overflow-y-auto flex-1">
          {summaryLines.length > 0 && (
            <div className="mb-4">
              {summaryLines.map((line, i) => (
                <div key={i} className="p-2 bg-gray-800 rounded mb-1 cursor-pointer hover:bg-gray-700 text-sm md:text-base" 
                     onClick={() => {}}>
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <button onClick={genPost} className="w-full p-2 mb-2 bg-green-600 rounded text-sm md:text-base">
        Gen Post Idea
      </button>
      {postIdea && <p className="mb-4 font-mono text-sm md:text-base">{postIdea}</p>}
      <button onClick={addToWatchlist} className="w-full p-2 mb-2 bg-yellow-600 rounded text-sm md:text-base">
        Add to Watchlist
      </button>
      {watchlist.length > 0 && (
        <div className="mb-2 text-sm">
          <p>Watchlist: {watchlist.join(', ')}</p>
        </div>
      )}
      <DynamicBaseTxButton project={project} />
      {showWalletSelect && (
        <div className="mt-2">
          <select 
            onChange={(e) => handleConnect(connectors.find(c => c.name === e.target.value))}
            className="w-full p-2 bg-gray-800 rounded text-sm"
          >
            <option value="">Select Wallet</option>
            {connectors.map((connector) => (
              <option key={connector.id} value={connector.name}>
                {connector.name} {isPending && connector.id === 'pending' ? '(connecting...)' : ''}
              </option>
            ))}
          </select>
          <button onClick={() => setShowWalletSelect(false)} className="w-full p-1 text-xs text-gray-400 mt-1">
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