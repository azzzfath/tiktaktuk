import { Tag, Users, Percent } from "lucide-react";
import { Promotion } from "@/types";
import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string;
  icon: typeof Tag;
  iconClass: string;
  bgClass: string;
}

export const PromotionStatsCards = ({ promotions }: { promotions: Promotion[] }) => {
  const total = promotions.length;
  const usage = promotions.reduce((sum, p) => sum + p.usageCount, 0);
  const percentageCount = promotions.filter((p) => p.type === "PERCENTAGE").length;

  const stats: Stat[] = [
    {
      label: "Total Promo",
      value: total.toString(),
      icon: Tag,
      iconClass: "text-[#6366F1]",
      bgClass: "bg-[#6366F1]/20",
    },
    {
      label: "Total Penggunaan",
      value: usage.toLocaleString("id-ID"),
      icon: Users,
      iconClass: "text-[#06B6D4]",
      bgClass: "bg-[#06B6D4]/20",
    },
    {
      label: "Tipe Persentase",
      value: percentageCount.toString(),
      icon: Percent,
      iconClass: "text-[#8B5CF6]",
      bgClass: "bg-[#8B5CF6]/20",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
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
