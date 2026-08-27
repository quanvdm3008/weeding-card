import { useEffect, useState } from "react";
import { BookHeart, MapPin, MailCheck } from "lucide-react";
import { registerCardComponent } from "../registry";
import type { CardComponentRendererProps } from "../types";
import { boxStyleFromCard, textStyleFromCard } from "../styleUtils";
import {
  getPublicWishes,
  postPublicWish,
  submitPublicRsvp,
  type WishDto,
} from "@/lib/invitations";

/* ----------------------------------- RSVP ---------------------------------- */

function RsvpRenderer({ component, context }: CardComponentRendererProps) {
  const title = String(component.content.title ?? "Confirmation of Attendance");
  const buttonLabel = String(component.content.buttonLabel ?? "Send confirmation");
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const [attending, setAttending] = useState<"yes" | "no" | "maybe">("yes");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const accent = String(component.content.accentColor ?? "#E8B4B8");
  const interactive = context.mode === "public" && !!context.slug;

  const submit = async () => {
    if (!interactive || !name.trim() || sending) return;
    try {
      setSending(true);
      await submitPublicRsvp(context.slug!, name.trim(), count, attending);
      setSent(true);
    } catch {
      /* Hold the form for the customer to try again — error details logged at the API layer*/
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-3 overflow-hidden"
      style={{ ...boxStyleFromCard(component.style), ...textStyleFromCard(component.style) }}
    >
      <div style={{ fontSize: component.style.fontSize * 1.2, fontWeight: 600 }}>{title}</div>
      {sent ? (
        <div className="flex-1 flex items-center justify-center gap-2">
          <MailCheck className="w-5 h-5" style={{ color: accent }} />
          <span>Thank you for your confirmation!</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2 text-left" style={{ fontSize: component.style.fontSize * 0.8 }}>
          <input
            className="border border-border rounded-lg px-3 py-2 bg-white/80 outline-none focus:border-foreground/40"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!interactive}
          />
          <div className="flex gap-2">
            <select
              className="border border-border rounded-lg px-2 py-2 bg-white/80 flex-1"
              value={attending}
              onChange={(e) => setAttending(e.target.value as "yes" | "no" | "maybe")}
              disabled={!interactive}
            >
              <option value="yes">Will attend</option>
              <option value="no">Unable to attend</option>
              <option value="maybe">Not sure yet</option>
            </select>
            <input
              type="number"
              min={1}
              max={10}
              className="border border-border rounded-lg px-3 py-2 bg-white/80 w-20"
              value={count}
              onChange={(e) => setCount(Math.max(1, Number(e.target.value) || 1))}
              disabled={!interactive}
              title="Number of guests"
            />
          </div>
          <button
            className="rounded-lg py-2.5 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ background: accent }}
            onClick={submit}
            disabled={!interactive || sending}
          >
            {sending ? "Sending..." : buttonLabel}
          </button>
          {context.mode === "editor" && (
            <span className="text-xs opacity-60">The form actually works on the published card page.</span>
          )}
        </div>
      )}
    </div>
  );
}

registerCardComponent({
  type: "rsvp",
  label: "Form RSVP",
  icon: MailCheck,
  category: "widget",
  defaultSize: { width: 420, height: 300 },
  defaultContent: { title: "Confirmation of Attendance", buttonLabel: "Send confirmation", accentColor: "#E8B4B8" },
  defaultStyle: { background: "#FFFFFF", radius: 16, padding: 20, textAlign: "center", shadow: { enabled: true, x: 0, y: 8, blur: 28, spread: 0, color: "rgba(0,0,0,0.10)" } },
  defaultName: "RSVP",
  supportsTypography: true,
  inspector: [
    { key: "title", label: "Title", type: "text" },
    { key: "buttonLabel", label: "Send button label", type: "text" },
    { key: "accentColor", label: "Accent color", type: "color" },
  ],
  Renderer: RsvpRenderer,
});

/* --------------------------------- Guest book ------------------------------- */

