import { describe, expect, it } from "vitest";
import { toInvitationPayload } from "@/lib/invitations";
import type { WeddingConfig } from "@/store/weddingConfigStore";

const CONFIG_DELIMITER = "|__CONFIG__|";

function makeConfig(overrides: Partial<WeddingConfig> = {}): WeddingConfig {
  return {
    invitationId: null,
    templateId: "romantic",
    groomName: "Minh",
    brideName: "Ha",
    date: "2027-02-14",
    time: "17:30",
    venue: "White Palace",
    address: "123 Nguyen Hue, District 1",
    message: "We look forward to welcoming you",
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
    ...overrides,
  } as WeddingConfig;
}

describe("toInvitationPayload", () => {
  it("maps core fields and builds the ceremony event from date/time/venue", () => {
    const payload = toInvitationPayload(makeConfig());

    expect(payload.templateCode).toBe("romantic");
    expect(payload.groomName).toBe("Minh");
    expect(payload.brideName).toBe("Ha");
    expect(payload.events).toEqual([
      {
        title: "Wedding Ceremony",
        date: "2027-02-14",
        time: "17:30",
        venue: "White Palace",
        address: "123 Nguyen Hue, District 1",
      },
    ]);
  });

  it("sends builder config in the dedicated builderConfig field as parseable JSON (H8)", () => {
    const payload = toInvitationPayload(
      makeConfig({
        extraInfoContent: "Notes for guests",
        cursorType: "ripple",
        particlesType: "petals",
        customSections: ["couple", "gallery"],
        sectionStyles: { gallery: { paddingY: 40 } },
      } as Partial<WeddingConfig>)
    );

    /* extraInfoContent is now plain text — no more smuggling delimiter*/
    expect(payload.extraInfoContent).toBe("Notes for guests");
    expect(payload.extraInfoContent).not.toContain(CONFIG_DELIMITER);

    const parsed = JSON.parse(payload.builderConfig);
    expect(parsed.cursorType).toBe("ripple");
    expect(parsed.particlesType).toBe("petals");
    expect(parsed.customSections).toEqual(["couple", "gallery"]);
    expect(parsed.sectionStyles).toEqual({ gallery: { paddingY: 40 } });
  });

  it("strips the legacy delimiter when extraInfoContent still contains smuggled config", () => {
    /* Old record: content still has config after delimiter from before H8*/
    const legacyContent = `Note${CONFIG_DELIMITER}{"cursorType":"ripple"}`;
    const payload = toInvitationPayload(makeConfig({ extraInfoContent: legacyContent }));

    expect(payload.extraInfoContent).toBe("Note");
    expect(payload.extraInfoContent).not.toContain(CONFIG_DELIMITER);
  });

  it("falls back to default builder config when none is set", () => {
    const payload = toInvitationPayload(makeConfig());
    const parsed = JSON.parse(payload.builderConfig);

    expect(parsed.cursorType).toBe("follow");
    expect(parsed.particlesType).toBe("sparkles");
    expect(parsed.customSections).toEqual(["couple", "countdown", "story", "message", "details", "gallery", "events", "wishes", "rsvp"]);
  });

  it("persists presentation separately from banks and stories", () => {
    const payload = toInvitationPayload(
      makeConfig({
        photoFilter: "sepia",
        groomBank: { bankName: "VCB", accountNumber: "007123", accountHolder: "Minh" },
        brideBank: { bankName: "TCB", accountNumber: "19001234", accountHolder: "Ha" },
        stories: [{ date: "2020-01-01", title: "First time meeting", text: "At the coffee shop", img: "https://x/img.jpg" }],
      } as Partial<WeddingConfig>)
    );

    const presentation = JSON.parse(payload.builderConfig);
    const content = JSON.parse(payload.contentConfig);
    expect(presentation.photoFilter).toBe("sepia");
    expect(presentation.groomBank).toBeUndefined();
    expect(content.groomBank).toEqual({ bankName: "VCB", accountNumber: "007123", accountHolder: "Minh" });
    expect(content.brideBank).toEqual({ bankName: "TCB", accountNumber: "19001234", accountHolder: "Ha" });
    expect(content.stories).toEqual([{ date: "2020-01-01", title: "First time meeting", text: "At the coffee shop", img: "https://x/img.jpg" }]);
  });

  it("omits banks/stories when not filled in (undefined = hide wedding gift section, use sample story)", () => {
    const parsed = JSON.parse(toInvitationPayload(makeConfig()).contentConfig);
    expect(parsed.groomBank).toBeUndefined();
    expect(parsed.brideBank).toBeUndefined();
    expect(parsed.stories).toBeUndefined();
  });

  it("persists both family blocks including their addresses", () => {
    const payload = toInvitationPayload(makeConfig({
      groomParents: { fatherName: "Tran Van Hung", motherName: "Ham Thi Lan", address: "Dong Da, Hanoi" },
      brideParents: { fatherName: "Nguyen Van Binh", motherName: "Phan Thi Huong", address: "Cau Giay, Hanoi" },
    }));
    const parsed = JSON.parse(payload.contentConfig);

    expect(parsed.groomParents.address).toBe("Dong Da, Hanoi");
    expect(parsed.brideParents.fatherName).toBe("Nguyen Van Binh");
  });
});
