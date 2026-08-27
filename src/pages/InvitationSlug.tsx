import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import WeddingFullPage from "@/features/template/WeddingFullPage";
import { getPublicGuest, getPublicInvitation, trackPublicInvitationEvent, type PublicInvitationDto } from "@/lib/invitations";
import { getApiErrorMessage } from "@/lib/api";
import { parseCardDocument, cardDocumentHasContent } from "@/features/card-studio/schema/schema";
import { CardRenderer } from "@/features/card-studio/render/CardRenderer";
import RSVPSection from "@/components/wedding/RSVPSection";
import WishesWall from "@/components/wedding/wishes/WishesWall";
import { getTheme } from "@/data/themes";
import "@/features/card-studio/registry";
import InvitationActionRail from "@/components/wedding/InvitationActionRail";
import TemplateOpening from "@/components/TemplateOpening";
import { getTemplateExperience } from "@/data/templateExperiences";
import type { CardDocument } from "@/features/card-studio/schema/types";
import { LiveFeatures } from "@/components/wedding/live/LiveFeatures";

const CardStudioPublicInvitation = ({
  data,
  document,
  guestName,
  guestToken,
}: {
  data: PublicInvitationDto;
  document: CardDocument;
  guestName?: string;
  guestToken?: string;
}) => {
  const [opened, setOpened] = useState(false);
  const theme = getTheme(data.templateCode);
  const experience = getTemplateExperience(data.templateCode);
  const event = data.events[0];

  return (
    <>
      {!opened && (
        <TemplateOpening
          templateId={data.templateCode}
          variant={experience.opening}
          line={experience.inviteLine}
          groomName={data.groomName}
          brideName={data.brideName}
          accentColor={data.accentColor}
          date={event?.date}
          onComplete={() => setOpened(true)}
        />
      )}
      {opened && (
        <>
          <CardRenderer document={document} slug={data.slug} className="min-h-screen" />
          <InvitationActionRail publicSlug={data.slug} accentColor={data.accentColor} />
          {data.rsvpEnabled && (
            <RSVPSection
              accentColor={data.accentColor}
              sectionBg="var(--background)"
              theme={theme}
              publicSlug={data.slug}
              guestName={guestName}
              guestToken={guestToken}
            />
          )}
          {data.wishesEnabled && (
            <WishesWall accentColor={data.accentColor} theme={theme} publicSlug={data.slug} />
          )}
          <LiveFeatures slug={data.slug} />
        </>
      )}
    </>
  );
};

/**
 * Public guest-facing invitation page.
 * Backward compatible: data still comes from URL search params (?groom=&bride=...).
 * The :slug acts as a vanity identifier (e.g. /invitation/minh-ha) until we wire a DB lookup.
 */
const InvitationSlug = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const trackedQrScanRef = useRef(false);
  const guestToken = searchParams.get("guest") || "";
  const legacyKeys = ["groom", "bride", "date", "time", "venue", "address", "msg", "color", "t"];
  const hasLegacyParams = legacyKeys.some((key) => searchParams.has(key));
  const { data, error, isLoading } = useQuery({
    queryKey: ["public-invitation", slug],
    queryFn: () => getPublicInvitation(slug ?? ""),
    enabled: Boolean(slug) && !hasLegacyParams,
    retry: false,
  });
  const publicGuestQuery = useQuery({
    queryKey: ["public-guest", slug, guestToken],
    queryFn: () => getPublicGuest(slug ?? "", guestToken),
    enabled: Boolean(slug && guestToken && !hasLegacyParams),
    retry: false,
  });

  useEffect(() => {
    if (!slug || !guestToken || hasLegacyParams || trackedQrScanRef.current) return;
    trackedQrScanRef.current = true;
    trackPublicInvitationEvent(slug, "qr-scan").catch(() => undefined);
  }, [guestToken, hasLegacyParams, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !hasLegacyParams) {
    const message = getApiErrorMessage(error, "Card not found");
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 text-center">
        <div>
          <h1 className="font-display text-3xl text-foreground">The card is not ready yet</h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    );
  }

  if (data) {
    // Card Studio: if the card owner turns on "Use this design for the card page" → render CardDocument
    const cardDoc = parseCardDocument(data.cardDocument);
    if (cardDoc?.settings.showOnPublicPage && cardDocumentHasContent(cardDoc)) {
      return (
        <CardStudioPublicInvitation
          data={data}
          document={cardDoc}
          guestName={publicGuestQuery.data?.fullName}
          guestToken={publicGuestQuery.data?.token}
        />
      );
    }

    const event = data.events[0];

    return (
      <>
        <WeddingFullPage
          groomName={data.groomName}
          brideName={data.brideName}
          date={event?.date || "2027-02-14"}
          time={event?.time || "17:30"}
          venue={event?.venue || ""}
          address={event?.address || ""}
          message={data.message}
          accentColor={data.accentColor}
          templateId={data.templateCode}
          publicSlug={data.slug}
          publicGuestName={publicGuestQuery.data?.fullName}
          publicGuestToken={publicGuestQuery.data?.token}
          rsvpEnabled={data.rsvpEnabled}
          wishesEnabled={data.wishesEnabled}
          musicUrl={data.musicUrl}
          coverImageUrl={data.coverImageUrl}
          galleryImageUrls={data.galleryImageUrls}
          extraInfoTitle={data.extraInfoTitle}
          extraInfoContent={data.extraInfoContent}
          builderConfig={data.builderConfig}
          contentConfig={data.contentConfig}
        />
        <LiveFeatures slug={data.slug} />
      </>
    );
  }

  // Try to derive default names from slug like "minh-ha" → ["Minh", "Ha"]
  const slugParts = (slug ?? "").split("-").filter(Boolean);
  const fallbackGroom = slugParts[0]
    ? slugParts[0].charAt(0).toUpperCase() + slugParts[0].slice(1)
    : "Minh Anh";
  const fallbackBride = slugParts[1]
    ? slugParts[1].charAt(0).toUpperCase() + slugParts[1].slice(1)
    : "Thanh Ha";

  return (
    <>
      <WeddingFullPage
        groomName={searchParams.get("groom") || fallbackGroom}
        brideName={searchParams.get("bride") || fallbackBride}
        date={searchParams.get("date") || "2027-02-14"}
        time={searchParams.get("time") || "17:30"}
        venue={searchParams.get("venue") || "White Palace Convention Center"}
        address={searchParams.get("address") || "123 Nguyen Hue Street, District 1, Ho Chi Minh City"}
        message={searchParams.get("msg") || ""}
        accentColor={searchParams.get("color") || "#E8B4B8"}
        templateId={searchParams.get("t") || "romantic"}
        publicSlug={slug}
        publicGuestName={publicGuestQuery.data?.fullName}
        publicGuestToken={publicGuestQuery.data?.token}
      />
      <LiveFeatures slug={slug ?? ""} />
    </>
  );
};

export default InvitationSlug;
