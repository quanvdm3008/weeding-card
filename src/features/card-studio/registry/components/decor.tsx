import { Flower2, Heart, Shapes, Smile, Sparkles, Layers, Wind } from "lucide-react";
import { motion } from "framer-motion";
import { registerCardComponent } from "../registry";
import type { CardComponentRendererProps } from "../types";
import { boxStyleFromCard } from "../styleUtils";

/* ---------------------------------- Shape ---------------------------------- */

function ShapeRenderer({ component }: CardComponentRendererProps) {
  const shape = String(component.content.shape ?? "rect");
  const fill = String(component.content.fill ?? component.style.background ?? "#E8B4B8") || "#E8B4B8";
  const stroke = String(component.content.stroke ?? "");
  const strokeWidth = Number(component.content.strokeWidth ?? 0);
  const box = boxStyleFromCard(component.style);

  if (shape === "rect") {
    return (
      <div
        className="w-full h-full"
        style={{ ...box, background: fill, border: strokeWidth ? `${strokeWidth}px solid ${stroke || fill}` : box.border }}
      />
    );
  }
  if (shape === "circle") {
    return (
      <div
        className="w-full h-full rounded-full"
        style={{ ...box, background: fill, border: strokeWidth ? `${strokeWidth}px solid ${stroke || fill}` : box.border }}
      />
    );
  }
  const svgProps = { fill, stroke: stroke || "none", strokeWidth };
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none" style={{ opacity: component.style.opacity }}>
      {shape === "triangle" && <polygon points="50,4 96,96 4,96" {...svgProps} />}
      {shape === "line" && <rect x="0" y="46" width="100" height="8" {...svgProps} />}
      {shape === "heart" && (
        <path
          d="M50 88 C20 64 4 46 4 30 C4 16 14 8 26 8 C36 8 44 14 50 24 C56 14 64 8 74 8 C86 8 96 16 96 30 C96 46 80 64 50 88 Z"
          {...svgProps}
        />
      )}
      {shape === "ring" && (
        <circle cx="50" cy="50" r="42" fill="none" stroke={stroke || fill} strokeWidth={strokeWidth || 6} />
      )}
    </svg>
  );
}

registerCardComponent({
  type: "shape",
  label: "Cubes",
  icon: Shapes,
  category: "decor",
  defaultSize: { width: 200, height: 200 },
  defaultContent: { shape: "rect", fill: "#F5E6E8", stroke: "", strokeWidth: 0 },
  defaultStyle: { radius: 16 },
  defaultName: "Cubes",
  inspector: [
    {
      key: "shape",
      label: "Image",
      type: "select",
      options: [
        { value: "rect", label: "Rectangular" },
        { value: "circle", label: "Round" },
        { value: "triangle", label: "Triangle" },
        { value: "line", label: "Thanh ngang" },
        { value: "heart", label: "Heart" },
        { value: "ring", label: "Ring ring" },
      ],
    },
    { key: "fill", label: "Background color", type: "color" },
    { key: "stroke", label: "Border color", type: "color" },
    { key: "strokeWidth", label: "Border thickness", type: "slider", min: 0, max: 20, step: 1 },
  ],
  Renderer: ShapeRenderer,
});

/* ----------------------------------- Icon ---------------------------------- */

const ICON_PATHS: Record<string, string> = {
  heart:
    "M50 88 C20 64 4 46 4 30 C4 16 14 8 26 8 C36 8 44 14 50 24 C56 14 64 8 74 8 C86 8 96 16 96 30 C96 46 80 64 50 88 Z",
  rings:
    "M35 62 a22 22 0 1 1 0.1 0 Z M65 62 a22 22 0 1 1 0.1 0 Z",
  dove: "M20 60 Q35 30 60 35 Q75 15 90 20 Q80 30 78 40 Q90 55 70 70 Q45 82 30 72 Q10 78 8 70 Q15 68 20 60 Z",
  bell: "M50 10 a8 8 0 0 1 8 8 c14 4 20 16 20 34 l6 14 H16 l6 -14 c0 -18 6 -30 20 -34 a8 8 0 0 1 8 -8 Z M42 74 a8 8 0 0 0 16 0 Z",
  star: "M50 6 L61 38 L95 38 L67 58 L78 92 L50 71 L22 92 L33 58 L5 38 L39 38 Z",
  glass:
    "M30 8 h40 l-4 30 a16 16 0 0 1 -12 14 v28 h12 v8 H34 v-8 h12 V52 a16 16 0 0 1 -12 -14 Z",
};

