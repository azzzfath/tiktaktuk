import { NextResponse } from "next/server";
import { registerUser } from "@/lib/db";
import { RegisterPayload } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as RegisterPayload;
    validateRegisterPayload(payload);

    await registerUser(payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Registrasi gagal." },
      { status: 400 }
    );
  }
}

function validateRegisterPayload(payload: RegisterPayload) {
  if (!["administrator", "organizer", "customer"].includes(payload.role)) {
    throw new Error("Pilih role yang valid.");
  }

  if (!payload.username?.trim() || payload.password.length < 6) {
    throw new Error("Username dan password minimal 6 karakter wajib diisi.");
  }

  if (payload.role === "customer" && !payload.fullName?.trim()) {
    throw new Error("Nama lengkap pelanggan wajib diisi.");
  }

  if (payload.role === "organizer" && !payload.organizerName?.trim()) {
    throw new Error("Nama penyelenggara wajib diisi.");
  }
}
