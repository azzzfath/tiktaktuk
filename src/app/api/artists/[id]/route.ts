import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// PUT (update artist)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const { name, genre } = body

  if (!name || name.trim() === '') {
    return NextResponse.json({ error: 'Nama artis wajib diisi.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('artist')
    .update({ name: name.trim(), genre: genre?.trim() || null })
    .eq('artist_id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE (hapus artist)
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabase
    .from('artist')
    .delete()
    .eq('artist_id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: 'Artist berhasil dihapus.' })
}