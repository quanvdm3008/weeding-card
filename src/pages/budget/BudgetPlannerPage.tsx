import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  Plus,
  Trash2,
  PieChart as ChartIcon,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Pencil,
  Wallet,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvitationSubNav } from "@/components/wedding/InvitationSubNav";
import { getInvitation } from "@/lib/invitations";

export interface BudgetItem {
  id: string;
  category: string;
  name: string;
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  status: "PAID" | "DEPOSITED" | "UNPAID";
  note?: string;
}

const CATEGORIES = [
  { id: "venue", name: "Tiệc Cưới & Nhà Hàng", icon: "🍽️" },
  { id: "attire", name: "Trang Phục & Make-up", icon: "👗" },
  { id: "photo", name: "Chụp Ảnh & Phóng Sự", icon: "📸" },
  { id: "decor", name: "Trang Trí & Hoa Tươi", icon: "💐" },
  { id: "music", name: "Âm Thanh, Ánh Sáng & MC", icon: "🎤" },
  { id: "cards", name: "Thiệp Cưới & Quà Tặng", icon: "💌" },
  { id: "rings", name: "Nhẫn Cưới & Trang Sức", icon: "💍" },
  { id: "other", name: "Chi Phí Dự Phòng / Khác", icon: "🛡️" },
];

