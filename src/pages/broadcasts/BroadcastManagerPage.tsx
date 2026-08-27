import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  MessageSquareShare,
  Send,
  Copy,
  Check,
  Clock,
  MapPin,
  Heart,
  Sparkles,
  Users,
  Smartphone,
  Mail,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvitationSubNav } from "@/components/wedding/InvitationSubNav";
import { getInvitation } from "@/lib/invitations";
import { listGuests } from "@/lib/guests";

type ReminderType = "3-days-before" | "1-day-before" | "day-of-table" | "thank-you";
type ChannelType = "zalo" | "sms" | "messenger" | "email";

const SCENARIOS: Record<ReminderType, { title: string; desc: string; defaultTemplate: string }> = {
  "3-days-before": {
    title: "Nhắc Lịch Trước 3 Ngày",
    desc: "Gửi lời nhắc thân mật giúp khách sắp xếp thời gian chung vui",
    defaultTemplate:
      "Thân gửi {guest_name},\nChỉ còn 3 ngày nữa là đến ngày chung đôi của {groom_name} & {bride_name} rồi!\nChúng mình rất mong được đón tiếp bạn vào lúc {event_time} ngày {wedding_date} tại {venue_name}.\nXem lại chi tiết thiệp cưới tại: {invitation_link}\nHẹn gặp bạn trong ngày vui nhé!",
  },
  "1-day-before": {
    title: "Nhắc Lịch & Chỉ Đường Trước 1 Ngày",
    desc: "Gửi định vị Google Maps & thời gian đón khách chính xác",
    defaultTemplate:
      "Chào {guest_name},\nNgày mai là ngày cưới của {groom_name} & {bride_name}!\nThời gian đón khách: {event_time}\nĐịa điểm: {venue_name} ({venue_address})\nChỉ đường Google Maps: {map_link}\nSự hiện diện của bạn là niềm vinh hạnh của chúng mình!",
  },
  "day-of-table": {
    title: "Thông Báo Số Bàn Tiệc (Ngày Cưới)",
    desc: "Gửi vị trí chỗ ngồi để khách đến nơi có thể vào thẳng bàn tiệc",
    defaultTemplate:
      "Chào mừng {guest_name} đến với hôn lễ của {groom_name} & {bride_name}!\nVị trí bàn tiệc của bạn là: {table_name}.\nBạn có thể quét mã QR tại bàn để gửi lời chúc lên màn hình LED và xem thực đơn nhé!",
  },
  "thank-you": {
    title: "Thư Cảm Ơn Sau Đám Cưới",
    desc: "Gửi lời tri ân sâu sắc sau khi hôn lễ kết thúc",
    defaultTemplate:
      "Thân gửi {guest_name},\n{groom_name} & {bride_name} xin gửi lời cảm ơn chân thành nhất vì sự hiện diện và những lời chúc phúc ngọt ngào của bạn trong ngày cưới hôm nay.\nCảm ơn bạn vì đã làm cho ngày vui của chúng mình trở nên trọn vẹn và ý nghĩa hơn bao giờ hết!",
  },
};

