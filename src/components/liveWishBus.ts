export interface LiveWish {
  id: number | string;
  name: string;
  message: string;
  emoji: string;
}

type WishListener = (wish: LiveWish) => void;
const listeners = new Set<WishListener>();

export function emitWish(wish: LiveWish) {
  listeners.forEach((listener) => listener(wish));
}

export function subscribeToWishes(listener: WishListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
