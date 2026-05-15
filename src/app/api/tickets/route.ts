import { NextResponse } from "next/server";
import { getApiSessionUser, userHasRole } from "@/lib/api-session";
import { getSupabaseServerClient } from "@/lib/db";

interface TicketRow {
  ticket_id: string;
  ticket_code: string;
  category_id: string;
  order_id: string;
}

export async function GET() {
  const user = await getApiSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const data = await loadTicketContext(supabase);
    const customerById = new Map(data.customers.map((customer) => [customer.customer_id, customer]));
    const orderById = new Map(data.orders.map((order) => [order.order_id, order]));
    const venueById = new Map(data.venues.map((venue) => [venue.venue_id, venue]));
    const eventById = new Map(data.events.map((event) => [event.event_id, event]));
    const categoryById = new Map(data.categories.map((category) => [category.category_id, category]));
    const relationByTicket = new Map(data.relationships.map((relation) => [relation.ticket_id, relation.seat_id]));
    const seatById = new Map(data.seats.map((seat) => [seat.seat_id, seat]));
    const organizer = data.organizers.find((item) => item.user_id === user.userId);

    const rows = data.tickets.flatMap((ticket) => {
      const category = categoryById.get(ticket.category_id);
      const event = category ? eventById.get(category.event_id) : null;
      const order = orderById.get(ticket.order_id);
      const customer = order ? customerById.get(order.customer_id) : null;

      if (!category || !event || !order || !customer) return [];
      if (user.role === "customer" && customer.user_id !== user.userId) return [];
      if (user.role === "organizer" && event.organizer_id !== organizer?.organizer_id) return [];

      const seat = seatById.get(relationByTicket.get(ticket.ticket_id) ?? "");
      const venue = venueById.get(event.venue_id);

      return [{
        ticket_id: ticket.ticket_id,
        ticket_code: ticket.ticket_code,
        category_id: ticket.category_id,
        order_id: ticket.order_id,
        category_name: category.category_name,
        price: Number(category.price),
        event_title: event.event_title,
        event_datetime: event.event_datetime,
        venue_name: venue?.venue_name ?? "-",
        customer_name: customer.full_name,
        seat_id: seat?.seat_id ?? null,
        seat_label: seat ? `${seat.section} - Baris ${seat.row_number}, No. ${seat.seat_number}` : null,
        status: new Date(event.event_datetime) < new Date() ? "KADALUWARSA" : "VALID",
      }];
    });

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memuat tiket." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getApiSessionUser();

  if (!userHasRole(user, ["administrator", "organizer"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses membuat tiket." }, { status: 403 });
  }

  try {
    const { order_id, category_id, seat_id } = await request.json();

    if (!order_id || !category_id) {
      return NextResponse.json({ error: "Order dan kategori tiket wajib dipilih." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const data = await loadTicketContext(supabase);
    const category = data.categories.find((item) => item.category_id === category_id);
    const event = data.events.find((item) => item.event_id === category?.event_id);
    const organizer = data.organizers.find((item) => item.user_id === user?.userId);

    if (!category || !event) {
      return NextResponse.json({ error: "Kategori tiket tidak ditemukan." }, { status: 404 });
    }

    if (user?.role === "organizer" && event.organizer_id !== organizer?.organizer_id) {
      return NextResponse.json({ error: "Organizer hanya dapat membuat tiket untuk event miliknya." }, { status: 403 });
    }

    const code = generateTicketCode(event.event_title, category.category_name, data.tickets.filter((ticket) => ticket.category_id === category_id).length);
    const { data: ticket, error: ticketError } = await supabase
      .from("ticket")
      .insert({ ticket_code: code, category_id: category_id, order_id: order_id })
      .select("ticket_id, ticket_code, category_id, order_id")
      .single<TicketRow>();

    if (ticketError || !ticket) {
      throw new Error(ticketError?.message || "Gagal membuat tiket.");
    }

    if (seat_id) {
      const used = data.relationships.some((relation) => relation.seat_id === seat_id);

      if (used) {
        throw new Error("Kursi sudah terisi oleh tiket lain.");
      }

      const { error } = await supabase.from("has_relationship").insert({ seat_id, ticket_id: ticket.ticket_id });

      if (error) {
        throw new Error(error.message);
      }
    }

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal membuat tiket." }, { status: 500 });
  }
}

async function loadTicketContext(supabase: ReturnType<typeof getSupabaseServerClient>) {
  const [tickets, categories, events, venues, orders, customers, organizers, relationships, seats] = await Promise.all([
    supabase.from("ticket").select("ticket_id, ticket_code, category_id, order_id"),
    supabase.from("ticket_category").select("category_id, category_name, quota, price, event_id"),
    supabase.from("event").select("event_id, event_title, event_datetime, venue_id, organizer_id"),
    supabase.from("venue").select("venue_id, venue_name"),
    supabase.from("ORDER").select("order_id, customer_id, order_date"),
    supabase.from("customer").select("customer_id, full_name, user_id"),
    supabase.from("organizer").select("organizer_id, user_id"),
    supabase.from("has_relationship").select("seat_id, ticket_id"),
    supabase.from("seat").select("seat_id, section, row_number, seat_number, venue_id"),
  ]);

  const error = [tickets, categories, events, venues, orders, customers, organizers, relationships, seats].find((result) => result.error)?.error;
  if (error) throw new Error(error.message);

  return {
    tickets: tickets.data ?? [],
    categories: categories.data ?? [],
    events: events.data ?? [],
    venues: venues.data ?? [],
    orders: orders.data ?? [],
    customers: customers.data ?? [],
    organizers: organizers.data ?? [],
    relationships: relationships.data ?? [],
    seats: seats.data ?? [],
  };
}

function generateTicketCode(eventTitle: string, categoryName: string, currentCount: number) {
  const eventPrefix = eventTitle.replace(/[^a-z0-9]/gi, "").slice(0, 3).toUpperCase();
  const categoryPrefix = categoryName.replace(/[^a-z0-9]/gi, "").slice(0, 3).toUpperCase();
  return `TTK-${eventPrefix || "EVT"}-${categoryPrefix || "CAT"}-${String(currentCount + 1).padStart(3, "0")}`;
}
