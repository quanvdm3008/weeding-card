import { apiRequest } from "@/lib/api";

/** API client for Card Studio documents and version history. */

export interface CardDocumentDto {
  document: string | null;
  version: number;
  updatedAtUtc: string | null;
}

export interface CardDocumentVersionDto {
  version: number;
  createdAtUtc: string;
}

export function getCardDocument(invitationId: string) {
  return apiRequest<CardDocumentDto>(`/api/invitations/${invitationId}/card-document`);
}

export function saveCardDocument(invitationId: string, document: string, expectedVersion?: number) {
  return apiRequest<CardDocumentDto>(`/api/invitations/${invitationId}/card-document`, {
    method: "PUT",
    body: JSON.stringify({ document, expectedVersion: expectedVersion ?? null }),
  });
}

export function listCardDocumentVersions(invitationId: string) {
  return apiRequest<CardDocumentVersionDto[]>(`/api/invitations/${invitationId}/card-document/versions`);
}

export function restoreCardDocumentVersion(invitationId: string, version: number) {
  return apiRequest<CardDocumentDto>(
    `/api/invitations/${invitationId}/card-document/versions/${version}/restore`,
    { method: "POST" }
  );
}

/** Key localStorage for Studio drafts when not attached to any invitations. */
export const CARD_STUDIO_DRAFT_KEY = "card-studio-draft";
