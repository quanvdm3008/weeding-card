import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, CalendarCheck, CalendarX, Eye, Heart, HelpCircle, Inbox, ListChecks, MessageCircleHeart, Pencil, QrCode, Trash2, Users } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { InvitationSubNav } from "@/components/wedding/InvitationSubNav";
import StatCard from "@/components/admin/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import RsvpEditDialog from "@/components/rsvps/RsvpEditDialog";
import { deleteWish, getInvitation, getInvitationAnalyticsSummary, getPublicWishes, type WishDto } from "@/lib/invitations";
import { getApiErrorMessage } from "@/lib/api";
import { rsvpStatusFromValue, type RsvpDto, type RsvpStatus, type RsvpUpdateInput } from "@/lib/rsvps";
import { useCancelRsvpMutation, useRsvpStatisticsQuery, useRsvpsQuery, useUpdateRsvpMutation } from "@/features/rsvps/hooks";
import { rsvpKeys } from "@/features/rsvps/queryKeys";
import { useRealtimeChannel } from "@/hooks/useRealtimeChannel";

const STATUS_LABEL: Record<RsvpStatus, string> = {
  ATTENDING: "Attend",
  DECLINED: "Refuse",
  MAYBE: "Doubt",
};

const STATUS_VARIANT: Record<RsvpStatus, "default" | "destructive" | "secondary"> = {
  ATTENDING: "default",
  DECLINED: "destructive",
  MAYBE: "secondary",
};

const PAGE_SIZE = 20;

