import React from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Music, Calendar, Phone, Instagram, Mail, Drum, Guitar, Wind, Piano, Speaker, Star, Crown, MapPin, ChevronDown, Quote, Menu, X, CheckCircle, Mic } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLang, LangToggle, type L } from "./i18n.tsx";

const INSTAGRAM_POSTS = [
  { href: "https://www.instagram.com/layalicafe.ri/reel/Deb6EL9CMZn/", code: "Deb6EL9CMZn", reel: true, caption: "This Friday — it's going down at Layali Cafe! Syrian vibes, halal food, great people." },
  { href: "https://www.instagram.com/nahawand_.entertainment/p/Dd3sm9HRhNQ/", code: "Dd3sm9HRhNQ", reel: false, caption: "Honestly just can't wait for the crispy shawrma 🔥🕺" },
  { href: "https://www.instagram.com/layalicafe.ri/reel/DaNrqc5AF7Z/", code: "DaNrqc5AF7Z", reel: true, caption: "Summer starts at Layali — July 3rd! Live music, premium hookah and a brand new menu." },
  { href: "https://www.instagram.com/nahawand_.entertainment/p/DZ7m9BURTY6/", code: "DZ7m9BURTY6", reel: false, caption: "Come enjoy Mediterranean soul touching vibes at Layali Cafe, July 3rd Friday night 🔥" },
  { href: "https://www.instagram.com/nahawand_.entertainment/p/DXj9R9DDQfW/", code: "DXj9R9DDQfW", reel: false, caption: "Live at Kaza Maza ✨ Friday, April 24th, 8PM — Middle Eastern vibes, great food, live music all night." },
];

