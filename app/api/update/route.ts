import { TwitterApi } from 'twitter-api-v2'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectHandle = searchParams.get('project')?.replace('@', '') || 'MorphLayer'

  try {
    if (!process.env.TWITTER_BEARER_TOKEN) {
      throw new Error('No token—check .env.local')
    }
    const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN)


    const user = await client.v2.userByUsername(projectHandle)
    if (!user.data) {
      throw new Error(`User @${projectHandle} not found—check spelling.`)
    }


    const tweets = await client.v2.userTimeline(user.data.id, { 
      max_results: 5,
      'tweet.fields': 'public_metrics,created_at'  
    })
    
    if (!tweets.data?.data || tweets.data.data.length === 0) {
      throw new Error('No recent posts')
    }


    const summary = tweets.data.data.map(tweet => {
      const likes = tweet.public_metrics?.like_count || 0
      const views = tweet.public_metrics?.impression_count || 0
      const date = new Date(tweet.created_at || '').toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric' 
      })
      const snippet = tweet.text.length > 100 ? tweet.text.slice(0, 100) + '...' : tweet.text
      return `- ${snippet} (${likes} likes, ${views} views, ${date})`
    }).join('\n')

    return Response.json({ 
      summary: `Latest from @${projectHandle}:\n${summary}`,
      isLive: true,
      postCount: tweets.data.data.length,
      userId: user.data.id  
    })
  } catch (error: any) {
    console.error('X API Error:', error) 


    if (error.code === 429 && error.rateLimit) {
      const resetTime = error.rateLimit.reset * 1000  // Unix to ms
      const now = Date.now()
      const waitMs = resetTime - now
      const waitMins = Math.ceil(waitMs / (1000 * 60)) || 1
      const waitSecs = Math.ceil(waitMs / 1000) % 60

      return Response.json({ 
        summary: `Rate limited on @${projectHandle}—wait ${waitMins}m ${waitSecs}s then retry. Fallback mock: Teased SocialFi hooks—1K likes! AMA soon.`,
        isLive: false,
        postCount: 0,
        errorType: 'rate_limit',
        waitUntil: new Date(resetTime).toLocaleString()
      })
    }


    return Response.json({ 
      summary: `Mock for @${projectHandle}: Teased L2 hooks—16K likes! AMA tomorrow. (Error: ${error.message || 'Unknown'}—check logs.)`,
      isLive: false,
      postCount: 0
    })
  }
}