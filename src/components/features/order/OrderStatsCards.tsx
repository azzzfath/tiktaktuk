import { Receipt, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { Order, Role } from "@/types";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

interface OrderStatsCardsProps {
  orders: Order[];
  role: Role;
}

interface Stat {
  label: string;
  value: string;
  icon: typeof Receipt;
  iconClass: string;
  bgClass: string;
}

export const OrderStatsCards = ({ orders, role }: OrderStatsCardsProps) => {
  const total = orders.length;
  const paid = orders.filter((o) => o.status === "PAID").length;
  const pending = orders.filter((o) => o.status === "PENDING").length;
  const revenue = orders.filter((o) => o.status === "PAID").reduce((sum, o) => sum + o.total, 0);

  const stats: Stat[] = [
    {
      label: "Total Order",
      value: total.toString(),
      icon: Receipt,
      iconClass: "text-[#6366F1]",
      bgClass: "bg-[#6366F1]/20",
    },
    {
      label: "Lunas",
      value: paid.toString(),
      icon: CheckCircle2,
      iconClass: "text-[#22C55E]",
      bgClass: "bg-[#22C55E]/20",
    },
    {
      label: "Pending",
      value: pending.toString(),
      icon: Clock,
      iconClass: "text-[#F59E0B]",
      bgClass: "bg-[#F59E0B]/20",
    },
  ];

  if (role === "organizer" || role === "admin") {
    stats.push({
      label: "Total Revenue",
      value: formatIDR(revenue),
      icon: TrendingUp,
      iconClass: "text-[#06B6D4]",
      bgClass: "bg-[#06B6D4]/20",
    });
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        stats.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"
      )}
    >
      {stats.map(({ label, value, icon: Icon, iconClass, bgClass }) => (
        <div key={label} className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-bold text-[#F4F4F5]">{value}</p>
            </div>
            <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-lg", bgClass)}>
              <Icon className={cn("h-5 w-5", iconClass)} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
