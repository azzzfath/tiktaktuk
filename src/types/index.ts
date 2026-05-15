export type Role = "guest" | "customer" | "organizer" | "admin";

export type AccountRole = Exclude<Role, "guest">;

export interface AuthUser {
  id: string;
  username: string;
  role: AccountRole;
  fullName?: string | null;
  email?: string | null;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

export type PaymentStatus = "PAID" | "PENDING" | "CANCELLED";

export type DiscountType = "PERCENTAGE" | "NOMINAL";

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface TicketCategory {
  id?: string;             
  name: string;
  price: number;
  quota: number;           
  remaining?: number;   
  total?: number;        
}

export interface Seat {
  id: string;
  label: string;
  categoryId: string;
  available: boolean;
}

export interface Event {
  event_id: string;
  event_title: string;     
  event_date: string;     
  event_time?: string; 
  venue_id: string;          
  artists: string[];      
  description?: string;    
  bannerUrl?: string;
  categories: TicketCategory[];
  seats?: Seat[];         
}

export interface OrderItem {
  categoryId: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  seatLabels: string[];
}

export interface Order {
  id: string;
  customer: Customer;
  eventId: string;
  eventName: string;
  createdAt: string;
  status: PaymentStatus;
  items: OrderItem[];
  serviceFee: number;
  discount: number;
  total: number;
  promoCode?: string;
}

export interface Promotion {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
}

export interface Venue {
  venue_id: string;
  venue_name: string;
  capacity: number;
  address: string;
  city: string;
  hasReservedSeating: boolean;
}

export interface VenueFormValues {
  venue_name: string;
  capacity: number;
  address: string;
  city: string;
  hasReservedSeating: boolean;
}
