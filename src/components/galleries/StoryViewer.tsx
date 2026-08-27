import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface StoryItem {
  title: string;
  date: string;
  text: string;
  img: string;
}

interface StoryViewerProps {
  stories: StoryItem[];
  initialIndex?: number;
  onClose: () => void;
  accentColor?: string;
}

const STORY_DURATION = 8000; // 8 seconds per story

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex = 0,
  onClose,
  accentColor = "#ffffff",
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Prevent scrolling when viewer is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose(); // Close if it's the last story
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    } else {
      setProgress(0); // Restart first story if clicking prev on first
    }
  }, [currentIndex]);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number;

    const animateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      if (!isPaused) {
        const elapsedTime = timestamp - startTime;
        const currentProgress = (elapsedTime / STORY_DURATION) * 100;

        if (currentProgress >= 100) {
          handleNext();
        } else {
          setProgress(currentProgress);
        }
      } else {
        // Shift start time so progress doesn't jump when unpaused
        startTime = timestamp - (progress / 100) * STORY_DURATION;
      }

      animationFrameId = requestAnimationFrame(animateProgress);
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentIndex, isPaused, handleNext, progress]);

  if (!stories || stories.length === 0) return null;

  const currentStory = stories[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-xl"
      >
        <div className="relative w-full h-[100dvh] max-w-md bg-neutral-900 overflow-hidden md:h-[90vh] md:rounded-3xl md:border md:border-white/10 md:shadow-2xl">
          
          {/* Progress Bars */}
          <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-3 px-4 pt-4">
            {stories.map((_, idx) => (
              <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-md">
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{
                    width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? "100%" : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header Controls */}
          <div className="absolute top-6 left-0 right-0 z-40 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tracking-wider text-white uppercase drop-shadow-md">
                {currentStory.date}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image & Gradient */}
          <div className="absolute inset-0">
            <img
              src={currentStory.img}
              alt={currentStory.title}
              className="w-full h-full object-cover"
            />
            {/* Top gradient for readability of progress bars */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
            {/* Bottom gradient for text */}
            <div className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 inset-x-0 p-6 pb-12 z-30 pointer-events-none">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl font-serif text-white mb-3 drop-shadow-lg leading-tight">
                {currentStory.title}
              </h2>
              <p className="text-sm text-white/80 leading-relaxed font-sans backdrop-blur-sm bg-black/20 p-4 rounded-xl border border-white/10">
                {currentStory.text}
              </p>
            </motion.div>
          </div>

          {/* Interaction Zones */}
          <div className="absolute inset-0 z-20 flex pt-20 pb-40">
            {/* Left Zone: Prev */}
            <div
              className="w-1/3 h-full cursor-w-resize"
              onPointerDown={() => setIsPaused(true)}
              onPointerUp={() => {
                setIsPaused(false);
                handlePrev();
              }}
              onPointerLeave={() => setIsPaused(false)}
            />
            {/* Right Zone: Next */}
            <div
              className="w-2/3 h-full cursor-e-resize"
              onPointerDown={() => setIsPaused(true)}
              onPointerUp={() => {
                setIsPaused(false);
                handleNext();
              }}
              onPointerLeave={() => setIsPaused(false)}
            />
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
