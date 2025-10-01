'use client'
import { useState } from 'react'
import BaseTxButton from '../../components/BaseTxButton'
// Removed: import { TwitterApi } from 'twitter-api-v2'  // No longer needed here

export default function WingmanFrame() {
  const [project, setProject] = useState('@MorphLayer')
  const [update, setUpdate] = useState('')
  const [postIdea, setPostIdea] = useState('')
  const [loading, setLoading] = useState(false)

  const getUpdate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/update?project=${encodeURIComponent(project)}`)
      if (!res.ok) throw new Error('Fetch failed')
      const { summary } = await res.json()
      setUpdate(summary)
    } catch (error) {
      setUpdate('Error fetching update—check console or use mock.')
      console.error(error)  // For debugging
    }
    setLoading(false)
  }

  const genPost = () => {
    setPostIdea(`"${project} scaling is ETH's edge—locked in since testnet. Who's bridging? #${project.replace('@', '')}"`)
  }

  return (
    <div className="p-4 bg-black text-white max-w-md h-[600px] flex flex-col">
      <h1 className="text-xl font-bold mb-4">Web3 Wingman 🚀</h1>
      <input
        type="text"
        value={project}
        onChange={(e) => setProject(e.target.value)}
        placeholder="Add project (e.g., @MorphLayer)"
        className="w-full p-2 mb-2 bg-gray-800 rounded"
        disabled={loading}
      />
      <button onClick={getUpdate} className="w-full p-2 mb-2 bg-blue-600 rounded" disabled={loading}>
        {loading ? 'Fetching...' : 'Get Update'}
      </button>
      {update && <p className="mb-2 text-sm">{update}</p>}
      <button onClick={genPost} className="w-full p-2 mb-2 bg-green-600 rounded">
        Gen Post Idea
      </button>
      {postIdea && <p className="mb-4 font-mono text-sm">{postIdea}</p>}
      <BaseTxButton project={project} />
      {/* Add Farcaster post logic here later if needed */}
    </div>
  )
}