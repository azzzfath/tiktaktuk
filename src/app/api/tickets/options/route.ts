import { NextResponse } from "next/server";
import { getApiSessionUser } from "@/lib/api-session";
import { getSupabaseServerClient } from "@/lib/db";

export async function GET() {
  const user = await getApiSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const [orders, customers, tickets, categories, events, seats, relationships] = await Promise.all([
      supabase.from("ORDER").select("order_id, customer_id, order_date"),
      supabase.from("customer").select("customer_id, full_name"),
      supabase.from("ticket").select("ticket_id, category_id, order_id"),
      supabase.from("ticket_category").select("category_id, category_name, price, quota, event_id"),
      supabase.from("event").select("event_id, event_title, venue_id"),
      supabase.from("seat").select("seat_id, venue_id, section, row_number, seat_number"),
      supabase.from("has_relationship").select("seat_id"),
    ]);

    const error = [orders, customers, tickets, categories, events, seats, relationships].find((result) => result.error)?.error;
    if (error) throw new Error(error.message);

    const customerById = new Map((customers.data ?? []).map((customer) => [customer.customer_id, customer]));
    const eventById = new Map((events.data ?? []).map((event) => [event.event_id, event]));
    const categoryById = new Map((categories.data ?? []).map((category) => [category.category_id, category]));
    const firstTicketByOrder = new Map((tickets.data ?? []).map((ticket) => [ticket.order_id, ticket]));
    const usedSeats = new Set((relationships.data ?? []).map((relationship) => relationship.seat_id));

    return NextResponse.json({
      orders: (orders.data ?? []).map((order) => {
        const firstTicket = firstTicketByOrder.get(order.order_id);
        const category = firstTicket ? categoryById.get(firstTicket.category_id) : null;
        const event = category ? eventById.get(category.event_id) : null;

        return {
          order_id: order.order_id,
          customer_name: customerById.get(order.customer_id)?.full_name ?? "-",
          event_id: event?.event_id ?? null,
          event_title: event?.event_title ?? null,
        };
      }),
      categories: (categories.data ?? []).map((category) => {
        const event = eventById.get(category.event_id);

        return {
          category_id: category.category_id,
          category_name: category.category_name,
          price: Number(category.price),
          quota: category.quota,
          sold_count: (tickets.data ?? []).filter((ticket) => ticket.category_id === category.category_id).length,
          event_id: category.event_id,
          event_title: event?.event_title ?? "-",
          venue_id: event?.venue_id ?? "",
        };
      }),
      seats: (seats.data ?? [])
        .filter((seat) => !usedSeats.has(seat.seat_id))
        .map((seat) => ({
          seat_id: seat.seat_id,
          venue_id: seat.venue_id,
          label: `${seat.section} - Baris ${seat.row_number}, No. ${seat.seat_number}`,
        })),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memuat opsi tiket." }, { status: 500 });
  }
}
