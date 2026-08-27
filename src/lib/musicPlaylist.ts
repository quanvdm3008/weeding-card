export interface MusicPlaylistTrack {
  title: string;
  url: string;
}

export function parseMusicPlaylist(value?: string): MusicPlaylistTrack[] {
  return (value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [title, url] = line.split(/\s+\|\s+/, 2);
      return url ? { title, url } : { title: `Track ${index + 1}`, url: line };
    });
}

export function appendMusicUrl(value: string, url: string) {
  return [value.trim(), url.trim()].filter(Boolean).join("\n");
}
