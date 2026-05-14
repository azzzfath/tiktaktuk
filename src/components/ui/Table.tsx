import { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Table = ({ className, children, ...props }: HTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-x-auto rounded-xl border border-white/10">
    <table className={cn("w-full text-sm text-left", className)} {...props}>
      {children}
    </table>
  </div>
);

export const THead = ({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn("bg-white/5 text-zinc-400", className)} {...props}>
    {children}
  </thead>
);

export const TBody = ({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("divide-y divide-white/5", className)} {...props}>
    {children}
  </tbody>
);

export const TR = ({ className, children, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn("hover:bg-white/[0.03] transition-colors", className)} {...props}>
    {children}
  </tr>
);

export const TH = ({ className, children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn("px-4 py-3 text-xs font-semibold uppercase tracking-wider", className)}
    {...props}
  >
    {children}
  </th>
);

export const TD = ({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("px-4 py-3 text-[#F4F4F5]", className)} {...props}>
    {children}
  </td>
);
