import { Suspense, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import AppProviders from "@/app/AppProviders";
import RouteLoading from "@/app/RouteLoading";
import { appRoutes } from "@/app/routes";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useAuthStore } from "@/store/authStore";

const AppRoutes = () => useRoutes(appRoutes);

const App = () => {
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    void init();
  }, [init]);

  return (
    <AppProviders>
      <ErrorBoundary scope="app">
        <Suspense fallback={<RouteLoading />}>
          <AppRoutes />
        </Suspense>
      </ErrorBoundary>
    </AppProviders>
  );
};

export default App;
