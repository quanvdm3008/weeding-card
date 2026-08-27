import { useRef, useState } from "react";
import { CalendarCheck, Home, Images, Music2, Pause, Play, Route } from "lucide-react";

interface SignatureTemplateChromeProps {
  variant: "aurora" | "neo";
  musicUrl?: string;
}

const links = [
  { href: "#hero", label: "Home", icon: Home, code: "00" },
  { href: "#story", label: "Story", icon: Route, code: "01" },
  { href: "#gallery", label: "Album", icon: Images, code: "02" },
  { href: "#events", label: "Event", icon: CalendarCheck, code: "03" },
];

export default function SignatureTemplateChrome({ variant, musicUrl }: SignatureTemplateChromeProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  if (variant === "aurora") {
    return (
      <nav className="fixed inset-x-0 top-0 z-[60] border-b border-white/20 bg-[#061713]/90 px-4 py-3 text-white backdrop-blur-xl @md:px-8" aria-label="Navigate the Northern Lights card">
        {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="none" />}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <a href="#hero" className="shrink-0 font-sans text-[10px] font-semibold uppercase text-[#9FEAD2]">Nordic / Aurora</a>
          <div className="flex items-center gap-1 @md:gap-6">
            {links.map(({ href, label, icon: Icon }) => (
              <a key={href} href={href} className="inline-flex h-9 w-9 items-center justify-center border-b border-transparent text-white/65 transition hover:border-[#9FEAD2] hover:text-white @md:h-auto @md:w-auto @md:gap-2 @md:py-2" title={label} aria-label={label}>
                <Icon className="h-3.5 w-3.5" /><span className="hidden font-sans text-[10px] font-semibold uppercase @md:inline">{label}</span>
              </a>
            ))}
            {musicUrl && (
              <button type="button" onClick={toggleAudio} className="ml-1 grid h-9 w-9 place-items-center border border-[#9FEAD2]/45 text-[#9FEAD2] transition hover:bg-[#9FEAD2] hover:text-[#061713]" aria-label={playing ? "Pause music" : "Play music"} title={playing ? "Pause music" : "Play music"}>
                {playing ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Music2 className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-[60] border-b border-[#65E7FF]/55 bg-black/90 text-white backdrop-blur-xl" aria-label="Neo-Tokyo card navigation">
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="none" />}
      <div className="mx-auto grid h-14 max-w-[1600px] grid-cols-[1fr_auto] items-stretch px-4 @md:grid-cols-[260px_1fr_auto] @md:px-0">
        <a href="#hero" className="flex items-center border-[#65E7FF]/30 font-sans text-[10px] font-black uppercase text-[#65E7FF] @md:border-r @md:px-7">Neo vow / live</a>
        <div className="hidden items-stretch @md:flex">
          {links.map(({ href, label, code }) => (
            <a key={href} href={href} className="flex items-center gap-2 border-r border-white/12 px-5 font-sans text-[10px] font-bold uppercase text-white/55 transition hover:bg-[#65E7FF] hover:text-black"><span className="text-[#F14B5A]">{code}</span>{label}</a>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2">
          <a href="#rsvp" className="border border-[#F14B5A] px-4 py-2 font-sans text-[9px] font-black uppercase text-[#F14B5A] transition hover:bg-[#F14B5A] hover:text-white">RSVP</a>
          {musicUrl && (
            <button type="button" onClick={toggleAudio} className="grid h-9 w-9 place-items-center bg-[#65E7FF] text-black" aria-label={playing ? "Pause music" : "Play music"} title={playing ? "Pause music" : "Play music"}>
              {playing ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
