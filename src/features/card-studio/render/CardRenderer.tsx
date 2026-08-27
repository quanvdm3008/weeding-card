import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type {
  CardAnimationSpec,
  CardComponent,
  CardDocument,
  CardLoopSpec,
  CardSection,
  DeviceKind,
} from "../schema/types";
import { CARD_DESIGN_WIDTH } from "../schema/types";
import { getCardComponentDefinition } from "../registry";
import { sectionBackgroundStyle } from "../canvas/sectionStyle";

interface Props {
  document: CardDocument;
  /** Public card slug — RSVP/guestbook widget needed to call API. Leave blank = preview mode. */
  slug?: string;
  /** Force device identification (for preview in Studio); Default measurement is width. */
  forceDevice?: DeviceKind;
  className?: string;
}

function deviceFromWidth(width: number): DeviceKind {
  if (width <= 640) return "mobile";
  if (width <= 1024) return "tablet";
  return "desktop";
}

/** Calculate state "deviated" (blur/shift in position/scale) + transition for an animation milestone — used for both entrance and exit because they have the same direction vocabulary (slide/zoom/rotate). */
function animOffset(spec: CardAnimationSpec) {
  if (spec.type === "none") return null;
  const initial: Record<string, number> = { opacity: 0 };
  switch (spec.type) {
    case "slide-up":
      initial.y = 48;
      break;
    case "slide-down":
      initial.y = -48;
      break;
    case "slide-left":
      initial.x = 48;
      break;
    case "slide-right":
      initial.x = -48;
      break;
    case "zoom-in":
      initial.scale = 0.8;
      break;
    case "zoom-out":
      initial.scale = 1.2;
      break;
    case "rotate-in":
      initial.rotate = -8;
      initial.scale = 0.95;
      break;
    case "bounce":
      initial.y = 48;
      break;
  }
  const transition =
    spec.easing === "spring" || spec.type === "bounce"
      ? { type: "spring" as const, bounce: spec.type === "bounce" ? 0.5 : 0.25, duration: spec.duration, delay: spec.delay }
      : {
          duration: spec.duration,
          delay: spec.delay,
          ease: (spec.easing === "ease-out" ? "easeOut" : spec.easing === "ease-in" ? "easeIn" : spec.easing === "linear" ? "linear" : "easeInOut") as
            | "easeOut"
            | "easeIn"
            | "linear"
            | "easeInOut",
        };
  return { initial, transition };
}

/** Infinite loop effect — animate props for motion.div wrapper. */
function loopProps(spec: CardLoopSpec) {
  if (spec.type === "none") return null;
  const t = { duration: Math.max(spec.duration, 4), repeat: Infinity, ease: "easeInOut" as const };
  switch (spec.type) {
    case "float":
      return { animate: { y: [0, -7, 0] }, transition: t };
    case "pulse":
      return { animate: { scale: [1, 1.025, 1] }, transition: t };
    case "heartbeat":
      return {
        animate: { scale: [1, 1.055, 1, 1.025, 1] },
        transition: { ...t, times: [0, 0.2, 0.4, 0.6, 1] },
      };
    case "sway":
      return { animate: { rotate: [-1.5, 1.5, -1.5] }, transition: t };
    case "spin":
      return { animate: { rotate: 360 }, transition: { duration: spec.duration, repeat: Infinity, ease: "linear" as const } };
    case "twinkle":
      return { animate: { opacity: [0.78, 1, 0.78] }, transition: { ...t, duration: Math.max(spec.duration, 5) } };
    case "depth-float":
      return {
        animate: { y: [0, -6, 0], scale: [1, 1.018, 1], rotateX: [0, 1.4, 0], rotateY: [-1.6, 1.6, -1.6] },
        transition: { ...t, duration: Math.max(spec.duration, 7) },
      };
    case "perspective-sway":
      return {
        animate: { rotateX: [-1.2, 1.2, -1.2], rotateY: [-2.2, 2.2, -2.2], scale: [1.01, 1.025, 1.01] },
        transition: { ...t, duration: Math.max(spec.duration, 8) },
      };
    default:
      return null;
  }
}

