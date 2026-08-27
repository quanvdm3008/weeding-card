import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Film, Image as ImageIcon, Images, Music, QrCode, Frame as FrameIcon, Pause, Play } from "lucide-react";
import QRCodeLib from "qrcode";
import { GiftQrReveal } from "@/components/wedding/GiftQrReveal";
import { safeMediaUrl } from "@/lib/safeUrl";
import { registerCardComponent } from "../registry";
import type { CardComponentRendererProps } from "../types";
import { boxStyleFromCard, textStyleFromCard } from "../styleUtils";

const PHOTO_FILTERS: Record<string, string> = {
  none: "none",
  grayscale: "grayscale(1)",
  sepia: "sepia(0.7)",
  vintage: "sepia(0.35) contrast(1.05) saturate(0.85)",
  blur: "blur(2px)",
};

const PHOTO_MOTION_OPTIONS = [
  { value: "none", label: "Stand still" },
  { value: "ken-burns", label: "Cinematic zoom" },
  { value: "pan-left", label: "Pan to the left" },
  { value: "pan-right", label: "Pan to the right" },
  { value: "breathe", label: "Breathe lightly" },
  { value: "drift", label: "Soft drift" },
  { value: "tilt", label: "Delicate tilt" },
  { value: "depth-float", label: "3D hovering" },
  { value: "perspective-sway", label: "3D perspective" },
  { value: "reveal", label: "Open the screen" },
];

const PHOTO_OVERLAY_OPTIONS = [
  { value: "none", label: "Are not" },
  { value: "soft-glow", label: "Soft light" },
  { value: "gold-wash", label: "Golden light" },
  { value: "film", label: "Film grain" },
  { value: "glass-sheen", label: "Glass streaks of light" },
];

function photoMotionClass(component: CardComponentRendererProps["component"], mode: CardComponentRendererProps["context"]["mode"]): string {
  if (mode !== "public") return "";
  const motion = String(component.content.imageMotion ?? "none");
  return motion === "none" ? "" : `card-photo-motion-${motion}`;
}

function PhotoOverlay({ effect }: { effect: unknown }) {
  const value = String(effect ?? "none");
  if (value === "none") return null;
  return <span aria-hidden="true" className={`pointer-events-none absolute inset-0 card-photo-overlay-${value}`} />;
}

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted/60 text-muted-foreground border border-dashed border-border rounded-[inherit]">
      <ImageIcon className="w-6 h-6" />
      <span className="text-xs">{label}</span>
    </div>
  );
}

/* ---------------------------------- Image ---------------------------------- */

function ImageRenderer({ component, context }: CardComponentRendererProps) {
  const src = safeMediaUrl(component.content.src) ?? "";
  const filter = PHOTO_FILTERS[String(component.content.filter ?? "none")] ?? "none";
  const objectFit = (component.content.objectFit as "cover" | "contain") ?? "cover";
  return (
    <div className="w-full h-full overflow-hidden" style={boxStyleFromCard(component.style)}>
      {src ? (
        <div className="group/photo relative h-full w-full overflow-hidden rounded-[inherit]">
          <img
            src={src}
            alt={String(component.content.alt ?? "")}
            className={`h-full w-full pointer-events-none ${photoMotionClass(component, context.mode)}`}
            style={{ objectFit, filter, borderRadius: "inherit" }}
            draggable={false}
            loading="lazy"
          />
          <PhotoOverlay effect={component.content.imageOverlay} />
        </div>
      ) : (
        <ImagePlaceholder label="Select photo in Inspector →" />
      )}
    </div>
  );
}

registerCardComponent({
  type: "image",
  label: "Image",
  icon: ImageIcon,
  category: "Media",
  defaultSize: { width: 320, height: 400 },
  defaultContent: { src: "", alt: "", objectFit: "cover", filter: "none", imageMotion: "none", imageOverlay: "none" },
  defaultStyle: { radius: 12 },
  defaultName: "Image",
  preserveAspect: true,
  inspector: [
    { key: "src", label: "Image URL", type: "url", placeholder: "https://..." },
    { key: "alt", label: "Description (alt)", type: "text" },
    {
      key: "objectFit",
      label: "How to display",
      type: "select",
      options: [
        { value: "cover", label: "Cover the frame" },
        { value: "contain", label: "Fits in frame" },
      ],
    },
    {
      key: "filter",
      label: "Color filter",
      type: "select",
      options: [
        { value: "none", label: "Are not" },
        { value: "grayscale", label: "Black and white" },
        { value: "sepia", label: "Nostalgia (sepia)" },
        { value: "vintage", label: "vintage" },
        { value: "blur", label: "Slightly blurred" },
      ],
    },
    { key: "imageMotion", label: "Photo motion", type: "select", options: PHOTO_MOTION_OPTIONS },
    { key: "imageOverlay", label: "Light layer", type: "select", options: PHOTO_OVERLAY_OPTIONS },
  ],
  Renderer: ImageRenderer,
});