const RSVPDashboardPage = () => {
  const { invitationId } = useParams<{ invitationId: string }>();
  const id = invitationId ?? "";

  const [page, setPage] = useState(1);
  const [editingRsvp, setEditingRsvp] = useState<RsvpDto | null>(null);
  const [cancelingRsvp, setCancelingRsvp] = useState<RsvpDto | null>(null);
  const [deletingWish, setDeletingWish] = useState<WishDto | null>(null);
  const queryClient = useQueryClient();

  const invitationQuery = useQuery({
    queryKey: ["invitation-detail", id],
    queryFn: () => getInvitation(id),
    enabled: Boolean(id),
  });
  const analyticsQuery = useQuery({
    queryKey: ["invitation-analytics-summary", id],
    queryFn: () => getInvitationAnalyticsSummary(id),
    enabled: Boolean(id),
  });

  const slug = invitationQuery.data?.slug ?? "";
  const wishesQuery = useQuery({
    queryKey: ["invitation-wishes", slug],
    queryFn: () => getPublicWishes(slug),
    enabled: Boolean(slug),
  });

  const handleDeleteWish = () => {
    if (!deletingWish) return;
    deleteWish(deletingWish.id)
      .then(() => {
        toast.success("Deleted greetings");
        setDeletingWish(null);
        queryClient.invalidateQueries({ queryKey: ["invitation-wishes", slug] });
      })
      .catch((error) => toast.error(getApiErrorMessage(error, "Wishes cannot be deleted")));
  };

  const rsvpsQuery = useRsvpsQuery(id, page, PAGE_SIZE);
  const statsQuery = useRsvpStatisticsQuery(id);
  const updateRsvp = useUpdateRsvpMutation();
  const cancelRsvp = useCancelRsvpMutation();

  // Realtime RSVP and check-in events refresh the list and statistics automatically.
  useRealtimeChannel(id ? `/topic/invitations/${id}/attendance` : null, () => {
    queryClient.invalidateQueries({ queryKey: rsvpKeys.all });
    queryClient.invalidateQueries({ queryKey: ["invitation-analytics-summary", id] });
  });
  useRealtimeChannel(slug ? `/topic/invitations/${slug}/wishes` : null, () => {
    queryClient.invalidateQueries({ queryKey: ["invitation-wishes", slug] });
    queryClient.invalidateQueries({ queryKey: ["invitation-analytics-summary", id] });
  });

  const invitation = invitationQuery.data;
  const rsvps = rsvpsQuery.data?.items ?? [];
  const totalCount = rsvpsQuery.data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const stats = statsQuery.data;
  const analytics = analyticsQuery.data;
  const rsvpConversion = analytics?.pageViews ? Math.round((analytics.rsvps / analytics.pageViews) * 100) : 0;

  const chartData = stats
    ? Object.entries(stats.mealBreakdown).map(([meal, count]) => ({ meal, count }))
    : [];

  const handleUpdate = (input: RsvpUpdateInput) => {
    if (!editingRsvp) return;
    updateRsvp.mutate(
      { rsvpId: editingRsvp.id, input },
      {
        onSuccess: () => {
          toast.success("RSVP updated");
          setEditingRsvp(null);
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Unable to update RSVP")),
      },
    );
  };

  const handleCancel = () => {
    if (!cancelingRsvp) return;
    cancelRsvp.mutate(cancelingRsvp.id, {
      onSuccess: () => {
        toast.success("RSVP canceled");
        setCancelingRsvp(null);
      },
      onError: (error) => toast.error(getApiErrorMessage(error, "RSVP cannot be canceled")),
    });
  };

  if (!id) {
    return <div className="p-8 text-center text-muted-foreground">Missing card code.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <InvitationSubNav
        invitationId={id}
        title={invitation ? `${invitation.groomName} & ${invitation.brideName}` : "Hôn Lễ"}
        subtitle="Thống kê phản hồi RSVP & Lời chúc mừng"
      />
      <AdminPageHeader
        title="RSVP"
        subtitle={invitation ? `${invitation.groomName} & ${invitation.brideName}` : undefined}
        actions={
          <>
            <Link
              to={`/invitations/${id}/check-in`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              <ListChecks className="w-4 h-4" /> Check-in
            </Link>
            <Link
              to={`/invitations/${id}/guests`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              <Users className="w-4 h-4" /> Guest
            </Link>
          </>
        }
      />

      <main className="max-w-6xl mx-auto px-5 py-6 space-y-6">
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <StatCard index={0} label="Total response" value={stats.totalResponses} icon={Inbox} />
            <StatCard index={1} label="Attend" value={stats.attendingCount} icon={CalendarCheck} accent="hsl(140 30% 45%)" />
            <StatCard index={2} label="Refuse" value={stats.declinedCount} icon={CalendarX} accent="hsl(0 55% 55%)" />
            <StatCard index={3} label="Doubt" value={stats.maybeCount} icon={HelpCircle} accent="hsl(346 45% 55%)" />
            <StatCard index={4} label="Total number of guests" value={stats.totalGuestCount} icon={Users} />
          </div>
        )}

        {analytics && (
          <section className="card-luxury p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">Control Room</p>
                <h2 className="font-display text-lg font-semibold">Live funnel</h2>
              </div>
              <Badge variant="outline" className="gap-1">
                <Activity className="h-3.5 w-3.5" /> realtime
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              <StatCard index={0} label="Page views" value={analytics.pageViews} icon={Eye} />
              <StatCard index={1} label="QR scans" value={analytics.qrScans} icon={QrCode} />
              <StatCard index={2} label="RSVP submissions" value={analytics.rsvps} icon={CalendarCheck} accent="hsl(140 30% 45%)" />
              <StatCard index={3} label="wishes" value={analytics.wishes} icon={MessageCircleHeart} />
              <StatCard index={4} label="RSVP rate" value={`${rsvpConversion}%`} icon={Activity} accent="hsl(346 45% 55%)" />
            </div>
          </section>
        )}

        {chartData.length > 0 && (
          <div className="card-luxury p-5">
            <h2 className="font-display text-base font-semibold mb-3">Food statistics</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="meal" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#E8B4B8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="rounded-2xl border border-border/70 overflow-hidden bg-card shadow-card">
          {!rsvpsQuery.isLoading && rsvps.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No RSVP responses yet"
              description="When guests confirm their attendance via invitation, the response will appear here."
            />
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dish</TableHead>
                <TableHead>Come along</TableHead>
                <TableHead className="text-right">Act</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rsvpsQuery.isLoading && <TableSkeleton columns={6} />}
              {rsvps.map((rsvp) => {
                const status = rsvpStatusFromValue(rsvp.status);
                return (
                  <TableRow key={rsvp.id}>
                    <TableCell className="font-medium">{rsvp.guestName}</TableCell>
                    <TableCell>{rsvp.guestCount}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{rsvp.mealSelection ?? "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{rsvp.companions.length}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" title="Fix" onClick={() => setEditingRsvp(rsvp)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Cancel" onClick={() => setCancelingRsvp(rsvp)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{totalCount} responses</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Before
            </Button>
            <span>
              Page {page} / {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>

        {/* Wishes — moderation for card owner (Phase 6) */}
        {slug && (
          <section className="card-luxury p-5">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircleHeart className="w-4 h-4 text-accent" />
              <h2 className="font-display text-base font-semibold">Greetings from guests</h2>
              <span className="font-body text-xs text-muted-foreground">
                ({wishesQuery.data?.totalCount ?? 0})
              </span>
            </div>
            {(wishesQuery.data?.items.length ?? 0) === 0 ? (
              <p className="font-body text-sm text-muted-foreground py-4 text-center">
                There are no wishes from guests yet.
              </p>
            ) : (
              <ul className="divide-y divide-border/60">
                {wishesQuery.data!.items.map((wish) => (
                  <li key={wish.id} className="py-3 flex items-start gap-3">
                    <span className="text-lg shrink-0">{wish.emoji || "💌"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-foreground leading-relaxed">{wish.message}</p>
                      <p className="font-body text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        <span className="font-medium">{wish.authorName}</span>
                        <span className="inline-flex items-center gap-0.5">
                          <Heart className="w-3 h-3" /> {wish.likes}
                        </span>
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete greetings"
                      onClick={() => setDeletingWish(wish)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>

      <RsvpEditDialog
        open={Boolean(editingRsvp)}
        onOpenChange={(open) => !open && setEditingRsvp(null)}
        rsvp={editingRsvp}
        submitting={updateRsvp.isPending}
        onSubmit={handleUpdate}
      />

      <AlertDialog open={Boolean(deletingWish)} onOpenChange={(open) => !open && setDeletingWish(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete greetings?</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete the wishes of "{deletingWish?.authorName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWish}>Erase</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(cancelingRsvp)} onOpenChange={(open) => !open && setCancelingRsvp(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel RSVP?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the RSVP response of "{cancelingRsvp?.guestName}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel}>Cancel RSVP</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RSVPDashboardPage;
