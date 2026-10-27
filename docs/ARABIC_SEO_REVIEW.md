# Arabic SEO implementation review

## Result

- Added prerendered Arabic pages at `/ar/`, `/ar/weddings/`, `/ar/areas/worcester/`, and `/ar/areas/boston/`.
- Server and client choose language from the URL. No localStorage language switching remains.
- Language switches are ordinary links between matching pages. In-page fragments survive switching. Navigation, footer, service and booking links stay in the current language.
- Every English/Arabic page has a self-canonical, reciprocal `en`/`ar` alternates, and `x-default` targeting English.
- Arabic page metadata and JSON-LD use Arabic names/descriptions while preserving existing `areaServed` objects. Four Arabic pages were added to the sitemap.
- Public reviews retain client rendering. An Arabic `/ar/reviews/` shell supports a normal language-switch link without losing the reviews page. Reviews forms, API and moderation behavior were not changed. Admin stays at `/reviews/admin` in English.
- Existing English copy and layout classes were preserved. No commit or deployment.

## Copy decisions for Ahmad

- Worcester is written «وستر», Boston «بوسطن», Central Massachusetts «وسط ماساتشوستس», and Greater Boston «منطقة بوسطن الكبرى».
- Area copy asks visitors to contact Nahawand to confirm availability. It names no venues, claims no past local performances, and adds no travel-coverage promises.
- «كاتم» and «دربكة» are retained from the previous review. Ahmad should confirm the intended Katem instrument.
- «مقدّم الحفل» refers to the couple's MC in coordination instructions; it does not advertise an MC service. «فترة استقبال الضيوف» naturally describes cocktail-hour music.
- No nationality or additional specialty is claimed.
- The homepage's accessible Arabic H1 text is now «فرقة موسيقية عربية للأعراس والحفلات في نيو إنجلاند». The visible short hero tagline remains «ألحان شرقية» to preserve layout.

## Files changed for this task

- `src/App.tsx`: missing Arabic homepage/footer/link copy; language-aware navigation and destinations; Arabic accessible heading.
- `src/Weddings.tsx`: Arabic page copy, FAQs and booking CTA; localized links.
- `src/Area.tsx`: Arabic location data, headings, copy, FAQs and links.
- `src/i18n.tsx`: URL-derived starting language and ordinary language-switch links.
- `src/language.ts`: pure path/language helpers shared by client routing and localization.
- `src/routes.tsx`: Arabic page registry entries.
- `src/main.tsx`: pass URL to provider; reviews language alias; preserve unknown-path fallback without hydration mismatch.
- `src/entry-server.tsx`: render within the language provider using the requested path.
- `src/seo.ts`: Arabic titles, descriptions and localized JSON-LD.
- `src/Reviews.tsx`: language-aware return link and reviews-path normalization.
- `scripts/prerender.mjs`: document language/direction, language alternates, Arabic output and reviews shell.
- `scripts/verify-prerender.mjs`: repeatable checks of built bilingual HTML, metadata, sitemap, links and JSON-LD.
- `public/sitemap.xml`: four Arabic content URLs.
- `docs/ARABIC_SEO_REVIEW.md`: this report and translation inventory.

The working tree already contained the English SEO implementation. `index.html` and `wrangler.jsonc` were not edited for this task.

## New Arabic copy

The table lists each filled translation slot, including shared text where it occurs on multiple pages. Dynamic city wording is shown as a template; `${cityAr}` is «وستر» or «بوسطن» and `${regionAr}` is «وسط ماساتشوستس» or «منطقة بوسطن الكبرى».

