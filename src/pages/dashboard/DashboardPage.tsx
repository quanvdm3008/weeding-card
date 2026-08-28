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
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import TemplateCard from "@/features/templates/components/TemplateCard";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { BillingSummary } from "@/features/dashboard/components/BillingSummary";
import { InvitationCard } from "@/features/dashboard/components/InvitationCard";
import { QuickEventDayHub } from "@/features/dashboard/components/QuickEventDayHub";
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

  const invitations = invitationsQuery.data ?? [];
  const primaryInvitationId = invitations[0]?.id;

  const summary = useMemo(() => {
    return {
      projects: invitations.length,
      published: invitations.filter((item) => item.status === "Published").length,
      guests: invitations.reduce((total, item) => total + item.guestCount, 0),
      rsvps: invitations.reduce((total, item) => total + item.rsvpCount, 0),
    };
  }, [invitations]);

  const browseTemplates = () => {
    reset();
    document.getElementById("template-marketplace")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const logout = async () => {
    await signOut();
    toast.success("Đã đăng xuất");
    navigate("/");
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "M";

  const stats = [
    { label: "Dự án thiệp cưới", value: summary.projects, icon: Mail, tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
    { label: "Thiệp đã xuất bản", value: summary.published, icon: CheckCircle2, tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
    { label: "Tổng khách mời", value: summary.guests, icon: Users, tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" },
    { label: "Phản hồi RSVP", value: summary.rsvps, icon: Heart, tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3 group">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-accent to-rose-400 text-white shadow-sm transition-transform group-hover:scale-105">
              <Heart className="h-4 w-4 fill-current" />
            </span>
            <div className="flex flex-col">
              <span className="truncate font-display text-lg font-bold tracking-tight text-foreground">Mireia Studio</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground -mt-0.5">Workspace</span>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            {user?.roles?.includes("Admin") && (
              <Button size="sm" variant="outline" asChild className="hidden sm:inline-flex border-border/80 hover:bg-muted font-medium">
                <Link to="/admin"><ShieldCheck className="mr-1.5 h-4 w-4 text-accent" />Quản trị hệ thống</Link>
              </Button>
            )}
            <Button
              size="sm"
              onClick={browseTemplates}
              data-testid="dashboard-create-card"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-sm"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Tạo thiệp mới</span>
              <span className="sm:hidden">Tạo mới</span>
            </Button>

            {/* User Profile Avatar Pill */}
            <div className="hidden md:flex items-center gap-2 rounded-full border border-border/80 bg-card py-1 pl-1.5 pr-3 shadow-sm">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-accent/20 text-accent font-semibold text-xs">
                {userInitial}
              </div>
              <span className="max-w-[140px] truncate text-xs font-medium text-foreground/90">{user?.email || "Chủ tiệc"}</span>
            </div>

            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => void logout()}
              title="Đăng xuất"
              aria-label="Đăng xuất"
              className="rounded-xl border-border/80 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
        {/* Luxury Hero Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-accent/15 via-rose-500/5 to-transparent p-6 sm:p-8 shadow-sm">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-card/80 px-3 py-1 text-[11px] font-semibold text-accent backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Không gian sáng tạo thiệp cưới số 1</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Chào mừng trở lại ✨
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Quản lý lời mời, phân phối qua Zalo/Facebook, tiếp nhận phản hồi RSVP và sử dụng các công cụ tương tác tiệc cưới thông minh.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={browseTemplates}
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-sm h-10 px-5"
              >
                <Plus className="mr-2 h-4 w-4" /> Tạo thiệp cưới mới
              </Button>
              <Button
                variant="outline"
                onClick={browseTemplates}
                className="bg-card/80 border-border/80 hover:bg-muted font-medium h-10"
              >
                <LayoutGrid className="mr-2 h-4 w-4 text-accent" /> Khám phá kho mẫu ({templateCatalog.length})
              </Button>
            </div>
          </div>
        </section>

        {/* 4 Elevated Stat Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, tone }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-200 hover:border-accent/40 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border ${tone} shadow-sm`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-tight">{value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground font-medium truncate">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Main Content Layout (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Projects & Template Marketplace */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-10">
            
            {/* Recent Projects Section */}
            <section className="space-y-5">
              <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                      Thiệp cưới của bạn
                    </h2>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      {invitations.length}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Tiếp tục tùy biến thiết kế và quản lý khách mời</p>
                </div>

                {!!invitations.length && (
                  <Button size="sm" variant="outline" onClick={browseTemplates} className="text-xs h-8 border-border">
                    <Plus className="mr-1 h-3.5 w-3.5" /> Tạo thêm
                  </Button>
                )}
              </div>

              {invitationsQuery.isLoading && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="h-72 animate-pulse rounded-2xl bg-muted/60" />
                  ))}
                </div>
              )}

              {invitationsQuery.isError && (
                <div className="rounded-2xl border border-border bg-card p-8 text-center">
                  <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-amber-500" />
                  <p className="text-sm font-semibold text-foreground">Không thể kết nối đến máy chủ dữ liệu</p>
                  <Button size="sm" onClick={() => void invitationsQuery.refetch()} variant="outline" className="mt-4">
                    <RefreshCcw className="mr-1.5 h-3.5 w-3.5" /> Thử lại
                  </Button>
                </div>
              )}

              {!invitationsQuery.isLoading && !invitationsQuery.isError && !invitations.length && (
                <div className="rounded-3xl border-2 border-dashed border-border/80 bg-card/50 p-10 text-center space-y-4">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent/15 text-accent">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <div className="max-w-md mx-auto">
                    <h3 className="font-display text-xl font-bold text-foreground">Bạn chưa tạo thiệp cưới nào</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Hãy chọn một mẫu thiệp phong cách yêu thích để bắt đầu tạo câu chuyện tình yêu độc bản cho ngày cưới của bạn.
                    </p>
                  </div>
                  <Button onClick={browseTemplates} className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-sm">
                    <Plus className="mr-2 h-4 w-4" /> Bắt đầu chọn mẫu thiệp
                  </Button>
                </div>
              )}

              {!!invitations.length && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {invitations.map((invitation, index) => (
                    <InvitationCard key={invitation.id} invitation={invitation} index={index} />
                  ))}
                </div>
              )}
            </section>
            
            {/* Template Marketplace Section */}
            <section id="template-marketplace" className="scroll-mt-20 space-y-6 border-t border-border/80 pt-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span>Bộ sưu tập mẫu thiệp cao cấp</span>
                  </div>
                  <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">
                    Kho Mẫu Thiệp Cưới Mireia
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Trải nghiệm hiệu ứng âm nhạc, mở phong bì 3D và tương tác trực quan trước khi chọn.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-accent/10 text-accent font-semibold px-3 py-1 text-xs">
                    {filteredTemplates.length} mẫu thiệp
                  </span>
                </div>
              </div>

              <CatalogControls
                query={query}
                category={category}
                sort={sort}
                favoritesOnly={favoritesOnly}
                favoriteCount={favoriteIds.length}
                onQueryChange={setQuery}
                onCategoryChange={setCategory}
                onSortChange={setSort}
                onFavoritesOnlyChange={setFavoritesOnly}
              />

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2" data-testid="template-marketplace-grid">
                {filteredTemplates.map((template, index) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    index={index}
                    onSelect={() => navigate(`/templates/${template.id}`)}
                  />
                ))}
              </div>

              {!filteredTemplates.length && (
                <EmptyState
                  icon={Search}
                  title="Không tìm thấy mẫu thiệp phù hợp"
                  description="Hãy thử từ khóa tìm kiếm khác hoặc xóa bộ lọc để hiển thị toàn bộ kho mẫu."
                />
              )}
            </section>

          </div>

          {/* Right Column: Event Suite, Membership & Concierge Support */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-6 sticky top-24">
            <BillingSummary billing={billingQuery.data} />
            <QuickEventDayHub primaryInvitationId={primaryInvitationId} />
            <SupportChatWidget />
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
