import Link from "next/link";
import { ShoppingCart, Receipt, Tag, ArrowRight } from "lucide-react";

interface NavItem {
  href: string;
  title: string;
  description: string;
  icon: typeof ShoppingCart;
}

const navItems: NavItem[] = [
  {
    href: "/checkout",
    title: "Checkout Tiket",
    description: "Pilih kategori, kursi, dan pakai kode promo untuk menyelesaikan pembelian.",
    icon: ShoppingCart,
  },
  {
    href: "/orders",
    title: "Daftar Order",
    description: "Lihat riwayat pesanan dengan filter dan akses berbasis role.",
    icon: Receipt,
  },
  {
    href: "/promotions",
    title: "Manajemen Promosi",
    description: "Kelola kode promo dan kampanye diskon untuk event Anda.",
    icon: Tag,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex flex-col gap-4 max-w-2xl">
          <span className="inline-flex w-fit items-center rounded-full bg-[#6366F1]/20 text-[#6366F1] px-2.5 py-0.5 text-xs font-medium">
            TikTakTuk &middot; Order &amp; Promotion
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Platform Tiket Event yang Mudah Dikelola
          </h1>
          <p className="text-base text-zinc-400">
            Demo frontend untuk fitur Order &amp; Promotion (fitur 13&ndash;17). Gunakan tautan di bawah
            untuk menjelajahi setiap halaman.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {navItems.map(({ href, title, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group bg-[#1A1A1A] rounded-xl border border-white/10 p-6 hover:border-[#6366F1]/60 transition-colors"
            >
              <div className="flex flex-col gap-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366F1]/20 text-[#6366F1]">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <p className="text-sm text-zinc-400">{description}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-[#6366F1] group-hover:gap-2 transition-all">
                  Buka halaman <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
