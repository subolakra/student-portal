# Design Brief

## Direction

Professional Editorial — Clean, modern, content-focused. Institutional dashboard inspired by Linear and Notion, tailored for academic portal use.

## Tone

Restrained, professional, serious. This is an academic tool emphasizing clarity and trust without sterility.

## Differentiation

Bold sidebar with geometric display typography hierarchy. Accent color used sparingly for CTAs and status badges. Content-first, spacious layout.

## Color Palette

| Token      | OKLCH            | Role                              |
|------------|------------------|-----------------------------------|
| background | 0.99 0.005 260   | Light page background             |
| foreground | 0.15 0.01 260    | Primary text, high contrast       |
| card       | 1.0 0.0 0        | Card surfaces, white              |
| primary    | 0.45 0.18 265    | Deep indigo, CTAs, active states  |
| accent     | 0.6 0.16 25      | Warm terracotta, alerts, deadlines|
| muted      | 0.95 0.01 260    | Subtle backgrounds, inactive      |
| border     | 0.9 0.01 260     | Dividers, subtle separators       |

## Typography

- Display: Space Grotesk — geometric, modern, headings and hero text
- Body: General Sans — refined, professional, paragraphs and UI labels
- Mono: JetBrains Mono — code, dates, academic IDs
- Scale: hero `text-5xl font-bold tracking-tight`, h2 `text-3xl font-semibold`, labels `text-sm font-semibold uppercase`, body `text-base`

## Elevation & Depth

Subtle, intentional layering. Cards have light neutral shadows (shadow-sm) and discrete 1px borders. No decorative glows or heavy shadows.

## Structural Zones

| Zone    | Background              | Border        | Notes                                      |
|---------|-------------------------|---------------|--------------------------------------------|
| Header  | bg-card with border-b   | border-border | User greeting, current role, logout        |
| Sidebar | bg-sidebar, dark neutral | sidebar-border| Navigation sections, logo, role indicator  |
| Content | bg-background, light    | —             | Spacious, card-based layout                |
| Cards   | bg-card, white          | border-border | Subtle shadow-sm, 1px border               |
| Footer  | bg-muted/5              | border-t      | Optional footer section if needed          |

## Spacing & Rhythm

Generous spacing emphasizes content hierarchy. Section gaps: 2rem. Content grouping: 1.5rem. Micro-spacing within cards: 1rem. Mobile-responsive density with `sm:`, `md:` breakpoints.

## Component Patterns

- Buttons: primary indigo bg-primary text-white, hover:bg-primary/90, rounded-lg, no shadows
- Cards: bg-card border border-border rounded-lg shadow-sm, hover:shadow-md transition-smooth
- Badges: accent color for urgent items (deadlines), success color for accepted, warning for pending
- Tabs/Lists: clean underlines, no heavy backgrounds

## Motion

- Entrance: fade-in on load, staggered card reveals (optional)
- Hover: subtle shadow lift (shadow-sm → shadow-md), text color shift for interactive elements
- Transitions: `transition-smooth` (0.3s cubic-bezier) for all interactive changes

## Constraints

- No gradients, no decorative animations, no glassmorphism
- Maximum 1px borders, no double borders or excessive outlines
- Monochrome sidebar with one accent color for active state
- All text high-contrast for accessibility (AA+ verified)
- Sidebar collapses to hamburger on mobile (<md breakpoint)

## Signature Detail

Geometric Space Grotesk headings paired with refined General Sans body creates institutional confidence. Terracotta accent on deadline badges provides subtle urgency without aggression.
