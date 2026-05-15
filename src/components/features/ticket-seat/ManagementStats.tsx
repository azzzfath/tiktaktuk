import { Card } from "@/components/ui/Card";

interface ManagementStatsProps {
  items: {
    label: string;
    value: number | string;
  }[];
}

export function ManagementStats({ items }: ManagementStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="flex flex-col gap-1 p-5">
          <span className="text-xs font-semibold uppercase text-zinc-500">{item.label}</span>
          <strong className="text-2xl font-bold text-white">{item.value}</strong>
        </Card>
      ))}
    </div>
  );
}
