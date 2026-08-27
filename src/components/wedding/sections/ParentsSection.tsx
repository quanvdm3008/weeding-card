import { motion } from "framer-motion";
import { Phone, Users, Crown } from "lucide-react";
import type { ParentInfo } from "@/data/seedData";
import type { WeddingTheme } from "@/data/themes";

type ParentsProps = {
  groomParents?: ParentInfo;
  brideParents?: ParentInfo;
  accentColor: string;
  images?: string[];
};

type ParentsVariantProps = Pick<ParentsProps, "groomParents" | "brideParents" | "accentColor">;

const MembersList = ({ value, accentColor, textClass = "" }: { value: ParentInfo; accentColor: string; textClass?: string }) => {
  const members = [
    { title: value.fatherTitle || "Grandfather", name: value.fatherName },
    { title: value.motherTitle || "Grandma", name: value.motherName },
  ].filter((member) => member.name?.trim());

  if (members.length === 0) return null;

  return (
    <div className="space-y-3 mt-4">
      {members.map((member) => (
        <p key={`${member.title}-${member.name}`} className={`flex flex-wrap items-baseline justify-center gap-x-2 font-serif leading-tight ${textClass}`}>
          <span className="text-sm font-medium uppercase opacity-60">{member.title}</span>
          <span className="text-2xl font-semibold sm:text-3xl" style={{ color: accentColor }}>{member.name}</span>
        </p>
      ))}
    </div>
  );
};

const ContactInfo = ({ value, className = "" }: { value: ParentInfo; className?: string }) => (
  <div className={`mt-5 opacity-70 ${className}`}>
    {value.address?.trim() && <p className="mx-auto max-w-sm font-sans text-xs leading-relaxed">{value.address}</p>}
    {value.phone?.trim() && (
      <a href={`tel:${value.phone.replace(/\s/g, "")}`} className="mt-3 inline-flex items-center gap-1.5 font-sans text-xs font-medium hover:opacity-100 transition-opacity">
        <Phone className="h-3.5 w-3.5" /> {value.phone}
      </a>
    )}
    {value.note?.trim() && <p className="mt-3 font-serif text-sm italic">{value.note}</p>}
  </div>
);

const ParentsRoyal = ({ groomParents, brideParents, accentColor }: ParentsProps) => (
  <section className="relative bg-[#17090b] px-4 py-32 text-white">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#c9a45a 2px, transparent 2px)", backgroundSize: "40px 40px" }} />
    <div className="relative z-10 mx-auto max-w-5xl">
      <header className="mb-20 text-center">
        <Crown className="mx-auto mb-5 h-8 w-8 text-[#c9a45a]" />
        <p className="text-[10px] font-semibold uppercase tracking-[.35em] text-[#f7e7cc]/55">Two houses, one promise</p>
        <h2 className="mt-3 text-4xl text-[#c9a45a] md:text-5xl">Gia đình hai bên</h2>
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        {[{ title: "Gia đình nhà trai", parents: groomParents }, { title: "Gia đình nhà gái", parents: brideParents }].map(({ title, parents }) => parents && (
          <article key={title} className="relative border border-[#c9a45a]/40 bg-white/[.035] p-10 text-center backdrop-blur-sm">
            <Crown className="mx-auto mb-5 h-4 w-4 text-[#c9a45a]" />
            <p className="text-[10px] font-semibold uppercase tracking-[.3em] text-[#c9a45a]">{title}</p>
            <h3 className="mt-5 text-2xl text-[#fff8e9]">{parents.fatherName || "Ông"}</h3>
            <p className="my-2 text-xs uppercase tracking-[.25em] text-white/45">&amp;</p>
            <h3 className="text-2xl text-[#fff8e9]">{parents.motherName || "Bà"}</h3>
            {parents.address && <p className="mt-6 font-sans text-sm text-white/55">{parents.address}</p>}
          </article>
        ))}
      </div>
    </div>
  </section>
);

