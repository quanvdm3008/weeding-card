import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Area label for easy-to-trace error logging (e.g. "invitation-page"). */
  scope?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Prevents page-level crashes: a component fails (eg, the template renders the wrong data)
 * whitening the entire app is not allowed — shows friendly fallback instead of unmount root.
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.scope ? `:${this.props.scope}` : ""}]`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 text-center">
          <div>
            <h1 className="font-display text-3xl text-foreground">There was an error displaying the page</h1>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              Sorry for the inconvenience — please reload the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-body text-sm font-semibold hover:opacity-90 transition"
            >
              Reload the page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
