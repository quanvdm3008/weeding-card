import { useMemo } from "react";
import { Group, ImagePlus, Lock, LockOpen, Ungroup } from "lucide-react";
import type { CardComponent } from "../schema/types";
import { useEditorStore } from "../store/editorStore";
import { useInteractionStore } from "../store/interactionStore";
import * as ops from "../store/documentOps";
import { getCardComponentDefinition, type InspectorField } from "../registry";
import { CARD_FONT_OPTIONS } from "../registry/styleUtils";
import {
  ColorField,
  FieldRow,
  ImageListField,
  InspectorGroup,
  ItemListField,
  NumberField,
  SelectField,
  SliderField,
  TextField,
  TextareaField,
  ToggleField,
} from "./fields";

const ANIMATION_OPTIONS = [
  { value: "none", label: "Are not" },
  { value: "fade", label: "Fade in" },
  { value: "slide-up", label: "Slide up" },
  { value: "slide-down", label: "Slide down" },
  { value: "slide-left", label: "Slide left" },
  { value: "slide-right", label: "Slide right" },
  { value: "zoom-in", label: "Zoom in" },
  { value: "zoom-out", label: "Zoom out" },
  { value: "rotate-in", label: "Turn in" },
  { value: "bounce", label: "Bouncing" },
];

const LOOP_OPTIONS = [
  { value: "none", label: "Are not" },
  { value: "float", label: "Floating" },
  { value: "pulse", label: "Slight swelling" },
  { value: "heartbeat", label: "Heart rate" },
  { value: "sway", label: "Swing" },
  { value: "spin", label: "Spin around" },
  { value: "twinkle", label: "Twinkle" },
  { value: "depth-float", label: "3D depth" },
  { value: "perspective-sway", label: "Tilted perspective" },
];

const DEVICE_LABELS: { key: "desktop" | "tablet" | "mobile"; label: string }[] = [
  { key: "desktop", label: "Desktop" },
  { key: "tablet", label: "Tablet" },
  { key: "mobile", label: "mobile" },
];

/** Right panel: adjust the currently selected component/section/document properties. */
export function InspectorPanel() {
  const documentState = useEditorStore((s) => s.document);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const activeSectionId = useEditorStore((s) => s.activeSectionId);

  const selected = useMemo(
    () =>
      selectedIds
        .map((id) => ops.findComponent(documentState, id))
        .filter((c): c is CardComponent => !!c),
    [documentState, selectedIds]
  );

  if (selected.length === 1) return <ComponentInspector component={selected[0]} />;
  if (selected.length > 1) return <MultiInspector components={selected} />;
  return <SectionAndDocumentInspector activeSectionId={activeSectionId} />;
}

/* ------------------------------ 1 component ------------------------------ */

