import { TwitterApi } from 'twitter-api-v2'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectHandle = searchParams.get('project')?.replace('@', '') || 'MorphLayer'

  try {
    if (!process.env.TWITTER_BEARER_TOKEN) {
      throw new Error('No token—check .env.local')
    }
    const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN)

    // Step 1: Get user ID
    const user = await client.v2.userByUsername(projectHandle)
    if (!user.data) {
      throw new Error(`User @${projectHandle} not found—check spelling.`)
    }

    // Step 2: Fetch timeline
    const tweets = await client.v2.userTimeline(user.data.id, { 
      max_results: 5,
      'tweet.fields': 'public_metrics,created_at' 
    })
    
    if (!tweets.data?.data || tweets.data.data.length === 0) {
      throw new Error('No recent posts')
    }

    // AI Summarization: Parse & theme
    const themes = {
      announcement: ['launch', 'drop', 'AMA', 'update', 'tease', 'reveal'],
      milestone: ['hit', 'trending', 'top', 'win', 'milestone', 'congrats'],
      buzz: ['bullish', 'hype', 'fire', 'radar', 'next', 'unlock']
    }
    const sentimentWords = {
      positive: ['bullish', 'fire', 'win', 'hype', 'unlock', '🚀', '💚'],
      neutral: ['update', 'trending', 'analysis', 'share'],
      negative: ['fud', 'bear', 'down', 'failed']  // Rare, but cover
    }

    const summarized = tweets.data.data
      .sort((a, b) => (b.public_metrics?.like_count || 0) - (a.public_metrics?.like_count || 0))  // Prioritize engagement
      .slice(0, 5)
      .map(tweet => {
        const text = tweet.text.toLowerCase()
        const likes = tweet.public_metrics?.like_count || 0
        const views = tweet.public_metrics?.impression_count || 0
        const date = new Date(tweet.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        const snippet = tweet.text.length > 80 ? tweet.text.slice(0, 80) + '...' : tweet.text

        // Detect theme
        let theme = 'General'
        for (const [key, words] of Object.entries(themes)) {
          if (words.some(word => text.includes(word))) {
            theme = key.charAt(0).toUpperCase() + key.slice(1)
            break
          }
        }

        // Quick sentiment score (-1 neg, 0 neu, 1 pos)
        let sentiment = 0
        for (const [type, words] of Object.entries(sentimentWords)) {
          if (words.some(word => text.includes(word))) {
            sentiment = type === 'positive' ? 1 : type === 'negative' ? -1 : 0
            break
          }
        }
        const emoji = sentiment > 0 ? '🚀' : sentiment < 0 ? '⚠️' : '📊'

        return {
          theme,
          sentiment: emoji,
          text: `${emoji} [${theme}] ${snippet} (${likes} likes, ${views} views, ${date})`
        }
      })

    // Group & output: 3-5 bullets, themed
    const grouped = summarized.reduce((acc, item) => {
      acc[item.theme] = acc[item.theme] || []
      acc[item.theme].push(item.text)
      return acc
    }, {} as Record<string, string[]>)

    const summaryLines = Object.entries(grouped)
      .flatMap(([theme, items]) => items.slice(0, 2).map(item => `${theme}: ${item}`))  // Top 2 per theme
      .slice(0, 5)  // Cap at 5 total

    return Response.json({ 
      summary: `Insights from @${projectHandle}:\n${summaryLines.join('\n')}`,
      isLive: true,
      postCount: tweets.data.data.length,
      userId: user.data.id,
      themesDetected: Object.keys(grouped).length
    })
  } catch (error: any) {
    console.error('X API Error:', error)

    if (error.code === 429 && error.rateLimit) {
      const resetTime = error.rateLimit.reset * 1000
      const now = Date.now()
      const waitMs = resetTime - now
      const waitMins = Math.ceil(waitMs / (1000 * 60)) || 1
      const waitSecs = Math.ceil(waitMs / 1000) % 60

      return Response.json({ 
        summary: `Rate limited on @${projectHandle}—wait ${waitMins}m ${waitSecs}s. Fallback AI Mock: 🚀 [Announcement] Teased L2 hooks... (16K likes, Oct 7)`,
        isLive: false,
        postCount: 0,
        errorType: 'rate_limit',
        waitUntil: new Date(resetTime).toLocaleString()
      })
    }

    return Response.json({ 
      summary: `AI Mock for @${projectHandle}: 📊 [Milestone] Hit 1M users... (Fallback: ${error.message || 'Unknown'})`,
      isLive: false,
      postCount: 0
    })
  }
}