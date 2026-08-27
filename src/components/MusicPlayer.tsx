import { useEffect, useMemo, useRef, useState } from "react";
import { Music, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import type { WeddingTheme } from "@/data/themes";
import { getTemplatePresentation, type MusicSkin } from "@/data/templatePresentation";
import { parseMusicPlaylist } from "@/lib/musicPlaylist";

interface MusicPlayerProps {
  accentColor?: string;
  url?: string;
  musicUrl?: string;
  theme?: WeddingTheme;
}

const recordBackground: Record<MusicSkin, string> = {
  vinyl: "repeating-radial-gradient(circle, #151515 0 3px, #343434 4px 5px)",
  minimal: "repeating-radial-gradient(circle, #f8f7f3 0 3px, #d9d6cf 4px 5px)",
  pixel: "repeating-radial-gradient(circle, #15141b 0 4px, #383143 5px 7px)",
  cosmic: "repeating-radial-gradient(circle, #090a18 0 3px, #292d58 4px 5px)",
  heritage: "repeating-radial-gradient(circle, #160e0d 0 3px, #4a3128 4px 5px)",
  photo: "repeating-radial-gradient(circle, #3d3128 0 3px, #796454 4px 5px)",
};

const MusicPlayer = ({ accentColor = "#C9A96E", url, musicUrl, theme }: MusicPlayerProps) => {
  const source = url || musicUrl || "";
  const tracks = useMemo(() => parseMusicPlaylist(source), [source]);
  const presentation = getTemplatePresentation(theme?.id);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const currentTrack = tracks[currentIndex];
  const darkPanel = ["pixel", "cosmic", "heritage"].includes(presentation.music.skin);

  useEffect(() => {
    setCurrentIndex(0);
    setPlaying(false);
  }, [source]);

  useEffect(() => {
    const handleAutoplay = () => {
      if (tracks.length > 0) {
        setPlaying(true);
      }
    };
    window.addEventListener("wedding:invitation-opened", handleAutoplay);
    return () => window.removeEventListener("wedding:invitation-opened", handleAutoplay);
  }, [tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (!playing) {
      audio.pause();
      return;
    }
    void audio.play().catch(() => setPlaying(false));
  }, [currentIndex, currentTrack, playing]);

  const changeTrack = (step: number) => {
    if (tracks.length < 2) return;
    setCurrentIndex((index) => (index + step + tracks.length) % tracks.length);
    setPlaying(true);
  };

  return (
    <div className="relative">
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.url}
          loop={tracks.length === 1}
          preload="none"
          onEnded={() => changeTrack(1)}
          onPause={() => setPlaying(false)}
        />
      )}

      {open && (
        <div
          id="invitation-music-panel"
          className="absolute bottom-0 right-14 w-[min(17rem,calc(100vw-5rem))] overflow-hidden rounded-2xl border shadow-[0_14px_42px_rgba(0,0,0,.28)] backdrop-blur-xl"
          style={{
            background: darkPanel ? "rgba(14,13,18,.94)" : "rgba(255,255,255,.94)",
            borderColor: `${accentColor}80`,
            color: darkPanel ? "#fff" : "#181818",
          }}
          role="region"
          aria-label="Background music playlist"
        >
          <div className="flex items-center gap-3 border-b border-current/10 px-3.5 py-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: accentColor }}>
              <Music className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold">{presentation.music.label}</span>
              <span className="mt-0.5 block text-[10px] opacity-55">{tracks.length ? `${tracks.length} track${tracks.length > 1 ? "s" : ""}` : "No music added"}</span>
            </span>
            <button type="button" onClick={() => setOpen(false)} className="grid h-7 w-7 place-items-center rounded-full opacity-55 transition hover:bg-current/10 hover:opacity-100" aria-label="Close music playlist">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="max-h-44 overflow-y-auto p-1.5">
            {tracks.length ? tracks.map((track, index) => (
              <button
                key={`${track.url}-${index}`}
                type="button"
                onClick={() => { setCurrentIndex(index); setPlaying(true); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${index === currentIndex ? "bg-current/10" : "hover:bg-current/5"}`}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-current/15 text-[10px] font-semibold">{index + 1}</span>
                <span className="min-w-0 flex-1 truncate text-xs font-medium">{track.title}</span>
                {index === currentIndex && <span className={`h-2 w-2 rounded-full ${playing ? "animate-pulse" : ""}`} style={{ backgroundColor: accentColor }} />}
              </button>
            )) : (
              <p className="px-3 py-5 text-center text-xs opacity-55">Add one audio URL per line while editing.</p>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 border-t border-current/10 px-3 py-2.5">
            <button type="button" onClick={() => changeTrack(-1)} disabled={tracks.length < 2} className="grid h-8 w-8 place-items-center rounded-full opacity-65 transition hover:bg-current/10 hover:opacity-100 disabled:opacity-25" aria-label="Previous track">
              <SkipBack className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={() => currentTrack && setPlaying((value) => !value)} disabled={!currentTrack} className="grid h-10 w-10 place-items-center rounded-full text-white shadow-md transition hover:scale-105 disabled:opacity-35" style={{ backgroundColor: accentColor }} aria-label={playing ? "Pause music" : "Play music"}>
              {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
            </button>
            <button type="button" onClick={() => changeTrack(1)} disabled={tracks.length < 2} className="grid h-8 w-8 place-items-center rounded-full opacity-65 transition hover:bg-current/10 hover:opacity-100 disabled:opacity-25" aria-label="Next track">
              <SkipForward className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Vinyl Record Button with Equalizer Wave */}
      <div className="flex items-center gap-2">
        {/* Equalizer Bars when playing */}
        {playing && (
          <div className="flex items-end gap-0.5 h-5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-md">
            <span className="w-1 bg-[#d4af37] rounded-full animate-eq-1" />
            <span className="w-1 bg-[#fdf6cc] rounded-full animate-eq-2" />
            <span className="w-1 bg-[#d4af37] rounded-full animate-eq-3" />
            <span className="w-1 bg-[#fdf6cc] rounded-full animate-eq-4" />
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            if (!playing && currentTrack) {
              setPlaying(true);
            } else {
              setOpen((value) => !value);
            }
          }}
          className="group relative grid h-13 w-13 p-1 place-items-center rounded-full border border-white/40 bg-black/70 text-white shadow-2xl backdrop-blur-md transition hover:scale-105 active:scale-95"
          title={presentation.music.label}
          aria-label={open ? "Close background music playlist" : "Open background music playlist"}
          aria-expanded={open}
          aria-controls="invitation-music-panel"
        >
          {/* Outer Gold Shimmer Rim */}
          <span className="absolute inset-0 rounded-full border border-[#d4af37]/40 pointer-events-none" />

          {/* Spinning Vinyl / Gold Record */}
          <span
            className={`relative h-10 w-10 rounded-full shadow-inner flex items-center justify-center ${
              playing ? "animate-[spin_4s_linear_infinite]" : ""
            }`}
            style={{ background: recordBackground[presentation.music.skin] }}
            aria-hidden="true"
          >
            {/* Grooves & Center Label */}
            <span
              className="absolute inset-[30%] rounded-full border border-white/30 shadow-sm"
              style={{ backgroundColor: accentColor }}
            />
            <span className="absolute inset-[44%] rounded-full bg-white/95" />
          </span>

          {/* Center Icon Overlay */}
          <span className="pointer-events-none absolute inset-0 grid place-items-center text-white drop-shadow">
            {playing ? (
              <span className="h-2 w-2 rounded-sm bg-white/90" />
            ) : (
              <Music className="h-3.5 w-3.5 text-white/90" />
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;

