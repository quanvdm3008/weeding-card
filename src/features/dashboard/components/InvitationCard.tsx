import { motion } from "framer-motion";
import {
  Archive,
  Armchair,
  CheckCircle2,
  DollarSign,
  EyeOff,
  ExternalLink,
  Gift,
  Heart,
  ListChecks,
  MessageCircleHeart,
  MessageSquareShare,
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

const statusLabel: Record<string, string> = {
  Draft: "Bản nháp",
  Published: "Đã xuất bản",
  Archived: "Đã lưu trữ",
};

const statusVariant: Record<string, "secondary" | "default" | "outline"> = {
  Draft: "secondary",
  Published: "default",
  Archived: "outline",
};

const templateNames = new Map<string, string>(templateCatalog.map((template) => [template.id, template.nameVi]));

export function InvitationCard({ invitation, index }: { invitation: InvitationSummaryDto; index: number }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const status = typeof invitation.status === "string" ? invitation.status : "Draft";
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
      void queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Không thể thay đổi trạng thái thiệp")),
  });

  const confirmAndRun = (action: "unpublish" | "archive" | "restore" | "delete", message: string) => {
    if (window.confirm(message)) lifecycleMutation.mutate(action);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.35 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:border-accent/40 hover:shadow-card"
    >
      <div className="relative h-36 overflow-hidden bg-neutral-900">
        {invitation.coverImageUrl ? (
          <img src={invitation.coverImageUrl} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="grid h-full w-full place-items-center bg-neutral-800"><Heart className="h-8 w-8 text-white/35" /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <Badge variant={statusVariant[status] ?? "secondary"} className="absolute right-3 top-3 text-[10px]">
          {statusLabel[status] ?? status}
        </Badge>
        <div className="absolute inset-x-3 bottom-3 text-white">
          <h3 className="truncate font-display text-lg font-semibold">{invitation.groomName} &amp; {invitation.brideName}</h3>
          <p className="text-[11px] text-white/75">{templateNames.get(invitation.templateCode) ?? invitation.templateCode}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 p-3.5">
        <div className="grid grid-cols-3 divide-x divide-border text-center">
          {[
            { icon: Users, label: "Khách", value: invitation.guestCount },
            { icon: ListChecks, label: "RSVP", value: invitation.rsvpCount },
            { icon: MessageCircleHeart, label: "Lời chúc", value: invitation.wishCount },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <Icon className="mx-auto h-3.5 w-3.5 text-accent" />
              <p className="mt-1 text-sm font-semibold">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-1.5 border-t border-border pt-3">
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" onClick={() => navigate(`/editor/${invitation.id}`)}><Pencil className="mr-1.5 h-3.5 w-3.5" />Chỉnh sửa</Button>
            <Button size="sm" variant="outline" asChild><Link to={`/editor/${invitation.id}?workspace=canvas`}><Wand2 className="mr-1.5 h-3.5 w-3.5" />Canvas</Link></Button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <Button size="sm" variant="ghost" asChild className="px-1 text-[11px]"><Link to={`/invitations/${invitation.id}/guests`}><Users className="mr-1 h-3 w-3" />Khách</Link></Button>
            <Button size="sm" variant="ghost" asChild className="px-1 text-[11px]"><Link to={`/invitations/${invitation.id}/seating`}><Armchair className="mr-1 h-3 w-3" />Xếp bàn</Link></Button>
            <Button size="sm" variant="ghost" asChild className="px-1 text-[11px]"><Link to={`/invitations/${invitation.id}/rsvps`}><ListChecks className="mr-1 h-3 w-3" />RSVP</Link></Button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <Button size="sm" variant="ghost" asChild className="px-1 text-[11px]"><Link to={`/invitations/${invitation.id}/check-in`}><CheckCircle2 className="mr-1 h-3 w-3" />Check-in</Link></Button>
            <Button size="sm" variant="ghost" asChild className="px-1 text-[11px]"><Link to={`/invitations/${invitation.id}/live-wall`}><Projector className="mr-1 h-3 w-3 text-amber-500" />Màn LED</Link></Button>
            <Button size="sm" variant="ghost" asChild className="px-1 text-[11px]"><Link to={`/invitations/${invitation.id}/lucky-draw`}><Gift className="mr-1 h-3 w-3 text-rose-500" />Quay số</Link></Button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <Button size="sm" variant="ghost" asChild className="px-1 text-[11px]"><Link to={`/invitations/${invitation.id}/printables`}><Printer className="mr-1 h-3 w-3" />Standee</Link></Button>
            <Button size="sm" variant="ghost" asChild className="px-1 text-[11px]"><Link to={`/invitations/${invitation.id}/budget`}><DollarSign className="mr-1 h-3 w-3 text-emerald-500" />Ngân sách</Link></Button>
            <Button size="sm" variant="ghost" asChild className="px-1 text-[11px]"><Link to={`/invitations/${invitation.id}/broadcasts`}><MessageSquareShare className="mr-1 h-3 w-3 text-blue-500" />Nhắc lịch</Link></Button>
          </div>
          {invitation.slug && status === "Published" && (
            <Button size="sm" variant="secondary" asChild className="w-full text-xs bg-accent/15 text-accent hover:bg-accent/25 border border-accent/20">
              <a href={`/invitation/${invitation.slug}`} target="_blank" rel="noreferrer"><ExternalLink className="mr-1.5 h-3.5 w-3.5" />Xem thiệp online</a>
            </Button>
          )}
          <div className="grid grid-cols-2 gap-1.5">
            {status === "Published" && (
              <Button size="sm" variant="outline" disabled={lifecycleMutation.isPending} onClick={() => confirmAndRun("unpublish", "Hủy xuất bản thiệp này về bản nháp?")}>
                <EyeOff className="mr-1 h-3.5 w-3.5" />Hủy phát hành
              </Button>
            )}
            {status !== "Archived" ? (
              <Button size="sm" variant="ghost" disabled={lifecycleMutation.isPending} onClick={() => confirmAndRun("archive", "Chuyển thiệp cưới này vào mục lưu trữ?")}>
                <Archive className="mr-1 h-3.5 w-3.5" />Lưu trữ
              </Button>
            ) : (
              <Button size="sm" variant="outline" disabled={lifecycleMutation.isPending} onClick={() => lifecycleMutation.mutate("restore")}>
                <RotateCcw className="mr-1 h-3.5 w-3.5" />Khôi phục
              </Button>
            )}
            <Button size="sm" variant="ghost" className="text-destructive/80 hover:text-destructive" disabled={lifecycleMutation.isPending} onClick={() => confirmAndRun("delete", "Xóa vĩnh viễn thiệp cưới này?")}>
              <Trash2 className="mr-1 h-3.5 w-3.5" />Xóa thiệp
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
