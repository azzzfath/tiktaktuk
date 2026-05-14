import { NextResponse } from 'next/server'
import pool from '@/lib/supabase'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { category_name, quota, price } = body

    if (!category_name || !quota || price === undefined) {
      return NextResponse.json({ error: 'Semua field wajib diisi.' }, { status: 400 })
    }

    if (!Number.isInteger(Number(quota)) || Number(quota) <= 0) {
      return NextResponse.json({ error: 'Kuota harus berupa bilangan bulat positif.' }, { status: 400 })
    }

    if (Number(price) < 0) {
      return NextResponse.json({ error: 'Harga tidak boleh negatif.' }, { status: 400 })
    }

    const { rows } = await pool.query(
      'UPDATE ticket_category SET category_name = $1, quota = $2, price = $3 WHERE category_id = $4 RETURNING *',
      [category_name, Number(quota), Number(price), params.id]
    )
    return NextResponse.json(rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await pool.query('DELETE FROM ticket_category WHERE category_id = $1', [params.id])
    return NextResponse.json({ message: 'Kategori tiket berhasil dihapus.' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}