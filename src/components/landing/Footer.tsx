import { Facebook, Heart, Instagram, Mail } from "lucide-react";

const cols = [
  { title: "Product", links: ["Invitation templates", "Features", "Pricing", "Dashboard"] },
  { title: "Support", links: ["Instruction", "Frequently questions asked", "Contact", "Clause"] },
  { title: "About Mireia", links: ["Story", "Partner", "Wedding blog", "Recruitment"] },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[hsl(350_24%_11%)] px-5 pb-10 pt-20">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(38_55%_60%/0.5),transparent)]" />
      <svg
        className="pointer-events-none absolute -right-12 top-8 hidden h-56 w-56 text-[hsl(39_58%_72%/0.18)] md:block"
        viewBox="0 0 220 220"
        fill="none"
        aria-hidden="true"
      >
        <path d="M36 184C72 132 96 90 190 36" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M72 135C58 115 61 94 82 75C95 100 94 119 72 135Z" fill="currentColor" opacity=".42" />
        <path d="M108 101C94 80 100 58 124 43C135 70 131 88 108 101Z" fill="currentColor" opacity=".34" />
        <path d="M124 113C151 100 174 104 188 130C158 138 139 132 124 113Z" fill="currentColor" opacity=".3" />
      </svg>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[hsl(38_47%_58%)] shadow-gold">
                <Heart className="h-4 w-4 fill-white text-white" />
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight text-white">
                Mireia<span className="text-[hsl(var(--accent))]">.</span>
              </span>
            </div>
            <p className="max-w-md font-body text-sm leading-7 text-white/56">
              High-end online wedding invitation studio. Every love story deserves its own invitation, beautiful enough and able to retain emotions.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { Icon: Instagram, label: "Mireia on Instagram" },
                { Icon: Facebook, label: "Mireia on Facebook" },
                { Icon: Mail, label: "Email Mireia" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/14 text-white/56 transition hover:border-[hsl(38_55%_60%/0.45)] hover:bg-[hsl(38_55%_60%/0.1)] hover:text-[hsl(38_60%_68%)]"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h2 className="mb-4 font-display text-base font-semibold text-white">{col.title}</h2>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="font-body text-sm text-white/50 transition hover:text-[hsl(38_60%_68%)]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-1" />
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <p className="font-body text-xs text-white/38">
            © {new Date().getFullYear()} Mireia Wedding Studio. Created with love in Vietnam.
          </p>
          <p className="flex items-center gap-1.5 font-body text-xs text-white/38">
            Cared for by the Mireia team
            <Heart className="h-3 w-3 fill-[hsl(346_45%_65%)] text-[hsl(346_45%_65%)]" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
