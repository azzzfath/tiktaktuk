import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// PUT (update ticket category)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

  const { data, error } = await supabase
    .from('ticket_category')
    .update({ category_name, quota: Number(quota), price: Number(price) })
    .eq('category_id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE (hapus ticket category)
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabase
    .from('ticket_category')
    .delete()
    .eq('category_id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: 'Kategori tiket berhasil dihapus.' })
}