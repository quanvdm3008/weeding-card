import { useState } from "react";
import { Gift, Info, QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import type { BankInfo } from "@/data/seedData";
import { VIETNAM_BANKS_CATALOG, generateVietQrUrl } from "@/lib/vietqr";
import { Field, PanelHeader } from "./_shared";

const OTHER_BANK = "__other__";

const BankFields = ({
  title,
  value,
  onChange,
}: {
  title: string;
  value?: BankInfo;
  onChange: (next: BankInfo | undefined) => void;
}) => {
  const bankName = value?.bankName ?? "";
  const isKnownBank = VIETNAM_BANKS_CATALOG.some((b) => b.shortName === bankName || b.name === bankName || b.code === bankName);
  const [otherMode, setOtherMode] = useState(() => !isKnownBank && bankName.length > 0);
  const selectValue = otherMode ? OTHER_BANK : isKnownBank ? (VIETNAM_BANKS_CATALOG.find((b) => b.shortName === bankName || b.name === bankName || b.code === bankName)?.shortName ?? bankName) : "";

  const patch = (fields: Partial<BankInfo>) => {
    const next: BankInfo = {
      bankName: value?.bankName ?? "",
      accountNumber: value?.accountNumber ?? "",
      accountHolder: value?.accountHolder,
      ...fields,
    };
    onChange(next);
  };

  const clear = () => {
    setOtherMode(false);
    onChange(undefined);
  };

  const qrUrl = value?.accountNumber && value?.bankName
    ? generateVietQrUrl({
        bankName: value.bankName,
        accountNumber: value.accountNumber,
        accountHolder: value.accountHolder || "",
        description: `Mung cuoi ${title}`,
        template: "compact2",
      })
    : "";

  return (
    <div className="space-y-3 rounded-xl border border-border p-4 bg-card/60">
      <p className="font-body text-xs font-bold uppercase tracking-wider text-foreground/90">{title}</p>
      <Field label="Ngân hàng">
        <Select
          value={selectValue}
          onValueChange={(v) => {
            if (v === OTHER_BANK) {
              setOtherMode(true);
            } else {
              setOtherMode(false);
              patch({ bankName: v });
            }
          }}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Chọn ngân hàng" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {VIETNAM_BANKS_CATALOG.map((b) => (
              <SelectItem key={b.bin} value={b.shortName}>
                <span className="font-medium">{b.shortName}</span>
                <span className="ml-1 text-xs text-muted-foreground">({b.code})</span>
              </SelectItem>
            ))}
            <SelectItem value={OTHER_BANK}>Ngân hàng khác...</SelectItem>
          </SelectContent>
        </Select>
        {otherMode && (
          <Input
            className="mt-2 h-10"
            value={bankName}
            onChange={(e) => patch({ bankName: e.target.value })}
            placeholder="Nhập tên ngân hàng"
          />
        )}
      </Field>
      <Field label="Số tài khoản">
        <Input
          className="h-10 font-mono text-xs"
          value={value?.accountNumber ?? ""}
          onChange={(e) => patch({ accountNumber: e.target.value })}
          placeholder="Ví dụ: 190288889999"
        />
      </Field>
      <Field label="Chủ tài khoản (không bắt buộc)">
        <Input
          className="h-10"
          value={value?.accountHolder ?? ""}
          onChange={(e) => patch({ accountHolder: e.target.value })}
          placeholder="Ví dụ: NGUYEN VAN A"
        />
      </Field>

      {/* Live VietQR Preview */}
      {qrUrl && (
        <div className="mt-3 p-3 rounded-lg border border-border/80 bg-background/80 flex items-center gap-3">
          <div className="w-16 h-16 bg-white p-1 rounded-md border border-border/60 shrink-0 flex items-center justify-center shadow-sm">
            <img src={qrUrl} alt="VietQR Preview" className="w-full h-full object-contain" />
          </div>
          <div className="text-xs space-y-0.5 min-w-0">
            <div className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
              <QrCode className="w-3.5 h-3.5" />
              <span>VietQR Napas 24/7 hợp lệ</span>
            </div>
            <p className="text-muted-foreground text-[11px] truncate">
              {value?.bankName} — {value?.accountNumber}
            </p>
          </div>
        </div>
      )}

      {value && (value.bankName || value.accountNumber) && (
        <button
          type="button"
          onClick={clear}
          className="text-[11px] font-semibold text-destructive hover:underline pt-1 block"
        >
          Xóa thông tin tài khoản này
        </button>
      )}
    </div>
  );
};

export const GiftPanel = () => {
  const { groomName, brideName, groomBank, brideBank, setField } = useWeddingConfig();

  return (
    <div className="space-y-5">
      <PanelHeader
        icon={<Gift className="w-4 h-4" />}
        title="Hộp mừng cưới (VietQR)"
        sub="Mục quà mừng cưới sẽ hiển thị mã VietQR chuyển khoản tự động khi bạn nhập số tài khoản"
      />
      <BankFields title={`Nhà Trai - ${groomName || "Chú Rể"}`} value={groomBank} onChange={(v) => setField("groomBank", v)} />
      <BankFields title={`Nhà Gái - ${brideName || "Cô Dâu"}`} value={brideBank} onChange={(v) => setField("brideBank", v)} />
      <div className="flex gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 flex-none text-accent" />
        <span>Hệ thống tự động liên kết với cổng Napas 24/7 sinh mã QR chuyển khoản nhanh kèm nội dung mừng cưới chuẩn xác.</span>
      </div>
    </div>
  );
};