const INITIAL_EXPENSES: BudgetItem[] = [
  {
    id: "b1",
    category: "Tiệc Cưới & Nhà Hàng",
    name: "Đặt 30 bàn tiệc trọn gói (Trung tâm tiệc cưới)",
    estimatedCost: 150000000,
    actualCost: 145000000,
    paidAmount: 50000000,
    status: "DEPOSITED",
    note: "Đã cọc đợt 1, thanh toán phần còn lại trong ngày cưới",
  },
  {
    id: "b2",
    category: "Trang Phục & Make-up",
    name: "Thuê 2 váy cưới + 1 vest chú rể + Trang điểm 2 buổi",
    estimatedCost: 25000000,
    actualCost: 22000000,
    paidAmount: 22000000,
    status: "PAID",
    note: "Đã thanh toán 100%",
  },
  {
    id: "b3",
    category: "Chụp Ảnh & Phóng Sự",
    name: "Gói phóng sự cưới ngày cưới (2 máy chụp + 1 máy quay)",
    estimatedCost: 18000000,
    actualCost: 18000000,
    paidAmount: 5000000,
    status: "DEPOSITED",
    note: "Cọc 5tr, hoàn tất sau khi nhận file",
  },
  {
    id: "b4",
    category: "Trang Trí & Hoa Tươi",
    name: "Trang trí gia tiên + Backdrop hoa lụa cao cấp",
    estimatedCost: 20000000,
    actualCost: 19500000,
    paidAmount: 0,
    status: "UNPAID",
    note: "Thanh toán khi bàn giao sảnh",
  },
  {
    id: "b5",
    category: "Nhẫn Cưới & Trang Sức",
    name: "Cặp nhẫn cưới vàng trắng kim cương",
    estimatedCost: 15000000,
    actualCost: 14200000,
    paidAmount: 14200000,
    status: "PAID",
    note: "Đã nhận nhẫn",
  },
];

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export default function BudgetPlannerPage() {
  const { invitationId } = useParams<{ invitationId: string }>();
  const id = invitationId ?? "";

  const [targetBudget, setTargetBudget] = useState(250000000);
  const [items, setItems] = useState<BudgetItem[]>(INITIAL_EXPENSES);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [name, setName] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [actualCost, setActualCost] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [status, setStatus] = useState<"PAID" | "DEPOSITED" | "UNPAID">("UNPAID");
  const [note, setNote] = useState("");

  const invitationQuery = useQuery({
    queryKey: ["invitation-detail", id],
    queryFn: () => getInvitation(id),
    enabled: Boolean(id),
  });

  const invitation = invitationQuery.data;

  const summary = useMemo(() => {
    const totalEstimated = items.reduce((acc, curr) => acc + curr.estimatedCost, 0);
    const totalActual = items.reduce((acc, curr) => acc + curr.actualCost, 0);
    const totalPaid = items.reduce((acc, curr) => acc + curr.paidAmount, 0);
    const remainingDue = totalActual - totalPaid;
    const progressPercent = totalActual > 0 ? Math.min(100, Math.round((totalPaid / totalActual) * 100)) : 0;
    const budgetUsedPercent = targetBudget > 0 ? Math.round((totalActual / targetBudget) * 100) : 0;

    return {
      totalEstimated,
      totalActual,
      totalPaid,
      remainingDue,
      progressPercent,
      budgetUsedPercent,
    };
  }, [items, targetBudget]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên khoản chi!");
      return;
    }
    const newItem: BudgetItem = {
      id: `b-${Date.now()}`,
      category,
      name: name.trim(),
      estimatedCost: Number(estimatedCost) || 0,
      actualCost: Number(actualCost) || Number(estimatedCost) || 0,
      paidAmount: Number(paidAmount) || 0,
      status,
      note: note.trim(),
    };
    setItems((prev) => [newItem, ...prev]);
    setDialogOpen(false);
    setName("");
    setEstimatedCost("");
    setActualCost("");
    setPaidAmount("");
    setNote("");
    toast.success("Đã thêm khoản chi tiêu mới!");
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    toast.success("Đã xóa khoản chi!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <InvitationSubNav
        invitationId={id}
        title={invitation ? `${invitation.groomName} & ${invitation.brideName}` : "Hôn Lễ"}
        subtitle="Sổ tay quản lý ngân sách & Chi phí đám cưới"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex-1 w-full space-y-6">
        {/* Top Header & Quick Metrics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-display flex items-center gap-2">
              <Wallet className="h-6 w-6 text-accent" /> Quản Lý Ngân Sách Cưới
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Theo dõi dự toán chi phí, tiền đặt cọc và số dư cần thanh toán của toàn bộ sự kiện.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent text-accent-foreground text-xs shadow-sm">
                  <Plus className="mr-1.5 h-4 w-4" /> Thêm khoản chi mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle className="font-display text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-accent" /> Thêm Khoản Chi Tiêu Mới
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddItem} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Danh mục</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c.id} value={c.name} className="text-xs">
                            {c.icon} {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Tên khoản chi</Label>
                    <Input
                      placeholder="Ví dụ: Đặt cọc sảnh tiệc, hoa cưới..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Dự toán (VNĐ)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={estimatedCost}
                        onChange={(e) => setEstimatedCost(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Thực tế (VNĐ)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={actualCost}
                        onChange={(e) => setActualCost(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Đã thanh toán (VNĐ)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Trạng thái</Label>
                      <Select value={status} onValueChange={(v) => setStatus(v as "PAID" | "DEPOSITED" | "UNPAID")}>
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UNPAID" className="text-xs">Chưa thanh toán</SelectItem>
                          <SelectItem value="DEPOSITED" className="text-xs">Đã đặt cọc</SelectItem>
                          <SelectItem value="PAID" className="text-xs">Đã thanh toán đủ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Ghi chú</Label>
                    <Input
                      placeholder="Ghi chú đợt thanh toán, hợp đồng..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-accent text-accent-foreground text-xs">
                    Xác nhận thêm
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-1">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-accent" /> Ngân Sách Dự Kiến
            </span>
            <p className="text-lg sm:text-xl font-bold font-display">{formatVND(targetBudget)}</p>
            <span className="text-[11px] text-muted-foreground">Mục tiêu ban đầu</span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-1">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-blue-500" /> Tổng Chi Thực Tế
            </span>
            <p className="text-lg sm:text-xl font-bold font-display text-blue-600">{formatVND(summary.totalActual)}</p>
            <span className="text-[11px] text-muted-foreground">Đã sử dụng {summary.budgetUsedPercent}% ngân sách</span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-1">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Đã Thanh Toán
            </span>
            <p className="text-lg sm:text-xl font-bold font-display text-emerald-600">{formatVND(summary.totalPaid)}</p>
            <span className="text-[11px] text-muted-foreground">Đạt {summary.progressPercent}% tiến độ chi trả</span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-1">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-500" /> Còn Phải Trả
            </span>
            <p className="text-lg sm:text-xl font-bold font-display text-amber-600">{formatVND(summary.remainingDue)}</p>
            <span className="text-[11px] text-muted-foreground">Cần chuẩn bị trước ngày cưới</span>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Danh Sách Các Khoản Chi Tiêu ({items.length})</h3>
            <span className="text-xs text-muted-foreground">Được đồng bộ tự động</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 text-muted-foreground border-b border-border uppercase text-[10px] font-semibold">
                <tr>
                  <th className="px-4 py-3">Danh mục & Tên khoản chi</th>
                  <th className="px-4 py-3 text-right">Dự toán</th>
                  <th className="px-4 py-3 text-right">Thực tế</th>
                  <th className="px-4 py-3 text-right">Đã trả</th>
                  <th className="px-4 py-3 text-center">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">{item.category} {item.note ? `• ${item.note}` : ""}</p>
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium">{formatVND(item.estimatedCost)}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-foreground">{formatVND(item.actualCost)}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-emerald-600">{formatVND(item.paidAmount)}</td>
                    <td className="px-4 py-3.5 text-center">
                      <Badge
                        variant={item.status === "PAID" ? "default" : item.status === "DEPOSITED" ? "secondary" : "outline"}
                        className="text-[10px] px-2 py-0.5"
                      >
                        {item.status === "PAID" ? "Đã trả đủ" : item.status === "DEPOSITED" ? "Đã đặt cọc" : "Chưa trả"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteItem(item.id)}
                        className="h-7 w-7 text-destructive/70 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
