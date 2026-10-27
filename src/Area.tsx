import { CheckCircle } from "lucide-react";
import { NavBar, Footer } from "./App.tsx";
import { BookingCta } from "./Weddings.tsx";
import { useLang, type L } from "./i18n.tsx";

// Area pages stay general: no venue names or past-performance claims.
type Area = { city: L; region: L; other: { href: string; city: L } };

function AreaPage({ area }: { area: Area }) {
  const { t, localizePath } = useLang();
  const city = area.city.en;
  const region = area.region.en;
  const cityAr = area.city.ar;
  const regionAr = area.region.ar;

  const bullets: L[] = [
    { en: "The zaffa entrance played live, timed to your entrance.", ar: "زفّة بموسيقى حيّة ننسّق إيقاعها وتوقيتها مع دخولكم." },
    { en: "Softer dinner sets that keep conversation easy.", ar: "موسيقى هادئة وقت العشاء تتيح لضيوفكم الحديث براحة." },
    { en: "Full-energy dance sets with your song requests.", ar: "فقرات رقص بأجواء حماسية وأغانٍ من اختياركم." },
  ];
  const faq: { q: L; a: L }[] = [
    {
      q: { en: `Do you perform in ${city}?`, ar: `هل يمكن حجز الفرقة في ${cityAr}؟` },
      a: {
        en: `We take wedding and event bookings in ${city} and ${region}. Contact us with your date and venue and we'll confirm availability.`, ar: `لمناسباتكم في ${cityAr} و${regionAr}، تواصلوا معنا مع ذكر التاريخ والقاعة لنتأكّد من إمكانية الحجز.`,
      },
    },
    {
      q: { en: "Can we choose the songs?", ar: "هل يمكننا اختيار الأغاني؟" },
      a: { en: "Yes. Send us your favorite songs and we'll make a customized setlist to your liking.", ar: "بالتأكيد. شاركونا أغانيكم المفضّلة، لنحضّر برنامجًا موسيقيًا يناسب ذوقكم." },
    },
    {
      q: { en: "Which lineup is right for our room?", ar: "أي فرقة تناسب مساحة القاعة؟" },
      a: {
        en: "It depends on your room and guest count. Tell us about your venue and we'll suggest a solo, duo or full band.", ar: "يعتمد الاختيار على مساحة المكان وعدد الضيوف. شاركونا تفاصيل القاعة، لنقترح عليكم عازفًا منفردًا أو ثنائيًا أو فرقة كاملة.",
      },
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-gold selection:text-black">
      <NavBar />

      <main className="max-w-3xl mx-auto px-6 pt-36 pb-24">
        <header className="text-center mb-16">
          <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4 block">{t({ en: `${city}, MA`, ar: `${cityAr}، ماساتشوستس` })}</span>
          <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
            {t({ en: `Arabic Wedding Band in ${city}, MA`, ar: `فرقة أعراس عربية في ${cityAr}، ماساتشوستس` })}
          </h1>
          <div className="h-px w-24 gold-gradient mx-auto mb-6" />
          <p className="text-zinc-400 text-base leading-relaxed">
            {t({
              en: `Nahawand Entertainment brings live Arabic and oriental music to weddings, engagement parties and private celebrations in ${city} and ${region}. Choose a solo musician, a duo or a full band, from the zaffa entrance to the last dance.`, ar: `تخطّطون لعرس أو خطوبة أو حفلة خاصة في ${cityAr} أو ${regionAr}؟ مع نهاوند، اختاروا موسيقى عربية وشرقية حيّة ترافقكم من زفّة العروسين حتى آخر رقصة، بعازف منفرد أو ثنائي أو فرقة كاملة. تواصلوا معنا لمعرفة إمكانية الحجز.`,
            })}
          </p>
        </header>

        <section className="mb-16">
          <h2 className="font-serif text-3xl mb-6">{t({ en: `Live Arabic music for your ${city} wedding`, ar: `موسيقى عربية حيّة لعرسكم في ${cityAr}` })}</h2>
          <ul className="space-y-3 text-zinc-300 text-sm">
            {bullets.map((b) => (
              <li key={b.en} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                {t(b)}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-zinc-500">
            <a href={localizePath("/weddings/")} className="text-gold/80 hover:text-gold border-b border-gold/30 hover:border-gold transition-colors">
              {t({ en: "More about our wedding music", ar: "المزيد عن موسيقى الأعراس" })}
            </a>
          </p>
        </section>

        <section className="mb-16">
          <h2 className="font-serif text-3xl mb-4">{t({ en: `Booking in ${city}`, ar: `للحجز في ${cityAr}` })}</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {t({
              en: "Tell us your date, venue and guest count and we'll confirm availability and suggest the right lineup. A professional PA sound system is available for venues without in-house audio.", ar: "أرسلوا لنا تاريخ المناسبة ومكانها وعدد الضيوف، لنتأكّد من إمكانية الحجز ونقترح الفرقة المناسبة. ونوفّر نظامًا صوتيًا احترافيًا للقاعات غير المجهّزة بالصوت.",
            })}
          </p>
        </section>

        <section className="mb-16">
          <h2 className="font-serif text-3xl mb-8">{t({ en: "Common questions", ar: "أسئلة شائعة" })}</h2>
          <div className="space-y-6">
            {faq.map((item) => (
              <div key={item.q.en}>
                <h3 className="font-semibold mb-1">{t(item.q)}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{t(item.a)}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-zinc-500">
            {t({ en: "Also performing in", ar: "للاستفسار عن حفلاتكم في" })}{" "}
            <a href={localizePath(area.other.href)} className="text-gold/80 hover:text-gold border-b border-gold/30 hover:border-gold transition-colors">
              {t(area.other.city)}
            </a>
          </p>
        </section>

        <BookingCta />
      </main>

      <Footer />
    </div>
  );
}

export const Worcester = () => (
  <AreaPage area={{ city: { en: "Worcester", ar: "وستر" }, region: { en: "Central Massachusetts", ar: "وسط ماساتشوستس" }, other: { href: "/areas/boston/", city: { en: "Boston", ar: "بوسطن" } } }} />
);
export const Boston = () => (
  <AreaPage area={{ city: { en: "Boston", ar: "بوسطن" }, region: { en: "Greater Boston", ar: "منطقة بوسطن الكبرى" }, other: { href: "/areas/worcester/", city: { en: "Worcester", ar: "وستر" } } }} />
);
