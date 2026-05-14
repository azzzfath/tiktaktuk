import { NextResponse } from 'next/server'
import pool from '@/lib/supabase'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json()
    const { name, genre } = body

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Nama artis wajib diisi.' }, { status: 400 })
    }

    const { rows } = await pool.query(
      'UPDATE artist SET name = $1, genre = $2 WHERE artist_id = $3 RETURNING *',
      [name.trim(), genre?.trim() || null, id]
    )
    return NextResponse.json(rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await pool.query('DELETE FROM artist WHERE artist_id = $1', [id])
    return NextResponse.json({ message: 'Artist berhasil dihapus.' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}