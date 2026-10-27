import { CheckCircle, Phone, Mail } from "lucide-react";
import { NavBar, Footer } from "./App.tsx";
import { useLang, type L } from "./i18n.tsx";

const TIMELINE: { title: L; body: L }[] = [
  {
    title: { en: "Entrance: the zaffa", ar: "البداية مع زفّة العروسين" },
    body: {
      en: "The zaffa is the celebratory procession that brings the couple into the room, led by drums and live music. We play it live, so the rhythm follows your entrance instead of a recording.", ar: "تبدأ الفرحة بدخول العروسين على إيقاع الطبول والموسيقى الحيّة. نعزف الزفّة مباشرة، ليتماشى الإيقاع مع خطواتكم ولحظة دخولكم، بدلًا من التقيّد بتسجيل جاهز.",
    },
  },
  {
    title: { en: "Dinner and conversation", ar: "أجواء هادئة وقت العشاء" },
    body: {
      en: "Softer sets that keep the room warm without drowning out conversation, so guests can eat, talk and settle in.", ar: "موسيقى هادئة تضيف دفئًا إلى السهرة، وتترك لضيوفكم مساحة للاستمتاع بالعشاء والحديث براحة.",
    },
  },
  {
    title: { en: "Dancing", ar: "وقت الرقص والفرح" },
    body: {
      en: "Full-energy sets of Arabic favorites to get the floor moving. Song requests are welcome.", ar: "نرفع إيقاع السهرة بأغانٍ عربية تحبّونها، لتشاركونا الرقص والفرح. ويسعدنا استقبال طلباتكم.",
    },
  },
];

const LINEUPS: { title: L; body: L }[] = [
  {
    title: { en: "Solo", ar: "عازف منفرد" },
    body: { en: "One musician for smaller rooms, cocktail hours and intimate gatherings.", ar: "عازف واحد يناسب القاعات الصغيرة وفترة استقبال الضيوف والجلسات الخاصة." },
  },
  {
    title: { en: "Duo", ar: "ثنائي موسيقي" },
    body: { en: "Two musicians for more sound and rhythm without filling the room.", ar: "عازفان يمنحان الحفل تنوّعًا موسيقيًا وإيقاعيًا، بمساحة أقل من الفرقة الكاملة." },
  },
  {
    title: { en: "Full band", ar: "فرقة كاملة" },
    body: {
      en: "Keys, percussion, strings, nay and vocals for the full celebration. Instruments include Yamaha PSR-A5000 and Korg V3 keys, darbuka, tabl, katem, riq, buzuk, oud, kanun and nay.", ar: "فرقة تجمع الأورغ والإيقاعات والآلات الوترية والناي والغناء. تشمل الآلات أورغ Yamaha PSR-A5000 وKorg V3، والدربكة والطبل والكاتم والرق والبزق والعود والقانون والناي.",
    },
  },
];

const FAQ: { q: L; a: L }[] = [
  {
    q: { en: "Which areas do you perform in?", ar: "في أي مناطق يمكن حجز الفرقة؟" },
    a: {
      en: "We perform at weddings in Worcester, Boston and across New England. Contact us with your location and date and we'll confirm availability.", ar: "لمناسباتكم في وستر وبوسطن ونيو إنجلاند، أرسلوا لنا المكان والتاريخ لنتأكّد من إمكانية الحجز.",
    },
  },
  {
    q: { en: "Can we choose the songs?", ar: "هل يمكننا اختيار الأغاني؟" },
    a: {
      en: "Yes. Send us your favorite songs and we'll make a customized setlist to your liking.", ar: "بالتأكيد. شاركونا أغانيكم المفضّلة، لنحضّر برنامجًا موسيقيًا يناسب ذوقكم.",
    },
  },
  {
    q: { en: "Which lineup do we need?", ar: "أي فرقة تناسب مناسبتنا؟" },
    a: {
      en: "It depends on the size of your room and your guest count. Tell us about your venue and we'll suggest a solo, duo or full band.", ar: "يعتمد الاختيار على مساحة القاعة وعدد الضيوف. شاركونا تفاصيل المكان، لنقترح عليكم عازفًا منفردًا أو ثنائيًا أو فرقة كاملة.",
    },
  },
  {
    q: { en: "Do you bring a sound system?", ar: "هل توفّرون تجهيزات الصوت؟" },
    a: {
      en: "A professional PA sound system is available for venues without in-house audio. Tell us about your venue and we'll confirm the setup.", ar: "نوفّر نظامًا صوتيًا احترافيًا للقاعات غير المجهّزة بالصوت. أخبرونا عن المكان لنتّفق معكم على التجهيزات المناسبة.",
    },
  },
  {
    q: { en: "How much does it cost?", ar: "ما تكلفة الحجز؟" },
    a: {
      en: "Pricing depends on the lineup, the length of the performance, travel and sound. Tell us about your date and we'll send you a quote.", ar: "تختلف التكلفة بحسب عدد العازفين ومدة الحفل والتنقّل والتجهيزات الصوتية. أرسلوا لنا تاريخ المناسبة وتفاصيلها، لنقدّم لكم عرض سعر.",
    },
  },
  {
    q: { en: "How far ahead should we book?", ar: "متى يُفضّل أن نحجز؟" },
    a: { en: "Dates fill up fast, so reach out as early as you can.", ar: "ننصحكم بالتواصل مبكرًا، فالمواعيد تُحجز بسرعة." },
  },
];