function ComponentInspector({ component }: { component: CardComponent }) {
  const store = useEditorStore.getState();
  const def = getCardComponentDefinition(component.type);

  const patch = (mutator: (c: CardComponent) => void) => store.updateSelected(mutator);
  const patchStyle = <K extends keyof CardComponent["style"]>(key: K, value: CardComponent["style"][K]) =>
    patch((c) => {
      c.style = { ...c.style, [key]: value };
    });
  const patchContent = (key: string, value: unknown) =>
    patch((c) => {
      c.content = { ...c.content, [key]: value };
    });

  /* Slider applies directly to the canvas while dragging (transient — entire dragging sequence = 1 undo step) */
  const previewPatch = (mutator: (c: CardComponent) => void) => {
    const s = useEditorStore.getState();
    s.beginTransient();
    s.updateTransient((doc) => ops.updateComponents(doc, [component.id], mutator));
  };
  const commitPatch = (mutator: (c: CardComponent) => void) => {
    const s = useEditorStore.getState();
    s.beginTransient();
    s.updateTransient((doc) => ops.updateComponents(doc, [component.id], mutator));
    s.commitTransient();
  };
  const previewStyle = <K extends keyof CardComponent["style"]>(key: K, value: CardComponent["style"][K]) =>
    previewPatch((c) => {
      c.style = { ...c.style, [key]: value };
    });
  const commitStyle = <K extends keyof CardComponent["style"]>(key: K, value: CardComponent["style"][K]) =>
    commitPatch((c) => {
      c.style = { ...c.style, [key]: value };
    });
  const previewContent = (key: string, value: unknown) =>
    previewPatch((c) => {
      c.content = { ...c.content, [key]: value };
    });
  const commitContent = (key: string, value: unknown) =>
    commitPatch((c) => {
      c.content = { ...c.content, [key]: value };
    });

  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <TextField value={component.name} onCommit={(v) => patch((c) => (c.name = v))} />
        </div>
        <button
          className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground"
          onClick={() => patch((c) => (c.locked = !c.locked))}
          title={component.locked ? "Unlock" : "Lock"}
        >
          {component.locked ? <Lock className="w-4 h-4" /> : <LockOpen className="w-4 h-4" />}
        </button>
      </div>

      {def && def.inspector.length > 0 && (
        <InspectorGroup title="Content">
          {def.inspector.map((field) => (
            <FieldRow key={field.key} label={field.label}>
              {renderContentField(field, component, commitContent, previewContent)}
            </FieldRow>
          ))}
          <ImageContentActions component={component} patchContent={patchContent} />
        </InspectorGroup>
      )}

      <InspectorGroup title="Location & size">
        <div className="grid grid-cols-2 gap-2">
          <FieldRow label="X">
            <NumberField value={component.position.x} onCommit={(v) => patch((c) => (c.position = { ...c.position, x: v }))} />
          </FieldRow>
          <FieldRow label="Y">
            <NumberField value={component.position.y} onCommit={(v) => patch((c) => (c.position = { ...c.position, y: v }))} />
          </FieldRow>
          <FieldRow label="Wide">
            <NumberField value={component.size.width} min={16} onCommit={(v) => patch((c) => (c.size = { ...c.size, width: Math.max(16, v) }))} />
          </FieldRow>
          <FieldRow label="Cao">
            <NumberField value={component.size.height} min={16} onCommit={(v) => patch((c) => (c.size = { ...c.size, height: Math.max(16, v) }))} />
          </FieldRow>
        </div>
        <FieldRow label={`Xoay (${component.rotation}°)`}>
          <SliderField
            value={component.rotation}
            min={0}
            max={359}
            onPreview={(v) => previewPatch((c) => (c.rotation = v))}
            onCommit={(v) => commitPatch((c) => (c.rotation = v))}
          />
        </FieldRow>
      </InspectorGroup>

      <InspectorGroup title="Style">
        <FieldRow label="Opacity">
          <SliderField
            value={Math.round(component.style.opacity * 100)}
            min={0}
            max={100}
            onPreview={(v) => previewStyle("opacity", v / 100)}
            onCommit={(v) => commitStyle("opacity", v / 100)}
          />
        </FieldRow>
        {/* Arch, circle, and polaroid frames define their own radius, so hide this ineffective field. */}
        {!(component.type === "frame" && component.content.frame !== "plain") && (
          <FieldRow label="Rounded corners">
            <SliderField
              value={component.style.radius}
              min={0}
              max={200}
              onPreview={(v) => previewStyle("radius", v)}
              onCommit={(v) => commitStyle("radius", v)}
            />
          </FieldRow>
        )}
        <FieldRow label="Padding">
          <SliderField
            value={component.style.padding}
            min={0}
            max={80}
            onPreview={(v) => previewStyle("padding", v)}
            onCommit={(v) => commitStyle("padding", v)}
          />
        </FieldRow>
        <FieldRow label="Background color">
          <ColorField value={component.style.background} onCommit={(v) => patchStyle("background", v)} />
        </FieldRow>
        <ToggleField
          label="Gradient background"
          value={component.style.gradient.enabled}
          onCommit={(v) => patchStyle("gradient", { ...component.style.gradient, enabled: v })}
        />
        {component.style.gradient.enabled && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <FieldRow label="From color">
                <ColorField
                  value={component.style.gradient.from}
                  onCommit={(v) => patchStyle("gradient", { ...component.style.gradient, from: v })}
                />
              </FieldRow>
              <FieldRow label="Come color">
                <ColorField
                  value={component.style.gradient.to}
                  onCommit={(v) => patchStyle("gradient", { ...component.style.gradient, to: v })}
                />
              </FieldRow>
            </div>
            <FieldRow label={`Direction (${component.style.gradient.angle}°)`}>
              <SliderField
                value={component.style.gradient.angle}
                min={0}
                max={359}
                onPreview={(v) => previewStyle("gradient", { ...component.style.gradient, angle: v })}
                onCommit={(v) => commitStyle("gradient", { ...component.style.gradient, angle: v })}
              />
            </FieldRow>
          </>
        )}
        <ToggleField
          label="Rim"
          value={component.style.border.enabled}
          onCommit={(v) => patchStyle("border", { ...component.style.border, enabled: v })}
        />
        {component.style.border.enabled && (
          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Thickness">
              <NumberField
                value={component.style.border.width}
                min={0}
                onCommit={(v) => patchStyle("border", { ...component.style.border, width: v })}
              />
            </FieldRow>
            <FieldRow label="Border color">
              <ColorField
                value={component.style.border.color}
                onCommit={(v) => patchStyle("border", { ...component.style.border, color: v })}
              />
            </FieldRow>
          </div>
        )}
        <ToggleField
          label="Cast shadow"
          value={component.style.shadow.enabled}
          onCommit={(v) => patchStyle("shadow", { ...component.style.shadow, enabled: v })}
        />
        {component.style.shadow.enabled && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <FieldRow label="Deflect Y">
                <NumberField
                  value={component.style.shadow.y}
                  onCommit={(v) => patchStyle("shadow", { ...component.style.shadow, y: v })}
                />
              </FieldRow>
              <FieldRow label="Blur">
                <NumberField
                  value={component.style.shadow.blur}
                  min={0}
                  onCommit={(v) => patchStyle("shadow", { ...component.style.shadow, blur: v })}
                />
              </FieldRow>
            </div>
            <FieldRow label="Glossy color">
              <ColorField
                value={component.style.shadow.color}
                onCommit={(v) => patchStyle("shadow", { ...component.style.shadow, color: v })}
              />
            </FieldRow>
          </>
        )}
        <FieldRow label="Main color (text/icon)">
          <ColorField value={component.style.color} onCommit={(v) => patchStyle("color", v)} />
        </FieldRow>
      </InspectorGroup>

      {def?.supportsTypography && (
        <InspectorGroup title="Letter" defaultOpen={component.type === "text"}>
          <FieldRow label="Font">
            <SelectField
              value={component.style.fontFamily}
              options={[...CARD_FONT_OPTIONS]}
              onCommit={(v) => patchStyle("fontFamily", v)}
            />
          </FieldRow>
          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Font size">
              <NumberField value={component.style.fontSize} min={8} max={200} onCommit={(v) => patchStyle("fontSize", v)} />
            </FieldRow>
            <FieldRow label="Intensity">
              <SelectField
                value={String(component.style.fontWeight)}
                options={[
                  { value: "300", label: "Piece" },
                  { value: "400", label: "Often" },
                  { value: "500", label: "Fit" },
                  { value: "600", label: "Medium dark" },
                  { value: "700", label: "Dark" },
                ]}
                onCommit={(v) => patchStyle("fontWeight", Number(v))}
              />
            </FieldRow>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Font alignment">
              <SelectField
                value={component.style.textAlign}
                options={[
                  { value: "left", label: "left" },
                  { value: "center", label: "Between" },
                  { value: "right", label: "Right" },
                ]}
                onCommit={(v) => patchStyle("textAlign", v as "left" | "center" | "right")}
              />
            </FieldRow>
            <FieldRow label="Type">
              <SelectField
                value={component.style.fontStyle}
                options={[
                  { value: "normal", label: "Often" },
                  { value: "italic", label: "Lean" },
                ]}
                onCommit={(v) => patchStyle("fontStyle", v as "normal" | "italic")}
              />
            </FieldRow>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Line spacing">
              <NumberField value={component.style.lineHeight} min={0.5} max={4} step={0.1} onCommit={(v) => patchStyle("lineHeight", v)} />
            </FieldRow>
            <FieldRow label="Stretch characters">
              <NumberField value={component.style.letterSpacing} min={-5} max={30} step={0.5} onCommit={(v) => patchStyle("letterSpacing", v)} />
            </FieldRow>
          </div>
        </InspectorGroup>
      )}

      <InspectorGroup title="The effect appears" defaultOpen={false}>
        <FieldRow label="Type">
          <SelectField
            value={component.animation.entrance.type}
            options={ANIMATION_OPTIONS}
            onCommit={(v) =>
              patch((c) => (c.animation = { ...c.animation, entrance: { ...c.animation.entrance, type: v as never } }))
            }
          />
        </FieldRow>
        <div className="grid grid-cols-2 gap-2">
          <FieldRow label="Duration (s)">
            <NumberField
              value={component.animation.entrance.duration}
              min={0}
              max={5}
              step={0.1}
              onCommit={(v) =>
                patch((c) => (c.animation = { ...c.animation, entrance: { ...c.animation.entrance, duration: v } }))
              }
            />
          </FieldRow>
          <FieldRow label="Delay(s)">
            <NumberField
              value={component.animation.entrance.delay}
              min={0}
              max={10}
              step={0.1}
              onCommit={(v) =>
                patch((c) => (c.animation = { ...c.animation, entrance: { ...c.animation.entrance, delay: v } }))
              }
            />
          </FieldRow>
        </div>
      </InspectorGroup>

      <InspectorGroup title="Loop effect (vivid)" defaultOpen={false}>
        <FieldRow label="Movement type">
          <SelectField
            value={component.animation.loop.type}
            options={LOOP_OPTIONS}
            onCommit={(v) =>
              patch((c) => (c.animation = { ...c.animation, loop: { ...c.animation.loop, type: v as never } }))
            }
          />
        </FieldRow>
        {component.animation.loop.type !== "none" && (
          <FieldRow label={`Cycle (${component.animation.loop.duration}s)`}>
            <SliderField
              value={component.animation.loop.duration}
              min={2}
              max={16}
              step={0.5}
              onCommit={(v) =>
                patch((c) => (c.animation = { ...c.animation, loop: { ...c.animation.loop, duration: v } }))
              }
            />
          </FieldRow>
        )}
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Runs seamlessly across the card page and in Preview — the canvas stays static for easy editing.
        </p>
      </InspectorGroup>

      <InspectorGroup title="Displayed by device" defaultOpen={false}>
        {DEVICE_LABELS.map((d) => (
          <ToggleField
            key={d.key}
            label={`Show on ${d.label}`}
            value={!component.responsive.hiddenOn.includes(d.key)}
            onCommit={(show) =>
              patch((c) => {
                const set = new Set(c.responsive.hiddenOn);
                if (show) set.delete(d.key);
                else set.add(d.key);
                c.responsive = { hiddenOn: [...set] };
              })
            }
          />
        ))}
      </InspectorGroup>
    </div>
  );
}

