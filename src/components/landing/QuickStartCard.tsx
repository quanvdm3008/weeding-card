import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTemplateImage } from "@/features/templates/catalog/templateAssets";
import { useWeddingConfig } from "@/store/weddingConfigStore";

const moods = [
  { id: "romantic", label: "Lãng mạn", template: "romantic", tone: "#c47b91" },
  { id: "elegant", label: "Thanh lịch", template: "korean", tone: "#a77b8d" },
  { id: "heritage", label: "Truyền thống", template: "traditional", tone: "#a42328" },
  { id: "celebration", label: "Rực rỡ", template: "tropical", tone: "#c75b39" },
];

const formatDate = (value: string) => value
  ? new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${value}T00:00:00`))
  : "Ngày đáng nhớ của hai bạn";

export default function QuickStartCard() {
  const navigate = useNavigate();
  const setField = useWeddingConfig((state) => state.setField);
  const setTemplate = useWeddingConfig((state) => state.setTemplate);
  const [groomName, setGroomName] = useState("Minh Anh");
  const [brideName, setBrideName] = useState("Thanh Hà");
  const [date, setDate] = useState("2027-02-14");
  const [moodId, setMoodId] = useState("romantic");
  const mood = useMemo(() => moods.find((item) => item.id === moodId) ?? moods[0], [moodId]);

  const preview = () => {
    setTemplate(mood.template);
    setField("groomName", groomName.trim() || "Minh Anh");
    setField("brideName", brideName.trim() || "Thanh Hà");
    setField("date", date || "2027-02-14");
    navigate(`/view?${new URLSearchParams({
      t: mood.template,
      groom: groomName.trim() || "Minh Anh",
      bride: brideName.trim() || "Thanh Hà",
      date: date || "2027-02-14",
      preview: "1",
    })}`);
  };

  return (
    <div className="grid overflow-hidden rounded-[2rem] border border-white/70 bg-white/92 shadow-[0_28px_90px_-45px_rgba(77,40,42,.55)] backdrop-blur-xl lg:grid-cols-[1.04fr_.96fr]">
      <form className="p-5 sm:p-7" onSubmit={(event) => { event.preventDefault(); preview(); }}>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.2em] text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Thử ngay trong 30 giây
        </div>
        <h2 className="mt-3 font-display text-3xl leading-none text-foreground">Bắt đầu bằng câu chuyện của hai bạn</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Chưa cần đăng ký. Xem trước thiệp với tên và ngày cưới của bạn.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium text-foreground">Tên chú rể
            <input value={groomName} onChange={(event) => setGroomName(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" placeholder="Minh Anh" />
          </label>
          <label className="text-sm font-medium text-foreground">Tên cô dâu
            <input value={brideName} onChange={(event) => setBrideName(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" placeholder="Thanh Hà" />
          </label>
        </div>
        <label className="mt-3 block text-sm font-medium text-foreground">Ngày cưới
          <span className="relative mt-1.5 block"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </span>
        </label>
        <fieldset className="mt-5"><legend className="text-sm font-medium text-foreground">Không khí ngày cưới</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {moods.map((item) => <button key={item.id} type="button" onClick={() => setMoodId(item.id)} className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition ${moodId === item.id ? "border-transparent text-white shadow-sm" : "border-border bg-background text-foreground hover:border-primary/40"}`} style={moodId === item.id ? { backgroundColor: item.tone } : undefined}>
              {item.label}
            </button>)}
          </div>
        </fieldset>
        <button type="submit" className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-semibold text-background transition hover:-translate-y-0.5 hover:bg-foreground/88">
          Xem thiệp của chúng tôi <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="relative min-h-[330px] overflow-hidden bg-[#2b1b20] p-5 sm:p-7">
        <img src={getTemplateImage(mood.template)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/75" />
        <div className="relative flex h-full flex-col justify-between text-center text-white">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] backdrop-blur"><Heart className="h-3 w-3 fill-current" /> Bản xem trước</span>
          <div className="py-7">
            <p className="font-script text-4xl text-white/90">Save the date</p>
            <h3 className="mt-5 font-display text-5xl leading-[.86] sm:text-6xl">{groomName || "Minh Anh"}<span className="mx-2 font-script text-4xl text-[hsl(39_65%_76%)]">&</span>{brideName || "Thanh Hà"}</h3>
            <div className="mx-auto mt-6 h-px w-16 bg-white/50" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[.24em] text-white/80">{formatDate(date)}</p>
          </div>
          <p className="text-xs leading-5 text-white/65">Dữ liệu này sẽ được giữ lại khi bạn chọn chỉnh sửa thiệp.</p>
        </div>
      </div>
    </div>
  );
}
