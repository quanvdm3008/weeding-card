import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

/**
 * Small form controller for Inspector — commit by blur/release for each edit
 * is an undo step (don't spam history with each key).
 */

export function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

export function InspectorGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(!open)}
      >
        {title}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && <div className="px-4 pb-4 flex flex-col gap-3">{children}</div>}
    </div>
  );
}

const inputCls =
  "w-full h-8 px-2.5 rounded-md border border-border bg-background text-sm outline-none focus:border-primary/60";

interface CommitProps<T> {
  value: T;
  onCommit: (value: T) => void;
}

/** Input text — sync when the external value changes (undo/select another), commit when blur/Enter. */
export function TextField({ value, onCommit, placeholder }: CommitProps<string> & { placeholder?: string }) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);
  return (
    <input
      className={inputCls}
      value={local}
      placeholder={placeholder}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => local !== value && onCommit(local)}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        e.stopPropagation();
      }}
    />
  );
}

export function TextareaField({ value, onCommit, placeholder }: CommitProps<string> & { placeholder?: string }) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);
  return (
    <textarea
      className="w-full min-h-20 px-2.5 py-2 rounded-md border border-border bg-background text-sm outline-none focus:border-primary/60 resize-y"
      value={local}
      placeholder={placeholder}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => local !== value && onCommit(local)}
      onKeyDown={(e) => e.stopPropagation()}
    />
  );
}

export function NumberField({
  value,
  onCommit,
  min,
  max,
  step,
}: CommitProps<number> & { min?: number; max?: number; step?: number }) {
  const [local, setLocal] = useState(String(value));
  useEffect(() => setLocal(String(value)), [value]);
  const commit = () => {
    const n = Number(local);
    if (!Number.isNaN(n) && n !== value) onCommit(n);
    else setLocal(String(value));
  };
  return (
    <input
      type="number"
      className={inputCls}
      value={local}
      min={min}
      max={max}
      step={step}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        e.stopPropagation();
      }}
    />
  );
}

export function SliderField({
  value,
  onCommit,
  onPreview,
  min = 0,
  max = 100,
  step = 1,
}: CommitProps<number> & { onPreview?: (v: number) => void; min?: number; max?: number; step?: number }) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        className="flex-1 accent-primary h-1.5"
        min={min}
        max={max}
        step={step}
        value={local}
        onChange={(e) => {
          const v = Number(e.target.value);
          setLocal(v);
          onPreview?.(v);
        }}
        onPointerUp={() => local !== value && onCommit(local)}
        onKeyUp={(e) => {
          if (e.key.startsWith("Arrow") && local !== value) onCommit(local);
        }}
      />
      <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">{local}</span>
    </div>
  );
}

export function ColorField({ value, onCommit }: CommitProps<string>) {
  const [local, setLocal] = useState(value || "#000000");
  useEffect(() => setLocal(value || "#000000"), [value]);
  const normalized = /^#[0-9a-fA-F]{6}$/.test(local) ? local : "#000000";
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        className="w-8 h-8 rounded-md border border-border cursor-pointer bg-transparent p-0.5"
        value={normalized}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => local !== value && onCommit(local)}
      />
      <input
        className={inputCls}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => local !== value && onCommit(local)}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          e.stopPropagation();
        }}
        placeholder="#RRGGBB / rgba(...)"
      />
    </div>
  );
}

export function SelectField({
  value,
  onCommit,
  options,
}: CommitProps<string> & { options: { value: string; label: string }[] }) {
  return (
    <select className={inputCls} value={value} onChange={(e) => onCommit(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function ToggleField({ value, onCommit, label }: CommitProps<boolean> & { label?: string }) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer select-none">
      {label && <span className="text-sm">{label}</span>}
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onCommit(!value)}
        className={`w-9 h-5 rounded-full transition-colors relative ${value ? "bg-primary" : "bg-muted-foreground/30"}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-4.5 left-0.5" : "left-0.5"
          }`}
          style={{ transform: value ? "translateX(16px)" : undefined }}
        />
      </button>
    </label>
  );
}

/** List of image URLs (gallery). */
export function ImageListField({ value, onCommit }: CommitProps<string[]>) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const url = draft.trim();
    if (!url) return;
    onCommit([...value, url]);
    setDraft("");
  };
  return (
    <div className="flex flex-col gap-2">
      {value.map((url, i) => (
        <div key={i} className="flex items-center gap-2">
          <img src={url} alt="" className="w-8 h-8 rounded object-cover border border-border shrink-0" />
          <span className="text-xs truncate flex-1 text-muted-foreground">{url}</span>
          <button
            className="text-muted-foreground hover:text-destructive shrink-0"
            onClick={() => onCommit(value.filter((_, j) => j !== i))}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <div className="flex gap-1.5">
        <input
          className={inputCls}
          value={draft}
          placeholder="https://... (image URL)"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
            e.stopPropagation();
          }}
        />
        <button
          className="h-8 px-2.5 rounded-md border border-border hover:bg-muted shrink-0"
          onClick={add}
          title="Add photos"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/** Item list has many subfields (timeline, social links). */
export function ItemListField({
  value,
  onCommit,
  itemFields,
}: CommitProps<Record<string, string>[]> & {
  itemFields: { key: string; label: string; type: "text" | "textarea" }[];
}) {
  const update = (index: number, key: string, v: string) => {
    const next = value.map((item, i) => (i === index ? { ...item, [key]: v } : item));
    onCommit(next);
  };
  return (
    <div className="flex flex-col gap-3">
      {value.map((item, i) => (
        <div key={i} className="rounded-lg border border-border p-2.5 flex flex-col gap-2 relative">
          <button
            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
            onClick={() => onCommit(value.filter((_, j) => j !== i))}
            title="Delete item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {itemFields.map((f) => (
            <FieldRow key={f.key} label={f.label}>
              <TextField value={String(item[f.key] ?? "")} onCommit={(v) => update(i, f.key, v)} />
            </FieldRow>
          ))}
        </div>
      ))}
      <button
        className="h-8 rounded-md border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/60 flex items-center justify-center gap-1.5"
        onClick={() => onCommit([...value, {}])}
      >
        <Plus className="w-3.5 h-3.5" /> Add item
      </button>
    </div>
  );
}