function renderContentField(
  field: InspectorField,
  component: CardComponent,
  patchContent: (key: string, value: unknown) => void,
  previewContent?: (key: string, value: unknown) => void
) {
  const raw = component.content[field.key];
  switch (field.type) {
    case "text":
    case "url":
      return (
        <TextField value={String(raw ?? "")} placeholder={field.placeholder} onCommit={(v) => patchContent(field.key, v)} />
      );
    case "textarea":
      return (
        <TextareaField value={String(raw ?? "")} placeholder={field.placeholder} onCommit={(v) => patchContent(field.key, v)} />
      );
    case "number":
      return (
        <NumberField value={Number(raw ?? 0)} min={field.min} max={field.max} step={field.step} onCommit={(v) => patchContent(field.key, v)} />
      );
    case "slider":
      return (
        <SliderField
          value={Number(raw ?? field.min ?? 0)}
          min={field.min}
          max={field.max}
          step={field.step}
          onPreview={previewContent ? (v) => previewContent(field.key, v) : undefined}
          onCommit={(v) => patchContent(field.key, v)}
        />
      );
    case "color":
      return <ColorField value={String(raw ?? "")} onCommit={(v) => patchContent(field.key, v)} />;
    case "select":
      return (
        <SelectField value={String(raw ?? field.options?.[0]?.value ?? "")} options={field.options ?? []} onCommit={(v) => patchContent(field.key, v)} />
      );
    case "toggle":
      return <ToggleField value={raw !== false} onCommit={(v) => patchContent(field.key, v)} />;
    case "date":
      return (
        <input
          type="date"
          className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-sm"
          value={String(raw ?? "")}
          onChange={(e) => patchContent(field.key, e.target.value)}
        />
      );
    case "datetime":
      return (
        <input
          type="datetime-local"
          className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-sm"
          value={String(raw ?? "")}
          onChange={(e) => patchContent(field.key, e.target.value)}
        />
      );
    case "image-list":
      return <ImageListField value={(raw as string[]) ?? []} onCommit={(v) => patchContent(field.key, v)} />;
    case "item-list":
      return (
        <ItemListField
          value={(raw as Record<string, string>[]) ?? []}
          itemFields={field.itemFields ?? []}
          onCommit={(v) => patchContent(field.key, v)}
        />
      );
    default:
      return null;
  }
}

