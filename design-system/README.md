# Usina de Justicia — Design System

**Usina de Justicia** is a non-partisan Argentine civil association (Asociación Civil), founded on November 12, 2014 by philosopher Diana Cohen Agrest after the homicide of her son Ezequiel in 2011. It accompanies indirect victims (family members) of homicide and femicide committed in contexts of urban insecurity, advocates for victims' rights in the criminal process, and works to influence public policy and combat impunity.

Usina de Justicia operates several programs and sub-brands:
- **Usina de Justicia (UJ)** — the parent association. Website: `usinadejusticia.org.ar`.
- **IVUJUS — Instituto de Victimología de Usina de Justicia** — the research/training institute. Website: `ivujus.org.ar`. Runs the country's only Criminal Victimology course.
- **Observatorio de Víctimas** — a collaborative observatory monitoring victims' rights, participating with Cámara de Diputados de Santa Fe and CABA.
- **10 años transformando la Justicia** — anniversary/campaign lockup used in 2024.

The product this design system primarily supports is the **Plataforma web para gestión de base de datos y observatorio de víctimas** — a web platform for case-file management and a victims observatory (data dashboards, case records, public policy reporting).

## Source materials provided

No codebase, Figma file, or slide deck was attached. The system is derived from:
- Brand assets uploaded to this project (`uploads/`) — the UJ wordmark (gray + navy U/J mark), the IVUJUS mark (scales of justice over open book), and the 10-year anniversary lockup.
- Public-facing website: <https://usinadejusticia.org.ar/> (WordPress/Elementor — limited component reuse) and <https://ivujus.org.ar/>.
- Public reporting (Infobae, LinkedIn, Wikipedia, gobierno de BA) referenced for tone and mission.

Because there is **no source code and no Figma**, the platform UI kit in this system is a reasoned, brand-faithful proposal built from the logo palette and the institution's tone — not a recreation. Please treat it as a starting point to iterate on rather than a pixel-perfect copy of anything live.

---

## CONTENT FUNDAMENTALS

**Language.** All copy is Spanish (Argentine — rioplatense). Use seseo, no "vosotros". Use *vos* informally ("acompañamos", "te acompaña") in victim-facing copy, and *usted* / impersonal voice in institutional, policy, and judicial contexts.

**Tone.** Grave, dignified, accompanying, never sensationalist. Copy is written from a place of solidarity with victims' families ("muchos de quienes conformamos Usina estuvimos allí, en ese lugar oscuro"). It is also firm and technical when addressing policy, with a clear point of view (opposes "abolicionismo penal", defends "una justicia justa"). Never cheerful. Never corporate-optimistic. No exclamation marks in body copy.

**We vs. you.** Internal voice is first-person plural ("acompañamos", "trabajamos"). Addressed to the victim's family it is second-person singular informal ("te acompaña", "si perdiste a un ser querido"). Addressed to institutions it is impersonal/third-person.

**Casing.** Headlines in sentence case or ALL CAPS for short banner phrases (see "10 AÑOS TRANSFORMANDO LA JUSTICIA"). Full-caps is reserved for tight lockups and commemorative lines, never for body. Names of the programs are Title Case: *Acompañamiento a las Víctimas*, *Incidencia en Políticas Públicas*, *Capacitación, Actividades e Investigación*. The brand itself is often rendered **USINA DE JUSTICIA** in full caps in formal contexts, and *Usina de Justicia* in body.

**Emoji / slang.** None. No emoji. No colloquialisms. No exclamations. No emoji-as-icons. No "¡!" pairings in product UI.

**Numbers & dates.** Spanish conventions: dates as `12 de noviembre de 2014`, decimals with comma (`1.234,50`). Laws cited as `Ley 27.372` (dot thousand-separator).

**Examples (voice verbatim from corpus):**
- "Ante la pérdida de un ser querido por un hecho de inseguridad, **Usina de Justicia te acompaña**."
- "Testimonios que UJ comparte con la sociedad para 'dar voz a los que ya no la tienen'."
- "Trabajar por una Justicia Justa y respetuosa de los Derechos de las Víctimas."
- "¿Qué hacer en primer lugar?" — plain, direct, actionable section headers in interrogative form.

**Names of the deceased** are always written with full name and month + year of the homicide — never headline-ized, never abbreviated. This is a content rule the product UI must respect.

---

## VISUAL FOUNDATIONS

**Color vibe.** Institutional, sober, legal. A deep navy (`#1D437D`) carries 90% of the brand's weight. A warm neutral grey (`#A7A9AD`) is the only secondary — it appears in the U of the wordmark, as the "shadow" half of the monogram. White/cream backgrounds dominate. No gradients. No purples. No brand accent colors for decoration; any additional color is semantic (error red, success green) and muted, never saturated.

**Type.** The wordmark uses a geometric sans with a humanist U — closest free equivalent is **Nunito** (rounded geometric with friendly terminals) or **Mulish**. Body copy on usinadejusticia.org.ar uses a neutral sans (close to Open Sans / Nunito Sans). We adopt **Nunito** as the display/brand face and **Nunito Sans** for UI/body. This is a substitution — flag to the client and swap in the real font files if they exist.