export function BookingCta() {
  const { t, localizePath } = useLang();
  return (
        <section className="text-center border border-gold/20 bg-zinc-950 p-8 md:p-10">
          <h2 className="font-serif text-3xl mb-3">{t({ en: "Ask about your date", ar: "استفسروا عن موعدكم" })}</h2>
          <p className="text-zinc-400 text-sm mb-6">
            {t({ en: "Call or message us with your date, venue and guest count.", ar: "اتّصلوا بنا أو راسلونا مع ذكر تاريخ المناسبة ومكانها وعدد الضيوف." })}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 text-sm">
            <a href="tel:+15086156986" className="inline-flex items-center gap-2 hover:text-gold transition-colors">
              <Phone className="w-4 h-4 text-gold" /> <bdi dir="ltr">508 615 6986</bdi>
            </a>
            <a href="tel:+16175955922" className="inline-flex items-center gap-2 hover:text-gold transition-colors">
              <Phone className="w-4 h-4 text-gold" /> <bdi dir="ltr">617 595 5922</bdi>
            </a>
            <a href="mailto:ahmadalali2007@icloud.com" className="inline-flex items-center gap-2 hover:text-gold transition-colors">
              <Mail className="w-4 h-4 text-gold" /> <bdi dir="ltr">ahmadalali2007@icloud.com</bdi>
            </a>
          </div>
          <a
            href={localizePath("/#contact")}
            className="inline-block px-10 py-4 bg-gold text-black font-bold tracking-[0.25em] text-sm hover:bg-gold-light transition-colors"
          >
            {t({ en: "REQUEST A BOOKING", ar: "طلب حجز" })}
          </a>
        </section>
  );
}

export default function Weddings() {
  const { t, localizePath } = useLang();
  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-gold selection:text-black">
      <NavBar />

      <main className="max-w-3xl mx-auto px-6 pt-36 pb-24">
        <header className="text-center mb-16">
          <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4 block">
            {t({ en: "Weddings", ar: "الأعراس" })}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
            {t({ en: "Live Arabic Wedding Music & Zaffa in New England", ar: "موسيقى عربية حيّة وزفّة أعراس في نيو إنجلاند" })}
          </h1>
          <div className="h-px w-24 gold-gradient mx-auto mb-6" />
          <p className="text-zinc-400 text-base leading-relaxed">
            {t({
              en: "Nahawand Entertainment plays live Arabic and oriental music for weddings, from the zaffa entrance to the last dance. Choose a solo musician, a duo or a full band, and send us the songs you love so we can build the evening around your day.", ar: "من زفّة العروسين حتى آخر رقصة، ترافقكم نهاوند بموسيقى عربية وشرقية حيّة. اختاروا عازفًا منفردًا أو ثنائيًا أو فرقة كاملة، وشاركونا الأغاني التي تحبّونها، لنحضّر معكم سهرة تشبه فرحتكم.",
            })}
          </p>
        </header>

        <section className="mb-16">
          <h2 className="font-serif text-3xl mb-8">{t({ en: "Music for every part of the evening", ar: "موسيقى لكل لحظة من السهرة" })}</h2>
          <div className="space-y-5">
            {TIMELINE.map((item) => (
              <div key={item.title.en} className="p-6 border border-white/5 bg-zinc-950">
                <h3 className="font-serif text-xl mb-2">{t(item.title)}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{t(item.body)}</p>
              </div>
            ))}
          </div>
          <p className="text-zinc-500 text-sm mt-5 leading-relaxed">
            {t({
              en: "Tell us your entrance time, the route through the room and any song you'd like, and we'll plan the timing with your venue and MC. Every wedding is different, so we shape the schedule with you.", ar: "أخبرونا بموعد دخولكم ومسار الزفّة والأغاني التي ترغبون بها، لننسّق التوقيت مع القاعة ومقدّم الحفل. لكل عرس تفاصيله، ونرتّب فقرات السهرة معكم.",
            })}
          </p>
        </section>

        <section className="mb-16">
          <h2 className="font-serif text-3xl mb-8">{t({ en: "Solo, duo or full band", ar: "عازف منفرد أو ثنائي أو فرقة كاملة" })}</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {LINEUPS.map((item) => (
              <div key={item.title.en} className="p-6 border border-white/5 bg-zinc-950">
                <h3 className="font-serif text-xl mb-2 text-gold">{t(item.title)}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{t(item.body)}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm">
            <a href={localizePath("/#band")} className="text-gold/80 hover:text-gold border-b border-gold/30 hover:border-gold transition-colors">
              {t({ en: "See the full lineup", ar: "تعرّفوا إلى آلات الفرقة" })}
            </a>
          </p>
        </section>

        <section className="mb-16">
          <h2 className="font-serif text-3xl mb-6">{t({ en: "Your songs, your setlist", ar: "أغانيكم على ذوقكم" })}</h2>
          <ul className="space-y-3 text-zinc-300 text-sm">
            {[
              { en: "Send us your favorite songs and we'll make a customized setlist to your liking.", ar: "شاركونا أغانيكم المفضّلة، لنحضّر برنامجًا موسيقيًا يناسب ذوقكم." },
              { en: "Professional PA sound system available for venues without in-house audio.", ar: "نوفّر نظامًا صوتيًا احترافيًا للقاعات غير المجهّزة بالصوت." },
            ].map((item) => (
              <li key={item.en} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                {t(item)}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="font-serif text-3xl mb-8">{t({ en: "Questions couples ask", ar: "أسئلتكم قبل الحجز" })}</h2>
          <div className="space-y-6">
            {FAQ.map((item) => (
              <div key={item.q.en}>
                <h3 className="font-semibold mb-1">{t(item.q)}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{t(item.a)}</p>
              </div>
            ))}
          </div>
        </section>

        <BookingCta />
      </main>

      <Footer />
    </div>
  );
}
