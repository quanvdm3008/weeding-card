import { apiRequest } from "@/lib/api";
import type { PagedResult } from "@/lib/invitations";

export type GuestStatus = "PENDING" | "OPENED" | "ACCEPTED" | "DECLINED";

const GUEST_STATUS_BY_VALUE: Record<number, GuestStatus> = {
  1: "PENDING",
  2: "OPENED",
  3: "ACCEPTED",
  4: "DECLINED",
};

const GUEST_STATUS_VALUE: Record<GuestStatus, number> = {
  PENDING: 1,
  OPENED: 2,
  ACCEPTED: 3,
  DECLINED: 4,
};

export function guestStatusToValue(status: GuestStatus): number {
  return GUEST_STATUS_VALUE[status];
}

export function guestStatusFromValue(value: GuestStatus | number): GuestStatus {
  return typeof value === "number" ? GUEST_STATUS_BY_VALUE[value] ?? "PENDING" : value;
}

export interface GuestDto {
  id: string;
  invitationId: string;
  groupId: string | null;
  fullName: string;
  phone: string | null;
  email: string | null;
  note: string | null;
  token: string;
  status: GuestStatus | number;
  invitedAtUtc: string;
  respondedAtUtc: string | null;
  checkedInAtUtc: string | null;
  tagIds: string[];
}

export interface AttendanceSummaryDto {
  totalGuests: number;
  acceptedCount: number;
  declinedCount: number;
  pendingOrOpenedCount: number;
  checkedInCount: number;
}

export interface GuestGroupDto {
  id: string;
  invitationId: string;
  name: string;
}

export interface GuestTagDto {
  id: string;
  invitationId: string;
  name: string;
  color: string;
}

export interface GuestImportResultDto {
  importJobId: string;
  totalRows: number;
  successCount: number;
  failureCount: number;
  errors: string[];
}

export interface GuestSearchParams {
  search?: string;
  groupId?: string;
  tagId?: string;
  status?: GuestStatus;
  page?: number;
  pageSize?: number;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  }
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export function listGuests(invitationId: string, params: GuestSearchParams = {}) {
  const qs = buildQuery({
    search: params.search,
    groupId: params.groupId,
    tagId: params.tagId,
    status: params.status ? guestStatusToValue(params.status) : undefined,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
  });
  return apiRequest<PagedResult<GuestDto>>(`/api/invitations/${invitationId}/guests${qs}`);
}

export function getGuest(guestId: string) {
  return apiRequest<GuestDto>(`/api/guests/${guestId}`);
}

export interface GuestInput {
  fullName: string;
  phone?: string | null;
  email?: string | null;
  note?: string | null;
  groupId?: string | null;
  tagIds: string[];
}

export function createGuest(invitationId: string, input: GuestInput) {
  return apiRequest<GuestDto>(`/api/invitations/${invitationId}/guests`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateGuest(guestId: string, input: GuestInput & { status: GuestStatus }) {
  return apiRequest<GuestDto>(`/api/guests/${guestId}`, {
    method: "PUT",
    body: JSON.stringify({ ...input, status: guestStatusToValue(input.status) }),
  });
}

export function deleteGuest(guestId: string) {
  return apiRequest<void>(`/api/guests/${guestId}`, { method: "DELETE" });
}

export interface GuestImportRowInput {
  fullName: string;
  phone?: string | null;
  email?: string | null;
  note?: string | null;
  groupName?: string | null;
}

export function importGuests(invitationId: string, rows: GuestImportRowInput[]) {
  return apiRequest<GuestImportResultDto>(`/api/invitations/${invitationId}/guests/import`, {
    method: "POST",
    body: JSON.stringify({ rows }),
  });
}

export async function exportGuestsCsv(invitationId: string, params: Pick<GuestSearchParams, "groupId" | "tagId" | "status"> = {}) {
  const qs = buildQuery({
    groupId: params.groupId,
    tagId: params.tagId,
    status: params.status ? guestStatusToValue(params.status) : undefined,
  });
  const response = await fetch(`/api/invitations/${invitationId}/guests/export${qs}`, { credentials: "include" });
  if (!response.ok) {
    throw new Error("Unable to export guest list");
  }
  return response.blob();
}

export function listGuestGroups(invitationId: string) {
  return apiRequest<GuestGroupDto[]>(`/api/invitations/${invitationId}/guest-groups`);
}

export function createGuestGroup(invitationId: string, name: string) {
  return apiRequest<GuestGroupDto>(`/api/invitations/${invitationId}/guest-groups`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function updateGuestGroup(groupId: string, name: string) {
  return apiRequest<GuestGroupDto>(`/api/guest-groups/${groupId}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
}

export function deleteGuestGroup(groupId: string) {
  return apiRequest<void>(`/api/guest-groups/${groupId}`, { method: "DELETE" });
}

export function listGuestTags(invitationId: string) {
  return apiRequest<GuestTagDto[]>(`/api/invitations/${invitationId}/guest-tags`);
}

export function createGuestTag(invitationId: string, name: string, color: string) {
  return apiRequest<GuestTagDto>(`/api/invitations/${invitationId}/guest-tags`, {
    method: "POST",
    body: JSON.stringify({ name, color }),
  });
}

export function updateGuestTag(tagId: string, name: string, color: string) {
  return apiRequest<GuestTagDto>(`/api/guest-tags/${tagId}`, {
    method: "PUT",
    body: JSON.stringify({ name, color }),
  });
}

export function deleteGuestTag(tagId: string) {
  return apiRequest<void>(`/api/guest-tags/${tagId}`, { method: "DELETE" });
}

export function buildGuestRsvpLink(invitationSlug: string, token: string): string {
  return `${window.location.origin}/invitation/${encodeURIComponent(invitationSlug)}?guest=${encodeURIComponent(token)}`;
}

export function checkInGuest(guestId: string) {
  return apiRequest<GuestDto>(`/api/guests/${guestId}/check-in`, { method: "POST" });
}

export function getAttendanceSummary(invitationId: string) {
  return apiRequest<AttendanceSummaryDto>(`/api/invitations/${invitationId}/guests/attendance`);
}
