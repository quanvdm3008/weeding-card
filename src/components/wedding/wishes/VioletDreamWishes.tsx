import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, PenLine, Send, Sparkles } from "lucide-react";
import { useWishesData } from "@/hooks/useWishesData";

const EMOJIS = ["✨", "💜", "💍", "🌙", "🥂", "🌸"];

export const VioletDreamWishes = ({ publicSlug, accentColor }: { publicSlug?: string; accentColor: string }) => {
  const { wishes, handleLike, handleSubmit } = useWishesData(publicSlug);
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [sending, setSending] = useState(false);
  const visibleWishes = showAll ? wishes : wishes.slice(0, 4);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    try {
      await handleSubmit(name, message, emoji);
      setName("");
      setMessage("");
      setShowForm(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid gap-10 @md:grid-cols-[.72fr_1.28fr] @md:gap-16">
      <aside className="relative overflow-hidden rounded-[1.8rem] border border-[#F7E7CC]/20 bg-[radial-gradient(circle_at_50%_0%,rgba(204,145,251,.3),transparent_35%),linear-gradient(145deg,#32164c,#160923)] p-8 shadow-[0_28px_65px_rgba(4,0,14,.35)] @md:min-h-[420px] @md:p-10">
        <div className="absolute inset-5 rounded-full border border-[#E8CFFF]/15" />
        <div className="absolute inset-[18%] rounded-full border border-dashed border-[#E8CFFF]/20" />
        <div className="relative flex h-full flex-col justify-between">
          <Sparkles className="h-5 w-5 text-[#F7E7CC]" />
          <div><p className="text-[10px] font-semibold uppercase tracking-[.3em] text-[#E9CBFF]">Guest constellation</p><p className="mt-5 font-serif text-3xl leading-tight text-white">Mỗi lời chúc là một vì sao ở lại cùng đêm nay.</p></div>
          <p className="text-[10px] uppercase tracking-[.24em] text-white/45">{String(wishes.length).padStart(2, "0")} wishes received</p>
        </div>
      </aside>

      <div>
        <div className="space-y-3">
          {visibleWishes.map((wish, index) => (
            <motion.article key={wish.id} initial={{ opacity: 0, x: 22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .07 }} className="group relative grid grid-cols-[2.5rem_1fr_auto] gap-4 border-b border-[#E8CFFF]/20 py-5 first:pt-0">
              <span className="pt-1 font-serif text-lg text-[#EACFFF]/70">{String(index + 1).padStart(2, "0")}</span>
              <div><div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><span className="font-sans text-xs font-semibold uppercase tracking-[.16em] text-[#F7E7CC]">{wish.name}</span><span className="text-[10px] text-white/35">{wish.timestamp}</span></div><p className="mt-2 font-serif text-xl leading-relaxed text-white/85 @md:text-2xl">“{wish.message}”</p></div>
              <div className="flex flex-col items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-full border border-[#E8CFFF]/25 bg-white/5 text-base">{wish.emoji}</span><button type="button" onClick={() => handleLike(wish.id)} aria-label={`Thích lời chúc của ${wish.name}`} className={`inline-flex items-center gap-1 text-[10px] transition ${wish.liked ? "text-[#F7E7CC]" : "text-white/35 hover:text-white"}`}><Heart className={`h-3.5 w-3.5 ${wish.liked ? "fill-current" : ""}`} />{wish.likes || ""}</button></div>
            </motion.article>
          ))}
        </div>

        {!showAll && wishes.length > 4 && <button type="button" onClick={() => setShowAll(true)} className="mt-6 text-[10px] font-semibold uppercase tracking-[.2em] text-[#E9CBFF] transition hover:text-white">Mở thêm {wishes.length - 4} vì sao</button>}

        <AnimatePresence mode="wait">
          {!showForm ? <motion.button key="open" type="button" onClick={() => setShowForm(true)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-9 inline-flex items-center gap-3 rounded-full border border-[#F7E7CC]/55 px-6 py-3 text-xs font-semibold uppercase tracking-[.16em] text-[#F7E7CC] transition hover:bg-[#F7E7CC] hover:text-[#241136]"><PenLine className="h-4 w-4" />Thắp một vì sao</motion.button> : <motion.form key="form" onSubmit={submit} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mt-8 rounded-[1.5rem] border border-[#E8CFFF]/25 bg-[#160923]/65 p-6 backdrop-blur @md:p-8"><div className="grid gap-5"><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Tên của bạn" className="border-b border-[#E8CFFF]/25 bg-transparent pb-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#F7E7CC]" /><textarea required rows={3} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Gửi một lời chúc thật đẹp…" className="resize-none border-b border-[#E8CFFF]/25 bg-transparent pb-3 font-serif text-xl text-white outline-none placeholder:text-white/35 focus:border-[#F7E7CC]" /><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex gap-2">{EMOJIS.map((item) => <button key={item} type="button" onClick={() => setEmoji(item)} className={`grid h-8 w-8 place-items-center rounded-full border transition ${emoji === item ? "border-[#F7E7CC] bg-[#F7E7CC]/15" : "border-white/10"}`}>{item}</button>)}</div><div className="flex gap-3"><button type="button" onClick={() => setShowForm(false)} className="text-xs text-white/45">Huỷ</button><button type="submit" disabled={sending} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-[#241136] disabled:opacity-60" style={{ backgroundColor: accentColor }}><Send className="h-3.5 w-3.5" />{sending ? "Đang gửi" : "Gửi lời chúc"}</button></div></div></div></motion.form>}
        </AnimatePresence>
      </div>
    </div>
  );
};
