import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CalendarDays, MapPin, Send, ShieldCheck, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createServiceBooking, listPublicProviderServices, type ProviderServiceDto } from "@/lib/providers";
import { getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const VerifiedServicesSection = () => {
  const user = useAuthStore((state) => state.user);
  const query = useQuery({ queryKey: ["verified-provider-services"], queryFn: listPublicProviderServices });
  const [selected, setSelected] = useState<ProviderServiceDto | null>(null);
  const [form, setForm] = useState({ contactName: user?.displayName ?? "", phone: "", email: user?.email ?? "", weddingDate: "", note: "" });
  const mutation = useMutation({
    mutationFn: () => createServiceBooking({ ...form, serviceId: selected!.id }),
    onSuccess: () => { toast.success("Request sent to supplier"); setSelected(null); },
    onError: (error) => toast.error(getApiErrorMessage(error, "Unable to send request")),
  });
  const services = query.data ?? [];
  if (!query.isLoading && services.length === 0) return null;

  return <section className="mx-auto mb-12 max-w-7xl px-5 sm:px-8"><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-accent">Verified by Mireia</p><h2 className="mt-2 font-display text-3xl sm:text-4xl">Partners are accepting appointments</h2></div><ShieldCheck className="h-7 w-7 text-emerald-600" /></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{services.map((service) => <article key={service.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-muted"><Store className="h-5 w-5 text-accent" /></span><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-700">Verified</span></div><p className="mt-5 text-xs font-semibold uppercase tracking-wider text-accent">{service.category}</p><h3 className="mt-1 font-display text-2xl">{service.name}</h3><p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {service.providerName}</p><p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{service.description || "Contact us to receive detailed advice."}</p><div className="mt-5 flex items-center justify-between border-t pt-4"><span className="text-sm font-semibold">{service.priceFrom ? `From ${service.priceFrom.toLocaleString("en-US")}$` : "Contact"}</span><Button size="sm" onClick={() => setSelected(service)} disabled={!user?.roles.includes("OWNER")}>Book</Button></div></article>)}</div>
    <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent><DialogHeader><DialogTitle>Request {selected?.name}</DialogTitle><DialogDescription>{selected?.providerName} will contact you again after receiving the information.</DialogDescription></DialogHeader><form onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }} className="space-y-3"><Input required placeholder="Full name" value={form.contactName} onChange={(event) => setForm({ ...form, contactName: event.target.value })} /><Input required type="tel" placeholder="Phone number" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /><Input type="email" placeholder="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /><div className="relative"><CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input required type="date" className="pl-10" value={form.weddingDate} onChange={(event) => setForm({ ...form, weddingDate: event.target.value })} /></div><Textarea placeholder="Ask for more" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} /><Button className="w-full" disabled={mutation.isPending}><Send className="mr-2 h-4 w-4" /> Send request</Button></form></DialogContent></Dialog>
  </section>;
};

export default VerifiedServicesSection;
