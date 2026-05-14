import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET (ambil semua ticket category, sorted by event name lalu category name)
export async function GET() {
  const { data, error } = await supabase
    .from('ticket_category')
    .select(`
      *,
      event:tevent_id (
        event_id,
        event_title
      )
    `)
    .order('tevent_id', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST (create ticket category baru)
export async function POST(request: Request) {
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

  const { data, error } = await supabase
    .from('ticket_category')
    .insert([{ category_name, quota: Number(quota), price: Number(price), tevent_id }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}