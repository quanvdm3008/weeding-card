import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Heart, Palette, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { templates, type WeddingTemplate } from "@/data/templates";
import TemplateCard from "./TemplateCard";

const categoryLabels: Record<string, string> = {
  "All": "Tất cả",
  "romantic": "Lãng mạn",
  "Modern": "Hiện đại",
  "tropical": "Thiên nhiên",
  "classic": "Cổ điển",
  "Japan": "Nhật Bản",
  "minimalist": "Tối giản",
  "Boho": "Boho",
  "Royal": "Hoàng gia",
  "Fairy tales": "Cổ tích",
  "Design yourself": "Tự thiết kế",
  "Art": "Nghệ thuật",
  "Luxurious": "Sang trọng",
  "traditional": "Truyền thống",
  "Premium": "Cao cấp",
};

const TemplateGallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  const categories = useMemo(() => ["All", ...Array.from(new Set(templates.map((template) => template.category)))], []);
  const filtered = activeCategory === "All" ? templates : templates.filter((template) => template.category === activeCategory);
  const handleSelectTemplate = (template: WeddingTemplate) => navigate(`/templates/${template.id}`);

  return (
    <section id="templates" className="relative py-24 bg-[#FAFAFA] overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-100/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500 shadow-sm">
              <Palette className="h-3.5 w-3.5 text-gray-400" /> Collection
            </p>
            <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Chọn một khung cảnh hợp với ngày cưới của bạn.
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="rounded-2xl border border-gray-100 bg-white/60 p-6 text-sm leading-relaxed text-gray-600 shadow-sm backdrop-blur-md">
            <p className="font-medium text-gray-900 text-base">{templates.length} mẫu thiệp, {categories.length - 1} phong cách thiết kế.</p>
            <p className="mt-2">Mỗi mẫu mang một nhịp kể chuyện, bảng màu và hiệu ứng điện ảnh riêng biệt. Chúng tôi không chỉ thay đổi màu sắc, chúng tôi kiến tạo không gian cho câu chuyện của bạn.</p>
          </motion.div>
        </div>

        <div className="sticky top-20 z-30 -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 py-3 sm:mx-0 sm:flex-wrap sm:px-0 sm:py-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2 rounded-full border border-gray-200/60 bg-white/80 p-1.5 shadow-sm backdrop-blur-xl">
            {categories.map((category) => (
              <button 
                key={category} 
                type="button" 
                onClick={() => setActiveCategory(category)} 
                className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === category 
                    ? "bg-gray-900 text-white shadow-md" 
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {categoryLabels[category] ?? category}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.98 }} 
            transition={{ duration: 0.4, ease: "easeOut" }} 
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((template, index) => <TemplateCard key={template.id} template={template} index={index} onSelect={handleSelectTemplate} />)}
          </motion.div>
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8 }}
          className="mt-24 relative overflow-hidden flex flex-col items-center justify-between gap-8 rounded-[2rem] bg-gray-900 px-8 py-12 text-white sm:flex-row sm:px-12 sm:py-16 shadow-2xl"
        >
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 100% 100%, #ffffff 0%, transparent 50%)" }} />
          <div className="relative z-10 max-w-xl">
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.25em] text-gray-400">
              <Heart className="h-3.5 w-3.5 fill-current" /> Dành riêng cho bạn
            </p>
            <p className="mt-4 font-display text-3xl font-medium sm:text-4xl leading-tight">Vẫn chưa tìm thấy phong cách hoàn hảo?</p>
            <p className="mt-4 text-gray-400 font-body text-sm leading-relaxed">Sử dụng công cụ thiết kế mạnh mẽ của chúng tôi để bắt đầu từ một trang giấy trắng. Tự do sắp xếp, kéo thả và tạo nên tấm thiệp độc nhất vô nhị.</p>
          </div>
          <Link to="/templates/canvas" className="relative z-10 shrink-0 group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-gray-900 transition-all hover:bg-gray-100 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            <Sparkles className="h-4 w-4" /> 
            Tự thiết kế 
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TemplateGallery;
