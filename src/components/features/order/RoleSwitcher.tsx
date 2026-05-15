"use client";

import { UserCog } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { Role } from "@/types";

const roles: { value: Role; label: string }[] = [
  { value: "guest", label: "Guest" },
  { value: "customer", label: "Customer" },
  { value: "organizer", label: "Organizer" },
  { value: "admin", label: "Admin" },
];

export const RoleSwitcher = () => {
  const { role, setRole } = useRole();

  return (
    <div className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2">
      <UserCog className="h-4 w-4 text-[#6366F1]" />
      <span className="text-xs font-medium text-zinc-400">Role:</span>
      <select
        value={role}
        onChange={(event) => setRole(event.target.value as Role)}
        className="bg-transparent text-sm text-[#F4F4F5] focus:outline-none cursor-pointer"
      >
        {roles.map((item) => (
          <option key={item.value} value={item.value} className="bg-[#1A1A1A]">
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};
