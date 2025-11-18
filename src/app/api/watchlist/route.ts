import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY! 

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  const { fid, project } = await request.json()

  const { data, error } = await supabase
    .from('watchlists')
    .insert({ fid, project })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const fid = searchParams.get('fid')

  if (!fid) {
    return NextResponse.json({ error: 'FID required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('watchlists')
    .select('project')
    .eq('fid', parseInt(fid))

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data: data.map(item => item.project) })
}