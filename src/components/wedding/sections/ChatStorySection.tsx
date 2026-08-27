import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Heart, Smartphone } from "lucide-react";
import type { WeddingTheme } from "@/data/themes";
import type { ChatMessage } from "@/data/seedData";
import { WEDDING_SEED_DATA } from "@/data/seedData";

interface ChatStorySectionProps {
  groomName?: string;
  brideName?: string;
  accentColor: string;
  theme: WeddingTheme;
  /** Array of messages. Falls back to seed data if omitted. */
  chatMessages?: ChatMessage[];
}

interface BubbleProps {
  msg: ChatMessage;
  groomName: string;
  brideName: string;
  accentColor: string;
  index: number;
}

const avatarText = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const ChatBubble = ({ msg, groomName, brideName, accentColor, index }: BubbleProps) => {
  const isSender = msg.sender === "groom"; // groom = right (sender)
  const name = isSender ? groomName : brideName;

  return (
    <motion.div
      initial={{ opacity: 0, x: isSender ? 40 : -40, y: 10 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.12 }}
      className={`flex items-end gap-2 ${isSender ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {!isSender && (
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white shadow-md"
          style={{ background: `linear-gradient(135deg, ${accentColor}aa, ${accentColor})` }}
        >
          {avatarText(name)}
        </div>
      )}

      <div className={`flex flex-col max-w-[72%] ${isSender ? "items-end" : "items-start"}`}>
        {/* Sender label (only first bubble of each streak) */}
        <span className="text-[10px] text-muted-foreground mb-1 px-1">
          {name} · {msg.time}
        </span>

        {/* Bubble */}
        <div
          className={`relative px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
            isSender
              ? "rounded-br-sm text-white"
              : "rounded-bl-sm bg-card/80 text-foreground border border-border"
          }`}
          style={isSender ? { background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor})` } : {}}
        >
          {msg.text}
        </div>

        {/* Reaction */}
        {msg.reaction && (
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", delay: index * 0.12 + 0.3 }}
            className={`text-base mt-1 ${isSender ? "mr-1" : "ml-1"}`}
          >
            {msg.reaction}
          </motion.span>
        )}
      </div>

      {/* Sender avatar */}
      {isSender && (
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white shadow-md"
          style={{ background: `linear-gradient(135deg, ${accentColor}77, ${accentColor}aa)` }}
        >
          {avatarText(name)}
        </div>
      )}
    </motion.div>
  );
};

// ─── Date separator ─────────────────────────────────────
const DateSep = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 py-2">
    <div className="flex-1 h-px bg-border" />
    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
    <div className="flex-1 h-px bg-border" />
  </div>
);

// ─── Phone frame wrapper ─────────────────────────────────
const PhoneFrame = ({
  groomName,
  brideName,
  accentColor,
  messages,
}: {
  groomName: string;
  brideName: string;
  accentColor: string;
  messages: ChatMessage[];
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
    className="relative mx-auto"
    style={{ maxWidth: 380 }}
  >
    {/* Outer phone shell */}
    <div
      className="rounded-[40px] shadow-2xl border-[8px] border-foreground/10 bg-card overflow-hidden"
      style={{ boxShadow: `0 40px 80px -30px ${accentColor}44` }}
    >
      {/* Notch bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: `linear-gradient(90deg, ${accentColor}22, ${accentColor}11)` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: `linear-gradient(135deg, ${accentColor}bb, ${accentColor})` }}
          >
            {avatarText(brideName)}
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground leading-tight">{brideName}</p>
            <p className="text-[10px] text-green-500">● Online</p>
          </div>
        </div>
        <Smartphone className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Messages area */}
      <div className="px-3 py-4 space-y-3 min-h-[400px] max-h-[520px] overflow-y-auto bg-background/60 backdrop-blur-sm">
        <DateSep label="First message 💬" />
        <AnimatePresence>
          {messages.map((msg, i) => (
            <ChatBubble
              key={i}
              msg={msg}
              groomName={groomName}
              brideName={brideName}
              accentColor={accentColor}
              index={i}
            />
          ))}
        </AnimatePresence>
        <DateSep label="And from there, the story never ended ❤" />
      </div>

      {/* Bottom bar */}
      <div className="px-4 py-3 flex items-center gap-2 bg-card/80 border-t border-border">
        <div className="flex-1 bg-muted rounded-full px-4 py-1.5 text-xs text-muted-foreground">
          Texting...
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: accentColor }}
        >
          <Heart className="w-4 h-4 text-white" fill="white" />
        </div>
      </div>
    </div>

    {/* Glow effect */}
    <div
      className="absolute inset-0 rounded-[44px] -z-10 blur-3xl opacity-20"
      style={{ backgroundColor: accentColor }}
    />
  </motion.div>
);

// ─── Main exported component ─────────────────────────────
const ChatStorySection = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  accentColor,
  theme,
  chatMessages = WEDDING_SEED_DATA.chatMessages,
}: ChatStorySectionProps) => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background blobs */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: accentColor }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: accentColor }}
        animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
        transition={{ duration: 25, repeat: Infinity }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="text-xs tracking-[0.4em] uppercase font-body"
            style={{ color: accentColor }}
          >
            Love story
          </span>
          <h2 className="font-display text-4xl @md:text-5xl font-bold text-foreground mt-3">
            First Message
          </h2>
          <p className="mt-4 text-muted-foreground font-body text-sm max-w-md mx-auto leading-relaxed">
            Every great love starts with a small message. This is where our story begins.
          </p>
          <motion.div
            className="mt-6 flex items-center justify-center gap-2"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <MessageCircle className="w-5 h-5" style={{ color: accentColor }} />
          </motion.div>
        </motion.div>

        {/* Layout: description + phone */}
        <div className="grid @md:grid-cols-2 gap-12 items-center">
          {/* Left: story text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div
              className={`p-6 ${theme.cardRadius} border border-border/50 bg-card/60 backdrop-blur-sm`}
            >
              <p className="font-display text-xl font-semibold text-foreground mb-3">
                Text messages change everything 💬
              </p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Sometimes just a simple text message is enough to change a life. {groomName} and {brideName} started their journey like that — gently, naturally and full of fate.
              </p>
            </div>

            <div
              className={`p-6 ${theme.cardRadius} border border-border/50 bg-card/60 backdrop-blur-sm`}
            >
              <p className="font-display text-xl font-semibold text-foreground mb-3">
                From strangers to loved ones 💑
              </p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                And from those ordinary messages, together we wrote the most beautiful love story of our lives - the story that we want to share with you today.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${accentColor}22` }}
              >
                <Heart className="w-6 h-6" style={{ color: accentColor }} fill={accentColor} />
              </div>
              <p className="font-display italic text-lg text-foreground">
                "{groomName} & {brideName}"
              </p>
            </div>
          </motion.div>

          {/* Right: phone mockup */}
          <PhoneFrame
            groomName={groomName}
            brideName={brideName}
            accentColor={accentColor}
            messages={chatMessages}
          />
        </div>
      </div>
    </section>
  );
};

export default ChatStorySection;