export default function BroadcastManagerPage() {
  const { invitationId } = useParams<{ invitationId: string }>();
  const id = invitationId ?? "";

  const [scenario, setScenario] = useState<ReminderType>("3-days-before");
  const [channel, setChannel] = useState<ChannelType>("zalo");
  const [templateText, setTemplateText] = useState(SCENARIOS["3-days-before"].defaultTemplate);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const invitationQuery = useQuery({
    queryKey: ["invitation-detail", id],
    queryFn: () => getInvitation(id),
    enabled: Boolean(id),
  });

  const guestsQuery = useQuery({
    queryKey: ["invitation-guests", id],
    queryFn: () => listGuests(id),
    enabled: Boolean(id),
  });

  const invitation = invitationQuery.data;
  const slug = invitation?.slug || "";
  const publicUrl = useMemo(() => {
    if (!slug) return window.location.origin;
    return `${window.location.origin}/invitation/${slug}`;
  }, [slug]);

  const handleScenarioChange = (newScenario: ReminderType) => {
    setScenario(newScenario);
    setTemplateText(SCENARIOS[newScenario].defaultTemplate);
  };

  const groomName = invitation?.groomName || "Hoàng Long";
  const brideName = invitation?.brideName || "Minh Anh";
  const venueName = invitation?.events?.[0]?.venue || "Trung Tâm Tiệc Cưới Trống Đồng";
  const venueAddress = invitation?.events?.[0]?.address || "Hà Nội";
  const eventTime = invitation?.events?.[0]?.time || "18:00";
  const weddingDate = invitation?.events?.[0]?.date || "20/10/2026";

  const replaceTags = (text: string, guestName: string, tableName?: string) => {
    return text
      .replace(/{guest_name}/g, guestName)
      .replace(/{groom_name}/g, groomName)
      .replace(/{bride_name}/g, brideName)
      .replace(/{venue_name}/g, venueName)
      .replace(/{venue_address}/g, venueAddress)
      .replace(/{event_time}/g, eventTime)
      .replace(/{wedding_date}/g, weddingDate)
      .replace(/{table_name}/g, tableName || "Bàn tự do")
      .replace(/{invitation_link}/g, publicUrl)
      .replace(/{map_link}/g, "https://maps.google.com");
  };

  const guestItems = guestsQuery.data?.items || [];
  const guests = guestItems.length > 0
    ? guestItems.map((g) => ({
        id: g.id,
        fullName: g.fullName,
        phoneNumber: g.phone || "",
        tableGroup: "Bàn tự do",
      }))
    : [
        { id: "1", fullName: "Nguyễn Văn Hùng", phoneNumber: "0901234567", tableGroup: "Bàn 03" },
        { id: "2", fullName: "Trần Thị Mai Phương", phoneNumber: "0912345678", tableGroup: "Bàn 05" },
        { id: "3", fullName: "Lê Hoàng Nam", phoneNumber: "0987654321", tableGroup: "Bàn 01" },
        { id: "4", fullName: "Phạm Thu Trang", phoneNumber: "0978901234", tableGroup: "Bàn 07" },
      ];

  const handleCopySingle = (guestId: string, message: string) => {
    navigator.clipboard.writeText(message);
    setCopiedId(guestId);
    toast.success("Đã sao chép tin nhắn cá nhân hóa!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <InvitationSubNav
        invitationId={id}
        title={invitation ? `${invitation.groomName} & ${invitation.brideName}` : "Hôn Lễ"}
        subtitle="Trung tâm nhắc lịch & Gửi thông điệp hàng loạt"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex-1 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-display flex items-center gap-2">
              <MessageSquareShare className="h-6 w-6 text-accent" /> Nhắc Lịch & Thông Điệp Cưới
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Tạo mẫu tin nhắn tự động điền tên khách mời, số bàn tiệc và link bản đồ chỉ đường cho từng kênh.
            </p>
          </div>
        </div>

        {/* Scenario and Channel Selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Template Config */}
          <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-5 shadow-sm space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">1. Chọn kịch bản gửi tin:</Label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(SCENARIOS) as ReminderType[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleScenarioChange(key)}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      scenario === key
                        ? "border-accent bg-accent/10 text-foreground font-semibold shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <p className="font-semibold text-foreground truncate">{SCENARIOS[key].title}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{SCENARIOS[key].desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">2. Kênh gửi dự kiến:</Label>
              <Tabs value={channel} onValueChange={(v) => setChannel(v as ChannelType)}>
                <TabsList className="grid grid-cols-4 w-full text-xs">
                  <TabsTrigger value="zalo" className="text-[11px]">Zalo</TabsTrigger>
                  <TabsTrigger value="sms" className="text-[11px]">SMS</TabsTrigger>
                  <TabsTrigger value="messenger" className="text-[11px]">Messenger</TabsTrigger>
                  <TabsTrigger value="email" className="text-[11px]">Email</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">3. Soạn nội dung mẫu:</Label>
                <button
                  type="button"
                  onClick={() => setTemplateText(SCENARIOS[scenario].defaultTemplate)}
                  className="text-[11px] text-accent hover:underline"
                >
                  Khôi phục mẫu gốc
                </button>
              </div>
              <Textarea
                rows={8}
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
                className="text-xs leading-relaxed font-mono resize-none bg-background"
              />
              <div className="flex flex-wrap gap-1 text-[10px] text-muted-foreground pt-1">
                <span className="bg-muted px-1.5 py-0.5 rounded">{"{guest_name}"}</span>
                <span className="bg-muted px-1.5 py-0.5 rounded">{"{table_name}"}</span>
                <span className="bg-muted px-1.5 py-0.5 rounded">{"{wedding_date}"}</span>
                <span className="bg-muted px-1.5 py-0.5 rounded">{"{venue_name}"}</span>
                <span className="bg-muted px-1.5 py-0.5 rounded">{"{invitation_link}"}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Personalized Preview & Send to Guests */}
          <div className="lg:col-span-7 rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold">
                  Tin Nhắn Cá Nhân Hóa ({guests.length} khách mời)
                </h3>
                <p className="text-xs text-muted-foreground">Sao chép hoặc gửi trực tiếp cho từng người</p>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase font-bold bg-accent/10 border-accent/30 text-accent">
                {channel.toUpperCase()}
              </Badge>
            </div>

            <div className="p-4 divide-y divide-border/80 space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-none">
              {guests.map((guest) => {
                const personalizedMsg = replaceTags(templateText, guest.fullName, guest.tableGroup);
                const isCopied = copiedId === guest.id;

                return (
                  <div key={guest.id} className="pt-4 first:pt-0 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-foreground">{guest.fullName}</span>
                        {guest.phoneNumber && <span className="ml-2 text-muted-foreground">({guest.phoneNumber})</span>}
                        {guest.tableGroup && (
                          <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                            {guest.tableGroup}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopySingle(guest.id, personalizedMsg)}
                          className="h-7 text-xs px-2.5"
                        >
                          {isCopied ? <Check className="mr-1 h-3 w-3 text-emerald-500" /> : <Copy className="mr-1 h-3 w-3" />}
                          {isCopied ? "Đã sao chép" : "Sao chép"}
                        </Button>

                        {guest.phoneNumber && channel === "zalo" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            asChild
                            className="h-7 text-xs px-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            <a
                              href={`https://zalo.me/${guest.phoneNumber.replace(/^0/, "84")}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Share2 className="mr-1 h-3 w-3" /> Mở Zalo
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground whitespace-pre-line bg-muted/30 p-3 rounded-xl border border-border/60 leading-relaxed font-body">
                      {personalizedMsg}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
