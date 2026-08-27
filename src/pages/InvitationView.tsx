import { useSearchParams } from "react-router-dom";
import WeddingFullPage from "@/features/template/WeddingFullPage";
import { LiveFeatures } from "@/components/wedding/live/LiveFeatures";

const InvitationView = () => {
  const [searchParams] = useSearchParams();
  const particlePreview = searchParams.get("particles");
  const previewBuilderConfig = ["none", "sparkles", "petals", "leaves", "galaxy", "pixel"].includes(particlePreview || "")
    ? JSON.stringify({ particlesType: particlePreview })
    : undefined;

  return (
    <>
      <WeddingFullPage
        groomName={searchParams.get("groom") || "Minh Anh"}
        brideName={searchParams.get("bride") || "Thanh Ha"}
        date={searchParams.get("date") || "2027-02-14"}
        time={searchParams.get("time") || "17:30"}
        venue={searchParams.get("venue") || "White Palace Convention Center"}
        address={searchParams.get("address") || "123 Nguyen Hue Street, District 1, Ho Chi Minh City"}
        message={searchParams.get("msg") || ""}
        accentColor={searchParams.get("color") || undefined}
        musicUrl={searchParams.get("music") || undefined}
        templateId={searchParams.get("t") || "romantic"}
        builderConfig={previewBuilderConfig}
        previewMode={searchParams.get("preview") === "1"}
      />
      <LiveFeatures slug="preview" />
    </>
  );
};

export default InvitationView;
