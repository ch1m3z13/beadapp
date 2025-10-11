'use client'
import { useState } from 'react'
import { useConnect, useDisconnect } from 'wagmi' // Add useConnect, useDisconnect
import BaseTxButton from '../../components/BaseTxButton'

export default function WingmanFrame() {
  const [project, setProject] = useState('@MorphLayer')
  const [update, setUpdate] = useState('')
  const [summaryLines, setSummaryLines] = useState<string[]>([])
  const [postIdea, setPostIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [showWalletSelect, setShowWalletSelect] = useState(false) // New: Toggle selector

  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const getUpdate = async () => {
    setLoading(true)
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
    }
    setLoading(false)
  }

  const genPost = () => {
    setPostIdea(`"${project} scaling is ETH's edge—locked in since testnet. Who's bridging? #${project.replace('@', '')}"`)
  }

  const handleConnect = (connector: any) => {
    connect({ connector }, {
      onSuccess: () => setShowWalletSelect(false), 
    })
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
      <button 
        onClick={() => handleConnect(connectors.find(c => c.id.includes('walletConnect')))} 
        className="w-full p-2 mb-2 bg-indigo-600 rounded text-sm md:text-base"
      >
        Connect with WalletConnect (QR)
      </button>
      <BaseTxButton project={project} />
      {}
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
      {}
      <button 
        onClick={() => setShowWalletSelect(!showWalletSelect)} 
        className="w-full p-1 text-xs text-gray-400 mt-2"
      >
        {showWalletSelect ? 'Hide' : 'Change Wallet'}
      </button>
    </div>
  )
}