export type UserRole = "administrator" | "organizer" | "customer";

export interface SessionUser {
  userId: string;
  username: string;
  role: UserRole;
  displayName: string;
  phoneNumber?: string | null;
  contactEmail?: string | null;
}

export interface RegisterPayload {
  role: UserRole;
  username: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  organizerName?: string;
  contactEmail?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface ProfilePayload {
  fullName?: string;
  phoneNumber?: string;
  organizerName?: string;
  contactEmail?: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  helper: string;
  tone: "primary" | "success" | "accent" | "warning";
}

export interface DashboardData {
  eyebrow: string;
  title: string;
  subtitle: string;
  actions: string[];
  metrics: DashboardMetric[];
  panels: {
    title: string;
    rows: { label: string; value: string }[];
  }[];
}
