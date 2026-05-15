import { NextResponse } from 'next/server'
import pool from '@/lib/supabase'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { rows: orders } = await pool.query(
      `SELECT
         o.*,
         c.full_name,
         c.phone_number
       FROM "ORDER" o
       JOIN CUSTOMER c ON o.customer_id = c.customer_id
       WHERE o.order_id = $1`,
      [id]
    )

    if (orders.length === 0) {
      return NextResponse.json({ error: 'Order tidak ditemukan.' }, { status: 404 })
    }

    const { rows: tickets } = await pool.query(
      `SELECT
         t.ticket_id,
         t.ticket_code,
         tc.category_name,
         tc.price,
         e.event_title,
         e.event_datetime
       FROM TICKET t
       JOIN TICKET_CATEGORY tc ON t.category_id = tc.category_id
       JOIN EVENT e ON tc.event_id = e.event_id
       WHERE t.order_id = $1`,
      [id]
    )

    return NextResponse.json({ order: orders[0], tickets })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
