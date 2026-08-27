import { apiRequest } from "@/lib/api";
import { resolveBuilderConfig, serializeBuilderConfig, serializeInvitationContentConfig, DEFAULT_BUILDER_CONFIG } from "@/lib/builderConfig";
import type { WeddingConfig } from "@/store/weddingConfigStore";

export interface InvitationEventDto {
  id?: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
}

export interface InvitationDto {
  id: string;
  ownerUserId: string;
  templateCode: string;
  groomName: string;
  brideName: string;
  message: string;
  accentColor: string;
  musicUrl: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
  extraInfoTitle: string;
  extraInfoContent: string;
  builderConfig: string | null;
  contentConfig?: string | null;
  slug: string | null;
  rsvpEnabled: boolean;
  wishesEnabled: boolean;
  status: "Draft" | "Published" | "Archived" | number;
  events: InvitationEventDto[];
}

export interface PublicInvitationDto {
  id: string;
  slug: string;
  templateCode: string;
  groomName: string;
  brideName: string;
  message: string;
  accentColor: string;
  musicUrl: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
  extraInfoTitle: string;
  extraInfoContent: string;
  builderConfig: string | null;
  contentConfig?: string | null;
  /** JSON CardDocument from Card Studio — when settings.showOnPublicPage=true, render instead of template. */
  cardDocument?: string | null;
  rsvpEnabled: boolean;
  wishesEnabled: boolean;
  events: InvitationEventDto[];
}

export interface WishDto {
  id: string;
  authorName: string;
  message: string;
  emoji: string;
  likes: number;
  createdAtUtc: string;
}

