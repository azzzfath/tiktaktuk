"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Armchair, CalendarDays, LayoutDashboard, LogOut, Receipt, Tag, Ticket, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { SessionUser } from "@/types/auth";

interface AppNavbarProps {
  user: SessionUser;
}

interface NavItem {
  href: string;
  label: string;
  roles: SessionUser["role"][];
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["administrator", "organizer", "customer"], icon: LayoutDashboard },
  { href: "/venues", label: "Manajemen Venue", roles: ["administrator", "organizer"], icon: Users },
  { href: "/events", label: "Manajemen Event", roles: ["administrator", "organizer"], icon: CalendarDays },
  { href: "/explore", label: "Cari Event", roles: ["customer"], icon: CalendarDays },
  { href: "/tickets", label: "Tiket", roles: ["administrator", "organizer", "customer"], icon: Ticket },
  { href: "/seats", label: "Kursi", roles: ["administrator", "organizer", "customer"], icon: Armchair },
  { href: "/orders", label: "Pesanan", roles: ["administrator", "organizer", "customer"], icon: Receipt },
  { href: "/promotions", label: "Promosi", roles: ["administrator", "customer"], icon: Tag },
  { href: "/profile", label: "Profile", roles: ["administrator", "organizer", "customer"], icon: UserRound },
];

export function AppNavbar({ user }: AppNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <header className="border-b border-white/10 bg-[#0F0F0F]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366F1] font-bold text-white">
              TT
            </span>
            <span className="flex flex-col">
              <span className="text-base font-bold">TikTakTuk</span>
              <span className="text-xs text-zinc-500">{user.role}</span>
            </span>
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="inline-flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        <nav className="flex gap-2 overflow-x-auto">
          {navItems
            .filter((item) => item.roles.includes(user.role))
            .map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-[#6366F1] text-white"
                    : "bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
        </nav>
      </div>
    </header>
  );
}