| File | English source | Arabic written |
| --- | --- | --- |
| src/App.tsx | Weddings | الأعراس |
| src/App.tsx | Worcester | وستر |
| src/App.tsx | Boston | بوسطن |
| src/App.tsx | Reviews | التقييمات |
| src/App.tsx | Nahawand Entertainment is a live Arabic and oriental music band for weddings, engagement parties and private celebrations. We bring zaffa entrances, dinner music and full dance-floor sets to Worcester, Boston and across New England. Contact us with your location and date. | نهاوند فرقة موسيقية عربية للأعراس والخطوبة والحفلات الخاصة. من زفّة العروسين إلى موسيقى العشاء وأجواء الرقص، نختار معكم برنامجًا يناسب فرحتكم. لمناسباتكم في وستر وبوسطن ونيو إنجلاند، تواصلوا معنا مع ذكر المكان والتاريخ. |
| src/App.tsx | Learn more | المزيد عن موسيقى الأعراس |
| src/Weddings.tsx | Entrance: the zaffa | البداية مع زفّة العروسين |
| src/Weddings.tsx | The zaffa is the celebratory procession that brings the couple into the room, led by drums and live music. We play it live, so the rhythm follows your entrance instead of a recording. | تبدأ الفرحة بدخول العروسين على إيقاع الطبول والموسيقى الحيّة. نعزف الزفّة مباشرة، ليتماشى الإيقاع مع خطواتكم ولحظة دخولكم، بدلًا من التقيّد بتسجيل جاهز. |
| src/Weddings.tsx | Dinner and conversation | أجواء هادئة وقت العشاء |
| src/Weddings.tsx | Softer sets that keep the room warm without drowning out conversation, so guests can eat, talk and settle in. | موسيقى هادئة تضيف دفئًا إلى السهرة، وتترك لضيوفكم مساحة للاستمتاع بالعشاء والحديث براحة. |
| src/Weddings.tsx | Dancing | وقت الرقص والفرح |
| src/Weddings.tsx | Full-energy sets of Arabic favorites to get the floor moving. Song requests are welcome. | نرفع إيقاع السهرة بأغانٍ عربية تحبّونها، لتشاركونا الرقص والفرح. ويسعدنا استقبال طلباتكم. |
| src/Weddings.tsx | Solo | عازف منفرد |
| src/Weddings.tsx | One musician for smaller rooms, cocktail hours and intimate gatherings. | عازف واحد يناسب القاعات الصغيرة وفترة استقبال الضيوف والجلسات الخاصة. |
| src/Weddings.tsx | Duo | ثنائي موسيقي |
| src/Weddings.tsx | Two musicians for more sound and rhythm without filling the room. | عازفان يمنحان الحفل تنوّعًا موسيقيًا وإيقاعيًا، بمساحة أقل من الفرقة الكاملة. |
| src/Weddings.tsx | Full band | فرقة كاملة |
| src/Weddings.tsx | Keys, percussion, strings, nay and vocals for the full celebration. Instruments include Yamaha PSR-A5000 and Korg V3 keys, darbuka, tabl, katem, riq, buzuk, oud, kanun and nay. | فرقة تجمع الأورغ والإيقاعات والآلات الوترية والناي والغناء. تشمل الآلات أورغ Yamaha PSR-A5000 وKorg V3، والدربكة والطبل والكاتم والرق والبزق والعود والقانون والناي. |
| src/Weddings.tsx | Which areas do you perform in? | في أي مناطق يمكن حجز الفرقة؟ |
| src/Weddings.tsx | We perform at weddings in Worcester, Boston and across New England. Contact us with your location and date and we'll confirm availability. | لمناسباتكم في وستر وبوسطن ونيو إنجلاند، أرسلوا لنا المكان والتاريخ لنتأكّد من إمكانية الحجز. |
| src/Weddings.tsx | Can we choose the songs? | هل يمكننا اختيار الأغاني؟ |
| src/Weddings.tsx | Yes. Send us your favorite songs and we'll make a customized setlist to your liking. | بالتأكيد. شاركونا أغانيكم المفضّلة، لنحضّر برنامجًا موسيقيًا يناسب ذوقكم. |
| src/Weddings.tsx | Which lineup do we need? | أي فرقة تناسب مناسبتنا؟ |
| src/Weddings.tsx | It depends on the size of your room and your guest count. Tell us about your venue and we'll suggest a solo, duo or full band. | يعتمد الاختيار على مساحة القاعة وعدد الضيوف. شاركونا تفاصيل المكان، لنقترح عليكم عازفًا منفردًا أو ثنائيًا أو فرقة كاملة. |
| src/Weddings.tsx | Do you bring a sound system? | هل توفّرون تجهيزات الصوت؟ |
| src/Weddings.tsx | A professional PA sound system is available for venues without in-house audio. Tell us about your venue and we'll confirm the setup. | نوفّر نظامًا صوتيًا احترافيًا للقاعات غير المجهّزة بالصوت. أخبرونا عن المكان لنتّفق معكم على التجهيزات المناسبة. |
| src/Weddings.tsx | How much does it cost? | ما تكلفة الحجز؟ |
| src/Weddings.tsx | Pricing depends on the lineup, the length of the performance, travel and sound. Tell us about your date and we'll send you a quote. | تختلف التكلفة بحسب عدد العازفين ومدة الحفل والتنقّل والتجهيزات الصوتية. أرسلوا لنا تاريخ المناسبة وتفاصيلها، لنقدّم لكم عرض سعر. |
| src/Weddings.tsx | How far ahead should we book? | متى يُفضّل أن نحجز؟ |
| src/Weddings.tsx | Dates fill up fast, so reach out as early as you can. | ننصحكم بالتواصل مبكرًا، فالمواعيد تُحجز بسرعة. |
| src/Weddings.tsx | Ask about your date | استفسروا عن موعدكم |
| src/Weddings.tsx | Call or message us with your date, venue and guest count. | اتّصلوا بنا أو راسلونا مع ذكر تاريخ المناسبة ومكانها وعدد الضيوف. |
| src/Weddings.tsx | REQUEST A BOOKING | طلب حجز |
| src/Weddings.tsx | Weddings | الأعراس |
| src/Weddings.tsx | Live Arabic Wedding Music & Zaffa in New England | موسيقى عربية حيّة وزفّة أعراس في نيو إنجلاند |
| src/Weddings.tsx | Nahawand Entertainment plays live Arabic and oriental music for weddings, from the zaffa entrance to the last dance. Choose a solo musician, a duo or a full band, and send us the songs you love so we can build the evening around your day. | من زفّة العروسين حتى آخر رقصة، ترافقكم نهاوند بموسيقى عربية وشرقية حيّة. اختاروا عازفًا منفردًا أو ثنائيًا أو فرقة كاملة، وشاركونا الأغاني التي تحبّونها، لنحضّر معكم سهرة تشبه فرحتكم. |
| src/Weddings.tsx | Music for every part of the evening | موسيقى لكل لحظة من السهرة |
| src/Weddings.tsx | Tell us your entrance time, the route through the room and any song you'd like, and we'll plan the timing with your venue and MC. Every wedding is different, so we shape the schedule with you. | أخبرونا بموعد دخولكم ومسار الزفّة والأغاني التي ترغبون بها، لننسّق التوقيت مع القاعة ومقدّم الحفل. لكل عرس تفاصيله، ونرتّب فقرات السهرة معكم. |
| src/Weddings.tsx | Solo, duo or full band | عازف منفرد أو ثنائي أو فرقة كاملة |
| src/Weddings.tsx | See the full lineup | تعرّفوا إلى آلات الفرقة |
| src/Weddings.tsx | Your songs, your setlist | أغانيكم على ذوقكم |
| src/Weddings.tsx | Send us your favorite songs and we'll make a customized setlist to your liking. | شاركونا أغانيكم المفضّلة، لنحضّر برنامجًا موسيقيًا يناسب ذوقكم. |
| src/Weddings.tsx | Professional PA sound system available for venues without in-house audio. | نوفّر نظامًا صوتيًا احترافيًا للقاعات غير المجهّزة بالصوت. |
| src/Weddings.tsx | Questions couples ask | أسئلتكم قبل الحجز |
| src/Area.tsx | The zaffa entrance played live, timed to your entrance. | زفّة بموسيقى حيّة ننسّق إيقاعها وتوقيتها مع دخولكم. |
| src/Area.tsx | Softer dinner sets that keep conversation easy. | موسيقى هادئة وقت العشاء تتيح لضيوفكم الحديث براحة. |
| src/Area.tsx | Full-energy dance sets with your song requests. | فقرات رقص بأجواء حماسية وأغانٍ من اختياركم. |
| src/Area.tsx | Can we choose the songs? | هل يمكننا اختيار الأغاني؟ |
| src/Area.tsx | Yes. Send us your favorite songs and we'll make a customized setlist to your liking. | بالتأكيد. شاركونا أغانيكم المفضّلة، لنحضّر برنامجًا موسيقيًا يناسب ذوقكم. |
| src/Area.tsx | Which lineup is right for our room? | أي فرقة تناسب مساحة القاعة؟ |
| src/Area.tsx | It depends on your room and guest count. Tell us about your venue and we'll suggest a solo, duo or full band. | يعتمد الاختيار على مساحة المكان وعدد الضيوف. شاركونا تفاصيل القاعة، لنقترح عليكم عازفًا منفردًا أو ثنائيًا أو فرقة كاملة. |
| src/Area.tsx | More about our wedding music | المزيد عن موسيقى الأعراس |
| src/Area.tsx | Tell us your date, venue and guest count and we'll confirm availability and suggest the right lineup. A professional PA sound system is available for venues without in-house audio. | أرسلوا لنا تاريخ المناسبة ومكانها وعدد الضيوف، لنتأكّد من إمكانية الحجز ونقترح الفرقة المناسبة. ونوفّر نظامًا صوتيًا احترافيًا للقاعات غير المجهّزة بالصوت. |
| src/Area.tsx | Common questions | أسئلة شائعة |
| src/Area.tsx | Also performing in | للاستفسار عن حفلاتكم في |
| src/Area.tsx | Do you perform in ${city}? | هل يمكن حجز الفرقة في ${cityAr}؟ |
| src/Area.tsx | We take wedding and event bookings in ${city} and ${region}. Contact us with your date and venue and we'll confirm availability. | لمناسباتكم في ${cityAr} و${regionAr}، تواصلوا معنا مع ذكر التاريخ والقاعة لنتأكّد من إمكانية الحجز. |
| src/Area.tsx | Arabic Wedding Band in ${city}, MA | فرقة أعراس عربية في ${cityAr}، ماساتشوستس |
| src/Area.tsx | Nahawand Entertainment brings live Arabic and oriental music to weddings, engagement parties and private celebrations in ${city} and ${region}. Choose a solo musician, a duo or a full band, from the zaffa entrance to the last dance. | تخطّطون لعرس أو خطوبة أو حفلة خاصة في ${cityAr} أو ${regionAr}؟ مع نهاوند، اختاروا موسيقى عربية وشرقية حيّة ترافقكم من زفّة العروسين حتى آخر رقصة، بعازف منفرد أو ثنائي أو فرقة كاملة. تواصلوا معنا لمعرفة إمكانية الحجز. |
| src/Area.tsx | Live Arabic music for your ${city} wedding | موسيقى عربية حيّة لعرسكم في ${cityAr} |
| src/Area.tsx | Booking in ${city} | للحجز في ${cityAr} |

