import { Calendar, ChartNoAxesCombined, MapPin, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { DashboardData, DashboardMetric } from "@/types/auth";

interface DashboardViewProps {
  dashboard: DashboardData;
}

const toneClasses: Record<DashboardMetric["tone"], string> = {
  primary: "bg-[#6366F1]/20 text-[#6366F1]",
  success: "bg-green-500/20 text-green-500",
  accent: "bg-[#06B6D4]/20 text-[#06B6D4]",
  warning: "bg-amber-500/20 text-amber-500",
};

const metricIcons = [Ticket, Calendar, ChartNoAxesCombined, MapPin];

export function DashboardView({ dashboard }: DashboardViewProps) {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-[#1A1A1A] p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-zinc-500">{dashboard.eyebrow}</span>
            <h1 className="text-3xl font-bold">{dashboard.title}</h1>
            <p className="text-sm text-zinc-400">{dashboard.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {dashboard.actions.map((action) => (
              <Badge key={action} variant="primary">
                {action}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboard.metrics.map((metric, index) => {
          const Icon = metricIcons[index] ?? Ticket;
          return (
            <Card key={metric.label} className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium uppercase text-zinc-500">{metric.label}</span>
                  <strong className="text-2xl font-bold">{metric.value}</strong>
                  <span className="text-xs text-zinc-500">{metric.helper}</span>
                </div>
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneClasses[metric.tone]}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {dashboard.panels.map((panel) => (
          <Card key={panel.title} className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">{panel.title}</h2>
            <div className="flex flex-col gap-3">
              {panel.rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-zinc-400">{row.label}</span>
                  <span className="font-semibold">{row.value}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
