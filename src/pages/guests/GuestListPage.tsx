import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Download,
  Link as LinkIcon,
  ListChecks,
  Pencil,
  Plus,
  QrCode,
  Settings2,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { InvitationSubNav } from "@/components/wedding/InvitationSubNav";
import EmptyState from "@/components/ui/EmptyState";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import GuestFormDialog from "@/components/guests/GuestFormDialog";
import GuestImportDialog from "@/components/guests/GuestImportDialog";
import GuestQRCodeDialog from "@/components/guests/GuestQRCodeDialog";
import GuestGroupTagManagerDialog from "@/components/guests/GuestGroupTagManagerDialog";
import { getInvitation } from "@/lib/invitations";
import { getApiErrorMessage } from "@/lib/api";
import {
  buildGuestRsvpLink,
  exportGuestsCsv,
  guestStatusFromValue,
  type GuestDto,
  type GuestStatus,
} from "@/lib/guests";
import {
  useCreateGuestGroupMutation,
  useCreateGuestMutation,
  useCreateGuestTagMutation,
  useDeleteGuestGroupMutation,
  useDeleteGuestMutation,
  useDeleteGuestTagMutation,
  useGuestGroupsQuery,
  useGuestTagsQuery,
  useGuestsQuery,
  useImportGuestsMutation,
  useUpdateGuestMutation,
} from "@/features/guests/hooks";
import { guestKeys } from "@/features/guests/queryKeys";
import { useRealtimeChannel } from "@/hooks/useRealtimeChannel";
import type { GuestImportRowInput } from "@/lib/guests";

const STATUS_LABEL: Record<GuestStatus, string> = {
  PENDING: "Chờ phản hồi",
  OPENED: "Đã xem",
  ACCEPTED: "Tham dự",
  DECLINED: "Từ chối",
};

const STATUS_VARIANT: Record<GuestStatus, "secondary" | "default" | "destructive" | "outline"> = {
  PENDING: "secondary",
  OPENED: "outline",
  ACCEPTED: "default",
  DECLINED: "destructive",
};

const PAGE_SIZE = 20;

