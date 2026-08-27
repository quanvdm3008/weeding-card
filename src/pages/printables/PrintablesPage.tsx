import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import QRCode from "qrcode";
import {
  Printer,
  Sparkles,
  QrCode,
  Download,
  Layout,
  Layers,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvitationSubNav } from "@/components/wedding/InvitationSubNav";
import { getInvitation } from "@/lib/invitations";

type PrintableMode = "table-standee" | "invitation-card" | "welcome-board";

export default function PrintablesPage() {
  const { invitationId } = useParams<{ invitationId: string }>();
  const id = invitationId ?? "";

  const [mode, setMode] = useState<PrintableMode>("table-standee");
  const [tableNumber, setTableNumber] = useState("01");
  const [tableName, setTableName] = useState("Nhà Trai - Bạn Thân");
  const [welcomeText, setWelcomeText] = useState("Quét mã QR để xem thực đơn & gửi lời chúc phúc");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const invitationQuery = useQuery({
    queryKey: ["invitation-detail", id],
    queryFn: () => getInvitation(id),
    enabled: Boolean(id),
  });

  const invitation = invitationQuery.data;
  const slug = invitation?.slug || "";
  const publicUrl = useMemo(() => {
    if (!slug) return window.location.origin;
    return `${window.location.origin}/invitation/${slug}`;
  }, [slug]);

  useEffect(() => {
    if (!publicUrl) return;
    QRCode.toDataURL(publicUrl, {
      width: 400,
      margin: 1,
      color: { dark: "#18181b", light: "#ffffff" },
    }).then(setQrDataUrl).catch(() => {});
  }, [publicUrl]);

  const handlePrint = () => {
    window.print();
  };

  const groomName = invitation?.groomName || "Hoàng Long";
  const brideName = invitation?.brideName || "Minh Anh";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Hide navigation on print */}
      <div className="print:hidden">
        <InvitationSubNav
          invitationId={id}
          title={invitation ? `${invitation.groomName} & ${invitation.brideName}` : "Hôn Lễ"}
          subtitle="Xuất bản Standee để bàn & Thiệp in vật lý"
        />
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex-1 w-full space-y-6">
        {/* Controls header (hidden on print) */}
        <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <h2 className="text-2xl font-bold font-display flex items-center gap-2">
              <Printer className="h-6 w-6 text-accent" /> In Ấn & Standee Sự Kiện Cưới
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Tự động kết xuất file in chuẩn A4/A5 để đặt trên từng bàn tiệc hoặc sảnh đón khách.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} className="bg-accent text-accent-foreground text-xs shadow-sm">
              <Printer className="mr-1.5 h-4 w-4" /> In / Lưu PDF (Ctrl + P)
            </Button>
          </div>
        </div>

        {/* Configuration Toolbar & Print Selector (hidden on print) */}
        <div className="print:hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Loại ấn phẩm cần in:</Label>
              <Tabs value={mode} onValueChange={(v) => setMode(v as PrintableMode)}>
                <TabsList className="grid grid-cols-3 w-full text-xs">
                  <TabsTrigger value="table-standee" className="text-[11px]">
                    Standee Bàn
                  </TabsTrigger>
                  <TabsTrigger value="invitation-card" className="text-[11px]">
                    Thiệp Giấy
                  </TabsTrigger>
                  <TabsTrigger value="welcome-board" className="text-[11px]">
                    Bảng Chào
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {mode === "table-standee" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs">Số bàn</Label>
                  <Input
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="01"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Tên nhóm / Phân loại bàn</Label>
                  <Input
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    placeholder="Nhà Trai - Bạn Đại Học"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Thông điệp hướng dẫn</Label>
                  <Input
                    value={welcomeText}
                    onChange={(e) => setWelcomeText(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </>
            )}

            <div className="rounded-xl border border-border/80 bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-accent" /> Hướng dẫn in ấn:
              </p>
              <p>• Khi cửa sổ in hiện ra, chọn mục <strong>Save as PDF</strong> hoặc máy in màu.</p>
              <p>• Chọn khổ giấy <strong>A4</strong>, tỷ lệ (Scale) <strong>100%</strong> hoặc <strong>Fit to page</strong>.</p>
            </div>
          </div>

          {/* Right Column: Live Printable Preview Canvas */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center p-4 bg-muted/30 rounded-2xl border border-border/80 overflow-hidden">
            <span className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-semibold">
              Bản xem trước trực quan (Print Preview)
            </span>

            {/* Render Printable Card Container */}
            <div className="w-full max-w-[480px] bg-white text-stone-900 shadow-2xl rounded-2xl overflow-hidden border border-stone-200 p-8 text-center space-y-6">
              {mode === "table-standee" && (
                <div className="space-y-5">
                  <div className="border-b-2 border-stone-800 pb-4">
                    <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
                      Wedding Celebration
                    </span>
                    <h3 className="font-serif text-3xl font-bold tracking-tight text-stone-900 mt-1">
                      {groomName} & {brideName}
                    </h3>
                  </div>

                  <div className="py-2">
                    <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
                      Kính mời Quý Khách
                    </span>
                    <div className="font-serif text-5xl font-black text-stone-900 my-2 tracking-tight">
                      BÀN {tableNumber}
                    </div>
                    <p className="text-sm font-medium text-stone-700">{tableName}</p>
                  </div>

                  <div className="rounded-2xl border-2 border-dashed border-stone-300 p-4 inline-block bg-stone-50">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="QR Code" className="h-44 w-44 mx-auto object-contain" />
                    ) : (
                      <div className="h-44 w-44 flex items-center justify-center bg-stone-200 text-xs">
                        Đang tạo mã QR...
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 max-w-[280px] mx-auto font-serif italic leading-relaxed">
                    "{welcomeText}"
                  </p>
                </div>
              )}

              {mode === "invitation-card" && (
                <div className="space-y-6 py-4">
                  <div className="border-b border-stone-300 pb-4">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-bold">
                      Thiệp Mời Thành Hôn
                    </span>
                    <h3 className="font-serif text-3xl font-bold text-stone-900 mt-2">
                      {groomName} & {brideName}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed max-w-[320px] mx-auto font-serif">
                    Trân trọng kính mời Quý khách đến tham dự Lễ Thành Hôn và nâng ly chúc phúc cho ngày chung đôi của chúng mình.
                  </p>

                  <div className="rounded-xl border border-stone-300 p-3 inline-block bg-stone-50">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="QR Code" className="h-36 w-36 mx-auto object-contain" />
                    ) : (
                      <div className="h-36 w-36 flex items-center justify-center bg-stone-200 text-xs">
                        QR Code
                      </div>
                    )}
                  </div>

                  <span className="block text-[11px] text-stone-500 font-serif">
                    Quét mã QR để xem bản đồ chỉ đường & xác nhận tham dự (RSVP)
                  </span>
                </div>
              )}

              {mode === "welcome-board" && (
                <div className="space-y-6 py-6 border-4 border-double border-stone-800 p-6 rounded-xl">
                  <span className="text-xs uppercase tracking-[0.35em] text-stone-600 font-bold">
                    Chào Mừng Quý Khách Đến Với
                  </span>
                  <h2 className="font-serif text-4xl font-bold text-stone-950">
                    Lễ Thành Hôn
                  </h2>
                  <div className="font-serif text-3xl text-stone-800 font-semibold italic">
                    {groomName} & {brideName}
                  </div>

                  <div className="py-2">
                    {qrDataUrl && (
                      <img src={qrDataUrl} alt="QR" className="h-36 w-36 mx-auto object-contain border p-2 rounded-lg bg-white" />
                    )}
                  </div>

                  <p className="text-xs text-stone-600 tracking-wider uppercase font-semibold">
                    Quét mã để Check-in & nhận vị trí số bàn tiệc
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
