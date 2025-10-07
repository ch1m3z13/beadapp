import { TwitterApi } from 'twitter-api-v2'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const project = searchParams.get('project')?.replace('@', '') || 'MorphLayer'

  try {
    if (!process.env.TWITTER_BEARER_TOKEN) {
      throw new Error('No token')
    }
    const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN)
    const tweets = await client.v2.userTimeline(project, { max_results: 5 })
    const summary = tweets.data?.data.map(t => `${t.text.slice(0, 100)}...`).join(' | ') || 'No recent posts.'
    return Response.json({ summary: `Latest from @${project}: ${summary}` })
  } catch (error) {
    // Fallback mock for demo (or log error in prod)
    return Response.json({ summary: 'Mock: Morph teased L2 hooks—16K likes! Tokenomics AMA tomorrow.' })
  }
}