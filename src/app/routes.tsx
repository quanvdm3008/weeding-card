import { lazy } from "react";
import type { ReactNode } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RoleRoute from "@/components/auth/RoleRoute";

const Index = lazy(() => import("@/pages/Index"));
const InvitationView = lazy(() => import("@/pages/InvitationView"));
const InvitationSlug = lazy(() => import("@/pages/InvitationSlug"));
const Login = lazy(() => import("@/pages/Login"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("@/pages/auth/VerifyEmailPage"));
const EditorPage = lazy(() => import("@/features/editor/pages/EditorPage"));
const LegacyEditorRedirect = lazy(() => import("@/features/editor/pages/LegacyEditorRedirect"));
const TemplateDetailPage = lazy(() => import("@/features/templates/pages/TemplateDetailPage"));
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const ProviderDashboardPage = lazy(() => import("@/pages/provider/ProviderDashboardPage"));
const Services = lazy(() => import("@/pages/Services"));
const GuestListPage = lazy(() => import("@/pages/guests/GuestListPage"));
const RSVPDashboardPage = lazy(() => import("@/pages/rsvps/RSVPDashboardPage"));
const CheckInPage = lazy(() => import("@/pages/checkin/CheckInPage"));
const SeatingPlannerPage = lazy(() => import("@/pages/guests/SeatingPlannerPage"));
const LiveWallPage = lazy(() => import("@/pages/live/LiveWallPage"));
const LuckyDrawPage = lazy(() => import("@/pages/live/LuckyDrawPage"));
const LivePhotosPage = lazy(() => import("@/pages/live/LivePhotosPage"));
const WeddingTimelinePage = lazy(() => import("@/pages/timeline/WeddingTimelinePage"));
const PrintablesPage = lazy(() => import("@/pages/printables/PrintablesPage"));
const BudgetPlannerPage = lazy(() => import("@/pages/budget/BudgetPlannerPage"));
const BroadcastManagerPage = lazy(() => import("@/pages/broadcasts/BroadcastManagerPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const protectedElement = (element: ReactNode) => <ProtectedRoute>{element}</ProtectedRoute>;

export const appRoutes: RouteObject[] = [
  { path: "/", element: <Index /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/verify-email", element: <VerifyEmailPage /> },
  { path: "/view", element: <InvitationView /> },
  { path: "/invitation/:slug", element: <InvitationSlug /> },
  { path: "/templates/:templateId", element: <TemplateDetailPage /> },
  { path: "/dashboard", element: protectedElement(<DashboardPage />) },
  { path: "/admin", element: <RoleRoute role="Admin"><AdminDashboardPage /></RoleRoute> },
  { path: "/provider", element: <RoleRoute role="PROVIDER"><ProviderDashboardPage /></RoleRoute> },
  { path: "/editor", element: protectedElement(<EditorPage />) },
  { path: "/editor/:invitationId", element: protectedElement(<EditorPage />) },
  { path: "/builder", element: <LegacyEditorRedirect source="builder" /> },
  { path: "/builder/edit", element: <LegacyEditorRedirect source="builder" /> },
  { path: "/studio", element: <LegacyEditorRedirect source="studio" /> },
  { path: "/studio/:invitationId", element: <LegacyEditorRedirect source="studio" /> },
  { path: "/invitations/:invitationId/guests", element: protectedElement(<GuestListPage />) },
  { path: "/invitations/:invitationId/seating", element: protectedElement(<SeatingPlannerPage />) },
  { path: "/invitations/:invitationId/rsvps", element: protectedElement(<RSVPDashboardPage />) },
  { path: "/invitations/:invitationId/check-in", element: protectedElement(<CheckInPage />) },
  { path: "/invitations/:invitationId/timeline", element: protectedElement(<WeddingTimelinePage />) },
  { path: "/invitations/:invitationId/live-wall", element: protectedElement(<LiveWallPage />) },
  { path: "/invitations/:invitationId/lucky-draw", element: protectedElement(<LuckyDrawPage />) },
  { path: "/invitations/:invitationId/live-photos", element: protectedElement(<LivePhotosPage />) },
  { path: "/invitations/:invitationId/printables", element: protectedElement(<PrintablesPage />) },
  { path: "/invitations/:invitationId/budget", element: protectedElement(<BudgetPlannerPage />) },
  { path: "/invitations/:invitationId/broadcasts", element: protectedElement(<BroadcastManagerPage />) },
  { path: "/services", element: protectedElement(<Services />) },
  { path: "/services/:category", element: protectedElement(<Services />) },
  { path: "*", element: <NotFound /> },
];
