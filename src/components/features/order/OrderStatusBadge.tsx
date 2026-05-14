import { Badge } from "@/components/ui/Badge";
import { PaymentStatus } from "@/types";

const map: Record<PaymentStatus, { label: string; variant: "success" | "warning" | "error" }> = {
  PAID: { label: "Lunas", variant: "success" },
  PENDING: { label: "Pending", variant: "warning" },
  CANCELLED: { label: "Dibatalkan", variant: "error" },
};

export const OrderStatusBadge = ({ status }: { status: PaymentStatus }) => {
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
};
