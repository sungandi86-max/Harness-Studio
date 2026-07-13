# Harness Studio Design System

## 1. Atmosphere & Identity

Harness Studio is a quiet personal AI workroom: focused, premium, and practical without feeling cold. The signature is a dark navy layered desk surface with soft mint action highlights and a small friendly character nook that can later receive the Sookang otter artwork.

## 2. Color

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Surface/base | `--surface-base` | `#050812` | App background |
| Surface/rail | `--surface-rail` | `#080d1b` | Sidebar and mobile navigation |
| Surface/panel | `--surface-panel` | `#0d1324` | Main panels |
| Surface/card | `--surface-card` | `rgba(255,255,255,0.045)` | Cards and inputs |
| Surface/card-hover | `--surface-card-hover` | `rgba(255,255,255,0.075)` | Hovered cards |
| Text/primary | `--text-primary` | `#f7fbff` | Main copy |
| Text/secondary | `--text-secondary` | `#c6d2e4` | Supporting copy |
| Text/muted | `--text-muted` | `#7f8aa0` | Metadata |
| Border/subtle | `--border-subtle` | `rgba(255,255,255,0.08)` | Hairline borders |
| Accent/primary | `--accent-primary` | `#8ff4d1` | Primary actions and focus |
| Accent/secondary | `--accent-secondary` | `#7c89ff` | Active navigation |
| Status/success | `--status-success` | `#5ee6bd` | Completed states |
| Status/warning | `--status-warning` | `#f8c76c` | Due or paused states |
| Status/error | `--status-error` | `#ff8a9a` | Destructive feedback |

Accent is used for actions and state, not decoration. The app should never become a one-note purple or neon dashboard.

## 3. Typography

Primary stack: system UI with Apple-first rendering. Mono stack: `ui-monospace`, `SFMono-Regular`, `Menlo`, `monospace`.

| Level | Size | Weight | Line Height | Usage |
| --- | --- | --- | --- | --- |
| Display | 32px | 650 | 1.18 | Home greeting |
| H1 | 28px | 650 | 1.2 | Page titles |
| H2 | 20px | 620 | 1.35 | Section headers |
| H3 | 16px | 620 | 1.45 | Card titles |
| Body | 15px | 400 | 1.65 | Reading text |
| Body/sm | 13px | 400 | 1.55 | Secondary text |
| Caption | 12px | 560 | 1.4 | Metadata and pills |

Korean copy must wrap naturally. Buttons and cards keep text at readable sizes and avoid compressed letter spacing.

## 4. Spacing & Layout

Base unit is 4px. Page gutters are 16px mobile, 24px tablet, 32px desktop. Desktop uses a left sidebar, top tool area, and responsive 3-column content grids. Mobile uses a compact top header and bottom navigation with single-column cards.

## 5. Components

### App Shell
- Structure: sidebar, top search/quick actions, main content, mobile bottom nav.
- States: active navigation uses mint text and a subtle inset surface.
- Accessibility: nav landmarks and icon labels are required.

### Surface Card
- Structure: rounded panel with hairline border, subtle transparent fill, title, metadata, action row.
- Variants: standard, compact, feature, danger.
- States: hover lifts luminance only; focus uses mint outline.

### Button
- Variants: primary mint, secondary glass, ghost, danger.
- States: hover, active, focus, disabled.
- Accessibility: native `button` for actions, `a` for external URLs.

### Form Field
- Structure: label, input/textarea/select, helper or error text.
- States: default, focus, error.
- Accessibility: visible label and error text.

### Command Palette
- Structure: modal dialog with search field and grouped results.
- States: open, empty, focused result.
- Accessibility: Escape closes; input receives focus on open.

## 6. Motion & Interaction

Motion is quiet and functional. Durations use 140ms for hover/press and 220ms for modal entry. Animate only opacity and transform. Respect `prefers-reduced-motion`.

## 7. Depth & Surface

Depth strategy is mixed but restrained: translucent cards, thin borders, very soft shadows on overlays only. No large neon glows, bokeh orbs, or decorative gradient blobs.
