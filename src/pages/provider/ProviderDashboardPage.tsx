import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BriefcaseBusiness, CheckCircle2, Clock3, LogOut, Plus, Store, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { getApiErrorMessage } from "@/lib/api";
import {
  createProviderService, deleteProviderService, getProviderProfile, listProviderBookings,
  listProviderServices, saveProviderProfile, updateProviderBookingStatus, type BookingStatus,
} from "@/lib/providers";
import { toast } from "sonner";

const ProviderDashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const profileQuery = useQuery({ queryKey: ["provider-profile"], queryFn: getProviderProfile, retry: false });
  const servicesQuery = useQuery({ queryKey: ["provider-services"], queryFn: listProviderServices });
  const bookingsQuery = useQuery({ queryKey: ["provider-bookings"], queryFn: listProviderBookings });
  const [profile, setProfile] = useState({ businessName: "", description: "", phone: "", location: "" });
  const [service, setService] = useState({ category: "Chụp ảnh & Phóng sự", name: "", description: "", priceFrom: "", priceTo: "" });

  useEffect(() => {
    if (!profileQuery.data) return;
    setProfile({ businessName: profileQuery.data.businessName, description: profileQuery.data.description ?? "", phone: profileQuery.data.phone ?? "", location: profileQuery.data.location ?? "" });
  }, [profileQuery.data]);

  const profileMutation = useMutation({
    mutationFn: () => saveProviderProfile(profile),
    onSuccess: () => { toast.success("Đã lưu hồ sơ đối tác"); void queryClient.invalidateQueries({ queryKey: ["provider-profile"] }); },
    onError: (error) => toast.error(getApiErrorMessage(error, "Không thể lưu hồ sơ")),
  });
  const serviceMutation = useMutation({
    mutationFn: () => createProviderService({ ...service, priceFrom: service.priceFrom ? Number(service.priceFrom) : null, priceTo: service.priceTo ? Number(service.priceTo) : null, active: true }),
    onSuccess: () => { setService((value) => ({ ...value, name: "", description: "", priceFrom: "", priceTo: "" })); void queryClient.invalidateQueries({ queryKey: ["provider-services"] }); toast.success("Đã thêm dịch vụ"); },
    onError: (error) => toast.error(getApiErrorMessage(error, "Không thể thêm dịch vụ")),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteProviderService,
    onSuccess: () => { toast.success("Đã xóa dịch vụ"); void queryClient.invalidateQueries({ queryKey: ["provider-services"] }); },
    onError: (error) => toast.error(getApiErrorMessage(error, "Không thể xóa dịch vụ")),
  });
  const bookingMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) => updateProviderBookingStatus(id, status),
    onSuccess: () => { toast.success("Đã cập nhật trạng thái đơn đặt lịch"); void queryClient.invalidateQueries({ queryKey: ["provider-bookings"] }); },
    onError: (error) => toast.error(getApiErrorMessage(error, "Không thể cập nhật đơn đặt")),
  });

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-foreground">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#f7f4ef]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/provider" className="flex items-center gap-2 font-display text-xl font-semibold"><Store className="h-5 w-5 text-accent" /> Mireia Partner</Link>
          <div className="flex items-center gap-3 text-sm"><span className="hidden text-muted-foreground sm:block">{user?.email}</span><Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate("/login"); }}><LogOut className="mr-1.5 h-4 w-4" /> Đăng xuất</Button></div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <form onSubmit={(event) => { event.preventDefault(); profileMutation.mutate(); }} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between"><h1 className="font-display text-2xl font-bold">Hồ sơ đối tác</h1>{profileQuery.data && <Badge>{profileQuery.data.status}</Badge>}</div>
            <div className="space-y-3">
              <Input required placeholder="Tên thương hiệu / Studio" value={profile.businessName} onChange={(event) => setProfile({ ...profile, businessName: event.target.value })} />
              <Input placeholder="Số điện thoại liên hệ" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} />
              <Input placeholder="Khu vực hoạt động (Hà Nội, TP.HCM...)" value={profile.location} onChange={(event) => setProfile({ ...profile, location: event.target.value })} />
              <Textarea placeholder="Giới thiệu ngắn về thương hiệu & dịch vụ" value={profile.description} onChange={(event) => setProfile({ ...profile, description: event.target.value })} />
              <Button className="w-full bg-accent text-accent-foreground font-semibold" disabled={profileMutation.isPending}>Lưu hồ sơ đối tác</Button>
            </div>
            {!profileQuery.data && <p className="mt-3 text-xs leading-5 text-muted-foreground">Hồ sơ mới sẽ được hiển thị công khai sau khi Admin duyệt.</p>}
          </form>

          <form onSubmit={(event) => { event.preventDefault(); serviceMutation.mutate(); }} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold"><Plus className="h-4 w-4 text-accent" /> Thêm gói dịch vụ mới</h2>
            <div className="space-y-3">
              <Input required placeholder="Danh mục (Chụp ảnh, Váy cưới, Make-up...)" value={service.category} onChange={(event) => setService({ ...service, category: event.target.value })} />
              <Input required placeholder="Tên gói dịch vụ" value={service.name} onChange={(event) => setService({ ...service, name: event.target.value })} />
              <Textarea placeholder="Mô tả chi tiết gói dịch vụ & quyền lợi khách hàng" value={service.description} onChange={(event) => setService({ ...service, description: event.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" min="0" placeholder="Giá từ (VNĐ)" value={service.priceFrom} onChange={(event) => setService({ ...service, priceFrom: event.target.value })} />
                <Input type="number" min="0" placeholder="Giá đến (VNĐ)" value={service.priceTo} onChange={(event) => setService({ ...service, priceTo: event.target.value })} />
              </div>
              <Button className="w-full" disabled={!profileQuery.data || serviceMutation.isPending}>Tạo gói dịch vụ</Button>
            </div>
          </form>
        </aside>

        <section className="space-y-6">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 font-display text-2xl font-bold"><BriefcaseBusiness className="h-5 w-5 text-accent" /> Dịch vụ đang cung cấp ({servicesQuery.data?.length ?? 0})</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(servicesQuery.data ?? []).map((item) => (
                <article key={item.id} className="rounded-2xl border border-border p-4 hover:border-accent/40 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-accent">{item.category}</p>
                      <h3 className="mt-1 font-semibold">{item.name}</h3>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(item.id)} aria-label="Xóa dịch vụ" className="text-destructive/70 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{item.description || "Chưa có mô tả chi tiết"}</p>
                  <p className="mt-3 text-sm font-bold text-foreground">
                    {item.priceFrom ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.priceFrom) : "Liên hệ"}
                    {item.priceTo ? ` – ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.priceTo)}` : ""}
                  </p>
                </article>
              ))}
              {!servicesQuery.isLoading && !servicesQuery.data?.length && <p className="text-sm text-muted-foreground">Chưa có dịch vụ nào được tạo.</p>}
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 font-display text-2xl font-bold"><Clock3 className="h-5 w-5 text-accent" /> Yêu cầu đặt dịch vụ từ khách hàng</h2>
            <div className="space-y-3">
              {(bookingsQuery.data ?? []).map((booking) => (
                <article key={booking.id} className="rounded-2xl border border-border p-4 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{booking.contactName}</h3>
                      <Badge variant="secondary" className="text-[10px]">{booking.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{booking.serviceName} · Ngày cưới: {booking.weddingDate} · SĐT: {booking.phone}</p>
                  </div>
                  {booking.status === "Pending" && (
                    <div className="mt-3 flex gap-2 sm:mt-0">
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => bookingMutation.mutate({ id: booking.id, status: "CONTACTED" })}>
                        Đã liên hệ
                      </Button>
                      <Button size="sm" className="text-xs bg-accent text-accent-foreground" onClick={() => bookingMutation.mutate({ id: booking.id, status: "CONFIRMED" })}>
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Xác nhận
                      </Button>
                    </div>
                  )}
                </article>
              ))}
              {!bookingsQuery.isLoading && !bookingsQuery.data?.length && <p className="text-sm text-muted-foreground">Chưa có yêu cầu đặt dịch vụ mới.</p>}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProviderDashboardPage;