Additional location labels: «وستر»، «بوسطن»، «وسط ماساتشوستس»، «منطقة بوسطن الكبرى»، and the city/state label «وستر، ماساتشوستس» / «بوسطن، ماساتشوستس».

## Arabic metadata

| URL | Title | Description |
| --- | --- | --- |
| /ar/ | نهاوند \| فرقة موسيقية عربية للأعراس في نيو إنجلاند | موسيقى عربية حيّة وزفّة عروسين مع نهاوند. اختاروا عازفًا منفردًا أو ثنائيًا أو فرقة كاملة. لمناسباتكم في وستر وبوسطن ونيو إنجلاند، استفسروا عن موعدكم. |
| /ar/weddings/ | موسيقى عربية حيّة وزفّة أعراس \| نهاوند | من زفّة العروسين حتى آخر رقصة، حضّروا سهرتكم مع نهاوند بموسيقى عربية حيّة وأغانٍ من اختياركم. تواصلوا معنا لمعرفة إمكانية الحجز والتجهيزات المناسبة. |
| /ar/areas/worcester/ | فرقة أعراس عربية في وستر، ماساتشوستس \| نهاوند | تخطّطون لعرس أو حفلة في وستر أو وسط ماساتشوستس؟ تعرّفوا إلى موسيقى نهاوند وزفّة العروسين، وراسلونا بالتاريخ والمكان لمعرفة إمكانية الحجز. |
| /ar/areas/boston/ | فرقة أعراس عربية في بوسطن، ماساتشوستس \| نهاوند | تخطّطون لعرس أو حفلة في بوسطن أو منطقة بوسطن الكبرى؟ تعرّفوا إلى موسيقى نهاوند وزفّة العروسين، وراسلونا بالتاريخ والمكان لمعرفة إمكانية الحجز. |

