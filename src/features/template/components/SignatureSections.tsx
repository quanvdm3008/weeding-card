import { useState } from "react";
import { motion } from "framer-motion";
import { Clock3, Maximize2, Phone } from "lucide-react";
import { HorizontalScroll } from "@/components/ui/HorizontalScroll";
import UniversalLightbox from "@/components/galleries/UniversalLightbox";
import { SparklingImage } from "@/components/wedding/SparklingImage";
import type { ParentInfo, ScheduleEvent } from "@/data/seedData";
import { GALLERY_ITEM_REVEAL_DURATION_SECONDS } from "@/lib/animationTiming";

type SignatureVariant = "aurora" | "neo";

export function SignatureGallery({ variant, images, accentColor }: { variant: SignatureVariant; images: string[]; accentColor: string }) {
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const isAurora = variant === "aurora";

  return (
    <section id="gallery" className={isAurora ? "overflow-hidden bg-[#071712] py-24 text-white @md:py-32" : "overflow-hidden border-y border-[#65E7FF]/35 bg-[#050608] py-24 text-white @md:py-28"}>
      <div className={`mx-auto mb-10 grid max-w-7xl gap-5 px-5 @md:px-10 ${isAurora ? "@md:grid-cols-[.7fr_1.3fr] @md:items-end" : "@md:grid-cols-[1fr_auto] @md:items-end"}`}>
        <p className={`font-sans text-[10px] font-bold uppercase ${isAurora ? "text-[#72E6C1]" : "text-[#F14B5A]"}`}>{isAurora ? "Northern archive / panorama" : "Visual database / contact sheet"}</p>
        <div className={isAurora ? "" : "@md:text-right"}>
          <h2 className={`${isAurora ? "text-4xl font-light @md:text-6xl" : "font-sans text-4xl font-black uppercase @md:text-6xl"}`}>{isAurora ? "Memories" : "Memory index"}</h2>
          <p className="mt-3 font-sans text-xs text-white/45">{String(images.length).padStart(2, "0")} frames · auto sequence</p>
        </div>
      </div>

      <HorizontalScroll autoPlay spotlight={isAurora} edgeColor={isAurora ? "#071712" : "#050608"} className={isAurora ? "pb-4" : "border-y border-white/10 py-5"}>
        {images.map((image, index) => (
          <motion.button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveImage(index)}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: GALLERY_ITEM_REVEAL_DURATION_SECONDS, delay: Math.min(index * 0.1, 0.4), ease: [0.22, 1, 0.36, 1] }}
            className={isAurora
              ? "group relative h-[360px] w-[82cqw] max-w-[680px] overflow-hidden border border-[#72E6C1]/20 text-left @md:h-[520px] @md:w-[62cqw]"
              : `group relative h-[390px] w-[72cqw] max-w-[310px] overflow-hidden border border-white/20 bg-[#0A0D11] text-left @md:h-[480px] @md:w-[310px] ${index % 2 ? "@md:mt-10" : ""}`}
            aria-label={`Open the photo ${index + 1}`}
          >
            <SparklingImage src={image} accentColor={accentColor} alt={`Celebrate ${index + 1}`} className={`h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03] ${isAurora ? "saturate-[.86]" : "grayscale-[.2] contrast-[1.08]"}`} />
            <div className={isAurora ? "absolute inset-0 bg-gradient-to-t from-[#061713]/85 via-transparent to-transparent" : "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10"} />
            {isAurora ? (
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between border-t border-white/30 pt-3"><span className="font-sans text-[10px] font-semibold uppercase text-white/80">Light streak {String(index + 1).padStart(2, "0")}</span><Maximize2 className="h-4 w-4 text-[#72E6C1]" /></div>
            ) : (
              <><span className="absolute left-3 top-3 bg-[#65E7FF] px-2 py-1 font-sans text-[9px] font-black text-black">IMG/{String(index + 1).padStart(3, "0")}</span><div className="absolute inset-x-3 bottom-3 grid grid-cols-[1fr_auto] border-t border-white/35 pt-3 font-sans text-[9px] font-bold uppercase"><span>Neo archive</span><span className="text-[#F14B5A]">Open +</span></div></>
            )}
          </motion.button>
        ))}
      </HorizontalScroll>

      <UniversalLightbox images={images} currentIndex={activeImage} onClose={() => setActiveImage(null)} onNavigate={setActiveImage} />
    </section>
  );
}