function PostCard({ p }: { p: (typeof INSTAGRAM_POSTS)[number] }) {
  const [broken, setBroken] = useState(false);
  const { t, dir } = useLang();
  return (
    <a
      dir={dir}
      href={p.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group shrink-0 w-[240px] md:w-[280px] bg-zinc-950 border border-gold/20 hover:border-gold/60 transition-colors overflow-hidden"
    >
      <div className="relative aspect-[4/5] bg-black flex items-center justify-center">
        {broken ? (
          <img src="/logo.png" alt="" className="w-24 opacity-60" />
        ) : (
          <img
            src={`/posts/${p.code}.jpg`}
            alt={p.caption}
            loading="lazy"
            onError={() => setBroken(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        {p.reel && (
          <span className="absolute top-3 right-3 text-[9px] tracking-[0.25em] text-gold border border-gold/50 bg-black/60 px-2 py-1">{t({ en: "REEL", ar: "ريلز" })}</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">{p.caption}</p>
        <span className="mt-3 inline-flex items-center gap-2 text-[10px] tracking-[0.25em] text-gold/70">
          <Instagram className="w-3 h-3" /> {t({ en: "VIEW ON INSTAGRAM", ar: "شاهد على إنستغرام" })}
        </span>
      </div>
    </a>
  );
}

function AutoScroller({ children, minItems = 6 }: { children: React.ReactNode[]; minItems?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  useEffect(() => {
    let raf = 0;
    let pos = ref.current?.scrollLeft ?? 0;
    const tick = () => {
      const el = ref.current;
      if (el && !paused.current) {
        // iOS Safari truncates fractional scrollLeft, so keep the position in our own float
        // and re-sync if the user scrolled by hand since the last frame.
        if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft;
        pos += 0.6;
        if (pos >= el.scrollWidth / 2) pos -= el.scrollWidth / 2;
        el.scrollLeft = pos;
      } else if (el) {
        pos = el.scrollLeft;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const hold = () => { paused.current = true; };
  const release = () => { window.setTimeout(() => { paused.current = false; }, 1500); };
  // Repeat short lists so one half is always wider than the screen, then double it for a seamless loop.
  const half: React.ReactNode[] = [];
  while (half.length < minItems && children.length) half.push(...children);
  return (
    <div
      ref={ref}
      onMouseEnter={hold}
      onMouseLeave={release}
      onTouchStart={hold}
      onTouchEnd={release}
      dir="ltr"
      className="flex gap-4 overflow-x-auto scrollbar-none -mx-6 px-6"
    >
      {[...half, ...half].map((c, i) => (
        <React.Fragment key={i}>{c}</React.Fragment>
      ))}
    </div>
  );
}

function PostCarousel() {
  return (
    <AutoScroller minItems={INSTAGRAM_POSTS.length}>
      {INSTAGRAM_POSTS.map((p) => (
        <React.Fragment key={p.code}><PostCard p={p} /></React.Fragment>
      ))}
    </AutoScroller>
  );
}

type ApprovedReview = { id: number; name: string; event_type: string | null; rating: number; message: string };

function ReviewCarousel() {
  const { t, dir } = useLang();
  const [reviews, setReviews] = useState<ApprovedReview[] | null>(null);
  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => setReviews([]));
  }, []);

  if (reviews && reviews.length === 0) {
    return <p className="text-center text-zinc-500 text-sm">{t({ en: "Reviews are coming soon.", ar: "آراء جمهورنا قريبًا." })}</p>;
  }
  if (!reviews) return null;
  return (
    <AutoScroller minItems={6}>
      {reviews.map((r) => (
        <div
          key={r.id}
          dir={dir}
          className="group shrink-0 w-[280px] md:w-[340px] p-8 border border-white/5 bg-zinc-950 hover:border-gold/20 transition-all"
        >
          <Quote className="w-8 h-8 text-gold/20 mb-4 group-hover:text-gold/40 transition-colors" />
          <p className="review-scroll text-zinc-400 text-sm leading-relaxed mb-6 italic max-h-40 overflow-y-auto overscroll-contain pr-2">"{r.message}"</p>
          <div className="flex gap-1 mb-4">
            {[...Array(r.rating)].map((_, s) => (
              <Star key={s} className="w-3.5 h-3.5 text-gold fill-gold" />
            ))}
          </div>
          <div className="border-t border-white/5 pt-4">
            <p className="text-sm font-semibold">{r.name}</p>
            {r.event_type && <p className="text-[10px] text-zinc-500 tracking-widest uppercase mt-1">{r.event_type}</p>}
          </div>
        </div>
      ))}
    </AutoScroller>
  );
}


const NAV_LINKS: { href: string; label: L; cta?: boolean }[] = [
  { href: "#about", label: { en: "ABOUT", ar: "من نحن" } },
  { href: "#services", label: { en: "SERVICES", ar: "خدماتنا" } },
  { href: "#gallery", label: { en: "GALLERY", ar: "صور وفيديو" } },
  { href: "/reviews", label: { en: "REVIEWS", ar: "التقييمات" } },
  { href: "#contact", label: { en: "BOOK NOW", ar: "احجز الآن" }, cta: true },
];

const BAND: { title: L; icon: React.ReactNode; members: L[] }[] = [
  {
    title: { en: "Org", ar: "أورغ" },
    icon: <Piano className="w-9 h-9" />,
    members: [{ en: "Yamaha PSR-A5000", ar: "Yamaha PSR-A5000" }, { en: "Korg V3", ar: "Korg V3" }],
  },
  {
    title: { en: "Percussion", ar: "إيقاعات" },
    icon: <Drum className="w-9 h-9" />,
    members: [
      { en: "Darbuka", ar: "دربكة" },
      { en: "Tabl", ar: "طبل" },
      { en: "Katem", ar: "كاتم" },
      { en: "Riq", ar: "رق" },
    ],
  },
  {
    title: { en: "Strings", ar: "آلات وترية" },
    icon: <Guitar className="w-9 h-9" />,
    members: [{ en: "Buzuk", ar: "بزق" }, { en: "Oud", ar: "عود" }, { en: "Kanun", ar: "قانون" }],
  },
  {
    title: { en: "Wind", ar: "آلات نفخ" },
    icon: <Wind className="w-9 h-9" />,
    members: [{ en: "Nay", ar: "ناي" }],
  },
  {
    title: { en: "Vocals", ar: "غناء" },
    icon: <Mic className="w-9 h-9" />,
    members: [{ en: "Singers", ar: "مطربون" }],
  },
  {
    title: { en: "Sound", ar: "تجهيزات صوتية" },
    icon: <Speaker className="w-9 h-9" />,
    members: [{ en: "PA Professional Sound System", ar: "نظام صوتي احترافي" }],
  },
];

const SERVICES: { title: L; icon: React.ReactNode; desc: L; features: L[]; href?: string }[] = [
  {
    title: { en: "Weddings", ar: "أعراس" },
    icon: <Crown className="w-10 h-10" />,
    desc: {
      en: "From the entrance zaffa to the last dance — a full evening of live oriental music tailored to your wedding vision.",
      ar: "من زفّة العروسين حتى آخر رقصة، نرافق فرحتكم بموسيقى شرقية حيّة وأغانٍ تختارونها لليلتكم.",
    },
    features: [
      { en: "Live zaffa performance", ar: "زفّة بموسيقى حيّة" },
      { en: "Customised song list", ar: "أغانٍ من اختياركم" },
      { en: "Full-night sets", ar: "موسيقى طوال السهرة" },
    ],
    href: "/weddings/",
  },
  {
    title: { en: "Celebrations", ar: "احتفالات" },
    icon: <Music className="w-10 h-10" />,
    desc: {
      en: "Engagement parties, graduation ceremonies, and family gatherings elevated with authentic oriental atmosphere.",
      ar: "نشارككم فرحة الخطوبة والتخرّج واللّمات العائلية بموسيقى شرقية وأجواء تليق بالمناسبة.",
    },
    features: [
      { en: "Engagement parties", ar: "حفلات خطوبة" },
      { en: "Graduation events", ar: "حفلات تخرج" },
      { en: "Family gatherings", ar: "لقاءات عائلية" },
    ],
  },
  {
    title: { en: "Private Events", ar: "حفلات خاصة" },
    icon: <Calendar className="w-10 h-10" />,
    desc: {
      en: "Intimate live oriental music for private gatherings, house parties, and special occasions.",
      ar: "من جلسة الأصدقاء إلى حفلة البيت، نختار لكم موسيقى شرقية حيّة تناسب أجواءكم.",
    },
    features: [
      { en: "Private gatherings", ar: "جلسات خاصة" },
      { en: "House parties", ar: "حفلات منزلية" },
      { en: "Birthday celebrations", ar: "أعياد ميلاد" },
    ],
  },
];

const WHY_ITEMS: { label: L; desc: L }[] = [
  {
    label: { en: "PSR-A5000 & Korg V3 setups", ar: "أورغ PSR-A5000 وKorg V3" },
    desc: { en: "Professional-grade instruments for crystal-clear live sound.", ar: "آلات احترافية تمنحكم صوتًا نقيًا وواضحًا في الحفل." },
  },
  {
    label: { en: "Custom repertoire", ar: "أغانٍ على ذوقكم" },
    desc: {
      en: "Send us your favorite songs and we'll make a customized setlist to your liking.",
      ar: "شاركونا أغانيكم المفضّلة، لنحضّر برنامجًا موسيقيًا يناسب ذوقكم.",
    },
  },
  {
    label: { en: "Sound system included", ar: "التجهيزات الصوتية مشمولة" },
    desc: {
      en: "Premium PA system available for venues without in-house audio.",
      ar: "نوفّر نظامًا صوتيًا احترافيًا للقاعات غير المجهّزة بالصوت.",
    },
  },
];

export function NavBar() {
  const { t, localizePath } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    if (id.startsWith("/")) {
      window.location.href = localizePath(id);
      return;
    }
    if (window.location.pathname !== localizePath("/")) {
      window.location.href = localizePath(`/${id}`);
      return;
    }
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-black/95 backdrop-blur-md shadow-lg shadow-gold/5" : "bg-transparent"
      } border-b border-white/5`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button onClick={() => scrollTo("#hero")} className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Nahawand Logo"
            className="h-14 w-auto drop-shadow-[0_0_12px_rgba(212,175,55,0.5)] group-hover:drop-shadow-[0_0_22px_rgba(212,175,55,0.8)] transition-all duration-500"
          />
          <div className="hidden sm:flex flex-col">
            <span className="font-serif text-xl gold-text tracking-widest leading-none">{t({ en: "NAHAWAND", ar: "نهاوند" })}</span>
            <span className="text-[8px] text-gold/60 tracking-[0.4em]">{t({ en: "ENTERTAINMENT", ar: "للموسيقى والحفلات" })}</span>
          </div>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm tracking-[0.2em]">
          {NAV_LINKS.map((l) =>
            l.cta ? (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="px-6 py-2.5 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 font-semibold"
              >
                {t(l.label)}
              </button>
            ) : (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-zinc-300 hover:text-gold transition-colors font-light"
              >
                {t(l.label)}
              </button>
            )
          )}
          <LangToggle />
        </div>

        {/* Mobile: language toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <LangToggle />
          <button onClick={() => setOpen(!open)} className="text-gold p-2" aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/98 border-t border-gold/10 overflow-hidden"
          >
            <div className="flex flex-col py-6 px-6 gap-5">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.href}
                  onClick={() => scrollTo(l.href)}
                  className={`text-start text-sm tracking-[0.2em] py-2 transition-colors ${
                    l.cta ? "text-gold border-b border-gold/30" : "text-zinc-300 hover:text-gold"
                  }`}
                >
                  {t(l.label)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function Footer() {
  const { t, localizePath } = useLang();
  return (
      <footer className="relative py-16 px-6 border-t border-white/5 text-center bg-black">
        <img
          src="/logo.png"
          alt="Nahawand Entertainment"
          className="w-24 mx-auto mb-6 opacity-50 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-500"
        />
        <p className="font-serif text-xl gold-text mb-1">{t({ en: "NAHAWAND", ar: "نهاوند" })}</p>
        <p className="text-[9px] text-zinc-600 tracking-[0.4em] uppercase mb-8">{t({ en: "ENTERTAINMENT", ar: "للموسيقى والحفلات" })}</p>

        <div className="flex justify-center gap-6 mb-8">
          {[
            { icon: <Instagram className="w-4 h-4" />, href: "https://www.instagram.com/nahawand_.entertainment/" },
          ].map((s, i) => (
            <a
              key={i}
              href={localizePath(s.href)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-white/10 hover:border-gold hover:text-gold flex items-center justify-center text-zinc-500 transition-all rounded-sm"
            >
              {s.icon}
            </a>
          ))}
        </div>

        <nav aria-label="Footer" className="flex justify-center gap-6 mb-8 text-[10px] tracking-[0.25em] uppercase text-zinc-500">
          <a href={localizePath("/weddings/")} className="hover:text-gold transition-colors">{t({ en: "Weddings", ar: "الأعراس" })}</a>
          <a href={localizePath("/areas/worcester/")} className="hover:text-gold transition-colors">{t({ en: "Worcester", ar: "وستر" })}</a>
          <a href={localizePath("/areas/boston/")} className="hover:text-gold transition-colors">{t({ en: "Boston", ar: "بوسطن" })}</a>
          <a href={localizePath("/reviews/")} className="hover:text-gold transition-colors">{t({ en: "Reviews", ar: "التقييمات" })}</a>
        </nav>

        <div className="h-px w-32 gold-gradient mx-auto mb-8 opacity-30" />

        <p className="text-[10px] text-zinc-700 tracking-[0.35em] uppercase">
          {t({ en: "© 2026 Nahawand Entertainment", ar: "© 2026 نهاوند للموسيقى والحفلات" })} &nbsp;·&nbsp; {t({ en: "Authenticity in Every Note", ar: "أصالة في كل نغمة" })}
        </p>
        <p className="text-[10px] text-zinc-600 tracking-[0.2em] uppercase mt-3">
          <a
            href="https://www.instagram.com/jbpasto/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
          >
            Made w Joy by Farhan Ü
          </a>
        </p>
      </footer>
  );
}

type InquiryForm = { name: string; phone: string; email: string; eventDate: string; eventType: string; message: string; website: string };
const EMPTY_FORM: InquiryForm = { name: "", phone: "", email: "", eventDate: "", eventType: "", message: "", website: "" };

export default function App() {
  const { t, lang, dir, localizePath } = useLang();
  const [form, setForm] = useState<InquiryForm>(EMPTY_FORM);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "done">("idle");
  const [formError, setFormError] = useState("");
  const setField = (k: keyof InquiryForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const submitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim() || (!form.phone.trim() && !form.email.trim())) {
      setFormError(t({ en: "Please add your name and a phone number or email.", ar: "الرجاء إدخال الاسم ورقم الهاتف أو البريد الإلكتروني." }));
      return;
    }
    setFormStatus("sending");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(res.status === 429 ? "rate" : "fail");
      setForm(EMPTY_FORM);
      setFormStatus("done");
    } catch (err) {
      setFormStatus("idle");
      setFormError(
        err instanceof Error && err.message === "rate"
          ? t({ en: "Too many requests. Please try again later or call us.", ar: "عدد الطلبات كبير. حاولوا لاحقاً أو اتصلوا بنا." })
          : t({ en: "Something went wrong. Please try again or call us.", ar: "حدث خطأ. حاولوا مرة أخرى أو اتصلوا بنا." }),
      );
    }
  };
  const [ratings, setRatings] = useState<number[]>([]);
  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((rs: { rating: number }[]) => setRatings(rs.map((r) => r.rating)))
      .catch(() => {});
  }, []);
  const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  // Track scroll against the hero itself: page-wide progress shifts whenever the page height changes
  // (reviews loading, sliders), which makes the hero jump.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden font-sans selection:bg-gold selection:text-black">
      <NavBar />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section id="hero" ref={heroRef} className="relative h-[100svh] flex items-center justify-center overflow-hidden">
        {/* Artist photo as background */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/hero.jpg"
            alt="Nahawand performing live"
            className="w-full h-full object-cover object-[50%_25%]"
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 z-10" />

        <motion.div
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="relative z-20 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.img
            src="/logo.png"
            alt="Nahawand Entertainment"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="w-52 md:w-72 mx-auto mb-10 drop-shadow-[0_0_40px_rgba(212,175,55,0.5)]"
          />

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-5 tracking-tight leading-tight text-center">
            <span className="sr-only">{t({ en: "Nahawand Entertainment — Live Arabic music for weddings in New England. ", ar: "فرقة موسيقية عربية للأعراس والحفلات في نيو إنجلاند. " })}</span>
            {lang === "ar" ? (
              <>ألحان <span className="gold-text">شرقية</span></>
            ) : (
              <><span className="gold-text italic">Oriental</span> Melodies</>
            )}
          </h1>

          <p className="text-zinc-300 text-base md:text-xl font-light mb-2 tracking-[0.25em] uppercase">
            {t({ en: "Weddings · Celebrations · Private Events", ar: "أعراس · احتفالات · حفلات خاصة" })}
          </p>
          {lang === "en" ? (
            <p className="text-gold/70 font-arabic text-xl mb-10 tracking-wide">
              أفراح · أعراس · حفلات
            </p>
          ) : (
            <div className="mb-10" />
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-10 py-4 bg-gold text-black font-bold tracking-[0.25em] text-sm shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] transition-shadow"
            >
              {t({ en: "BOOK PERFORMANCE", ar: "احجز حفلتك" })}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="px-10 py-4 border border-white/30 text-white hover:border-gold hover:text-gold transition-colors text-sm tracking-[0.25em]"
            >
              {t({ en: "DISCOVER MORE", ar: "اكتشف المزيد" })}
            </motion.button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 z-20 text-gold/50 hover:text-gold transition-colors flex flex-col items-center gap-2"
        >
          <span className="text-[9px] tracking-[0.4em] uppercase">{t({ en: "Scroll", ar: "تابع للأسفل" })}</span>
          <ChevronDown className="w-5 h-5" />
        </motion.button>
      </section>

      <main className="relative z-20 bg-black">

        {/* ── ABOUT ─────────────────────────────────────────────────── */}
        <section id="about" className="pt-10 pb-20 md:pt-16 md:pb-28 px-6">
          <div className="max-w-3xl mx-auto">
            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px 250px 0px" }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <p className="text-zinc-400 text-base leading-relaxed text-center max-w-2xl mx-auto mb-10">
                {t({
                  en: "Nahawand Entertainment is a live Arabic and oriental music band for weddings, engagement parties and private celebrations. We bring zaffa entrances, dinner music and full dance-floor sets to Worcester, Boston and across New England. Contact us with your location and date.", ar: "نهاوند فرقة موسيقية عربية للأعراس والخطوبة والحفلات الخاصة. من زفّة العروسين إلى موسيقى العشاء وأجواء الرقص، نختار معكم برنامجًا يناسب فرحتكم. لمناسباتكم في وستر وبوسطن ونيو إنجلاند، تواصلوا معنا مع ذكر المكان والتاريخ.",
                })}
              </p>
              <div className="grid grid-cols-3 gap-6 mb-4 py-8 border-y border-white/5 text-center">
                {[
                  { val: "5+", label: t({ en: "Years Experience", ar: "سنوات من الخبرة" }) },
                  { val: "200+", label: t({ en: "Events Performed", ar: "حفل أحييناه" }) },
                  ...(avgRating
                    ? [{
                        val: `${avgRating.toFixed(1)}★`,
                        label: t({ en: `Average Rating · ${ratings.length} Reviews`, ar: `متوسط التقييم · عدد الآراء: ${ratings.length}` }),
                      }]
                    : []),
                ].map((s) => (
                  <div key={s.label}>
                    <h4 className="text-gold font-bold text-3xl mb-1 font-serif">{s.val}</h4>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── BAND ──────────────────────────────────────────────────── */}
        <section id="band" className="pb-20 md:pb-28 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px 250px 0px" }}
              className="text-center mb-14"
            >
              <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4 block">{t({ en: "Build Your Lineup", ar: "اختاروا فرقتكم" })}</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-4">{t({ en: "The Band", ar: "الفرقة" })}</h2>
              <div className="h-px w-24 gold-gradient mx-auto mb-6" />
              <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
                {t({ en: "Solo, duo, or a full live band — a lineup that fits your event and space.", ar: "من عازف واحد أو ثنائي إلى فرقة كاملة، نختار معكم ما يناسب مناسبتكم ومساحة المكان." })}
              </p>
            </motion.div>

            <AutoScroller minItems={BAND.length}>
              {BAND.map((g) => (
                <div
                  key={g.title.en}
                  dir={dir}
                  className="shrink-0 w-[220px] p-6 border border-white/5 bg-zinc-950 hover:border-gold/30 transition-colors"
                >
                  <div className="text-gold mb-4">{g.icon}</div>
                  <h3 className="font-serif text-xl mb-1">{lang === "ar" ? g.title.ar : g.title.en}</h3>
                  <p className="text-gold/60 text-sm mb-4">{lang === "ar" ? g.title.en : g.title.ar}</p>
                  <ul className="space-y-2">
                    {g.members.map((m) => (
                      <li key={m.en} className="flex items-center gap-3 text-sm text-zinc-300">
                        <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                        {t(m)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </AutoScroller>

            <p className="text-center mt-10 text-sm text-zinc-500">
              {t({ en: "Tell us about your event in the booking form and we'll put together the right lineup.", ar: "شاركونا تفاصيل مناسبتكم في نموذج الحجز، لنختار معكم الفرقة المناسبة." })}
            </p>
          </div>
        </section>

        {/* ── SERVICES ──────────────────────────────────────────────── */}
        <section id="services" className="py-28 md:py-36 bg-zinc-950 px-6 border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4 block">{t({ en: "What We Offer", ar: "ما نقدّمه لكم" })}</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-4">{t({ en: "Our Services", ar: "خدماتنا" })}</h2>
              <div className="h-px w-24 gold-gradient mx-auto" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {SERVICES.map((s, i) => (
                <div
                  key={i}
                  className="group p-10 border border-white/5 bg-black hover:border-gold/30 transition-all duration-500 relative overflow-hidden"
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-gold/10 group-hover:border-t-gold/25 transition-colors" />

                  <div className="text-gold mb-6 transition-transform duration-500 group-hover:scale-110">
                    {s.icon}
                  </div>
                  <h3 className="font-serif text-2xl mb-1">{lang === "ar" ? s.title.ar : s.title.en}</h3>
                  <p className="text-gold/60 font-arabic text-lg mb-4">{lang === "ar" ? s.title.en : s.title.ar}</p>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">{t(s.desc)}</p>
                  <ul className="space-y-2">
                    {s.features.map((f) => (
                      <li key={f.en} className="flex items-center gap-2 text-xs text-zinc-400 tracking-wide">
                        <CheckCircle className="w-3.5 h-3.5 text-gold/60 shrink-0" />
                        {t(f)}
                      </li>
                    ))}
                  </ul>
                  {s.href && (
                    <a
                      href={localizePath(s.href)}
                      className="mt-6 inline-block text-[11px] tracking-[0.25em] uppercase text-gold/70 hover:text-gold border-b border-gold/20 hover:border-gold pb-0.5 transition-colors"
                    >
                      {t({ en: "Learn more", ar: "المزيد عن موسيقى الأعراس" })}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY ───────────────────────────────────────────────── */}
        <section id="gallery" className="py-28 md:py-36 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px 250px 0px" }}
              className="text-center mb-20"
            >
              <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4 block">{t({ en: "In the Spotlight", ar: "من حفلاتنا" })}</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-4">{t({ en: "Gallery", ar: "صور وفيديو" })}</h2>
              <div className="h-px w-24 gold-gradient mx-auto" />
            </motion.div>

            <PostCarousel />

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px 250px 0px" }}
              className="text-center mt-10"
            >
              <a
                href="https://www.instagram.com/nahawand_.entertainment/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm tracking-[0.2em] text-gold/70 hover:text-gold transition-colors border-b border-gold/20 hover:border-gold pb-1"
              >
                <Instagram className="w-4 h-4" />
                {t({ en: "FOLLOW FOR MORE ON INSTAGRAM", ar: "شاهدوا المزيد على إنستغرام" })}
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── WHY NAHAWAND ──────────────────────────────────────────── */}
        <section className="py-24 bg-zinc-950 px-6 border-y border-white/5">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px 250px 0px" }}
            >
              <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4 block">{t({ en: "The Difference", ar: "ما يميزنا" })}</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
                {lang === "ar" ? (
                  <>لماذا تختار <span className="gold-text">نهاوند</span></>
                ) : (
                  <>Why Choose <span className="italic gold-text">Nahawand</span></>
                )}
              </h2>
              <p className="text-zinc-400 leading-relaxed text-base">
                {t({
                  en: "Every event is unique, and Nahawand treats it that way. No pre-recorded backing tracks, no generic playlists — only live, soulful performance crafted around your celebration.",
                  ar: "لفرحتكم طابعها الخاص، ولموسيقاها أيضًا. مع نهاوند، نحيي مناسبتكم بعزف وغناء حيّ، بعيدًا عن التسجيلات وقوائم الأغاني الجاهزة، لنصنع معكم أجواء تشبهكم.",
                })}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px 250px 0px" }}
              className="grid gap-5"
            >
              {WHY_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "0px 0px 250px 0px" }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 items-start p-5 border border-white/5 hover:border-gold/20 transition-colors bg-black"
                >
                  <Star className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold mb-1 tracking-wide">{t(item.label)}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">{t(item.desc)}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
        <section id="testimonials" className="py-28 md:py-36 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px 250px 0px" }}
              className="text-center mb-20"
            >
              <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4 block">{t({ en: "Happy Clients", ar: "فرحتكم تسعدنا" })}</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-4">{t({ en: "What They Say", ar: "آراء أصحاب الحفلات" })}</h2>
              <div className="h-px w-24 gold-gradient mx-auto" />
            </motion.div>

            <ReviewCarousel />

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
              <a
                href={localizePath("/reviews")}
                className="inline-flex items-center gap-3 text-sm tracking-[0.2em] text-gold/70 hover:text-gold transition-colors border-b border-gold/20 hover:border-gold pb-1"
              >
                <Star className="w-4 h-4" />
                {t({ en: "LEAVE A REVIEW", ar: "شاركنا رأيك" })}
              </a>
              <a
                href="https://g.page/r/CeOGM30lYYpuECE/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm tracking-[0.2em] text-gold/70 hover:text-gold transition-colors border-b border-gold/20 hover:border-gold pb-1"
              >
                <Star className="w-4 h-4" />
                {t({ en: "REVIEW US ON GOOGLE", ar: "قيّمونا على Google" })}
              </a>
            </div>
          </div>
        </section>

        {/* ── CONTACT ───────────────────────────────────────────────── */}
        <section id="contact" className="py-28 md:py-36 px-6 bg-zinc-950 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px 250px 0px" }}
              className="text-center mb-16"
            >
              <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4 block">{t({ en: "Reserve Your Date", ar: "احجزوا تاريخ مناسبتكم" })}</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-4 italic">{t({ en: "Request a Booking", ar: "للحجز والاستفسار" })}</h2>
              <p className="text-zinc-500 text-sm tracking-widest uppercase">{t({ en: "Dates fill up fast — reach out early", ar: "تواصلوا معنا مبكرًا لضمان توفّر موعدكم" })}</p>
            </motion.div>

            <div className="grid md:grid-cols-5 gap-12">
              {/* Contact info */}
              <div className="md:col-span-2 space-y-8">
                {[
                  {
                    icon: <Phone className="text-gold w-5 h-5" />,
                    label: t({ en: "Call / WhatsApp", ar: "اتصال / واتساب" }),
                    value: "",
                    href: null,
                    phones: [
                      { text: "508 615 6986", href: "tel:+15086156986" },
                      { text: "617 595 5922", href: "tel:+16175955922" },
                    ],
                  },
                  {
                    icon: <Mail className="text-gold w-5 h-5" />,
                    label: t({ en: "Email", ar: "البريد الإلكتروني" }),
                    value: "ahmadalali2007@icloud.com",
                    href: "mailto:ahmadalali2007@icloud.com",
                  },
                  {
                    icon: <Instagram className="text-gold w-5 h-5" />,
                    label: t({ en: "Instagram", ar: "إنستغرام" }),
                    value: "@nahawand_.entertainment",
                    href: "https://www.instagram.com/nahawand_.entertainment/",
                  },
                  {
                    icon: <MapPin className="text-gold w-5 h-5" />,
                    label: t({ en: "Location", ar: "الموقع" }),
                    value: t({ en: "New England — available for travel", ar: "نيو إنجلاند — نلبّي حجوزات خارج المنطقة" }),
                    href: null,
                  },
                ].map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "0px 0px 250px 0px" }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-5"
                  >
                    <div className="w-12 h-12 bg-black flex items-center justify-center rounded-full border border-gold/20 shrink-0">
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">{c.label}</p>
                      {"phones" in c && c.phones ? (
                        <p className="text-sm flex flex-wrap gap-x-3">
                          {c.phones.map((ph, k) => (
                            <React.Fragment key={ph.href}>
                              {k > 0 && <span className="text-zinc-600">·</span>}
                              <a href={ph.href} className="hover:text-gold transition-colors">
                                <bdi dir="ltr">{ph.text}</bdi>
                              </a>
                            </React.Fragment>
                          ))}
                        </p>
                      ) : c.href ? (
                        <a
                          href={c.href}
                          {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="text-sm hover:text-gold transition-colors"
                        >
                          <bdi dir="ltr">{c.value}</bdi>
                        </a>
                      ) : (
                        <p className="text-sm">{c.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}

              </div>

              {/* Form */}
              <motion.form
                onSubmit={submitInquiry}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px 250px 0px" }}
                className="md:col-span-3 space-y-4"
              >
                {formStatus === "done" ? (
                  <div role="status" className="text-center py-16 border border-gold/20 bg-black">
                    <CheckCircle className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h3 className="font-serif text-2xl mb-2">{t({ en: "Thank you!", ar: "شكراً لكم!" })}</h3>
                    <p className="text-zinc-400 text-sm px-6">
                      {t({ en: "We received your inquiry and will get back to you soon.", ar: "وصلنا طلبكم وسنتواصل معكم قريباً." })}
                    </p>
                  </div>
                ) : (
                  <>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    maxLength={80}
                    value={form.name}
                    onChange={setField("name")}
                    placeholder={t({ en: "YOUR NAME", ar: "الاسم" })}
                    className="bg-black border border-white/8 p-4 text-xs tracking-widest focus:border-gold outline-none transition-all placeholder:text-zinc-700 w-full"
                  />
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    maxLength={40}
                    value={form.phone}
                    onChange={setField("phone")}
                    placeholder={t({ en: "PHONE / WHATSAPP", ar: "الهاتف / واتساب" })}
                    className="bg-black border border-white/8 p-4 text-xs tracking-widest focus:border-gold outline-none transition-all placeholder:text-zinc-700 w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    maxLength={120}
                    value={form.email}
                    onChange={setField("email")}
                    placeholder={t({ en: "EMAIL ADDRESS", ar: "البريد الإلكتروني" })}
                    className="bg-black border border-white/8 p-4 text-xs tracking-widest focus:border-gold outline-none transition-all placeholder:text-zinc-700 w-full"
                  />
                  <input
                    type="text"
                    name="eventDate"
                    maxLength={60}
                    value={form.eventDate}
                    onChange={setField("eventDate")}
                    placeholder={t({ en: "EVENT DATE", ar: "تاريخ المناسبة" })}
                    className="bg-black border border-white/8 p-4 text-xs tracking-widest focus:border-gold outline-none transition-all placeholder:text-zinc-700 w-full"
                  />
                </div>
                <select name="eventType" value={form.eventType} onChange={setField("eventType")} className={`w-full bg-black border border-white/8 p-4 text-xs tracking-widest focus:border-gold outline-none transition-all ${form.eventType ? "text-white" : "text-zinc-500"}`}>
                  <option value="" disabled>{t({ en: "EVENT TYPE", ar: "نوع المناسبة" })}</option>
                  <option value="wedding">{t({ en: "Wedding (عرس)", ar: "عرس" })}</option>
                  <option value="celebration">{t({ en: "Celebration (فرح)", ar: "احتفال" })}</option>
                  <option value="private">{t({ en: "Private Event (حفلة)", ar: "حفلة خاصة" })}</option>
                  <option value="corporate">{t({ en: "Corporate Event", ar: "مناسبة للشركات" })}</option>
                  <option value="other">{t({ en: "Other", ar: "أخرى" })}</option>
                </select>
                <textarea
                  name="message"
                  maxLength={2000}
                  value={form.message}
                  onChange={setField("message")}
                  placeholder={t({ en: "TELL US ABOUT YOUR EVENT — VENUE, GUEST COUNT, SPECIAL REQUESTS...", ar: "شاركونا تفاصيل المناسبة: المكان، عدد الضيوف، وأي طلبات خاصة…" })}
                  rows={4}
                  className="w-full bg-black border border-white/8 p-4 text-xs tracking-widest focus:border-gold outline-none transition-all placeholder:text-zinc-700 resize-none"
                />
                {/* Honeypot: hidden from people, filled by bots */}
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                  name="website"
                  value={form.website}
                  onChange={setField("website")}
                />
                {formError && <p role="alert" className="text-red-400 text-xs tracking-wide">{formError}</p>}
                <motion.button
                  disabled={formStatus === "sending"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-5 bg-gold text-black font-bold tracking-[0.3em] text-sm uppercase hover:bg-gold-light transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]"
                >
                  {formStatus === "sending" ? t({ en: "SENDING…", ar: "جارٍ الإرسال…" }) : t({ en: "SEND INQUIRY", ar: "إرسال الاستفسار" })}
                </motion.button>
                <p className="text-[10px] text-zinc-600 text-center tracking-widest">
                  {t({ en: "WE TYPICALLY RESPOND WITHIN 24 HOURS", ar: "نردّ عادةً خلال 24 ساعة" })}
                </p>
                  </>
                )}
              </motion.form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
