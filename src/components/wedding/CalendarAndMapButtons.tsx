import React from "react";
import { Calendar, MapPin, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface CalendarAndMapButtonsProps {
  title?: string;
  dateStr?: string; // YYYY-MM-DD
  timeStr?: string; // HH:mm
  venue?: string;
  address?: string;
  accentColor?: string;
  className?: string;
}

export const CalendarAndMapButtons: React.FC<CalendarAndMapButtonsProps> = ({
  title = "wedding",
  dateStr = "2026-10-24",
  timeStr = "11:00",
  venue = "Wedding Center",
  address = "Hanoi, Vietnam",
  accentColor = "hsl(38 47% 58%)",
  className = "",
}) => {
  /* Create Google Calendar link*/
  const getGoogleCalendarUrl = () => {
    const cleanDate = dateStr.replace(/-/g, "");
    const cleanTime = timeStr.replace(":", "") + "00";
    const startIso = `${cleanDate}T${cleanTime}`;
    // Default duration is 3 hours
    const endDate = new Date(`${dateStr}T${timeStr}:00`);
    endDate.setHours(endDate.getHours() + 3);
    const endIso = endDate.toISOString().replace(/-|:|\.\d+/g, "").substring(0, 15);

    const details = encodeURIComponent(`Marriage Ceremony & Wedding Reception at ${venue}.
Address: ${address}`);
    const location = encodeURIComponent(`${venue}, ${address}`);
    const eventTitle = encodeURIComponent(`Marriage Ceremony: ${title}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  /* Create iCal / Apple Calendar file*/
  const handleDownloadICal = () => {
    const cleanDate = dateStr.replace(/-/g, "");
    const cleanTime = timeStr.replace(":", "") + "00";
    const startIso = `${cleanDate}T${cleanTime}`;

    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mireia Wedding//NONSGML v1.0//EN
BEGIN:VEVENT
SUMMARY:Marriage Ceremony ${title}
DESCRIPTION:Marriage Ceremony & Wedding Party at ${venue}. Address: ${address}
LOCATION:${venue}, ${address}
DTSTART:${startIso}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `DamCuoi_${title.replace(/\s+/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Wedding calendar (.ics) loaded!");
  };

  /* Create Google Maps directions link*/
  const getGoogleMapsUrl = () => {
    const query = encodeURIComponent(`${venue} ${address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Wedding Invitations ${title}`,
          text: `Sincerely invite you to attend our Wedding Ceremony at ${venue}!`,
          url: window.location.href,
        });
      } catch {
        // User canceled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Wedding invitation link copied!");
    }
  };

  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 mt-6 ${className}`}>
      {/* Google Calendar */}
      <a
        href={getGoogleCalendarUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card text-foreground font-body text-xs sm:text-sm font-semibold hover:border-accent hover:shadow-soft transition-all duration-200"
      >
        <Calendar className="w-4 h-4" style={{ color: accentColor }} />
        Add Google Calendar
      </a>

      {/* Apple / iCal */}
      <button
        onClick={handleDownloadICal}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card text-foreground font-body text-xs sm:text-sm font-semibold hover:border-accent hover:shadow-soft transition-all duration-200"
      >
        <Sparkles className="w-4 h-4 text-amber-500" />
        Add Apple iCal
      </button>

      {/* Google Maps Direction */}
      <a
        href={getGoogleMapsUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-accent text-accent-foreground font-body text-xs sm:text-sm font-semibold shadow-gold hover:opacity-90 transition-all duration-200"
      >
        <MapPin className="w-4 h-4 fill-current" />
        Google Maps directions
      </a>

      {/* Share */}
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground font-body text-xs sm:text-sm font-medium transition"
        title="Share wedding invitations"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CalendarAndMapButtons;