export interface AnalyticsSummaryDto {
  pageViews: number;
  qrScans: number;
  wishes: number;
  rsvps: number;
  wishLikes: number;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

/** Card on Dashboard — identification information + quick stats (Phase 6). */
export interface InvitationSummaryDto {
  id: string;
  templateCode: string;
  groomName: string;
  brideName: string;
  coverImageUrl: string | null;
  slug: string | null;
  status: "Draft" | "Published" | "Archived";
  rsvpEnabled: boolean;
  wishesEnabled: boolean;
  updatedAtUtc: string;
  guestCount: number;
  rsvpCount: number;
  wishCount: number;
}

/**
 * Map InvitationDto from the shape API that weddingConfigStore.load() receives —
 * Common for Dashboard "Edit cards" and BuilderShell after publishing.
 */
export function invitationDtoToConfig(dto: InvitationDto) {
  return {
    invitationId: dto.id,
    templateId: dto.templateCode,
    groomName: dto.groomName,
    brideName: dto.brideName,
    message: dto.message,
    accentColor: dto.accentColor,
    musicUrl: dto.musicUrl,
    coverImageUrl: dto.coverImageUrl,
    galleryImageUrls: dto.galleryImageUrls,
    extraInfoTitle: dto.extraInfoTitle,
    extraInfoContent: dto.extraInfoContent,
    builderConfig: dto.builderConfig,
    slug: dto.slug ?? "",
    published: dto.status === "Published" || dto.status === 1,
    rsvpEnabled: dto.rsvpEnabled,
    wishesEnabled: dto.wishesEnabled,
    date: dto.events[0]?.date,
    time: dto.events[0]?.time,
    venue: dto.events[0]?.venue,
    address: dto.events[0]?.address,
  };
}

export function toInvitationPayload(cfg: WeddingConfig) {
  /* H8: Builder config goes through the actual builderConfig field; extraInfoContent only has text left*/
  /* (still the old strip delimiter prevents data from being loaded from legacy records).*/
  /* Must serialize ALL fields of BuilderConfig — any fields missing will be corrected in Builder*/
  /* After Publish, that field is lost (old bug: photoFilter/groomBank/brideBank/stories crashed,*/
  /* GiftPanel/StoryPanel saved but not eaten).*/
  const builderConfig = serializeBuilderConfig({
    cursorType: cfg.cursorType || DEFAULT_BUILDER_CONFIG.cursorType,
    particlesType: cfg.particlesType || DEFAULT_BUILDER_CONFIG.particlesType,
    photoFilter: cfg.photoFilter || DEFAULT_BUILDER_CONFIG.photoFilter,
    headingFont: cfg.headingFont || DEFAULT_BUILDER_CONFIG.headingFont,
    bodyFont: cfg.bodyFont || DEFAULT_BUILDER_CONFIG.bodyFont,
    headingWeight: cfg.headingWeight || DEFAULT_BUILDER_CONFIG.headingWeight,
    headingCase: cfg.headingCase || DEFAULT_BUILDER_CONFIG.headingCase,
    accentStyle: cfg.accentStyle || DEFAULT_BUILDER_CONFIG.accentStyle,
    customSections: cfg.customSections || DEFAULT_BUILDER_CONFIG.customSections,
    sectionStyles: cfg.sectionStyles || DEFAULT_BUILDER_CONFIG.sectionStyles,
  });
  const contentConfig = serializeInvitationContentConfig({
    groomBank: cfg.groomBank,
    brideBank: cfg.brideBank,
    stories: cfg.stories,
    groomParents: cfg.groomParents,
    brideParents: cfg.brideParents,
    schedule: cfg.schedule,
  });
  const { content: extraInfoContent } = resolveBuilderConfig(null, cfg.extraInfoContent);

  return {
    templateCode: cfg.templateId,
    groomName: cfg.groomName,
    brideName: cfg.brideName,
    message: cfg.message,
    accentColor: cfg.accentColor,
    musicUrl: cfg.musicUrl,
    coverImageUrl: cfg.coverImageUrl,
    galleryImageUrls: cfg.galleryImageUrls,
    extraInfoTitle: cfg.extraInfoTitle,
    extraInfoContent,
    builderConfig,
    contentConfig,
    rsvpEnabled: cfg.rsvpEnabled,
    wishesEnabled: cfg.wishesEnabled,
    events: [
      {
        title: "Wedding Ceremony",
        date: cfg.date,
        time: cfg.time,
        venue: cfg.venue,
        address: cfg.address,
      },
    ],
  };
}

export function createInvitation(cfg: WeddingConfig) {
  return apiRequest<InvitationDto>("/api/invitations", {
    method: "POST",
    body: JSON.stringify(toInvitationPayload(cfg)),
  });
}

export function updateInvitation(invitationId: string, cfg: WeddingConfig) {
  return apiRequest<InvitationDto>(`/api/invitations/${invitationId}`, {
    method: "PUT",
    body: JSON.stringify(toInvitationPayload(cfg)),
  });
}

export function publishInvitation(invitationId: string, slug?: string) {
  return apiRequest<InvitationDto>(`/api/invitations/${invitationId}/publish`, {
    method: "POST",
    body: JSON.stringify({ slug: slug || null }),
  });
}

export function unpublishInvitation(invitationId: string) {
  return apiRequest<InvitationDto>(`/api/invitations/${invitationId}/unpublish`, { method: "POST" });
}

export function archiveInvitation(invitationId: string) {
  return apiRequest<InvitationDto>(`/api/invitations/${invitationId}/archive`, { method: "POST" });
}

export function restoreInvitation(invitationId: string) {
  return apiRequest<InvitationDto>(`/api/invitations/${invitationId}/restore`, { method: "POST" });
}

export function deleteInvitation(invitationId: string) {
  return apiRequest<void>(`/api/invitations/${invitationId}`, { method: "DELETE" });
}

export function getInvitation(invitationId: string) {
  return apiRequest<InvitationDto>(`/api/invitations/${invitationId}`);
}

export function getInvitationAnalyticsSummary(invitationId: string) {
  return apiRequest<AnalyticsSummaryDto>(`/api/invitations/${invitationId}/analytics/summary`);
}

/** List of current user's cards (Dashboard). */
export function listMyInvitations() {
  return apiRequest<InvitationSummaryDto[]>("/api/invitations");
}

/** The card owner deletes inappropriate wishes. */
export function deleteWish(wishId: string) {
  return apiRequest<void>(`/api/wishes/${wishId}`, { method: "DELETE" });
}

export function getPublicInvitation(slug: string) {
  return apiRequest<PublicInvitationDto>(`/api/public/invitations/${encodeURIComponent(slug)}`);
}

export interface InvitationReactionDto {
  count: number;
  liked: boolean;
}

export function getInvitationHeart(slug: string) {
  return apiRequest<InvitationReactionDto>(`/api/public/invitations/${encodeURIComponent(slug)}/reactions/heart`);
}

export function setInvitationHeart(slug: string, liked: boolean) {
  return apiRequest<InvitationReactionDto>(`/api/public/invitations/${encodeURIComponent(slug)}/reactions/heart`, {
    method: "POST",
    body: JSON.stringify({ liked }),
  });
}

export function trackPublicInvitationEvent(slug: string, eventType: "qr-scan") {
  return apiRequest<void>(`/api/public/invitations/${encodeURIComponent(slug)}/analytics/${eventType}`, {
    method: "POST",
  });
}

export function getPublicWishes(slug: string) {
  return apiRequest<PagedResult<WishDto>>(`/api/public/invitations/${encodeURIComponent(slug)}/wishes?page=1&pageSize=50`);
}

export function postPublicWish(slug: string, authorName: string, message: string, emoji: string) {
  return apiRequest<WishDto>(`/api/public/invitations/${encodeURIComponent(slug)}/wishes`, {
    method: "POST",
    body: JSON.stringify({ authorName, message, emoji }),
  });
}

/** Customers like a wish — return the wish with the new number of likes. */
export function likePublicWish(slug: string, wishId: string) {
  return apiRequest<WishDto>(
    `/api/public/invitations/${encodeURIComponent(slug)}/wishes/${encodeURIComponent(wishId)}/like`,
    { method: "POST" }
  );
}

export interface PublicGuestDto {
  id: string;
  fullName: string;
  token: string;
  status: "Pending" | "OPENED" | "ACCEPTED" | "DECLINED" | number;
  respondedAtUtc: string | null;
  checkedInAtUtc: string | null;
}

export function getPublicGuest(slug: string, token: string) {
  return apiRequest<PublicGuestDto>(
    `/api/public/invitations/${encodeURIComponent(slug)}/guests/${encodeURIComponent(token)}`,
  );
}

export function submitPublicRsvp(slug: string, guestName: string, guestCount: number, attending: "yes" | "no" | "maybe", message?: string, guestToken?: string) {
  const status = attending === "yes" ? 1 : attending === "no" ? 2 : 3;
  return apiRequest("/api/public/invitations/" + encodeURIComponent(slug) + "/rsvps", {
    method: "POST",
    body: JSON.stringify({ guestName, guestCount, status, message: message || null, guestToken: guestToken || null }),
  });
}
