import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Users,
  Copy,
  Check,
  Sparkles,
  Link as LinkIcon,
  MessageSquare,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  baseSlug?: string;
  templateId?: string;
}

export const BulkGuestLinkModal: React.FC<Props> = ({
  open,
  onOpenChange,
  baseSlug = "minhanh-thanhha",
  templateId = "vintage",
}) => {
  const [inputText, setInputText] = useState(
    "Anh Hùng & Gia Đình\nChị Mai (Phòng Kế Toán)\nBạn Thân Minh Tuấn\nBác Ba & Bác Gái"
  );
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const baseUrl = window.location.origin;

  const guestNames = inputText
    .split("\n")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  const generatedLinks = guestNames.map((name) => {
    const encodedName = encodeURIComponent(name);
    const link = `${baseUrl}/view?t=${templateId}&to=${encodedName}`;
    return { name, link };
  });

  const handleCopy = (link: string, idx: number) => {
    navigator.clipboard.writeText(link);
    setCopiedIdx(idx);
    toast.success("Đã sao chép đường link thiệp riêng!");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleCopyAll = () => {
    const allText = generatedLinks
      .map((item) => `${item.name}: ${item.link}`)
      .join("\n\n");
    navigator.clipboard.writeText(allText);
    toast.success(`Đã sao chép toàn bộ ${generatedLinks.length} link thiệp!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#FDFBF7] border border-[#C5A880]/60 text-[#2C2523] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#C5A880]/60 text-[#9A7B56] flex items-center justify-center mx-auto mb-2">
            <Users className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-serif text-center font-normal uppercase tracking-wider text-[#2C2523]">
            TẠO THIỆP MỜI CÁ NHÂN HÓA HÀNG LOẠT
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-[#6B5D55] italic">
            Tự động sinh đường link thiệp riêng có khắc tên từng vị khách trên phong bì sáp đỏ 3D.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Textarea Input */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#9A7B56] mb-2">
              Dán danh sách khách mời (Mỗi khách 1 dòng):
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập tên khách mời..."
              className="w-full p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#C5A880]/50 text-xs sm:text-sm font-serif text-[#2C2523] focus:outline-none focus:border-[#9A7B56] resize-none"
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#8C7A70]">
              Đã tạo <strong>{generatedLinks.length}</strong> link riêng
            </span>
            <button
              type="button"
              onClick={handleCopyAll}
              className="px-4 py-2 rounded-full bg-[#9A7B56] text-[#FAF7F2] text-xs font-serif font-bold uppercase tracking-wider hover:bg-[#7D6344] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Sao chép tất cả</span>
            </button>
          </div>

          {/* Generated Links List */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {generatedLinks.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#FAF7F2] border border-[#C5A880]/40 flex items-center justify-between gap-3 text-xs"
              >
                <div className="truncate min-w-0">
                  <p className="font-serif font-bold text-[#2C2523] truncate">
                    💌 Kính gửi: {item.name}
                  </p>
                  <p className="text-[10px] text-[#8C7A70] font-mono truncate">
                    {item.link}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.link, idx)}
                    className="p-2 rounded-lg bg-white border border-[#C5A880]/50 text-[#9A7B56] hover:bg-[#F3EDE2] transition-colors cursor-pointer"
                    title="Sao chép link"
                  >
                    {copiedIdx === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <a
                    href={`https://zalo.me/share?url=${encodeURIComponent(item.link)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
                    title="Gửi qua Zalo"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default BulkGuestLinkModal;
