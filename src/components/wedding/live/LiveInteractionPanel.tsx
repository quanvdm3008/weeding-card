import React, { useState } from 'react';
import { Heart, Send, MessageCircleHeart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LiveInteractionPanelProps {
  onSendHeart: () => void;
  onSendMessage: (sender: string, content: string) => void;
}

export function LiveInteractionPanel({ onSendHeart, onSendMessage }: LiveInteractionPanelProps) {
  // Chat input removed as per user request
  return (
    <div className="fixed bottom-6 right-4 z-50 flex items-end justify-end pointer-events-none">
      {/* Right side: Heart Button */}
      <div className="pointer-events-auto shrink-0 mb-1 mr-2">
        <Button 
          onClick={onSendHeart}
          size="icon" 
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-[0_0_20px_rgba(244,63,94,0.4)] border-2 border-white/80 active:scale-95 transition-all"
        >
          <Heart className="w-7 h-7 text-white fill-white" />
        </Button>
      </div>
    </div>
  );
}
