import { NextResponse } from 'next/server'
import pool from '@/lib/supabase'

export async function POST(request: Request) {
  const client = await pool.connect()
  try {
    const body = await request.json()
    const { customer_id, ticket_category_id, quantity } = body

    if (!customer_id || !ticket_category_id || !quantity) {
      return NextResponse.json(
        { error: 'customer_id, ticket_category_id, dan quantity wajib diisi.' },
        { status: 400 }
      )
    }

    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
      return NextResponse.json(
        { error: 'Jumlah tiket harus bilangan bulat positif.' },
        { status: 400 }
      )
    }

    await client.query('BEGIN')

    const { rows: customers } = await client.query(
      'SELECT customer_id FROM CUSTOMER WHERE customer_id = $1',
      [customer_id]
    )
    if (customers.length === 0) {
      await client.query('ROLLBACK')
      return NextResponse.json({ error: 'Customer tidak ditemukan.' }, { status: 404 })
    }

    const { rows: categories } = await client.query(
      'SELECT * FROM TICKET_CATEGORY WHERE category_id = $1 FOR UPDATE',
      [ticket_category_id]
    )
    if (categories.length === 0) {
      await client.query('ROLLBACK')
      return NextResponse.json({ error: 'Kategori tiket tidak ditemukan.' }, { status: 404 })
    }

    const category = categories[0]
    const qty = Number(quantity)

    if (category.quota < qty) {
      await client.query('ROLLBACK')
      return NextResponse.json(
        { error: `Kuota tidak cukup. Tersedia: ${category.quota} tiket.` },
        { status: 409 }
      )
    }

    const total_amount = Number(category.price) * qty

    const { rows: orders } = await client.query(
      `INSERT INTO "ORDER" (order_date, payment_status, total_amount, customer_id)
       VALUES (NOW(), 'PENDING', $1, $2)
       RETURNING *`,
      [total_amount, customer_id]
    )
    const order = orders[0]

    const tickets = []
    for (let i = 0; i < qty; i++) {
      const ticket_code = `TCK-${Date.now()}-${i + 1}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
      const { rows: ticketRows } = await client.query(
        `INSERT INTO TICKET (ticket_code, category_id, order_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [ticket_code, ticket_category_id, order.order_id]
      )
      tickets.push(ticketRows[0])
    }

    await client.query(
      'UPDATE TICKET_CATEGORY SET quota = quota - $1 WHERE category_id = $2',
      [qty, ticket_category_id]
    )

    await client.query('COMMIT')

    return NextResponse.json({ order, tickets }, { status: 201 })
  } catch (error: any) {
    await client.query('ROLLBACK')
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    client.release()
  }
}
