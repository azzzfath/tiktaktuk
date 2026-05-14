import { NextResponse } from 'next/server'
import pool from '@/lib/supabase'

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM artist ORDER BY name ASC')
    return NextResponse.json(rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, genre } = body

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Nama artis wajib diisi.' }, { status: 400 })
    }

    const { rows } = await pool.query(
      'INSERT INTO artist (name, genre) VALUES ($1, $2) RETURNING *',
      [name.trim(), genre?.trim() || null]
    )
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}