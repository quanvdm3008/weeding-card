import { Check, Palette, Type } from "lucide-react";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import { PanelHeader, Field } from "./_shared";

const accentColors = [
  "#E8B4B8", "#D4A853", "#A3B18A", "#9B7CB5",
  "#FFB7C5", "#C75B39", "#1B2838", "#88C9BF",
  "#C9A96E", "#E8A0BF", "#C67B5C", "#800020",
  "#00838F", "#4A5D4E", "#8B0000", "#1565C0",
  "#8B6914", "#6A5ACD",
];

const headingFonts = ["Cormorant Garamond", "Playfair Display", "Be Vietnam Pro", "Cinzel", "Inter", "Poppins", "Great Vibes", "Dancing Script", "Alex Brush"] as const;
const bodyFonts = ["Be Vietnam Pro", "Inter", "Poppins", "Montserrat", "Cormorant Garamond", "Playfair Display"] as const;
const weights = [
  { value: 500, label: "Mảnh" },
  { value: 600, label: "Vừa" },
  { value: 700, label: "Đậm" },
  { value: 900, label: "Rất đậm" },
] as const;
const accentStyles = [
  { value: "minimal", label: "Tối giản" },
  { value: "underline", label: "Gạch chân nghệ thuật" },
  { value: "highlight", label: "Nổi bật / Dạ quang" },
  { value: "editorial", label: "Tạp chí thời trang" },
] as const;

const AppearancePanel = () => {
  const {
    accentColor,
    headingFont = "Cormorant Garamond",
    bodyFont = "Be Vietnam Pro",
    headingWeight = 600,
    headingCase = "normal",
    accentStyle = "minimal",
    setField,
  } = useWeddingConfig();

  return (
    <div className="space-y-6">
      <PanelHeader icon={<Palette className="h-4 w-4" />} title="Màu sắc & Giao diện" sub="Phông chữ, bảng màu và phong cách thị giác của thiệp cưới" />

      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2 text-sm font-semibold">
          <Type className="h-4 w-4 text-accent" /> Phông chữ (Typography)
        </div>
        <Field label="Phông chữ tiêu đề chính">
          <select
            value={headingFont}
            onChange={(event) => setField("headingFont", event.target.value as typeof headingFont)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            style={{ fontFamily: headingFont }}
          >
            {headingFonts.map((font) => <option key={font} value={font}>{font}</option>)}
          </select>
        </Field>
        <Field label="Phông chữ nội dung">
          <select
            value={bodyFont}
            onChange={(event) => setField("bodyFont", event.target.value as typeof bodyFont)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            style={{ fontFamily: bodyFont }}
          >
            {bodyFonts.map((font) => <option key={font} value={font}>{font}</option>)}
          </select>
        </Field>
        <Field label="Độ đậm phông chữ tiêu đề">
          <div className="grid grid-cols-4 overflow-hidden rounded-md border border-border">
            {weights.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setField("headingWeight", item.value)}
                className={`h-9 border-r border-border px-1 text-[11px] font-medium last:border-r-0 ${headingWeight === item.value ? "bg-foreground text-background" : "bg-card text-muted-foreground hover:bg-muted"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </Field>
        <label className="flex items-center justify-between gap-4 rounded-md border border-border bg-card px-3 py-2.5 text-sm cursor-pointer">
          <span>
            <span className="block font-medium">In hoa tiêu đề chính (UPPERCASE)</span>
            <span className="block text-[11px] text-muted-foreground">Phù hợp với phong cách Tạp chí và Hiện đại</span>
          </span>
          <input
            type="checkbox"
            checked={headingCase === "uppercase"}
            onChange={(event) => setField("headingCase", event.target.checked ? "uppercase" : "normal")}
            className="h-4 w-4 accent-accent"
          />
        </label>
      </section>

      <section className="space-y-4 border-t border-border pt-5">
        <Field label="Kiểu điểm nhấn (Accent style)">
          <select
            value={accentStyle}
            onChange={(event) => setField("accentStyle", event.target.value as typeof accentStyle)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {accentStyles.map((style) => <option key={style.value} value={style.value}>{style.label}</option>)}
          </select>
        </Field>
        <Field label="Màu sắc chủ đạo">
          <div className="grid grid-cols-6 gap-2">
            {accentColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setField("accentColor", color)}
                className="relative aspect-square rounded-md ring-offset-2 ring-offset-card transition-transform hover:scale-105"
                style={{ background: color, boxShadow: accentColor === color ? `0 0 0 2px ${color}` : undefined }}
                title={color}
                aria-label={`Chọn màu ${color}`}
              >
                {accentColor === color && <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Mã màu tùy chỉnh (HEX)">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={accentColor}
              onChange={(event) => setField("accentColor", event.target.value)}
              className="h-10 w-12 cursor-pointer rounded-md border border-border"
              aria-label="Chọn màu tùy chỉnh"
            />
            <input
              type="text"
              value={accentColor}
              onChange={(event) => setField("accentColor", event.target.value)}
              className="h-10 flex-1 rounded-md border border-border bg-background px-3 font-mono text-sm"
            />
          </div>
        </Field>
      </section>

      <div className="overflow-hidden rounded-xl border border-border bg-card p-4 text-center">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Xem trước phông chữ</p>
        <p className="mt-2 text-2xl leading-tight" style={{ color: accentColor, fontFamily: headingFont, fontWeight: headingWeight, textTransform: headingCase === "uppercase" ? "uppercase" : "none" }}>
          Ngày Chúng Mình Chung Đôi
        </p>
        <p className="mt-2 text-xs text-muted-foreground" style={{ fontFamily: bodyFont }}>Một lời hẹn ước, một đời bên nhau.</p>
      </div>
    </div>
  );
};

export default AppearancePanel;
