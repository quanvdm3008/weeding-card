export type Locale = "vi" | "en";

const STORAGE_KEY = "mireia-locale";

const messages: Record<string, Record<Locale, string>> = {
  "language.vi": { vi: "VI", en: "VI" },
  "language.en": { vi: "EN", en: "EN" },
  "nav.templates": { vi: "Greeting card template", en: "Templates" },
  "nav.features": { vi: "Features", en: "Features" },
  "nav.how": { vi: "Use", en: "How it works" },
  "nav.services": { vi: "Service", en: "Services" },
  "nav.pricing": { vi: "Price list", en: "Pricing" },
  "nav.myInvitations": { vi: "My card", en: "My invitations" },
  "nav.login": { vi: "Log in", en: "Sign in" },
  "nav.logout": { vi: "Sign out", en: "Sign out" },
  "nav.create": { vi: "Create cards now", en: "Create invitation" },
  "auth.welcome": { vi: "Welcome back", en: "Welcome back" },
  "auth.create": { vi: "Create an account", en: "Create account" },
  "auth.signInDescription": { vi: "Log in to design your wedding invitations", en: "Sign in to design and manage your wedding invitation" },
  "auth.signUpDescription": { vi: "Start creating wedding invitations in just minutes", en: "Create your wedding invitation in just a few minutes" },
  "auth.role": { vi: "You register with the role", en: "Choose your account type" },
  "auth.owner": { vi: "Card holder", en: "Couple" },
  "auth.provider": { vi: "Supplier", en: "Service provider" },
  "auth.providerNote": { vi: "Partner profiles need to be verified by Admin before being displayed on the marketplace.", en: "Provider profiles must be verified by an admin before appearing in the marketplace." },
  "auth.displayName": { vi: "Display name", en: "Display name" },
  "auth.email": { vi: "Email", en: "Email" },
  "auth.password": { vi: "Password", en: "Password" },
  "auth.forgot": { vi: "Forgot password?", en: "Forgot password?" },
  "auth.signIn": { vi: "Log in", en: "Sign in" },
  "auth.signUp": { vi: "Create an account", en: "Create account" },
  "auth.noAccount": { vi: "Don't have an account yet?", en: "New to Mireia?" },
  "auth.hasAccount": { vi: "Already have an account?", en: "Already have an account?" },
  "auth.back": { vi: "Return to home page", en: "Back to home" },
  "invitation.home": { vi: "Card head", en: "Home" },
  "invitation.story": { vi: "Story", en: "Our story" },
  "invitation.album": { vi: "Album", en: "Gallery" },
  "invitation.events": { vi: "Event", en: "Events" },
  "invitation.rsvp": { vi: "RSVP", en: "RSVP" },
  "template.back": { vi: "Return", en: "Back" },
  "template.collection": { vi: "Mireia design collection", en: "Mireia Signature Collection" },
  "template.live": { vi: "Live cards", en: "Live invitation" },
  "template.viewDetail": { vi: "View details", en: "View invitation" },
  "template.moodboard": { vi: "Moodboard", en: "Moodboard" },
  "template.use": { vi: "Use this form", en: "Use this template" },
  "template.customize": { vi: "Customization", en: "Customize" },
  "template.fullscreen": { vi: "View full screen", en: "View fullscreen" },
  "template.curated": { vi: "Selected design", en: "Curated design" },
  "template.new": { vi: "Newly updated", en: "New release" },
  "template.liveExperience": { vi: "Experience it firsthand", en: "Live experience" },
  "template.desktop": { vi: "See desktop version", en: "Desktop preview" },
  "template.mobile": { vi: "See mobile version", en: "Mobile preview" },
  "template.author": { vi: "Author", en: "Author" },
  "template.version": { vi: "Version", en: "Version" },
  "template.updated": { vi: "Update", en: "Updated" },
  "template.used": { vi: "Used", en: "Used" },
  "template.typography": { vi: "Typeface", en: "Typography" },
  "template.highlights": { vi: "Highlight", en: "Highlights" },
  "template.motion": { vi: "Move", en: "Motion" },
  "template.occasions": { vi: "Fit", en: "Best for" },
  "template.identity": { vi: "Design identity", en: "Design identity" },
  "template.completeSystem": { vi: "A complete imaging system", en: "A complete visual system" },
  "template.included": { vi: "Included content", en: "Included experience" },
  "template.journey": { vi: "Enough for the entire guest itinerary", en: "Everything your guests need" },
  "template.related": { vi: "Same style model", en: "Related templates" },
  "template.description": { vi: "", en: "A curated wedding invitation with a distinct visual language, responsive interactions and a complete guest journey." },
  "template.systemDescription": { vi: "Color, spacing, and movement are designed as a whole, not a recolor of another model.", en: "Color, spacing and motion are composed as one visual system—not a simple recolor of another template." },
  "template.review": { vi: "The layout is clear on the phone and still retains the unique feeling of the wedding photo set. Guests RSVP very conveniently.", en: "The mobile layout feels clear while preserving the personality of our wedding photos. RSVP was effortless for every guest." },
  "feature.gallery": { vi: "Gallery & lightbox", en: "Gallery & lightbox" },
  "feature.rsvp": { vi: "RSVP & greetings", en: "RSVP & wishes" },
  "feature.map": { vi: "Directions map", en: "Maps & directions" },
  "feature.music": { vi: "Background music", en: "Background music" },
  "feature.hearts": { vi: "Drop hearts in realtime", en: "Realtime reactions" },
  "feature.schedule": { vi: "Wedding day schedule", en: "Wedding schedule" },
  "common.error": { vi: "An error occurred", en: "Something went wrong" },
};

