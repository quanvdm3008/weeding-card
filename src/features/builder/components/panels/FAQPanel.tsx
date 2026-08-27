import { HelpCircle, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import { WEDDING_SEED_DATA, type FaqItem } from "@/data/seedData";
import { Field, PanelHeader } from "./_shared";

const EMPTY_FAQ: FaqItem = { q: "", a: "" };

export const FAQPanel = () => {
  const { faqs, setField } = useWeddingConfig();
  const items = faqs ?? WEDDING_SEED_DATA.faqs;

  const updateItem = (idx: number, patch: Partial<FaqItem>) => {
    const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    setField("faqs", next);
  };

  const removeItem = (idx: number) => {
    setField("faqs", items.filter((_, i) => i !== idx));
  };

  const addItem = () => {
    setField("faqs", [...items, { ...EMPTY_FAQ }]);
  };

  const resetToDefault = () => {
    setField("faqs", undefined);
  };

  return (
    <div className="space-y-5">
      <PanelHeader
        icon={<HelpCircle className="w-4 h-4" />}
        title="Câu hỏi thường gặp (FAQ)"
        sub="Các câu hỏi và câu trả lời hữu ích hiển thị cho khách mời"
      />

      <div className="space-y-4">
        {items.map((faq, idx) => (
          <div key={idx} className="space-y-3 rounded-xl border border-border p-4 bg-card/60">
            <div className="flex items-center justify-between">
              <span className="font-body text-xs font-bold uppercase tracking-wider text-foreground/90">
                Câu hỏi {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-muted-foreground hover:text-destructive"
                title="Xóa câu hỏi này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <Field label="Câu hỏi">
              <Input
                className="h-10"
                value={faq.q}
                onChange={(e) => updateItem(idx, { q: e.target.value })}
                placeholder="Ví dụ: Có chỗ đỗ xe không?"
              />
            </Field>
            <Field label="Câu trả lời">
              <Textarea
                className="min-h-[80px] text-sm resize-none"
                value={faq.a}
                onChange={(e) => updateItem(idx, { a: e.target.value })}
                placeholder="Trả lời chi tiết cho khách mời..."
              />
            </Field>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button
          type="button"
          onClick={addItem}
          variant="outline"
          className="w-full h-10 font-medium"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Thêm câu hỏi
        </Button>
        {faqs !== undefined && (
          <Button
            type="button"
            onClick={resetToDefault}
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Khôi phục câu hỏi mặc định
          </Button>
        )}
      </div>
    </div>
  );
};

export default FAQPanel;
