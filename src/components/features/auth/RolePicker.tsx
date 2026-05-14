"use client";

import Link from "next/link";
import { ShieldCheck, Ticket, Users } from "lucide-react";
import { UserRole } from "@/types/auth";

interface RoleOption {
  role: UserRole;
  title: string;
  description: string;
  icon: typeof Ticket;
}

const roleOptions: RoleOption[] = [
  {
    role: "customer",
    title: "Pelanggan",
    description: "Beli dan kelola tiket untuk acara favorit Anda",
    icon: Ticket,
  },
  {
    role: "organizer",
    title: "Penyelenggara",
    description: "Buat dan kelola acara serta venue Anda",
    icon: Users,
  },
  {
    role: "administrator",
    title: "Administrator",
    description: "Kelola sistem dan pantau aktivitas platform",
    icon: ShieldCheck,
  },
];

export function RolePicker() {
  return (
    <div className="flex flex-col gap-3">
      {roleOptions.map(({ role, title, description, icon: Icon }) => (
        <Link
          key={role}
          href={`/register?role=${role}`}
          className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#0F0F0F] p-4 text-left transition-colors hover:border-[#6366F1]/60 hover:bg-[#6366F1]/10"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366F1]/20 text-[#6366F1]">
            <Icon className="h-5 w-5" />
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-base font-semibold">{title}</span>
            <span className="text-sm text-zinc-400">{description}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
