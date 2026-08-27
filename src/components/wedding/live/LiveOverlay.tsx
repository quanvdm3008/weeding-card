import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { LiveMessage } from '@/hooks/useLiveInteraction';

interface LiveOverlayProps {
  hearts: { id: string }[];
  messages: LiveMessage[];
  onHeartAnimationComplete: (id: string) => void;
  onMessageAnimationComplete: (id: string) => void;
}

export function LiveOverlay({ hearts, messages, onHeartAnimationComplete, onMessageAnimationComplete }: LiveOverlayProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Floating Luxury Hearts */}
      <AnimatePresence>
        {hearts.map((heart, idx) => {
          const heartColors = ["text-rose-500", "text-amber-400", "text-pink-400", "text-rose-400", "text-yellow-300"];
          const colorClass = heartColors[idx % heartColors.length];
          const randomDrift = Math.random() * 120 - 60;
          const randomRotation = Math.random() * 40 - 20;
          const randomScale = 0.8 + Math.random() * 0.7;

          return (
            <motion.div
              key={heart.id}
              initial={{ opacity: 1, y: 0, x: 0, scale: 0.4, rotate: 0 }}
              animate={{ 
                opacity: [1, 1, 0.8, 0], 
                y: -480, 
                x: [0, randomDrift * 0.5, randomDrift], 
                scale: [0.4, randomScale * 1.2, randomScale],
                rotate: [0, randomRotation, randomRotation * 1.5]
              }}
              transition={{ duration: 2.8, ease: [0.25, 0.1, 0.25, 1] }}
              onAnimationComplete={() => onHeartAnimationComplete(heart.id)}
              className={`absolute bottom-24 right-8 ${colorClass} drop-shadow-[0_4px_12px_rgba(244,63,94,0.5)]`}
            >
              <Heart fill="currentColor" size={32} />
              {/* Little sparkling star */}
              <span className="absolute -top-1 -right-1 text-yellow-200 text-xs animate-ping">✦</span>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Floating Messages (TikTok style) */}
      <div className="absolute bottom-24 left-4 right-20 flex flex-col gap-2 justify-end pointer-events-none h-[300px] sm:h-[400px] overflow-hidden mask-image-to-top">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              layout
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              onAnimationComplete={() => {
                setTimeout(() => onMessageAnimationComplete(msg.id), 6000);
              }}
              className="bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-[13px] shadow-sm self-start inline-block max-w-[85%]"
            >
              <span className="font-semibold text-white/70 mr-2">{msg.sender}:</span>
              <span className="font-medium text-white">{msg.content}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
