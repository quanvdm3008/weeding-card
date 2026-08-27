import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Music, Palette, Mic2, Flower2, MapPin, Sparkles, UserCheck,
  Star, ChevronRight, Send, Phone, Mail, CalendarCheck, Check,
  Crown, Utensils, ArrowLeft, MessageSquare,
  ThumbsUp, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// ─── Types ──────────────────────────────────────────
interface Provider {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  priceRange: string;
  location: string;
  description: string;
  portfolio: string[];
  tags: string[];
  verified: boolean;
  yearsExp: number;
  completedJobs: number;
}

interface ServiceCategory {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  providers: Provider[];
  popular?: boolean;
}

// ─── Data ──────────────────────────────────────────
const serviceCategories: ServiceCategory[] = [
  {
    id: "venue",
    icon: <MapPin className="w-6 h-6" />,
    title: "Restaurant & Wedding Theater",
    subtitle: "Perfect space",
    description: "Diverse wedding venues",
    popular: true,
    providers: [
      {
        id: "v1", name: "White Palace", avatar: "🏛️", rating: 4.9, reviews: 324,
        priceRange: "30 - 80 million", location: "District 1, Ho Chi Minh City",
        description: "Leading high-end wedding conference center with a capacity of up to 1,500 guests.",
        portfolio: ["Grand Ballroom", "Crystal Hall", "Outdoor area"],
        tags: ["high-class", "Large capacity", "Center"], verified: true, yearsExp: 15, completedJobs: 2400,
      },
      {
        id: "v2", name: "GEM Center", avatar: "💎", rating: 4.8, reviews: 256,
        priceRange: "25 - 60 million", location: "District 1, Ho Chi Minh City",
        description: "Luxurious space with modern architecture, beautiful city view.",
        portfolio: ["Sky Garden", "Grand Hall", "VIP Lounge"],
        tags: ["Nice view", "Modern", "Flexible"], verified: true, yearsExp: 10, completedJobs: 1800,
      },
      {
        id: "v3", name: "Capella Garden", avatar: "🌿", rating: 4.7, reviews: 189,
        priceRange: "15 - 40 million", location: "District 7, Ho Chi Minh City",
        description: "Romantic garden restaurant, suitable for cozy wedding parties.",
        portfolio: ["Main garden", "VIP room", "Khu bar"],
        tags: ["Garden", "romantic", "Good price"], verified: false, yearsExp: 5, completedJobs: 600,
      },
    ],
  },
  {
    id: "photo",
    icon: <Camera className="w-6 h-6" />,
    title: "Photography & Videography",
    subtitle: "Preserve the moment",
    description: "Professional photographer & videographer",
    providers: [
      {
        id: "p1", name: "TuArt Studio", avatar: "📸", rating: 4.9, reviews: 512,
        priceRange: "12 - 35 million", location: "District 3, Ho Chi Minh City",
        description: "Vietnam's leading wedding photography studio with unique artistic style.",
        portfolio: ["Album outdoor", "Wedding reporting", "Pre-wedding"],
        tags: ["Top 1 VN", "Art", "4K Cinematic"], verified: true, yearsExp: 12, completedJobs: 3200,
      },
      {
        id: "p2", name: "Eye Ngoc Studio", avatar: "🎥", rating: 4.7, reviews: 287,
        priceRange: "8 - 25 million", location: "Binh Thanh District",
        description: "Specializing in cinematic cinematic filming and authentic wedding day reportage photography.",
        portfolio: ["Cinematic wedding", "Same-day edit", "Drone footage"],
        tags: ["cinematic", "Drone", "Same-day edit"], verified: true, yearsExp: 8, completedJobs: 1500,
      },
      {
        id: "p3", name: "Viet Art photo", avatar: "🖼️", rating: 4.6, reviews: 156,
        priceRange: "5 - 15 million", location: "Tan Binh District",
        description: "Wedding photography service at good prices, high quality albums.",
        portfolio: ["Traditional albums", "Artistic photos", "Family photo"],
        tags: ["Good price", "Quality", "Fast delivery"], verified: false, yearsExp: 5, completedJobs: 800,
      },
    ],
  },
  {
    id: "music",
    icon: <Music className="w-6 h-6" />,
    title: "Bands & DJs",
    subtitle: "Live music",
    description: "Live band and professional DJ",
    providers: [
      {
        id: "m1", name: "Saigon Sound", avatar: "🎵", rating: 4.8, reviews: 198,
        priceRange: "8 - 25 million", location: "District 1, Ho Chi Minh City",
        description: "Acoustic band & DJ specializes in weddings and high-end events.",
        portfolio: ["Acoustic band", "DJ Set", "Live band 6 people"],
        tags: ["acoustic", "DJ", "Big event"], verified: true, yearsExp: 10, completedJobs: 1200,
      },
      {
        id: "m2", name: "Melody Wedding", avatar: "🎶", rating: 4.6, reviews: 134,
        priceRange: "5 - 15 million", location: "District 3, Ho Chi Minh City",
        description: "Young music group specializes in performing at weddings with a diverse repertoire.",
        portfolio: ["Youth music", "International music", "Lyrical music"],
        tags: ["Youthful", "Diversity", "Good price"], verified: false, yearsExp: 4, completedJobs: 400,
      },
    ],
  },
  {
    id: "mc",
    icon: <Mic2 className="w-6 h-6" />,
    title: "MC Host",
    subtitle: "Professional leadership",
    description: "Bilingual MC, rich experience",
    providers: [
      {
        id: "mc1", name: "MC Thanh Bach", avatar: "🎤", rating: 4.9, reviews: 423,
        priceRange: "5 - 15 million", location: "TP.HCM",
        description: "MC hosts hundreds of weddings, with a witty and warm style.",
        portfolio: ["Bilingual MC", "Own script", "Mini games"],
        tags: ["Bilingual", "Humorous", "Experience"], verified: true, yearsExp: 15, completedJobs: 2000,
      },
      {
        id: "mc2", name: "MC Minh Tuyet", avatar: "💃", rating: 4.7, reviews: 189,
        priceRange: "3 - 8 million", location: "TP.HCM",
        description: "Young, dynamic female MC with inspiring voice.",
        portfolio: ["Wedding party MC", "Event MC", "Host the program"],
        tags: ["Female MC", "Youthful", "Nice voice"], verified: true, yearsExp: 6, completedJobs: 500,
      },
    ],
  },
  {
    id: "flower",
    icon: <Flower2 className="w-6 h-6" />,
    title: "Wedding Flowers & Decorations",
    subtitle: "Flower art",
    description: "Fresh flowers and wedding decorations",
    providers: [
      {
        id: "f1", name: "Dalat Hasfarm", avatar: "🌸", rating: 4.8, reviews: 267,
        priceRange: "5 - 30 million", location: "District 1, Ho Chi Minh City",
        description: "Fresh imported and Da Lat flowers, professional wedding decoration set up.",
        portfolio: ["Flower gate", "Party table flowers", "Bridal bouquet"],
        tags: ["Imported flowers", "Design", "Da Lat"], verified: true, yearsExp: 20, completedJobs: 5000,
      },
      {
        id: "f2", name: "Bloom Studio", avatar: "💐", rating: 4.6, reviews: 145,
        priceRange: "3 - 15 million", location: "District 7, Ho Chi Minh City",
        description: "Minimalist, modern style wedding flower studio.",
        portfolio: ["Minimalist bouquet", "Rustic decor", "Boho style"],
        tags: ["minimalist", "Modern", "Trendy"], verified: false, yearsExp: 3, completedJobs: 300,
      },
    ],
  },
  {
    id: "makeup",
    icon: <Palette className="w-6 h-6" />,
    title: "Bridal Makeup",
    subtitle: "Radiant wedding day",
    description: "Makeup & hairstyling expert",
    providers: [
      {
        id: "mk1", name: "Tina Le Makeup", avatar: "💄", rating: 4.9, reviews: 378,
        priceRange: "5 - 20 million", location: "District 1, Ho Chi Minh City",
        description: "Top makeup artist, natural style honors the bride's beauty.",
        portfolio: ["Korean makeup", "Classic makeup", "Natural makeup"],
        tags: ["Top artists", "Nature", "Korea"], verified: true, yearsExp: 12, completedJobs: 2500,
      },
      {
        id: "mk2", name: "Bridal scent", avatar: "✨", rating: 4.5, reviews: 98,
        priceRange: "2 - 8 million", location: "Go Vap District",
        description: "On-site bridal makeup, makeup + ao dai combo.",
        portfolio: ["Makeup on site", "Ao Dai combo", "Makeup party"],
        tags: ["On-site", "Combo", "Good price"], verified: false, yearsExp: 4, completedJobs: 350,
      },
    ],
  },
  {
    id: "planner",
    icon: <Crown className="w-6 h-6" />,
    title: "Wedding Planner",
    subtitle: "Full package organization",
    description: "Plan & coordinate the wedding day",
    providers: [
      {
        id: "wp1", name: "The Planners", avatar: "👑", rating: 4.9, reviews: 156,
        priceRange: "15 - 50 million", location: "District 2, Ho Chi Minh City",
        description: "Professional wedding planner team, organizing your dream wedding.",
        portfolio: ["Destination wedding", "Beach wedding", "Garden party"],
        tags: ["high-class", "destination", "Full package"], verified: true, yearsExp: 8, completedJobs: 400,
      },
    ],
  },
  {
    id: "catering",
    icon: <Utensils className="w-6 h-6" />,
    title: "Weddings & Catering",
    subtitle: "Exquisite cuisine",
    description: "The wedding menu is diverse",
    providers: [
      {
        id: "c1", name: "Golden Gate Catering", avatar: "🍽️", rating: 4.7, reviews: 234,
        priceRange: "20 - 60 million", location: "TP.HCM",
        description: "High-class wedding services with diverse Asian and European menus.",
        portfolio: ["Asian menu set", "High-class buffet", "Cocktail parties"],
        tags: ["Asia - Europe", "Buffet", "high-class"], verified: true, yearsExp: 12, completedJobs: 1800,
      },
      {
        id: "c2", name: "Saigon Banquet", avatar: "🥂", rating: 4.5, reviews: 167,
        priceRange: "10 - 35 million", location: "TP.HCM",
        description: "Traditional Vietnamese wedding party, served on-site.",
        portfolio: ["Traditional party", "Set family menu", "Dessert"],
        tags: ["traditional", "On-site", "Reasonable price"], verified: false, yearsExp: 7, completedJobs: 900,
      },
    ],
  },
];

