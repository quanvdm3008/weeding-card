import { Link } from "react-router-dom";
import { Heart, ArrowLeft, LogOut } from "lucide-react";
import WeddingServices from "@/components/services/WeddingServices";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import VerifiedServicesSection from "@/components/services/VerifiedServicesSection";

const Services = () => {
  const { user, signOut } = useAuthStore();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass-nav border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-rose-gold shadow-gold">
              <Heart className="h-3.5 w-3.5 fill-primary-foreground text-primary-foreground" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Mireia<span className="text-accent">.</span>
              <span className="ml-2 font-body text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Marketplace
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/" className="hidden items-center gap-1.5 font-body text-sm text-muted-foreground hover:text-foreground sm:inline-flex">
              <ArrowLeft className="h-4 w-4" /> Trang chủ
            </Link>
            <Link
              to="/dashboard"
              className="hidden font-body text-sm font-semibold text-foreground/80 hover:text-foreground md:inline-flex"
            >
              Thiệp của tôi
            </Link>
            <span className="hidden font-body text-sm text-muted-foreground md:block">{user?.email}</span>
            <button
              onClick={async () => {
                await signOut();
                toast.success("Đã đăng xuất");
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-body text-xs font-semibold transition hover:bg-muted"
            >
              <LogOut className="h-3.5 w-3.5" /> Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="pt-6">
        <div className="mx-auto max-w-7xl px-5 pb-8 sm:px-8">
          <h1 className="font-display text-4xl text-foreground sm:text-5xl">
            Dịch vụ cưới <span className="text-accent">chọn lọc</span>
          </h1>
          <p className="mt-2 max-w-2xl font-body text-base text-muted-foreground">
            Khám phá các nhà cung cấp dịch vụ cưới uy tín, từ trung tâm tiệc cưới, chụp ảnh phóng sự đến hoa tươi và trang trí trọn gói.
          </p>
        </div>
        <VerifiedServicesSection />
        <WeddingServices accentColor="hsl(38 47% 50%)" />
      </main>
    </div>
  );
};

export default Services;
