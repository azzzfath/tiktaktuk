import { createClient } from "@supabase/supabase-js";
import { DashboardData, ProfilePayload, RegisterPayload, SessionUser, UserRole } from "@/types/auth";
import { hashPassword, verifyPassword } from "@/lib/password";

const SESSION_DAYS = 7;

interface UserAccountRow {
  user_id: string;
  username: string;
  password: string;
}

interface RoleRow {
  role_id: string;
  role_name: UserRole;
}

interface CustomerRow {
  full_name: string;
  phone_number: string | null;
}

interface OrganizerRow {
  organizer_name: string;
  contact_email: string | null;
}

export const sessionCookieName = "tiktaktuk_session";

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function registerUser(payload: RegisterPayload) {
  const supabase = getSupabaseServerClient();
  const username = normalizeUsername(payload.username);
  const passwordHash = hashPassword(payload.password);

  validateUsername(username);

  const { data: existing } = await supabase
    .from("user_account")
    .select("user_id")
    .ilike("username", username)
    .maybeSingle();

  if (existing) {
    throw new Error(`Username "${username}" sudah terdaftar, gunakan username lain.`);
  }

  const { data: role, error: roleError } = await supabase
    .from("role")
    .select("role_id, role_name")
    .eq("role_name", payload.role)
    .single<RoleRow>();

  if (roleError || !role) {
    throw new Error("Role belum tersedia di database.");
  }

  const { data: user, error: userError } = await supabase
    .from("user_account")
    .insert({ username, password: passwordHash })
    .select("user_id, username, password")
    .single<UserAccountRow>();

  if (userError || !user) {
    throw new Error("Gagal membuat akun pengguna.");
  }

  const { error: accountRoleError } = await supabase
    .from("account_role")
    .insert({ user_id: user.user_id, role_id: role.role_id });

  if (accountRoleError) {
    throw new Error("Gagal menyimpan role pengguna.");
  }

  if (payload.role === "customer") {
    const { error } = await supabase.from("customer").insert({
      user_id: user.user_id,
      full_name: payload.fullName?.trim(),
      phone_number: payload.phoneNumber?.trim() || null,
    });

    if (error) {
      throw new Error("Gagal membuat profil pelanggan.");
    }
  }

  if (payload.role === "organizer") {
    const { error } = await supabase.from("organizer").insert({
      user_id: user.user_id,
      organizer_name: payload.organizerName?.trim(),
      contact_email: payload.contactEmail?.trim() || null,
    });

    if (error) {
      throw new Error("Gagal membuat profil penyelenggara.");
    }
  }

  return buildSessionUser(user.user_id, user.username, payload.role);
}

export async function authenticateUser(username: string, password: string) {
  const supabase = getSupabaseServerClient();
  const normalizedUsername = username.trim();

  const { data: user, error } = await supabase
    .from("user_account")
    .select("user_id, username, password")
    .ilike("username", normalizedUsername)
    .single<UserAccountRow>();

  if (error || !user || !verifyPassword(password, user.password)) {
    throw new Error("Username atau password salah.");
  }

  const role = await getUserRole(user.user_id);
  if (!role) {
    throw new Error("Akun belum memiliki role.");
  }

  return buildSessionUser(user.user_id, user.username, role);
}

export async function createSession(userId: string) {
  const supabase = getSupabaseServerClient();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("app_session")
    .insert({ user_id: userId, expires_at: expiresAt })
    .select("session_id")
    .single<{ session_id: string }>();

  if (error || !data) {
    throw new Error("Gagal membuat session.");
  }

  return { sessionId: data.session_id, expiresAt: new Date(expiresAt) };
}

export async function deleteSession(sessionId: string) {
  const supabase = getSupabaseServerClient();
  await supabase.from("app_session").delete().eq("session_id", sessionId);
}

