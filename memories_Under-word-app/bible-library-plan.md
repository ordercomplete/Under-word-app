# План: бібліотека канонічних текстів (оригінали + переклади)

Статус: **затверджено**, виконання покрокове.
Дата створення: 01.09.2026
Плани проєкту зберігаються в `memories_Under-word-app/` (домовленість).

---

## Крок 0 (Виконано). Видалення перекладу SIRYY ✅

Видалено повністю, згадок не залишилось (перевірено `git grep -i siryy` → 0):

1. `public/data/translations.json` — запис `"initials": "SIRYY"` (bibles: 11 → 10)
2. `public/data/core.json` — секція `"SIRYY"` (книги/розділи)
3. `public/data/translations/siryy/` — каталог даних (gen1_siryy, mat1_siryy, mat6_siryy)
4. `src/utils/dictionaryLoader.js` — мапінг `SIRYY: "uk"`
5. `scripts/config-template.js` — `"siryy"` зі списку конвертації
6. `scripts/convertTranslations.js` — `"siryy"` у списку та мапінгу мов
7. `README.md` — рядок таблиці версій
8. `structure.md` — секція структури каталогів
9. `public/data/FAQ/FAQ-kontseptsiya-Under-word-app.md` — «Сірий» з переліку перекладів

Валідація: JSON валідні, `npm run build` успішний.

---

## Крок 1. Реєстр джерел (`tools/bible-builder/sources.json`)

Кожна версія: `{ initials, testaments, basedOn, mode: "auto"|"manual", source: {url, format, parser}, license }`.

### Підтверджені auto-джерела (перевірено)

| Версія | Джерело | Формат | Ліцензія |
|---|---|---|---|
| THOT | github.com/STEPBible/STEPBible-Data → каталог **«Translators Amalgamated OT+NT»** (TAHOT) | TSV (one-line records), Strong's + морфологія | CC BY 4.0 |
| TR | github.com/byztxt/greektext-textus-receptus → `parsed/` | TSV, грецький текст + Strong's + парсинг | Public Domain |
| GNT | github.com/morphgnt/sblgnt → `61-Mt-morphgnt.txt` тощо | TSV: book/chapter/verse, текст, normalized, lemma, POS, parsing; **Strong's немає** → мапінг lemma→Strong's через Dodson lexicon | CC BY-SA (текст SBLGNT — EULA) |
| KJV | api.getbible.net/v2/`<abbr>`/`<book>/<chapter>.json` (точний абревіат — уточнити у translations.json API) | JSON | Public Domain |
| SYNODAL | getbible.net v2 — витягнути ключі з `lang: "ru"` | JSON | Public Domain |
| OGienKO | getbible.net v2 — витягнути ключі з `lang: "uk"`; фолбек: Вікіджерела/ukrbible.at.ua | JSON |Public Domain |

### Частково перевірені / застереження

| Версія | Джерело | Застереження |
|---|---|---|
| LXX | github.com/sleeptillseven/LXX-Swete (CC BY-SA, на базі First1KGreek) | Готово лише **17/59 книг** — перевірити наявність GEN; фолбек: ручне копіювання з academic-bible.com / biblehub.com/lxx / CCAT |

### Ручні джерела (mode: "manual")

| Версія | Джерело для копіювання |
|---|---|
| UTT (Турконяк) | ukrbs.org (онлайн-читання), bible.com (УТТ) |
| UBT | ukrbs.org, ukrbible.at.ua |
| KHOMENKO | ukrbible.at.ua, bible.net.ua, електронні видання «Римської Біблії» |

Механізм ручного режиму: користувач копіює текст розділу у файл
`tools/bible-builder/sources/raw/<VER>/<Test>/<BOOK>/<book><ch>.txt`
(формат: `1 Текст вірша`, по одному віршу на рядок). Конвертер сам будує
структурований JSON — ручна праця лише в копіюванні тексту.

`check-sources.js` генерує звіт: `✅ auto (URL)` / `⚠️ частково` / `❌ manual —
очікувані файли: <список шляхів>`.

---

## Формат базових канонічних raw-файлів (проміжний формат)

Ключовий принцип: **конвертери працюють тільки з raw-форматом**, а не з джерелами
напряму. `download.js` приводить будь-яке auto-джерело до одного з двох raw-форматів;
ручне копіювання (UTT/UBT/KHOMENKO) дає той самий вхід. Один вхід → один код
конвертації та валідації.

### Розташування

```
tools/bible-builder/sources/raw/<VER>/<Test>/<BOOK>/<book><chapter>.<ext>
  приклади: sources/raw/THOT/OldT/GEN/gen1.tsv
            sources/raw/UTT/OldT/GEN/gen1.txt
            sources/raw/UTT/NewT/MAT/mat1.txt
```
Імена синхронізовані з існуючими JSON: `gen1.txt` → `gen1_utt.json`.

### Формат 1: `.txt` — текстовий (переклади, зокрема ручне копіювання)

```text
# UTT | GEN.1 | Український переклад з LXX
1 На початку створив Бог небо і землю.
2 А земля була безвидна і порожня, і темрява була над безоднею, ...
```

