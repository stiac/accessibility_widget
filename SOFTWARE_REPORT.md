# Software Report

- **Project**: Accessibility Plugin
- **Version**: 1.4.26
- **Maintainer**: Praboth Charith
- **Last Update**: 2025-11-18

## Module Status
- **Menu Rendering**: Completed
- **Control Handlers**: Completed (refreshed in v1.3.0)
- **Persistence Layer**: Completed
- **Testing**: Planned (manual regression required)

## Recent Activities
- 2025-11-18 — Embedded OpenDyslexic regular and bold fonts as data URIs so the dyslexia-friendly toggle no longer depends on cross-origin hosts or trips CORS policies (AI assistant)
- 2025-11-17 — Pointed the dyslexia-friendly font loader at the upstream Forge repository so OpenDyslexic downloads succeed without 404s while retaining swap behaviour (AI assistant)
- 2025-11-16 — Re-routed the dyslexia-friendly font loader to GitHub-hosted OpenDyslexic assets so the toggle no longer produces 404 errors and typography switches immediately (AI assistant)
- 2025-11-15 — Delivered a dyslexia-friendly font toggle that loads OpenDyslexic from CDN, applies the stack to host content only, and persists the preference to meet WCAG 2.1 Level A/EAA expectations (AI assistant)
- 2025-11-14 — Added a Reduce Motion control that pauses CSS animations, smooth scrolling, and autoplaying media to block blinking/flashing elements in line with WCAG 2.1/EAA guidance (AI assistant)
- 2025-11-11 — Ensured Text Align options no longer reflow the accessibility modal by excluding it from alignment helpers while keeping WCAG/EAA behaviour and announcements (AI assistant)
- 2025-11-10 — Rebuilt Text Align as a WCAG 2.1 Level A/EAA compliant button group with start/center/end/justify options, document-level helpers, and migrated saved preferences (AI assistant)
- 2025-11-09 — Applied text alignment updates so the control targets both `<html>` and `<body>` and restores the default icon after resets (AI assistant)
- 2025-11-08 — Redirected the Font Size control to dataset-tracked host scaling so the accessibility modal no longer changes when zooming the page (AI assistant)
- 2025-11-06 — Captured the accessibility modal's baseline font metrics in CSS variables so the Font Size control no longer alters widget labels even when saved zoom levels reapply (AI assistant)
- 2025-11-05 — Counter-scaled Tailwind typography utilities within `#accessibility-modal` so the Font Size control leaves the widget UI untouched even when the host page zooms (AI assistant)
- 2025-11-04 — Restored the Font Size feature so it never alters typography inside `#accessibility-modal` by resetting inline styles when removing registered nodes (AI assistant)
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
- New CSS variable baseline for modal fonts should be regression-tested across browsers until automated coverage is available.

## Dependencies
- No runtime dependencies.

## Economic Report
- Not tracked.
