import { describe, expect, it } from "vitest";
import { appendMusicUrl, parseMusicPlaylist } from "./musicPlaylist";

describe("music playlist", () => {
  it("parses named and unnamed tracks and appends uploaded songs", () => {
    expect(parseMusicPlaylist("First dance | https://cdn.test/first.mp3\nhttps://cdn.test/second.mp3")).toEqual([
      { title: "First dance", url: "https://cdn.test/first.mp3" },
      { title: "Track 2", url: "https://cdn.test/second.mp3" },
    ]);
    expect(appendMusicUrl("https://cdn.test/first.mp3", "https://cdn.test/second.mp3")).toBe("https://cdn.test/first.mp3\nhttps://cdn.test/second.mp3");
  });
});
