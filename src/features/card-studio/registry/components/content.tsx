import { Clock, Link2, Minus, MousePointerClick, Type, ListOrdered } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { safeLinkUrl } from "@/lib/safeUrl";
import { registerCardComponent } from "../registry";
import type { CardComponentRendererProps } from "../types";
import { boxStyleFromCard, textStyleFromCard } from "../styleUtils";

/* ---------------------------------- Text ---------------------------------- */

function TextRenderer({ component }: CardComponentRendererProps) {
  const text = String(component.content.text ?? "");
  return (
    <div
      className="w-full h-full flex flex-col justify-center whitespace-pre-wrap break-words"
      style={{ ...boxStyleFromCard(component.style), ...textStyleFromCard(component.style) }}
    >
      {text}
    </div>
  );
}

registerCardComponent({
  type: "text",
  label: "Letter",
  icon: Type,
  category: "content",
  defaultSize: { width: 400, height: 80 },
  defaultContent: { text: "Double click to edit text" },
  defaultStyle: { fontSize: 28, fontFamily: "Playfair Display" },
  defaultName: "Letter",
  supportsTypography: true,
  inspector: [{ key: "text", label: "Content", type: "textarea" }],
  Renderer: TextRenderer,
});

/* --------------------------------- Button --------------------------------- */

function ButtonRenderer({ component, context }: CardComponentRendererProps) {
  const label = String(component.content.label ?? "Button");
  const href = safeLinkUrl(component.content.href);
  const inner = (
    <div
      className="w-full h-full flex items-center justify-center cursor-pointer select-none"
      style={{ ...boxStyleFromCard(component.style), ...textStyleFromCard(component.style) }}
    >
      {label}
    </div>
  );
  if (context.mode === "public" && href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="block w-full h-full">
        {inner}
      </a>
    );
  }
  return inner;
}

registerCardComponent({
  type: "button",
  label: "Button",
  icon: MousePointerClick,
  category: "content",
  defaultSize: { width: 220, height: 56 },
  defaultContent: { label: "See map", href: "" },
  defaultStyle: {
    background: "#E8B4B8",
    color: "#FFFFFF",
    radius: 28,
    fontSize: 16,
    fontWeight: 600,
  },
  defaultName: "Button",
  supportsTypography: true,
  inspector: [
    { key: "label", label: "Label", type: "text" },
    { key: "href", label: "Link on click", type: "url", placeholder: "https://..." },
  ],
  Renderer: ButtonRenderer,
});

/* --------------------------------- Divider --------------------------------- */

function DividerRenderer({ component }: CardComponentRendererProps) {
  const variant = String(component.content.variant ?? "line");
  const color = component.style.color;
  const thickness = Number(component.content.thickness ?? 2);
  return (
    <div className="w-full h-full flex items-center justify-center" style={boxStyleFromCard(component.style)}>
      {variant === "line" && <div className="w-full" style={{ height: thickness, background: color }} />}
      {variant === "dots" && (
        <div className="flex gap-3 items-center">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="rounded-full" style={{ width: thickness * 3, height: thickness * 3, background: color }} />
          ))}
        </div>
      )}
      {variant === "hearts" && (
        <div className="flex gap-4 items-center" style={{ color, fontSize: component.style.fontSize }}>
          <span className="w-16" style={{ height: 1, background: color }} />
          ♥
          <span className="w-16" style={{ height: 1, background: color }} />
        </div>
      )}
      {variant === "flourish" && (
        <svg viewBox="0 0 200 20" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <path
            d="M0 10 C40 0 60 20 100 10 C140 0 160 20 200 10"
            fill="none"
            stroke={color}
            strokeWidth={thickness}
          />
        </svg>
      )}
    </div>
  );
}

registerCardComponent({
  type: "divider",
  label: "Separation line",
  icon: Minus,
  category: "content",
  defaultSize: { width: 300, height: 32 },
  defaultContent: { variant: "hearts", thickness: 2 },
  defaultStyle: { color: "#E8B4B8" },
  defaultName: "Separation",
  inspector: [
    {
      key: "variant",
      label: "Type",
      type: "select",
      options: [
        { value: "line", label: "Straight line" },
        { value: "dots", label: "Round dot" },
        { value: "hearts", label: "Heart" },
        { value: "flourish", label: "Winding" },
      ],
    },
    { key: "thickness", label: "Thickness", type: "slider", min: 1, max: 10, step: 1 },
  ],
  Renderer: DividerRenderer,
});

/* -------------------------------- Countdown -------------------------------- */

