import { motion } from "framer-motion";
import { Heart, Calendar, MapPin, Clock, Music as MusicIcon } from "lucide-react";
import venueImg from "@/assets/venue.jpg";
import { WeddingTheme } from "@/data/themes";
import CalendarAndMapButtons from "./CalendarAndMapButtons";

interface EventInfo { icon: JSX.Element; title: string; date: string; time: string; venue: string; address: string }

const EventCard = ({ ev, accentColor, theme, variant = "default" }: { ev: EventInfo; accentColor: string; theme: WeddingTheme; variant?: "default" | "compact" | "row" }) => {
  if (variant === "row") {
    return (
      <div className={`flex items-center gap-5 bg-card/80 backdrop-blur-sm ${theme.cardRadius} p-5 border border-border shadow-md`}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accentColor + "20" }}>{ev.icon}</div>
        <div className="text-left flex-1">
          <h3 className="font-display text-lg font-bold text-foreground">{ev.title}</h3>
          <p className="text-muted-foreground font-body text-sm">{ev.date} · {ev.time} · {ev.venue}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`bg-card/80 backdrop-blur-sm ${theme.cardRadius} p-8 @md:p-10 shadow-xl border border-border text-center`}>
      <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor + "20" }}>{ev.icon}</div>
      <h3 className="font-display text-2xl font-bold text-foreground mb-4">{ev.title}</h3>
      <div className="space-y-3 text-muted-foreground font-body">
        <div className="flex items-center justify-center gap-2"><Calendar className="w-4 h-4" style={{ color: accentColor }} /><span>{ev.date}</span></div>
        <div className="flex items-center justify-center gap-2"><Clock className="w-4 h-4" style={{ color: accentColor }} /><span>{ev.time}</span></div>
        <div className="flex items-center justify-center gap-2"><MapPin className="w-4 h-4" style={{ color: accentColor }} /><span>{ev.venue}</span></div>
        <p className="text-sm pt-2">{ev.address}</p>
      </div>
    </div>
  );
};

