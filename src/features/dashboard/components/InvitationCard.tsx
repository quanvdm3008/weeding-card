import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Archive,
  Armchair,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  EyeOff,
  ExternalLink,
  Gift,
  Heart,
  ListChecks,
  MessageCircleHeart,
  MessageSquareShare,
  MoreVertical,
  Pencil,
  Printer,
  Projector,
  RotateCcw,
  Sparkles,
  Trash2,
  Users,
  Wand2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { templateCatalog } from "@/features/templates/catalog/templateCatalog";
import { getApiErrorMessage } from "@/lib/api";
import {
  archiveInvitation,
  deleteInvitation,
  restoreInvitation,
  unpublishInvitation,
  type InvitationSummaryDto,
} from "@/lib/invitations";
import defaultHero from "@/assets/hero-wedding.jpg";

const statusLabel: Record<string, string> = {
  Draft: "Bản nháp",
  Published: "Đã xuất bản",
  Archived: "Đã lưu trữ",
};

const templateNames = new Map<string, string>(templateCatalog.map((template) => [template.id, template.nameVi]));

export function InvitationCard({ invitation, index }: { invitation: InvitationSummaryDto; index: number }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showTools, setShowTools] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const status = typeof invitation.status === "string" ? invitation.status : "Draft";
  const isPublished = status === "Published";

  const lifecycleMutation = useMutation({
    mutationFn: async (action: "unpublish" | "archive" | "restore" | "delete") => {
      if (action === "unpublish") await unpublishInvitation(invitation.id);
      else if (action === "archive") await archiveInvitation(invitation.id);
      else if (action === "restore") await restoreInvitation(invitation.id);
      else await deleteInvitation(invitation.id);
    },
    onSuccess: (_result, action) => {
      const messages = {
        unpublish: "Đã chuyển thiệp về trạng thái bản nháp",
        archive: "Đã lưu trữ thiệp cưới",
        restore: "Đã khôi phục thiệp cưới",
        delete: "Đã xóa thiệp cưới vĩnh viễn",
      };
      toast.success(messages[action]);
      setShowMenu(false);
      void queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Không thể thay đổi trạng thái thiệp")),
  });

  const confirmAndRun = (action: "unpublish" | "archive" | "restore" | "delete", message: string) => {
    if (window.confirm(message)) lifecycleMutation.mutate(action);
  };

  const templateTitle = templateNames.get(invitation.templateCode) ?? invitation.templateCode;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.05, duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:border-accent/60 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Visual Cover Header */}
      <div className="relative h-44 w-full overflow-hidden bg-neutral-900">
        <img
          src={invitation.coverImageUrl || defaultHero}
          alt={`${invitation.groomName} & ${invitation.brideName}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            const el = e.currentTarget;
            if (el.dataset.fallbackApplied !== "true") {
              el.dataset.fallbackApplied = "true";
              el.src = defaultHero;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Top Badges & Menu */}
        <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between">
          <Badge
            className={`text-[10px] font-semibold tracking-wide backdrop-blur-md shadow-sm border ${
              isPublished
                ? "bg-emerald-500/90 text-white border-emerald-400/40"
                : status === "Archived"
                ? "bg-neutral-800/90 text-neutral-300 border-neutral-700"
                : "bg-amber-500/90 text-white border-amber-400/40"
            }`}
          >
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${isPublished ? "bg-white animate-pulse" : "bg-white/80"}`} />
            {statusLabel[status] ?? status}
          </Badge>

          {/* Quick Menu Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white/90 backdrop-blur-md transition-colors hover:bg-black/70 hover:text-white"
              aria-label="Tùy chọn thiệp cưới"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute right-0 top-10 z-30 w-44 rounded-xl border border-border bg-card p-1.5 shadow-xl backdrop-blur"
                >
                  {isPublished && (
                    <button
                      type="button"
                      disabled={lifecycleMutation.isPending}
                      onClick={() => confirmAndRun("unpublish", "Hủy xuất bản thiệp cưới về chế độ bản nháp?")}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                    >
                      <EyeOff className="h-3.5 w-3.5 text-amber-500" />
                      <span>Hủy phát hành</span>
                    </button>
                  )}
                  {status !== "Archived" ? (
                    <button
                      type="button"
                      disabled={lifecycleMutation.isPending}
                      onClick={() => confirmAndRun("archive", "Chuyển thiệp cưới này vào mục lưu trữ?")}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                    >
                      <Archive className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Lưu trữ thiệp</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={lifecycleMutation.isPending}
                      onClick={() => lifecycleMutation.mutate("restore")}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Khôi phục</span>
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={lifecycleMutation.isPending}
                    onClick={() => confirmAndRun("delete", "Xác nhận xóa vĩnh viễn thiệp cưới này?")}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Xóa thiệp</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Overlay Info */}
        <div className="absolute inset-x-4 bottom-3 text-white">
          <p className="text-[11px] font-medium tracking-wide text-white/80 uppercase">{templateTitle}</p>
          <h3 className="truncate font-display text-xl font-bold tracking-tight">
            {invitation.groomName} <span className="text-accent font-serif font-normal">&amp;</span> {invitation.brideName}
          </h3>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col justify-between p-4 space-y-4">
        {/* Metric Pill Grid */}
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-2.5 text-center border border-border/50">
          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <Users className="h-3 w-3 text-accent" /> Khách
            </span>
            <span className="mt-1 font-mono text-base font-bold text-foreground">{invitation.guestCount}</span>
          </div>
          <div className="flex flex-col items-center border-x border-border/60">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <ListChecks className="h-3 w-3 text-emerald-500" /> RSVP
            </span>
            <span className="mt-1 font-mono text-base font-bold text-foreground">{invitation.rsvpCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <MessageCircleHeart className="h-3 w-3 text-rose-500" /> Chúc phúc
            </span>
            <span className="mt-1 font-mono text-base font-bold text-foreground">{invitation.wishCount}</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              onClick={() => navigate(`/editor/${invitation.id}`)}
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-sm"
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" /> Chỉnh sửa
            </Button>
            <Button
              size="sm"
              variant="outline"
              asChild
              className="border-border hover:bg-muted font-medium"
            >
              <Link to={`/editor/${invitation.id}?workspace=canvas`}>
                <Wand2 className="mr-1.5 h-3.5 w-3.5 text-accent" /> Canvas
              </Link>
            </Button>
          </div>

          {/* Public Link Pill */}
          {invitation.slug && isPublished && (
            <Button
              size="sm"
              variant="secondary"
              asChild
              className="w-full text-xs font-semibold bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20"
            >
              <a href={`/invitation/${invitation.slug}`} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Xem thiệp online
              </a>
            </Button>
          )}

          {/* Event Day & Management Toolkit Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowTools((prev) => !prev)}
              className="flex w-full items-center justify-between py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Tiện ích sự kiện & Quản lý ({showTools ? "Thu gọn" : "Mở rộng"})
              </span>
              {showTools ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {/* Expanded Tools Grid */}
            <AnimatePresence>
              {showTools && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-2 pt-2 border-t border-border/50"
                >
                  <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                    <Button size="sm" variant="ghost" asChild className="h-8 justify-start px-2 hover:bg-muted">
                      <Link to={`/invitations/${invitation.id}/guests`}><Users className="mr-1.5 h-3 w-3 text-accent" /> Khách mời</Link>
                    </Button>
                    <Button size="sm" variant="ghost" asChild className="h-8 justify-start px-2 hover:bg-muted">
                      <Link to={`/invitations/${invitation.id}/seating`}><Armchair className="mr-1.5 h-3 w-3 text-sky-500" /> Sơ đồ bàn</Link>
                    </Button>
                    <Button size="sm" variant="ghost" asChild className="h-8 justify-start px-2 hover:bg-muted">
                      <Link to={`/invitations/${invitation.id}/rsvps`}><ListChecks className="mr-1.5 h-3 w-3 text-emerald-500" /> Quản lý RSVP</Link>
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                    <Button size="sm" variant="ghost" asChild className="h-8 justify-start px-2 hover:bg-muted">
                      <Link to={`/invitations/${invitation.id}/check-in`}><CheckCircle2 className="mr-1.5 h-3 w-3 text-teal-500" /> Check-in</Link>
                    </Button>
                    <Button size="sm" variant="ghost" asChild className="h-8 justify-start px-2 hover:bg-muted">
                      <Link to={`/invitations/${invitation.id}/live-wall`}><Projector className="mr-1.5 h-3 w-3 text-amber-500" /> Màn LED</Link>
                    </Button>
                    <Button size="sm" variant="ghost" asChild className="h-8 justify-start px-2 hover:bg-muted">
                      <Link to={`/invitations/${invitation.id}/lucky-draw`}><Gift className="mr-1.5 h-3 w-3 text-rose-500" /> Quay số</Link>
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                    <Button size="sm" variant="ghost" asChild className="h-8 justify-start px-2 hover:bg-muted">
                      <Link to={`/invitations/${invitation.id}/printables`}><Printer className="mr-1.5 h-3 w-3 text-purple-500" /> In Standee</Link>
                    </Button>
                    <Button size="sm" variant="ghost" asChild className="h-8 justify-start px-2 hover:bg-muted">
                      <Link to={`/invitations/${invitation.id}/budget`}><DollarSign className="mr-1.5 h-3 w-3 text-emerald-600" /> Ngân sách</Link>
                    </Button>
                    <Button size="sm" variant="ghost" asChild className="h-8 justify-start px-2 hover:bg-muted">
                      <Link to={`/invitations/${invitation.id}/broadcasts`}><MessageSquareShare className="mr-1.5 h-3 w-3 text-blue-500" /> Nhắc lịch</Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default InvitationCard;