const GuestListPage = () => {
  const { invitationId } = useParams<{ invitationId: string }>();
  const id = invitationId ?? "";
  const queryClient = useQueryClient();

  // Realtime check-in and RSVP events refresh the list and attendance statistics automatically.
  useRealtimeChannel(id ? `/topic/invitations/${id}/attendance` : null, () => {
    queryClient.invalidateQueries({ queryKey: guestKeys.all });
  });

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<string | undefined>(undefined);
  const [tagFilter, setTagFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<GuestStatus | undefined>(undefined);

  const [formOpen, setFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestDto | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [linkGuest, setLinkGuest] = useState<GuestDto | null>(null);
  const [deletingGuest, setDeletingGuest] = useState<GuestDto | null>(null);

  const invitationQuery = useQuery({
    queryKey: ["invitation-detail", id],
    queryFn: () => getInvitation(id),
    enabled: Boolean(id),
  });

  const guestsQuery = useGuestsQuery(id, {
    search: search || undefined,
    groupId: groupFilter,
    tagId: tagFilter,
    status: statusFilter,
    page,
    pageSize: PAGE_SIZE,
  });
  const groupsQuery = useGuestGroupsQuery(id);
  const tagsQuery = useGuestTagsQuery(id);

  const createGuest = useCreateGuestMutation(id);
  const updateGuest = useUpdateGuestMutation(id);
  const deleteGuest = useDeleteGuestMutation(id);
  const importGuests = useImportGuestsMutation(id);
  const createGroup = useCreateGuestGroupMutation(id);
  const deleteGroup = useDeleteGuestGroupMutation(id);
  const createTag = useCreateGuestTagMutation(id);
  const deleteTag = useDeleteGuestTagMutation(id);

  const groups = groupsQuery.data ?? [];
  const tags = tagsQuery.data ?? [];
  const guests = guestsQuery.data?.items ?? [];
  const totalCount = guestsQuery.data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const invitation = invitationQuery.data;

  const groupNameById = new Map(groups.map((g) => [g.id, g.name]));

  const handleSubmitGuest = (values: {
    fullName: string;
    phone: string;
    email: string;
    note: string;
    groupId: string | null;
    tagIds: string[];
    status: GuestStatus;
  }) => {
    const input = {
      fullName: values.fullName.trim(),
      phone: values.phone.trim() || null,
      email: values.email.trim() || null,
      note: values.note.trim() || null,
      groupId: values.groupId,
      tagIds: values.tagIds,
    };

    const mutation = editingGuest
      ? updateGuest.mutateAsync({ guestId: editingGuest.id, input: { ...input, status: values.status } })
      : createGuest.mutateAsync(input);

    mutation
      .then(() => {
        toast.success(editingGuest ? "Đã cập nhật khách mời" : "Đã thêm khách mời");
        setFormOpen(false);
        setEditingGuest(null);
      })
      .catch((error) => toast.error(getApiErrorMessage(error, "Không thể lưu thông tin khách mời")));
  };

  const handleImport = (rows: GuestImportRowInput[]) => {
    importGuests
      .mutateAsync(rows)
      .then((result) => {
        toast.success(`Nhập danh sách thành công: ${result.successCount}/${result.totalRows} khách`);
        if (result.failureCount > 0) {
          toast.error(`${result.failureCount} dòng lỗi: ${result.errors[0]}`);
        }
        setImportOpen(false);
      })
      .catch((error) => toast.error(getApiErrorMessage(error, "Không thể nhập danh sách khách")));
  };

  const handleExport = () => {
    exportGuestsCsv(id, { groupId: groupFilter, tagId: tagFilter, status: statusFilter })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "danh-sach-khach-moi.csv";
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch((error) => toast.error(getApiErrorMessage(error, "Không thể xuất danh sách khách")));
  };

  const handleDeleteConfirmed = () => {
    if (!deletingGuest) return;
    deleteGuest
      .mutateAsync(deletingGuest.id)
      .then(() => {
        toast.success("Đã xóa khách mời");
        setDeletingGuest(null);
      })
      .catch((error) => toast.error(getApiErrorMessage(error, "Không thể xóa khách mời")));
  };

  if (!id) {
    return <div className="p-8 text-center text-muted-foreground">Không tìm thấy mã thiệp cưới.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <InvitationSubNav
        invitationId={id}
        title={invitation ? `${invitation.groomName} & ${invitation.brideName}` : "Hôn Lễ"}
        subtitle="Quản lý danh sách khách mời"
      />
      <AdminPageHeader
        title="Quản lý khách mời"
        subtitle={invitation ? `${invitation.groomName} & ${invitation.brideName}` : undefined}
        actions={
          <>
            <Link
              to={`/invitations/${id}/seating`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent font-body text-sm font-semibold hover:bg-accent/25 transition-colors"
            >
              Sơ đồ bàn tiệc
            </Link>
            <Link
              to={`/invitations/${id}/rsvps`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              <ListChecks className="w-4 h-4" /> Danh sách RSVP
            </Link>
            <Link
              to={`/invitations/${id}/check-in`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Check-in
            </Link>
            <Button variant="outline" size="sm" onClick={() => setManagerOpen(true)}>
              <Settings2 className="w-4 h-4 mr-1.5" /> Nhóm & Thẻ tag
            </Button>
          </>
        }
      />

      <main className="max-w-6xl mx-auto px-5 py-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Tìm theo tên, số điện thoại, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />

          <Select
            value={groupFilter ?? "all"}
            onValueChange={(value) => {
              setGroupFilter(value === "all" ? undefined : value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tất cả các nhóm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả các nhóm</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={tagFilter ?? "all"}
            onValueChange={(value) => {
              setTagFilter(value === "all" ? undefined : value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tất cả các thẻ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả các thẻ</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter ?? "all"}
            onValueChange={(value) => {
              setStatusFilter(value === "all" ? undefined : (value as GuestStatus));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {Object.entries(STATUS_LABEL).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1" />

          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1.5" /> Xuất file CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
            <Upload className="w-4 h-4 mr-1.5" /> Nhập Excel/CSV
          </Button>
          <Button
            size="sm"
            data-testid="guest-add"
            onClick={() => {
              setEditingGuest(null);
              setFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Thêm khách mời
          </Button>
        </div>

        <div className="rounded-2xl border border-border/70 overflow-hidden bg-card shadow-card">
          {!guestsQuery.isLoading && guests.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Chưa có khách mời nào"
              description="Thêm khách mời đầu tiên hoặc nhập danh sách từ file CSV để bắt đầu quản lý."
              action={
                <Button
                  size="sm"
                  data-testid="guest-add-empty"
                  onClick={() => {
                    setEditingGuest(null);
                    setFormOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Thêm khách mời đầu tiên
                </Button>
              }
            />
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Nhóm</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guestsQuery.isLoading && <TableSkeleton columns={5} />}
              {guests.map((guest) => {
                const status = guestStatusFromValue(guest.status);
                return (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.fullName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {guest.phone ?? guest.email ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">{guest.groupId ? groupNameById.get(guest.groupId) ?? "—" : "—"}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Xem mã QR & Link mời riêng"
                        data-testid={`guest-qr-${guest.id}`}
                        disabled={!invitation?.slug}
                        onClick={() => setLinkGuest(guest)}
                      >
                        <QrCode className="w-4 h-4 text-accent" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Chỉnh sửa thông tin"
                        onClick={() => {
                          setEditingGuest(guest);
                          setFormOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Xóa khách" onClick={() => setDeletingGuest(guest)}>
                        <Trash2 className="w-4 h-4 text-destructive/70 hover:text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          )}
        </div>

        {!invitation?.slug && (
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5" /> Hãy xuất bản thiệp để tạo link mời và mã QR định danh riêng cho từng khách mời.
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Tổng cộng {totalCount} khách mời</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Trang trước
            </Button>
            <span>
              Trang {page} / {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Trang sau
            </Button>
          </div>
        </div>
      </main>

      <GuestFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingGuest(null);
        }}
        guest={editingGuest}
        groups={groups}
        tags={tags}
        submitting={createGuest.isPending || updateGuest.isPending}
        onSubmit={handleSubmitGuest}
      />

      <GuestImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        submitting={importGuests.isPending}
        onSubmit={handleImport}
      />

      <GuestGroupTagManagerDialog
        open={managerOpen}
        onOpenChange={setManagerOpen}
        groups={groups}
        tags={tags}
        onCreateGroup={(name) =>
          createGroup.mutateAsync(name).catch((error) => toast.error(getApiErrorMessage(error, "Không thể tạo nhóm")))
        }
        onDeleteGroup={(groupId) =>
          deleteGroup.mutateAsync(groupId).catch((error) => toast.error(getApiErrorMessage(error, "Không thể xóa nhóm")))
        }
        onCreateTag={(name, color) =>
          createTag.mutateAsync({ name, color }).catch((error) => toast.error(getApiErrorMessage(error, "Không thể tạo thẻ tag")))
        }
        onDeleteTag={(tagId) =>
          deleteTag.mutateAsync(tagId).catch((error) => toast.error(getApiErrorMessage(error, "Không thể xóa thẻ tag")))
        }
      />

      {linkGuest && invitation?.slug && (
        <GuestQRCodeDialog
          open={Boolean(linkGuest)}
          onOpenChange={(open) => !open && setLinkGuest(null)}
          guestName={linkGuest.fullName}
          link={buildGuestRsvpLink(invitation.slug, linkGuest.token)}
        />
      )}

      <AlertDialog open={Boolean(deletingGuest)} onOpenChange={(open) => !open && setDeletingGuest(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa khách mời?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khách mời "{deletingGuest?.fullName}" khỏi danh sách không? Thao tác này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirmed}>Xóa khách mời</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GuestListPage;
