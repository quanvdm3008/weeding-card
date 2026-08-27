import { expect, test } from "@playwright/test";

const apiBaseUrl = process.env.E2E_API_BASE_URL ?? "http://127.0.0.1:8080";

test("real user can create, publish, open public link, RSVP, and send a wish", async ({ page, request }, testInfo) => {
  const preflight = await request.get(`${apiBaseUrl}/api/auth/me`);
  expect([200, 401], `Backend must be running at ${apiBaseUrl}`).toContain(preflight.status());

  const stamp = Date.now();
  const project = testInfo.project.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const email = `e2e-${project}-${stamp}@mireia.local`;
  const password = "Demo@12345";

  await page.goto("/login");
  await expect(page.getByTestId("auth-email")).toBeVisible();
  await page.getByTestId("auth-switch-signup").click();
  await page.getByTestId("auth-display-name").fill("E2E Demo");
  await page.getByTestId("auth-email").fill(email);
  await page.getByTestId("auth-password").fill(password);
  await page.getByTestId("auth-submit").click();

  await page.waitForURL("**/dashboard");
  await expect(page.getByTestId("dashboard-create-card")).toBeVisible();

  await page.getByTestId("dashboard-create-card").click();
  await page.getByTestId("template-details-romantic").scrollIntoViewIfNeeded();
  await page.getByTestId("template-details-romantic").click();

  await page.waitForURL("**/templates/romantic");
  await page.getByTestId("template-use-guided").click();

  await page.waitForURL("**/editor?**");
  await expect(page.getByTestId("editor-save")).toBeVisible({ timeout: 30_000 });

  const saveResponsePromise = page.waitForResponse((response) =>
    response.request().method() === "POST" &&
    response.url().endsWith("/api/invitations") &&
    [200, 201].includes(response.status()),
  );
  await page.getByTestId("editor-save").click();
  await saveResponsePromise;

  const publishResponsePromise = page.waitForResponse((response) =>
    response.request().method() === "POST" &&
    response.url().includes("/api/invitations/") &&
    response.url().endsWith("/publish") &&
    response.status() === 200,
  );
  await page.getByTestId("editor-publish-open").click();
  await page.getByTestId("editor-publish-confirm").click();
  const publishResponse = await publishResponsePromise;
  const publishBody = await publishResponse.json();
  const slug = publishBody.data?.slug;
  const invitationId = publishBody.data?.id;
  expect(slug, "Publish response must include a public slug").toBeTruthy();
  expect(invitationId, "Publish response must include an invitation id").toBeTruthy();

  await page.goto(`/invitation/${slug}#rsvp`);
  await page.getByTestId("opening-open").click({ timeout: 10_000 });
  await page.locator("#rsvp").scrollIntoViewIfNeeded({ timeout: 20_000 });
  await expect(page.getByTestId("rsvp-open")).toBeVisible({ timeout: 30_000 });
  await page.getByTestId("rsvp-open").click();
  await page.getByTestId("rsvp-name").fill("E2E Guest");
  await page.getByTestId("rsvp-guests").selectOption("2");
  await page.getByTestId("rsvp-message").fill("See you at the wedding.");

  const rsvpResponsePromise = page.waitForResponse((response) =>
    response.request().method() === "POST" &&
    response.url().includes(`/api/public/invitations/${slug}/rsvps`) &&
    response.status() === 201,
  );
  await page.getByTestId("rsvp-submit").click();
  await rsvpResponsePromise;

  await page.getByTestId("wish-open-form").scrollIntoViewIfNeeded();
  await page.getByTestId("wish-open-form").click();
  await page.getByTestId("wish-name").fill("E2E Friend");
  await page.getByTestId("wish-message").fill("Wishing you two hundreds of years of happiness.");

  const wishResponsePromise = page.waitForResponse((response) =>
    response.request().method() === "POST" &&
    response.url().includes(`/api/public/invitations/${slug}/wishes`) &&
    response.status() === 201,
  );
  await page.getByTestId("wish-submit").click();
  await wishResponsePromise;
  await expect(page.getByText("Wishing you two hundreds of years of happiness.").first()).toBeVisible();

  await page.goto(`/invitations/${invitationId}/guests`);
  const addGuestButton = page.getByTestId("guest-add").or(page.getByTestId("guest-add-empty"));
  await expect(addGuestButton.first()).toBeVisible();
  await addGuestButton.first().click();
  await page.getByTestId("guest-name").fill("E2E QR Guest");

  const createGuestResponsePromise = page.waitForResponse((response) =>
    response.request().method() === "POST" &&
    response.url().endsWith(`/api/invitations/${invitationId}/guests`),
  );
  await page.getByTestId("guest-save").click();
  const createGuestResponse = await createGuestResponsePromise;
  expect(createGuestResponse.status(), "Guest create request must succeed").toBe(201);
  const guestBody = await createGuestResponse.json();
  const guestId = guestBody.data?.id;
  expect(guestId, "Created guest must include an id").toBeTruthy();
  await expect(page.getByText("E2E QR Guest").first()).toBeVisible();

  await page.getByTestId(`guest-qr-${guestId}`).click();
  await expect(page.getByTestId("guest-qr-dialog")).toBeVisible();
  await expect(page.getByRole("img", { name: /RSVP's QR code E2E QR Guest/i })).toBeVisible();
});