/* ---------------------------------- Frame ---------------------------------- */
/** Photos in decorative frames (wedding arch, round, polaroid...). */

function FrameRenderer({ component, context }: CardComponentRendererProps) {
  const src = safeMediaUrl(component.content.src) ?? "";
  const frame = String(component.content.frame ?? "arch");
  const borderColor = String(component.content.borderColor ?? "#E8B4B8");
  const borderWidth = Number(component.content.borderWidth ?? 4);

  const shapeRadius =
    frame === "circle" ? "50%" : frame === "arch" ? "50% 50% 12px 12px" : frame === "organic" ? "60% 40% 30% 70% / 60% 30% 70% 40%" : component.style.radius;

  if (frame === "polaroid") {
    return (
      <div
        className="w-full h-full flex flex-col bg-white"
        style={{ ...boxStyleFromCard(component.style), padding: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
      >
        <div className="group/photo relative flex-1 overflow-hidden bg-muted">
          {src ? (
            <>
              <img src={src} alt="" className={`h-full w-full object-cover pointer-events-none ${photoMotionClass(component, context.mode)}`} draggable={false} loading="lazy" />
              <PhotoOverlay effect={component.content.imageOverlay} />
            </>
          ) : (
            <ImagePlaceholder label="Select photo" />
          )}
        </div>
        <div className="h-[18%] min-h-6" />
      </div>
    );
  }

  return (
    <div
      className="w-full h-full overflow-hidden"
      style={{
        ...boxStyleFromCard(component.style),
        borderRadius: shapeRadius,
        border: `${borderWidth}px solid ${borderColor}`,
      }}
    >
      {src ? (
        <div className="group/photo relative h-full w-full overflow-hidden rounded-[inherit]">
          <img src={src} alt="" className={`h-full w-full object-cover pointer-events-none ${photoMotionClass(component, context.mode)}`} draggable={false} loading="lazy" />
          <PhotoOverlay effect={component.content.imageOverlay} />
        </div>
      ) : (
        <ImagePlaceholder label="Select photo" />
      )}
    </div>
  );
}

registerCardComponent({
  type: "frame",
  label: "Picture frame",
  icon: FrameIcon,
  category: "Media",
  defaultSize: { width: 300, height: 400 },
  defaultContent: { src: "", frame: "arch", borderColor: "#E8B4B8", borderWidth: 4, imageMotion: "none", imageOverlay: "none" },
  defaultName: "Picture frame",
  preserveAspect: true,
  inspector: [
    { key: "src", label: "Image URL", type: "url", placeholder: "https://..." },
    {
      key: "frame",
      label: "Frame type",
      type: "select",
      options: [
        { value: "arch", label: "Wedding arch" },
        { value: "circle", label: "Round" },
        { value: "polaroid", label: "polaroid" },
        { value: "organic", label: "Organic" },
        { value: "plain", label: "Simple border" },
      ],
    },
    { key: "borderColor", label: "Border color", type: "color" },
    { key: "borderWidth", label: "Border thickness", type: "slider", min: 0, max: 20, step: 1 },
    { key: "imageMotion", label: "Photo motion", type: "select", options: PHOTO_MOTION_OPTIONS },
    { key: "imageOverlay", label: "Light layer", type: "select", options: PHOTO_OVERLAY_OPTIONS },
  ],
  Renderer: FrameRenderer,
});

/* ---------------------------------- Video ---------------------------------- */

function toYouTubeEmbed(value: unknown): string | null {
  const raw = safeMediaUrl(value);
  if (!raw) return null;
  try {
    const url = new URL(raw, "https://wedding-card.invalid");
    const host = url.hostname.toLowerCase();
    const videoId = host === "youtu.be"
      ? url.pathname.slice(1).split("/")[0]
      : ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)
        ? url.searchParams.get("v")
        : null;
    return videoId && /^[\w-]{6,}$/.test(videoId) ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

function VideoRenderer({ component, context }: CardComponentRendererProps) {
  const rawSrc = String(component.content.src ?? "");
  const src = safeMediaUrl(rawSrc) ?? "";
  const youtube = toYouTubeEmbed(rawSrc);
  const boxStyle = boxStyleFromCard(component.style);

  if (!src) {
    return (
      <div className="w-full h-full" style={boxStyle}>
        <ImagePlaceholder label="Paste video URL (mp4/YouTube)" />
      </div>
    );
  }
  /* In the editor, do not embed the actual iframe/video (heavy + swallow mouse events) — just show the placeholder.*/
  if (context.mode === "editor") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-black/80 text-white" style={boxStyle}>
        <Film className="w-8 h-8" />
        <span className="text-xs opacity-80 px-3 truncate max-w-full">{src}</span>
      </div>
    );
  }
  if (youtube) {
    return (
      <iframe
        title="video"
        src={youtube}
        className="w-full h-full"
        style={boxStyle}
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-presentation"
        allowFullScreen
      />
    );
  }
  return (
    <video
      src={src}
      className="w-full h-full object-cover"
      style={boxStyle}
      controls={component.content.controls !== false}
      autoPlay={component.content.autoplay === true}
      loop={component.content.loop === true}
      muted={component.content.autoplay === true}
      playsInline
    />
  );
}

registerCardComponent({
  type: "video",
  label: "video",
  icon: Film,
  category: "Media",
  defaultSize: { width: 480, height: 270 },
  defaultContent: { src: "", autoplay: false, loop: false, controls: true },
  defaultStyle: { radius: 12 },
  defaultName: "video",
  inspector: [
    { key: "src", label: "Video URL (mp4 or YouTube)", type: "url" },
    { key: "autoplay", label: "Spontaneous (mute)", type: "toggle" },
    { key: "loop", label: "Repeat", type: "toggle" },
    { key: "controls", label: "Show control button", type: "toggle" },
  ],
  Renderer: VideoRenderer,
});

/* --------------------------------- Gallery --------------------------------- */

function GalleryRenderer({ component, context }: CardComponentRendererProps) {
  const images = ((component.content.images as string[] | undefined) ?? [])
    .map(safeMediaUrl)
    .filter((url): url is string => Boolean(url));
  const columns = Math.max(1, Math.min(4, Number(component.content.columns ?? 2)));
  const gap = Number(component.content.gap ?? 8);
  const layout = String(component.content.layout ?? "grid");

  const renderPhoto = (url: string, i: number, style?: CSSProperties) => (
    <div key={`${url}-${i}`} className="group/photo relative min-h-0 overflow-hidden" style={{ borderRadius: Math.max(0, component.style.radius - 4), ...style }}>
      <img
        src={url}
        alt=""
        className={`h-full w-full object-cover pointer-events-none ${photoMotionClass(component, context.mode)}`}
        style={{ animationDelay: `${i * 0.32}s` }}
        draggable={false}
        loading="lazy"
      />
      <PhotoOverlay effect={component.content.imageOverlay} />
    </div>
  );

  const renderLayout = () => {
    if (layout === "filmstrip") {
      return <div className="flex h-full w-full items-stretch overflow-hidden" style={{ gap }}>{images.map((url, i) => renderPhoto(url, i, { width: `${Math.max(34, 100 / Math.min(images.length, 3))}%`, flexShrink: 0 }))}</div>;
    }
    if (layout === "stack") {
      return (
        <div className="relative h-full w-full [perspective:900px]">
          {images.slice(0, 5).map((url, i) => {
            const offset = i - Math.min(images.length - 1, 4) / 2;
            return renderPhoto(url, i, {
              position: "absolute",
              left: `${18 + i * 8}%`,
              top: `${8 + Math.abs(offset) * 3}%`,
              width: "56%",
              height: "82%",
              transform: `rotate(${offset * 3.5}deg) translateZ(${i * 4}px)`,
              boxShadow: "0 18px 38px rgba(0,0,0,.2)",
              border: "5px solid rgba(255,255,255,.92)",
            });
          })}
        </div>
      );
    }
    if (layout === "featured") {
      return (
        <div className="grid h-full w-full" style={{ gridTemplateColumns: "1.35fr 1fr", gridTemplateRows: "repeat(2, minmax(0, 1fr))", gap }}>
          {images.slice(0, 3).map((url, i) => renderPhoto(url, i, i === 0 ? { gridRow: "1 / span 2" } : undefined))}
        </div>
      );
    }
    if (layout === "mosaic") {
      const placements: CSSProperties[] = [
        { gridColumn: "1", gridRow: "1 / span 4" },
        { gridColumn: "2", gridRow: "1 / span 3" },
        { gridColumn: "3", gridRow: "1 / span 2" },
        { gridColumn: "3", gridRow: "3 / span 4" },
        { gridColumn: "2", gridRow: "4 / span 3" },
      ];
      return <div className="grid h-full w-full grid-cols-3 grid-rows-6" style={{ gap }}>{images.slice(0, 5).map((url, i) => renderPhoto(url, i, placements[i]))}</div>;
    }
    return <div className="grid h-full w-full" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gap, gridAutoRows: "1fr" }}>{images.map((url, i) => renderPhoto(url, i))}</div>;
  };

  return (
    <div className="w-full h-full overflow-hidden" style={boxStyleFromCard(component.style)}>
      {images.length === 0 ? (
        <ImagePlaceholder label="Add photo in Inspector →" />
      ) : (
        renderLayout()
      )}
    </div>
  );
}

