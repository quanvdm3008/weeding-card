import { ArrowDown, Heart, Sparkles } from "lucide-react";
import QuickStartCard from "@/components/landing/QuickStartCard";

const HeroSection = () => (
  <section id="start" className="relative overflow-hidden bg-[radial-gradient(circle_at_6%_4%,hsl(346_70%_92%),transparent_27%),radial-gradient(circle_at_94%_10%,hsl(42_70%_90%),transparent_25%),hsl(30_55%_98%)] pb-16 pt-28 sm:pt-36">
    <div className="pointer-events-none absolute inset-0 opacity-[0.38] [background-image:linear-gradient(hsl(345_22%_72%/.18)_1px,transparent_1px),linear-gradient(90deg,hsl(345_22%_72%/.18)_1px,transparent_1px)] [background-size:42px_42px]" />
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/75 px-4 py-2 text-[11px] font-bold uppercase tracking-[.22em] text-primary shadow-sm">
          <Sparkles className="h-3.5 w-3.5" /> Mireia · wedding story studio
        </p>
        <h1 className="mt-6 font-display text-5xl font-medium leading-[.88] text-foreground sm:text-7xl lg:text-[5.7rem]">
          Một lời mời đẹp<br />
          <span className="font-script text-[.9em] font-normal text-primary">bắt đầu từ câu chuyện của hai bạn.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Tạo thiệp cưới trực tuyến vừa có gu, vừa dễ gửi — từ lời mời, album ảnh, RSVP đến lời chúc trong một đường link riêng.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-5xl"><QuickStartCard /></div>

      <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-muted-foreground">
        {["Xem trước không cần tài khoản", "Dễ chỉnh sửa theo phong cách của bạn", "Tối ưu cho điện thoại"].map((item) => (
          <span key={item} className="inline-flex items-center gap-2"><Heart className="h-3.5 w-3.5 fill-primary text-primary" />{item}</span>
        ))}
      </div>
      <a href="#how-it-works" className="mx-auto mt-12 flex w-fit flex-col items-center gap-1 text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground transition hover:text-foreground">
        Khám phá thêm <ArrowDown className="h-4 w-4" />
      </a>
    </div>
  </section>
);

export default HeroSection;
