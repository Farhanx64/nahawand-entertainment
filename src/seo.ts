// Per-page head data. Used by scripts/prerender.mjs (through the SSR bundle) to write each page's <head>.
export const SITE = "https://nahawand.org";

const areaServed = [
  { "@type": "City", name: "Worcester", containedInPlace: { "@type": "State", name: "Massachusetts" } },
  { "@type": "City", name: "Boston", containedInPlace: { "@type": "State", name: "Massachusetts" } },
  { "@type": "State", name: "Massachusetts" },
  { "@type": "State", name: "Rhode Island" },
  { "@type": "State", name: "Connecticut" },
  { "@type": "State", name: "Maine" },
  { "@type": "AdministrativeArea", name: "New England" },
];

const provider = { "@type": "EntertainmentBusiness", name: "Nahawand Entertainment", url: SITE };

const business = {
  "@context": "https://schema.org",
  "@type": ["EntertainmentBusiness", "LocalBusiness"],
  name: "Nahawand Entertainment",
  alternateName: ["Nahawand", "نهاوند"],
  url: SITE,
  logo: `${SITE}/logo.png`,
  image: `${SITE}/hero.jpg`,
  description:
    "Live Arabic and oriental music for weddings, zaffa entrances, engagement parties and private events in Worcester, Boston and across New England.",
  email: "ahmadalali2007@icloud.com",
  telephone: "+1-508-615-6986",
  contactPoint: [
    { "@type": "ContactPoint", contactType: "reservations", telephone: "+1-508-615-6986" },
    { "@type": "ContactPoint", contactType: "reservations", telephone: "+1-617-595-5922" },
  ],
  areaServed,
  knowsLanguage: ["en", "ar"],
  sameAs: ["https://www.instagram.com/nahawand_.entertainment/"],
};

export type PageMeta = { path: string; title: string; description: string; jsonLd: object[] };

export const PAGES: PageMeta[] = [
  {
    path: "/",
    title: "Arabic Wedding Band in New England | Nahawand Entertainment",
    description:
      "Live Arabic music and zaffa for weddings in Worcester, Boston, and across New England. Choose a solo musician, duo, or full Nahawand band. Ask about your date.",
    jsonLd: [business],
  },
  {
    path: "/weddings/",
    title: "Live Arabic Wedding Music & Zaffa | Nahawand",
    description:
      "Live Arabic wedding music and zaffa entrances in Worcester, Boston and across New England. Solo, duo or full band, with a setlist built around your songs.",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Live Arabic wedding music and zaffa",
        serviceType: "Wedding entertainment",
        provider,
        areaServed,
        url: `${SITE}/weddings/`,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Nahawand Entertainment", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Weddings", item: `${SITE}/weddings/` },
        ],
      },
    ],
  },
  {
    path: "/areas/worcester/",
    title: "Arabic Wedding Band in Worcester, MA | Nahawand",
    description:
      "Live Arabic music and zaffa for weddings and celebrations in Worcester and Central Massachusetts. Solo, duo or full band. Contact us with your date.",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Live Arabic wedding music in Worcester, MA",
        serviceType: "Wedding entertainment",
        provider,
        areaServed: [{ "@type": "City", name: "Worcester", containedInPlace: { "@type": "State", name: "Massachusetts" } }],
        url: `${SITE}/areas/worcester/`,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Nahawand Entertainment", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Worcester", item: `${SITE}/areas/worcester/` },
        ],
      },
    ],
  },
  {
    path: "/areas/boston/",
    title: "Arabic Wedding Band in Boston, MA | Nahawand",
    description:
      "Live Arabic music and zaffa for weddings and celebrations in Boston and Greater Boston. Solo, duo or full band. Contact us with your date.",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Live Arabic wedding music in Boston, MA",
        serviceType: "Wedding entertainment",
        provider,
        areaServed: [{ "@type": "City", name: "Boston", containedInPlace: { "@type": "State", name: "Massachusetts" } }],
        url: `${SITE}/areas/boston/`,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Nahawand Entertainment", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Boston", item: `${SITE}/areas/boston/` },
        ],
      },
    ],
  },
];

const arabicCopy: Record<string, { title: string; description: string; name: string }> = {
  "/": {
    title: "نهاوند | فرقة موسيقية عربية للأعراس في نيو إنجلاند",
    description: "موسيقى عربية حيّة وزفّة عروسين مع نهاوند. اختاروا عازفًا منفردًا أو ثنائيًا أو فرقة كاملة. لمناسباتكم في وستر وبوسطن ونيو إنجلاند، استفسروا عن موعدكم.",
    name: "نهاوند للموسيقى والحفلات",
  },
  "/weddings/": {
    title: "موسيقى عربية حيّة وزفّة أعراس | نهاوند",
    description: "من زفّة العروسين حتى آخر رقصة، حضّروا سهرتكم مع نهاوند بموسيقى عربية حيّة وأغانٍ من اختياركم. تواصلوا معنا لمعرفة إمكانية الحجز والتجهيزات المناسبة.",
    name: "موسيقى عربية حيّة وزفّة أعراس",
  },
  "/areas/worcester/": {
    title: "فرقة أعراس عربية في وستر، ماساتشوستس | نهاوند",
    description: "تخطّطون لعرس أو حفلة في وستر أو وسط ماساتشوستس؟ تعرّفوا إلى موسيقى نهاوند وزفّة العروسين، وراسلونا بالتاريخ والمكان لمعرفة إمكانية الحجز.",
    name: "موسيقى عربية حيّة للأعراس في وستر، ماساتشوستس",
  },
  "/areas/boston/": {
    title: "فرقة أعراس عربية في بوسطن، ماساتشوستس | نهاوند",
    description: "تخطّطون لعرس أو حفلة في بوسطن أو منطقة بوسطن الكبرى؟ تعرّفوا إلى موسيقى نهاوند وزفّة العروسين، وراسلونا بالتاريخ والمكان لمعرفة إمكانية الحجز.",
    name: "موسيقى عربية حيّة للأعراس في بوسطن، ماساتشوستس",
  },
};

// Preserve geographic entities exactly; localize the business/service and breadcrumbs.
function arabicSchema(value: unknown, copy: (typeof arabicCopy)[string]): unknown {
  if (Array.isArray(value)) return value.map((item) => arabicSchema(item, copy));
  if (!value || typeof value !== "object") return value;
  const names: Record<string, string> = {
    "Nahawand Entertainment": "نهاوند للموسيقى والحفلات",
    "Weddings": "الأعراس", "Worcester": "وستر", "Boston": "بوسطن",
  };
  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (key === "areaServed") result[key] = item;
    else if (key === "name" && typeof item === "string") result[key] = names[item] ?? copy.name;
    else if (key === "description") result[key] = copy.description;
    else if (key === "serviceType") result[key] = "موسيقى للأعراس";
    else if ((key === "url" || key === "item") && typeof item === "string" && item.startsWith(SITE)) {
      result[key] = `${SITE}/ar${item.slice(SITE.length) || "/"}`;
    } else result[key] = arabicSchema(item, copy);
  }
  if (result["@type"] === "Service") result.description = copy.description;
  return result;
}

for (const page of [...PAGES]) {
  const copy = arabicCopy[page.path];
  PAGES.push({
    path: `/ar${page.path}`,
    title: copy.title,
    description: copy.description,
    jsonLd: page.jsonLd.map((item) => arabicSchema(item, copy) as object),
  });
}
