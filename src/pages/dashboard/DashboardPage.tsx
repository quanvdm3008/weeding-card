import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  Heart,
  LayoutGrid,
  LogOut,
  Mail,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import TemplateCard from "@/features/templates/components/TemplateCard";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { BillingSummary } from "@/features/dashboard/components/BillingSummary";
import { InvitationCard } from "@/features/dashboard/components/InvitationCard";
import { CatalogControls } from "@/features/templates/components/CatalogControls";
import { filterAndSortTemplates, templateCatalog, type TemplateSort } from "@/features/templates/catalog/templateCatalog";
import { useTemplateFavorites } from "@/features/templates/store/templateFavoritesStore";
import { getBillingAccount } from "@/lib/billing";
import { listMyInvitations } from "@/lib/invitations";
import { useAuthStore } from "@/store/authStore";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import { SupportChatWidget } from "@/features/dashboard/components/SupportChatWidget";

export const DashboardPage = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const reset = useWeddingConfig((state) => state.reset);
  const favoriteIds = useTemplateFavorites((state) => state.favoriteIds);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<TemplateSort>("featured");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const invitationsQuery = useQuery({ queryKey: ["my-invitations"], queryFn: listMyInvitations });
  const billingQuery = useQuery({ queryKey: ["billing-account"], queryFn: getBillingAccount });

  const filteredTemplates = filterAndSortTemplates(templateCatalog, {
    query,
    category,
    sort,
    favorites: favoritesOnly ? new Set(favoriteIds) : undefined,
  });

  const summary = useMemo(() => {
    const invitations = invitationsQuery.data ?? [];
    return {
      projects: invitations.length,
      published: invitations.filter((item) => item.status === "Published").length,
      guests: invitations.reduce((total, item) => total + item.guestCount, 0),
      rsvps: invitations.reduce((total, item) => total + item.rsvpCount, 0),
    };
  }, [invitationsQuery.data]);

  const browseTemplates = () => {
    reset();
    document.getElementById("template-marketplace")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const logout = async () => {
    await signOut();
    toast.success("Đã đăng xuất");
    navigate("/");
  };

  const stats = [
    { label: "Dự án thiệp", value: summary.projects, icon: Mail, tone: "bg-rose-50 text-rose-700" },
    { label: "Đã xuất bản", value: summary.published, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Khách mời", value: summary.guests, icon: Users, tone: "bg-sky-50 text-sky-700" },
    { label: "Phản hồi RSVP", value: summary.rsvps, icon: Heart, tone: "bg-amber-50 text-amber-700" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur">
        <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-foreground text-background"><Heart className="h-3.5 w-3.5 fill-current" /></span>
            <span className="truncate font-display text-lg font-semibold">Mireia Studio</span>
            <span className="hidden border-l border-border pl-3 text-[10px] font-semibold uppercase text-muted-foreground sm:inline">Workspace</span>
          </Link>
          <div className="flex items-center gap-2">
            {user?.roles?.includes("Admin") && (
              <Button size="sm" variant="outline" asChild className="hidden sm:inline-flex"><Link to="/admin"><ShieldCheck className="mr-1.5 h-4 w-4" />Quản trị hệ thống</Link></Button>
            )}
            <Button size="sm" onClick={browseTemplates} data-testid="dashboard-create-card"><Plus className="mr-1.5 h-4 w-4" /><span className="hidden sm:inline">Tạo thiệp cưới</span><span className="sm:hidden">Tạo mới</span></Button>
            <Button type="button" size="icon" variant="outline" onClick={() => void logout()} title="Đăng xuất" aria-label="Đăng xuất">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Main Dashboard Content */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            {/* Header & Quick Stats */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <p className="text-[11px] font-semibold uppercase text-muted-foreground">Không gian thiết kế</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-semibold sm:text-4xl">Thiệp cưới của bạn</h1>
                  <p className="mt-1 text-sm text-muted-foreground">{user?.email || "Tài khoản Mireia"}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{favoriteIds.length} mẫu yêu thích</span>
                  <span className="h-4 w-px bg-border" />
                  <Button type="button" variant="link" size="sm" onClick={browseTemplates} className="h-10 px-0 font-semibold text-foreground hover:text-accent">Khám phá mẫu thiệp</Button>
                </div>
              </div>
              
              <section className="mt-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:grid-cols-4">
                {stats.map(({ label, value, icon: Icon, tone }, index) => (
                  <div key={label} className={`flex items-center gap-3 p-3.5 sm:p-4 ${index % 2 === 0 ? "border-r border-border" : ""} ${index < 2 ? "border-b border-border" : ""} lg:border-b-0 lg:border-r-0 ${index ? "lg:border-l lg:border-border" : ""}`}>
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tone}`}><Icon className="h-4 w-4" /></span>
                    <div>
                      <p className="text-xl font-bold leading-none">{value}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground font-medium">{label}</p>
                    </div>
                  </div>
                ))}
              </section>
            </div>

            {/* Recent Projects */}
            <section className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">Tiếp tục chỉnh sửa</p>
                  <h2 className="mt-1 flex items-center gap-2 whitespace-nowrap font-display text-2xl font-semibold"><Mail className="h-5 w-5" />Thiệp gần đây</h2>
                </div>
                {!!invitationsQuery.data?.length && <span className="hidden text-xs text-muted-foreground md:inline">Cập nhật và quản lý khách mời trực tiếp trên từng thiệp</span>}
              </div>

              {invitationsQuery.isLoading && (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-64 animate-pulse rounded-2xl bg-muted" />)}</div>
              )}
              {invitationsQuery.isError && (
                <div className="rounded-2xl border border-border bg-card p-7 text-center">
                  <AlertTriangle className="mx-auto mb-2 h-7 w-7 text-amber-500" />
                  <p className="text-sm font-semibold">Không thể kết nối đến máy chủ</p>
                  <Button size="sm" onClick={() => void invitationsQuery.refetch()} variant="outline" className="mt-4"><RefreshCcw className="mr-1.5 h-3.5 w-3.5" />Thử lại</Button>
                </div>
              )}
              {!invitationsQuery.isLoading && !invitationsQuery.isError && !invitationsQuery.data?.length && (
                <EmptyState icon={Sparkles} title="Bạn chưa có thiệp cưới nào" description="Bắt đầu từ một mẫu thiệp tuyệt đẹp và cá nhân hóa câu chuyện tình yêu của riêng bạn." action={<Button onClick={browseTemplates} className="bg-accent text-accent-foreground"><Plus className="mr-2 h-4 w-4" />Chọn mẫu thiệp đầu tiên</Button>} />
              )}
              {!!invitationsQuery.data?.length && (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{invitationsQuery.data.map((invitation, index) => <InvitationCard key={invitation.id} invitation={invitation} index={index} />)}</div>
              )}
            </section>
            
            {/* Template Marketplace */}
            <section id="template-marketplace" className="scroll-mt-20 space-y-5 border-t border-border pt-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">Bộ sưu tập Mireia</p>
                  <h2 className="mt-1 flex items-center gap-2 font-display text-2xl font-semibold"><LayoutGrid className="h-5 w-5" />Kho Mẫu Thiệp Cưới Cao Cấp</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Xem trực tiếp thiệp thật với đầy đủ hiệu ứng âm nhạc và phong bì.</p>
                </div>
                <span className="text-xs text-muted-foreground font-medium">{filteredTemplates.length} mẫu thiệp</span>
              </div>

              <CatalogControls query={query} category={category} sort={sort} favoritesOnly={favoritesOnly} favoriteCount={favoriteIds.length} onQueryChange={setQuery} onCategoryChange={setCategory} onSortChange={setSort} onFavoritesOnlyChange={setFavoritesOnly} />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" data-testid="template-marketplace-grid">
                {filteredTemplates.map((template, index) => <TemplateCard key={template.id} template={template} index={index} onSelect={() => navigate(`/templates/${template.id}`)} />)}
              </div>
              {!filteredTemplates.length && <EmptyState icon={Search} title="No matching templates were found" description="Try another keyword or remove the filter." />}
            </section>

          </div>

          {/* Right Column: Support & Billing */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <SupportChatWidget />
            <BillingSummary billing={billingQuery.data} />
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
