import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Printer,
  Trash2,
  Users,
  Utensils,
  UserCheck,
  UserX,
  Search,
  Sparkles,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { InvitationSubNav } from "@/components/wedding/InvitationSubNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInvitation } from "@/lib/invitations";
import { useGuestGroupsQuery, useGuestsQuery } from "@/features/guests/hooks";
import { type GuestDto } from "@/lib/guests";

export interface WeddingTable {
  id: string;
  name: string;
  capacity: number;
  category: "VIP" | "Gia đình Nhà Trai" | "Gia đình Nhà Gái" | "Bạn Chú Rể" | "Bạn Cô Dâu" | "Đồng nghiệp" | "Khác";
  assignedGuestIds: string[];
}

const DEFAULT_TABLES: WeddingTable[] = [
  { id: "tbl-1", name: "Bàn VIP 01", capacity: 10, category: "VIP", assignedGuestIds: [] },
  { id: "tbl-2", name: "Bàn Họ Nhà Trai 01", capacity: 10, category: "Gia đình Nhà Trai", assignedGuestIds: [] },
  { id: "tbl-3", name: "Bàn Họ Nhà Gái 01", capacity: 10, category: "Gia đình Nhà Gái", assignedGuestIds: [] },
  { id: "tbl-4", name: "Bàn Bạn Chú Rể 01", capacity: 10, category: "Bạn Chú Rể", assignedGuestIds: [] },
  { id: "tbl-5", name: "Bàn Bạn Cô Dâu 01", capacity: 10, category: "Bạn Cô Dâu", assignedGuestIds: [] },
];