function GuestbookRenderer({ component, context }: CardComponentRendererProps) {
  const title = String(component.content.title ?? "Guestbook");
  const accent = String(component.content.accentColor ?? "#E8B4B8");
  const [wishes, setWishes] = useState<WishDto[]>([]);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const interactive = context.mode === "public" && !!context.slug;

  useEffect(() => {
    if (!interactive) return;
    getPublicWishes(context.slug!)
      .then((r) => setWishes(r.items))
      .catch(() => undefined);
  }, [interactive, context.slug]);

  const submit = async () => {
    if (!interactive || !author.trim() || !message.trim() || sending) return;
    try {
      setSending(true);
      const wish = await postPublicWish(context.slug!, author.trim(), message.trim(), "💖");
      setWishes((prev) => [wish, ...prev]);
      setMessage("");
    } catch {
      /* Hold the input to try again*/
    } finally {
      setSending(false);
    }
  };

  const preview: Pick<WishDto, "id" | "authorName" | "message">[] =
    context.mode === "editor" && wishes.length === 0
      ? [
          { id: "demo-1", authorName: "Paternal family", message: "Wishing you two hundreds of years of happiness!" },
          { id: "demo-2", authorName: "Friends group", message: "Even after getting married, you still have to go out with us 💕" },
        ]
      : wishes;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 overflow-hidden"
      style={{ ...boxStyleFromCard(component.style), ...textStyleFromCard(component.style) }}
    >
      <div style={{ fontSize: component.style.fontSize * 1.2, fontWeight: 600 }}>{title}</div>
      <div className="flex gap-2" style={{ fontSize: component.style.fontSize * 0.8 }}>
        <input
          className="border border-border rounded-lg px-3 py-2 bg-white/80 flex-1 min-w-0"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          disabled={!interactive}
        />
        <button
          className="rounded-lg px-4 font-semibold text-white shrink-0 hover:opacity-90 disabled:opacity-60"
          style={{ background: accent }}
          onClick={submit}
          disabled={!interactive || sending}
        >
          Send
        </button>
      </div>
      <textarea
        className="border border-border rounded-lg px-3 py-2 bg-white/80 resize-none"
        style={{ fontSize: component.style.fontSize * 0.8 }}
        rows={2}
        placeholder="Your wishes..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={!interactive}
      />
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 text-left" style={{ fontSize: component.style.fontSize * 0.78 }}>
        {preview.map((w) => (
          <div key={w.id} className="rounded-lg px-3 py-2 bg-white/70 border border-border/60">
            <div style={{ fontWeight: 600 }}>{w.authorName}</div>
            <div className="opacity-85">{w.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

registerCardComponent({
  type: "guestbook",
  label: "Guestbook",
  icon: BookHeart,
  category: "widget",
  defaultSize: { width: 440, height: 380 },
  defaultContent: { title: "Guestbook", accentColor: "#E8B4B8" },
  defaultStyle: { background: "#FDFBF7", radius: 16, padding: 20, textAlign: "center" },
  defaultName: "Guestbook",
  supportsTypography: true,
  inspector: [
    { key: "title", label: "Title", type: "text" },
    { key: "accentColor", label: "Accent color", type: "color" },
  ],
  Renderer: GuestbookRenderer,
});

/* ----------------------------------- Map ----------------------------------- */

function MapRenderer({ component, context }: CardComponentRendererProps) {
  const address = String(component.content.address ?? "");
  const zoom = Number(component.content.zoom ?? 15);
  const box = boxStyleFromCard(component.style);

  if (!address || context.mode === "editor") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted/60 text-muted-foreground border border-dashed border-border" style={box}>
        <MapPin className="w-6 h-6" />
        <span className="text-xs px-4 text-center">
          {address ? `Map: ${address}` : "Enter the address in Inspector →"}
        </span>
        {context.mode === "editor" && address && (
          <span className="text-[10px] opacity-60">(real map shown on card page)</span>
        )}
      </div>
    );
  }
  return (
    <iframe
      title="map"
      className="w-full h-full border-0"
      style={box}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=${zoom}&output=embed`}
    />
  );
}

registerCardComponent({
  type: "map",
  label: "Map",
  icon: MapPin,
  category: "widget",
  defaultSize: { width: 480, height: 320 },
  defaultContent: { address: "", zoom: 15 },
  defaultStyle: { radius: 16 },
  defaultName: "Map",
  inspector: [
    { key: "address", label: "Address/location", type: "text", placeholder: "VD: White Palace, Q.1, TP.HCM" },
    { key: "zoom", label: "Zoom level", type: "slider", min: 10, max: 19, step: 1 },
  ],
  Renderer: MapRenderer,
});
