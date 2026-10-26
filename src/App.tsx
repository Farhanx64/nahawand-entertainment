import React from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Music, Calendar, Phone, Instagram, Mail, Drum, Guitar, Wind, Piano, Speaker, Star, Crown, MapPin, ChevronDown, Quote, Menu, X, CheckCircle, Mic } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const INSTAGRAM_POSTS = [
  { href: "https://www.instagram.com/layalicafe.ri/reel/Deb6EL9CMZn/", code: "Deb6EL9CMZn", reel: true, caption: "This Friday — it's going down at Layali Cafe! Syrian vibes, halal food, great people." },
  { href: "https://www.instagram.com/nahawand_.entertainment/p/Dd3sm9HRhNQ/", code: "Dd3sm9HRhNQ", reel: false, caption: "Honestly just can't wait for the crispy shawrma 🔥🕺" },
  { href: "https://www.instagram.com/layalicafe.ri/reel/DaNrqc5AF7Z/", code: "DaNrqc5AF7Z", reel: true, caption: "Summer starts at Layali — July 3rd! Live music, premium hookah and a brand new menu." },
  { href: "https://www.instagram.com/nahawand_.entertainment/p/DZ7m9BURTY6/", code: "DZ7m9BURTY6", reel: false, caption: "Come enjoy Mediterranean soul touching vibes at Layali Cafe, July 3rd Friday night 🔥" },
  { href: "https://www.instagram.com/nahawand_.entertainment/p/DXj9R9DDQfW/", code: "DXj9R9DDQfW", reel: false, caption: "Live at Kaza Maza ✨ Friday, April 24th, 8PM — Middle Eastern vibes, great food, live music all night." },
];

