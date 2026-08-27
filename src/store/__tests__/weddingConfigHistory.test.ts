import { beforeEach, describe, expect, it } from "vitest";
import { useWeddingConfig } from "../weddingConfigStore";

describe("guided editor history", () => {
  beforeEach(() => useWeddingConfig.getState().reset());

  it("tracks field updates through undo and redo", () => {
    const original = useWeddingConfig.getState().groomName;
    useWeddingConfig.getState().setField("groomName", "Quang");
    expect(useWeddingConfig.getState().groomName).toBe("Quang");
    expect(useWeddingConfig.getState().dirty).toBe(true);

    useWeddingConfig.getState().undo();
    expect(useWeddingConfig.getState().groomName).toBe(original);
    useWeddingConfig.getState().redo();
    expect(useWeddingConfig.getState().groomName).toBe("Quang");
  });

  it("clears history when loading a server document", () => {
    useWeddingConfig.getState().setField("venue", "Changed");
    useWeddingConfig.getState().load({ invitationId: "server-1", venue: "Server venue" });

    expect(useWeddingConfig.getState().venue).toBe("Server venue");
    expect(useWeddingConfig.getState().past).toEqual([]);
    expect(useWeddingConfig.getState().dirty).toBe(false);
  });

  it("loads wedding content from contentConfig instead of losing it on an editor reload", () => {
    useWeddingConfig.getState().load({
      contentConfig: JSON.stringify({
        groomBank: { bankName: "VCB", accountNumber: "001" },
        stories: [{ date: "2026-01-01", title: "First day", text: "Hello", img: "cover.jpg" }],
      }),
    });

    expect(useWeddingConfig.getState().groomBank?.accountNumber).toBe("001");
    expect(useWeddingConfig.getState().stories?.[0].title).toBe("First day");
  });

  it("uses the theme accent instead of its background color", () => {
    useWeddingConfig.getState().setTemplate("luxury");

    expect(useWeddingConfig.getState().accentColor).toBe("#D4AF37");
  });
});
