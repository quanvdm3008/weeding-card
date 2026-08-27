import { describe, expect, it } from "vitest";
import "../registry";
import { templates } from "@/data/templates";
import { seedDocumentFromTemplate, type TemplateSeedData } from "../schema/templateSeed";
import { cardDocumentHasContent, validateCardDocument } from "../schema/schema";
import { getCardComponentDefinition } from "../registry";

const DATA: TemplateSeedData = {
  groomName: "Minh Anh",
  brideName: "Thanh Ha",
  date: "2027-02-14",
  time: "17:30",
  venue: "White Palace",
  address: "123 Nguyen Hue, District 1, Ho Chi Minh City",
  message: "Sincerely invite!",
  coverImageUrl: "https://example.com/cover.jpg",
  galleryImageUrls: ["https://example.com/1.jpg", "https://example.com/2.jpg"],
};

describe("seedDocumentFromTemplate — edit old templates in Card Studio", () => {
  it("Every template in the catalog seeds a valid document with content", () => {
    for (const t of templates) {
      const doc = seedDocumentFromTemplate(t.id, DATA);
      expect(validateCardDocument(doc), `template ${t.id} must go through schema validation`).not.toBeNull();
      expect(cardDocumentHasContent(doc), `template ${t.id} must have components`).toBe(true);
      expect(doc.pages[0].sections.length, t.id).toBeGreaterThanOrEqual(5);
    }
  });

  it("Every component seed that comes out has a type registered in the registry", () => {
    const doc = seedDocumentFromTemplate("romantic", DATA);
    for (const c of doc.pages[0].components) {
      expect(getCardComponentDefinition(c.type), `type ${c.type}`).toBeDefined();
    }
  });

  it("Card data is properly embedded: name, countdown target, map address", () => {
    const doc = seedDocumentFromTemplate("romantic", DATA);
    const components = doc.pages[0].components;
    const texts = components.filter((c) => c.type === "text").map((c) => String(c.content.text));
    expect(texts.some((t) => t.includes("Minh Anh & Thanh Ha"))).toBe(true);

    const countdown = components.find((c) => c.type === "countdown");
    expect(countdown?.content.targetDate).toBe("2027-02-14T17:30");

    const map = components.find((c) => c.type === "map");
    expect(map?.content.address).toBe(DATA.address);

    const galleryFrames = components.filter((c) => c.type === "frame" && c.name.startsWith("Moment"));
    expect(galleryFrames).toHaveLength(2);
    expect(galleryFrames[0].content.src).toBe(DATA.galleryImageUrls?.[0]);
  });

  it("Each component belongs to a valid section or group (not orphaned).", () => {
    const doc = seedDocumentFromTemplate("luxury", DATA);
    const sectionIds = new Set(doc.pages[0].sections.map((s) => s.id));
    const componentIds = new Set(doc.pages[0].components.map((c) => c.id));
    for (const c of doc.pages[0].components) {
      expect(sectionIds.has(c.parentId) || componentIds.has(c.parentId), `parent of ${c.name}`).toBe(true);
    }
  });

  it("There is no gallery frame when the card does not have a photo", () => {
    const doc = seedDocumentFromTemplate("romantic", { ...DATA, galleryImageUrls: [] });
    expect(doc.pages[0].components.find((c) => c.name.startsWith("Moment"))).toBeUndefined();
  });

  it("Arrange sample images according to the layout language of each topic", () => {
    const editorial = seedDocumentFromTemplate("magazine", { ...DATA, galleryImageUrls: [...(DATA.galleryImageUrls ?? []), "https://example.com/3.jpg"] });
    const pixel = seedDocumentFromTemplate("pixel", { ...DATA, galleryImageUrls: [...(DATA.galleryImageUrls ?? []), "https://example.com/3.jpg"] });
    const photoStack = seedDocumentFromTemplate("photo25d", { ...DATA, galleryImageUrls: [...(DATA.galleryImageUrls ?? []), "https://example.com/3.jpg"] });

    const frames = (doc: ReturnType<typeof seedDocumentFromTemplate>) => doc.pages[0].components.filter((c) => c.name.startsWith("Moment"));
    expect(frames(editorial)[2].size.height).toBeGreaterThan(frames(editorial)[0].size.height);
    expect(frames(pixel).map((frame) => frame.size.width)).toEqual([214, 214, 214]);
    expect(frames(photoStack).some((frame) => frame.rotation !== 0)).toBe(true);
  });

  it("Create a Magazine cover according to the masthead and split layout of the live version", () => {
    const magazine = seedDocumentFromTemplate("magazine", DATA);
    const components = magazine.pages[0].components;
    const texts = components.filter((component) => component.type === "text").map((component) => String(component.content.text));
    const cover = components.find((component) => component.name === "Main wedding photo");

    expect(texts).toContain("VOGUE WEDDING");
    expect(texts).toContain("Minh\n&\nThanh");
    expect(cover?.position.x).toBe(430);
    expect(cover?.size.height).toBe(650);
    expect(cover?.style.shadow.blur).toBe(0);
    expect(components.some((component) => component.name === "Couple rings")).toBe(false);
  });

  it("with animations and looping effects — the design 'lives' right from the template", () => {
    const doc = seedDocumentFromTemplate("romantic", DATA);
    const components = doc.pages[0].components;
    expect(components.some((c) => c.type === "effects")).toBe(true);
    expect(components.some((c) => c.animation.loop.type !== "none")).toBe(true);
  });

  it("Capture the source template and create your own layouts for Cosmic, Pixel, 3D and Photo Stack 2.5D", () => {
    const cosmic = seedDocumentFromTemplate("cosmic", DATA);
    const pixel = seedDocumentFromTemplate("pixel", DATA);
    const layered = seedDocumentFromTemplate("layered3d", DATA);
    const photo25d = seedDocumentFromTemplate("photo25d", DATA);

    expect(cosmic.metadata.sourceTemplateId).toBe("cosmic");
    expect(pixel.metadata.sourceTemplateId).toBe("pixel");
    expect(layered.metadata.sourceTemplateId).toBe("layered3d");
    expect(photo25d.metadata.sourceTemplateId).toBe("photo25d");

    expect(cosmic.pages[0].components.find((c) => c.type === "effects")?.content.effect).toBe("galaxy");
    expect(pixel.pages[0].components.find((c) => c.type === "effects")?.content.effect).toBe("pixel");
    expect(layered.pages[0].components.filter((c) => c.name.startsWith("3D image layer"))).toHaveLength(2);
    expect(photo25d.pages[0].components.filter((c) => c.name.startsWith("2.5D image layer"))).toHaveLength(2);
    expect(photo25d.pages[0].components.some((c) => c.animation.loop.type === "depth-float")).toBe(true);

    const cosmicHeroFrame = cosmic.pages[0].components.find((c) => c.name === "Main wedding photo");
    const pixelHeroFrame = pixel.pages[0].components.find((c) => c.name === "Main wedding photo");
    const photo25dHeroFrame = photo25d.pages[0].components.find((c) => c.name === "Main wedding photo");
    expect(cosmicHeroFrame?.content.frame).toBe("circle");
    expect(pixelHeroFrame?.content.frame).toBe("none");
    expect(cosmicHeroFrame?.position.x).toBeGreaterThan(400);
    expect(pixelHeroFrame?.position.x).toBeGreaterThan(400);
    expect(cosmicHeroFrame?.content.imageMotion).toBe("drift");
    expect(pixelHeroFrame?.content.imageMotion).toBe("pan-right");
    expect(photo25dHeroFrame?.content.imageMotion).toBe("depth-float");
    expect(photo25dHeroFrame?.animation.loop.type).toBe("perspective-sway");
  });

  it("keep the correct identity and reference of the selected template when importing", () => {
    const garden = seedDocumentFromTemplate("garden", { ...DATA, message: "" });
    const traditional = seedDocumentFromTemplate("traditional", { ...DATA, message: "" });
    const texts = (doc: ReturnType<typeof seedDocumentFromTemplate>) => doc.pages[0].components
      .filter((component) => component.type === "text")
      .map((component) => String(component.content.text));

    expect(garden.metadata.sourceTemplateId).toBe("garden");
    expect(garden.pages[0].sections[0].background.gradient.to).not.toBe(traditional.pages[0].sections[0].background.gradient.to);
    expect(texts(garden)).toContain("When the garden of love blooms");
    expect(texts(traditional)).toContain("The two families respectfully reported the news");
  });

  it("Import all family information and small music discs when data is available", () => {
    const doc = seedDocumentFromTemplate("garden", {
      ...DATA,
      musicUrl: "https://example.com/song.mp3",
      groomParents: { familyLabel: "The groom's family", fatherName: "Tran Van Hung", motherName: "Ham Thi Lan", address: "Dong Da, Hanoi", phone: "0901 234 567" },
      brideParents: { fatherName: "Nguyen Van Binh", motherName: "Phan Thi Huong", address: "Cau Giay, Hanoi" },
    });
    const texts = doc.pages[0].components.filter((component) => component.type === "text").map((component) => String(component.content.text));
    const music = doc.pages[0].components.find((component) => component.type === "music");

    expect(doc.pages[0].sections.some((section) => section.name === "Information about two families")).toBe(true);
    expect(texts).toContain("Mr. Tran Van Hung\nMrs. Ham Thi Lan");
    expect(texts).toContain("The groom's family");
    expect(texts).toContain("0901 234 567");
    expect(texts).toContain("Cau Giay, Hanoi");
    expect(music?.content.src).toBe("https://example.com/song.mp3");
    expect(music?.size).toEqual({ width: 68, height: 92 });
  });

  it("create a QR gift bag when there is an account and do not insert a sample account when data is missing", () => {
    const withoutBanks = seedDocumentFromTemplate("cosmic", DATA);
    expect(withoutBanks.pages[0].components.some((c) => c.type === "qrcode")).toBe(false);

    const withBanks = seedDocumentFromTemplate("cosmic", {
      ...DATA,
      groomBank: { bankName: "MB Bank", accountNumber: "190288889999", accountHolder: "Minh Anh" },
      brideBank: { bankName: "Vietcombank", accountNumber: "0451000222333", accountHolder: "THANH HA" },
    });
    const qrGifts = withBanks.pages[0].components.filter((c) => c.type === "qrcode");
    expect(qrGifts).toHaveLength(2);
    expect(qrGifts.every((c) => String(c.content.buttonLabel).startsWith("Open QR"))).toBe(true);
    expect(qrGifts.every((c) => c.animation.loop.type === "pulse")).toBe(true);
  });
});
