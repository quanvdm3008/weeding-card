import { motion } from "framer-motion";
import { ArrowRight, Heart, Play, Sparkles } from "lucide-react";
import ringsImage from "@/assets/rings.jpg";

const CTASection = () => {
  return (
    <section className="section-shell bg-background">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-white/12 bg-[hsl(350_24%_12%)] px-6 py-16 text-center shadow-elegant sm:px-10 md:py-20"
        >
          <img
            src={ringsImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-32"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(350_28%_9%/0.72),hsl(350_28%_9%/0.88))]" />
          <svg
            className="pointer-events-none absolute -left-10 top-8 hidden h-48 w-48 text-[hsl(39_58%_72%/0.32)] md:block"
            viewBox="0 0 180 180"
            fill="none"
            aria-hidden="true"
          >
            <path d="M26 154C55 109 77 66 151 27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M55 114C43 96 46 77 64 62C76 84 74 101 55 114Z" fill="currentColor" opacity=".5" />
            <path d="M94 77C83 59 88 42 108 31C117 52 113 66 94 77Z" fill="currentColor" opacity=".42" />
          </svg>

          <div className="relative mx-auto max-w-4xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-white/82 backdrop-blur-xl">
              <Heart className="h-3.5 w-3.5 fill-[hsl(346_46%_72%)] text-[hsl(346_46%_72%)]" />
              <span className="font-body text-[11px] font-semibold uppercase tracking-[0.3em]">
                Sẵn sàng bắt đầu?
              </span>
            </div>

            <h2 className="mx-auto max-w-4xl font-display text-4xl font-light leading-[1.05] text-white md:text-6xl lg:text-7xl">
              Thiệp cưới của hai bạn <span className="italic text-shimmer-gold">có thể bắt đầu ngay bây giờ.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-8 text-white/68 md:text-lg">
              Thử với tên và ngày cưới của bạn trước. Khi đã ưng ý, tiếp tục chỉnh sửa và lưu lại bất cứ lúc nào.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#start" className="btn-luxury w-full sm:w-auto">
                <Sparkles className="h-4 w-4" />
                Thử tạo thiệp
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#templates"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/24 bg-white/10 px-7 py-3.5 font-body text-sm font-semibold text-white/86 backdrop-blur-xl transition hover:bg-white/16 sm:w-auto md:text-base"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Xem bộ sưu tập
              </a>
            </div>

            <p className="mt-8 font-body text-[11px] uppercase tracking-[0.28em] text-white/42">Mỗi lời mời là một câu chuyện riêng.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