// ─── Star Rating ──────────────────────────────────
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className="w-3 h-3"
        fill={i <= Math.round(rating) ? "#F59E0B" : "none"}
        style={{ color: i <= Math.round(rating) ? "#F59E0B" : "hsl(var(--muted-foreground))" }}
      />
    ))}
    <span className="ml-1 font-body text-xs font-bold text-foreground">{rating}</span>
  </div>
);

// ─── Provider Card ──────────────────────────────────
const ProviderCard = ({
  provider,
  index,
  accentColor,
  onBook,
}: {
  provider: Provider;
  index: number;
  accentColor: string;
  onBook: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, type: "spring", damping: 20 }}
    className="group bg-card rounded-2xl border border-border shadow-md hover:shadow-xl transition-all duration-400 overflow-hidden"
  >
    <div className="p-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="text-3xl">{provider.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-base font-bold text-foreground truncate">{provider.name}</h4>
            {provider.verified && (
              <div className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating rating={provider.rating} />
            <span className="text-muted-foreground font-body text-[10px]">({provider.reviews} reviews)</span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground font-body text-sm leading-relaxed mb-3 line-clamp-2">{provider.description}</p>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-3 text-muted-foreground">
        <span className="flex items-center gap-1 font-body text-[11px]">
          <MapPin className="w-3 h-3" /> {provider.location}
        </span>
        <span className="flex items-center gap-1 font-body text-[11px]">
          <Clock className="w-3 h-3" /> {provider.yearsExp} years
        </span>
        <span className="flex items-center gap-1 font-body text-[11px]">
          <ThumbsUp className="w-3 h-3" /> {provider.completedJobs}+
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {provider.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full font-body text-[10px] font-medium"
            style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Portfolio preview */}
      <div className="flex gap-1.5 mb-4">
        {provider.portfolio.map((item, i) => (
          <div
            key={i}
            className="flex-1 py-2 px-2 rounded-lg bg-secondary/50 text-center"
          >
            <p className="font-body text-[10px] text-muted-foreground truncate">{item}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div>
          <p className="font-body text-[10px] text-muted-foreground">Quote</p>
          <p className="font-display text-base font-bold" style={{ color: accentColor }}>{provider.priceRange}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBook}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-body text-sm font-semibold text-white shadow-md"
          style={{ backgroundColor: accentColor }}
        >
          <Send className="w-3.5 h-3.5" />
          Contact
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// ─── Booking Modal ──────────────────────────────────
const BookingModal = ({
  provider,
  serviceName,
  accentColor,
  onClose,
}: {
  provider: Provider;
  serviceName: string;
  accentColor: string;
  onClose: () => void;
}) => {
  const [submittedPreview, setSubmittedPreview] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", note: "" });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmittedPreview(true);
  };

  return (
    <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="max-w-md rounded-3xl p-0">
        <DialogHeader className="border-b border-border p-6 pr-14 text-left">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">{provider.avatar}</span>
            <div>
              <DialogTitle className="flex items-center gap-2 font-display text-lg">
                {provider.name}
                {provider.verified && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full" style={{ backgroundColor: accentColor }} aria-label="VERIFIED">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </span>
                )}
              </DialogTitle>
              <DialogDescription>{serviceName} • {provider.priceRange}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {submittedPreview ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">The request has not been sent</h3>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              This is a marketplace preview. The system has not yet connected to the service booking API; The information you enter is not saved or transferred to the provider.
            </p>
            <Button type="button" onClick={onClose} className="mt-6 h-11" style={{ backgroundColor: accentColor }}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div role="note" className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-950">
              Preview: this form doesn't submit or save data.
            </div>
            <div>
              <label htmlFor="booking-name" className="mb-1.5 block font-body text-sm font-semibold">
                <UserCheck className="mr-1.5 inline h-3.5 w-3.5" style={{ color: accentColor }} />
                Full Name
              </label>
              <Input id="booking-name" required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Enter your full name" autoComplete="name" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="booking-phone" className="mb-1.5 block font-body text-sm font-semibold">
                  <Phone className="mr-1.5 inline h-3.5 w-3.5" style={{ color: accentColor }} />
                  Phone number
                </label>
                <Input id="booking-phone" type="tel" required value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="0901..." autoComplete="tel" />
              </div>
              <div>
                <label htmlFor="booking-email" className="mb-1.5 block font-body text-sm font-semibold">
                  <Mail className="mr-1.5 inline h-3.5 w-3.5" style={{ color: accentColor }} />
                  Email
                </label>
                <Input id="booking-email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="e-mail@..." autoComplete="email" />
              </div>
            </div>
            <div>
              <label htmlFor="booking-date" className="mb-1.5 block font-body text-sm font-semibold">
                <CalendarCheck className="mr-1.5 inline h-3.5 w-3.5" style={{ color: accentColor }} />
                Expected wedding date
              </label>
              <Input id="booking-date" type="date" required value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} />
            </div>
            <div>
              <label htmlFor="booking-note" className="mb-1.5 block font-body text-sm font-semibold">Note</label>
              <Textarea id="booking-note" value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} className="resize-none" placeholder="Special requirements, number of guests..." />
            </div>
            <Button type="submit" className="h-11 w-full text-white" style={{ backgroundColor: accentColor }}>
              <Send className="h-4 w-4" />
              View test status
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};


// ─── Category Card ──────────────────────────────────
const CategoryCard = ({
  category,
  index,
  accentColor,
  onSelect,
}: {
  category: ServiceCategory;
  index: number;
  accentColor: string;
  onSelect: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-30px" }}
    transition={{ delay: index * 0.06, type: "spring", damping: 20 }}
    whileHover={{ y: -6, transition: { duration: 0.25 } }}
    onClick={onSelect}
    className="relative group bg-card rounded-2xl border border-border shadow-lg hover:shadow-2xl transition-all duration-400 overflow-hidden cursor-pointer"
  >
    {category.popular && (
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-white font-body text-[10px] font-bold uppercase tracking-wider"
        style={{ backgroundColor: accentColor }}>
        <Star className="w-3 h-3" fill="currentColor" /> Hot
      </div>
    )}

    <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}60)` }} />

    <div className="p-6">
      <motion.div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
        whileHover={{ rotate: [0, -10, 10, 0] }}>
        {category.icon}
      </motion.div>

      <h3 className="font-display text-lg font-bold text-foreground mb-0.5">{category.title}</h3>
      <p className="font-body text-xs mb-3" style={{ color: accentColor }}>{category.subtitle}</p>
      <p className="text-muted-foreground font-body text-sm mb-4">{category.description}</p>

      {/* Provider count & avatars */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            {category.providers.slice(0, 3).map((p, i) => (
              <span key={p.id} className="text-lg" style={{ zIndex: 3 - i }}>{p.avatar}</span>
            ))}
          </div>
          <span className="font-body text-xs text-muted-foreground ml-1">
            {category.providers.length} providers
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" style={{ color: accentColor }} />
      </div>
    </div>
  </motion.div>
);

// ─── Main Section ──────────────────────────────────
const WeddingServices = ({ accentColor }: { accentColor: string }) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [bookingProvider, setBookingProvider] = useState<{ provider: Provider; serviceName: string } | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "price" | "reviews">("rating");

  const sortedProviders = selectedCategory
    ? [...selectedCategory.providers].sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "reviews") return b.reviews - a.reviews;
        return 0;
      })
    : [];

  return (
    <section id="services" className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-[0.03]" style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-[0.03]" style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Header */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", delay: 0.2 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}12` }}>
                  <Sparkles className="w-7 h-7" style={{ color: accentColor }} />
                </motion.div>
                <span className="text-xs tracking-[0.4em] uppercase font-body" style={{ color: accentColor }}>Marketplace wedding services</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-3">Wedding Services</h2>
                <p className="text-muted-foreground font-body text-sm max-w-lg mx-auto">
                  Compare and choose the most suitable supplier from hundreds of reputable partners.
                </p>
              </motion.div>

              {/* Category Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {serviceCategories.map((cat, i) => (
                  <CategoryCard key={cat.id} category={cat} index={i} accentColor={accentColor} onSelect={() => setSelectedCategory(cat)} />
                ))}
              </div>

              {/* Bottom CTA */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 text-center">
                <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-card border border-border shadow-lg">
                  <Phone className="w-5 h-5" style={{ color: accentColor }} />
                  <div className="text-left">
                    <p className="font-body text-xs text-muted-foreground">Consulting hotline</p>
                    <p className="font-display text-lg font-bold text-foreground">0901 234 567</p>
                  </div>
                  <div className="w-[1px] h-8 bg-border mx-2" />
                  <div className="text-left">
                    <p className="font-body text-xs text-muted-foreground">Package combo</p>
                    <p className="font-body text-sm font-semibold" style={{ color: accentColor }}>Up to 20% off</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="providers" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              {/* Back + Title */}
              <div className="mb-8">
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm mb-4 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to category
                </motion.button>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}12`, color: accentColor }}>
                    {selectedCategory.icon}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">{selectedCategory.title}</h2>
                    <p className="text-muted-foreground font-body text-sm">{selectedCategory.providers.length} providers</p>
                  </div>
                </div>
              </div>

              {/* Sort bar */}
              <div className="flex items-center gap-2 mb-6">
                <span className="font-body text-xs text-muted-foreground mr-1">Arrange:</span>
                {([
                  { key: "rating", label: "Highly appreciated", icon: <Star className="w-3 h-3" /> },
                  { key: "reviews", label: "Many reviews", icon: <MessageSquare className="w-3 h-3" /> },
                ] as const).map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSortBy(s.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-xs font-medium transition-all ${
                      sortBy === s.key
                        ? "text-white shadow-md"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                    style={sortBy === s.key ? { backgroundColor: accentColor } : undefined}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>

              {/* Providers list */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sortedProviders.map((provider, i) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    index={i}
                    accentColor={accentColor}
                    onBook={() => setBookingProvider({ provider, serviceName: selectedCategory.title })}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingProvider && (
          <BookingModal
            provider={bookingProvider.provider}
            serviceName={bookingProvider.serviceName}
            accentColor={accentColor}
            onClose={() => setBookingProvider(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default WeddingServices;
