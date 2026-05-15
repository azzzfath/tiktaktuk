"use client";

import { FormEvent, useState } from "react";
import { Lock, Mail, Pencil, Phone, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import { SessionUser } from "@/types/auth";

interface ProfileViewProps {
  user: SessionUser;
}

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ProfileView({ user }: ProfileViewProps) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    displayName: user.displayName,
    contact: user.role === "organizer" ? user.contactEmail ?? "" : user.phoneNumber ?? "",
  });
  const [password, setPassword] = useState<PasswordForm>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const submitProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: (user.role === "customer" || user.role === "administrator") ? profile.displayName : undefined,
        phoneNumber: (user.role === "customer" || user.role === "administrator") ? profile.contact : undefined,
        organizerName: user.role === "organizer" ? profile.displayName : undefined,
        contactEmail: user.role === "organizer" ? profile.contact : undefined,
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      toast(result.message ?? "Profil gagal diperbarui.", "error");
      return;
    }

    toast("Profil berhasil diperbarui.");
    setEditing(false);
  };

  const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.newPassword !== password.confirmPassword) {
      toast("Konfirmasi password baru tidak sama.", "error");
      return;
    }

    const response = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(password),
    });
    const result = await response.json();

    if (!response.ok) {
      toast(result.message ?? "Password gagal diperbarui.", "error");
      return;
    }

    toast("Password berhasil diperbarui.");
    setPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Profil Saya</h1>
        <p className="text-sm text-zinc-400">Kelola informasi pribadi dan preferensi akun Anda</p>
      </div>
      <Card>
        <form onSubmit={submitProfile} className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Informasi Profil</h2>
              <p className="text-sm text-zinc-500">Username tidak dapat diubah</p>
            </div>
            <Button type="button" variant="secondary" onClick={() => setEditing((value) => !value)}>
              <Pencil className="mr-2 inline h-4 w-4" />
              Edit
            </Button>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#6366F1] text-xl font-bold">
            {profile.displayName.charAt(0).toUpperCase()}
          </div>
          <Badge variant={user.role === "organizer" ? "secondary" : "primary"}>{user.role}</Badge>
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileField icon={UserRound} label="Username" value={`@${user.username}`} />
            {editing ? (
              <label className="flex flex-col gap-2 text-sm font-medium">
                Nama
                <Input value={profile.displayName} onChange={(event) => setProfile({ ...profile, displayName: event.target.value })} />
              </label>
            ) : (
              <ProfileField icon={UserRound} label="Nama" value={profile.displayName} />
            )}
            {editing ? (
              <label className="flex flex-col gap-2 text-sm font-medium">
                Kontak
                <Input value={profile.contact} onChange={(event) => setProfile({ ...profile, contact: event.target.value })} />
              </label>
            ) : null}
            {!editing ? (
              <ProfileField icon={user.role === "organizer" ? Mail : Phone} label="Kontak" value={profile.contact || "-"} />
            ) : null}
          </div>
          {editing ? <Button type="submit">Simpan Profil</Button> : null}
        </form>
      </Card>
      <Card>
        <form onSubmit={submitPassword} className="flex flex-col gap-4">
          <div>
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold">
              <Lock className="h-5 w-5" />
              Update Password
            </h2>
            <p className="text-sm text-zinc-500">Perbarui password Anda untuk menjaga keamanan akun</p>
          </div>
          <Input type="password" placeholder="Password Lama" value={password.oldPassword} onChange={(event) => setPassword({ ...password, oldPassword: event.target.value })} />
          <Input type="password" placeholder="Password Baru" value={password.newPassword} onChange={(event) => setPassword({ ...password, newPassword: event.target.value })} />
          <Input type="password" placeholder="Konfirmasi Password Baru" value={password.confirmPassword} onChange={(event) => setPassword({ ...password, confirmPassword: event.target.value })} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setPassword({ oldPassword: "", newPassword: "", confirmPassword: "" })}>
              Cancel
            </Button>
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </Card>
    </section>
  );
}

function ProfileField({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="mt-0.5 h-4 w-4 text-zinc-500" />
      <div className="flex flex-col gap-1">
        <span className="text-xs text-zinc-500">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
}