/** Quick image selection button for components with images — import from the original card instead of manually typing the URL. */
function ImageContentActions({
  component,
}: {
  component: CardComponent;
  patchContent: (key: string, value: unknown) => void;
}) {
  if (!["image", "frame", "gallery"].includes(component.type)) return null;
  return (
    <button
      className="h-9 rounded-md border border-primary/50 text-primary text-sm font-semibold hover:bg-primary/10 transition flex items-center justify-center gap-1.5"
      onClick={() => useInteractionStore.getState().openImagePicker(component.id)}
    >
      <ImagePlus className="w-4 h-4" />
      {component.type === "gallery" ? "Add/Import photos from original cards" : "Choose from original card images"}
    </button>
  );
}

/* ------------------------------ many components ------------------------------ */

function MultiInspector({ components }: { components: CardComponent[] }) {
  const store = useEditorStore.getState();
  const hasGroup = components.some((c) => c.type === "group");
  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="text-sm text-muted-foreground">{components.length} currently selected component</div>
      <button
        className="h-9 rounded-md border border-border text-sm font-medium hover:bg-muted flex items-center justify-center gap-2"
        onClick={() => store.groupSelected()}
      >
        <Group className="w-4 h-4" /> Group (Ctrl+G)
      </button>
      {hasGroup && (
        <button
          className="h-9 rounded-md border border-border text-sm font-medium hover:bg-muted flex items-center justify-center gap-2"
          onClick={() => store.ungroupSelected()}
        >
          <Ungroup className="w-4 h-4" /> Ungroup (Ctrl+Shift+G)
        </button>
      )}
      <FieldRow label="General opacity">
        <SliderField
          value={Math.round((components[0]?.style.opacity ?? 1) * 100)}
          min={0}
          max={100}
          onCommit={(v) =>
            store.updateSelected((c) => {
              c.style = { ...c.style, opacity: v / 100 };
            })
          }
        />
      </FieldRow>
    </div>
  );
}

