import React from "react";
import { LiveOverlay } from "./LiveOverlay";
import { LiveInteractionPanel } from "./LiveInteractionPanel";
import { useLiveInteraction } from "@/hooks/useLiveInteraction";

interface LiveFeaturesProps {
  slug: string;
}

export const LiveFeatures = ({ slug }: LiveFeaturesProps) => {
  const { messages, hearts, sendHeart, sendMessage, setHearts, setMessages } = useLiveInteraction(slug);
  return (
    <>
      <LiveOverlay 
        hearts={hearts} 
        messages={messages} 
        onHeartAnimationComplete={(id) => setHearts((prev) => prev.filter((h) => h.id !== id))} 
        onMessageAnimationComplete={(id) => setMessages((prev) => prev.filter((m) => m.id !== id))} 
      />
      <LiveInteractionPanel 
        onSendHeart={sendHeart}
        onSendMessage={sendMessage}
      />
    </>
  );
};
