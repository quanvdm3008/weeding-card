import { describe, expect, it } from "vitest";
import { appRoutes } from "../routes";

describe("appRoutes", () => {
  it("keeps the public and protected route map stable", () => {
    expect(appRoutes.map((route) => route.path)).toEqual([
      "/",
      "/login",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
      "/view",
      "/invitation/:slug",
      "/templates/:templateId",
      "/dashboard",
      "/admin",
      "/provider",
      "/editor",
      "/editor/:invitationId",
      "/builder",
      "/builder/edit",
      "/studio",
      "/studio/:invitationId",
      "/invitations/:invitationId/guests",
      "/invitations/:invitationId/seating",
      "/invitations/:invitationId/rsvps",
      "/invitations/:invitationId/check-in",
      "/invitations/:invitationId/timeline",
      "/invitations/:invitationId/live-wall",
      "/invitations/:invitationId/lucky-draw",
      "/invitations/:invitationId/live-photos",
      "/invitations/:invitationId/printables",
      "/invitations/:invitationId/budget",
      "/invitations/:invitationId/broadcasts",
      "/services",
      "/services/:category",
      "*",
    ]);
  });
});
