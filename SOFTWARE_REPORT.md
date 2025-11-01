# Software Report

- **Project**: Accessibility Plugin
- **Version**: 1.5.22
- **Maintainer**: Praboth Charith
- **Last Update**: 2025-12-12

## Module Status
- **Menu Rendering**: Completed
- **Control Handlers**: Completed (refreshed in v1.3.0)
- **Persistence Layer**: Completed
- **Testing**: Planned (manual regression required)

## Recent Activities
- 2025-12-12 — Re-arranged the Change Positions buttons into a two-row grid and moved the Reset All control beneath them for a clearer scanning order (AI assistant)
- 2025-12-10 — Hard-set the accessibility tools container to a 0.9rem right padding so it lines up with the navigation even when a scrollbar is visible (AI assistant)
- 2025-12-09 — Re-triggered the scrollbar-aware padding logic when reopening the widget so the tools grid remains centred after toggling from the launcher (AI assistant)
- 2025-12-08 — Reserved additional right padding inside the accessibility tools grid so the navigation column stays visually centred when the scrollbar appears (AI assistant)
- 2025-12-07 — Defaulted header and active control text datasets to white so scripts inherit accessible typography without manual overrides (AI assistant)
- 2025-12-06 — Corrected the default close/reset palette and extended hover styling so grouped cards and icons follow the configured blue/white scheme (AI assistant)
- 2025-12-05 — Split the header and active card palettes into dedicated dataset-controlled variables and refreshed the default blue/white styling for higher contrast (AI assistant)
- 2025-12-04 — Forced the Change Positions icons to render as block-level SVGs so they stay centered within their buttons (AI assistant)
- 2025-12-03 — Rotated the bottom-corner Change Positions arrows so every docking control shares the same glyph family (AI assistant)
- 2025-12-02 — Replaced the Change Positions icons with directional arrows so users immediately understand each docking option (AI assistant)
- 2025-12-01 — Added hover/text colour configuration (including automatic contrast fallbacks) and ensured header/icons follow the palette defined via script data attributes (AI assistant)
- 2025-11-30 — Localised the Change Position buttons and wired their pressed state so bottom-corner placements are announced correctly by assistive tech (AI assistant)
- 2025-11-29 — Added bottom-left and bottom-right placement controls with synchronized icons and storage so the launcher can occupy any corner (AI assistant)
- 2025-11-27 — Refreshed the language selector icons with higher fidelity SVG flags and linked the Hide Images toggle to the dropdown with an opt-out dataset override (AI assistant)
- 2025-11-26 — Rebuilt the language dropdown with Tailwind styling, inline SVG flags, and native language labels by default with an optional translation toggle (AI assistant)
- 2025-11-25 — Restored the launcher shadow, replaced clip-path morphing with an accessible radius-based reveal, and auto-enabled Reduce Motion when the OS requests it (AI assistant)
- 2025-11-24 — Reworked the launcher animation with clip-path transitions and hid the language selector while collapsed to stop UI fragments bleeding outside the closed bubble (AI assistant)
- 2025-11-22 — Smoothed the accessibility modal reveal with a spring-inspired animation that honours Reduce Motion preferences for gentler open transitions (AI assistant)
- 2025-11-21 — Hardened locale loading to prefer same-origin bundles when scripts are served cross-origin, documenting mitigation steps for CDN integrations (AI assistant)
- 2025-11-20 — Added the asynchronous i18n loader, JSON locale bundles for six languages, and an in-widget language selector with polite announcements (AI assistant)
- 2025-11-19 — Enabled script-level configuration for language, palette, and debug output via data attributes while wiring Italian/English copy bundles (AI assistant)
- 2025-11-20 — Added the asynchronous i18n loader, JSON locale bundles for six languages, and an in-widget language selector with polite announcements (AI assistant)
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