export const SeatingPlannerPage: React.FC = () => {
  const { invitationId } = useParams<{ invitationId: string }>();
  const id = invitationId ?? "";

  const { data: invitation } = useQuery({
    queryKey: ["INVITATION", id],
    queryFn: () => getInvitation(id),
    enabled: Boolean(id),
  });

  const { data: guestsData } = useGuestsQuery(id, { page: 1, pageSize: 200 });
  const { data: groups = [] } = useGuestGroupsQuery(id);

  const guests: GuestDto[] = guestsData?.items ?? [];
  const groupNameById = new Map(groups.map((group) => [group.id, group.name]));

  const storageKey = `sparkling-seating-${id}`;

  const [tables, setTables] = useState<WeddingTable[]>(() => {
    if (!id) return DEFAULT_TABLES;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as WeddingTable[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore localStorage reading errors
    }
    return DEFAULT_TABLES;
  });

  const [selectedTableId, setSelectedTableId] = useState<string>(() => tables[0]?.id ?? "tbl-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [newTableName, setNewTableName] = useState("");
  const [newTableCategory, setNewTableCategory] = useState<WeddingTable["category"]>("VIP");

  useEffect(() => {
    if (!id) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(tables));
    } catch {
      // Ignore localStorage writing errors
    }
  }, [id, storageKey, tables]);

  const selectedTable = tables.find((t) => t.id === selectedTableId);

  // Guests assigned to any table
  const allAssignedIds = new Set(tables.flatMap((t) => t.assignedGuestIds));
  const unassignedGuests = guests.filter((g) => !allAssignedIds.has(g.id));

  const filteredUnassignedGuests = unassignedGuests.filter((g) =>
    g.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTable = () => {
    if (!newTableName.trim()) {
      toast.error("Vui lòng nhập tên bàn tiệc!");
      return;
    }
    const newTbl: WeddingTable = {
      id: `tbl-${Date.now()}`,
      name: newTableName.trim(),
      capacity: 10,
      category: newTableCategory,
      assignedGuestIds: [],
    };
    setTables([...tables, newTbl]);
    setSelectedTableId(newTbl.id);
    setNewTableName("");
    toast.success(`Đã thêm ${newTbl.name} vào sơ đồ.`);
  };

  const handleDeleteTable = (tblId: string) => {
    const updated = tables.filter((t) => t.id !== tblId);
    setTables(updated);
    if (selectedTableId === tblId && updated.length > 0) {
      setSelectedTableId(updated[0].id);
    }
    toast.success("Đã xóa bàn tiệc.");
  };

  const handleAssignGuest = (guestId: string) => {
    if (!selectedTable) return;
    if (selectedTable.assignedGuestIds.length >= selectedTable.capacity) {
      toast.error("Bàn tiệc đã đủ số lượng chỗ ngồi!");
      return;
    }
    setTables((prev) =>
      prev.map((tbl) =>
        tbl.id === selectedTableId
          ? { ...tbl, assignedGuestIds: [...tbl.assignedGuestIds, guestId] }
          : tbl
      )
    );
    toast.success("Đã xếp khách vào bàn!");
  };

  const handleUnassignGuest = (guestId: string) => {
    setTables((prev) =>
      prev.map((tbl) =>
        tbl.id === selectedTableId
          ? {
              ...tbl,
              assignedGuestIds: tbl.assignedGuestIds.filter((gid) => gid !== guestId),
            }
          : tbl
      )
    );
    toast.success("Đã bỏ xếp chỗ khách mời.");
  };

  const handlePrint = () => {
    window.print();
  };

  const totalCapacity = tables.reduce((acc, t) => acc + t.capacity, 0);
  const totalAssigned = allAssignedIds.size;

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="print:hidden">
        <InvitationSubNav
          invitationId={id}
          title={invitation ? `${invitation.groomName} & ${invitation.brideName}` : "Hôn Lễ"}
          subtitle="Sơ đồ phân chia bàn tiệc & Chỗ ngồi"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            to={`/invitations/${id}/guests`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-4 h-4" /> Trở về danh sách khách mời
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5"
          >
            <Printer className="w-4 h-4" /> In sơ đồ bàn tiệc
          </Button>
        </div>

        <AdminPageHeader
          title="Sơ Đồ Bàn Tiệc & Xếp Chỗ Cưới"
          subtitle={invitation ? `${invitation.groomName} & ${invitation.brideName}` : undefined}
          actions={
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1 text-sm bg-card border-border">
                <Utensils className="w-3.5 h-3.5 mr-1.5 text-accent" />
                Tổng số bàn: {tables.length}
              </Badge>
              <Badge variant="default" className="px-3 py-1 text-sm bg-accent text-accent-foreground">
                <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                Đã xếp: {totalAssigned} / {totalCapacity} chỗ
              </Badge>
            </div>
          }
        />

        {/* Layout main */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Left Panel: Table List & Floor Plan */}
          <div className="lg:col-span-7 space-y-6">
            {/* Create new table form */}
            <div className="p-5 rounded-2xl border border-border bg-card flex flex-col sm:flex-row items-center gap-3 shadow-sm">
              <Input
                placeholder="Tên bàn mới (Ví dụ: Bàn Bạn Cấp 3, Bàn 08...)"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                className="flex-1 h-10"
              />
              <Select
                value={newTableCategory}
                onValueChange={(value) => setNewTableCategory(value as WeddingTable["category"])}
              >
                <SelectTrigger className="sm:w-[190px] h-10" aria-label="Phân loại bàn">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Gia đình Nhà Trai">Gia đình Nhà Trai</SelectItem>
                  <SelectItem value="Gia đình Nhà Gái">Gia đình Nhà Gái</SelectItem>
                  <SelectItem value="Bạn Chú Rể">Bạn Chú Rể</SelectItem>
                  <SelectItem value="Bạn Cô Dâu">Bạn Cô Dâu</SelectItem>
                  <SelectItem value="Đồng nghiệp">Đồng nghiệp</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddTable} className="w-full sm:w-auto h-10 bg-accent text-accent-foreground font-medium">
                <Plus className="w-4 h-4 mr-1" /> Thêm Bàn
              </Button>
            </div>

            {/* Grid of Tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tables.map((tbl) => {
                const isSelected = tbl.id === selectedTableId;
                const fillPct = Math.round((tbl.assignedGuestIds.length / tbl.capacity) * 100);

                return (
                  <motion.div
                    key={tbl.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedTableId(tbl.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedTableId(tbl.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all ${
                      isSelected
                        ? "border-accent bg-accent/10 shadow-gold ring-2 ring-accent/30"
                        : "border-border/70 bg-card hover:border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display text-lg font-bold text-foreground">{tbl.name}</h3>
                          <Badge variant="outline" className="text-[10px]">
                            {tbl.category}
                          </Badge>
                        </div>
                        <p className="font-body text-xs text-muted-foreground mt-1">
                          Sức chứa: {tbl.assignedGuestIds.length} / {tbl.capacity} khách
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTable(tbl.id);
                        }}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        title="Xóa bàn này"
                        aria-label={`Xóa ${tbl.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Visual seats round graphic */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {Array.from({ length: tbl.capacity }).map((_, i) => {
                        const isFilled = i < tbl.assignedGuestIds.length;
                        return (
                          <span
                            key={i}
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isFilled
                                ? "bg-accent text-accent-foreground shadow-sm"
                                : "bg-muted text-muted-foreground border border-dashed border-border"
                            }`}
                          >
                            {i + 1}
                          </span>
                        );
                      })}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all"
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Selected Table Details & Guest Picker */}
          <div className="lg:col-span-5 space-y-6">
            {selectedTable ? (
              <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">
                      {selectedTable.name}
                    </h2>
                    <p className="font-body text-xs text-muted-foreground">
                      Danh sách khách trong bàn ({selectedTable.assignedGuestIds.length}/{selectedTable.capacity} người)
                    </p>
                  </div>
                  <Badge variant="default" className="bg-accent text-accent-foreground">
                    {selectedTable.category}
                  </Badge>
                </div>

                {/* Assigned guests in current table */}
                <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedTable.assignedGuestIds.length === 0 ? (
                    <p className="font-body text-xs text-muted-foreground italic text-center py-4">
                      Bàn này chưa có khách nào. Chọn khách từ danh sách bên dưới để xếp chỗ!
                    </p>
                  ) : (
                    selectedTable.assignedGuestIds.map((gid) => {
                      const guest = guests.find((g) => g.id === gid);
                      return (
                        <div
                          key={gid}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-background/60"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent font-body text-xs font-bold flex items-center justify-center">
                              {guest?.fullName.charAt(0) ?? "?"}
                            </span>
                            <div>
                              <p className="font-body text-sm font-semibold text-foreground">
                                {guest?.fullName ?? "Khách mời"}
                              </p>
                              {guest?.groupId && (
                                <p className="font-body text-[11px] text-muted-foreground">
                                  {groupNameById.get(guest.groupId) ?? "Chưa phân nhóm"}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={() => handleUnassignGuest(gid)}
                            className="text-xs font-body text-destructive hover:underline"
                          >
                            <UserX className="w-3.5 h-3.5 mr-1" /> Rời bàn
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Unassigned Guests Search & Add Section */}
                <div className="mt-6 pt-4 border-t border-border">
                  <h3 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" /> Khách chưa xếp bàn ({unassignedGuests.length})
                  </h3>

                  <div className="relative mb-3">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm khách mời theo tên..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 text-xs h-10"
                    />
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {filteredUnassignedGuests.length === 0 ? (
                      <p className="font-body text-xs text-muted-foreground italic text-center py-4">
                        {unassignedGuests.length === 0
                          ? "Tất cả khách mời đã được xếp chỗ vào các bàn!"
                          : "Không tìm thấy khách mời phù hợp."}
                      </p>
                    ) : (
                      filteredUnassignedGuests.map((g) => (
                        <div
                          key={g.id}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-card hover:bg-muted/40 transition"
                        >
                          <div>
                            <p className="font-body text-sm font-medium text-foreground">{g.fullName}</p>
                            <p className="font-body text-[11px] text-muted-foreground">
                              {g.groupId ? groupNameById.get(g.groupId) ?? "Chưa phân nhóm" : "Chưa phân nhóm"}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAssignGuest(g.id)}
                            className="h-8 text-xs bg-accent text-accent-foreground font-medium"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" /> Xếp vào bàn này
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-border bg-card text-center text-muted-foreground font-body text-sm shadow-sm">
                Vui lòng chọn một bàn tiệc ở danh sách bên trái để quản lý xếp chỗ.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatingPlannerPage;
