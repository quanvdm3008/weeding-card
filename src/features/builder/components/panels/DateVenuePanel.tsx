import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import { PanelHeader, Field } from "./_shared";

const DateVenuePanel = () => {
  const { date, time, venue, address, setField } = useWeddingConfig();
  return (
    <div className="space-y-5">
      <PanelHeader icon={<Calendar className="w-4 h-4" />} title="Ngày cưới & Địa điểm" sub="Thời gian và địa điểm diễn ra lễ cưới & tiệc chiêu đãi" />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Ngày tổ chức">
          <Input type="date" value={date} onChange={(e) => setField("date", e.target.value)} className="h-10" />
        </Field>
        <Field label="Giờ đón khách">
          <Input type="time" value={time} onChange={(e) => setField("time", e.target.value)} className="h-10" />
        </Field>
      </div>
      <Field label="Tên địa điểm / Trung tâm tiệc cưới">
        <Input value={venue} onChange={(e) => setField("venue", e.target.value)} className="h-10" placeholder="Ví dụ: Trung tâm Sự kiện White Palace / Tư gia Nhà Trai" />
      </Field>
      <Field label="Địa chỉ chi tiết">
        <Input value={address} onChange={(e) => setField("address", e.target.value)} className="h-10" placeholder="Ví dụ: 123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM" />
      </Field>
    </div>
  );
};

export default DateVenuePanel;