const apiErrors: Record<string, Record<Locale, string>> = {
  UNAUTHORIZED: { vi: "You need to log in to continue", en: "Authentication is required" },
  FORBIDDEN: { vi: "You do not have permission to perform this operation", en: "You do not have permission to perform this action" },
  INVALID_CREDENTIALS: { vi: "Email or password is incorrect", en: "Invalid email or password" },
  ACCOUNT_LOCKED: { vi: "Account is temporarily locked", en: "Account is temporarily locked" },
  RATE_LIMITED: { vi: "You acted too quickly, please try again later", en: "Too many requests. Please try again later" },
  NOT_FOUND: { vi: "Requested data not found", en: "The requested resource was not found" },
  EMAIL_ALREADY_USED: { vi: "This email is already in use", en: "Email is already in use" },
  INVALID_RESET_TOKEN: { vi: "The password reset link is invalid or has expired", en: "The password reset token is invalid or expired" },
  INVALID_VERIFY_TOKEN: { vi: "The verification link is invalid or has expired", en: "The verification token is invalid or expired" },
  RSVP_DISABLED: { vi: "This card has not yet been RSVP opened", en: "RSVP is not enabled for this invitation" },
  WISHES_DISABLED: { vi: "This card has not opened its greetings yet", en: "Wishes are not enabled for this invitation" },
  SLUG_ALREADY_USED: { vi: "The card link is already in use", en: "This invitation URL is already in use" },
  INVALID_SLUG: { vi: "Invalid card path", en: "The invitation URL is invalid" },
  PLAN_PUBLISH_LIMIT_REACHED: { vi: "The current package has reached the limit of public cards", en: "Your current plan has reached its public invitation limit" },
  PLAN_INVITATION_LIMIT_REACHED: { vi: "The current package has reached its limit on the number of cards", en: "Your current plan has reached its invitation limit" },
  MALFORMED_REQUEST: { vi: "The data submitted is invalid", en: "The request body is invalid" },
  PAYLOAD_TOO_LARGE: { vi: "File exceeds allowed capacity", en: "The uploaded file exceeds the allowed size" },
  INTERNAL_ERROR: { vi: "The system encountered an error, please try again", en: "An unexpected error occurred. Please try again later" },
};

export function getStoredLocale(): Locale {
  return "en";
}

export function persistLocale(_locale: Locale) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, "en");
  if (typeof document !== "undefined") document.documentElement.lang = "en";
}

export function translate(key: string, _locale: Locale) {
  return messages[key]?.en ?? key;
}

export function translateApiError(code: string | undefined, _locale: Locale, fallback?: string) {
  if (code?.startsWith("VALIDATION_")) return "Invalid request value";
  return (code && apiErrors[code]?.en) || fallback || translate("common.error", "en");
}
