import { ReactNode } from "react";

export const PanelHeader = ({ icon, title, sub }: { icon: ReactNode; title: string; sub?: string }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2.5 mb-1">
      <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground">
        {icon}
      </span>
      <h3 className="font-display text-base font-bold text-foreground">{title}</h3>
    </div>
    {sub && <p className="font-body text-xs text-muted-foreground pl-[42px]">{sub}</p>}
  </div>
);

export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="space-y-1.5">
    <label className="font-body text-xs font-semibold text-foreground/80 uppercase tracking-wider">
      {label}
    </label>
    {children}
  </div>
);
