import { Navigate, useLocation, useParams } from "react-router-dom";

interface LegacyEditorRedirectProps {
  source: "builder" | "studio";
}

const LegacyEditorRedirect = ({ source }: LegacyEditorRedirectProps) => {
  const location = useLocation();
  const { invitationId } = useParams<{ invitationId: string }>();

  if (source === "builder" && !location.pathname.endsWith("/edit")) {
    return <Navigate to="/dashboard#template-marketplace" replace />;
  }

  const params = new URLSearchParams(location.search);
  params.set("workspace", source === "studio" ? "canvas" : "guided");
  const path = invitationId ? `/editor/${invitationId}` : "/editor";
  return <Navigate to={`${path}?${params.toString()}`} replace />;
};

export default LegacyEditorRedirect;
