import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Mail, Loader2 } from "lucide-react";
import { z } from "zod";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const emailSchema = z.string().trim().email("Invalid email").max(255);

const ForgotPasswordPage = () => {
  const forgotPassword = useAuthStore((s) => s.forgotPassword);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setLoading(true);
    const { error } = await forgotPassword(parsed.data);
    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    // Always show a success message whether the email exists or not — avoid revealing which email has been registered.
    setSent(true);
  };

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

        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-border shadow-elegant">
          {sent ? (
            <div className="text-center">
              <h1 className="font-display text-2xl text-foreground mb-3">Check your email</h1>
              <p className="font-body text-sm text-muted-foreground">
                If this email is registered, we have sent a password reset link — the link is valid for 30 minutes.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl text-foreground">Forgot password</h1>
                <p className="font-body text-sm text-muted-foreground mt-2">
                  Enter email to receive password reset link
                </p>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div className="relative">
                  <label htmlFor="forgot-email" className="sr-only">Email</label>
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-full bg-card pl-11 pr-4 font-body"
                    autoComplete="email"
                    required
                    maxLength={255}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-full bg-foreground font-body text-background hover:bg-foreground/85"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send password reset link
                </Button>
              </form>
            </>
          )}

          <div className="mt-6 text-center font-body text-sm text-muted-foreground">
            <Link to="/login" className="text-accent font-semibold hover:underline">
              Return to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