function PostCard({ p }: { p: (typeof INSTAGRAM_POSTS)[number] }) {
  const [broken, setBroken] = useState(false);
  return (
    <a
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
          <span className="absolute top-3 right-3 text-[9px] tracking-[0.25em] text-gold border border-gold/50 bg-black/60 px-2 py-1">REEL</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">{p.caption}</p>
        <span className="mt-3 inline-flex items-center gap-2 text-[10px] tracking-[0.25em] text-gold/70">
          <Instagram className="w-3 h-3" /> VIEW ON INSTAGRAM
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
  const [reviews, setReviews] = useState<ApprovedReview[] | null>(null);
  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => setReviews([]));
  }, []);

  if (reviews && reviews.length === 0) {
    return <p className="text-center text-zinc-500 text-sm">Reviews are coming soon.</p>;
  }
  if (!reviews) return null;
  return (
    <AutoScroller minItems={6}>
      {reviews.map((r) => (
        <div
          key={r.id}
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


const NAV_LINKS = [
  { href: "#about", label: "ABOUT" },
  { href: "#services", label: "SERVICES" },
  { href: "#gallery", label: "GALLERY" },
  { href: "/reviews", label: "REVIEWS" },
  { href: "#contact", label: "BOOK NOW", cta: true },
];

const BAND = [
  {
    title: "Org",
    arabic: "أورغ",
    icon: <Piano className="w-9 h-9" />,
    members: ["Yamaha PSR-A5000", "Korg V3"],
  },
  {
    title: "Percussion",
    arabic: "إيقاع",
    icon: <Drum className="w-9 h-9" />,
    members: ["Darbuka", "Tabl", "Katem", "Riq"],
  },
  {
    title: "Strings",
    arabic: "أوتار",
    icon: <Guitar className="w-9 h-9" />,
    members: ["Buzuk", "Oud", "Kanun"],
  },
  {
    title: "Wind",
    arabic: "نفخ",
    icon: <Wind className="w-9 h-9" />,
    members: ["Nay"],
  },
  {
    title: "Vocals",
    arabic: "غناء",
    icon: <Mic className="w-9 h-9" />,
    members: ["Singers"],
  },
  {
    title: "Sound",
    arabic: "صوت",
    icon: <Speaker className="w-9 h-9" />,
    members: ["PA Professional Sound System"],
  },
];

const SERVICES = [
  {
    title: "Weddings",
    arabic: "أعراس",
    icon: <Crown className="w-10 h-10" />,
    desc: "From the entrance zaffa to the last dance — a full evening of live oriental music tailored to your wedding vision.",
    features: ["Live zaffa performance", "Customised song list", "Full-night sets"],
  },
  {
    title: "Celebrations",
    arabic: "أفراح",
    icon: <Music className="w-10 h-10" />,
    desc: "Engagement parties, graduation ceremonies, and family gatherings elevated with authentic oriental atmosphere.",
    features: ["Engagement parties", "Graduation events", "Family gatherings"],
  },
  {
    title: "Private Events",
    arabic: "حفلات",
    icon: <Calendar className="w-10 h-10" />,
    desc: "Intimate live oriental music for private gatherings, house parties, and special occasions.",
    features: ["Private gatherings", "House parties", "Birthday celebrations"],
  },
];

const WHY_ITEMS = [
  { label: "PSR-A5000 & Korg V3 setups", desc: "Professional-grade instruments for crystal-clear live sound." },
  { label: "Custom repertoire", desc: "Send us your favorite songs and we'll make a customized setlist to your liking." },
  { label: "Sound system included", desc: "Premium PA system available for venues without in-house audio." },
];

function NavBar() {
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
      window.location.href = id;
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
            <span className="font-serif text-xl gold-text tracking-widest leading-none">NAHAWAND</span>
            <span className="text-[8px] text-gold/60 tracking-[0.4em]">ENTERTAINMENT</span>
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
                {l.label}
              </button>
            ) : (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-zinc-300 hover:text-gold transition-colors font-light"
              >
                {l.label}
              </button>
            )
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-gold p-2">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
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
                  className={`text-left text-sm tracking-[0.2em] py-2 transition-colors ${
                    l.cta ? "text-gold border-b border-gold/30" : "text-zinc-300 hover:text-gold"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default function App() {
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
            <span className="sr-only">Nahawand Entertainment — Live Arabic music for weddings in New England. </span>
            <span className="gold-text italic">Oriental</span> Melodies
          </h1>

          <p className="text-zinc-300 text-base md:text-xl font-light mb-2 tracking-[0.25em] uppercase">
            Weddings · Celebrations · Private Events
          </p>
          <p className="text-gold/70 font-arabic text-xl mb-10 tracking-wide">
            أفراح · أعراس · حفلات
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-10 py-4 bg-gold text-black font-bold tracking-[0.25em] text-sm shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] transition-shadow"
            >
              BOOK PERFORMANCE
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="px-10 py-4 border border-white/30 text-white hover:border-gold hover:text-gold transition-colors text-sm tracking-[0.25em]"
            >
              DISCOVER MORE
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
          <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
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
              <div className="grid grid-cols-3 gap-6 mb-4 py-8 border-y border-white/5 text-center">
                {[
                  { val: "5+", label: "Years Experience" },
                  { val: "200+", label: "Events Performed" },
                  ...(avgRating
                    ? [{ val: `${avgRating.toFixed(1)}★`, label: `Average Rating · ${ratings.length} Reviews` }]
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
              <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4 block">Build Your Lineup</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-4">The Band</h2>
              <div className="h-px w-24 gold-gradient mx-auto mb-6" />
              <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
                Solo, duo, or a full live band — a lineup that fits your event and space.
              </p>
            </motion.div>

            <AutoScroller minItems={BAND.length}>
              {BAND.map((g) => (
                <div
                  key={g.title}
                  className="shrink-0 w-[220px] p-6 border border-white/5 bg-zinc-950 hover:border-gold/30 transition-colors"
                >
                  <div className="text-gold mb-4">{g.icon}</div>
                  <h3 className="font-serif text-xl mb-1">{g.title}</h3>
                  <p className="text-gold/60 text-sm mb-4">{g.arabic}</p>
                  <ul className="space-y-2">
                    {g.members.map((m) => (
                      <li key={m} className="flex items-center gap-3 text-sm text-zinc-300">
                        <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </AutoScroller>

            <p className="text-center mt-10 text-sm text-zinc-500">
              Tell us about your event in the booking form and we'll put together the right lineup.
            </p>
          </div>
        </section>

        {/* ── SERVICES ──────────────────────────────────────────────── */}
        <section id="services" className="py-28 md:py-36 bg-zinc-950 px-6 border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4 block">What We Offer</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-4">Our Services</h2>
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
                  <h3 className="font-serif text-2xl mb-1">{s.title}</h3>
                  <p className="text-gold/60 font-arabic text-lg mb-4">{s.arabic}</p>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">{s.desc}</p>
                  <ul className="space-y-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-zinc-400 tracking-wide">
                        <CheckCircle className="w-3.5 h-3.5 text-gold/60 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
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
              <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4 block">In the Spotlight</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-4">Gallery</h2>
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
                FOLLOW FOR MORE ON INSTAGRAM
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
              <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4 block">The Difference</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
                Why Choose <span className="italic gold-text">Nahawand</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed text-base">
                Every event is unique, and Nahawand treats it that way. No pre-recorded backing tracks, no generic playlists — only live, soulful performance crafted around your celebration.
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
                    <p className="text-sm font-semibold mb-1 tracking-wide">{item.label}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
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
              <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4 block">Happy Clients</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-4">What They Say</h2>
              <div className="h-px w-24 gold-gradient mx-auto" />
            </motion.div>

            <ReviewCarousel />

            <div className="text-center mt-10">
              <a
                href="/reviews"
                className="inline-flex items-center gap-3 text-sm tracking-[0.2em] text-gold/70 hover:text-gold transition-colors border-b border-gold/20 hover:border-gold pb-1"
              >
                <Star className="w-4 h-4" />
                LEAVE A REVIEW
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
              <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4 block">Reserve Your Date</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-4 italic">Request a Booking</h2>
              <p className="text-zinc-500 text-sm tracking-widest uppercase">Dates fill up fast — reach out early</p>
            </motion.div>

            <div className="grid md:grid-cols-5 gap-12">
              {/* Contact info */}
              <div className="md:col-span-2 space-y-8">
                {[
                  {
                    icon: <Phone className="text-gold w-5 h-5" />,
                    label: "Call / WhatsApp",
                    value: "508 615 6986  ·  617 595 5922",
                    href: "tel:+15086156986",
                  },
                  {
                    icon: <Mail className="text-gold w-5 h-5" />,
                    label: "Email",
                    value: "ahmadalali2007@icloud.com",
                    href: "mailto:ahmadalali2007@icloud.com",
                  },
                  {
                    icon: <Instagram className="text-gold w-5 h-5" />,
                    label: "Instagram",
                    value: "@nahawand_.entertainment",
                    href: "https://www.instagram.com/nahawand_.entertainment/",
                  },
                  {
                    icon: <MapPin className="text-gold w-5 h-5" />,
                    label: "Location",
                    value: "New England — available for travel",
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
                      {c.href ? (
                        <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-gold transition-colors">
                          {c.value}
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
                onSubmit={(e) => e.preventDefault()}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px 250px 0px" }}
                className="md:col-span-3 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="YOUR NAME"
                    className="bg-black border border-white/8 p-4 text-xs tracking-widest focus:border-gold outline-none transition-all placeholder:text-zinc-700 w-full"
                  />
                  <input
                    type="text"
                    placeholder="PHONE / WHATSAPP"
                    className="bg-black border border-white/8 p-4 text-xs tracking-widest focus:border-gold outline-none transition-all placeholder:text-zinc-700 w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    className="bg-black border border-white/8 p-4 text-xs tracking-widest focus:border-gold outline-none transition-all placeholder:text-zinc-700 w-full"
                  />
                  <input
                    type="text"
                    placeholder="EVENT DATE"
                    className="bg-black border border-white/8 p-4 text-xs tracking-widest focus:border-gold outline-none transition-all placeholder:text-zinc-700 w-full"
                  />
                </div>
                <select defaultValue="" className="w-full bg-black border border-white/8 p-4 text-xs tracking-widest focus:border-gold outline-none transition-all text-zinc-500">
                  <option value="" disabled>EVENT TYPE</option>
                  <option value="wedding">Wedding (عرس)</option>
                  <option value="celebration">Celebration (فرح)</option>
                  <option value="private">Private Event (حفلة)</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  placeholder="TELL US ABOUT YOUR EVENT — VENUE, GUEST COUNT, SPECIAL REQUESTS..."
                  rows={4}
                  className="w-full bg-black border border-white/8 p-4 text-xs tracking-widest focus:border-gold outline-none transition-all placeholder:text-zinc-700 resize-none"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-5 bg-gold text-black font-bold tracking-[0.3em] text-sm uppercase hover:bg-gold-light transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]"
                >
                  SEND INQUIRY
                </motion.button>
                <p className="text-[10px] text-zinc-600 text-center tracking-widest">
                  WE TYPICALLY RESPOND WITHIN 24 HOURS
                </p>
              </motion.form>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="relative py-16 px-6 border-t border-white/5 text-center bg-black">
        <img
          src="/logo.png"
          alt="Nahawand Entertainment"
          className="w-24 mx-auto mb-6 opacity-50 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-500"
        />
        <p className="font-serif text-xl gold-text mb-1">NAHAWAND</p>
        <p className="text-[9px] text-zinc-600 tracking-[0.4em] uppercase mb-8">ENTERTAINMENT</p>

        <div className="flex justify-center gap-6 mb-8">
          {[
            { icon: <Instagram className="w-4 h-4" />, href: "https://www.instagram.com/nahawand_.entertainment/" },
          ].map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-white/10 hover:border-gold hover:text-gold flex items-center justify-center text-zinc-500 transition-all rounded-sm"
            >
              {s.icon}
            </a>
          ))}
        </div>

        <div className="h-px w-32 gold-gradient mx-auto mb-8 opacity-30" />

        <p className="text-[10px] text-zinc-700 tracking-[0.35em] uppercase">
          © 2026 Nahawand Entertainment &nbsp;·&nbsp; Authenticity in Every Note
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
    </div>
  );
}
