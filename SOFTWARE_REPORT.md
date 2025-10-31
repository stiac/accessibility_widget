# Software Report

- **Project**: Accessibility Plugin
- **Version**: 1.4.12
- **Maintainer**: Praboth Charith
- **Last Update**: 2025-11-04

## Module Status
- **Menu Rendering**: Completed
- **Control Handlers**: Completed (refreshed in v1.3.0)
- **Persistence Layer**: Completed
- **Testing**: Planned (manual regression required)

## Recent Activities
- 2025-11-04 — Reworked the Font Size control so it leaves `<html>` and the accessibility modal untouched while scaling host content, removing the stray `--acc-modal-scale` effect (AI assistant)
- 2025-11-03 — Limited the Hide Images background stripping logic to URL-driven assets so branded sections keep their gradients while inline media is still removed (AI assistant)
- 2025-11-02 — Updated the font-size registry to reject the accessibility modal so the widget keeps its original typography while the host site scales (AI assistant)
- 2025-11-01 — Restored browser-default inline rendering for host audio, canvas, embed, iframe, img, object, svg, and video elements when the fallback Tailwind CDN is injected, keeping widget icons block-level while preventing host layout regressions (AI assistant)
- 2025-10-31 — Restored inline SVG rendering for host pages when the fallback Tailwind CDN is injected, preventing layout regressions triggered by the preflight reset (AI assistant)
- 2024-06-29 — Added a data attribute and CSS variables so the font-size control applies the scaled pixels to `<html>` and `<body>`, keeping the accessibility modal balanced via the stored root value (AI assistant)
- 2024-06-28 — Reapplied font scaling using the page's baseline pixel sizes so `<html>` and `<body>` grow together while the accessibility modal counter-balances through the root variable (AI assistant)
- 2024-06-27 — Captured the applied font-scale on `<html>` and counter-scaled the accessibility widget so the font-size tool enlarges page content without distorting the modal (AI assistant)
- 2024-06-26 — Switched the Font Size control to percentage-based root sizing so rem/Tailwind typography scales consistently across the host site (AI assistant)
- 2024-06-24 — Forced the Font Size control to apply with inline `!important` styles on `<html>` and `<body>` so typography scaling covers the whole site (AI assistant)
- 2024-06-23 — Refined the modal animation, darkened progress indicators, and restored full-page cursor overlays (AI assistant)
- 2024-06-22 — Restyled the accessibility menu with Tailwind CSS and added automatic CDN loading for consistent visuals (AI assistant)
- 2024-06-21 — Added Stiac Web Services branding badge, dataset metadata, and console notice to assert proprietary ownership (AI assistant)
- 2024-06-20 — Extended Hide Videos support to iframe/embed/object integrations and documented opt-in/out attributes (AI assistant)
- 2024-06-19 — Expanded Hide Images coverage to include inline media and CSS backgrounds (AI assistant)
- 2024-06-18 — Fixed syntax error preventing direct `<script>` usage (AI assistant)
- 2024-06-17 — Refined progress indicator handling and text alignment icon syncing (AI assistant)
- 2024-06-17 — Normalized cursor state synchronization (AI assistant)

## Risks & Notes
- Missing automated tests means regressions must be caught with manual QA.
- Minified bundle is not regenerated automatically; ensure manual build when publishing.

## Dependencies
- No runtime dependencies.

## Economic Report
- Not tracked.
