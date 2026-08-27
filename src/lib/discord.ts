export interface DiscordWebhookPayload {
  title?: string;
  name?: string;
  email?: string;
  phone?: string;
  message: string;
  source?: string;
  type?: "support" | "contact" | "order" | "feedback";
  metadata?: Record<string, string | number | boolean | null | undefined>;
}

// Fallback or environment webhook URL
const DISCORD_WEBHOOK_URL =
  import.meta.env.VITE_DISCORD_WEBHOOK_URL ||
  "https://discord.com/api/webhooks/1340200000000000000/demo-webhook-token";

export async function sendDiscordNotification(payload: DiscordWebhookPayload): Promise<boolean> {
  const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL;
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const title = payload.title || "💌 Tin nhắn mới từ khách hàng Mireia Studio";
  const color = payload.type === "order" ? 0x10b981 : payload.type === "contact" ? 0x3b82f6 : 0xf59e0b;

  const fields: Array<{ name: string; value: string; inline?: boolean }> = [
    {
      name: "👤 Khách hàng",
      value: payload.name || "Khách truy cập website",
      inline: true,
    },
  ];

  if (payload.phone || payload.email) {
    fields.push({
      name: "📞 Liên hệ",
      value: [payload.phone ? `SĐT: ${payload.phone}` : "", payload.email ? `Email: ${payload.email}` : ""]
        .filter(Boolean)
        .join(" | ") || "Chưa cung cấp",
      inline: true,
    });
  }

  if (payload.source || currentUrl) {
    fields.push({
      name: "📍 Trang gửi",
      value: payload.source || currentUrl,
      inline: false,
    });
  }

  fields.push({
    name: "💬 Nội dung tin nhắn",
    value: payload.message.trim() || "(Nội dung trống)",
    inline: false,
  });

  if (payload.metadata) {
    const metaList = Object.entries(payload.metadata)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `• **${k}**: ${v}`)
      .join("\n");
    if (metaList) {
      fields.push({
        name: "⚙️ Thông tin bổ sung",
        value: metaList,
        inline: false,
      });
    }
  }

  const embedBody = {
    username: "Mireia Studio Bot",
    avatar_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=128&q=80",
    embeds: [
      {
        title,
        color,
        fields,
        footer: {
          text: "Mireia Wedding Studio • Notification Engine",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    // Only attempt real POST if a valid non-demo webhook URL is set or in dev mode
    if (webhookUrl && !webhookUrl.includes("1340200000000000000")) {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embedBody),
      });
      return response.ok;
    } else {
      // In local dev / demo mode without webhook, log cleanly for developers
      console.log("[Discord Webhook Mock Sent]:", embedBody);
      return true;
    }
  } catch (error) {
    console.warn("[Discord Webhook Error]:", error);
    return false;
  }
}
