import type { GuestSearchParams } from "@/lib/guests";

export const guestKeys = {
  all: ["guests"] as const,
  list: (invitationId: string, params: GuestSearchParams) =>
    [...guestKeys.all, "list", invitationId, params] as const,
  detail: (guestId: string) => [...guestKeys.all, "detail", guestId] as const,
  groups: (invitationId: string) => [...guestKeys.all, "groups", invitationId] as const,
  tags: (invitationId: string) => [...guestKeys.all, "tags", invitationId] as const,
  attendance: (invitationId: string) => [...guestKeys.all, "attendance", invitationId] as const,
};
