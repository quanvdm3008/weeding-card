import { describe, expect, it, vi } from "vitest";
import { createEmptyDocument } from "@/features/card-studio/schema/defaults";
import { serializeCardDocument } from "@/features/card-studio/schema/schema";
import type { InvitationDto } from "@/lib/invitations";
import { guidedConfigToInvitationDocument } from "../../domain/adapters";
import type { GuidedInvitationConfig } from "../../domain/types";
import {
  BrowserEditorRepository,
  EDITOR_DRAFT_KEY,
  type EditorApiGateway,
} from "../browserEditorRepository";

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

const dto: InvitationDto = {
  id: "inv-1",
  ownerUserId: "user-1",
  templateCode: "romantic",
  groomName: "Minh",
  brideName: "Ha",
  message: "Welcome",
  accentColor: "#E8B4B8",
  musicUrl: "",
  coverImageUrl: "",
  galleryImageUrls: [],
  extraInfoTitle: "",
  extraInfoContent: "",
  builderConfig: null,
  contentConfig: JSON.stringify({ groomBank: { bankName: "VCB", accountNumber: "001" } }),
  slug: null,
  rsvpEnabled: true,
  wishesEnabled: true,
  status: "Draft",
  events: [{ title: "wedding", date: "2027-02-14", time: "17:30", venue: "Palace", address: "District 1" }],
};

function guided(): GuidedInvitationConfig {
  return {
    invitationId: "",
    templateId: "romantic",
    groomName: "Minh",
    brideName: "Ha",
    date: "2027-02-14",
    time: "17:30",
    venue: "Palace",
    address: "District 1",
    message: "Welcome",
    accentColor: "#E8B4B8",
    musicUrl: "",
    coverImageUrl: "",
    galleryImageUrls: [],
    extraInfoTitle: "",
    extraInfoContent: "",
    slug: "",
    published: false,
    rsvpEnabled: true,
    wishesEnabled: true,
  };
}

function gateway(overrides: Partial<EditorApiGateway> = {}): EditorApiGateway {
  return {
    getInvitation: async () => dto,
    createInvitation: async () => dto,
    updateInvitation: async () => dto,
    publishInvitation: async () => ({ ...dto, status: "Published", slug: "minh-ha" }),
    getCardDocument: async () => ({ document: null, version: 0, updatedAtUtc: null }),
    saveCardDocument: async (_id, document) => ({ document, version: 2, updatedAtUtc: "2026-07-22" }),
    listCardDocumentVersions: async () => [],
    restoreCardDocumentVersion: async () => ({ document: serializeCardDocument(createEmptyDocument()), version: 1, updatedAtUtc: "2026-07-22" }),
    ...overrides,
  };
}

describe("BrowserEditorRepository", () => {
  it("loads guided data even when the optional canvas endpoint is unavailable", async () => {
    const repository = new BrowserEditorRepository(gateway({
      getCardDocument: async () => { throw new Error("Not found"); },
    }), new MemoryStorage());

    const document = await repository.load("inv-1");
    expect(document.invitationId).toBe("inv-1");
    expect(document.guided.venue).toBe("Palace");
    expect(document.guided.groomBank?.accountNumber).toBe("001");
    expect(document.canvas).toBeNull();
  });

  it("saves a new canvas aggregate locally without calling the API", async () => {
    const saveCardDocument = vi.fn(gateway().saveCardDocument);
    const storage = new MemoryStorage();
    const repository = new BrowserEditorRepository(gateway({ saveCardDocument }), storage);
    const canvas = createEmptyDocument("Draft canvas");
    const document = guidedConfigToInvitationDocument(guided(), { canvas });

    const result = await repository.save(document, "canvas");
    expect(result.invitationId).toBeNull();
    expect(storage.getItem(EDITOR_DRAFT_KEY)).toContain("Draft canvas");
    expect(saveCardDocument).not.toHaveBeenCalled();
  });

  it("persists a unified draft explicitly", () => {
    const storage = new MemoryStorage();
    const repository = new BrowserEditorRepository(gateway(), storage);

    repository.saveDraft(guidedConfigToInvitationDocument(guided()));

    expect(storage.getItem(EDITOR_DRAFT_KEY)).toContain('"schemaVersion":1');
  });

  it("creates an invitation through the guided projection and returns its server id", async () => {
    const createInvitation = vi.fn(gateway().createInvitation);
    const publishInvitation = vi.fn(gateway().publishInvitation);
    const repository = new BrowserEditorRepository(gateway({ createInvitation, publishInvitation }), new MemoryStorage());
    const result = await repository.save(guidedConfigToInvitationDocument(guided()), "guided");

    expect(createInvitation).toHaveBeenCalledOnce();
    expect(publishInvitation).not.toHaveBeenCalled();
    expect(result.invitationId).toBe("inv-1");
    expect(result.document.guided.invitationId).toBe("inv-1");
    expect(result.document.guided.published).toBe(false);
  });

  it("sends the loaded server version when saving an existing canvas", async () => {
    const saveCardDocument = vi.fn(gateway().saveCardDocument);
    const repository = new BrowserEditorRepository(gateway({ saveCardDocument }), new MemoryStorage());
    const document = guidedConfigToInvitationDocument(
      { ...guided(), invitationId: "inv-1" },
      { canvas: createEmptyDocument("Existing canvas"), source: "existing" },
    );
    document.metadata.serverVersion = 4;

    await repository.save(document, "canvas");

    expect(saveCardDocument).toHaveBeenCalledWith("inv-1", expect.any(String), 4);
  });
});
