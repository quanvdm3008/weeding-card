import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Share2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { getInvitationHeart, setInvitationHeart } from "@/lib/invitations";
import { useRealtimeChannel } from "@/hooks/useRealtimeChannel";
import { toast } from "sonner";

interface Props {
  publicSlug?: string;
  accentColor: string;
  children?: ReactNode;
}

interface ReactionMessage { type: "heart"; count: number }
interface Burst { id: number; x: number; y: number }

const formatCount = (value: number) => new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);

const InvitationActionRail = ({ publicSlug, accentColor, children }: Props) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstId = useRef(0);
  const lastTap = useRef({ at: 0, x: 0, y: 0 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!publicSlug) return;
    getInvitationHeart(publicSlug).then((value) => {
      setLiked(value.liked);
      setCount(value.count);
    }).catch(() => undefined);
  }, [publicSlug]);

  useRealtimeChannel<ReactionMessage>(
    publicSlug ? `/topic/invitations/${publicSlug}/reactions` : null,
    (message) => { if (message.type === "heart") setCount(message.count); },
  );

  const burst = useCallback((x = window.innerWidth - 52, y = window.innerHeight - 180) => {
    if (reduceMotion) return;
    const item = { id: ++burstId.current, x, y };
    setBursts((current) => [...current.slice(-3), item]);
    window.setTimeout(() => setBursts((current) => current.filter((entry) => entry.id !== item.id)), 2400);
  }, [reduceMotion]);

  const updateHeart = useCallback(async (nextLiked: boolean, x?: number, y?: number) => {
    if (busy) return;
    if (nextLiked) burst(x, y);
    if (!publicSlug) {
      setLiked(nextLiked);
      setCount((value) => Math.max(0, value + (nextLiked === liked ? 0 : nextLiked ? 1 : -1)));
      return;
    }
    if (nextLiked === liked) return;
    setBusy(true);
    setLiked(nextLiked);
    setCount((value) => Math.max(0, value + (nextLiked ? 1 : -1)));
    try {
      const result = await setInvitationHeart(publicSlug, nextLiked);
      setLiked(result.liked);
      setCount(result.count);
    } catch {
      setLiked(!nextLiked);
      setCount((value) => Math.max(0, value + (nextLiked ? -1 : 1)));
      toast.error("Unable to release heart, please try again");
    } finally {
      setBusy(false);
    }
  }, [burst, busy, liked, publicSlug]);

  useEffect(() => {
    const onPointerUp = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, select, [role='dialog']")) return;
      const now = Date.now();
      const distance = Math.hypot(event.clientX - lastTap.current.x, event.clientY - lastTap.current.y);
      if (now - lastTap.current.at < 330 && distance < 48) {
        void updateHeart(true, event.clientX, event.clientY);
        lastTap.current.at = 0;
      } else {
        lastTap.current = { at: now, x: event.clientX, y: event.clientY };
      }
    };
    document.addEventListener("pointerup", onPointerUp, { passive: true });
    return () => document.removeEventListener("pointerup", onPointerUp);
  }, [updateHeart]);

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: document.title, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Card link copied");
      }
    } catch (error) {
      if ((error as DOMException)?.name !== "AbortError") toast.error("Cannot share link");
    }
  };

  return (
    <>
      <AnimatePresence>
        {bursts.map((item) => (
          <div key={item.id} className="pointer-events-none fixed z-[110]" style={{ left: item.x, top: item.y }} aria-hidden="true">
            {Array.from({ length: 7 }).map((_, index) => (
              <motion.span
                key={index}
                className="absolute grid h-8 w-8 place-items-center"
                initial={{ opacity: 0, scale: 0.45, x: 0, y: 0, rotate: 0 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.45, 1.15, 0.85], x: (index - 3) * 22, y: -90 - (index % 3) * 45, rotate: (index - 3) * 18 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8 + index * 0.08, ease: "easeOut" }}
              >
                <Heart className="h-7 w-7 fill-current drop-shadow-lg" style={{ color: index % 2 ? accentColor : "#fb416f" }} />
              </motion.span>
            ))}
          </div>
        ))}
      </AnimatePresence>

      <aside className="fixed bottom-[max(6rem,env(safe-area-inset-bottom))] right-3 z-[90] flex flex-col items-center gap-4 sm:right-6" aria-label="Interact with cards">
        <div className="flex flex-col items-center gap-1">
          <motion.button
            type="button"
            whileTap={{ scale: 0.82 }}
            onClick={(event) => void updateHeart(!liked, event.clientX, event.clientY)}
            disabled={busy}
            className="grid h-14 w-14 place-items-center rounded-full border border-white/50 bg-black/60 text-white shadow-2xl backdrop-blur-md"
            aria-label={liked ? "Unlike the cards" : "Drop a heart for the card"}
            aria-pressed={liked}
          >
            <Heart className={`h-7 w-7 ${liked ? "fill-current" : ""}`} style={{ color: liked ? "#fb416f" : undefined }} />
          </motion.button>
          <span className="rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">{formatCount(count)}</span>
        </div>
        <button type="button" onClick={share} className="grid h-12 w-12 place-items-center rounded-full border border-white/50 bg-black/60 text-white shadow-xl backdrop-blur-md" aria-label="Share cards">
          <Share2 className="h-5 w-5" />
        </button>
        {children}
      </aside>
    </>
  );
};

export default InvitationActionRail;
