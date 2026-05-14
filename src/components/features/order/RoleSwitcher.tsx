"use client";

import Link from "next/link";
import { LogIn, LogOut, UserCog, UserPlus } from "lucide-react";
import { useRole } from "@/hooks/useRole";

export const RoleSwitcher = () => {
  const { role, user, logout } = useRole();

  if (!user) {
    return (
      <div className="inline-flex items-center gap-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2 text-sm text-[#F4F4F5] hover:border-[#6366F1]/60 transition-colors"
        >
          <LogIn className="h-4 w-4 text-[#6366F1]" /> Login
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#6366F1] px-3 py-2 text-sm font-medium text-white hover:bg-[#4F46E5] transition-colors"
        >
          <UserPlus className="h-4 w-4" /> Register
        </Link>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2">
      <span className="inline-flex items-center gap-2">
        <UserCog className="h-4 w-4 text-[#6366F1]" />
        <span className="text-sm text-[#F4F4F5]">{user.username}</span>
        <span className="text-xs font-medium uppercase text-zinc-500">{role}</span>
      </span>
      <button
        type="button"
        onClick={logout}
        className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-[#EF4444] transition-colors"
      >
        <LogOut className="h-3.5 w-3.5" /> Logout
      </button>
    </div>
  );
};