export async function getSessionUser(sessionId?: string | null) {
  if (!sessionId) {
    return null;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("app_session")
    .select("user_id, expires_at")
    .eq("session_id", sessionId)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle<{ user_id: string; expires_at: string }>();

  if (error || !data) {
    return null;
  }

  return getUserById(data.user_id);
}

export async function updateUserProfile(user: SessionUser, payload: ProfilePayload) {
  const supabase = getSupabaseServerClient();

  if (user.role === "customer") {
    const { error } = await supabase
      .from("customer")
      .update({
        full_name: payload.fullName?.trim(),
        phone_number: payload.phoneNumber?.trim() || null,
      })
      .eq("user_id", user.userId);

    if (error) {
      throw new Error("Gagal memperbarui profil pelanggan.");
    }
  }

  if (user.role === "organizer") {
    const { error } = await supabase
      .from("organizer")
      .update({
        organizer_name: payload.organizerName?.trim(),
        contact_email: payload.contactEmail?.trim() || null,
      })
      .eq("user_id", user.userId);

    if (error) {
      throw new Error("Gagal memperbarui profil penyelenggara.");
    }
  }

  if (user.role === "administrator") {
    const { error } = await supabase
      .from("administrator")
      .update({
        full_name: payload.fullName?.trim() || payload.organizerName?.trim(),
        phone_number: payload.phoneNumber?.trim() || payload.contactEmail?.trim() || null,
      })
      .eq("user_id", user.userId);

    if (error) {
      throw new Error("Gagal memperbarui profil administrator.");
    }
  }

  return getUserById(user.userId);
}

export async function updatePassword(userId: string, oldPassword: string, newPassword: string) {
  const supabase = getSupabaseServerClient();
  const { data: user, error } = await supabase
    .from("user_account")
    .select("user_id, password")
    .eq("user_id", userId)
    .single<{ user_id: string; password: string }>();

  if (error || !user || !verifyPassword(oldPassword, user.password)) {
    throw new Error("Password lama tidak sesuai.");
  }

  const { error: updateError } = await supabase
    .from("user_account")
    .update({ password: hashPassword(newPassword) })
    .eq("user_id", userId);

  if (updateError) {
    throw new Error("Gagal memperbarui password.");
  }
}

export async function getDashboardData(user: SessionUser): Promise<DashboardData> {
  const supabase = getSupabaseServerClient();
  const [
    { count: users },
    { count: events },
    { count: venues },
    { count: orders },
    { count: tickets },
    { count: seats },
    { data: validTickets },
    { count: occupiedSeats },
  ] = await Promise.all([
    supabase.from("user_account").select("user_id", { count: "exact", head: true }),
    supabase.from("event").select("event_id", { count: "exact", head: true }),
    supabase.from("venue").select("venue_id", { count: "exact", head: true }),
    supabase.from("ORDER").select("order_id", { count: "exact", head: true }),
    supabase.from("ticket").select("ticket_id", { count: "exact", head: true }),
    supabase.from("seat").select("seat_id", { count: "exact", head: true }),
    supabase.from("ticket").select("ticket_id, ticket_category(event(event_datetime))"),
    supabase.from("has_relationship").select("seat_id", { count: "exact", head: true }),
  ]);

  const totalTickets = tickets ?? 0;
  const totalSeats = seats ?? 0;
  
  // Calculate valid tickets
  let totalValid = 0;
  if (validTickets && Array.isArray(validTickets)) {
    const now = new Date();
    totalValid = validTickets.filter((t: any) => {
      const evtDate = t.ticket_category?.event?.event_datetime;
      return evtDate ? new Date(evtDate) >= now : false;
    }).length;
  }

  const totalOccupied = occupiedSeats ?? 0;
  const expiredTickets = totalTickets - totalValid;
  const availableSeats = totalSeats - totalOccupied;

  if (user.role === "administrator") {
    return {
      eyebrow: "Administrator",
      title: "System Console",
      subtitle: "Pantau dan kelola platform TikTakTuk",
      actions: ["Promosi"],
      metrics: [
        { label: "Total Pengguna", value: String(users ?? 0), helper: "Pengguna aktif", tone: "primary" },
        { label: "Total Acara", value: String(events ?? 0), helper: "Event terdaftar", tone: "success" },
        { label: "Aset Platform", value: `${venues ?? 0}`, helper: "Venue tersedia", tone: "accent" },
        { label: "Promosi Aktif", value: "3", helper: "Kampanye berjalan", tone: "warning" },
      ],
      panels: [
        {
          title: "Infrastruktur Venue",
          rows: [
            { label: "Total Venue Terdaftar", value: `${venues ?? 0} lokasi` },
            { label: "Reserved Seating", value: "2 venue" },
            { label: "Kapasitas Terbesar", value: "10.000 kursi" },
          ],
        },
        {
          title: "Marketing & Promosi",
          rows: [
            { label: "Promo Persentase", value: "1 aktif" },
            { label: "Promo Potongan Nominal", value: "1 aktif" },
            { label: "Total Penggunaan", value: "57 kali" },
          ],
        },
        {
          title: "Manajemen Tiket",
          rows: [
            { label: "Total Tiket Terbit", value: `${totalTickets} tiket` },
            { label: "Tiket Valid", value: `${totalValid} tiket` },
            { label: "Tiket Kadaluwarsa", value: `${expiredTickets} tiket` },
          ],
        },
        {
          title: "Manajemen Kursi",
          rows: [
            { label: "Total Kursi Terdaftar", value: `${totalSeats} kursi` },
            { label: "Kursi Terisi", value: `${totalOccupied} kursi` },
            { label: "Kursi Tersedia", value: `${availableSeats} kursi` },
          ],
        },
      ],
    };
  }

  if (user.role === "organizer") {
    return {
      eyebrow: "Dashboard Penyelenggara",
      title: user.displayName,
      subtitle: "Kelola aset event Anda",
      actions: ["Kelola Acara", "Venue"],
      metrics: [
        { label: "Acara Aktif", value: "3", helper: "Dalam koordinasi", tone: "primary" },
        { label: "Tiket Terjual", value: `${totalValid}`, helper: "Total valid", tone: "success" },
        { label: "Revenue", value: "Rp 4.8M", helper: "Bulan ini", tone: "accent" },
        { label: "Venue Mitra", value: String(venues ?? 0), helper: "Lokasi aktif", tone: "warning" },
      ],
      panels: [
        {
          title: "Performa Acara",
          rows: [
            { label: "Konser Melodi Senja", value: "Live" },
            { label: "Festival Seni Budaya", value: "Live" },
            { label: "Malam Akustik Bandung", value: "Live" },
          ],
        },
        {
          title: "Tiket & Kursi",
          rows: [
            { label: "Tiket Terbit", value: `${totalTickets} tiket` },
            { label: "Tiket Valid", value: `${totalValid} tiket` },
            { label: "Total Kursi", value: `${totalSeats} kursi` },
            { label: "Kursi Terisi", value: `${totalOccupied} kursi` },
          ],
        },
      ],
    };
  }

  return {
    eyebrow: "Selamat datang kembali",
    title: user.displayName,
    subtitle: "Acara menarik menunggu Anda",
    actions: ["Cari Tiket"],
    metrics: [
      { label: "Tiket Aktif", value: `${totalValid}`, helper: "Siap digunakan", tone: "primary" },
      { label: "Acara Diikuti", value: "12", helper: "Total pengalaman", tone: "success" },
      { label: "Kode Promo", value: "3", helper: "Tersedia untuk Anda", tone: "accent" },
      { label: "Total Belanja", value: "Rp 1.6M", helper: "Bulan ini", tone: "warning" },
    ],
    panels: [
      {
        title: "Tiket Mendatang",
        rows: [
          { label: "Konser Melodi Senja", value: "VIP" },
          { label: "Festival Seni Budaya", value: "Regular" },
        ],
      },
      {
        title: "Info Kursi Saya",
        rows: [
          { label: "Tiket dengan Kursi", value: `${totalOccupied} tiket` },
          { label: "Tiket Tanpa Kursi", value: `${totalValid - totalOccupied} tiket` },
        ],
      },
    ],
  };
}

async function getUserById(userId: string) {
  const supabase = getSupabaseServerClient();
  const { data: account } = await supabase
    .from("user_account")
    .select("user_id, username, password")
    .eq("user_id", userId)
    .single<UserAccountRow>();

  if (!account) {
    return null;
  }

  const role = await getUserRole(userId);
  if (!role) {
    return null;
  }

  return buildSessionUser(account.user_id, account.username, role);
}

async function getUserRole(userId: string) {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("account_role")
    .select("role(role_name)")
    .eq("user_id", userId)
    .returns<{ role: RoleRow }[]>();

  const roles = data?.map((item) => item.role.role_name) ?? [];

  if (roles.includes("administrator")) {
    return "administrator";
  }

  if (roles.includes("organizer")) {
    return "organizer";
  }

  return roles.includes("customer") ? "customer" : null;
}

async function buildSessionUser(userId: string, username: string, role: UserRole) {
  const supabase = getSupabaseServerClient();

  if (role === "customer") {
    const { data } = await supabase
      .from("customer")
      .select("full_name, phone_number")
      .eq("user_id", userId)
      .maybeSingle<CustomerRow>();

    return {
      userId,
      username,
      role,
      displayName: data?.full_name ?? username,
      phoneNumber: data?.phone_number ?? null,
    };
  }

  if (role === "organizer") {
    const { data } = await supabase
      .from("organizer")
      .select("organizer_name, contact_email")
      .eq("user_id", userId)
      .maybeSingle<OrganizerRow>();

    return {
      userId,
      username,
      role,
      displayName: data?.organizer_name ?? username,
      contactEmail: data?.contact_email ?? null,
    };
  }

  const { data } = await supabase
    .from("administrator")
    .select("full_name, phone_number")
    .eq("user_id", userId)
    .maybeSingle<{ full_name: string; phone_number: string }>();

  return {
    userId,
    username,
    role,
    displayName: data?.full_name ?? "Administrator",
    phoneNumber: data?.phone_number ?? null,
  };
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function validateUsername(username: string) {
  if (!/^[a-z0-9]+$/.test(username)) {
    throw new Error(
      `Username "${username}" hanya boleh mengandung huruf dan angka tanpa simbol atau spasi.`
    );
  }
}