function RenderComponent({
  component,
  components,
  slug,
  device,
  scale,
}: {
  component: CardComponent;
  components: CardComponent[];
  slug?: string;
  device: DeviceKind;
  scale: number;
}) {
  const reduceMotion = useReducedMotion();

  const def = getCardComponentDefinition(component.type);
  if (!def || component.hidden || component.responsive.hiddenOn.includes(device)) return null;

  const children = components
    .filter((c) => c.parentId === component.id)
    .sort((a, b) => a.order - b.order);

  const boxStyle: CSSProperties = {
    position: "absolute",
    left: component.position.x,
    top: component.position.y,
    width: component.size.width,
    height: component.size.height,
  };
  const rotationStyle: CSSProperties = component.rotation
    ? { transform: `rotate(${component.rotation}deg)`, transformOrigin: "center center", width: "100%", height: "100%" }
    : { width: "100%", height: "100%" };

  const anim = animOffset(component.animation.entrance);
  const loop = reduceMotion ? null : loopProps(component.animation.loop);
  let inner = (
    <div style={rotationStyle}>
      <def.Renderer component={component} context={{ mode: "public", slug, scale }} />
      {children.map((child) => (
        <RenderComponent
          key={child.id}
          component={child}
          components={components}
          slug={slug}
          device={device}
          scale={scale}
        />
      ))}
    </div>
  );
  /* The loop class is separate from the entrance class so that the two transforms do not overwrite each other*/
  if (loop) {
    inner = (
      <motion.div
        style={{ width: "100%", height: "100%", transformStyle: "preserve-3d", perspective: 900 }}
        animate={loop.animate}
        transition={loop.transition}
      >
        {inner}
      </motion.div>
    );
  }

  const settledState = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 };

  if (!anim || reduceMotion) return <div style={boxStyle}>{inner}</div>;

  return (
    <motion.div
      style={boxStyle}
      initial={anim.initial}
      whileInView={settledState}
      viewport={{ once: true, amount: 0.05, margin: "120px 0px" }}
      transition={anim.transition}
    >
      {inner}
    </motion.div>
  );
}

function RenderSection({
  section,
  components,
  slug,
  device,
  scale,
}: {
  section: CardSection;
  components: CardComponent[];
  slug?: string;
  device: DeviceKind;
  scale: number;
}) {
  if (section.hiddenOn.includes(device)) return null;
  const children = components
    .filter((c) => c.parentId === section.id)
    .sort((a, b) => a.order - b.order);
  return (
    <section
      className="relative overflow-hidden"
      style={{ width: CARD_DESIGN_WIDTH, height: section.height, ...sectionBackgroundStyle(section.background) }}
    >
      {section.background.imageUrl && (
        <img
          src={section.background.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: section.background.imageOpacity }}
          loading="lazy"
        />
      )}
      {children.map((c) => (
        <RenderComponent key={c.id} component={c} components={components} slug={slug} device={device} scale={scale} />
      ))}
    </section>
  );
}

/**
 * Render CardDocument in public/preview mode: card scales evenly according to container width
 * (WYSIWYG with editor), section hidden by device, animation runs when scrolled.
 */
export function CardRenderer({ document: doc, slug, forceDevice, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0]?.contentRect.width ?? 0);
    });
    observer.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  const page = doc.pages[0];
  const device = forceDevice ?? deviceFromWidth(width || CARD_DESIGN_WIDTH);
  const sections = useMemo(
    () => [...page.sections].sort((a, b) => a.order - b.order).filter((s) => !s.hiddenOn.includes(device)),
    [page.sections, device]
  );

  const cardWidth = Math.min(width || CARD_DESIGN_WIDTH, CARD_DESIGN_WIDTH);
  const scale = cardWidth / CARD_DESIGN_WIDTH;
  const totalHeight = sections.reduce((sum, s) => sum + s.height, 0) * scale;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ background: doc.settings.outerBackground, minHeight: "100%" }}
    >
      <div className="mx-auto" style={{ width: cardWidth, height: totalHeight, overflow: "hidden" }}>
        <div style={{ width: CARD_DESIGN_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          {sections.map((s) => (
            <RenderSection
              key={s.id}
              section={s}
              components={page.components}
              slug={slug}
              device={device}
              scale={scale}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
