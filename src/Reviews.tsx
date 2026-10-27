import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Star, ArrowLeft, CheckCircle, Trash2 } from "lucide-react";
import { englishPath } from "./language.ts";
import { useLang, LangToggle } from "./i18n.tsx";

type Review = {
  id: number;
  name: string;
  event_type: string | null;
  rating: number;
  message: string;
  approved?: number;
  created_at: string;
};

const EVENT_TYPES = [
  { en: "Wedding", ar: "عرس" },
  { en: "Engagement", ar: "خطوبة" },
  { en: "Birthday", ar: "عيد ميلاد" },
  { en: "Corporate event", ar: "مناسبة للشركات" },
  { en: "Restaurant / cafe", ar: "مطعم / مقهى" },
  { en: "Private party", ar: "حفلة خاصة" },
  { en: "Other", ar: "أخرى" },
];

function Stars({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className={onChange ? "p-1" : "cursor-default"}
        >
          <Star className={`${onChange ? "w-8 h-8" : "w-4 h-4"} ${n <= value ? "fill-gold text-gold" : "text-zinc-600"}`} />
        </button>
      ))}
    </div>
  );
}

const inputCls =
  "w-full bg-zinc-950 border border-white/10 focus:border-gold outline-none px-4 py-3 text-sm text-white placeholder:text-zinc-500 transition-colors";

function Shell({ children }: { children: ReactNode }) {
  const { t, localizePath } = useLang();
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <a href={localizePath("/")} className="flex items-center gap-3 text-xs tracking-[0.2em] text-gold/80 hover:text-gold">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t({ en: "BACK TO SITE", ar: "العودة إلى الموقع" })}
        </a>
        <div className="flex items-center gap-4">
          <LangToggle />
          <img src="/logo.png" alt="Nahawand Entertainment" className="h-12" />
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-16">{children}</main>
    </div>
  );
}

function PublicReviews() {
  const { t, lang } = useLang();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => setReviews([]));
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!rating) return setError(t({ en: "Please choose a star rating.", ar: "اختر عدد النجوم لتقييم تجربتك." }));
    setStatus("sending");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, eventType, rating, message, website }),
      });
      if (!res.ok) throw new Error(((await res.json()) as { error?: string }).error || "Something went wrong.");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("idle");
    }
  };

  const avg = reviews && reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <Shell>
      <div className="text-center mb-14">
        <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4 block">{t({ en: "Kind Words", ar: "من آراء جمهورنا" })}</span>
        <h1 className="font-serif text-4xl md:text-5xl mb-4">{t({ en: "Reviews", ar: "التقييمات" })}</h1>
        <div className="h-px w-24 gold-gradient mx-auto mb-5" />
        {avg > 0 && (
          <div className="flex items-center justify-center gap-3 text-sm text-zinc-300">
            <Stars value={Math.round(avg)} />
            <span>{avg.toFixed(1)} · {lang === "ar" ? `عدد التقييمات: ${reviews!.length}` : `${reviews!.length} review${reviews!.length > 1 ? "s" : ""}`}</span>
          </div>
        )}
      </div>

      <section className="border border-gold/20 bg-zinc-950 p-6 md:p-8 mb-16">
        {status === "done" ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-gold mx-auto mb-4" />
            <h2 className="font-serif text-2xl mb-2">{t({ en: "Thank you!", ar: "شكرًا لمشاركتك!" })}</h2>
            <p className="text-zinc-400 text-sm">{t({ en: "Your review was received and will appear once it has been approved.", ar: "وصلنا تقييمك، وسيُنشر بعد مراجعته والموافقة عليه." })}</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <h2 className="font-serif text-2xl">{t({ en: "Share your experience", ar: "شاركنا تجربتك" })}</h2>
            <div>
              <p className="text-xs tracking-[0.2em] text-zinc-400 mb-2">{t({ en: "YOUR RATING", ar: "تقييمك" })}</p>
              <Stars value={rating} onChange={setRating} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className={inputCls} placeholder={t({ en: "Your name", ar: "اسمك" })} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required />
              <select className={inputCls} value={eventType} onChange={(e) => setEventType(e.target.value)}>
                <option value="">{t({ en: "Event type (optional)", ar: "نوع المناسبة (اختياري)" })}</option>
                {EVENT_TYPES.map((e) => (
                  <option key={e.en} value={e.en}>{t(e)}</option>
                ))}
              </select>
            </div>
            <textarea
              className={`${inputCls} min-h-[140px]`}
              placeholder={t({ en: "Tell us how the performance was…", ar: "كيف كانت تجربتك معنا؟" })}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              minLength={10}
              maxLength={1000}
              required
            />
            {/* Honeypot: hidden from people, filled by bots */}
            <input
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              disabled={status === "sending"}
              className="w-full py-4 bg-gold text-black font-semibold tracking-[0.2em] text-sm hover:bg-gold-light transition-colors disabled:opacity-60"
            >
              {status === "sending" ? t({ en: "SENDING…", ar: "جارٍ الإرسال…" }) : t({ en: "SUBMIT REVIEW", ar: "إرسال التقييم" })}
            </button>
          </form>
        )}
      </section>

      <p className="text-center text-sm text-zinc-400 -mt-8 mb-12">
        {t({ en: "Prefer Google?", ar: "تفضّل Google؟" })}{" "}
        <a
          href="https://g.page/r/CeOGM30lYYpuECE/review"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold hover:text-gold-light underline underline-offset-4"
        >
          {t({ en: "Leave a review on Google", ar: "قيّمنا على Google" })}
        </a>
      </p>

      <section className="space-y-5">
        {reviews === null ? (
          <p className="text-center text-zinc-500 text-sm">{t({ en: "Loading…", ar: "جارٍ التحميل…" })}</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-zinc-500 text-sm">{t({ en: "No reviews yet — be the first to leave one.", ar: "لم تصلنا تقييمات بعد. شاركنا تجربتك وكن أول من يقيّمنا." })}</p>
        ) : (
          reviews.map((r) => (
            <article key={r.id} className="border border-white/5 bg-zinc-950 p-6">
              <div className="flex items-center justify-between mb-3">
                <Stars value={r.rating} />
                <span className="text-[10px] tracking-[0.2em] text-zinc-500">{r.created_at.slice(0, 10)}</span>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{r.message}</p>
              <p className="mt-4 text-sm">
                <span className="text-gold font-serif">{r.name}</span>
                {r.event_type && <span className="text-zinc-500"> · {r.event_type}</span>}
              </p>
            </article>
          ))
        )}
      </section>
    </Shell>
  );
}

