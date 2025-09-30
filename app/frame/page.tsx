'use client'
import { useState } from 'react'
import BaseTxButton from '../../components/BaseTxButton'
import { TwitterApi } from 'twitter-api-v2'

export default function WingmanFrame() {
  const [project, setProject] = useState('@MorphLayer')
  const [update, setUpdate] = useState('')
  const [postIdea, setPostIdea] = useState('')
  const [loading, setLoading] = useState(false)

  const getUpdate = async () => {
    setLoading(true)
    try {
      // Real X fetch (free tier)
      const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || '')
      const tweets = await client.v2.userTimeline(project.replace('@', ''), { max_results: 5 })
      const summary = tweets.data?.data.map(t => `${t.text.slice(0, 100)}...`).join(' | ') || 'No recent posts.'
      setUpdate(`Latest from ${project}: ${summary}`)
    } catch (error) {
      setUpdate('Mock: Morph teased L2 hooks—16K likes! Tokenomics AMA tomorrow.')  // Fallback
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