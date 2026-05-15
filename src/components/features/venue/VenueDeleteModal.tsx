"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

interface VenueDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  venueId?: string;
}

export function VenueDeleteModal({ isOpen, onClose, onSuccess, venueId }: VenueDeleteModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!venueId) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/venues/${venueId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal menghapus venue.");

      toast("Venue berhasil dihapus.", "success");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hapus Venue">
      <div className="pt-4">
        <p className="text-zinc-400 text-sm mb-6">
          Apakah Anda yakin ingin menghapus venue ini? Tindakan ini tidak dapat dibatalkan dan mungkin gagal jika venue masih digunakan oleh acara aktif.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1">Batal</Button>
          <Button 
            disabled={loading} 
            onClick={handleDelete} 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}