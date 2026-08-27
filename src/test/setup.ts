/* General setup for testing running in the jsdom environment.*/
/* The stubs below only apply when there is a window (pure test nodes are not affected).*/

if (typeof window !== "undefined") {
  /* framer-motion whileInView needs IntersectionObserver — jsdom doesn't have it*/
  class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  window.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;

  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

  if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList;
  }

  window.scrollTo = () => {};

  /* WishesWall calls API when publicSlug is present — returns empty list for test*/
  window.fetch = (() =>
    Promise.resolve({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ items: [], page: 1, pageSize: 50, totalCount: 0 })),
    })) as unknown as typeof fetch;
}
