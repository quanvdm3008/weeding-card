import { useState, useEffect, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { API_BASE_URL } from '@/lib/api';

export interface LiveMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
}

export interface LiveGift {
  id: string;
  sender: string;
  giftType: string;
  timestamp: number;
}

export function useLiveInteraction(slug: string) {
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [hearts, setHearts] = useState<{ id: string }[]>([]);
  const [gifts, setGifts] = useState<LiveGift[]>([]);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!slug) return;

    const wsUrl = API_BASE_URL.replace(/^http/, "ws") + "/ws";

    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      client.subscribe(`/topic/live/${slug}/hearts`, () => {
        setHearts((prev) => [...prev, { id: Date.now().toString() + Math.random().toString() }]);
      });
      client.subscribe(`/topic/live/${slug}/messages`, (msg) => {
        setMessages((prev) => [...prev, JSON.parse(msg.body)]);
      });
      client.subscribe(`/topic/live/${slug}/gifts`, (msg) => {
        setGifts((prev) => [...prev, JSON.parse(msg.body)]);
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [slug]);

  const sendHeart = useCallback(() => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({ destination: `/app/live/${slug}/heart`, body: 'heart' });
    }
  }, [slug]);

  const sendMessage = useCallback((sender: string, content: string) => {
    if (clientRef.current?.connected) {
      const msg: LiveMessage = { id: Date.now().toString() + Math.random().toString(), sender, content, timestamp: Date.now() };
      clientRef.current.publish({ destination: `/app/live/${slug}/message`, body: JSON.stringify(msg) });
    }
  }, [slug]);

  const sendGift = useCallback((sender: string, giftType: string) => {
    if (clientRef.current?.connected) {
      const gift: LiveGift = { id: Date.now().toString() + Math.random().toString(), sender, giftType, timestamp: Date.now() };
      clientRef.current.publish({ destination: `/app/live/${slug}/gift`, body: JSON.stringify(gift) });
    }
  }, [slug]);

  return { messages, hearts, gifts, sendHeart, sendMessage, sendGift, setHearts, setMessages };
}
