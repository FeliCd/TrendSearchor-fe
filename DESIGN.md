---
name: TrendSearchor Digital Standard
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin: 40px
---

## Brand & Style

The brand personality is rooted in **Reliability, Analytical Depth, and Academic Innovation**. The design system is engineered to support scientific rigor while maintaining the velocity of modern data exploration. It facilitates the discovery of complex publication trends through a lens of clarity and precision.

The visual direction follows a **Corporate Minimalist** aesthetic with a focus on data-centric hierarchy. It utilizes high-quality whitespace to reduce cognitive load during deep-dive sessions, while maintaining a sophisticated, authoritative tone. The interface feels like a high-performance tool—utilitarian yet elegant—prioritizing the signal over the noise.

## Colors

The palette is anchored by **Deep Academic Blue**, providing a stable and authoritative foundation. **Science Blue** serves as the primary action color, guiding users through interactive elements and identifying focal points within data visualizations. 

For trend analysis, **Emerald Green** specifically denotes growth and positive velocity in publication frequency, while **Amber** highlights emerging topics that require attention. The background uses a specific light-gray wash (#F8FAFC) to differentiate the canvas from the white (#FFFFFF) surface of data cards, creating a natural depth without the need for heavy ornamentation.

## Typography

The typography utilizes **Inter**, a typeface specifically designed for computer screens and high-density data. The type scale is optimized for readability in academic abstracts and complex data tables.

- **Headlines:** Use tighter letter-spacing and heavier weights to provide clear section breaks.
- **Body Text:** Standardizes on a 16px base for long-form reading, with a 14px variant for denser sidebar content or metadata.
- **Labels:** Small-scale caps and medium weights are reserved for table headers and chart legends to ensure they remain legible at small sizes without distracting from the primary metrics.

## Layout & Spacing

The design system employs a **12-column fluid grid** for the main dashboard content. For desktop experiences, a fixed sidebar (280px) is recommended to house primary navigation, allowing the content area to scale dynamically.

- **Gutter & Margins:** A 24px gutter ensures data cards are distinct. Large 40px outer margins provide "breathing room" for the eyes, essential for high-concentration work.
- **Rhythm:** A 4px/8px base unit is used for all internal component padding.
- **Density:** In data-heavy views (like search results or publication lists), the vertical spacing can be reduced to `sm` (8px) to maximize the "above the fold" information density.

## Elevation & Depth

This design system uses **Tonal Layers** supplemented by **Ambient Shadows** to create a structured hierarchy. The goal is to make the interface feel organized and "clickable" without looking cluttered.

1.  **Background (Level 0):** #F8FAFC - The base canvas.
2.  **Cards/Surfaces (Level 1):** #FFFFFF - White surfaces with a soft, 1px border (#E2E8F0) and a subtle 4px blur shadow with 5% opacity.
3.  **Active/Hover State (Level 2):** Elevated shadows (8px blur, 10% opacity) to indicate interactivity.
4.  **Overlays/Modals (Level 3):** Deep shadows (16px blur) with a 20% background dimming (backdrop-filter: blur(4px)) to isolate critical workflows.

Avoid heavy gradients; depth should feel architectural rather than decorative.

## Shapes

The shape language is **Soft and Precise**. A 0.25rem (4px) corner radius is the standard for most components, including input fields, buttons, and small cards. This ensures the UI feels modern while maintaining the "sharp" look associated with professional scientific tools.

- **Standard Elements:** 4px (rounded-md)
- **Large Container/Dashboard Cards:** 8px (rounded-lg)
- **Interactive Tags/Chips:** 100px (rounded-full/pill) to distinguish them from data inputs.

## Components

### Buttons
- **Primary:** Solid Deep Academic Blue with white text. High contrast, sharp corners (4px).
- **Secondary:** Outlined Science Blue. Used for secondary actions within a card.
- **Ghost:** Science Blue text with no background. Used for tertiary actions like "Export" or "View Source."

### Data Cards
Every card must have a consistent header (Headline-sm) and a footer for metadata. Use the Level 1 Elevation. Cards should be used to encapsulate individual charts, journal metrics, or trend summaries.

### Input Fields
Strict, rectangular fields with a 1px border. Focus states must use a Science Blue 2px ring. Background should be #FFFFFF to pop against the #F8FAFC canvas.

### Status Chips
Small, pill-shaped indicators for "Trending Up," "Emerging," or "Declining." Use low-saturation backgrounds with high-saturation text (e.g., Light Emerald background with Dark Emerald text) to ensure accessibility while maintaining the data-centric vibe.

### Data Tables
Tables should use "zebra-striping" on hover only. Use `label-sm` for headers to maximize horizontal space. Ensure 16px horizontal padding within cells for readability.