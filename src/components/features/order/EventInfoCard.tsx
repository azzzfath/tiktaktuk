import { Calendar, MapPin, Sparkles } from "lucide-react";
import { Event } from "@/types";
import { formatDate } from "@/lib/format";

export const EventInfoCard = ({ event }: { event: Event }) => {
  return (
    <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6">
      <div className="flex items-start gap-4">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#6366F1]/20 text-[#6366F1]">
          <Sparkles className="h-6 w-6" />
        </span>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-[#F4F4F5]">{event.event_title}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(event.event_date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {event.venue_id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