type Inquiry = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  event_type: string | null;
  event_date: string | null;
  message: string | null;
  handled: number;
  created_at: string;
};

function Admin() {
  const [key, setKey] = useState(() => {
    try { return sessionStorage.getItem("adminKey") || ""; } catch { return ""; }
  });
  const [input, setInput] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [tab, setTab] = useState<"inquiries" | "reviews">("inquiries");
  const [error, setError] = useState("");

  const headers = { authorization: `Bearer ${key}` };

  const load = async () => {
    const res = await fetch("/api/admin/reviews", { headers });
    if (!res.ok) {
      setError("Wrong admin key.");
      setKey("");
      try { sessionStorage.removeItem("adminKey"); } catch { /* ignore */ }
      return;
    }
    setError("");
    setReviews(await res.json());
    const inq = await fetch("/api/admin/inquiries", { headers });
    if (inq.ok) setInquiries(await inq.json());
  };

  useEffect(() => {
    if (key) load();
  }, [key]);

  const act = async (id: number, approved?: boolean) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: approved === undefined ? "DELETE" : "POST",
      headers: { ...headers, "content-type": "application/json" },
      body: approved === undefined ? undefined : JSON.stringify({ approved }),
    });
    load();
  };

  const actInquiry = async (id: number, handled?: boolean) => {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: handled === undefined ? "DELETE" : "POST",
      headers: { ...headers, "content-type": "application/json" },
      body: handled === undefined ? undefined : JSON.stringify({ handled }),
    });
    load();
  };

  if (!key) {
    return (
      <Shell>
        <form
          className="max-w-sm mx-auto space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            try { sessionStorage.setItem("adminKey", input); } catch { /* ignore */ }
            setKey(input);
          }}
        >
          <h1 className="font-serif text-3xl text-center mb-6">Admin</h1>
          <input type="password" className={inputCls} placeholder="Admin key" value={input} onChange={(e) => setInput(e.target.value)} />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button className="w-full py-3 bg-gold text-black font-semibold tracking-[0.2em] text-sm">SIGN IN</button>
        </form>
      </Shell>
    );
  }

  const newInquiries = inquiries.filter((q) => !q.handled).length;
  const pendingReviews = reviews.filter((r) => !r.approved).length;
  const tabCls = (active: boolean) =>
    `px-4 py-2 text-xs tracking-[0.2em] border transition-colors ${active ? "border-gold bg-gold text-black" : "border-white/10 text-zinc-400 hover:text-gold"}`;

  return (
    <Shell>
      <h1 className="font-serif text-3xl mb-6">Admin</h1>
      <div className="flex gap-3 mb-8">
        <button onClick={() => setTab("inquiries")} className={tabCls(tab === "inquiries")}>
          INQUIRIES{newInquiries > 0 && ` (${newInquiries} NEW)`}
        </button>
        <button onClick={() => setTab("reviews")} className={tabCls(tab === "reviews")}>
          REVIEWS{pendingReviews > 0 && ` (${pendingReviews} PENDING)`}
        </button>
      </div>

      {tab === "inquiries" ? (
        <div className="space-y-4">
          {inquiries.length === 0 && <p className="text-zinc-500 text-sm">No inquiries yet.</p>}
          {inquiries.map((q) => (
            <article key={q.id} className={`border p-5 ${q.handled ? "border-white/10" : "border-gold/30"} bg-zinc-950`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-serif text-xl text-gold">{q.name}</h2>
                <span className={`text-[10px] tracking-[0.2em] ${q.handled ? "text-zinc-500" : "text-gold"}`}>
                  {q.handled ? "HANDLED" : "NEW"} · {q.created_at.slice(0, 16).replace("T", " ")}
                </span>
              </div>
              <div className="text-sm text-zinc-300 space-y-1 mb-3">
                {q.phone && <p>Phone: <a href={`tel:${q.phone}`} className="text-gold hover:underline">{q.phone}</a></p>}
                {q.email && <p>Email: <a href={`mailto:${q.email}`} className="text-gold hover:underline">{q.email}</a></p>}
                {q.event_type && <p>Event: {q.event_type}</p>}
                {q.event_date && <p>Date: {q.event_date}</p>}
              </div>
              {q.message && <p className="text-zinc-400 text-sm whitespace-pre-line">{q.message}</p>}
              <div className="flex gap-3 mt-4">
                <button onClick={() => actInquiry(q.id, !q.handled)} className="px-4 py-2 text-xs tracking-[0.2em] border border-gold text-gold hover:bg-gold hover:text-black transition-colors">
                  {q.handled ? "MARK AS NEW" : "MARK AS HANDLED"}
                </button>
                <button onClick={() => confirm("Delete this inquiry?") && actInquiry(q.id)} className="px-3 py-2 text-zinc-500 hover:text-red-400" aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.length === 0 && <p className="text-zinc-500 text-sm">No reviews submitted yet.</p>}
          {reviews.map((r) => (
            <article key={r.id} className={`border p-5 ${r.approved ? "border-gold/30" : "border-white/10"} bg-zinc-950`}>
              <div className="flex items-center justify-between mb-2">
                <Stars value={r.rating} />
                <span className={`text-[10px] tracking-[0.2em] ${r.approved ? "text-gold" : "text-zinc-500"}`}>
                  {r.approved ? "PUBLISHED" : "PENDING"} · {r.created_at.slice(0, 10)}
                </span>
              </div>
              <p className="text-zinc-300 text-sm whitespace-pre-line">{r.message}</p>
              <p className="mt-3 text-sm text-gold">{r.name}{r.event_type && <span className="text-zinc-500"> · {r.event_type}</span>}</p>
              <div className="flex gap-3 mt-4">
                <button onClick={() => act(r.id, !r.approved)} className="px-4 py-2 text-xs tracking-[0.2em] border border-gold text-gold hover:bg-gold hover:text-black transition-colors">
                  {r.approved ? "UNPUBLISH" : "APPROVE"}
                </button>
                <button onClick={() => confirm("Delete this review?") && act(r.id)} className="px-3 py-2 text-zinc-500 hover:text-red-400" aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </Shell>
  );
}

export default function Reviews() {
  return englishPath(window.location.pathname).startsWith("/reviews/admin") ? <Admin /> : <PublicReviews />;
}
