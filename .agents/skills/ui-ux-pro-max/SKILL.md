---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web, mobile, and desktop. This skill should be used when designing, building, reviewing, or fixing interfaces, including pages, components, design systems, accessibility, interaction, responsive layout, typography, color, charts, and stack-specific UI implementation. Searchable local data: 80 searchable styles (51 active), 192 product palettes and reasoning profiles, 74 font pairings, 120 UX guidelines, 105 icons, 17 GSAP presets, 25 chart types, and 22 stacks."
---

# UI/UX Pro Max - Design Intelligence (Enhanced for Google Antigravity)

Searchable local UI/UX guidance: 80 searchable styles (51 active), 192 product palettes and exact reasoning profiles, 74 font pairings, 120 UX guidelines, 105 curated icons, 17 GSAP presets, 25 chart types, and 22 technology stacks.

## When to Apply

Use this Skill when the task involves **UI structure, visual design decisions, interaction patterns, or user experience quality control**: designing new pages, creating/refactoring UI components, choosing color/typography/spacing/layout systems, reviewing UI for UX/accessibility/consistency, implementing navigation/animation/responsive behavior, or improving perceived quality and usability.

Skip it for pure backend logic, API/database design, non-visual performance work, infrastructure/DevOps, or non-visual scripts — unless the task changes how something **looks, feels, moves, or is interacted with**.

## Rule Categories by Priority

*Follow priority 1→10 to decide which category to focus on first; use `--domain <Domain>` to query full details. The full rule text for every category lives in `references/quick-reference.md` — read it on demand rather than loading it every time.*

| Priority | Category | Impact | Domain | Key Checks (Must Have) | Anti-Patterns (Avoid) |
|----------|----------|--------|--------|------------------------|------------------------|
| 1 | Accessibility | CRITICAL | `ux` | Contrast 4.5:1, Alt text, Keyboard nav, Aria-labels | Removing focus rings, Icon-only buttons without labels |
| 2 | Touch & Interaction | CRITICAL | `ux` | Min size 44×44px, 8px+ spacing, Loading feedback | Reliance on hover only, Instant state changes (0ms) |
| 3 | Performance | HIGH | `ux` | WebP/AVIF, Lazy loading, Reserve space (CLS &lt; 0.1) | Layout thrashing, Cumulative Layout Shift |
| 4 | Style Selection | HIGH | `style`, `product` | Match product type, Consistency, SVG icons (no emoji) | Mixing flat & skeuomorphic randomly, Emoji as icons |
| 5 | Layout & Responsive | HIGH | `ux` | Mobile-first breakpoints, Viewport meta, No horizontal scroll | Horizontal scroll, Fixed px container widths, Disable zoom |
| 6 | Typography & Color | MEDIUM | `typography`, `color` | Base 16px, Line-height 1.5, Semantic color tokens | Text &lt; 12px body, Gray-on-gray, Raw hex in components |
| 7 | Animation | MEDIUM | `ux`, `gsap` | Context-aware timing, Motion conveys meaning, Spatial continuity | One duration for every transition, Animating width/height, No reduced-motion |
| 8 | Forms & Feedback | MEDIUM | `ux` | Visible labels, Error near field, Helper text, Progressive disclosure | Placeholder-only label, Errors only at top, Overwhelm upfront |
| 9 | Navigation Patterns | HIGH | `ux` | Predictable back, Bottom nav ≤5, Deep linking | Overloaded nav, Broken back behavior, No deep links |
| 10 | Charts & Data | LOW | `chart` | Legends, Tooltips, Accessible colors | Relying on color alone to convey meaning |

For the full rule list per category (all 120 UX guidelines with rationale), read `references/quick-reference.md`. For app-specific polish rules (icons, touch feedback, dark mode contrast, safe areas) and the canonical pre-delivery checklist, read `references/pro-rules.md`.

---

## Running the search tool in Antigravity

The search script runs locally with zero external dependencies (pure Python standard library). Invoke it via PowerShell:

```powershell
# Preferred: Workspace-relative path
python .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>

# Fallback: Global installation path
python "$HOME\.gemini\config\skills\ui-ux-pro-max\scripts\search.py" "<query>" --domain <domain>
```

