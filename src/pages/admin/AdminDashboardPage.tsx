import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Archive,
  ArchiveRestore,
  BarChart3,
  CreditCard,
  Crown,
  DollarSign,
  ExternalLink,
  FileHeart,
  Globe2,
  Heart,
  ListChecks,
  Mail,
  MessageCircleHeart,
  PenLine,
  QrCode,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
  Activity,
  Store,
  ShieldCheck,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatCard from "@/components/admin/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  archiveAdminInvitation,
  getAdminAnalyticsSummary,
  getAdminBillingStats,
  getAdminStats,
  listAdminSubscriptions,
  listAdminInvitations,
  listAdminUsers,
  restoreAdminInvitation,
  listAdminLoginActivity,
  type AdminInvitationDto,
} from "@/lib/admin";
import { listAdminProviderProfiles, setAdminProviderStatus, type ProviderStatus } from "@/lib/providers";
import { getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { templates } from "@/data/templates";

const templateNameById = new Map<string, string>(templates.map((t) => [t.id, t.nameVi]));

const STATUS_BADGE: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  Published: { label: "Published", variant: "default" },
  Draft: { label: "Draft", variant: "secondary" },
  Archived: { label: "Removed", variant: "outline" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/* Invitation table */

const InvitationsTab = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["admin-invitations", page, search, status],
    queryFn: () => listAdminInvitations(page, search, status),
  });

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-invitations"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  const archiveMutation = useMutation({
    mutationFn: archiveAdminInvitation,
    onSuccess: (dto) => {
      toast.success(`Removed "${dto.groomName} & ${dto.brideName}" from the public site`);
      refresh();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Cannot remove card")),
  });

  const restoreMutation = useMutation({
    mutationFn: restoreAdminInvitation,
    onSuccess: () => {
      toast.success("Card restored to draft");
      refresh();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "The card cannot be restored")),
  });

  const items = query.data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil((query.data?.totalCount ?? 0) / 20));

  return (
    <div className="card-luxury overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row gap-2 border-b border-border/60">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by bride/groom name or slug..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={status || "all"}
          onValueChange={(value) => {
            setStatus(value === "all" ? "" : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="sm:w-[180px]" aria-label="Filter by status">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Archived">Removed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {query.isLoading && <TableSkeleton rows={6} columns={6} />}

      {!query.isLoading && items.length === 0 && (
        <EmptyState icon={FileHeart} title="There are no cards" description="Try changing your keywords or status filters." />
      )}

      {!query.isLoading && items.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>couple</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="hidden md:table-cell">Sample</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Update</TableHead>
                <TableHead className="text-right">Act</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((invitation) => (
                <InvitationRow
                  key={invitation.id}
                  invitation={invitation}
                  onArchive={() => archiveMutation.mutate(invitation.id)}
                  onRestore={() => restoreMutation.mutate(invitation.id)}
                  busy={archiveMutation.isPending || restoreMutation.isPending}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="p-3 flex items-center justify-end gap-2 border-t border-border/60 font-body text-sm">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Before
          </Button>
          <span className="text-muted-foreground">
            {page}/{totalPages}
          </span>
          <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

const InvitationRow = ({
  invitation,
  onArchive,
  onRestore,
  busy,
}: {
  invitation: AdminInvitationDto;
  onArchive: () => void;
  onRestore: () => void;
  busy: boolean;
}) => {
  const badge = STATUS_BADGE[invitation.status] ?? STATUS_BADGE.Draft;
  return (
    <TableRow>
      <TableCell className="font-medium">
        {invitation.groomName} & {invitation.brideName}
        {invitation.slug && <p className="font-body text-xs text-muted-foreground">/{invitation.slug}</p>}
      </TableCell>
      <TableCell className="font-body text-sm text-muted-foreground">{invitation.ownerEmail}</TableCell>
      <TableCell className="hidden md:table-cell font-body text-sm">
        {templateNameById.get(invitation.templateCode) ?? invitation.templateCode}
      </TableCell>
      <TableCell>
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </TableCell>
      <TableCell className="hidden lg:table-cell font-body text-sm text-muted-foreground">
        {formatDate(invitation.updatedAtUtc)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1.5">
          {invitation.slug && invitation.status === "Published" && (
            <Button size="sm" variant="ghost" asChild title="See public card">
              <a href={`/invitation/${invitation.slug}`} target="_blank" rel="noreferrer">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>
          )}
          {invitation.status !== "Archived" ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" disabled={busy} title="Remove the card from the public page">
                  <Archive className="w-3.5 h-3.5 mr-1.5" /> Remove
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove card from public page?</AlertDialogTitle>
                  <AlertDialogDescription>
                    The card "{invitation.groomName} & {invitation.brideName}" will change to "Removed" — the customer opens the link
                    public will no longer be able to view it. The card owner still keeps the data and the admin can restore it later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onArchive}>Remove card</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button size="sm" variant="outline" disabled={busy} onClick={onRestore} title="Restore to draft">
              <ArchiveRestore className="w-3.5 h-3.5 mr-1.5" /> Restore
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

/* User table */

const UsersTab = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["admin-users", page, search],
    queryFn: () => listAdminUsers(page, search),
  });

  const items = query.data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil((query.data?.totalCount ?? 0) / 20));

  return (
    <div className="card-luxury overflow-hidden">
      <div className="p-4 border-b border-border/60">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by email or display name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {query.isLoading && <TableSkeleton rows={6} columns={5} />}

      {!query.isLoading && items.length === 0 && (
        <EmptyState icon={Users} title="User not found" description="Try another keyword." />
      )}

      {!query.isLoading && items.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Display name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Card number</TableHead>
                <TableHead className="hidden lg:table-cell">Creation date</TableHead>
                <TableHead className="hidden xl:table-cell">Most recent login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell font-body text-sm">{user.displayName}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge key={role} variant={role === "Admin" ? "default" : "secondary"}>
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-body">{user.invitationCount}</TableCell>
                  <TableCell className="hidden lg:table-cell font-body text-sm text-muted-foreground">
                    {formatDate(user.createdAtUtc)}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell font-body text-sm text-muted-foreground">
                    {user.lastLoginAtUtc ? new Date(user.lastLoginAtUtc).toLocaleString("en-US") : "Not logged in yet"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="p-3 flex items-center justify-end gap-2 border-t border-border/60 font-body text-sm">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Before
          </Button>
          <span className="text-muted-foreground">
            {page}/{totalPages}
          </span>
          <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

/* Main page */

const BillingTab = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const statsQuery = useQuery({ queryKey: ["admin-billing-stats"], queryFn: getAdminBillingStats });
  const subscriptionsQuery = useQuery({
    queryKey: ["admin-billing-subscriptions", page, search],
    queryFn: () => listAdminSubscriptions(page, search),
  });

  const stats = statsQuery.data;
  const items = subscriptionsQuery.data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil((subscriptionsQuery.data?.totalCount ?? 0) / 20));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard index={0} label="Free active" value={stats?.activeFree ?? "—"} icon={CreditCard} />
        <StatCard index={1} label="Pro active" value={stats?.activePro ?? "—"} icon={Sparkles} />
        <StatCard index={2} label="Business" value={stats?.activeBusiness ?? "—"} icon={Crown} />
        <StatCard index={3} label="Revenue" value={stats ? `$${(stats.revenueCents / 100).toFixed(0)}` : "—"} icon={DollarSign} />
      </div>

      <div className="card-luxury overflow-hidden">
        <div className="p-4 border-b border-border/60">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by email, plan, or status..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {subscriptionsQuery.isLoading && <TableSkeleton rows={6} columns={6} />}

        {!subscriptionsQuery.isLoading && items.length === 0 && (
          <EmptyState icon={CreditCard} title="No subscriptions" description="Paid subscriptions will appear after Stripe webhooks are received." />
        )}

        {!subscriptionsQuery.isLoading && items.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Owner</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Period end</TableHead>
                  <TableHead className="hidden md:table-cell">Stripe customer</TableHead>
                  <TableHead className="hidden md:table-cell">Stripe subscription</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((subscription) => (
                  <TableRow key={`${subscription.ownerUserId}-${subscription.planCode}`}>
                    <TableCell className="font-medium">{subscription.ownerEmail}</TableCell>
                    <TableCell>
                      <Badge variant={subscription.planCode === "Business" ? "default" : "secondary"}>{subscription.planCode}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={subscription.status === "active" ? "default" : subscription.status === "PAST_DUE" ? "secondary" : "outline"}>
                        {subscription.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell font-body text-sm text-muted-foreground">
                      {subscription.currentPeriodEndUtc ? formatDate(subscription.currentPeriodEndUtc) : "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs">{subscription.externalCustomerId ?? "—"}</TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs">{subscription.externalSubscriptionId ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-3 flex items-center justify-end gap-2 border-t border-border/60 font-body text-sm">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <span className="text-muted-foreground">{page}/{totalPages}</span>
            <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const AnalyticsTab = () => {
  const query = useQuery({ queryKey: ["admin-analytics-summary"], queryFn: getAdminAnalyticsSummary });
  const s = query.data;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
      <StatCard index={0} label="Page views" value={s?.pageViews ?? "—"} icon={BarChart3} />
      <StatCard index={1} label="QR scans" value={s?.qrScans ?? "—"} icon={QrCode} />
      <StatCard index={2} label="RSVP" value={s?.rsvps ?? "—"} icon={ListChecks} />
      <StatCard index={3} label="wishes" value={s?.wishes ?? "—"} icon={MessageCircleHeart} />
      <StatCard index={4} label="Wish likes" value={s?.wishLikes ?? "—"} icon={Heart} />
    </div>
  );
};

const LoginActivityTab = () => {
  const [page, setPage] = useState(1);
  const query = useQuery({ queryKey: ["admin-login-activity", page], queryFn: () => listAdminLoginActivity(page) });
  const items = query.data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil((query.data?.totalCount ?? 0) / 20));
  return (
    <div className="card-luxury overflow-hidden">
      {query.isLoading && <TableSkeleton rows={6} columns={6} />}
      {!query.isLoading && !items.length && <EmptyState icon={Activity} title="No login activity yet" description="New logins will appear here." />}
      {!!items.length && <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>User</TableHead><TableHead>Work</TableHead><TableHead>Result</TableHead><TableHead className="hidden md:table-cell">IP</TableHead><TableHead className="hidden lg:table-cell">Device</TableHead><TableHead>Time</TableHead></TableRow></TableHeader><TableBody>
        {items.map((item) => <TableRow key={item.eventId}><TableCell><p className="font-medium">{item.email}</p><p className="text-xs text-muted-foreground">{item.roles.join(", ")}</p></TableCell><TableCell>{item.action === "LOGIN_SUCCESS" ? "Log in" : item.action === "LOGIN_FAILED" ? "Wrong information" : "Sign out"}</TableCell><TableCell><Badge variant={item.outcome === "SUCCESS" ? "default" : "secondary"}>{item.outcome}</Badge></TableCell><TableCell className="hidden font-mono text-xs md:table-cell">{item.ipHint ?? "—"}</TableCell><TableCell className="hidden max-w-[260px] truncate text-xs text-muted-foreground lg:table-cell" title={item.userAgent ?? undefined}>{item.userAgent ?? "—"}</TableCell><TableCell className="whitespace-nowrap text-sm text-muted-foreground">{new Date(item.occurredAtUtc).toLocaleString("en-US")}</TableCell></TableRow>)}
      </TableBody></Table></div>}
      {totalPages > 1 && <div className="flex items-center justify-end gap-2 border-t p-3"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><span className="text-sm text-muted-foreground">{page}/{totalPages}</span><Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button></div>}
    </div>
  );
};

const ProvidersTab = () => {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["admin-providers"], queryFn: listAdminProviderProfiles });
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProviderStatus }) => setAdminProviderStatus(id, status),
    onSuccess: () => { toast.success("Supplier status updated"); void queryClient.invalidateQueries({ queryKey: ["admin-providers"] }); },
    onError: (error) => toast.error(getApiErrorMessage(error, "Unable to update provider")),
  });
  const items = query.data ?? [];
  return <div className="card-luxury overflow-hidden">{query.isLoading && <TableSkeleton rows={5} columns={5} />}{!query.isLoading && !items.length && <EmptyState icon={Store} title="No supplier yet" description="The registered partner account will appear here." />}{!!items.length && <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Trademark</TableHead><TableHead>Area</TableHead><TableHead>Contact</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Browse</TableHead></TableRow></TableHeader><TableBody>{items.map((provider) => <TableRow key={provider.id}><TableCell><p className="font-medium">{provider.businessName}</p><p className="max-w-xs truncate text-xs text-muted-foreground">{provider.description}</p></TableCell><TableCell>{provider.location || "—"}</TableCell><TableCell>{provider.phone || "—"}</TableCell><TableCell><Badge variant={provider.status === "VERIFIED" ? "default" : "secondary"}>{provider.status}</Badge></TableCell><TableCell><div className="flex justify-end gap-2">{provider.status !== "VERIFIED" && <Button size="sm" onClick={() => mutation.mutate({ id: provider.id, status: "VERIFIED" })}><ShieldCheck className="mr-1.5 h-4 w-4" /> Verify</Button>}{provider.status !== "SUSPENDED" && <Button size="sm" variant="outline" onClick={() => mutation.mutate({ id: provider.id, status: "SUSPENDED" })}>Temporarily locked</Button>}</div></TableCell></TableRow>)}</TableBody></Table></div>}</div>;
};

const AdminDashboardPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.roles?.includes("Admin") ?? false;

  const statsQuery = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
    enabled: isAdmin,
  });

  // Server blocks hasRole(ADMIN) at all endpoints — gate client just for clear UX
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AdminPageHeader title="System administration" backTo="/dashboard" backLabel="Dashboard" />
        <main className="max-w-6xl mx-auto px-5 py-10">
          <div className="card-luxury">
            <EmptyState
              icon={ShieldAlert}
              title="No access"
              description="Your account does not have the ADMIN role. Log in with the admin account (dev: admin@weddinginvitation.local / Admin@123)."
            />
          </div>
        </main>
      </div>
    );
  }

  const s = statsQuery.data;

  return (
    <div className="min-h-screen bg-background">
      <AdminPageHeader
        title="System administration"
        subtitle={user?.email}
        backTo="/dashboard"
        backLabel="Dashboard"
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-5 py-6 sm:py-8 flex flex-col gap-6">
        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard index={0} label="User" value={s?.totalUsers ?? "—"} icon={Users} />
          <StatCard index={1} label="General card" value={s?.totalInvitations ?? "—"} icon={Mail} />
          <StatCard index={2} label="Published" value={s?.publishedInvitations ?? "—"} icon={Globe2} accent="hsl(140 30% 45%)" />
          <StatCard index={3} label="Draft" value={s?.draftInvitations ?? "—"} icon={PenLine} accent="hsl(220 15% 55%)" />
          <StatCard index={4} label="Guest" value={s?.totalGuests ?? "—"} icon={Users} accent="hsl(346 45% 55%)" />
          <StatCard index={5} label="RSVP" value={s?.totalRsvps ?? "—"} icon={ListChecks} accent="hsl(346 45% 55%)" />
          <StatCard index={6} label="Wish" value={s?.totalWishes ?? "—"} icon={MessageCircleHeart} accent="hsl(346 45% 55%)" />
          <StatCard index={7} label="Removed" value={s?.archivedInvitations ?? "—"} icon={Archive} accent="hsl(0 55% 55%)" />
        </div>

        {/* Administration panel */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }}>
          <Tabs defaultValue="invitations">
            <TabsList className="mb-4 h-auto flex-wrap justify-start">
              <TabsTrigger value="invitations">
                <FileHeart className="w-4 h-4 mr-1.5" /> Wedding invitation
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="w-4 h-4 mr-1.5" /> User
              </TabsTrigger>
              <TabsTrigger value="Billing">
                <CreditCard className="w-4 h-4 mr-1.5" /> Billing
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-1.5" /> Analytics
              </TabsTrigger>
              <TabsTrigger value="providers">
                <Store className="w-4 h-4 mr-1.5" /> Supplier
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Activity className="w-4 h-4 mr-1.5" /> Log in
              </TabsTrigger>
            </TabsList>
            <TabsContent value="invitations">
              <InvitationsTab />
            </TabsContent>
            <TabsContent value="users">
              <UsersTab />
            </TabsContent>
            <TabsContent value="Billing">
              <BillingTab />
            </TabsContent>
            <TabsContent value="analytics">
              <AnalyticsTab />
            </TabsContent>
            <TabsContent value="providers">
              <ProvidersTab />
            </TabsContent>
            <TabsContent value="activity">
              <LoginActivityTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