/* --------------------------- section + document --------------------------- */

function SectionAndDocumentInspector({ activeSectionId }: { activeSectionId: string | null }) {
  const documentState = useEditorStore((s) => s.document);
  const store = useEditorStore.getState();
  const section = activeSectionId ? ops.findSection(documentState, activeSectionId) : undefined;

  return (
    <div className="flex flex-col">
      {section && (
        <>
          <div className="px-4 py-3 border-b border-border">
            <FieldRow label="Section name">
              <TextField value={section.name} onCommit={(v) => store.updateSection(section.id, (s) => (s.name = v))} />
            </FieldRow>
          </div>
          <InspectorGroup title="section">
            <FieldRow label="Height (px)">
              <NumberField
                value={section.height}
                min={120}
                max={4000}
                onCommit={(v) => store.updateSection(section.id, (s) => (s.height = Math.max(120, v)))}
              />
            </FieldRow>
            <FieldRow label="Background color">
              <ColorField
                value={section.background.color}
                onCommit={(v) => store.updateSection(section.id, (s) => (s.background = { ...s.background, color: v }))}
              />
            </FieldRow>
            <ToggleField
              label="Gradient background"
              value={section.background.gradient.enabled}
              onCommit={(v) =>
                store.updateSection(section.id, (s) => (s.background = { ...s.background, gradient: { ...s.background.gradient, enabled: v } }))
              }
            />
            {section.background.gradient.enabled && (
              <div className="grid grid-cols-2 gap-2">
                <FieldRow label="From color">
                  <ColorField
                    value={section.background.gradient.from}
                    onCommit={(v) =>
                      store.updateSection(section.id, (s) => (s.background = { ...s.background, gradient: { ...s.background.gradient, from: v } }))
                    }
                  />
                </FieldRow>
                <FieldRow label="Come color">
                  <ColorField
                    value={section.background.gradient.to}
                    onCommit={(v) =>
                      store.updateSection(section.id, (s) => (s.background = { ...s.background, gradient: { ...s.background.gradient, to: v } }))
                    }
                  />
                </FieldRow>
              </div>
            )}
            <FieldRow label="Background image (URL)">
              <TextField
                value={section.background.imageUrl}
                placeholder="https://..."
                onCommit={(v) => store.updateSection(section.id, (s) => (s.background = { ...s.background, imageUrl: v }))}
              />
            </FieldRow>
            {section.background.imageUrl && (
              <FieldRow label="Background image opacity">
                <SliderField
                  value={Math.round(section.background.imageOpacity * 100)}
                  min={0}
                  max={100}
                  onCommit={(v) =>
                    store.updateSection(section.id, (s) => (s.background = { ...s.background, imageOpacity: v / 100 }))
                  }
                />
              </FieldRow>
            )}
            {DEVICE_LABELS.map((d) => (
              <ToggleField
                key={d.key}
                label={`Show on ${d.label}`}
                value={!section.hiddenOn.includes(d.key)}
                onCommit={(show) =>
                  store.updateSection(section.id, (s) => {
                    const set = new Set(s.hiddenOn);
                    if (show) set.delete(d.key);
                    else set.add(d.key);
                    s.hiddenOn = [...set];
                  })
                }
              />
            ))}
          </InspectorGroup>
        </>
      )}

      <InspectorGroup title="Design" defaultOpen={!section}>
        <FieldRow label="Design name">
          <TextField value={documentState.name} onCommit={(v) => store.setDocumentName(v)} />
        </FieldRow>
        <FieldRow label="Background color on card">
          <ColorField
            value={documentState.settings.outerBackground}
            onCommit={(v) =>
              store.apply((doc) => {
                const next = structuredClone(doc);
                next.settings.outerBackground = v;
                return next;
              })
            }
          />
        </FieldRow>
        <ToggleField
          label="Use this design for the card page"
          value={documentState.settings.showOnPublicPage}
          onCommit={(v) => store.setShowOnPublicPage(v)}
        />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          When enabled, the public card page will display this Card Studio design instead of the classic template.
        </p>
      </InspectorGroup>
    </div>
  );
}
