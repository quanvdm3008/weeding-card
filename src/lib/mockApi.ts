import { WEDDING_SEED_DATA } from "@/data/seedData";

const MOCK_DELAY = 500; // Simulate network latency

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readJsonBody(init: RequestInit): Record<string, unknown> {
  if (typeof init.body !== "string") return {};
  try {
    const parsed = JSON.parse(init.body);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

// In-memory mock DB
const db = {
  user: {
    userId: "u-1",
    email: "admin@weddinginvitation.com",
    displayName: "Admin",
    roles: ["OWNER", "Admin"],
    permissions: [],
    emailVerified: true,
  },
  invitation: {
    id: "inv-1",
    ownerUserId: "u-1",
    templateCode: "romantic",
    groomName: WEDDING_SEED_DATA.groomName,
    brideName: WEDDING_SEED_DATA.brideName,
    message: WEDDING_SEED_DATA.message,
    accentColor: "#E8B4B8",
    musicUrl: "",
    coverImageUrl: WEDDING_SEED_DATA.coverImageUrl,
    galleryImageUrls: WEDDING_SEED_DATA.galleryImageUrls,
    extraInfoTitle: "Additional Information",
    extraInfoContent: "...",
    builderConfig: null,
    contentConfig: null,
    slug: "minh-anh-thanh-ha",
    rsvpEnabled: true,
    wishesEnabled: true,
    status: "Published",
    events: [],
    updatedAtUtc: new Date().toISOString(),
  }
};

// Card Studio document mock (Builder V2)
const mockCardDocument: {
  document: string | null;
  version: number;
  updatedAtUtc: string | null;
  versions: { version: number; createdAtUtc: string; document: string | null }[];
} = { document: null, version: 0, updatedAtUtc: null, versions: [] };

export async function mockApiHandler(path: string, init: RequestInit): Promise<unknown> {
  await delay(MOCK_DELAY);
  const method = init.method || "GET";

  console.log(`[MOCK API] ${method} ${path}`);

  /* Auth — login/signup/refresh returns AuthResponse shape (user + JWT + refresh token)*/
  if (path.startsWith("/api/auth/me") && method === "GET") {
    return db.user;
  }
  if (
    (path.startsWith("/api/auth/login") ||
      path.startsWith("/api/auth/signup") ||
      path.startsWith("/api/auth/refresh")) &&
    method === "POST"
  ) {
    return {
      user: db.user,
      accessToken: "mock-jwt-token",
      accessTokenExpiresAtUtc: new Date(Date.now() + 60 * 60_000).toISOString(),
      refreshToken: "mock-refresh-token",
      refreshTokenExpiresAtUtc: new Date(Date.now() + 30 * 86_400_000).toISOString(),
    };
  }
  if (path.startsWith("/api/auth/logout") && method === "POST") {
    return null;
  }
  if (path.startsWith("/api/auth/password/forgot") && method === "POST") {
    return null;
  }
  if (path.startsWith("/api/auth/password/reset") && method === "POST") {
    return null;
  }
  if (path.startsWith("/api/auth/email/verify") && method === "POST") {
    return null;
  }
  if (path.startsWith("/api/auth/email/resend") && method === "POST") {
    return null;
  }

  if (path === "/api/billing/me" && method === "GET") {
    return {
      subscription: {
        planCode: "FREE",
        status: "active",
        currentPeriodEndUtc: null,
        cancelAtPeriodEnd: false,
        externalCustomerId: null,
        externalSubscriptionId: null,
      },
      currentPlan: {
        code: "FREE",
        displayName: "Free",
        monthlyPriceCents: 0,
        maxInvitations: 3,
        maxPublishedInvitations: 1,
        maxGuestsPerInvitation: 50,
        customDomain: false,
        removeBranding: false,
        analytics: false,
        aiAssistant: false,
      },
      usage: { totalInvitations: 1, publishedInvitations: 1 },
      plans: [
        { code: "FREE", displayName: "Free", monthlyPriceCents: 0, maxInvitations: 3, maxPublishedInvitations: 1, maxGuestsPerInvitation: 50, customDomain: false, removeBranding: false, analytics: false, aiAssistant: false },
        { code: "PRO", displayName: "Pro", monthlyPriceCents: 1900, maxInvitations: 20, maxPublishedInvitations: 10, maxGuestsPerInvitation: 500, customDomain: false, removeBranding: true, analytics: true, aiAssistant: true },
        { code: "Business", displayName: "Business", monthlyPriceCents: 5900, maxInvitations: -1, maxPublishedInvitations: -1, maxGuestsPerInvitation: -1, customDomain: true, removeBranding: true, analytics: true, aiAssistant: true },
      ],
    };
  }
  if (path === "/api/billing/checkout-session" && method === "POST") {
    const body = init.body ? JSON.parse(String(init.body)) : {};
    return {
      planCode: body.planCode || "PRO",
      checkoutUrl: `/services?billingPlan=${String(body.planCode || "PRO").toLowerCase()}`,
      paymentProviderConfigured: true,
    };
  }
  if (path === "/api/billing/invoices" && method === "GET") {
    return [
      {
        id: "inv-demo-1",
        externalInvoiceId: "in_demo",
        status: "paid",
        amountPaidCents: 1900,
        currency: "usd",
        hostedInvoiceUrl: "https://dashboard.stripe.com/test/invoices/in_demo",
        paidAtUtc: new Date().toISOString(),
        createdAtUtc: new Date().toISOString(),
      },
    ];
  }

  // Invitations
  if (path === "/api/invitations" && method === "POST") {
    Object.assign(db.invitation, readJsonBody(init), {
      id: db.invitation.id,
      status: "Draft",
      slug: null,
      updatedAtUtc: new Date().toISOString(),
    });
    return db.invitation;
  }

  if (path === "/api/invitations" && method === "GET") {
    return [{
      id: db.invitation.id,
      templateCode: db.invitation.templateCode,
      groomName: db.invitation.groomName,
      brideName: db.invitation.brideName,
      coverImageUrl: db.invitation.coverImageUrl,
      slug: db.invitation.slug,
      status: db.invitation.status,
      rsvpEnabled: db.invitation.rsvpEnabled,
      wishesEnabled: db.invitation.wishesEnabled,
      updatedAtUtc: db.invitation.updatedAtUtc,
      guestCount: 120,
      rsvpCount: 85,
      wishCount: 42,
    }];
  }

  if (path.match(/^\/api\/invitations\/[^/]+$/) && method === "GET") {
    return db.invitation;
  }

  if (path.match(/^\/api\/invitations\/[^/]+$/) && method === "PUT") {
    Object.assign(db.invitation, readJsonBody(init), { updatedAtUtc: new Date().toISOString() });
    return db.invitation;
  }

  {
    const lifecycleMatch = path.match(/^\/api\/invitations\/[^/]+\/(publish|unpublish|archive|restore)$/);
    if (lifecycleMatch && method === "POST") {
      const action = lifecycleMatch[1];
      const body = readJsonBody(init);
      db.invitation.status = action === "publish" ? "Published" : action === "archive" ? "Archived" : "Draft";
      if (action === "publish" && typeof body.slug === "string" && body.slug.trim()) db.invitation.slug = body.slug;
      db.invitation.updatedAtUtc = new Date().toISOString();
      return db.invitation;
    }
  }

  // Card Studio document (Builder V2)
  if (path.match(/^\/api\/invitations\/[^/]+\/card-document$/)) {
    if (method === "GET") {
      return { document: mockCardDocument.document, version: mockCardDocument.version, updatedAtUtc: mockCardDocument.updatedAtUtc };
    }
    if (method === "PUT") {
      const body = init.body ? JSON.parse(String(init.body)) : {};
      mockCardDocument.document = body.document ?? null;
      mockCardDocument.version += 1;
      mockCardDocument.updatedAtUtc = new Date().toISOString();
      mockCardDocument.versions.unshift({ version: mockCardDocument.version, createdAtUtc: mockCardDocument.updatedAtUtc, document: mockCardDocument.document });
      mockCardDocument.versions = mockCardDocument.versions.slice(0, 20);
      return { document: mockCardDocument.document, version: mockCardDocument.version, updatedAtUtc: mockCardDocument.updatedAtUtc };
    }
  }
  if (path.match(/^\/api\/invitations\/[^/]+\/card-document\/versions$/) && method === "GET") {
    return mockCardDocument.versions.map(({ version, createdAtUtc }) => ({ version, createdAtUtc }));
  }
  {
    const restoreMatch = path.match(/^\/api\/invitations\/[^/]+\/card-document\/versions\/(\d+)\/restore$/);
    if (restoreMatch && method === "POST") {
      const target = mockCardDocument.versions.find((v) => v.version === Number(restoreMatch[1]));
      if (target) {
        mockCardDocument.document = target.document;
        mockCardDocument.version += 1;
        mockCardDocument.updatedAtUtc = new Date().toISOString();
        mockCardDocument.versions.unshift({ version: mockCardDocument.version, createdAtUtc: mockCardDocument.updatedAtUtc, document: target.document });
      }
      return { document: mockCardDocument.document, version: mockCardDocument.version, updatedAtUtc: mockCardDocument.updatedAtUtc };
    }
  }

  if (path.match(/^\/api\/public\/invitations\/[^/]+\/rsvps$/) && method === "POST") {
    return { id: "rsvp-mock", ...readJsonBody(init), createdAtUtc: new Date().toISOString() };
  }

  if (path.match(/^\/api\/public\/invitations\/[^/]+\/wishes$/) && method === "POST") {
    return { id: "wish-mock", ...readJsonBody(init), likes: 0, createdAtUtc: new Date().toISOString() };
  }

  if (path.startsWith("/api/public/invitations/") && !path.includes("/wishes")) {
    return db.invitation; // For public view
  }

  // Guests
  if (path.match(/^\/api\/invitations\/[^/]+\/guests/)) {
    if (method === "GET") {
      return {
        items: [
          { id: "g-1", invitationId: "inv-1", fullName: "Nguyen Van A", phone: "0901234567", status: "ATTENDING", guestCount: 1 },
          { id: "g-2", invitationId: "inv-1", fullName: "Tran Thi B", phone: "0901234568", status: "Pending", guestCount: 1 }
        ],
        page: 1, pageSize: 50, totalCount: 2
      };
    }
  }

  // RSVP Statistics
  if (path.match(/^\/api\/invitations\/[^/]+\/rsvps\/statistics$/)) {
    return {
      totalGuests: 120,
      attending: 85,
      notATTENDING: 10,
      pending: 25
    };
  }
  
  // RSVP List
  if (path.match(/^\/api\/invitations\/[^/]+\/rsvps\?/) && method === "GET") {
    return {
      items: [
         { id: "r-1", invitationId: "inv-1", guestName: "Nguyen Van A", attending: true, guestCount: 1, message: "Wishing you two hundreds of years of happiness!", createdAtUtc: new Date().toISOString() }
      ],
      page: 1, pageSize: 50, totalCount: 1
    };
  }

  // Wishes
  if (path.includes("/wishes") && method === "GET") {
    return {
      items: [
        { id: "w-1", authorName: "Best friend", message: "Congratulate on your happiness!", emoji: "❤️", likes: 5, createdAtUtc: new Date().toISOString() }
      ],
      page: 1, pageSize: 50, totalCount: 1
    };
  }

  /* Admin Dashboard (Phase 8) — default mock user with ADMIN role for offline dev*/
  if (path === "/api/admin/stats" && method === "GET") {
    return {
      totalUsers: 128, totalInvitations: 245, publishedInvitations: 180,
      draftInvitations: 58, archivedInvitations: 7,
      totalGuests: 10450, totalRsvps: 6120, totalWishes: 3480,
    };
  }
  if (path.startsWith("/api/admin/users") && method === "GET") {
    return {
      items: [
        { id: "u-1", email: "admin@weddinginvitation.com", displayName: "Administrator", roles: ["OWNER", "Admin"], createdAtUtc: new Date().toISOString(), invitationCount: 2 },
        { id: "u-2", email: "demo@weddinginvitation.local", displayName: "Demo Studio", roles: ["OWNER"], createdAtUtc: new Date().toISOString(), invitationCount: 1 },
      ],
      page: 1, pageSize: 20, totalCount: 2,
    };
  }
  if (path.startsWith("/api/admin/invitations") && method === "GET") {
    return {
      items: [
        { id: "inv-1", groomName: "Minh Anh", brideName: "Thanh Ha", templateCode: "romantic", status: "Published", slug: "minh-anh-thanh-ha", ownerEmail: "demo@weddinginvitation.local", updatedAtUtc: new Date().toISOString() },
        { id: "inv-2", groomName: "Quoc Bao", brideName: "Hai Yen", templateCode: "luxury", status: "Draft", slug: null, ownerEmail: "admin@weddinginvitation.com", updatedAtUtc: new Date().toISOString() },
      ],
      page: 1, pageSize: 20, totalCount: 2,
    };
  }
  if (path === "/api/admin/billing/stats" && method === "GET") {
    return { activeFree: 82, activePro: 34, activeBusiness: 6, pastDue: 3, canceled: 9, paidInvoices: 52, revenueCents: 128_400 };
  }
  if (path.startsWith("/api/admin/billing/subscriptions") && method === "GET") {
    return {
      items: [
        { ownerUserId: "u-1", ownerEmail: "admin@weddinginvitation.com", planCode: "Business", status: "active", currentPeriodEndUtc: new Date(Date.now() + 15 * 86_400_000).toISOString(), cancelAtPeriodEnd: false, externalCustomerId: "cus_demo", externalSubscriptionId: "sub_demo" },
        { ownerUserId: "u-2", ownerEmail: "demo@weddinginvitation.local", planCode: "PRO", status: "PAST_DUE", currentPeriodEndUtc: new Date().toISOString(), cancelAtPeriodEnd: false, externalCustomerId: "cus_demo_2", externalSubscriptionId: "sub_demo_2" },
      ],
      page: 1, pageSize: 20, totalCount: 2,
    };
  }
  if (path === "/api/admin/analytics/summary" && method === "GET") {
    return { pageViews: 2480, qrScans: 420, wishes: 348, rsvps: 612, wishLikes: 910 };
  }
  {
    const adminAction = path.match(/^\/api\/admin\/invitations\/([^/]+)\/(archive|restore)$/);
    if (adminAction && method === "POST") {
      return {
        id: adminAction[1], groomName: "Minh Anh", brideName: "Thanh Ha", templateCode: "romantic",
        status: adminAction[2] === "archive" ? "Archived" : "Draft",
        slug: "minh-anh-thanh-ha", ownerEmail: "demo@weddinginvitation.local", updatedAtUtc: new Date().toISOString(),
      };
    }
  }

  // Fallback for unhandled routes
  console.warn(`[MOCK API] Unhandled route: ${method} ${path}`);
  return undefined;
}
