import { NextResponse } from 'next/server'
import pool from '@/lib/supabase'

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT 
        tc.*,
        e.event_title
      FROM ticket_category tc
      JOIN event e ON tc.tevent_id = e.event_id
      ORDER BY e.event_title ASC, tc.category_name ASC
    `)
    return NextResponse.json(rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { category_name, quota, price, tevent_id } = body

    if (!category_name || !quota || price === undefined || !tevent_id) {
      return NextResponse.json({ error: 'Semua field wajib diisi.' }, { status: 400 })
    }

    if (!Number.isInteger(Number(quota)) || Number(quota) <= 0) {
      return NextResponse.json({ error: 'Kuota harus berupa bilangan bulat positif.' }, { status: 400 })
    }

    if (Number(price) < 0) {
      return NextResponse.json({ error: 'Harga tidak boleh negatif.' }, { status: 400 })
    }

    const { rows } = await pool.query(
      'INSERT INTO ticket_category (category_name, quota, price, tevent_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [category_name, Number(quota), Number(price), tevent_id]
    )
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}