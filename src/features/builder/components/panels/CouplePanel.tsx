import { Phone, User, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import type { ParentInfo } from "@/data/seedData";
import { PanelHeader, Field } from "./_shared";

const CouplePanel = () => {
  const { groomName, brideName, groomParents, brideParents, accentColor, setField } = useWeddingConfig();

  const updateParents = (side: "groomParents" | "brideParents", key: keyof ParentInfo, value: string) => {
    const current = side === "groomParents" ? groomParents : brideParents;
    const next = {
      fatherName: "",
      motherName: "",
      familyLabel: side === "groomParents" ? "Nhà Trai" : "Nhà Gái",
      fatherTitle: "Ông",
      motherTitle: "Bà",
      address: "",
      phone: "",
      note: "",
      ...current,
      [key]: value,
    };
    const hasContent = next.fatherName || next.motherName || next.address || next.phone || next.note;
    setField(side, hasContent ? next : undefined);
  };

  const familyFields = (
    side: "groomParents" | "brideParents",
    title: string,
    value?: ParentInfo,
  ) => (
    <div className="space-y-3 rounded-xl border border-border p-3.5 bg-card/60">
      <p className="flex items-center gap-2 border-b border-border pb-2 text-xs font-semibold uppercase text-foreground/80">
        <Users className="h-3.5 w-3.5 text-accent" /> {title}
      </p>
      <Field label="Tên đại diện gia đình">
        <Input value={value?.familyLabel ?? title} onChange={(event) => updateParents(side, "familyLabel", event.target.value)} placeholder={title} />
      </Field>
      <div className="grid grid-cols-[88px_minmax(0.1fr)] gap-2">
        <Field label="Danh xưng">
          <Input value={value?.fatherTitle ?? "Ông"} onChange={(event) => updateParents(side, "fatherTitle", event.target.value)} placeholder="Ông" />
        </Field>
        <Field label="Họ tên Bố / Thân phụ">
          <Input value={value?.fatherName ?? ""} onChange={(event) => updateParents(side, "fatherName", event.target.value)} placeholder="Ví dụ: Trần Văn Hùng" />
        </Field>
      </div>
      <div className="grid grid-cols-[88px_minmax(0.1fr)] gap-2">
        <Field label="Danh xưng">
          <Input value={value?.motherTitle ?? "Bà"} onChange={(event) => updateParents(side, "motherTitle", event.target.value)} placeholder="Bà" />
        </Field>
        <Field label="Họ tên Mẹ / Thân mẫu">
          <Input value={value?.motherName ?? ""} onChange={(event) => updateParents(side, "motherName", event.target.value)} placeholder="Ví dụ: Phạm Thị Lan" />
        </Field>
      </div>
      <Field label="Địa chỉ gia đình">
        <Input value={value?.address ?? ""} onChange={(event) => updateParents(side, "address", event.target.value)} placeholder="Phường, Quận, Tỉnh/TP..." />
      </Field>
      <Field label="Số điện thoại liên hệ">
        <div className="relative">
          <Phone className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" inputMode="tel" value={value?.phone ?? ""} onChange={(event) => updateParents(side, "phone", event.target.value)} placeholder="0901 234 567" />
        </div>
      </Field>
      <Field label="Ghi chú thiệp (Trưởng nam, Út nữ, Cố...)">
        <Input value={value?.note ?? ""} onChange={(event) => updateParents(side, "note", event.target.value)} placeholder="Ví dụ: Trưởng nam / Út nữ..." />
      </Field>
    </div>
  );

  return (
    <div className="space-y-5">
      <PanelHeader icon={<User className="w-4 h-4" />} title="Cô dâu & Chú rể" sub="Tên nhân vật chính hiển thị nổi bật trên toàn bộ thiệp cưới" />
      <Field label="Tên Chú Rể">
        <Input value={groomName} onChange={(e) => setField("groomName", e.target.value)} placeholder="Ví dụ: Minh Anh" className="h-10" />
      </Field>
      <Field label="Tên Cô Dâu">
        <Input value={brideName} onChange={(e) => setField("brideName", e.target.value)} placeholder="Ví dụ: Thanh Hà" className="h-10" />
      </Field>
      <div className="space-y-3 border-t border-border pt-5">
        <div>
          <p className="text-sm font-semibold text-foreground">Thông tin hai bên gia đình</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Để trống nếu không muốn hiển thị mục này trên thiệp.</p>
        </div>
        {familyFields("groomParents", "Nhà Trai", groomParents)}
        {familyFields("brideParents", "Nhà Gái", brideParents)}
      </div>
      <div className="p-4 rounded-xl border border-dashed text-center" style={{ borderColor: `${accentColor}55`, background: `${accentColor}08` }}>
        <p className="font-body text-[11px] text-muted-foreground mb-1">Xem trước tên trên thiệp</p>
        <p className="font-display text-lg font-semibold" style={{ color: accentColor }}>
          {groomName || "Chú Rể"} <span className="text-muted-foreground mx-1">&</span> {brideName || "Cô Dâu"}
        </p>
      </div>
    </div>
  );
};

export default CouplePanel;
