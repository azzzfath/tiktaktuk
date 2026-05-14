import { NextResponse } from "next/server";
import { authenticateUser, createSession, sessionCookieName } from "@/lib/db";
import { LoginPayload } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LoginPayload;

    if (!payload.username?.trim() || !payload.password?.trim()) {
      throw new Error("Username dan password wajib diisi.");
    }

    const user = await authenticateUser(payload.username, payload.password);
    const session = await createSession(user.userId);
    const response = NextResponse.json({ user });

    response.cookies.set(sessionCookieName, session.sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: session.expiresAt,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Login gagal." },
      { status: 401 }
    );
  }
}
