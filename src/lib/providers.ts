import { apiRequest } from "@/lib/api";

export type ProviderStatus = "Pending" | "VERIFIED" | "SUSPENDED";
export type BookingStatus = "Pending" | "CONTACTED" | "CONFIRMED" | "DECLINED" | "CANCELLED";

export interface ProviderProfileDto {
  id: string; userId: string; businessName: string; description: string | null;
  phone: string | null; location: string | null; status: ProviderStatus; createdAtUtc: string;
}

export interface ProviderServiceDto {
  id: string; profileId: string; providerName: string; category: string; name: string;
  description: string | null; priceFrom: number | null; priceTo: number | null; active: boolean;
}

export interface ServiceBookingDto {
  id: string; serviceId: string; serviceName: string; providerName: string; customerUserId: string;
  contactName: string; phone: string; email: string | null; weddingDate: string; note: string | null;
  status: BookingStatus; createdAtUtc: string;
}

export const getProviderProfile = () => apiRequest<ProviderProfileDto>("/api/provider/profile");
export const saveProviderProfile = (input: Pick<ProviderProfileDto, "businessName" | "description" | "phone" | "location">) =>
  apiRequest<ProviderProfileDto>("/api/provider/profile", { method: "PUT", body: JSON.stringify(input) });
export const listProviderServices = () => apiRequest<ProviderServiceDto[]>("/api/provider/services");
export const createProviderService = (input: Omit<ProviderServiceDto, "id" | "profileId" | "providerName">) =>
  apiRequest<ProviderServiceDto>("/api/provider/services", { method: "POST", body: JSON.stringify(input) });
export const deleteProviderService = (id: string) => apiRequest<void>(`/api/provider/services/${id}`, { method: "DELETE" });
export const listProviderBookings = () => apiRequest<ServiceBookingDto[]>("/api/provider/bookings");
export const updateProviderBookingStatus = (id: string, status: BookingStatus) =>
  apiRequest<ServiceBookingDto>(`/api/provider/bookings/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });
export const listPublicProviderServices = () => apiRequest<ProviderServiceDto[]>("/api/public/providers/services");
export const createServiceBooking = (input: { serviceId: string; contactName: string; phone: string; email?: string; weddingDate: string; note?: string }) =>
  apiRequest<ServiceBookingDto>("/api/service-bookings", { method: "POST", body: JSON.stringify(input) });
export const listAdminProviderProfiles = () => apiRequest<ProviderProfileDto[]>("/api/admin/providers");
export const setAdminProviderStatus = (id: string, status: ProviderStatus) =>
  apiRequest<ProviderProfileDto>(`/api/admin/providers/${id}/status?status=${status}`, { method: "PUT" });
