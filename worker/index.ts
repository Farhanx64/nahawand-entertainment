/// <reference types="@cloudflare/workers-types" />
interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ADMIN_KEY: string;
  // Optional email notification. Set up Email Sending, add a `send_email` binding named EMAIL and
  // NOTIFY_TO / NOTIFY_FROM vars in wrangler.jsonc to turn it on; inquiries are always saved to D1.
  EMAIL?: { send(message: { to: string; from: string; subject: string; text: string; replyTo?: string }): Promise<unknown> };
  NOTIFY_TO?: string;
  NOTIFY_FROM?: string;
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
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
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

    if (path === "/api/inquiries" && req.method === "POST") {
      let body: Record<string, unknown>;
      try {
        body = await req.json();
      } catch {
        return json({ error: "Invalid request" }, 400);
      }
      // Honeypot: real visitors never fill this hidden field.
      if (typeof body.website === "string" && body.website.trim()) return json({ ok: true });

      const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
      const name = clean(body.name, 80);
      const phone = clean(body.phone, 40);
      const email = clean(body.email, 120);
      const eventType = clean(body.eventType, 40);
      const eventDate = clean(body.eventDate, 60);
      const message = clean(body.message, 2000);
      const emailOk = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || (!phone && !email) || !emailOk) {
        return json({ error: "Please add your name and a phone number or email." }, 400);
      }

      const ipHash = await hashIp(req.headers.get("cf-connecting-ip") ?? "unknown");
      const recent = await env.DB.prepare(
        "SELECT COUNT(*) AS n FROM inquiries WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')",
      ).bind(ipHash).first<{ n: number }>();
      if ((recent?.n ?? 0) >= 5) return json({ error: "Too many submissions. Please try again later." }, 429);

      await env.DB.prepare(
        "INSERT INTO inquiries (name, phone, email, event_type, event_date, message, ip_hash) VALUES (?, ?, ?, ?, ?, ?, ?)",
      ).bind(name, phone || null, email || null, eventType || null, eventDate || null, message || null, ipHash).run();

      if (env.EMAIL && env.NOTIFY_TO && env.NOTIFY_FROM) {
        const text = [
          `Name: ${name}`,
          `Phone: ${phone || "-"}`,
          `Email: ${email || "-"}`,
          `Event type: ${eventType || "-"}`,
          `Event date: ${eventDate || "-"}`,
          "",
          message || "(no message)",
        ].join("\n");
        ctx.waitUntil(
          env.EMAIL.send({
            to: env.NOTIFY_TO,
            from: env.NOTIFY_FROM,
            subject: `New booking inquiry from ${name}`,
            text,
            ...(email ? { replyTo: email } : {}),
          }).catch(() => {}),
        );
      }
      return json({ ok: true }, 201);
    }

    if (path === "/api/admin/inquiries" && req.method === "GET") {
      if (!isAdmin(req, env)) return json({ error: "Unauthorized" }, 401);
      const { results } = await env.DB.prepare(
        "SELECT id, name, phone, email, event_type, event_date, message, handled, created_at FROM inquiries ORDER BY handled ASC, created_at DESC LIMIT 500",
      ).all();
      return json(results);
    }

    const q = path.match(/^\/api\/admin\/inquiries\/(\d+)$/);
    if (q && (req.method === "POST" || req.method === "DELETE")) {
      if (!isAdmin(req, env)) return json({ error: "Unauthorized" }, 401);
      const id = Number(q[1]);
      if (req.method === "DELETE") {
        await env.DB.prepare("DELETE FROM inquiries WHERE id = ?").bind(id).run();
      } else {
        const { handled } = (await req.json()) as { handled: boolean };
        await env.DB.prepare("UPDATE inquiries SET handled = ? WHERE id = ?").bind(handled ? 1 : 0, id).run();
      }
      return json({ ok: true });
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
