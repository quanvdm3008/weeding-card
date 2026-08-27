import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { getAuthToken } from "@/lib/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

/**
 * WebSocket URL to the backend's STOMP `/ws` endpoint.
 * - VITE_API_BASE_URL empty (same-origin, dev via Vite proxy / prod via nginx·Caddy): use current host.
 * - VITE_API_BASE_URL set private API domain: change http(s):// → ws(s)://.
 */
function buildBrokerUrl(): string {
  if (API_BASE_URL) {
    return API_BASE_URL.replace(/^http/, "ws") + "/ws";
  }
  const scheme = window.location.protocol === "https:" ? "wss" : "ws";
  return `${scheme}://${window.location.host}/ws`;
}

/**
 * Subscribe to 1 STOMP topic (Phase 10 — Realtime Layer, MASTER_ROADMAP.md §23). Just receive news
 * (server→client), no sending — all data writes are still via REST as before.
 *
 * WebSocket native (no SockJS: sockjs-client lib references Node's `global`, crashes immediately
 * import under Vite — caused the Builder page to blank; xhr-polling fallback for ancient browsers is redundant).
 *
 * Progressive enhancement: if WebSocket fails to connect (proxy blocking, network error), hook silently
 * no messages received — no throws, no UI breaks. The site still operates using the old behavior
 * (manual refetch/when mounting) because this hook only ADD data, not replace the main data source.
 *
 * If `topic` is `null`/`undefined`, it will not connect (used when the dependency id is not ready, e.g.
 * `publicSlug` has not finished loading).
 */
export function useRealtimeChannel<T>(topic: string | null | undefined, onMessage: (payload: T) => void) {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!topic) return;

    let client: Client | null = null;
    try {
      client = new Client({
        brokerURL: buildBrokerUrl(),
        connectHeaders: (() => {
          const token = getAuthToken();
          return token ? { Authorization: `Bearer ${token}` } : undefined;
        })(),
        reconnectDelay: 5000,
      });

      client.onConnect = () => {
        client?.subscribe(topic, (message) => {
          try {
            onMessageRef.current(JSON.parse(message.body) as T);
          } catch {
            // Ignore malformed payloads without breaking the UI.
          }
        });
      };

      client.activate();
    } catch {
      /* Environment without WebSocket/URL error — ignore, page continues without realtime.*/
      client = null;
    }

    return () => {
      void client?.deactivate();
    };
  }, [topic]);
}
