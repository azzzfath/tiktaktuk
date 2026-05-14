import type {
  AccountRole,
  AuthSession,
  Event,
  Order,
  PaymentStatus,
  Promotion,
  Venue,
} from "@/types";
import type { PromotionFormValues } from "@/components/features/promotion/PromotionForm";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";
const AUTH_STORAGE_KEY = "tiktaktuk:auth";
let cachedAuthRaw: string | null = null;
let cachedAuthSession: AuthSession | null = null;

interface ApiOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
  skipAuth?: boolean;
}

interface DataResponse<T> {
  data: T;
}

export interface RegisterPayload {
  username: string;
  password: string;
  role: AccountRole;
  fullName?: string;
  email?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface CreateOrderPayload {
  eventId: string;
  categoryId: string;
  quantity: number;
  seatIds: string[];
  promoCode?: string;
}

export interface VenueFormValues {
  venue_name: string;
  capacity: number;
  address: string;
  city: string;
  hasReservedSeating: boolean;
}

export function readStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  if (raw === cachedAuthRaw) return cachedAuthSession;

  try {
    cachedAuthRaw = raw;
    cachedAuthSession = JSON.parse(raw) as AuthSession;
    return cachedAuthSession;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    cachedAuthRaw = null;
    cachedAuthSession = null;
    return null;
  }
}

export function writeStoredSession(session: AuthSession | null) {
  if (typeof window === "undefined") return;

  if (session) {
    const raw = JSON.stringify(session);
    cachedAuthRaw = raw;
    cachedAuthSession = session;
    window.localStorage.setItem(AUTH_STORAGE_KEY, raw);
  } else {
    cachedAuthRaw = null;
    cachedAuthSession = null;
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  window.dispatchEvent(new window.Event("tiktaktuk:auth-change"));
}

export function getStoredToken() {
  return readStoredSession()?.token ?? null;
}

async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const token = options.token ?? getStoredToken();
  const headers = new Headers();

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !options.skipAuth) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const payload = await response.json().catch(() => null) as { error?: string } | null;
  if (!response.ok) {
    throw new Error(payload?.error ?? "Request gagal");
  }

  return payload as T;
}

export async function register(payload: RegisterPayload) {
  return apiRequest<AuthSession>("/register", { method: "POST", body: payload, skipAuth: true });
}

export async function login(payload: LoginPayload) {
  return apiRequest<AuthSession>("/login", { method: "POST", body: payload, skipAuth: true });
}

export async function getMe() {
  return apiRequest<{ user: AuthSession["user"] }>("/me");
}

export async function listEvents() {
  const response = await apiRequest<DataResponse<Event[]>>("/events");
  return response.data;
}

export async function getEvent(id: string) {
  const response = await apiRequest<DataResponse<Event>>(`/events/${id}`);
  return response.data;
}

export async function listOrders() {
  const response = await apiRequest<DataResponse<Order[]>>("/orders");
  return response.data;
}

export async function createOrder(payload: CreateOrderPayload) {
  const response = await apiRequest<DataResponse<Order>>("/orders", {
    method: "POST",
    body: payload,
  });
  return response.data;
}

export async function updateOrderStatus(id: string, status: PaymentStatus) {
  const response = await apiRequest<DataResponse<Order>>(`/orders/${id}`, {
    method: "PUT",
    body: { status },
  });
  return response.data;
}

export async function deleteOrder(id: string) {
  const response = await apiRequest<DataResponse<Order>>(`/orders/${id}`, {
    method: "DELETE",
  });
  return response.data;
}

export async function listPromotions() {
  const response = await apiRequest<DataResponse<Promotion[]>>("/promotions");
  return response.data;
}

export async function validatePromotionCode(code: string) {
  const response = await apiRequest<DataResponse<Promotion>>(`/promotions/validate/${code}`, {
    skipAuth: true,
  });
  return response.data;
}

export async function createPromotion(payload: PromotionFormValues) {
  const response = await apiRequest<DataResponse<Promotion>>("/promotions", {
    method: "POST",
    body: payload,
  });
  return response.data;
}

export async function updatePromotion(id: string, payload: PromotionFormValues) {
  const response = await apiRequest<DataResponse<Promotion>>(`/promotions/${id}`, {
    method: "PUT",
    body: payload,
  });
  return response.data;
}

export async function deletePromotion(id: string) {
  const response = await apiRequest<DataResponse<Promotion>>(`/promotions/${id}`, {
    method: "DELETE",
  });
  return response.data;
}

export async function listVenues() {
  const response = await apiRequest<DataResponse<Venue[]>>("/venues");
  return response.data;
}

export async function createVenue(payload: VenueFormValues) {
  const response = await apiRequest<DataResponse<Venue>>("/venues", {
    method: "POST",
    body: payload,
  });
  return response.data;
}

export async function updateVenue(id: string, payload: VenueFormValues) {
  const response = await apiRequest<DataResponse<Venue>>(`/venues/${id}`, {
    method: "PUT",
    body: payload,
  });
  return response.data;
}

export async function deleteVenue(id: string) {
  const response = await apiRequest<DataResponse<Venue>>(`/venues/${id}`, {
    method: "DELETE",
  });
  return response.data;
}
