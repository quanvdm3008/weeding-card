import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Copy, Crown, Heart, QrCode, Send, X } from "lucide-react";
import { WEDDING_SEED_DATA, type BankInfo } from "@/data/seedData";
import { useCountdown } from "@/hooks/useCountdown";
import { useWishesData } from "@/hooks/useWishesData";
import { submitPublicRsvp } from "@/lib/invitations";
import CountdownSection from "@/components/wedding/sections/CountdownSection";
import StorySection from "@/components/wedding/sections/StorySection";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import RSVPSection from "@/components/wedding/RSVPSection";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import { CalendarAndMapButtons } from "@/components/wedding/CalendarAndMapButtons";
import type { TemplateProps } from "@/features/template/components/types";
import { themes } from "@/data/themes";

const royalStyles = `
  .royal-invitation { background: #17080d; color: #2a1020; }
  .royal-invitation input, .royal-invitation textarea, .royal-invitation select { font-family: ui-sans-serif, system-ui, sans-serif; }
  .royal-hero::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(16,5,9,.95), rgba(29,8,15,.42) 58%, rgba(16,5,9,.78)), linear-gradient(0deg, rgba(16,5,9,.9), transparent 58%); }
  .royal-hero::before { content: ""; position: absolute; z-index: 5; right: -10rem; top: -12rem; height: 38rem; width: 38rem; border: 1px solid rgba(201,164,90,.28); border-radius: 999px; box-shadow: 0 0 0 3.5rem rgba(201,164,90,.025), 0 0 0 7rem rgba(201,164,90,.02); }
  .royal-seal { box-shadow: 0 0 0 13px rgba(201,164,90,.07), 0 30px 80px rgba(0,0,0,.42); }
  .royal-rule { background: linear-gradient(90deg, transparent, #c9a45a, transparent); }
  .royal-marble { background: linear-gradient(135deg, #f8f3eb 0%, #eadfcf 50%, #f8f3eb 100%); }
  .royal-night { background: radial-gradient(circle at 50% -20%, #5c2538 0, #210b14 43%, #13070a 100%); }
  .royal-ink { background: radial-gradient(circle at 50% 0, #5c2538, #210b14 55%, #13070a); }
`;

const monogram = (first: string, second: string) => `${first.trim().charAt(0)}${second.trim().charAt(0)}`.toUpperCase();