const ParentsLuxury = ({ groomParents, brideParents }: ParentsProps) => (
  <div className="w-full max-w-5xl mx-auto border-y border-[#D5B36A]/10 bg-[#030303] py-16">
    <div className="text-center mb-12">
      <h2 className="font-display text-3xl font-light text-[#FFF5D6] mb-12">Song Thân</h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32">
        {[
          { data: groomParents, label: "Nhà Trai" },
          { data: brideParents, label: "Nhà Gái" }
        ].map(({ data, label }, idx) => data && (
          <div key={idx} className="relative group w-full max-w-sm mx-auto">
            <div className="absolute inset-[-10px] border-[0.5px] border-[#D5B36A]/20 pointer-events-none" />
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t border-l border-[#D5B36A]/40" />
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t border-r border-[#D5B36A]/40" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b border-l border-[#D5B36A]/40" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b border-r border-[#D5B36A]/40" />
            
            <div className="border border-[#D5B36A]/10 p-8 sm:px-12 sm:py-10 bg-gradient-to-b from-[#D5B36A]/5 to-transparent flex flex-col items-center">
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#D5B36A] mb-4">{data.familyLabel?.trim() || label}</span>
              <MembersList value={data} accentColor="#E5E5E5" />
              <ContactInfo value={data} className="!opacity-70 !text-[#E5E5E5]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

function SignatureParentDetails({ value, fallbackLabel, isAurora }: { value: ParentInfo; fallbackLabel: string; isAurora: boolean }) {
  const members = [
    [value.fatherTitle || "Ông", value.fatherName],
    [value.motherTitle || "Bà", value.motherName],
  ].filter(([, name]) => name?.trim());

  return (
    <div className={isAurora ? "border-t border-[#173D32]/25 py-8 md:py-10" : "grid border-t border-white/15 py-7 md:grid-cols-[150px_1fr] md:gap-8"}>
      <p className={`font-sans text-[10px] font-bold uppercase ${isAurora ? "text-[#436D60]" : "text-[#65E7FF]"}`}>{value.familyLabel?.trim() || fallbackLabel}</p>
      <div className={isAurora ? "mt-5 space-y-3" : "mt-5 space-y-3 md:mt-0"}>
        {members.map(([title, name]) => <p key={`${title}-${name}`} className={isAurora ? "text-2xl text-[#10251F] md:text-3xl" : "font-sans text-2xl font-black uppercase text-white md:text-3xl"}><span className={`mr-3 text-xs ${isAurora ? "text-[#436D60]" : "text-[#F14B5A]"}`}>{title}</span>{name}</p>)}
        {value.address?.trim() && <p className={`font-sans text-xs leading-6 ${isAurora ? "text-[#35574D]" : "text-white/48"}`}>{value.address}</p>}
        {value.phone?.trim() && <a href={`tel:${value.phone.replace(/\s/g, "")}`} className={`inline-flex items-center gap-2 font-sans text-xs font-semibold ${isAurora ? "text-[#2C8E72]" : "text-[#65E7FF]"}`}><Phone className="h-3.5 w-3.5" />{value.phone}</a>}
        {value.note?.trim() && <p className={`text-sm italic ${isAurora ? "text-[#436D60]" : "text-white/40"}`}>{value.note}</p>}
      </div>
    </div>
  );
}

const ParentsNeo = ({ groomParents, brideParents }: ParentsProps) => (
  <section id="parents" className="bg-black px-5 py-24 text-white md:px-10 md:py-28">
    <div className="mx-auto max-w-6xl">
      <div className="mb-12 grid gap-5 border-b-4 border-[#65E7FF] pb-7 md:grid-cols-[1fr_auto] md:items-end">
        <p className="font-sans text-[10px] font-bold uppercase text-[#F14B5A]">Family registry / verified</p>
        <h2 className="font-sans text-4xl font-black uppercase md:text-6xl">Origin records</h2>
      </div>
      <div>
        {groomParents && <SignatureParentDetails value={groomParents} fallbackLabel="Nhà Trai" isAurora={false} />}
        {brideParents && <SignatureParentDetails value={brideParents} fallbackLabel="Nhà Gái" isAurora={false} />}
      </div>
    </div>
  </section>
);

const ParentsAurora = ({ groomParents, brideParents }: ParentsProps) => (
  <section id="parents" className="bg-[#EAF2EF] px-5 py-24 text-[#10251F] md:px-10 md:py-28">
    <div className="mx-auto max-w-6xl">
      <div className="mb-12 grid gap-5 md:grid-cols-[.8fr_1.2fr] md:items-end">
        <p className="font-sans text-[10px] font-bold uppercase text-[#436D60]">Two homes / One journey</p>
        <h2 className="text-4xl font-light md:text-6xl">Information about two families</h2>
      </div>
      <div className="grid gap-x-14 md:grid-cols-2">
        {groomParents && <SignatureParentDetails value={groomParents} fallbackLabel="Nhà Trai" isAurora={true} />}
        {brideParents && <SignatureParentDetails value={brideParents} fallbackLabel="Nhà Gái" isAurora={true} />}
      </div>
    </div>
  </section>
);

const ParentsCoastal = ({ groomParents, brideParents, images = [] }: ParentsProps) => {
  const displayImages = images.length >= 2 ? images : ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000"];
  return (
    <div>
      <h2 className="text-center font-sans text-xs uppercase tracking-[0.4em] text-[#00838F] mb-16">The Families</h2>
      <div className="flex flex-col md:flex-row items-center gap-16 md:gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }}
          className="flex-1 flex flex-col items-center md:items-end text-center md:text-right"
        >
          <div className="w-64 h-64 md:w-80 md:h-80 bg-[#E0F7FA] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-4 border-white shadow-lg overflow-hidden mb-8 relative">
            <img src={displayImages[0] || ""} className="w-full h-[120%] object-cover absolute -top-[10%]" />
          </div>
          <h3 className="text-2xl font-light text-[#004D40] mb-2">{groomParents?.familyLabel || "Nhà Trai"}</h3>
          <p className="font-serif italic text-lg">{groomParents?.fatherName || "Ông"}</p>
          <p className="font-serif italic text-lg">{groomParents?.motherName || "Bà"}</p>
        </motion.div>

        <div className="w-8 h-8 text-[#00838F]/40 shrink-0 hidden md:flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }}
          className="flex-1 flex flex-col items-center md:items-start text-center md:text-left md:mt-32"
        >
          <div className="w-64 h-64 md:w-80 md:h-80 bg-[#E0F7FA] rounded-[50%_50%_30%_70%/60%_40%_70%_40%] border-4 border-white shadow-lg overflow-hidden mb-8 relative">
            <img src={displayImages[1] || displayImages[0]} className="w-full h-[120%] object-cover absolute -top-[10%]" />
          </div>
          <h3 className="text-2xl font-light text-[#004D40] mb-2">{brideParents?.familyLabel || "Nhà Gái"}</h3>
          <p className="font-serif italic text-lg">{brideParents?.fatherName || "Ông"}</p>
          <p className="font-serif italic text-lg">{brideParents?.motherName || "Bà"}</p>
        </motion.div>
      </div>
    </div>
  );
};

const ParentsEditorial = ({ groomParents, brideParents, accentColor }: ParentsVariantProps) => (
  <div className="w-full max-w-5xl mx-auto border-y-4 border-black bg-white text-black p-12 shadow-xl">
    <div className="text-center mb-12 border-b-2 border-black pb-8">
      <p className="font-sans text-[10px] font-black uppercase tracking-[0.2em] mb-4">Wedding Announcement</p>
      <h2 className="font-serif text-5xl font-black uppercase tracking-tighter">The Families</h2>
    </div>
    <div className="grid w-full grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
      {[
        { data: groomParents, label: "The Groom's Family" },
        { data: brideParents, label: "The Bride's Family" }
      ].map(({ data, label }, idx) => data && (
        <div key={idx} className={`p-8 ${idx === 0 ? "md:pr-12" : "md:pl-12"} text-center flex flex-col justify-center h-full`}>
          <p className="font-sans text-xs font-bold uppercase tracking-widest bg-black text-white py-1 px-3 inline-block mx-auto mb-6">{data.familyLabel?.trim() || label}</p>
          <MembersList value={data} accentColor="#000" textClass="!text-black" />
          <ContactInfo value={data} className="!opacity-100 font-medium" />
        </div>
      ))}
    </div>
  </div>
);

const ParentsVintage = ({ groomParents, brideParents, accentColor }: ParentsVariantProps) => (
  <div className="w-full max-w-4xl mx-auto text-[#5c4a3d]">
    <div className="text-center mb-16 relative">
      <div className="absolute top-1/2 left-0 right-0 h-px bg-[#8B6914]/20 -z-10" />
      <span className="bg-transparent px-6 font-serif text-3xl sm:text-5xl italic" style={{ color: accentColor }}>Hai Bên Gia Đình</span>
    </div>
    <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2 relative">
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-dashed border-l border-dashed border-[#8B6914]/30" />
      {[
        { data: groomParents, label: "Nhà Trai" },
        { data: brideParents, label: "Nhà Gái" }
      ].map(({ data, label }, idx) => data && (
        <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} className="text-center p-8 bg-white/40 rounded-sm shadow-sm border border-[#8B6914]/10 backdrop-blur-sm relative">
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#8B6914]/40" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#8B6914]/40" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#8B6914]/40" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#8B6914]/40" />
          
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 mb-6">{data.familyLabel?.trim() || label}</p>
          <MembersList value={data} accentColor={accentColor} />
          <ContactInfo value={data} />
        </motion.div>
      ))}
    </div>
  </div>
);

const ParentsGlass = ({ groomParents, brideParents, accentColor }: ParentsVariantProps) => (
  <div className="w-full max-w-5xl mx-auto">
    <div className="text-center mb-16">
      <Users className="w-8 h-8 mx-auto mb-4 opacity-50" style={{ color: accentColor }} />
      <h2 className="font-display text-4xl sm:text-5xl font-light text-white drop-shadow-md">Family</h2>
    </div>
    <div className="flex flex-col md:flex-row gap-8 justify-center">
      {[
        { data: groomParents, label: "Groom's Side" },
        { data: brideParents, label: "Bride's Side" }
      ].map(({ data, label }, idx) => data && (
        <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} className="flex-1 w-full max-w-md mx-auto p-10 text-center bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] text-white">
          <p className="font-sans text-[10px] uppercase tracking-widest text-white/70 mb-4">{data.familyLabel?.trim() || label}</p>
          <MembersList value={data} accentColor="#FFF" />
          <ContactInfo value={data} className="!opacity-80" />
        </motion.div>
      ))}
    </div>
  </div>
);

const ParentsMinimal = ({ groomParents, brideParents, accentColor }: ParentsVariantProps) => (
  <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
    <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] opacity-50 mb-12">Hai Họ</p>
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16">
      {[
        { data: groomParents, label: "Nhà Trai" },
        { data: brideParents, label: "Nhà Gái" }
      ].map(({ data, label }, idx) => data && (
        <motion.div key={idx} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.2, duration: 1 }} className="text-center">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] opacity-40 mb-6">{data.familyLabel?.trim() || label}</p>
          <MembersList value={data} accentColor={accentColor} />
          <ContactInfo value={data} className="opacity-50" />
        </motion.div>
      ))}
    </div>
  </div>
);

export default function ParentsSection({
  groomParents,
  brideParents,
  theme,
  accentColor,
  images = []
}: {
  groomParents?: ParentInfo;
  brideParents?: ParentInfo;
  theme: WeddingTheme;
  accentColor: string;
  images?: string[];
}) {
  if (!groomParents && !brideParents) return null;
  const variant = theme.id;

  let Content;
  switch (variant) {
    case "luxury":
      Content = <ParentsLuxury groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} />;
      break;
    case "royal":
      Content = <ParentsRoyal groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} />;
      break;
    case "cyberpunk_luxe":
      return <ParentsNeo groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} />;
    case "nordic_aurora":
      return <ParentsAurora groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} />;
    case "coastal":
      return <ParentsCoastal groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} images={images} />;
    case "magazine":
      Content = <ParentsEditorial groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} />;
      break;
    case "vintage":
    case "rustic":
      Content = <ParentsVintage groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} />;
      break;
    case "glass":
    case "cinematic":
      Content = <ParentsGlass groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} />;
      break;
    default:
      Content = <ParentsMinimal groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} />;
      break;
  }

  return (
    <section id="parents" className="relative z-10 w-full px-4 py-24">
      {Content}
    </section>
  );
}
