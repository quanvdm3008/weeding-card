import { describe, expect, it } from "vitest";
import {
  DEFAULT_BUILDER_CONFIG,
  LEGACY_CONFIG_DELIMITER,
  parseBuilderConfig,
  resolveBuilderConfig,
  resolveInvitationContentConfig,
  serializeBuilderConfig,
  serializeInvitationContentConfig,
} from "@/lib/builderConfig";

describe("builderConfig resolve (H8 + backward compatible)", () => {
  it("prefers the new builderConfig field over legacy smuggled config", () => {
    const legacy = `Content${LEGACY_CONFIG_DELIMITER}{"cursorType":"default"}`;
    const { content, config } = resolveBuilderConfig('{"cursorType":"ripple"}', legacy);

    expect(content).toBe("Content");
    expect(config.cursorType).toBe("ripple");
  });

  it("falls back to legacy smuggled config when builderConfig is absent", () => {
    const legacy = `Content${LEGACY_CONFIG_DELIMITER}{"particlesType":"petals","customSections":["couple"]}`;
    const { content, config } = resolveBuilderConfig(null, legacy);

    expect(content).toBe("Content");
    expect(config.particlesType).toBe("petals");
    expect(config.customSections).toEqual(["couple"]);
    /* Missing fields in legacy JSON are filled in by default*/
    expect(config.cursorType).toBe(DEFAULT_BUILDER_CONFIG.cursorType);
  });

  it("returns defaults for plain content without any config", () => {
    const { content, config } = resolveBuilderConfig(null, "Just notes");

    expect(content).toBe("Just notes");
    expect(config).toEqual(DEFAULT_BUILDER_CONFIG);
  });

  it("survives malformed JSON in both sources", () => {
    const { config } = resolveBuilderConfig("{not-json", `x${LEGACY_CONFIG_DELIMITER}{also-broken`);
    expect(config).toEqual(DEFAULT_BUILDER_CONFIG);
  });

  it("serialize -> parse round-trips", () => {
    const original = {
      cursorType: "ripple" as const,
      particlesType: "leaves" as const,
      photoFilter: "none" as const,
      customSections: ["gallery", "events"],
      sectionStyles: { gallery: { paddingY: 40, glassEffect: true } },
    };
    const parsed = parseBuilderConfig(serializeBuilderConfig(original));
    expect(parsed).toMatchObject(original);
    expect(parsed?.headingFont).toBe(DEFAULT_BUILDER_CONFIG.headingFont);
    expect(parsed?.accentStyle).toBe(DEFAULT_BUILDER_CONFIG.accentStyle);
  });

  it("persists the galaxy and pixel spatial effects", () => {
    expect(parseBuilderConfig('{"particlesType":"galaxy"}')?.particlesType).toBe("galaxy");
    expect(parseBuilderConfig('{"particlesType":"pixel"}')?.particlesType).toBe("pixel");
  });

  it("round-trips family addresses and wedding schedule", () => {
    const parsed = parseBuilderConfig(serializeBuilderConfig({
      ...DEFAULT_BUILDER_CONFIG,
      groomParents: { fatherName: "Mr. A", motherName: "Mrs. B", address: "Hanoi" },
      brideParents: { fatherName: "Mr. C", motherName: "Mrs. D", address: "Da Nang" },
      schedule: [{ time: "17:00", title: "Welcoming guests", description: "Take a photo" }],
    }));

    expect(parsed?.groomParents?.address).toBe("Hanoi");
    expect(parsed?.brideParents?.motherName).toBe("Mrs. D");
    expect(parsed?.schedule?.[0].title).toBe("Welcoming guests");
  });

  it("prefers the separate contentConfig while retaining legacy builder content", () => {
    const current = serializeInvitationContentConfig({
      groomBank: { bankName: "VCB", accountNumber: "001" },
      stories: [{ date: "2024-01-01", title: "New", text: "Current", img: "https://example.test/new.jpg" }],
    });
    const legacy = serializeBuilderConfig({
      ...DEFAULT_BUILDER_CONFIG,
      groomBank: { bankName: "Legacy", accountNumber: "999" },
    });

    expect(resolveInvitationContentConfig(current, legacy, null).groomBank?.bankName).toBe("VCB");
    expect(resolveInvitationContentConfig(null, legacy, null).groomBank?.bankName).toBe("Legacy");
  });

  it("round-trips typography, emphasis, and extended parent details", () => {
    const parsed = parseBuilderConfig(serializeBuilderConfig({
      ...DEFAULT_BUILDER_CONFIG,
      headingFont: "Playfair Display",
      bodyFont: "Poppins",
      headingWeight: 900,
      headingCase: "uppercase",
      accentStyle: "editorial",
      groomParents: {
        familyLabel: "The groom's family",
        fatherTitle: "Grandfather",
        fatherName: "Tran Van Hung",
        motherTitle: "Grandma",
        motherName: "Ham Thi Lan",
        phone: "0901 234 567",
        note: "Head Nam",
      },
    }));

    expect(parsed?.headingWeight).toBe(900);
    expect(parsed?.accentStyle).toBe("editorial");
    expect(parsed?.groomParents?.phone).toBe("0901 234 567");
    expect(parsed?.groomParents?.note).toBe("Head Nam");
  });
});