registerCardComponent({
  type: "gallery",
  label: "Photo collection",
  icon: Images,
  category: "Media",
  defaultSize: { width: 560, height: 420 },
  defaultContent: { images: [], layout: "grid", columns: 2, gap: 8, imageMotion: "none", imageOverlay: "none" },
  defaultStyle: { radius: 12 },
  defaultName: "Collection",
  inspector: [
    { key: "images", label: "List of photos", type: "image-list" },
    {
      key: "layout",
      label: "How to arrange photos",
      type: "select",
      options: [
        { value: "grid", label: "Even mesh" },
        { value: "featured", label: "One main photo" },
        { value: "mosaic", label: "Asymmetrical mosaic" },
        { value: "filmstrip", label: "Horizontal film strip" },
        { value: "stack", label: "Overlay 2.5D images" },
      ],
    },
    { key: "columns", label: "Number of columns", type: "slider", min: 1, max: 4, step: 1 },
    { key: "gap", label: "Distance", type: "slider", min: 0, max: 32, step: 2 },
    { key: "imageMotion", label: "Move each image", type: "select", options: PHOTO_MOTION_OPTIONS },
    { key: "imageOverlay", label: "Light layer", type: "select", options: PHOTO_OVERLAY_OPTIONS },
  ],
  Renderer: GalleryRenderer,
});

