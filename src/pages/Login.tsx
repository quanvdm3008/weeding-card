import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Heart, Mail, Lock, User as UserIcon, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { z } from "zod";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/i18n/LocaleProvider";

const authSchema = (locale: "vi" | "en") => z.object({
  email: z.string().trim().email(locale === "vi" ? "Invalid email" : "Invalid email address").max(255),
  password: z.string().min(8, locale === "vi" ? "Password minimum 8 characters" : "Password must contain at least 8 characters").max(72),
  displayName: z.string().trim().min(1, locale === "vi" ? "Please enter a display name" : "Display name is required").max(80).optional(),
});

const destinationFor = (roles: string[] | undefined, from: string) => {
  if (from !== "/dashboard") return from;
  if (roles?.includes("Admin")) return "/admin";
  if (roles?.includes("PROVIDER")) return "/provider";
  return "/dashboard";
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, initialized, signIn, signUp, loading } = useAuthStore();
  const { locale, t } = useLocale();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<"OWNER" | "PROVIDER">("OWNER");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  useEffect(() => {
    if (initialized && user) navigate(destinationFor(user.roles, from), { replace: true });
  }, [from, initialized, navigate, user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = authSchema(locale).safeParse({
      email,
      password,
      displayName: mode === "signup" ? displayName : undefined,
    });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => { const key = String(issue.path[0] ?? "form"); if (!errors[key]) errors[key] = issue.message; });
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    if (mode === "signin") {
      const { error } = await signIn(email, password);
      if (error) return toast.error(error);
      toast.success(locale === "vi" ? "Log in successfully" : "Signed in successfully");
      navigate(destinationFor(useAuthStore.getState().user?.roles, from), { replace: true });
    } else {
      const { error } = await signUp(email, password, displayName, accountType);
      if (error) return toast.error(error);
      toast.success(locale === "vi" ? "Account created successfully" : "Account created successfully");
      navigate(destinationFor(useAuthStore.getState().user?.roles, from), { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1eb] p-3 sm:p-5">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1500px] overflow-hidden rounded-[2rem] bg-white shadow-[0_35px_120px_-55px_rgba(40,25,15,.65)] sm:min-h-[calc(100vh-2.5rem)] lg:grid-cols-[1.08fr_.92fr]">
        <section className="relative hidden overflow-hidden bg-[#1b1817] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(232,180,184,.45),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(201,169,110,.3),transparent_35%)]" />
          <div className="absolute -right-28 top-32 h-[520px] w-[380px] rotate-6 rounded-[45%] border border-white/15 bg-gradient-to-b from-white/15 to-transparent shadow-2xl backdrop-blur" />
          <Link to="/" className="relative z-10 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#e8b4b8] text-[#1b1817]"><Heart className="h-4 w-4 fill-current" /></span><span className="font-display text-2xl font-semibold">Mireia.</span></Link>
          <div className="relative z-10 max-w-2xl pb-10">
            <p className="mb-5 text-xs font-bold uppercase tracking-[.3em] text-[#e8b4b8]">Wedding experience studio</p>
            <h2 className="font-display text-6xl font-medium leading-[.95] xl:text-8xl">{locale === "vi" ? "Each invitation is a memorable story." : "Every invitation deserves a story worth reminding."}</h2>
            <div className="mt-10 grid grid-cols-3 gap-5 border-t border-white/15 pt-6 text-sm text-white/65"><span><Sparkles className="mb-2 h-5 w-5 text-[#e8b4b8]" />{locale === "vi" ? "20+ distinct templates" : "20+ distinct designs"}</span><span><Heart className="mb-2 h-5 w-5 text-[#e8b4b8]" />{locale === "vi" ? "Real-time RSVP" : "Realtime RSVP"}</span><span><ShieldCheck className="mb-2 h-5 w-5 text-[#e8b4b8]" />{locale === "vi" ? "Confidential data" : "Protected data"}</span></div>
          </div>
        </section>

        <motion.main initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-center px-5 py-10 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <Link to="/" className="mb-10 flex items-center gap-2 lg:hidden"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#1b1817] text-white"><Heart className="h-4 w-4 fill-current" /></span><span className="font-display text-2xl font-semibold">Mireia.</span></Link>
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[.22em] text-accent">{mode === "signin" ? "Welcome back" : "Create your story"}</p>
            <h1 className="font-display text-4xl text-foreground sm:text-5xl">
              {mode === "signin" ? t("auth.welcome") : t("auth.create")}
            </h1>
            <p className="mt-3 font-body text-sm leading-6 text-muted-foreground">
              {mode === "signin"
                ? t("auth.signInDescription")
                : t("auth.signUpDescription")}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5" noValidate>
            {mode === "signup" && <div className="rounded-2xl border border-border bg-muted/35 p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">{accountType === "OWNER" ? "Tạo thiệp cho hai bạn" : t("auth.provider")}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{accountType === "OWNER" ? "Bạn có thể chọn mẫu và chỉnh sửa ngay sau khi tạo tài khoản." : t("auth.providerNote")}</p></div><Button type="button" variant="ghost" size="sm" onClick={() => setAccountType(accountType === "OWNER" ? "PROVIDER" : "OWNER")} className="shrink-0 text-xs text-primary">{accountType === "OWNER" ? "Tôi là đối tác" : "Tôi là cặp đôi"}</Button></div></div>}
            {mode === "signup" && (
              <div>
                <label htmlFor="display-name" className="mb-2 block text-sm font-semibold">{t("auth.displayName")}</label><div className="relative"><UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="display-name"
                  data-testid="auth-display-name"
                  type="text"
                  placeholder={t("auth.displayName")}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-12 rounded-xl bg-card pl-11 pr-4 font-body"
                  autoComplete="name"
                  maxLength={80}
                  aria-invalid={Boolean(fieldErrors.displayName)} /></div>{fieldErrors.displayName && <p className="mt-1.5 text-xs text-destructive">{fieldErrors.displayName}</p>}
              </div>
            )}
            <div><label htmlFor="email" className="mb-2 block text-sm font-semibold">{t("auth.email")}</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                data-testid="auth-email"
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl bg-card pl-11 pr-4 font-body"
                autoComplete="email"
                maxLength={255}
                aria-invalid={Boolean(fieldErrors.email)} /></div>{fieldErrors.email && <p className="mt-1.5 text-xs text-destructive">{fieldErrors.email}</p>}</div>
            <div><div className="mb-2 flex items-center justify-between"><label htmlFor="password" className="text-sm font-semibold">{t("auth.password")}</label>{mode === "signin" && <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-accent">{t("auth.forgot")}</Link>}</div><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                data-testid="auth-password"
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl bg-card pl-11 pr-12 font-body"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                minLength={8}
                maxLength={72}
                aria-invalid={Boolean(fieldErrors.password)} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-muted-foreground" aria-label={showPassword ? (locale === "vi" ? "Hide password" : "Hide password") : (locale === "vi" ? "Show password" : "Show password")}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>{fieldErrors.password && <p className="mt-1.5 text-xs text-destructive">{fieldErrors.password}</p>}</div>

            <Button
              data-testid="auth-submit"
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-foreground font-body text-background hover:bg-foreground/85"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "signin" ? t("auth.signIn") : t("auth.signUp")}<ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-7 text-center font-body text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                {t("auth.noAccount")}{" "}
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  data-testid="auth-switch-signup"
                  onClick={() => { setMode("signup"); setFieldErrors({}); }}
                  className="h-auto p-0 text-accent"
                >
                  {t("auth.signUp")}
                </Button>
              </>
            ) : (
              <>
                {t("auth.hasAccount")}{" "}
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  data-testid="auth-switch-signin"
                  onClick={() => { setMode("signin"); setFieldErrors({}); }}
                  className="h-auto p-0 text-accent"
                >
                  {t("auth.signIn")}
                </Button>
              </>
            )}
          </div>
        <p className="mt-8 text-center font-body text-xs text-muted-foreground">
          ← <Link to="/" className="hover:text-foreground">{t("auth.back")}</Link>
        </p>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Login;
