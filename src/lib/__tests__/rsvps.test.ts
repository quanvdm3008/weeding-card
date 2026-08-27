import { describe, expect, it } from "vitest";
import { rsvpStatusFromValue, rsvpStatusToValue, type RsvpStatus } from "@/lib/rsvps";

/* Enum RSVP must match TINYINT backend: 1 Attending, 2 Declined, 3 Maybe*/
describe("rsvp status mapping (FE <-> BE contract)", () => {
  const pairs: [RsvpStatus, number][] = [
    ["ATTENDING", 1],
    ["DECLINED", 2],
    ["MAYBE", 3],
  ];

  it.each(pairs)("maps %s <-> %i both ways", (status, value) => {
    expect(rsvpStatusToValue(status)).toBe(value);
    expect(rsvpStatusFromValue(value)).toBe(status);
  });

  it("falls back to Maybe for unknown numeric values", () => {
    expect(rsvpStatusFromValue(0)).toBe("MAYBE");
    expect(rsvpStatusFromValue(42)).toBe("MAYBE");
  });

  it("passes string statuses through unchanged", () => {
    expect(rsvpStatusFromValue("ATTENDING")).toBe("ATTENDING");
  });
});
