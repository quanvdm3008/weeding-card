import { expect, test, type Page } from "@playwright/test";

const viewportWidths = [320, 360, 375, 390, 412, 430, 768, 1024, 1440];
const publicTemplates = [
  "canvas", "romantic", "modern", "tropical", "rustic", "sakura", "minimalist",
  "vintage", "boho", "royal", "garden", "flat2d", "layered3d", "photo25d",
  "cosmic", "pixel", "luxury", "korean", "magazine", "traditional",
  "cyberpunk_luxe", "nordic_aurora", "coastal", "winter", "violet_dream", "parallax_love",
];

test.beforeEach(({ page }, testInfo) => {
  void page;
  test.skip(testInfo.project.name !== "desktop-chromium", "This suite controls its own viewport sizes.");
});

async function expectNoDocumentOverflow(page: Page, label: string) {
  await page.evaluate(() => document.fonts.ready);
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth, `${label} must not create horizontal document overflow`).toBeLessThanOrEqual(
    dimensions.clientWidth + 1,
  );
}

async function expectTemplateRendered(page: Page) {
  await expect(page.getByRole("heading", { name: "There was an error displaying the page" })).toHaveCount(0);
  await expect(page.getByText("Minh Anh").first()).toBeVisible();
}

test("romantic template fits every production viewport", async ({ page }) => {
  for (const width of viewportWidths) {
    await page.setViewportSize({ width, height: width <= 430 ? 844 : 900 });
    await page.goto("/view?t=romantic&preview=1", { waitUntil: "domcontentloaded" });
    await expectTemplateRendered(page);
    await expectNoDocumentOverflow(page, `romantic at ${width}px`);
  }
});

test("all public templates fit phone and desktop layouts", async ({ page }) => {
  for (const width of [390, 1024]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const template of publicTemplates) {
      await page.goto(`/view?t=${template}&preview=1`, { waitUntil: "domcontentloaded" });
      await expectTemplateRendered(page);
      await expectNoDocumentOverflow(page, `${template} at ${width}px`);
    }
  }
});

test("template remains usable with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/view?t=romantic&preview=1", { waitUntil: "domcontentloaded" });
  await expectTemplateRendered(page);
  await expectNoDocumentOverflow(page, "romantic with reduced motion");
});
