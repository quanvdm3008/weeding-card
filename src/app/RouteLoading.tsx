const RouteLoading = () => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Loading page"
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFF8F5]"
  >
    <div className="relative flex items-center justify-center">
      <div className="h-16 w-16 rounded-full border-2 border-[#C9A96E] border-t-transparent motion-safe:animate-spin" />
      <div className="absolute h-3 w-3 rounded-full bg-[#C9A96E] motion-safe:animate-pulse" />
    </div>
    <span className="mt-4 font-display text-sm uppercase tracking-[0.2em] text-[#C9A96E] motion-safe:animate-pulse">
      Wedding Invitation
    </span>
  </div>
);

export default RouteLoading;
