import { apiRequest } from "@/lib/api";

export type BillingPlanCode = "FREE" | "PRO" | "Business";
export type BillingStatus = "active" | "PAST_DUE" | "CANCELED";

export interface BillingPlanDto {
  code: BillingPlanCode;
  displayName: string;
  monthlyPriceCents: number;
  maxInvitations: number;
  maxPublishedInvitations: number;
  maxGuestsPerInvitation: number;
  customDomain: boolean;
  removeBranding: boolean;
  analytics: boolean;
  aiAssistant: boolean;
}

export interface SubscriptionDto {
  planCode: BillingPlanCode;
  status: BillingStatus;
  currentPeriodEndUtc: string | null;
  cancelAtPeriodEnd: boolean;
  externalCustomerId: string | null;
  externalSubscriptionId: string | null;
}

export interface BillingUsageDto {
  totalInvitations: number;
  publishedInvitations: number;
}

export interface BillingAccountDto {
  subscription: SubscriptionDto;
  currentPlan: BillingPlanDto;
  usage: BillingUsageDto;
  plans: BillingPlanDto[];
}

export interface CheckoutSessionDto {
  planCode: BillingPlanCode;
  checkoutUrl: string;
  paymentProviderConfigured: boolean;
}

export interface BillingInvoiceDto {
  id: string;
  externalInvoiceId: string;
  status: string;
  amountPaidCents: number;
  currency: string;
  hostedInvoiceUrl: string | null;
  paidAtUtc: string | null;
  createdAtUtc: string;
}

export function getBillingAccount() {
  return apiRequest<BillingAccountDto>("/api/billing/me");
}

export function createCheckoutSession(planCode: BillingPlanCode) {
  return apiRequest<CheckoutSessionDto>("/api/billing/checkout-session", {
    method: "POST",
    body: JSON.stringify({ planCode }),
  });
}

export function getBillingInvoices() {
  return apiRequest<BillingInvoiceDto[]>("/api/billing/invoices");
}

export function formatPlanLimit(value: number) {
  return value < 0 ? "Unlimited" : String(value);
}
