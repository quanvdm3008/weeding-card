import { motion } from "framer-motion";
import { CreditCard, Gauge } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPlanLimit, type BillingAccountDto } from "@/lib/billing";

export function BillingSummary({ billing }: { billing?: BillingAccountDto }) {
  if (!billing) return null;
  const { currentPlan: plan, usage } = billing;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-y border-border bg-card py-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent/12 text-accent">
            <CreditCard className="h-5 w-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold">{plan.displayName}</h2>
              <Badge variant={billing.subscription.status === "active" ? "default" : "outline"} className="text-[10px]">
                {billing.subscription.status}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {usage.totalInvitations}/{formatPlanLimit(plan.maxInvitations)} card · {usage.publishedInvitations} released
            </p>
          </div>
        </div>
        <Button asChild variant={plan.code === "FREE" ? "default" : "outline"} size="sm">
          <Link to="/#pricing"><Gauge className="mr-1.5 h-3.5 w-3.5" />{plan.code === "FREE" ? "Upgrade Pro" : "Package management"}</Link>
        </Button>
      </div>
    </motion.section>
  );
}
