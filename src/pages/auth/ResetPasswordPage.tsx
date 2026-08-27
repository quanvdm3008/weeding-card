import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Lock, Loader2 } from "lucide-react";
import { z } from "zod";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must have at least 8 characters").max(72),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirmation password does not match",
    path: ["confirmPassword"],
  });

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Password reset link is invalid");
      return;
    }
    const parsed = passwordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid data");
      return;
    }
    setLoading(true);
    const { error } = await resetPassword(token, parsed.data.password);
    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Password reset successful — please log in again");
    navigate("/login", { replace: true });
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
          {!token ? (
            <div className="text-center">
              <h1 className="font-display text-2xl text-foreground mb-3">Link is not valid</h1>
              <p className="font-body text-sm text-muted-foreground">
                The password reset link is missing or has expired — please request a new link.
              </p>
              <Link to="/forgot-password" className="inline-block mt-4 text-accent font-semibold hover:underline">
                Request new link
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl text-foreground">Reset password</h1>
                <p className="font-body text-sm text-muted-foreground mt-2">Enter a new password for your account</p>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div className="relative">
                  <label htmlFor="new-password" className="sr-only">New password</label>
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-full bg-card pl-11 pr-4 font-body"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={72}
                  />
                </div>
                <div className="relative">
                  <label htmlFor="confirm-password" className="sr-only">Confirm new password</label>
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 rounded-full bg-card pl-11 pr-4 font-body"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={72}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-full bg-foreground font-body text-background hover:bg-foreground/85"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Reset password
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

export default ResetPasswordPage;