function ParentDetails({ value, fallbackLabel, variant }: { value: ParentInfo; fallbackLabel: string; variant: SignatureVariant }) {
  const isAurora = variant === "aurora";
  const members = [
    [value.fatherTitle || "Grandfather", value.fatherName],
    [value.motherTitle || "Grandma", value.motherName],
  ].filter(([, name]) => name?.trim());

  return (
    <div className={isAurora ? "border-t border-[#173D32]/25 py-8 @md:py-10" : "grid border-t border-white/15 py-7 @md:grid-cols-[150px_1fr] @md:gap-8"}>
      <p className={`font-sans text-[10px] font-bold uppercase ${isAurora ? "text-[#436D60]" : "text-[#65E7FF]"}`}>{value.familyLabel?.trim() || fallbackLabel}</p>
      <div className={isAurora ? "mt-5 space-y-3" : "mt-5 space-y-3 @md:mt-0"}>
        {members.map(([title, name]) => <p key={`${title}-${name}`} className={isAurora ? "text-2xl text-[#10251F] @md:text-3xl" : "font-sans text-2xl font-black uppercase text-white @md:text-3xl"}><span className={`mr-3 text-xs ${isAurora ? "text-[#436D60]" : "text-[#F14B5A]"}`}>{title}</span>{name}</p>)}
        {value.address?.trim() && <p className={`font-sans text-xs leading-6 ${isAurora ? "text-[#35574D]" : "text-white/48"}`}>{value.address}</p>}
        {value.phone?.trim() && <a href={`tel:${value.phone.replace(/\s/g, "")}`} className={`inline-flex items-center gap-2 font-sans text-xs font-semibold ${isAurora ? "text-[#2C8E72]" : "text-[#65E7FF]"}`}><Phone className="h-3.5 w-3.5" />{value.phone}</a>}
        {value.note?.trim() && <p className={`text-sm italic ${isAurora ? "text-[#436D60]" : "text-white/40"}`}>{value.note}</p>}
      </div>
    </div>
  );
}

export function SignatureFamilies({ variant, groomParents, brideParents }: { variant: SignatureVariant; groomParents?: ParentInfo; brideParents?: ParentInfo }) {
  if (!groomParents && !brideParents) return null;
  const isAurora = variant === "aurora";
  return (
    <section id="parents" className={isAurora ? "bg-[#EAF2EF] px-5 py-24 text-[#10251F] @md:px-10 @md:py-28" : "bg-black px-5 py-24 text-white @md:px-10 @md:py-28"}>
      <div className="mx-auto max-w-6xl">
        <div className={`mb-12 grid gap-5 ${isAurora ? "@md:grid-cols-[.8fr_1.2fr] @md:items-end" : "border-b-4 border-[#65E7FF] pb-7 @md:grid-cols-[1fr_auto] @md:items-end"}`}>
          <p className={`font-sans text-[10px] font-bold uppercase ${isAurora ? "text-[#436D60]" : "text-[#F14B5A]"}`}>{isAurora ? "Two homes / One journey" : "Family registry / verified"}</p>
          <h2 className={isAurora ? "text-4xl font-light @md:text-6xl" : "font-sans text-4xl font-black uppercase @md:text-6xl"}>{isAurora ? "Information about two families" : "Origin records"}</h2>
        </div>
        <div className={isAurora ? "grid gap-x-14 @md:grid-cols-2" : ""}>
          {groomParents && <ParentDetails value={groomParents} fallbackLabel="The groom's family" variant={variant} />}
          {brideParents && <ParentDetails value={brideParents} fallbackLabel="Girl's house" variant={variant} />}
        </div>
      </div>
    </section>
  );
}

export function SignatureTimeline({ variant, schedule }: { variant: SignatureVariant; schedule?: ScheduleEvent[] }) {
  if (!schedule?.length) return null;
  const isAurora = variant === "aurora";
  return (
    <section className={isAurora ? "bg-[#0A211A] px-5 py-24 text-white @md:px-10 @md:py-28" : "bg-[#0A0D11] px-5 py-24 text-white @md:px-10 @md:py-28"}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between gap-6"><div><p className={`font-sans text-[10px] font-bold uppercase ${isAurora ? "text-[#72E6C1]" : "text-[#F14B5A]"}`}>{isAurora ? "Happy days" : "Runtime schedule"}</p><h2 className={isAurora ? "mt-3 text-4xl font-light @md:text-6xl" : "mt-3 font-sans text-4xl font-black uppercase @md:text-6xl"}>{isAurora ? "Schedule" : "Execution log"}</h2></div><Clock3 className={`h-8 w-8 ${isAurora ? "text-[#72E6C1]" : "text-[#65E7FF]"}`} /></div>
        <div className={isAurora ? "grid border-l border-t border-white/15 @md:grid-cols-3" : "border-t-2 border-[#65E7FF]"}>
          {schedule.map((event, index) => (
            <motion.article key={`${event.time}-${index}`} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: index * 0.1 }} className={isAurora ? "min-h-56 border-b border-r border-white/15 p-6" : "grid gap-4 border-b border-white/15 py-6 @md:grid-cols-[90px_180px_1fr] @md:items-baseline"}>
              {isAurora ? <><p className="text-4xl font-light text-[#72E6C1]">{event.time}</p><p className="mt-7 font-sans text-[9px] font-bold uppercase text-white/35">Stop {String(index + 1).padStart(2, "0")}</p><h3 className="mt-2 text-2xl">{event.title}</h3>{event.description && <p className="mt-4 font-sans text-sm leading-6 text-white/48">{event.description}</p>}</> : <><span className="font-sans text-[10px] font-black text-[#F14B5A]">0{index + 1}</span><span className="font-sans text-3xl font-black text-[#65E7FF]">{event.time}</span><div><h3 className="font-sans text-xl font-black uppercase">{event.title}</h3>{event.description && <p className="mt-2 font-sans text-sm leading-6 text-white/45">{event.description}</p>}</div></>}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