function IconRenderer({ component }: CardComponentRendererProps) {
  const icon = String(component.content.icon ?? "heart");
  const path = ICON_PATHS[icon] ?? ICON_PATHS.heart;
  return (
    <div className="w-full h-full" style={boxStyleFromCard(component.style)}>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <path d={path} fill={component.style.color} fillRule="evenodd" />
      </svg>
    </div>
  );
}

registerCardComponent({
  type: "icon",
  label: "Icon",
  icon: Heart,
  category: "decor",
  defaultSize: { width: 80, height: 80 },
  defaultContent: { icon: "heart" },
  defaultStyle: { color: "#E8B4B8" },
  defaultName: "Icon",
  preserveAspect: true,
  inspector: [
    {
      key: "icon",
      label: "Icon",
      type: "select",
      options: [
        { value: "heart", label: "Heart" },
        { value: "rings", label: "Couple rings" },
        { value: "dove", label: "Dove" },
        { value: "bell", label: "Wedding bells" },
        { value: "star", label: "Star" },
        { value: "glass", label: "Goblet" },
      ],
    },
  ],
  Renderer: IconRenderer,
});

/* --------------------------------- Sticker --------------------------------- */

function StickerRenderer({ component }: CardComponentRendererProps) {
  const emoji = String(component.content.emoji ?? "💐");
  const size = Math.min(component.size.width, component.size.height) * 0.82;
  return (
    <div
      className="w-full h-full flex items-center justify-center select-none leading-none"
      style={{ ...boxStyleFromCard(component.style), fontSize: size }}
    >
      {emoji}
    </div>
  );
}

registerCardComponent({
  type: "sticker",
  label: "Sticker",
  icon: Smile,
  category: "decor",
  defaultSize: { width: 96, height: 96 },
  defaultContent: { emoji: "💐" },
  defaultName: "Sticker",
  preserveAspect: true,
  inspector: [{ key: "emoji", label: "Emoji", type: "text", placeholder: "💐 🕊️ 💍 ✨" }],
  Renderer: StickerRenderer,
});

/* --------------------------------- Flowers --------------------------------- */
/** SVG decorative flower cluster — variant according to mood of available templates. */

function FlowerCluster({ tone }: { tone: string }) {
  return (
    <g>
      <circle cx="50" cy="42" r="14" fill={tone} opacity="0.9" />
      <circle cx="36" cy="52" r="11" fill={tone} opacity="0.7" />
      <circle cx="63" cy="53" r="11" fill={tone} opacity="0.7" />
      <circle cx="50" cy="42" r="5" fill="#FFF7ED" />
      <path d="M50 60 C48 76 44 84 36 92 M50 60 C54 76 58 84 66 92" stroke="#7C9070" strokeWidth="2.5" fill="none" />
      <ellipse cx="38" cy="80" rx="7" ry="3.5" fill="#7C9070" transform="rotate(-30 38 80)" />
      <ellipse cx="62" cy="80" rx="7" ry="3.5" fill="#7C9070" transform="rotate(30 62 80)" />
    </g>
  );
}