Arabic reviews shell title: «التقييمات | نهاوند». Description: «آراء جمهور نهاوند وتجاربهم مع الموسيقى العربية الحيّة للأعراس والحفلات في نيو إنجلاند. شاركونا تجربتكم.»

Arabic JSON-LD service/business names: «نهاوند للموسيقى والحفلات»، «موسيقى عربية حيّة وزفّة أعراس»، «موسيقى عربية حيّة للأعراس في وستر، ماساتشوستس»، and «موسيقى عربية حيّة للأعراس في بوسطن، ماساتشوستس». Breadcrumb labels reuse «نهاوند للموسيقى والحفلات»، «الأعراس»، «وستر»، and «بوسطن». Service type is «موسيقى للأعراس»; descriptions match the corresponding Arabic page descriptions above.

## Verification

- `npx tsc --noEmit`: passed after the build completed.
- `npm run build`: passed, including SSR and prerendering.
- `node scripts/verify-prerender.mjs`: all eight content pages passed built-source checks for document language/direction, title, description, canonical, reciprocal language alternates, sitemap, SSR heading, localized footer/toggle and JSON-LD. Arabic and English `areaServed` values match exactly.
- Cloudflare local emulator (`wrangler dev --local`, no deployment): all eight content URLs returned their exact prerendered HTML. Unknown English and Arabic paths retained the existing home-page SPA fallback.
- Chrome at 1440px and 390px: checked all eight content pages, scrolled each, inspected Arabic page screenshots, and checked for horizontal page overflow, clipped headings/controls, wrong-language internal links and non-LTR contact details. These checks passed.
- Every page's language toggle passed an English/Arabic roundtrip and preserved the URL fragment. Stale localStorage language data did not override English URLs.
- Verified Arabic subpage booking navigation reaches `/ar/#contact`; public reviews toggle roundtrip passed through `/ar/reviews/` and `/reviews/`.
- No console errors, runtime errors, or hydration errors in the browser checks, including unknown-path fallbacks.
- Existing English translation values and layout class sequences were compared against the working-tree snapshot taken before this task; preserved.
- Additional 320px checks: Arabic pages fit. The unchanged English footer link row overflows by 15px on `/weddings/` and both area pages. This pre-existing layout limitation is documented rather than changing layout against the prompt.
- Preview review requests were intercepted with an empty list to exercise the empty state; the live reviews API and submissions were not tested.
- `git diff --check`: passed. No empty `ar: ""` values or localStorage language logic remain in `src/`.

Local preview: `http://localhost:4173/ar/` while the preview process remains running.
