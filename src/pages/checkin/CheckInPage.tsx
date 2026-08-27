import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarCheck, CheckCircle2, ClipboardCheck, Clock, ListChecks, UserX, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { InvitationSubNav } from "@/components/wedding/InvitationSubNav";
import StatCard from "@/components/admin/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import { getInvitation } from "@/lib/invitations";
import { getApiErrorMessage } from "@/lib/api";
import { useAttendanceSummaryQuery, useCheckInGuestMutation, useGuestsQuery } from "@/features/guests/hooks";
import { guestKeys } from "@/features/guests/queryKeys";
import { useRealtimeChannel } from "@/hooks/useRealtimeChannel";

const PAGE_SIZE = 50;

const CheckInPage = () => {
  const { invitationId } = useParams<{ invitationId: string }>();
  const id = invitationId ?? "";
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  useRealtimeChannel(id ? `/topic/invitations/${id}/attendance` : null, () => {
    queryClient.invalidateQueries({ queryKey: guestKeys.all });
    queryClient.invalidateQueries({ queryKey: guestKeys.attendance(id) });
  });

  const invitationQuery = useQuery({
    queryKey: ["invitation-detail", id],
    queryFn: () => getInvitation(id),
    enabled: Boolean(id),
  });

  const guestsQuery = useGuestsQuery(id, { search: search || undefined, page: 1, pageSize: PAGE_SIZE });
  const summaryQuery = useAttendanceSummaryQuery(id);
  const checkIn = useCheckInGuestMutation(id);

  const invitation = invitationQuery.data;
  const guests = guestsQuery.data?.items ?? [];
  const summary = summaryQuery.data;

  const handleCheckIn = (guestId: string, fullName: string) => {
    checkIn.mutate(guestId, {
      onSuccess: () => toast.success(`Đã check-in thành công: ${fullName}`),
      onError: (error) => toast.error(getApiErrorMessage(error, "Không thể điểm danh khách")),
    });
  };

  if (!id) {
    return <div className="p-8 text-center text-muted-foreground">Không tìm thấy mã thiệp cưới.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <InvitationSubNav
        invitationId={id}
        title={invitation ? `${invitation.groomName} & ${invitation.brideName}` : "Hôn Lễ"}
        subtitle="Điểm danh & Check-in sảnh cưới"
      />
      <AdminPageHeader
        title="Điểm danh & Check-in Khách Mời"
        subtitle={invitation ? `${invitation.groomName} & ${invitation.brideName}` : undefined}
        actions={
          <Button asChild variant="outline" className="h-10 rounded-full">
            <Link to={`/invitations/${id}/rsvps`}>
              <ListChecks className="w-4 h-4 mr-1.5" /> Danh sách RSVP
            </Link>
          </Button>
        }
      />

      <main className="max-w-3xl mx-auto px-5 py-6 space-y-6">
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard index={0} label="Tổng khách mời" value={summary.totalGuests} icon={Users} />
            <StatCard index={1} label="Xác nhận đi" value={summary.acceptedCount} icon={CalendarCheck} accent="hsl(140 30% 45%)" />
            <StatCard index={2} label="Chưa phản hồi" value={summary.pendingOrOpenedCount} icon={Clock} accent="hsl(346 45% 55%)" />
            <StatCard index={3} label="Đã có mặt" value={summary.checkedInCount} icon={CheckCircle2} accent="hsl(140 30% 45%)" />
          </div>
        )}

        <Input
          placeholder="Tìm khách mời theo tên, số điện thoại, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11"
        />

        <div className="space-y-2">
          {guestsQuery.isLoading &&
            Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl border border-border/70 bg-card">
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded-md bg-muted animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                  <div className="h-3 w-28 rounded-md bg-muted animate-pulse" style={{ animationDelay: `${i * 80 + 40}ms` }} />
                </div>
                <div className="h-8 w-24 rounded-full bg-muted animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
              </div>
            ))}
          {!guestsQuery.isLoading && guests.length === 0 && (
            <div className="rounded-2xl border border-border/70 bg-card shadow-card">
              <EmptyState
                icon={UserX}
                title="Không tìm thấy khách mời"
                description={search ? `Không có khách nào khớp với từ khóa "${search}".` : "Thêm khách tại trang Quản lý khách mời để điểm danh."}
              />
            </div>
          )}
          {guests.map((guest) => (
            <div
              key={guest.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-border/70 bg-card transition-all duration-300 hover:shadow-card hover:border-accent/40"
            >
              <div>
                <p className="font-medium text-sm text-foreground">{guest.fullName}</p>
                <p className="text-xs text-muted-foreground">{guest.phone ?? guest.email ?? "—"}</p>
              </div>
              {guest.checkedInAtUtc ? (
                <Badge variant="default" className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đã có mặt
                </Badge>
              ) : (
                <Button className="h-9 font-medium" onClick={() => handleCheckIn(guest.id, guest.fullName)} disabled={checkIn.isPending}>
                  <ClipboardCheck className="w-4 h-4 mr-1.5" /> Điểm danh
                </Button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CheckInPage;