function FlowersRenderer({ component }: CardComponentRendererProps) {
  const variant = String(component.content.variant ?? "bouquet");
  const tone = String(component.content.tone ?? "#E8B4B8");
  return (
    <div className="w-full h-full" style={boxStyleFromCard(component.style)}>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {variant === "bouquet" && <FlowerCluster tone={tone} />}
        {variant === "corner" && (
          <g>
            <path d="M2 2 Q40 8 60 30 Q78 50 82 88" stroke="#7C9070" strokeWidth="2" fill="none" />
            {[
              [10, 8, 8],
              [30, 16, 7],
              [50, 28, 9],
              [66, 46, 7],
              [76, 66, 8],
            ].map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill={tone} opacity={0.85 - i * 0.08} />
            ))}
          </g>
        )}
        {variant === "garland" && (
          <g>
            <path d="M4 50 Q50 70 96 50" stroke="#7C9070" strokeWidth="2.5" fill="none" />
            {[12, 30, 50, 70, 88].map((x, i) => (
              <circle key={i} cx={x} cy={50 + Math.sin((i / 4) * Math.PI) * 12} r={i === 2 ? 9 : 6.5} fill={tone} opacity="0.85" />
            ))}
            {[21, 40, 60, 79].map((x, i) => (
              <ellipse key={i} cx={x} cy={54 + Math.sin(((i + 0.5) / 4) * Math.PI) * 11} rx="5" ry="2.5" fill="#7C9070" />
            ))}
          </g>
        )}
        {variant === "branch" && (
          <g>
            <path d="M8 92 Q30 60 50 50 Q75 38 92 10" stroke="#8C7A6B" strokeWidth="2.5" fill="none" />
            {[
              [30, 62],
              [46, 52],
              [62, 42],
              [76, 28],
            ].map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="5.5" fill={tone} opacity="0.9" />
                <circle cx={cx + 6} cy={cy - 6} r="3.5" fill={tone} opacity="0.6" />
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}

registerCardComponent({
  type: "flowers",
  label: "Decorative flowers",
  icon: Flower2,
  category: "decor",
  defaultSize: { width: 160, height: 160 },
  defaultContent: { variant: "corner", tone: "#E8B4B8" },
  defaultName: "Hoa",
  inspector: [
    {
      key: "variant",
      label: "Type",
      type: "select",
      options: [
        { value: "corner", label: "Climbing flower corner" },
        { value: "bouquet", label: "Bouquet" },
        { value: "garland", label: "Horizontal wreath" },
        { value: "branch", label: "Flower branches" },
      ],
    },
    { key: "tone", label: "Flower color", type: "color" },
  ],
  Renderer: FlowersRenderer,
});

/* -------------------------------- Decoration ------------------------------- */
/** Glittering particles/overlay pattern — ambient decorative element. */

function DecorationRenderer({ component }: CardComponentRendererProps) {
  const variant = String(component.content.variant ?? "sparkles");
  const tone = component.style.color;
  const seeds = Array.from({ length: 18 }, (_, i) => ({
    x: ((i * 37) % 97) + 1,
    y: ((i * 53) % 89) + 5,
    r: 0.8 + ((i * 7) % 5) * 0.5,
  }));
  return (
    <div className="w-full h-full pointer-events-none" style={boxStyleFromCard(component.style)}>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {seeds.map((s, i) =>
          variant === "sparkles" ? (
            <path
              key={i}
              d={`M${s.x} ${s.y - s.r * 2} L${s.x + s.r * 0.6} ${s.y} L${s.x} ${s.y + s.r * 2} L${s.x - s.r * 0.6} ${s.y} Z`}
              fill={tone}
              opacity={0.35 + (i % 4) * 0.15}
            />
          ) : variant === "dots" ? (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={tone} opacity={0.3 + (i % 4) * 0.12} />
          ) : (
            <path
              key={i}
              d={`M${s.x} ${s.y + s.r * 1.6} c-${s.r * 1.6} -${s.r * 1.3} -${s.r * 0.4} -${s.r * 2.8} 0 -${s.r * 1.2} c${s.r * 0.4} -${s.r * 1.6} ${s.r * 1.6} 0 0 ${s.r * 1.2} Z`}
              fill={tone}
              opacity={0.3 + (i % 4) * 0.12}
            />
          )
        )}
      </svg>
    </div>
  );
}

registerCardComponent({
  type: "decoration",
  label: "Background pattern",
  icon: Sparkles,
  category: "decor",
  defaultSize: { width: 400, height: 300 },
  defaultContent: { variant: "sparkles" },
  defaultStyle: { color: "#D4A853" },
  defaultName: "Pattern",
  inspector: [
    {
      key: "variant",
      label: "Type",
      type: "select",
      options: [
        { value: "sparkles", label: "Twinkle" },
        { value: "dots", label: "Polka dots" },
        { value: "petals", label: "Petal" },
      ],
    },
  ],
  Renderer: DecorationRenderer,
});

/* ------------------------------ Animated effects ---------------------------- */
/** Dynamic effect layer overlay section: falling petals / flying hearts / sparkles / snow / confetti.
 * Public: real flying particles (framer-motion, infinite loop). Editor: static display for easy operation. */

const EFFECT_GLYPHS: Record<string, string[]> = {
  petals: ["🌸", "❀", "✿", "🌸", "❀"],
  hearts: ["💕", "❤️", "🤍", "💗", "♥"],
  sparkles: ["✦", "✧", "✨", "·", "✦"],
  snow: ["❄", "❅", "❆", "·", "❄"],
  confetti: ["🎉", "🎊", "✦", "●", "▲"],
  galaxy: ["✦", "·", "✧", "◦", "✶"],
  pixels: ["■", "▪", "▫", "◆", "+"],
};

/** Index-stable pseudo-random generation — same document renders every time. */
function seeded(i: number, salt: number): number {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function EffectsRenderer({ component, context }: CardComponentRendererProps) {
  const effect = String(component.content.effect ?? "petals");
  const density = Math.max(4, Math.min(40, Number(component.content.density ?? 14)));
  const speed = Math.max(0.3, Math.min(3, Number(component.content.speed ?? 1)));
  const glyphs = EFFECT_GLYPHS[effect] ?? EFFECT_GLYPHS.petals;
  const size = Number(component.content.size ?? 18);

  const particles = Array.from({ length: density }, (_, i) => ({
    glyph: glyphs[i % glyphs.length],
    left: seeded(i, 1) * 96,
    delay: seeded(i, 2) * 6,
    duration: (6 + seeded(i, 3) * 6) / speed,
    drift: (seeded(i, 4) - 0.5) * 60,
    scale: 0.6 + seeded(i, 5) * 0.8,
    spin: seeded(i, 6) > 0.5 ? 360 : -360,
  }));

  if (context.mode === "editor") {
    return (
      <div className="w-full h-full relative overflow-hidden pointer-events-none" style={boxStyleFromCard(component.style)}>
        {particles.slice(0, Math.min(density, 12)).map((p, i) => (
          <span
            key={i}
            className="absolute select-none"
            style={{
              left: `${p.left}%`,
              top: `${(seeded(i, 7) * 85) + 5}%`,
              fontSize: size * p.scale,
              opacity: 0.55,
            }}
          >
            {p.glyph}
          </span>
        ))}
        <span className="absolute bottom-1 right-2 text-[10px] text-muted-foreground bg-card/80 rounded px-1.5 py-0.5 border border-border/60">
          Animation effect (runs on card page)
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden pointer-events-none" style={boxStyleFromCard(component.style)}>
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute select-none will-change-transform"
          style={{ left: `${p.left}%`, top: -size * 2, fontSize: size * p.scale }}
          animate={{
            y: [0, component.size.height + size * 3],
            x: [0, p.drift],
            rotate: effect === "sparkles" || effect === "hearts" ? 0 : p.spin,
            opacity: [0, 0.62, 0.62, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.16, 0.78, 1],
          }}
        >
          {p.glyph}
        </motion.span>
      ))}
    </div>
  );
}

registerCardComponent({
  type: "effects",
  label: "Dynamic effects",
  icon: Wind,
  category: "decor",
  defaultSize: { width: 800, height: 500 },
  defaultContent: { effect: "petals", density: 14, speed: 1, size: 18 },
  defaultName: "Dynamic effects",
  inspector: [
    {
      key: "effect",
      label: "Effect type",
      type: "select",
      options: [
        { value: "petals", label: "Falling petals" },
        { value: "hearts", label: "Tim bay" },
        { value: "sparkles", label: "Twinkle" },
        { value: "snow", label: "Snow" },
        { value: "confetti", label: "Confetti" },
        { value: "galaxy", label: "Universe" },
        { value: "pixel", label: "pixel" },
      ],
    },
    { key: "density", label: "Density", type: "slider", min: 4, max: 40, step: 1 },
    { key: "speed", label: "Speed", type: "slider", min: 0.3, max: 3, step: 0.1 },
    { key: "size", label: "Grain size", type: "slider", min: 10, max: 48, step: 1 },
  ],
  Renderer: EffectsRenderer,
});

/* ---------------------------------- Group ---------------------------------- */
/** Container for component group — does not render anything, its children recursively render on the canvas. */

function GroupRenderer({ component }: CardComponentRendererProps) {
  return <div className="w-full h-full" style={boxStyleFromCard(component.style)} />;
}

registerCardComponent({
  type: "group",
  label: "Group",
  icon: Layers,
  category: "decor",
  defaultSize: { width: 200, height: 200 },
  defaultContent: {},
  defaultName: "Group",
  inspector: [],
  Renderer: GroupRenderer,
});
