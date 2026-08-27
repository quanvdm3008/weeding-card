import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import couple1 from "@/assets/couple-1.jpg";
import couple2 from "@/assets/couple-2.jpg";
import couple3 from "@/assets/couple-3.jpg";
import coupleProposal from "@/assets/couple-proposal.jpg";
import ringsImg from "@/assets/rings.jpg";
import venueImg from "@/assets/venue.jpg";
import { GALLERY_ITEM_REVEAL_DURATION_SECONDS } from "@/lib/animationTiming";

const shots = [
  { src: couple1, span: "@md:col-span-2 @md:row-span-2", depth: -40, caption: "First morning" },
  { src: couple2, span: "", depth: 30, caption: "Late autumn sunshine" },
  { src: ringsImg, span: "", depth: -20, caption: "Promise" },
  { src: couple3, span: "@md:col-span-2", depth: 50, caption: "On the roads" },
  { src: coupleProposal, span: "@md:row-span-2", depth: -30, caption: "Proposal night" },
  { src: venueImg, span: "", depth: 20, caption: "Where we meet again" },
];

const ParallaxImg = ({
  src,
  span,
  depth,
  caption,
  i,
  accentColor,
}: {
  src: string;
  span: string;
  depth: number;
  caption: string;
  i: number;
  accentColor: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [depth, -depth]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1.12, 1.05]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: GALLERY_ITEM_REVEAL_DURATION_SECONDS, delay: Math.min(i * 0.08, 0.32), ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-3xl ${span} aspect-[3/4] @md:aspect-auto`}
      style={{ boxShadow: `0 30px 80px -30px ${accentColor}55` }}
    >
      <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
        <img src={src} alt={caption} className="w-full h-full object-cover" loading="lazy" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
      <div className="absolute bottom-5 left-5 right-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <div className="flex items-center gap-3">
          <span
            className="h-px flex-none w-8"
            style={{ background: accentColor }}
          />
          <span className="text-[11px] tracking-[0.3em] uppercase font-body text-white/80">
            Frame {String(i + 1).padStart(2, "0")}
          </span>
        </div>
        <p className="font-display text-xl @md:text-2xl text-white mt-1">{caption}</p>
      </div>
    </motion.div>
  );
};

const MagazineGallery = ({ accentColor }: { accentColor: string }) => {
  return (
    <section id="gallery" className="relative py-24 @sm:py-32 px-4 overflow-hidden">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="text-[11px] tracking-[0.4em] uppercase font-body" style={{ color: accentColor }}>
          Editorial · Album
        </span>
        <h2 className="font-display text-4xl @sm:text-5xl @md:text-6xl font-medium mt-3 text-foreground">
          Moment <span className="italic" style={{ color: accentColor }}>unforgettable</span>
        </h2>
        <p className="text-muted-foreground font-body mt-4 max-w-xl mx-auto">
          The editorial collection is like a magazine — each frame is its own chapter.
        </p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-2 @md:grid-cols-4 gap-4 @md:gap-5 @md:auto-rows-[220px]">
        {shots.map((s, i) => (
          <ParallaxImg key={i} {...s} i={i} accentColor={accentColor} />
        ))}
      </div>
    </section>
  );
};

export default MagazineGallery;
