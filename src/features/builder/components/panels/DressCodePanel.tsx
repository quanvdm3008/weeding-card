import { useRef, useState } from "react";
import { Check, Palette, Plus, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { PanelHeader, Field } from "./_shared";

interface PalettePreset {
  name: string;
  colors: string[];
}

const PRESET_PALETTES: PalettePreset[] = [
  {
    name: "Cổ điển thanh lịch",
    colors: ["#000000", "#FFFFFF", "#F5E6D3"],
  },
  {
    name: "Pastel nhẹ nhàng",
    colors: ["#F5E6D3", "#E8B4B8", "#D4E8D0"],
  },
  {
    name: "Sang trọng hoàng gia",
    colors: ["#1B2838", "#D4A853", "#FFFFFF"],
  },
  {
    name: "Rustic ấm áp",
    colors: ["#8B4513", "#C67B5C", "#F8EDE3"],
  },
  {
    name: "Tropical tươi mát",
    colors: ["#006D77", "#FFB703", "#FFFFFF"],
  },
];

const DEFAULT_NEW_COLOR = "#E8B4B8";

export const DressCodePanel = () => {
  const { dressCodeColors, setField } = useWeddingConfig();
  const colors = dressCodeColors ?? WEDDING_SEED_DATA.dressCodeColors;
  const newColorInputRef = useRef<HTMLInputElement>(null);
  const [customHex, setCustomHex] = useState(DEFAULT_NEW_COLOR);

  const updateColor = (index: number, newColor: string) => {
    const updated = [...colors];
    updated[index] = newColor.toUpperCase();
    setField("dressCodeColors", updated);
  };

  const removeColor = (index: number) => {
    const updated = colors.filter((_, i) => i !== index);
    setField("dressCodeColors", updated);
  };

  const addColor = (hex: string) => {
    if (!hex) return;
    const formatted = hex.startsWith("#") ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
    setField("dressCodeColors", [...colors, formatted]);
  };

  const handleAddFromInput = () => {
    if (customHex) {
      addColor(customHex);
    }
  };

  const applyPreset = (presetColors: string[]) => {
    setField("dressCodeColors", [...presetColors]);
  };

  const resetToDefault = () => {
    setField("dressCodeColors", undefined);
  };

  const isPresetActive = (presetColors: string[]) => {
    if (presetColors.length !== colors.length) return false;
    return presetColors.every((c, i) => c.toLowerCase() === colors[i]?.toLowerCase());
  };

  return (
    <div className="space-y-6">
      <PanelHeader
        icon={<Palette className="h-4 w-4" />}
        title="Bảng màu trang phục"
        sub="Gợi ý tông màu trang phục cho khách mời ngày cưới"
      />

      {/* Visual Preview Bar */}
      <section className="space-y-3">
        <Field label="Xem trước bảng màu trang phục">
          <div className="overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Thanh màu gợi ý trên thiệp</span>
              <span>{colors.length} màu</span>
            </div>

            {/* Split color bar */}
            {colors.length > 0 ? (
              <div className="flex h-12 w-full overflow-hidden rounded-lg border border-border/80 shadow-inner">
                {colors.map((color, idx) => (
                  <div
                    key={`${color}-${idx}`}
                    className="flex-1 transition-all relative group"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-12 w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-xs text-muted-foreground">
                Chưa có màu nào trong bảng màu
              </div>
            )}

            {/* Color chips preview */}
            {colors.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {colors.map((color, idx) => (
                  <div
                    key={`${color}-${idx}`}
                    className="flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-2.5 py-1 text-[11px] shadow-sm"
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-mono font-medium text-foreground/80">{color}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Field>
      </section>

      {/* Current Color Swatches & Management */}
      <section className="space-y-4 border-t border-border pt-5">
        <Field label="Màu sắc hiện tại">
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color, idx) => (
                <div key={idx} className="relative group">
                  {/* Swatch Button */}
                  <label
                    htmlFor={`color-input-${idx}`}
                    className="relative flex flex-col items-center justify-center p-2 rounded-xl border border-border bg-card cursor-pointer transition-all hover:border-accent hover:shadow-sm"
                  >
                    <div
                      className="h-10 w-full rounded-lg border border-black/15 shadow-sm transition-transform group-hover:scale-95"
                      style={{ backgroundColor: color }}
                    />
                    <span className="mt-1.5 font-mono text-[11px] font-semibold text-foreground/90 uppercase truncate w-full text-center">
                      {color}
                    </span>
                    <input
                      id={`color-input-${idx}`}
                      type="color"
                      value={color.startsWith("#") && color.length === 7 ? color : "#000000"}
                      onChange={(e) => updateColor(idx, e.target.value)}
                      className="sr-only"
                      aria-label={`Chỉnh sửa màu ${color}`}
                    />
                  </label>

                  {/* Remove Button Overlay */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeColor(idx);
                    }}
                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow hover:scale-110 transition-transform"
                    title={`Xóa màu ${color}`}
                    aria-label={`Xóa màu ${color}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {/* Add New Color Trigger Button */}
              <div>
                <button
                  type="button"
                  onClick={() => newColorInputRef.current?.click()}
                  className="flex flex-col items-center justify-center h-full min-h-[72px] w-full rounded-xl border border-dashed border-border bg-muted/20 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-all"
                  title="Thêm màu mới"
                >
                  <Plus className="h-5 w-5 mb-1" />
                  <span className="text-[11px] font-medium">Thêm màu</span>
                </button>
                <input
                  ref={newColorInputRef}
                  type="color"
                  value={customHex}
                  onChange={(e) => {
                    setCustomHex(e.target.value);
                    addColor(e.target.value);
                  }}
                  className="sr-only"
                  aria-label="Chọn màu mới"
                />
              </div>
            </div>

            {/* Custom Hex Input Row */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                className="h-10 w-12 cursor-pointer rounded-md border border-border"
                aria-label="Chọn màu từ bảng màu"
              />
              <Input
                type="text"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                placeholder="#HEXCODE"
                className="h-10 flex-1 font-mono text-xs uppercase"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddFromInput}
                className="h-10 shrink-0 font-medium"
              >
                <Plus className="h-4 w-4 mr-1" /> Thêm vào bảng
              </Button>
            </div>
          </div>
        </Field>
      </section>

      {/* Preset Palette Groups */}
      <section className="space-y-4 border-t border-border pt-5">
        <Field label="Bảng màu gợi ý (Presets)">
          <div className="space-y-2.5">
            {PRESET_PALETTES.map((preset) => {
              const active = isPresetActive(preset.colors);
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset.colors)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    active
                      ? "border-accent bg-accent/10 shadow-sm ring-1 ring-accent/30"
                      : "border-border bg-card/70 hover:border-border hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {preset.colors.map((c, i) => (
                        <span
                          key={i}
                          className="inline-block h-6 w-6 rounded-full border-2 border-background shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <span className="font-body text-xs font-semibold text-foreground">
                      {preset.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground hidden @sm:inline-block">
                      {preset.colors.join(" · ")}
                    </span>
                    {active && <Check className="h-4 w-4 text-accent shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Field>
      </section>

      {/* Reset to Default Action */}
      <div className="border-t border-border pt-4">
        <Button
          type="button"
          onClick={resetToDefault}
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Khôi phục bảng màu mặc định
        </Button>
      </div>
    </div>
  );
};

export default DressCodePanel;
