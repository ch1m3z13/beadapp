import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET() {
  const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY
  if (!NEYNAR_API_KEY) {
    return NextResponse.json({ error: 'Neynar API key not configured' }, { status: 500 })
  }

  
  const { data: users, error } = await supabase
    .from('users')
    .select('fid')
    .eq('notifications_enabled', true)
  
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  for (const { fid } of users || []) {
    const { data: projects } = await supabase.from('watchlists').select('project').eq('fid', fid)
    if (!projects || projects.length === 0) continue

    let dailySummary = 'Daily Watchlist Update:\n'
    for (const { project } of projects) {
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/update?project=${encodeURIComponent(project)}`)
      if (!res.ok) continue
      const { summary } = await res.json()
      dailySummary += `${project}: ${summary.slice(0, 100)}...\n`
    }

    if (dailySummary === 'Daily Watchlist Update:\n') continue 


    const response = await fetch('https://api.neynar.com/v2/farcaster/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': NEYNAR_API_KEY,
      },
      body: JSON.stringify({
        notification: {
          type: 'frame',
          frame_url: 'https://bead-mvp.vercel.app/frame',
          body: dailySummary,
          deep_link: 'farcaster://miniapp/bead-mvp',
        },
        recipient_fid: fid,
      }),
    })

    if (!response.ok) {
      console.error(`Failed to send notification to FID ${fid}: ${response.statusText}`)
    }
  }

  return NextResponse.json({ status: 'Notifications sent' })
}