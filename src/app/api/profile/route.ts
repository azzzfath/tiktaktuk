import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionUser, sessionCookieName, updatePassword, updateUserProfile } from "@/lib/db";
import { ProfilePayload } from "@/types/auth";

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser(cookies().get(sessionCookieName)?.value);
    if (!user) {
      return NextResponse.json({ message: "Session tidak valid." }, { status: 401 });
    }

    const payload = (await request.json()) as ProfilePayload;
    const updatedUser = await updateUserProfile(user, payload);

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Gagal memperbarui profil." },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser(cookies().get(sessionCookieName)?.value);
    if (!user) {
      return NextResponse.json({ message: "Session tidak valid." }, { status: 401 });
    }

    const payload = (await request.json()) as { oldPassword: string; newPassword: string };
    if (!payload.oldPassword || payload.newPassword.length < 6) {
      throw new Error("Password lama dan password baru minimal 6 karakter wajib diisi.");
    }

    await updatePassword(user.userId, payload.oldPassword, payload.newPassword);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Gagal memperbarui password." },
      { status: 400 }
    );
  }
}
