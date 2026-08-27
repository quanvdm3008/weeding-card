import { describe, expect, it } from "vitest";
import { guestStatusFromValue, guestStatusToValue, type GuestStatus } from "@/lib/guests";

/* Guest enum must match TINYINT backend: 1 Pending, 2 Opened, 3 Accepted, 4 Declined*/
describe("guest status mapping (FE <-> BE contract)", () => {
  const pairs: [GuestStatus, number][] = [
    ["PENDING", 1],
    ["OPENED", 2],
    ["ACCEPTED", 3],
    ["DECLINED", 4],
  ];

  it.each(pairs)("maps %s <-> %i both ways", (status, value) => {
    expect(guestStatusToValue(status)).toBe(value);
    expect(guestStatusFromValue(value)).toBe(status);
  });

  it("round-trips every status", () => {
    for (const [status] of pairs) {
      expect(guestStatusFromValue(guestStatusToValue(status))).toBe(status);
    }
  });

  it("falls back to Pending for unknown numeric values", () => {
    expect(guestStatusFromValue(0)).toBe("PENDING");
    expect(guestStatusFromValue(99)).toBe("PENDING");
  });

  it("passes string statuses through unchanged", () => {
    expect(guestStatusFromValue("DECLINED")).toBe("DECLINED");
  });
});
