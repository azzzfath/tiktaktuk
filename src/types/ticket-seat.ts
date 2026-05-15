import { UserRole } from "@/types/auth";

export interface TicketRecord {
  ticket_id: string;
  ticket_code: string;
  category_id: string;
  order_id: string;
  category_name: string;
  price: number;
  event_title: string;
  event_datetime: string;
  venue_name: string;
  customer_name: string;
  seat_id: string | null;
  seat_label: string | null;
  status: "VALID" | "KADALUWARSA";
}

export interface SeatRecord {
  seat_id: string;
  section: string;
  row_number: string;
  seat_number: string;
  venue_id: string;
  venue_name: string;
  is_occupied: boolean;
}

export interface TicketCategoryOption {
  category_id: string;
  category_name: string;
  price: number;
  quota: number;
  sold_count: number;
  event_id: string;
  event_title: string;
  venue_id: string;
}

export interface TicketOrderOption {
  order_id: string;
  customer_name: string;
  event_id: string | null;
  event_title: string | null;
}

export interface TicketSeatOption {
  seat_id: string;
  venue_id: string;
  label: string;
}

export interface TicketOptions {
  orders: TicketOrderOption[];
  categories: TicketCategoryOption[];
  seats: TicketSeatOption[];
}

export interface VenueOption {
  venue_id: string;
  venue_name: string;
}

export interface ManagementPermissions {
  role: UserRole;
  canCreateTicket: boolean;
  canManageTicket: boolean;
  canManageSeat: boolean;
}
