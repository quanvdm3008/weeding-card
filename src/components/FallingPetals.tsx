import { useMemo } from "react";

interface FallingPetalsProps {
  count?: number;
}

const paths = [
  "M8 1C3 5 1 10 4 14c4 5 11 2 13-4C15 5 12 2 8 1Z",
  "M10 1C5 3 2 8 3 13c2 6 10 7 14 1C20 8 16 3 10 1Z",
  "M9 2C4 5 3 11 7 15c5 4 11 0 11-6C16 4 13 2 9 2Z",
];

const FallingPetals = ({ count = 14 }: FallingPetalsProps) => {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: (index * 17 + 9) % 100,
        delay: (index % 7) * 1.2,
        duration: 15 + (index % 5) * 2,
        size: 12 + (index % 4) * 4,
        opacity: 0.18 + (index % 4) * 0.06,
        path: paths[index % paths.length],
        drift: index % 2 === 0 ? 46 : -38,
      })),
    [count]
  );

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="absolute motion-safe:animate-petal-drift motion-reduce:hidden"
          style={{
            left: `${petal.left}%`,
            top: "-32px",
            opacity: petal.opacity,
            width: petal.size,
            height: petal.size,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            ["--petal-drift" as string]: `${petal.drift}px`,
            ["--petal-opacity" as string]: petal.opacity,
          }}
        >
          <svg viewBox="0 0 20 18" className="h-full w-full text-[hsl(var(--rose)/0.75)] drop-shadow-sm">
            <path d={petal.path} fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );
};

export default FallingPetals;
