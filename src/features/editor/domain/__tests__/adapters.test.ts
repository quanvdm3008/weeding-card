import { describe, expect, it } from "vitest";
import { createComponent, createEmptyDocument } from "@/features/card-studio/schema/defaults";
import type { GuidedInvitationConfig } from "../types";
import {
  documentToGuidedConfig,
  guidedConfigToInvitationDocument,
  parseInvitationDocument,
  serializeInvitationDocument,
  withCanvasDocument,
} from "../adapters";

function guided(overrides: Partial<GuidedInvitationConfig> = {}): GuidedInvitationConfig {
  return {
    invitationId: "inv-1",
    templateId: "romantic",
    groomName: "Minh",
    brideName: "Ha",
    date: "2027-02-14",
    time: "17:30",
    venue: "White Palace",
    address: "District 1",
    message: "Welcome",
    accentColor: "#E8B4B8",
    musicUrl: "",
    coverImageUrl: "cover.jpg",
    galleryImageUrls: ["one.jpg"],
    extraInfoTitle: "Info",
    extraInfoContent: "Notes",
    slug: "minh-ha",
    published: false,
    rsvpEnabled: true,
    wishesEnabled: true,
    customSections: ["couple", "rsvp"],
    sectionStyles: {},
    ...overrides,
  };
}

describe("InvitationDocument adapters", () => {
  it("round-trips guided data without dropping optional editor fields", () => {
    const source = guided({
      particleDensity: "dense",
      groomBank: { bankName: "VCB", accountNumber: "123" },
    });
    const document = guidedConfigToInvitationDocument(source);

    expect(document.invitationId).toBe("inv-1");
    expect(documentToGuidedConfig(document)).toEqual(source);
  });

  it("adds a canvas projection without mutating guided data", () => {
    const document = guidedConfigToInvitationDocument(guided());
    const canvas = createEmptyDocument("Canvas");
    canvas.pages[0].components.push(createComponent("text", canvas.pages[0].sections[0].id));
    const merged = withCanvasDocument(document, canvas);

    expect(document.canvas).toBeNull();
    expect(merged.canvas?.pages[0].components).toHaveLength(1);
    expect(merged.guided.groomName).toBe("Minh");
  });

  it("serializes and rejects malformed aggregate documents safely", () => {
    const document = guidedConfigToInvitationDocument(guided());
    expect(parseInvitationDocument(serializeInvitationDocument(document))).toEqual(document);
    expect(parseInvitationDocument("{broken")).toBeNull();
    expect(parseInvitationDocument('{"id":"missing-fields"}')).toBeNull();
  });
});
