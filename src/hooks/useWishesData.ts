import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getPublicWishes, likePublicWish, postPublicWish } from "@/lib/invitations";
import { useRealtimeChannel } from "@/hooks/useRealtimeChannel";
import { getApiErrorMessage } from "@/lib/api";

export interface WishRealtimePayload {
  id: string;
  authorName: string;
  message: string;
  emoji: string;
  likes: number;
  createdAtUtc: string;
}

export interface Wish {
  id: number | string;
  name: string;
  message: string;
  emoji: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  content?: string;
  createdAt?: string;
  isLiked?: boolean;
  hasLiked?: boolean;
}

export const sampleWishes: Wish[] = [
  { id: 1, name: "Mr. Tuan", message: "Wishing you two hundreds of years of happiness! 🎊", emoji: "✉️", timestamp: "2 hours ago", likes: 12, liked: false },
  { id: 2, name: "Ms. Mai", message: "Be happy forever! Love you two so much!", emoji: "🌸", timestamp: "3 hours ago", likes: 8, liked: false },
  { id: 3, name: "Hung friend", message: "Hundred years of happiness, have a baby soon! 💍", emoji: "💌", timestamp: "5 hours ago", likes: 15, liked: false },
  { id: 4, name: "Miss Lan", message: "Congratulate on your happiness! She is very happy for her two children.", emoji: "💐", timestamp: "6 hours ago", likes: 6, liked: false },
  { id: 5, name: "Group of close friends", message: "Happy Wedding! Let's always be together! 🥂", emoji: "💖", timestamp: "8 hours ago", likes: 20, liked: false },
  { id: 6, name: "Uncle Phuong", message: "Wishing you both always love and understand each other.", emoji: "❤️", timestamp: "10 hours ago", likes: 9, liked: false },
  { id: 7, name: "Linh", message: "You and I are such a beautiful couple! Wishing happiness!", emoji: "🎈", timestamp: "12 hours ago", likes: 4, liked: false },
  { id: 8, name: "Colleague", message: "Best wishes for your new journey together! 🎁", emoji: "🎉", timestamp: "1 day ago", likes: 11, liked: false },
];

export function useWishesData(publicSlug?: string) {
  const [wishes, setWishes] = useState<Wish[]>(sampleWishes);

  useEffect(() => {
    if (!publicSlug) return;
    getPublicWishes(publicSlug)
      .then((result) => {
        setWishes(result.items.map((wish) => {
          const d = new Date(wish.createdAtUtc);
          return {
            id: wish.id,
            name: wish.authorName,
            message: wish.message,
            emoji: wish.emoji,
            timestamp: !isNaN(d.getTime()) ? d.toLocaleDateString("en-US") : "",
            likes: wish.likes,
            liked: false,
          };
        }));
      })
      .catch(() => undefined);
  }, [publicSlug]);

  useRealtimeChannel<WishRealtimePayload>(
    publicSlug ? `/topic/invitations/${publicSlug}/wishes` : null,
    (payload) => {
      setWishes((prev) => {
        if (prev.some((w) => String(w.id) === String(payload.id))) {
          return prev;
        }
        const d = new Date(payload.createdAtUtc);
        const newWish: Wish = {
          id: payload.id,
          name: payload.authorName,
          message: payload.message,
          emoji: payload.emoji,
          timestamp: !isNaN(d.getTime()) ? d.toLocaleDateString("en-US") : "Just now",
          likes: payload.likes,
          liked: false,
        };
        return [newWish, ...prev];
      });
    }
  );

  const handleLike = (id: number | string) => {
    setWishes((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, liked: !w.liked, likes: w.liked ? w.likes - 1 : w.likes + 1 }
          : w
      )
    );
    if (publicSlug && typeof id === "string") {
      likePublicWish(publicSlug, id)
        .then((updated) => {
          setWishes((prev) => prev.map((w) => (w.id === id ? { ...w, likes: updated.likes } : w)));
        })
        .catch(() => undefined);
    }
  };

  const handleSubmit = async (nameOrInput: string | { name: string; content: string }, message?: string, emoji = "💌") => {
    const name = typeof nameOrInput === "string" ? nameOrInput : nameOrInput.name;
    const wishMessage = typeof nameOrInput === "string" ? message ?? "" : nameOrInput.content;
    let persisted: Awaited<ReturnType<typeof postPublicWish>> | null = null;
    try {
      persisted = publicSlug ? await postPublicWish(publicSlug, name, wishMessage, emoji) : null;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to send greetings"));
      throw error;
    }
    const wish: Wish = {
      id: persisted?.id ?? Date.now(),
      name: persisted?.authorName ?? name,
      message: persisted?.message ?? wishMessage,
      emoji: persisted?.emoji ?? emoji,
      timestamp: "Just finished",
      likes: persisted?.likes ?? 0,
      liked: false,
    };
    setWishes((prev) => (prev.some((item) => item.id === wish.id) ? prev : [wish, ...prev]));
  };

  const compatibleWishes = wishes.map((wish) => ({
    ...wish,
    content: wish.message,
    createdAt: wish.timestamp,
    isLiked: wish.liked,
    hasLiked: wish.liked,
  }));

  return { wishes: compatibleWishes, handleLike, handleSubmit };
}
