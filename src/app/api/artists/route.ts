import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET (ambil semua artist, sorted by name ascending)
export async function GET() {
  const { data, error } = await supabase
    .from('artist')
    .select('*')
    .order('name', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST (create artist baru)
export async function POST(request: Request) {
  const body = await request.json()
  const { name, genre } = body

  if (!name || name.trim() === '') {
    return NextResponse.json({ error: 'Nama artis wajib diisi.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('artist')
    .insert([{ name: name.trim(), genre: genre?.trim() || null }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}