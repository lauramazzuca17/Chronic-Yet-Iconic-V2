# Design brief — Analytics (visual fidelity)

**Updated:** 2026-08-17

**Figma file:** CYI — V2 (`WkhupgI4GcrvhLPqJV4T7d`)

Binding frames:
1. Full Analytics page — `62816:27151`
2. Main (brand5 fill) — `62816:27152`
3. Chip strip — `62923:4123`
4. Medication card + controls — `62819:29845`
5. Electrolytes main — `62967:5994`

---

## As built — Main + chips (2026-08-17)

Tokens live in `src/analytics/layout.ts`.

| Property | Value |
| --- | --- |
| Main fill | brand5 `#082e33` (shell content area + `<main>`) |
| Chip strip | sticky, opaque `#082e33`, pl 16 / py 10, gap 8, elevation `0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)` |
| Selected chip | brand8 `#839755`, white 14/18 Geist, px 12 / py 4, radius 100 |
| Idle chip | brand2 `#0b4041`, white 14/18 |
| Hit target | 26px visual inside 44px expanded tap |

## As built — Medication card (`62819:29845`)

| Property | Value |
| --- | --- |
| Card | white, radius 10, pad 16, intro→chart gap 26 |
| Title | 16/20 medium `#000` |
| Helper | 12/18 `#5c5c60`, 4px under title |
| Date control | `62948:2214` one capsule: 32px, radius 50, `#c7c7cc` stroke; **white** 31.5px end caps (owner screenshot vs isolated-node fill); white center with 14×16 calendar + centered `MM/DD/YYYY` 12/18 `#1d1b20`; chevrons 7.4×12 in a 24px clip |
| Compare / with | 12/18 `#5c5c60`; Compare select stays enabled; empty label **Medication** |
| Pill selects | max 122×32, radius 100, 12/18 `#1d1b20`; trailing caret 10×5 in a 24px clip (`62923:4168`); shrink/wrap so they stay inside the card |
| Chart frame | 180px, `#f2f2f7`, dashed `#d1d1d6`, radius 10 |

Slot list (`analytics-med-slot-*`) is visually clipped (a11y/E2E fallback). E2E asserts `toBeAttached`.

## As built — Cardiovascular (`62953:4603` / `62953:4604`)

| Property | Value |
| --- | --- |
| Chart 2 card | pad 16, radius 10, gap 16 between intro-block and chart |
| Intro → range switch | 16px |
| Range switch | full-width pill, 4px pad, `#d1d1d6` stroke, radius 100; selected brand2 `#0b4041` white 12/18 medium; idle white `#1d1b20` |
| Chart 3 helper → chart | 16px (card gap) |
| Disclaimer | `#f2f5ed`, radius 8, pad 18/16; 16px circle-exclamation; title 18/22 medium `#367057`; body 14/18 `#1d1b20` |
| ≥100 copy | **kept** (owner lock; Figma shows `>`) |

## As built — Recovery (`62957:4735` / `62959:4803`)

| Property | Value |
| --- | --- |
| Card rhythm | same as Chart 2: pad 16, intro→switch 16px, card gap 16px |
| Range switch | shared Switch Group (HRV: Today/7/30; Walking: Last 7 / Last 30 only) |
| Chart frame | 180px |
| What your HRV shows | sage callout matching Data Disclaimer (`#f2f5ed`, circle-exclamation, brand4 18/22 title, 14/18 body `#1d1b20`) |

## As built — Electrolytes (`62967:5994`)

| Property | Value |
| --- | --- |
| Tab intro | 28/36 Geist Black white title; helper 12/18 white, max 229px (wraps to two lines) |
| Hero | square tile stretches to intro height; `rgba(255,255,255,0.15)` radius 8; pad 12/12/8/10; drink glyph **56×54** (`electrolytes-drink.svg`) |
| Cards | white, radius 10, pt 14 / px 16 / pb 16, inner gap 22; 8px between cards |
| Header icons | 60×60 sage `rgba(131,151,85,0.17)` radius 8; With glyph **44×44** (8px pad); Without glyph **50×50** (5px pad) |
| Metric tiles | 45×45 radius 8, 8px pad, glyph **29×29**; HR purple / Resting blue / Walking orange / BP red at 17% |
| Metric type | label 14/18 medium `#1d1b20`; value 18/22 semibold; unit 12/18 `#79747e` |
| Divider | 1px `#d1d1d6` on the left cell of each row |

## Favicon

Owner PNG (orange koi, teal outline, black ground) at `public/favicon.png`. Metadata + `/favicon.ico` rewrite point at the PNG.
