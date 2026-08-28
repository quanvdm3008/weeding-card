import { motion } from "framer-motion";
import { CreditCard, Crown, Sparkles, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPlanLimit, type BillingAccountDto } from "@/lib/billing";

export function BillingSummary({ billing }: { billing?: BillingAccountDto }) {
  if (!billing) return null;
  const { currentPlan: plan, usage } = billing;
  const maxInvs = plan.maxInvitations || 1;
  const percentUsed = Math.min(100, Math.round((usage.totalInvitations / maxInvs) * 100));
  const isFree = plan.code === "FREE";

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-accent/5 p-5 shadow-sm"
    >
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-accent/15 blur-2xl" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl shadow-sm ${
            isFree ? "bg-muted text-muted-foreground" : "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-500/20"
          }`}>
            {isFree ? <CreditCard className="h-5 w-5" /> : <Crown className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-semibold leading-tight">{plan.displayName}</h3>
              <Badge
                variant={billing.subscription.status === "active" ? "default" : "outline"}
                className="h-5 text-[10px] uppercase tracking-wider"
              >
                {billing.subscription.status === "active" ? "Kích hoạt" : billing.subscription.status}
              </Badge>
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {isFree ? "Gói tiêu chuẩn miễn phí" : "Gói thành viên cao cấp"}
            </p>
          </div>
        </div>
      </div>

      {/* Usage Progress Bar */}
      <div className="relative z-10 mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-foreground/80">Dung lượng tạo thiệp</span>
          <span className="font-mono text-[11px] font-semibold text-accent">
            {usage.totalInvitations} / {formatPlanLimit(plan.maxInvitations)} thiệp
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentUsed}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full transition-all ${
              percentUsed > 85 ? "bg-rose-500" : "bg-gradient-to-r from-accent to-accent/80"
            }`}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Đã phát hành: {usage.publishedInvitations} thiệp</span>
          <span>{percentUsed}% đã dùng</span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="relative z-10 mt-5 border-t border-border/60 pt-4">
        <Button
          asChild
          size="sm"
          className={`w-full font-semibold shadow-sm transition-all ${
            isFree
              ? "bg-gradient-to-r from-accent via-rose-500 to-amber-500 text-white hover:opacity-90 shadow-accent/20"
              : "bg-card border border-border hover:bg-muted text-foreground"
          }`}
        >
          <Link to="/#pricing" className="flex items-center justify-center gap-1.5">
            {isFree ? (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Nâng cấp gói Pro / VIP</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Quản lý gói đăng ký</span>
              </>
            )}
          </Link>
        </Button>
      </div>
    </motion.section>
  );
}

export default BillingSummary;