If `python` is not found, try `py -3` or `python3`.

## Workflow

### Query Contract

Choose the smallest search mode that fits the request:
1. **New project/page or system-wide visual direction** → use `--design-system`.
2. **Targeted concern or component bug** → use one explicit `--domain`.
3. **Known implementation stack** → use `--stack`; add a separate domain search only for a distinct design concern.

Build each query around **one dominant intent**, using **2–5 meaningful terms** and one useful constraint such as product, platform, or interaction. Verify the returned domain/category, top result identity, and fit for the user's product and platform before applying it.

### Step 1: Analyze Requirements
- **Product type**: SaaS, e-commerce, portfolio, dashboard, entertainment, tool, productivity, beauty/wellness, etc.
- **Target audience & context**: age group, device usage context.
- **Style keywords**: playful, vibrant, minimal, dark mode, content-first, immersive, etc.
- **Stack**: detect from the project (`package.json`, `pubspec.yaml`, `html-tailwind`, `react`, `shadcn`, etc.).

### Step 2: Generate Design System
```powershell
python .agents/skills/ui-ux-pro-max/scripts/search.py "<product_type> <keywords>" --design-system -p "Project Name"
```

### Step 2b: Persist Design System (Master + Overrides Pattern)
To save the design system across sessions, add `--persist` and point `--output-dir` at the project root:
```powershell
python .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --output-dir "."
```
This generates:
- `design-system/<project-slug>/MASTER.md` — Global Source of Truth
- `design-system/<project-slug>/pages/` — Page-specific overrides

### Step 2c: Design Dials (Optional Tuning)
Tune typography/spacing/variance on a 1-10 scale:
```powershell
python .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --variance 8 --motion 7 --density 8 -p "Project Name"
```
- `--variance`: (1-3 Minimalist, 4-7 Modern, 8-10 Bento/Brutalist)
- `--motion`: (1-3 Subtle, 4-7 Standard Stagger, 8-10 Complex Choreography)
- `--density`: (1-3 Spacious 24-96px, 4-7 Standard 16-64px, 8-10 Dense Dashboard 8-32px)

### Step 3: Targeted Search by Domain
```powershell
python .agents/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain>
```
Domains: `product`, `style`, `color`, `typography`, `google-fonts`, `chart`, `ux`, `landing`, `icons`, `gsap`, `react`, `web`.

### Step 4: Stack Guidelines
```powershell
python .agents/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack <stack>
```
Stacks supported: `react`, `nextjs`, `vue`, `svelte`, `astro`, `nuxtjs`, `nuxt-ui`, `angular`, `laravel`, `swiftui`, `react-native`, `flutter`, `jetpack-compose`, `html-tailwind`, `shadcn`, `threejs`, `javafx`, `wpf`, `winui`, `avalonia`, `uno`, `uwp`.

---

### Step 5: Antigravity Generative UI Integration (Interactive Previews)

When designing a UI component or page system in Antigravity, combine `ui-ux-pro-max` with Antigravity's **Generative UI (`generative_ui`)** skill:
1. Extract the resolved CSS color tokens, Google Font `@import`, and component patterns from `search.py`.
2. Generate a standalone `.html` artifact in the conversation artifact directory (`<appDataDir>\brain\<conversation-id>/widget.html`) using Tailwind CSS:
   ```html
   <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
   ```
3. Embed an interactive live preview inline in the chat:
   ```html
   <agent-embed src="file:///<artifact_path>/widget.html"></agent-embed>
   ```
4. This delivers both the production code and a live interactive preview directly in the conversation.

---

## Pre-Delivery Checklist
Before delivering final UI code:
- [ ] No emojis as icons (use Lucide / Phosphor / SVG)
- [ ] Tap target >=44pt iOS / >=48dp Android / 24px Web pointer
- [ ] Light & dark mode contrast >=4.5:1 for normal text
- [ ] `prefers-reduced-motion` respected
- [ ] Active/pressed state transitions between 150-300ms
- [ ] Visible focus rings on all interactive elements
- [ ] Mobile-first responsive checkpoints: 375px, 768px, 1024px, 1440px
