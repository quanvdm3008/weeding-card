import { apiRequest } from "@/lib/api";
import type { PagedResult } from "@/lib/invitations";

/** API client for Admin Dashboard (Phase 8) — route /api/admin/** requires the ADMIN role. */

export interface AdminStatsDto {
  totalUsers: number;
  totalInvitations: number;
  publishedInvitations: number;
  draftInvitations: number;
  archivedInvitations: number;
  totalGuests: number;
  totalRsvps: number;
  totalWishes: number;
}

export interface AdminUserDto {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
  createdAtUtc: string;
  lastLoginAtUtc: string | null;
  invitationCount: number;
}

export interface AdminInvitationDto {
  id: string;
  groomName: string;
  brideName: string;
  templateCode: string;
  status: "Draft" | "Published" | "Archived";
  slug: string | null;
  ownerEmail: string;
  updatedAtUtc: string;
}

export interface AdminBillingStatsDto {
  activeFree: number;
  activePro: number;
  activeBusiness: number;
  pastDue: number;
  canceled: number;
  paidInvoices: number;
  revenueCents: number;
}

export interface AdminSubscriptionDto {
  ownerUserId: string;
  ownerEmail: string;
  planCode: "FREE" | "PRO" | "Business";
  status: "active" | "PAST_DUE" | "CANCELED";
  currentPeriodEndUtc: string | null;
  cancelAtPeriodEnd: boolean;
  externalCustomerId: string | null;
  externalSubscriptionId: string | null;
}

export interface AnalyticsSummaryDto {
  pageViews: number;
  qrScans: number;
  wishes: number;
  rsvps: number;
  wishLikes: number;
}

export interface AdminLoginActivityDto {
  eventId: string;
  userId: string | null;
  email: string;
  displayName: string;
  roles: string[];
  action: "LOGIN_SUCCESS" | "LOGIN_FAILED" | "LOGOUT";
  outcome: "SUCCESS" | "FAILED";
  ipHint: string | null;
  userAgent: string | null;
  occurredAtUtc: string;
}

export function getAdminStats() {
  return apiRequest<AdminStatsDto>("/api/admin/stats");
}

export function listAdminUsers(page: number, search: string) {
  const params = new URLSearchParams({ page: String(page), pageSize: "20", search });
  return apiRequest<PagedResult<AdminUserDto>>(`/api/admin/users?${params}`);
}

export function listAdminInvitations(page: number, search: string, status: string) {
  const params = new URLSearchParams({ page: String(page), pageSize: "20", search });
  if (status) params.set("status", status);
  return apiRequest<PagedResult<AdminInvitationDto>>(`/api/admin/invitations?${params}`);
}

export function archiveAdminInvitation(id: string) {
  return apiRequest<AdminInvitationDto>(`/api/admin/invitations/${id}/archive`, { method: "POST" });
}

export function restoreAdminInvitation(id: string) {
  return apiRequest<AdminInvitationDto>(`/api/admin/invitations/${id}/restore`, { method: "POST" });
}

export function getAdminBillingStats() {
  return apiRequest<AdminBillingStatsDto>("/api/admin/billing/stats");
}

export function listAdminSubscriptions(page: number, search: string) {
  const params = new URLSearchParams({ page: String(page), pageSize: "20", search });
  return apiRequest<PagedResult<AdminSubscriptionDto>>(`/api/admin/billing/subscriptions?${params}`);
}

export function getAdminAnalyticsSummary() {
  return apiRequest<AnalyticsSummaryDto>("/api/admin/analytics/summary");
}

export function listAdminLoginActivity(page: number) {
  const params = new URLSearchParams({ page: String(page), pageSize: "20" });
  return apiRequest<PagedResult<AdminLoginActivityDto>>(`/api/admin/login-activity?${params}`);
}
