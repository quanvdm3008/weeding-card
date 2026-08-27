export const rsvpKeys = {
  all: ["rsvps"] as const,
  list: (invitationId: string, page: number, pageSize: number) =>
    [...rsvpKeys.all, "list", invitationId, page, pageSize] as const,
  statistics: (invitationId: string) => [...rsvpKeys.all, "statistics", invitationId] as const,
};