**Spacing.** Calm, institutional. Generous paragraph spacing (1.6–1.75 line-height on body). 8px base unit, 4/8/12/16/24/32/48/64/96 scale. Never cramped.

**Backgrounds.** Predominantly white or a very light warm ivory (`#FAF8F5`). Full-bleed photography is used sparingly and with respect — never stylized, never grainy-filtered. Hand-drawn illustrations and textures are NOT part of the brand. No repeating patterns. No gradients.

**Animation.** Minimal. Fades (200–300ms, ease-out). No bounces. No spring physics. No parallax. This is an institutional, grief-aware brand — motion should never feel playful.

**Hover states.** Links darken to `#102A52` (navy-700). Buttons on hover go one shade darker on the fill; text-only links get an underline. No opacity hovers (they read as "disabled"). No color inversion on hover for primary buttons.

**Press states.** Buttons go another shade darker and drop their shadow. No scale transforms.

**Borders.** 1px solid, low-contrast (`#E5E5E8`). Focus rings are 2px navy (`#1D437D`) with a 2px white offset — accessibility-first.

**Shadows.** Two elevation levels only:
- `sm` — `0 1px 2px rgba(16,27,42,0.06)` — cards, inputs.
- `md` — `0 4px 16px rgba(16,27,42,0.10)` — menus, modals.
No heavy shadows. No inner shadows. No colored shadows.

**Layout.** Fixed header, scrollable body. Max content width 1200px for marketing, 1440px for the platform (data-heavy). Sidebars are 260–280px wide. Generous outer padding (32–48px).

**Transparency & blur.** Used only for modal scrims (`rgba(16,27,42,0.45)`), never decorative. No backdrop-blur glass effects.

**Imagery tone.** Warm, respectful, documentary. Portraits of victims are always presented with full name, date, and context — never cropped for "composition". Institutional photos lean warm, mid-contrast. No black-and-white filters. No grain. No duotones.

**Corner radii.** Moderate: `4px` inputs, `8px` cards/buttons, `12px` modals. Never fully-rounded pill shapes except for badges.

**Cards.** White fill, 1px border (`#E5E5E8`), 8px radius, `sm` shadow. No colored left-border accents. No rounded-pill highlights.

**Protection gradients.** Not used. Where text needs to sit over imagery, a solid semi-transparent navy block is preferred (`rgba(29,67,125,0.85)`).

---

## ICONOGRAPHY

Usina de Justicia does not ship a proprietary icon set. The public website uses generic Elementor/WordPress icons. For the platform UI kit we use **Lucide Icons** via CDN — stroke-based, 1.5px weight, rounded joins — because it reads as institutional/neutral and pairs well with Nunito.

- Style: **outline / stroke only**, 1.5–2px stroke, rounded caps and joins.
- Sizes: 16 / 20 / 24 px.
- Color: `currentColor`. Icons inherit the text color they sit next to.
- Never filled. Never duotone. Never emoji. No unicode-character icons (☆, ✓) in product UI — use Lucide equivalents (`star`, `check`).
- Flags used in the system: Lucide is a **substitution**. If the client has a preferred icon set, swap it in at `assets/icons/`.

Logos provided and in use:
- `assets/logo_uj.png` — primary UJ lockup (transparent, wordmark + monogram).
- `assets/logo_uj_white_bg.jpg` — same on white background.
- `assets/logo_ivujus.png` — IVUJUS institute mark (scales + book).
- `assets/logo_ivujus.jpeg` — IVUJUS on white.
- `assets/10anos.png` — "10 AÑOS TRANSFORMANDO LA JUSTICIA" commemorative lockup.

Illustration: none supplied and none invented. The brand does not use illustrated characters.

---

## Index

- `README.md` — this file.
- `SKILL.md` — Claude Code / Agent Skills entry point.
- `colors_and_type.css` — design tokens: color vars, type scale, semantic element styles.
- `fonts/` — (empty; fonts loaded from Google Fonts as a flagged substitution).
- `assets/` — logos and commemorative lockups.
- `preview/` — Design System tab cards (logos, color, type, spacing, components).
- `components/` — Componentes exportados en el bundle:
  - `Button` — botón primario/secundario/ghost/danger (`components/Button.jsx`)
  - `Badge` — etiqueta navy/ochre/neutral/solid (`components/Badge.jsx`)
- `ui_kits/plataforma/` — Proposed web platform UI kit (database + observatory).
  - `README.md` — kit overview and screens.
  - `index.html` — interactive click-through of core screens.
  - `*.jsx` — composable React components.

## Caveats

- **No codebase and no Figma** were provided for the platform. The UI kit is a brand-faithful *proposal*, not a recreation.
- **Fonts** are substituted with Nunito + Nunito Sans (Google Fonts). Please send the real typeface files if they differ.
- **Icons** are Lucide (CDN). Swap in proprietary set if one exists.
- The platform is described only as "gestión de base de datos y observatorio de víctimas" — I've assumed: case records, victim registry, dashboards, intake form, public observatory reports. Please confirm scope.
