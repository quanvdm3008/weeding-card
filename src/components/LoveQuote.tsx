import { motion } from "framer-motion";

const quotes = [
  { text: "Love is not looking at each other, but looking together in the same direction.", author: "Antoine de Saint-Exupery" },
  { text: "Where there is love, there is life.", author: "Mahatma Gandhi" },
  { text: "Love is when the happiness of another person is more important than your own happiness.", author: "H. Jackson Brown Jr." },
];

interface LoveQuoteProps {
  accentColor: string;
  quoteIndex?: number;
}

const LoveQuote = ({ accentColor, quoteIndex }: LoveQuoteProps) => {
  const quote = quotes[quoteIndex ?? Math.floor(Math.random() * quotes.length)];

  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.div
          className="text-5xl mb-6"
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 10, delay: 0.2 }}
        >
          💌
        </motion.div>
        <blockquote className="relative">
          <span className="absolute -top-6 -left-2 font-display text-6xl leading-none opacity-15" style={{ color: accentColor }}>"</span>
          <p className="font-display text-xl @md:text-2xl italic text-foreground leading-relaxed px-8">
            {quote.text}
          </p>
          <span className="absolute -bottom-8 -right-2 font-display text-6xl leading-none opacity-15" style={{ color: accentColor }}>"</span>
        </blockquote>
        <motion.div
          className="w-12 h-[1px] mx-auto my-6"
          style={{ backgroundColor: accentColor }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        />
        <p className="font-body text-sm text-muted-foreground tracking-wider">— {quote.author}</p>
      </motion.div>
    </section>
  );
};

export default LoveQuote;