Правила парсингу (`convert-translation.js`):
- Рядок вірша: `^\s*(\d{1,3})[.)]?\s+(.+)$` → номер вірша + текст.
  Продовження вірша на наступних рядках конкатенується з пробілом
  до наступного номера.
- Рядки з `#` (коментарі/метадані) та порожні — ігноруються.
- Кодування UTF-8 (без BOM), CRLF/LF — не важливо.
- `ws` будуються сплітом по пробілах → `{ "w": "<слово>" }` (без `s/l/m` —
  сумісно з рендером); вирівнювання на Strong's — окремо `align.js` (крок 4).

### Формат 2: `.tsv` — слово-рівневий (оригінали з Strong's; переклади з відомим вирівнюванням)

```text
#book	chapter	verse	word	strong	lemma	morph
GEN	1	1	בְּרֵאשִׁית	H7225	רֵאשִׁית	N-cfs
GEN	1	1	בָּרָא	H1254	בָּרָא	V-qal-Perf-3ms
```

- Один рядок = одне слово; перший рядок з `#` — заголовок (опційний,
  порядок колонок зафіксований).
- `strong` обов'язковий для оригіналів: `^[GH]\d{4,5}$` (ведучі нулі як у
  наявних файлах — `H0430`, `G1722`); `lemma`/`morph` — опційні.
  Для перекладів `lemma` = слово базового оригіналу (як у `gen1_ogienko.json`).
- Ціль викачування: STEPBible TAHOT, byztxt TR, SBLGNT мають word/lemma/
  morph/Strong's-колонки — приводяться до цього формату майже 1:1.

### Правила перевірки (`verify.js`) raw-файлів та результатів

1. **Versification проти `core.json`**: номери віршів суцільні 1..N,
   кількість віршів розділу в межах очікуваного (GEN.1 = 31, MAT.1 = 25).
2. **Крос-версійна узгодженість**: множина віршів розділу в оригіналі ==
   множина віршів у кожному перекладі на його базі (розбіжності → звіт).
3. **Формат Strong's**: regex `^[GH]\d{4,5}$` для всіх `s`; дублікати номерів
   у межах вірша — warning, не помилка (буває легітимно).
4. **Повнота**: кількість `ws` у JSON = кількості слів у raw; жоден вірш
   не втратив слова.
5. **Еталон структури**: наявні рукотворні `gen1_*.json` (GEN.1) — санітарний
   еталон полів `_meta.info` і порядку `w/s/l/m`.

---

## Крок 2. Інструменти (`tools/bible-builder/`)

```
sources.json           # реєстр версій (вище)
check-sources.js       # крок 0: звіт доступності всіх джерел
download.js            # крок 1: auto-джерела → sources/raw/... (текст по розділах)
convert-original.js    # крок 2: raw → JSON оригіналів (w/s/l/m, Strong's)
convert-translation.js # крок 3: raw → JSON перекладів
align.js               # крок 4: вирівнювання слів перекладу на Strong's базового оригіналу
verify.js              # крок 5: versification vs core.json, кількість віршів, формат H/G номерів
```

Без нових npm-залежностей (вбудований fetch у Node 18+).
Запуск: `node tools/bible-builder/download.js --version THOT --book GEN --chapter 1`.

## Крок 3. Перша ітерація: GEN.1 + MAT.1

1. `check-sources.js` → звіт по всіх версіях.
2. `download.js` → сирі тексти GEN.1 (THOT, LXX, усі OldT-переклади) та MAT.1 (TR, GNT, усі NewT-переклади).
3. `convert-original.js` → THOT GEN.1, TR MAT.1, GNT MAT.1 (LXX — якщо GEN є в джерелі).
4. `convert-translation.js` + `align.js` → KJV, SYNODAL, OGienKO (auto); UTT/UBT/KHOMENKO — після ручного копіювання raw-файлів.
5. `verify.js` → контроль versification та кількості віршів (GEN.1 = 31, MAT.1 = 25).
6. Перевірка в застосунку: інтерлінеар, Strong's-підказки, лексикон.

## Крок 4. Масштабування

Після валідації першої ітерації — прогін по всіх розділах усіх книг
(список з `core.json`: коди, назви, кількість розділів), версія за версією.

## Відкриті питання

- Ліцензії українських перекладів (UTT/UBT/KHOMENKO) — ок для локального використання, перевірити перед публікою.
- Versification LXX відрізняється в окремих місцях — врахувати remap.
- Вихідний формат у застосунку: `{ _meta: {info...}, verses: [{ v, ws: [{ w, s, l, m }] }] }`
  — у перекладах `s`/`l` = Strong's і слово базового оригіналу (`basedOn`).

## Супутні технічні борги (окремо, не блокує)

- Кешувати порожні результати глав не можна (`PassagePage.js`, Promise.all → setCache).
- Мутація стану: `initialVersions.sort()` / `panelVersions.sort()` → копії.
- Регістр папок даних: `THOT`/`GNT`/`KJV` великими літерами vs шляхи в нижньому — 404 на Linux.
- `translations.json`: Khomenko `"path": "translations/jhomenko"` → typos, має бути `khomenko`.
