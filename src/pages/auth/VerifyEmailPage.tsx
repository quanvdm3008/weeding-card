import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

type Status = "verifying" | "success" | "error";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const verifyEmail = useAuthStore((s) => s.verifyEmail);
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    if (!token) {
      setStatus("error");
      setErrorMessage("The verification link is not valid");
      return;
    }
    void (async () => {
      const { error } = await verifyEmail(token);
      if (error) {
        setStatus("error");
        setErrorMessage(error);
      } else {
        setStatus("success");
      }
    })();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-background via-secondary/30 to-background">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <span className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center shadow-gold">
            <Heart className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight">
            Mireia<span className="text-accent">.</span>
          </span>
        </Link>

        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-border shadow-elegant text-center">
          {status === "verifying" && (
            <>
              <Loader2 className="w-10 h-10 mx-auto text-accent animate-spin mb-4" />
              <h1 className="font-display text-2xl text-foreground">Verifying email...</h1>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle2 className="w-10 h-10 mx-auto text-green-600 mb-4" />
              <h1 className="font-display text-2xl text-foreground mb-3">Verified successfully</h1>
              <p className="font-body text-sm text-muted-foreground">Your email has been verified.</p>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle className="w-10 h-10 mx-auto text-destructive mb-4" />
              <h1 className="font-display text-2xl text-foreground mb-3">Verification failed</h1>
              <p className="font-body text-sm text-muted-foreground">{errorMessage}</p>
            </>
          )}

          <div className="mt-6 font-body text-sm text-muted-foreground">
            <Link to="/dashboard" className="text-accent font-semibold hover:underline">
              About Dashboard
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
