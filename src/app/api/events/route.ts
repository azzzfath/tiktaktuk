import { NextResponse } from 'next/server'
import pool from '@/lib/supabase'

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT event_id, event_title FROM event ORDER BY event_title ASC')
    return NextResponse.json(rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}