/* ---------------------------------- Music ---------------------------------- */

function MusicRenderer({ component, context }: CardComponentRendererProps) {
  const src = safeMediaUrl(component.content.src) ?? "";
  const title = String(component.content.title ?? "Background music");
  const [playing, setPlaying] = useState(false);
  const [noteBurst, setNoteBurst] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    if (context.mode !== "public" || !audioRef.current) return;
    if (playing) audioRef.current.pause();
    else void audioRef.current.play().catch(() => undefined);
    setPlaying(!playing);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-end gap-1 overflow-visible" style={{ ...boxStyleFromCard(component.style), ...textStyleFromCard(component.style) }}>
      {context.mode === "public" && src && <audio ref={audioRef} src={src} loop />}
      {noteBurst > 0 && (
        <span key={noteBurst} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-10 h-24 overflow-visible">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="card-music-note absolute bottom-0 grid h-5 w-5 place-items-center rounded-full bg-white/90 shadow"
              style={{ left: 8 + index * 18, color: component.style.color, animationDelay: `${index * 0.13}s` }}
            >
              <Music className="h-2.5 w-2.5" />
            </span>
          ))}
        </span>
      )}
      {component.content.releaseNotes !== false && (
        <button
          type="button"
          className="grid h-6 w-6 place-items-center rounded-full border bg-white/90 shadow-sm"
          style={{ color: component.style.color, borderColor: `${component.style.color}66` }}
          onClick={(event) => { event.stopPropagation(); if (context.mode === "public") setNoteBurst((value) => value + 1); }}
          aria-label="Let the musical notes fly"
          title="Release notes"
          tabIndex={context.mode === "public" ? 0 : -1}
        >
          <Music className="h-3 w-3" />
        </button>
      )}
      <button
        type="button"
        className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full border-2 bg-[#171717] shadow-lg"
        style={{ borderColor: `${component.style.color}99` }}
        onClick={(event) => { event.stopPropagation(); toggle(); }}
        aria-label={playing ? "Pause music" : "Play music"}
        tabIndex={context.mode === "public" ? 0 : -1}
      >
        <span className={`absolute inset-1 rounded-full ${playing ? "card-music-vinyl-playing" : ""}`} style={{ background: "repeating-radial-gradient(circle, #161616 0 3px, #303030 4px 5px)" }}>
          <i className="absolute inset-[31%] rounded-full" style={{ background: component.style.color }} />
          <i className="absolute inset-[46%] rounded-full bg-black/75" />
        </span>
        <span className="absolute inset-0 grid place-items-center text-white/80">
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
        </span>
      </button>
      {!src && context.mode === "editor" && <span className="absolute -bottom-5 whitespace-nowrap text-[9px] opacity-60">No music URL yet</span>}
      <span className="sr-only">{title}</span>
    </div>
  );
}

