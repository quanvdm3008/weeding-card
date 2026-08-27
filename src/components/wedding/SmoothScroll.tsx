import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
  wrapperRef?: React.RefObject<HTMLElement | null>;
  contentRef?: React.RefObject<HTMLElement | null>;
}

export const SmoothScroll = ({ children, wrapperRef, contentRef }: SmoothScrollProps) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const options: ConstructorParameters<typeof Lenis>[0] = {
      duration: 0.85,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.25,
    };

    if (wrapperRef?.current && contentRef?.current) {
      options.wrapper = wrapperRef.current;
      options.content = contentRef.current;
    }

    const lenis = new Lenis(options);
    lenisRef.current = lenis;

    let frameId = 0;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      if (lenisRef.current === lenis) lenisRef.current = null;
    };
  }, [wrapperRef, contentRef]);

  return <>{children}</>;
};
