import Link from "next/link";
import { CalendarDays, ShieldCheck, Ticket } from "lucide-react";
import { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <section className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_28rem] lg:px-8">
        <div className="hidden flex-col justify-between rounded-2xl border border-white/10 bg-[#1A1A1A] p-8 lg:flex">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#6366F1] text-lg font-bold text-white"
            >
              TT
            </Link>
            <div className="flex flex-col">
              <span className="text-xl font-bold">TikTakTuk</span>
              <span className="text-sm text-zinc-400">Event ticketing management</span>
            </div>
          </div>
          <div className="flex max-w-xl flex-col gap-4">
            <h1 className="text-4xl font-bold">Kelola event, tiket, venue, dan pesanan dalam satu platform.</h1>
            <p className="text-base text-zinc-400">
              Masuk untuk memantau aktivitas, mengatur katalog tiket, dan mengelola data pengguna
              sesuai peran akun Anda.
            </p>
          </div>
          <div className="grid gap-3">
            <AuthFeature icon={Ticket} title="Ticketing" description="Kelola kategori tiket dan aset kursi." />
            <AuthFeature icon={CalendarDays} title="Event Ops" description="Pantau acara, venue, dan performa penjualan." />
            <AuthFeature icon={ShieldCheck} title="Role Access" description="Akses dipisahkan untuk admin, organizer, dan customer." />
          </div>
        </div>
        <div className="flex min-h-full items-center justify-center">
          <div className="flex w-full max-w-md flex-col gap-6">
            <div className="flex flex-col items-center gap-3 text-center lg:hidden">
              <Link
                href="/"
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#6366F1] text-lg font-bold text-white"
              >
                TT
              </Link>
              <div>
                <h1 className="text-3xl font-bold">TikTakTuk</h1>
                <p className="text-sm text-zinc-400">{subtitle}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6 shadow-2xl">
            <div className="mb-6 flex flex-col gap-1">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-zinc-500">{subtitle}</p>
            </div>
            {children}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function AuthFeature({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Ticket;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0F0F0F] p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366F1]/20 text-[#6366F1]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-sm text-zinc-400">{description}</span>
      </span>
    </div>
  );
}