function CountdownRenderer({ component }: CardComponentRendererProps) {
  const target = String(component.content.targetDate ?? "");
  const [date, time] = target.includes("T") ? target.split("T") : [target, "00:00"];
  const t = useCountdown(date || undefined, time || undefined);
  const showLabels = component.content.showLabels !== false;
  const cells = [
    { v: t.days, label: "Day" },
    { v: t.hours, label: "Hour" },
    { v: t.minutes, label: "Minute" },
    { v: t.seconds, label: "Second" },
  ];
  return (
    <div className="w-full h-full flex items-center justify-center gap-3" style={boxStyleFromCard(component.style)}>
      {cells.map((c) => (
        <div key={c.label} className="flex flex-col items-center justify-center flex-1 h-full">
          <span
            style={{
              ...textStyleFromCard(component.style),
              fontSize: component.style.fontSize * 1.6,
              fontWeight: 600,
              lineHeight: 1.1,
            }}
          >
            {String(c.v).padStart(2, "0")}
          </span>
          {showLabels && (
            <span style={{ ...textStyleFromCard(component.style), fontSize: component.style.fontSize * 0.55, opacity: 0.75 }}>
              {c.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

registerCardComponent({
  type: "countdown",
  label: "Countdown",
  icon: Clock,
  category: "content",
  defaultSize: { width: 480, height: 120 },
  defaultContent: { targetDate: "2027-02-14T17:30", showLabels: true },
  defaultStyle: { fontSize: 26, fontFamily: "Playfair Display", color: "#4A3F3C" },
  defaultName: "Countdown",
  supportsTypography: true,
  inspector: [
    { key: "targetDate", label: "Destination time", type: "datetime" },
    { key: "showLabels", label: "Show Date/Hour/Minute/Second label", type: "toggle" },
  ],
  Renderer: CountdownRenderer,
});

/* --------------------------------- Timeline -------------------------------- */

interface TimelineItem {
  time?: string;
  title?: string;
  description?: string;
}

function TimelineRenderer({ component }: CardComponentRendererProps) {
  const items = (component.content.items as TimelineItem[] | undefined) ?? [];
  const lineColor = String(component.content.lineColor ?? component.style.color);
  return (
    <div className="w-full h-full overflow-hidden" style={boxStyleFromCard(component.style)}>
      <div className="relative h-full pl-6" style={textStyleFromCard(component.style)}>
        <span className="absolute left-2 top-1 bottom-1 w-px" style={{ background: lineColor, opacity: 0.5 }} />
        <div className="flex flex-col gap-4 text-left">
          {items.map((item, i) => (
            <div key={i} className="relative">
              <span
                className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full"
                style={{ background: lineColor }}
              />
              <div style={{ fontSize: component.style.fontSize * 0.7, opacity: 0.7 }}>{item.time}</div>
              <div style={{ fontWeight: 600 }}>{item.title}</div>
              {item.description && (
                <div style={{ fontSize: component.style.fontSize * 0.8, opacity: 0.85 }}>{item.description}</div>
              )}
            </div>
          ))}
          {items.length === 0 && <div className="opacity-50">Add a timeline in Inspector →</div>}
        </div>
      </div>
    </div>
  );
}

registerCardComponent({
  type: "timeline",
  label: "timeline",
  icon: ListOrdered,
  category: "content",
  defaultSize: { width: 420, height: 320 },
  defaultContent: {
    items: [
      { time: "17:30", title: "Welcoming guests", description: "Welcome cocktail" },
      { time: "18:30", title: "Marriage Ceremony", description: "" },
      { time: "19:30", title: "Celebration Party", description: "" },
    ],
    lineColor: "",
  },
  defaultStyle: { fontSize: 18, textAlign: "left" },
  defaultName: "timeline",
  supportsTypography: true,
  inspector: [
    {
      key: "items",
      label: "Landmarks",
      type: "item-list",
      itemFields: [
        { key: "time", label: "time", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Describe", type: "text" },
      ],
    },
  ],
  Renderer: TimelineRenderer,
});

/* ------------------------------- Social links ------------------------------ */

interface SocialLink {
  platform?: string;
  url?: string;
}

const SOCIAL_GLYPH: Record<string, string> = {
  facebook: "f",
  instagram: "◎",
  tiktok: "♪",
  zalo: "Z",
  youtube: "▶",
};

function SocialRenderer({ component, context }: CardComponentRendererProps) {
  const links = (component.content.links as SocialLink[] | undefined) ?? [];
  const size = Math.min(component.size.height, 64);
  return (
    <div className="w-full h-full flex items-center justify-center gap-3" style={boxStyleFromCard(component.style)}>
      {links.map((link, i) => {
        const glyph = SOCIAL_GLYPH[String(link.platform ?? "").toLowerCase()] ?? "•";
        const circle = (
          <span
            className="rounded-full flex items-center justify-center font-semibold select-none"
            style={{
              width: size * 0.8,
              height: size * 0.8,
              border: `1.5px solid ${component.style.color}`,
              color: component.style.color,
              fontSize: size * 0.34,
            }}
          >
            {glyph}
          </span>
        );
        const href = safeLinkUrl(link.url);
        return context.mode === "public" && href ? (
          <a key={i} href={href} target="_blank" rel="noreferrer">
            {circle}
          </a>
        ) : (
          <span key={i}>{circle}</span>
        );
      })}
      {links.length === 0 && <span className="opacity-50 text-sm">Add link in Inspector →</span>}
    </div>
  );
}

registerCardComponent({
  type: "social",
  label: "Social network",
  icon: Link2,
  category: "content",
  defaultSize: { width: 260, height: 64 },
  defaultContent: {
    links: [
      { platform: "facebook", url: "" },
      { platform: "instagram", url: "" },
    ],
  },
  defaultStyle: { color: "#4A3F3C" },
  defaultName: "Social network",
  inspector: [
    {
      key: "links",
      label: "Link",
      type: "item-list",
      itemFields: [
        { key: "platform", label: "Platform (facebook/instagram/tiktok/zalo/youtube)", type: "text" },
        { key: "url", label: "URL", type: "text" },
      ],
    },
  ],
  Renderer: SocialRenderer,
});