const EventsSection = ({ date, time, venue, address, accentColor, theme }: { date: string; time: string; venue: string; address: string; accentColor: string; theme: WeddingTheme }) => {
  const d = date ? new Date(date) : null;
  const formattedDate = d && !isNaN(d.getTime()) ? d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "";
  const events: EventInfo[] = [
    { icon: <Heart className="w-7 h-7" style={{ color: accentColor }} />, title: "Marriage Ceremony", date: formattedDate, time, venue, address },
    { icon: <MusicIcon className="w-7 h-7" style={{ color: accentColor }} />, title: "Wedding Party", date: formattedDate, time: "18:00", venue, address: "Cocktails, dinner parties & dancing with the DJ" },
  ];

  const renderLayout = () => {
    switch (theme.styleVariant) {
      case "magazine":
        return (
          <div className="grid @sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {events.map((ev, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative flex bg-card border border-border shadow-lg overflow-hidden">
                <div className="flex flex-col items-center justify-center px-3 border-r-2 border-dashed" style={{ borderColor: `${accentColor}50`, backgroundColor: `${accentColor}10` }}>
                  {Array.from({ length: 6 }).map((_, d) => <span key={d} className="w-1.5 h-1.5 rounded-full my-1" style={{ backgroundColor: `${accentColor}50` }} />)}
                </div>
                <div className="p-6 flex-1">
                  <span className="font-body text-[10px] uppercase tracking-[0.3em]" style={{ color: accentColor }}>Admit Two</span>
                  <h3 className="font-display text-xl font-bold text-foreground mt-1">{ev.title}</h3>
                  <p className="text-muted-foreground font-body text-sm mt-2">{ev.date} · {ev.time}</p>
                  <p className="text-muted-foreground font-body text-xs mt-1">{ev.venue}</p>
                </div>
              </motion.div>
            ))}
          </div>
        );
      case "glass":
        return (
          <div className="grid @sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {events.map((ev, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-3xl border border-white/40 bg-white/15 backdrop-blur-xl shadow-xl p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>{ev.icon}</div>
                <h3 className="font-display text-lg font-bold text-foreground">{ev.title}</h3>
                <p className="text-muted-foreground font-body text-sm mt-2">{ev.date} · {ev.time}</p>
                <p className="text-muted-foreground font-body text-xs mt-1">{ev.venue}</p>
              </motion.div>
            ))}
          </div>
        );
      case "letter":
        return (
          <div className="grid @sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {events.map((ev, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/80 rounded-sm p-6 text-center" style={{ boxShadow: `0 10px 30px -12px ${accentColor}40` }}>
                <span className="font-display italic text-3xl" style={{ color: accentColor }}>{new Date(date).getDate() || "—"}</span>
                <h3 className="font-display text-lg font-bold text-foreground mt-1">{ev.title}</h3>
                <p className="text-muted-foreground font-body text-sm mt-2 italic">{ev.date} · {ev.time}</p>
                <p className="text-muted-foreground font-body text-xs mt-1">{ev.venue}</p>
              </motion.div>
            ))}
          </div>
        );
      case "minimal":
        return (
          <div className="max-w-xl mx-auto divide-y divide-border">
            {events.map((ev, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-center justify-between py-6">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{ev.title}</h3>
                  <p className="text-muted-foreground font-body text-xs mt-1">{ev.venue}</p>
                </div>
                <span className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">{ev.time}</span>
              </motion.div>
            ))}
          </div>
        );
      case "rustic":
        return (
          <div className="grid @sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {events.map((ev, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative p-6 text-center" style={{ border: `3px solid ${accentColor}50`, backgroundColor: "#F0E6D6", transform: `rotate(${i % 2 === 0 ? -1.5 : 1.5}deg)` }}>
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rotate-45 border-t-2" style={{ borderColor: `${accentColor}90` }} />
                <h3 className="font-display text-lg font-bold text-foreground">{ev.title}</h3>
                <p className="text-muted-foreground font-body text-sm mt-2">{ev.date} · {ev.time}</p>
                <p className="text-muted-foreground font-body text-xs mt-1">{ev.venue}</p>
              </motion.div>
            ))}
          </div>
        );
      case "cinematic":
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
            <EventCard ev={events[0]} accentColor={accentColor} theme={theme} />
            <div className="mt-4">
              <EventCard ev={events[1]} accentColor={accentColor} theme={theme} variant="row" />
            </div>
          </motion.div>
        );
      case "map":
        return (
          <div className="space-y-4">
            {events.map((ev, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <EventCard ev={ev} accentColor={accentColor} theme={theme} variant="row" />
              </motion.div>
            ))}
          </div>
        );
      case "vintage":
        return (
          <div className="relative">
            <div className="absolute left-4 @md:left-1/2 top-0 bottom-0 w-[2px]" style={{ backgroundColor: `${accentColor}40` }} />
            <div className="space-y-10">
              {events.map((ev, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                  className={`relative pl-12 @md:pl-0 @md:grid @md:grid-cols-2 @md:gap-10 ${i % 2 ? "@md:[&>*:first-child]:order-2" : ""}`}>
                  <div className="absolute left-2.5 @md:left-1/2 @md:-translate-x-1/2 top-6 w-3 h-3 rounded-full ring-4 ring-background z-10" style={{ backgroundColor: accentColor }} />
                  <EventCard ev={ev} accentColor={accentColor} theme={theme} />
                </motion.div>
              ))}
            </div>
          </div>
        );
      case "gallery":
        return (
          <div className="grid @md:grid-cols-2 gap-0 overflow-hidden shadow-2xl rounded-3xl border border-border">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative min-h-[300px]">
              <img src={venueImg} alt="Venue" loading="lazy" className="w-full h-full object-cover absolute inset-0" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accentColor}40, transparent)` }} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-card p-8 @md:p-10 space-y-6 flex flex-col justify-center">
              {events.map((ev, i) => <EventCard key={i} ev={ev} accentColor={accentColor} theme={theme} variant="row" />)}
            </motion.div>
          </div>
        );
      default:
        return (
          <div className="grid @md:grid-cols-2 gap-8">
            {events.map((ev, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <EventCard ev={ev} accentColor={accentColor} theme={theme} />
              </motion.div>
            ))}
          </div>
        );
    }
  };

  if (theme.id === "luxury") {
    return (
      <section id="events" className="py-32 bg-[#080808] w-full">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="font-display text-4xl sm:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#D5B36A] to-[#FCF6BA]">
              Sự Kiện
            </h2>
            <div className="flex items-center justify-center gap-4 mt-6">
              <span className="w-16 h-px bg-gradient-to-r from-transparent to-[#D5B36A]/50" />
              <div className="w-2 h-2 rotate-45 border border-[#D5B36A]" />
              <span className="w-16 h-px bg-gradient-to-l from-transparent to-[#D5B36A]/50" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 w-full">
            {events.map((event, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: idx * 0.2 }} className="relative group w-full">
                <div className="border border-[#D5B36A]/30 p-2 h-full bg-[#050505] w-full">
                  <div className="border-[0.5px] border-[#D5B36A]/20 p-10 sm:p-12 h-full text-center flex flex-col items-center justify-center relative overflow-hidden w-full">
                    <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#D5B36A]/40" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#D5B36A]/40" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#D5B36A]/40" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#D5B36A]/40" />
                    
                    <div className="w-8 h-8 text-[#D5B36A] mb-8 font-light flex items-center justify-center">{event.icon}</div>
                    
                    <h3 className="font-display text-3xl text-[#FFF5D6] mb-6">{event.title}</h3>
                    
                    <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#D5B36A] mb-8 border-b border-[#D5B36A]/20 pb-4 inline-block">
                      {event.date} <span className="mx-2">|</span> {event.time}
                    </p>
                    
                    <p className="font-serif text-lg text-white/90 mb-3">{event.venue}</p>
                    <p className="font-sans text-xs text-neutral-500 font-light leading-relaxed max-w-[200px]">{event.address}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 w-full flex justify-center">
            <CalendarAndMapButtons dateStr={date} timeStr={time} venue={venue} address={address} accentColor={accentColor} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src={venueImg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="relative max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-xs tracking-[0.4em] uppercase font-body" style={{ color: accentColor }}>Detail</span>
          <h2 className="font-display text-4xl @md:text-5xl font-bold text-foreground mt-3">Wedding Events</h2>
        </motion.div>
        
        {renderLayout()}

        {/* Smart Add to Calendar & Maps Direction */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <CalendarAndMapButtons
            dateStr={date}
            timeStr={time}
            venue={venue}
            address={address}
            accentColor={accentColor}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;