registerCardComponent({
  type: "music",
  label: "Background music",
  icon: Music,
  category: "Media",
  defaultSize: { width: 68, height: 92 },
  defaultContent: { src: "", title: "Our background music", releaseNotes: true },
  defaultStyle: { background: "transparent", radius: 34, shadow: { enabled: false, x: 0, y: 0, blur: 0, spread: 0, color: "transparent" } },
  defaultName: "Background music",
  inspector: [
    { key: "src", label: "Music file URL (mp3)", type: "url" },
    { key: "title", label: "Song name", type: "text" },
    { key: "releaseNotes", label: "Music note release button", type: "toggle" },
  ],
  Renderer: MusicRenderer,
});

/* --------------------------------- QR Code --------------------------------- */

function QrRenderer({ component, context }: CardComponentRendererProps) {
  const data = String(component.content.data ?? "");
  const imageUrl = String(component.content.imageUrl ?? "");
  const fg = String(component.content.fgColor ?? "#4A3F3C");
  const bg = String(component.content.bgColor ?? "#FFFFFF");
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    if (imageUrl) {
      setDataUrl(imageUrl);
      return;
    }
    if (!data) {
      setDataUrl("");
      return;
    }
    QRCodeLib.toDataURL(data, {
      width: 512,
      margin: 1,
      color: { dark: fg, light: bg },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl("");
      });
    return () => {
      cancelled = true;
    };
  }, [data, imageUrl, fg, bg]);

  const title = String(component.content.title ?? "Send a wedding gift");
  const buttonLabel = String(component.content.buttonLabel ?? "Open the gift bag");

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden" style={boxStyleFromCard(component.style)}>
      {dataUrl ? (
        <GiftQrReveal
          qrSrc={dataUrl}
          title={title}
          buttonLabel={buttonLabel}
          accentColor={fg}
          className="max-h-full max-w-full disabled:opacity-100"
          disabled={context.mode === "editor"}
        />
      ) : (
        <div className="flex flex-col items-center gap-1 text-muted-foreground">
          <QrCode className="w-6 h-6" />
          <span className="text-xs">Enter QR content →</span>
        </div>
      )}
    </div>
  );
}

registerCardComponent({
  type: "qrcode",
  label: "QR code",
  icon: QrCode,
  category: "Media",
  defaultSize: { width: 260, height: 92 },
  defaultContent: { data: "", imageUrl: "", fgColor: "#B78B4B", bgColor: "#FFFFFF", title: "Send a wedding gift", buttonLabel: "Open the gift bag" },
  defaultStyle: { radius: 8 },
  defaultName: "QR code",
  preserveAspect: true,
  inspector: [
    { key: "data", label: "Content (URL, account number...)", type: "textarea" },
    { key: "imageUrl", label: "QR image URL available", type: "url" },
    { key: "fgColor", label: "Color code", type: "color" },
    { key: "bgColor", label: "Background color", type: "color" },
    { key: "title", label: "Title when opened", type: "text" },
    { key: "buttonLabel", label: "Gift bag label", type: "text" },
  ],
  Renderer: QrRenderer,
});
