import { apiRequest } from "@/lib/api";
import type { PagedResult } from "@/lib/invitations";

export type RsvpStatus = "ATTENDING" | "DECLINED" | "MAYBE";

const RSVP_STATUS_BY_VALUE: Record<number, RsvpStatus> = {
  1: "ATTENDING",
  2: "DECLINED",
  3: "MAYBE",
};

const RSVP_STATUS_VALUE: Record<RsvpStatus, number> = {
  ATTENDING: 1,
  DECLINED: 2,
  MAYBE: 3,
};

export function rsvpStatusToValue(status: RsvpStatus): number {
  return RSVP_STATUS_VALUE[status];
}

export function rsvpStatusFromValue(value: RsvpStatus | number): RsvpStatus {
  return typeof value === "number" ? RSVP_STATUS_BY_VALUE[value] ?? "MAYBE" : value;
}

export interface RsvpCompanionDto {
  id: string;
  name: string;
  mealSelection: string | null;
}

export interface RsvpDto {
  id: string;
  invitationId: string;
  guestName: string;
  guestCount: number;
  status: RsvpStatus | number;
  message: string | null;
  mealSelection: string | null;
  submittedAtUtc: string;
  companions: RsvpCompanionDto[];
}

export interface RsvpStatisticsDto {
  totalResponses: number;
  attendingCount: number;
  declinedCount: number;
  maybeCount: number;
  totalGuestCount: number;
  mealBreakdown: Record<string, number>;
}

export function listRsvps(invitationId: string, page = 1, pageSize = 20) {
  return apiRequest<PagedResult<RsvpDto>>(`/api/invitations/${invitationId}/rsvps?page=${page}&pageSize=${pageSize}`);
}

export function getRsvpStatistics(invitationId: string) {
  return apiRequest<RsvpStatisticsDto>(`/api/invitations/${invitationId}/rsvps/statistics`);
}

export interface RsvpCompanionInput {
  name: string;
  mealSelection?: string | null;
}

export interface RsvpUpdateInput {
  guestName: string;
  guestCount: number;
  status: RsvpStatus;
  message?: string | null;
  mealSelection?: string | null;
  companions: RsvpCompanionInput[];
}

export function updateRsvp(rsvpId: string, input: RsvpUpdateInput) {
  return apiRequest<RsvpDto>(`/api/rsvps/${rsvpId}`, {
    method: "PUT",
    body: JSON.stringify({ ...input, status: rsvpStatusToValue(input.status) }),
  });
}

export function cancelRsvp(rsvpId: string) {
  return apiRequest<void>(`/api/rsvps/${rsvpId}`, { method: "DELETE" });
}