export const RoyalTemplate = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  publicSlug,
  publicGuestName,
  publicGuestToken,
  rsvpEnabled = true,
  wishesEnabled = true,
  galleryImageUrls = WEDDING_SEED_DATA.galleryImageUrls,
  coverImageUrl = WEDDING_SEED_DATA.coverImageUrl,
  groomBank = WEDDING_SEED_DATA.groomBank,
  brideBank = WEDDING_SEED_DATA.brideBank,
  stories = WEDDING_SEED_DATA.stories,
  groomParents = WEDDING_SEED_DATA.groomParents,
  brideParents = WEDDING_SEED_DATA.brideParents,
  theme = themes.royal,
}: TemplateProps) => {
  const images = galleryImageUrls.length ? galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls;
  const { days, hours, minutes, seconds } = useCountdown(date, time);
  const { wishes, handleLike, handleSubmit: submitWish } = useWishesData(publicSlug);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpSending, setRsvpSending] = useState(false);
  const [rsvp, setRsvp] = useState({ name: publicGuestName ?? "", guests: "1", attending: "yes", message: "" });
  const [wish, setWish] = useState({ name: "", message: "", emoji: "💌" });
  const [wishSending, setWishSending] = useState(false);
  const formattedDate = date.split("-").reverse().join(".");
  const countdown = [{ label: "Ngày", value: days }, { label: "Giờ", value: hours }, { label: "Phút", value: minutes }, { label: "Giây", value: seconds }];

  const sendRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rsvp.name.trim()) return;
    setRsvpSending(true);
    try {
      if (publicSlug) await submitPublicRsvp(publicSlug, rsvp.name.trim(), Number(rsvp.guests), rsvp.attending as "yes" | "no", rsvp.message.trim() || undefined, publicGuestToken);
      setRsvpSent(true);
    } finally {
      setRsvpSending(false);
    }
  };

  const sendWish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!wish.name.trim() || !wish.message.trim()) return;
    setWishSending(true);
    try {
      await submitWish(wish.name.trim(), wish.message.trim(), wish.emoji);
      setWish({ name: "", message: "", emoji: "💌" });
    } finally {
      setWishSending(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="royal-invitation relative overflow-hidden font-serif">
      <style>{royalStyles}</style>
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[.035]" style={{ backgroundImage: "radial-gradient(#c9a45a 1px, transparent 1px)", backgroundSize: "34px 34px" }} />

      <section className="royal-hero relative isolate min-h-[100svh] overflow-hidden text-[#f7e7cc]">
        <img src={coverImageUrl} alt={`Lễ cưới ${groomName} và ${brideName}`} className="absolute inset-0 h-full w-full object-cover grayscale-[.18] sepia-[.12] contrast-110" />
        <div className="pointer-events-none absolute inset-5 z-10 border border-[#c9a45a]/35 @md:inset-9" /><div className="pointer-events-none absolute inset-8 z-10 border border-[#f7e7cc]/10 @md:inset-14" />
        <div className="relative z-20 mx-auto grid min-h-screen max-w-6xl items-end gap-10 px-7 pb-16 pt-32 @md:grid-cols-[1.2fr_.8fr] @md:items-center @md:px-12 @md:pb-20">
          <div className="max-w-3xl"><p className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.35em] text-[#e8c77c]"><span className="h-px w-9 bg-[#c9a45a]" />The wedding house presents</p><p className="mt-7 text-xs italic tracking-[.22em] text-[#f7e7cc]/65">A royal celebration of love</p><h1 className="mt-4 text-6xl leading-[.84] text-[#fff8e9] @md:text-8xl @lg:text-[7rem]"><span className="block">{groomName}</span><span className="my-4 block text-3xl italic text-[#dab76a] @md:text-5xl">&amp;</span><span className="block">{brideName}</span></h1><div className="royal-rule mt-9 h-px w-56" /><p className="mt-5 text-[10px] font-semibold uppercase tracking-[.28em] text-[#f7e7cc]/75">{formattedDate} &nbsp; {time} &nbsp; / &nbsp; {venue}</p></div>
          <div className="royal-seal ml-auto grid aspect-square w-full max-w-[300px] place-items-center rounded-full border border-[#c9a45a]/65 bg-[#19080d]/55 p-8 text-center backdrop-blur-md"><div className="grid h-full w-full place-items-center rounded-full border border-dashed border-[#c9a45a]/45 p-5"><div><Crown className="mx-auto h-5 w-5 text-[#dab76a]" /><p className="my-3 text-7xl leading-none text-[#dab76a]">{monogram(groomName, brideName)}</p><p className="text-[9px] font-semibold uppercase tracking-[.26em] text-[#f7e7cc]/65">By royal appointment</p></div></div></div>
          <div className="col-span-full flex items-center justify-between border-t border-[#f7e7cc]/20 pt-5 text-[9px] font-semibold uppercase tracking-[.24em] text-[#f7e7cc]/60"><span>Est. 2026</span><span>With honour &amp; joy</span></div>
        </div>
      </section>

      <section className="royal-night relative border-y-4 border-[#c9a45a] px-4 py-24 text-white"><div className="mx-auto max-w-4xl text-center"><p className="text-[10px] font-semibold uppercase tracking-[.35em] text-[#f7e7cc]/55">The grand occasion</p><h2 className="mb-12 mt-3 text-sm font-bold uppercase tracking-[.4em] text-[#c9a45a]">Đếm ngược ngày trọng đại</h2><div className="grid grid-cols-2 gap-8 @md:grid-cols-4">{countdown.map((item) => <div key={item.label} className="flex flex-col items-center"><div className="relative grid h-24 w-24 place-items-center rounded-full border border-[#c9a45a]/50 @md:h-32 @md:w-32"><span className="absolute inset-2 rounded-full border border-dashed border-[#c9a45a]/20 animate-[spin_20s_linear_infinite]" /><span className="text-4xl font-light text-[#c9a45a] @md:text-5xl">{String(item.value).padStart(2, "0")}</span></div><span className="mt-6 text-xs uppercase tracking-[.3em] text-[#c9a45a]/80">{item.label}</span></div>)}</div></div></section>

      <StorySection accentColor="#c9a45a" theme={theme} />

      <ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor="#c9a45a" theme={theme} />

      <section id="events" className="royal-marble px-4 py-28">
        <div className="mx-auto max-w-5xl">
          <header className="mb-20 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[.35em] text-[#9c752e]">The royal programme</p>
            <h2 className="mt-3 text-4xl @md:text-5xl">Chương trình hôn lễ</h2>
            <div className="mx-auto mt-6 h-px w-24 bg-[#c9a45a]" />
          </header>
          <div className="grid gap-8 @md:grid-cols-2">
            {[{ title: "Lễ thành hôn", eventTime: time, index: "I" }, { title: "Tiệc cưới", eventTime: "18:00", index: "II" }].map((event) => (
              <article key={event.title} className="relative overflow-hidden border border-[#c9a45a] bg-[#fffdf8] p-10 text-center shadow-[0_24px_50px_rgba(53,23,30,.14)]">
                <span className="absolute right-7 top-4 text-7xl leading-none text-[#c9a45a]/10">{event.index}</span>
                <Crown className="mx-auto mb-5 h-5 w-5 text-[#c9a45a]" />
                <h3 className="text-3xl">{event.title}</h3>
                <p className="my-6 text-sm font-bold uppercase tracking-[.2em] text-[#9c752e]">{formattedDate} · {event.eventTime}</p>
                <p className="text-xl font-bold">{venue}</p>
                <p className="mt-2 font-sans text-sm text-neutral-500">{address}</p>
                <div className="mt-8 flex justify-center">
                  <CalendarAndMapButtons dateStr={date} timeStr={event.eventTime} venue={venue} address={address} accentColor="#c9a45a" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="royal-ink relative overflow-hidden px-4 py-32 text-[#fff8e9]"><div className="mx-auto max-w-6xl"><header className="mx-auto mb-16 max-w-xl text-center"><p className="text-[10px] font-semibold uppercase tracking-[.35em] text-[#c9a45a]">The private collection</p><h2 className="mt-3 text-5xl leading-none @md:text-6xl">Tủ ảnh Hoàng gia</h2><p className="mt-5 font-sans text-sm leading-6 text-[#f7e7cc]/65">Một bộ sưu tập chân dung được sắp đặt riêng cho ngày trọng đại.</p></header><div className="grid items-center gap-5 @md:grid-cols-[.75fr_1.25fr_.75fr]"><div className="grid gap-5 @md:translate-y-16">{images.slice(0, 2).map((image, index) => <button type="button" key={image} onClick={() => setGalleryIndex(index)} className="group relative aspect-[4/5] overflow-hidden border border-[#c9a45a]/40 text-left"><img src={image} alt={`Khoảnh khắc ${index + 1}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><span className="absolute bottom-4 left-4 text-[9px] font-bold uppercase tracking-[.25em]">Portrait 0{index + 1}</span></button>)}</div><button type="button" onClick={() => setGalleryIndex(2)} className="group relative aspect-[4/5] overflow-hidden border-[10px] border-[#eadbc4] bg-[#eadbc4] shadow-[0_30px_80px_rgba(0,0,0,.38)]"><img src={images[2] || images[0]} alt="Chân dung trung tâm" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><span className="absolute bottom-0 left-0 bg-[#2a1020]/85 px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[.3em] text-[#f7e7cc]">The sovereign portrait</span></button><div className="grid gap-5 @md:-translate-y-16">{images.slice(3, 5).map((image, index) => <button type="button" key={image} onClick={() => setGalleryIndex(index + 3)} className="group relative aspect-[4/5] overflow-hidden border border-[#c9a45a]/40 text-left"><img src={image} alt={`Khoảnh khắc ${index + 4}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><span className="absolute bottom-4 left-4 text-[9px] font-bold uppercase tracking-[.25em]">Moment 0{index + 4}</span></button>)}</div></div></div></section>

      <BankRegistrySection groomBank={groomBank} brideBank={brideBank} accentColor="#c9a45a" theme={theme} />

      <section className="border-y-4 border-[#c9a45a] bg-[#17090b] px-4 py-24 text-white"><div className="mx-auto max-w-3xl text-center"><h2 className="text-4xl text-[#c9a45a]">Trang phục dự tiệc</h2><p className="mb-12 mt-4 font-sans text-sm uppercase tracking-[.2em] text-white/70">Trang phục trang trọng</p><div className="flex flex-wrap justify-center gap-8">{["#2f513a", "#c9a45a", "#f8f2e9", "#752336"].map((color) => <span key={color} className="h-24 w-24 rounded-full border-4 border-[#c9a45a] shadow-[0_0_20px_rgba(201,164,90,.3)]" style={{ backgroundColor: color }} />)}</div></div></section>

      {rsvpEnabled && <RSVPSection accentColor="#c9a45a" theme={theme} />}

      {wishesEnabled && <section id="wishes" className="royal-marble px-4 py-32"><div className="mx-auto max-w-5xl"><header className="mb-16 text-center"><Crown className="mx-auto mb-5 h-7 w-7 text-[#c9a45a]" /><p className="text-[10px] font-semibold uppercase tracking-[.35em] text-[#9c752e]">Royal post</p><h2 className="mt-3 text-4xl @md:text-5xl">Sổ chúc phúc</h2></header><div className="grid gap-12 @md:grid-cols-[.8fr_1.2fr]"><form onSubmit={sendWish} className="h-fit bg-[#2a1020] p-8 text-[#fff8e9] shadow-xl"><p className="text-[10px] font-bold uppercase tracking-[.28em] text-[#c9a45a]">Write with honour</p><label className="mt-7 block text-xs font-bold uppercase tracking-[.16em]">Tên của bạn<input required value={wish.name} onChange={(event) => setWish({ ...wish, name: event.target.value })} className="mt-2 w-full border-b border-[#c9a45a]/45 bg-transparent py-3 text-base outline-none" placeholder="Tên quý khách" /></label><label className="mt-5 block text-xs font-bold uppercase tracking-[.16em]">Con dấu cảm xúc<div className="mt-3 flex gap-2">{["💌", "💍", "🥂", "✨"].map((emoji) => <button type="button" key={emoji} onClick={() => setWish({ ...wish, emoji })} className={`grid h-10 w-10 place-items-center border ${wish.emoji === emoji ? "border-[#c9a45a] bg-[#c9a45a]" : "border-[#c9a45a]/35"}`}>{emoji}</button>)}</div></label><label className="mt-5 block text-xs font-bold uppercase tracking-[.16em]">Lời chúc<textarea required rows={5} value={wish.message} onChange={(event) => setWish({ ...wish, message: event.target.value })} className="mt-2 w-full border border-[#c9a45a]/35 bg-transparent p-3 text-sm outline-none" placeholder="Gửi lời chúc phúc..." /></label><button disabled={wishSending} type="submit" className="mt-6 flex w-full items-center justify-center gap-2 bg-[#c9a45a] py-4 text-xs font-bold uppercase tracking-[.2em] text-[#2a1020] disabled:opacity-50"><Send className="h-4 w-4" />{wishSending ? "Đang gửi" : "Niêm phong lời chúc"}</button></form><div className="space-y-4">{wishes.slice(0, 6).map((item) => <article key={item.id} className="border-l-2 border-[#c9a45a] bg-[#fffdf8] p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-lg">{item.emoji} <span className="font-semibold">{item.name}</span></p><p className="mt-1 text-[10px] font-bold uppercase tracking-[.18em] text-[#9c752e]">{item.timestamp}</p></div><button type="button" onClick={() => handleLike(item.id)} className={`flex items-center gap-1 text-xs ${item.liked ? "text-[#9c752e]" : "text-neutral-400"}`}><Heart className={`h-4 w-4 ${item.liked ? "fill-current" : ""}`} />{item.likes}</button></div><p className="mt-4 font-sans text-sm leading-6 text-neutral-600">{item.message}</p></article>)}</div></div></div></section>}

      <section className="royal-marble px-4 py-24"><div className="mx-auto max-w-3xl"><header className="mb-12 text-center"><p className="text-[10px] font-semibold uppercase tracking-[.35em] text-[#9c752e]">The royal guide</p><h2 className="mt-3 text-4xl">Những câu hỏi thường gặp</h2></header><div className="space-y-3">{WEDDING_SEED_DATA.faqs.map((faq, index) => <article key={faq.q} className="border border-[#c9a45a]/45 bg-[#fffdf8]"><button type="button" onClick={() => setActiveFaq(activeFaq === index ? null : index)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"><span className="font-semibold">{faq.q}</span><ChevronDown className={`h-5 w-5 text-[#9c752e] transition ${activeFaq === index ? "rotate-180" : ""}`} /></button><AnimatePresence>{activeFaq === index && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-6 pb-5 font-sans text-sm leading-6 text-neutral-600">{faq.a}</motion.p>}</AnimatePresence></article>)}</div></div></section>

      <footer className="border-t-8 border-[#2a1020] bg-[#f3eee5] px-4 py-20 text-center"><Crown className="mx-auto mb-8 h-8 w-8 text-[#c9a45a]" /><h2 className="text-4xl">{groomName} &amp; {brideName}</h2><p className="mt-6 text-xs font-bold uppercase tracking-[.4em] text-[#9c752e]">{formattedDate}</p><p className="mt-12 font-sans text-[10px] uppercase tracking-[.2em] text-neutral-400">© 2026 Thiệp Cưới · Bộ sưu tập Hoàng Gia</p></footer>

      <AnimatePresence>{galleryIndex !== null && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-[#10060a]/95 p-5" onClick={() => setGalleryIndex(null)}><button type="button" className="absolute right-6 top-6 text-[#f7e7cc]" aria-label="Đóng ảnh"><X className="h-7 w-7" /></button><img src={images[galleryIndex] || images[0]} alt="Ảnh kỷ niệm phóng to" className="max-h-[88svh] max-w-full border-4 border-[#c9a45a] object-contain" onClick={(event) => event.stopPropagation()} /></motion.div>}</AnimatePresence>

    </motion.div>
  );
};
