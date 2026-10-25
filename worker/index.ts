/// <reference types="@cloudflare/workers-types" />
interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ADMIN_KEY: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

async function hashIp(ip: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  return [...new Uint8Array(buf)].slice(0, 8).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const isAdmin = (req: Request, env: Env) =>
  !!env.ADMIN_KEY && req.headers.get("authorization") === `Bearer ${env.ADMIN_KEY}`;

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path === "/api/reviews" && req.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT id, name, event_type, rating, message, created_at FROM reviews WHERE approved = 1 ORDER BY created_at DESC LIMIT 100",
      ).all();
      return json(results);
    }

    if (path === "/api/reviews" && req.method === "POST") {
      let body: Record<string, unknown>;
      try {
        body = await req.json();
      } catch {
        return json({ error: "Invalid request" }, 400);
      }
      // Honeypot: real visitors never fill this hidden field.
      if (typeof body.website === "string" && body.website.trim()) return json({ ok: true });

      const name = String(body.name ?? "").trim().slice(0, 60);
      const eventType = String(body.eventType ?? "").trim().slice(0, 40);
      const message = String(body.message ?? "").trim().slice(0, 1000);
      const rating = Number(body.rating);
      if (!name || message.length < 10 || !Number.isInteger(rating) || rating < 1 || rating > 5) {
        return json({ error: "Please add your name, a rating, and a short review." }, 400);
      }

      const ipHash = await hashIp(req.headers.get("cf-connecting-ip") ?? "unknown");
      const recent = await env.DB.prepare(
        "SELECT COUNT(*) AS n FROM reviews WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')",
      ).bind(ipHash).first<{ n: number }>();
      if ((recent?.n ?? 0) >= 3) return json({ error: "Too many submissions. Please try again later." }, 429);

      await env.DB.prepare(
        "INSERT INTO reviews (name, event_type, rating, message, ip_hash) VALUES (?, ?, ?, ?, ?)",
      ).bind(name, eventType || null, rating, message, ipHash).run();
      return json({ ok: true }, 201);
    }

    if (path === "/api/admin/reviews" && req.method === "GET") {
      if (!isAdmin(req, env)) return json({ error: "Unauthorized" }, 401);
      const { results } = await env.DB.prepare(
        "SELECT id, name, event_type, rating, message, approved, created_at FROM reviews ORDER BY approved ASC, created_at DESC LIMIT 500",
      ).all();
      return json(results);
    }

    const m = path.match(/^\/api\/admin\/reviews\/(\d+)$/);
    if (m && (req.method === "POST" || req.method === "DELETE")) {
      if (!isAdmin(req, env)) return json({ error: "Unauthorized" }, 401);
      const id = Number(m[1]);
      if (req.method === "DELETE") {
        await env.DB.prepare("DELETE FROM reviews WHERE id = ?").bind(id).run();
      } else {
        const { approved } = (await req.json()) as { approved: boolean };
        await env.DB.prepare("UPDATE reviews SET approved = ? WHERE id = ?").bind(approved ? 1 : 0, id).run();
      }
      return json({ ok: true });
    }

    if (path.startsWith("/api/")) return json({ error: "Not found" }, 404);
    return env.ASSETS.fetch(req);
  },
};
