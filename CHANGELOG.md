# Changelog
# [1.5.18] - 2025-12-08

### Added
- None.

### Changed
- None.

### Fixed
- Synced the accessibility tools grid padding with the scrollbar width so the navigation column stays visually centred even when the vertical scrollbar is visible.

### Removed
- None.

# [1.5.17] - 2025-12-07

### Added
- None.

### Changed
- Defaulted the `data-color-header-text` and `data-color-control-active-text` script attributes to white (`#ffffff`) so header and active control typography stays readable without custom configuration.

### Fixed
- None.

### Removed
- None.

# [1.5.16] - 2025-12-06

### Added
- None.

### Changed
- Updated the default accent palette so the close toggle, Reset All button, and hover states inherit the blue `#036cff` header scheme by default.

### Fixed
- Ensured the close toggle and Reset All button apply the configured header colours instead of the generic accent fallback.
- Applied hover background, text, and icon fill overrides when hovering the `.acc-item.group` wrapper so cards reflect the chosen palette consistently.

### Removed
- None.

# [1.5.15] - 2025-12-05

### Added
- Dataset controls (`data-color-header-background`, `data-color-control-active`, and their text counterparts) that let integrators tune header and active card palettes independently.

### Changed
- Swapped the default header, Reset button, and active position toggle styling to a blue `#036cff` background with white text for clearer contrast.

### Fixed
- None.

### Removed
- None.

# [1.5.14] - 2025-12-04

### Added
- None.

### Changed
- Rendered every Change Positions arrow SVG as a block-level icon so the glyphs stay perfectly centered inside their buttons.

### Fixed
- None.

### Removed
- None.

# [1.5.13] - 2025-12-03

### Added
- None.

### Changed
- Rotated the bottom-left and bottom-right Change Positions arrows to reuse the shared directional glyph for visual consistency.

### Fixed
- None.

### Removed
- None.

# [1.5.12] - 2025-12-02

### Added
- None.

### Changed
- Swapped the Change Positions button glyphs for clear directional arrows that illustrate where the widget will dock.

### Fixed
- None.

### Removed
- None.

# [1.5.11] - 2025-12-01

### Added
- Introduced `data-color-button-hover`, `data-color-text`, and `data-color-header-text` attributes so integrators can tailor hover backgrounds and typography without editing the bundle.

### Changed
- Refactored the header banner, buttons, and icons to honour the configured palette with contrast-aware hover defaults derived from `data-color-button-active`.

### Fixed
- Ensured the header background and control icons now follow `data-color-button-active`/`data-color-button`, keeping branding colours consistent across the widget.

### Removed
- None.

# [1.5.10] - 2025-11-30

### Added
- Localised Change Position button labels (including the bottom-left and bottom-right controls) so assistive technologies announce each placement option accurately.

### Changed
- Synced the Change Position controls' `aria-pressed` state to mirror the active docking spot for screen readers and other assistive tech.

### Fixed
- None.

### Removed
- None.

# [1.5.9] - 2025-11-29

### Added
- Introduced bottom-left and bottom-right docking controls so the launcher can occupy any corner, complete with refreshed icons and saved preferences.

### Changed
- Updated the close button icon logic and position persistence helpers to recognise the new corner placements when the widget toggles open or closed.

### Fixed
- None.

### Removed
- None.

# [1.5.8] - 2025-11-28

### Added
- Documented the `data-preserve-language-icons` override in the README so integrators can intentionally surface flags while Hide Images is active.

### Changed
- Updated every embedded language selector SVG to match the official Italian, German, English, Spanish, French, and Portuguese artwork.

### Fixed
- Ensured the Hide Images preference suppresses language dropdown icons by default while still honouring the preservation override when present.

### Removed
- None.

# [1.5.7] - 2025-11-27

### Added
- Introduced a `data-preserve-language-icons` attribute so integrators can keep language dropdown icons visible even when Hide Images is active.

### Changed
- Replaced all language selector icons with updated 32px SVG artwork for improved fidelity.

### Fixed
- Synced the Hide Images control with the language dropdown so icons are hidden alongside other imagery unless explicitly preserved.

### Removed
- None.

# [1.5.6] - 2025-11-26

### Added
- Introduced SVG-backed language icons and a configurable `data-translate-language-names` flag so integrators can opt into locale-translated names when needed.

### Changed
- Rebuilt the language selector as a Tailwind-styled dropdown listbox with improved keyboard support and richer layout.

### Fixed
- Kept language names in their native form by default (e.g., "Italiano") to prevent unwanted translations across locales.

### Removed
- None.

# [1.5.5] - 2025-11-25

### Added
- Auto-activated the Reduce Motion mode when the operating system prefers reduced motion and introduced a CSS media-query fallback that cancels the reveal animation pre-initialisation.

### Changed
- Replaced the clip-path driven reveal with a border-radius animation that preserves the launcher shadow and delivers a smoother, accessible panel expansion.

### Fixed
- Restored the launcher bubble's drop shadow in its closed state so the toggle button retains depth cues when the menu is hidden.

### Removed
- None.

# [1.5.4] - 2025-11-24

### Added
- None.

### Changed
- Softened the modal expansion by morphing between circular and rectangular states with clip-path animations so the launcher no longer snaps into a rectangle when opening.

### Fixed
- Hid the language selector container while the widget is collapsed to prevent its labels from appearing outside the closed bubble.

### Removed
- None.

# [1.5.3] - 2025-11-23

### Added
- None.

### Changed
- None.

### Fixed
- Retooled the locale discovery sequence so CDN-hosted builds try fetching JSON from the script directory before falling back to the host site's `/locales` folder, resolving `net::ERR_EMPTY_RESPONSE` errors triggered by versioned CDN paths.

### Removed
- None.

## [1.5.2] - 2025-11-22

### Added
- None.

### Changed
- Reimagined the accessibility modal reveal with a smoother, spring-inspired animation that eases in from the launcher bubble and adds gentle blur/focus transitions for a more polished entry.

### Fixed
- Honoured the Reduce Motion mode by disabling the new reveal animation whenever the global motion limiter is active.

### Removed
- None.
## [1.5.1] - 2025-11-21

### Added
- Documented locale hosting strategies so integrators understand how to point the loader at same-origin bundles or override the lookup path when required.

### Changed
- None.

### Fixed
- Adjusted the locale fetcher to fall back to the embedding site's `/locales` directory when the script origin differs from the page origin, resolving CDN-driven CORS errors such as blocked requests to `https://cnd.stiac.it/.../locales/<lang>.json`.

### Removed
- None.
## [1.5.0] - 2025-11-20

### Added
- Delivered a standalone `i18n.js` helper that loads JSON locale files asynchronously, persists language choices, updates `<html lang>`, and emits polite announcements through a shared live region.
- Bundled six locale JSON files (English, Italian, French, German, Spanish, Portuguese) together with a scalable directory structure for future languages.
- Injected a keyboard-accessible language selector inside the widget so visitors can switch languages without leaving the panel.

### Changed
- Replaced hard-coded copy with `data-i18n`/`data-i18n-attr` hooks across the interface so translations are applied consistently and ARIA labels localise automatically.
- Synced text-alignment announcements, headings, and helper descriptions with the active locale while keeping script-level heading overrides intact.

### Fixed
- Ensured text-alignment status updates reuse translated strings so screen readers hear announcements in the selected language.

### Removed
- None.
## [1.4.27] - 2025-11-19

### Added
- Exposed `<script>` `data-*` options so integrators can set the default language, toggle debug logging, and override active button colours without editing the source bundle.
- Bundled English and Italian copy decks that automatically populate card labels and screen-reader helpers based on `data-default-language` or custom heading overrides.

### Changed
- The close and reset buttons now read the configured colour palette, keeping their backgrounds/text in sync with `data-color-button-active` and `data-color-button`.

### Fixed
- None.

### Removed
- None.
## [1.4.26] - 2025-11-18

### Added
- None.

### Changed
- None.

### Fixed
- Embedded OpenDyslexic regular and bold fonts as data URIs so enabling the dyslexia-friendly toggle no longer triggers cross-origin errors or blocked downloads.

### Removed
- None.

## [1.4.25] - 2025-11-17

### Added
- None.

### Changed
- None.

### Fixed
- Redirected the Font Dyslexia toggle to source OpenDyslexic fonts from the upstream Forge repository so enabling the control no longer causes 404 errors.

### Removed
- None.

## [1.4.24] - 2025-11-16

### Added
- None.

### Changed
- None.

### Fixed
- Re-pointed the Font Dyslexia toggle to GitHub-hosted OpenDyslexic font files so enabling the control no longer triggers 404 errors and dyslexia-friendly typography renders reliably.

### Removed
- None.

## [1.4.23] - 2025-11-15

### Added
- Introduced a Font Dyslexia toggle that applies an OpenDyslexic-led font stack across the host page, giving dyslexic readers a WCAG 2.1 Level A and EAA compliant typography option while keeping the widget interface unchanged.

### Changed
- None.

### Fixed
- None.

### Removed
- None.

## [1.4.22] - 2025-11-14

### Added
- Introduced a Reduce Motion control that freezes CSS-driven motion, pauses autoplaying media, and stops marquee content to meet WCAG 2.1 Level A and European Accessibility Act expectations, with an opt-out via `data-acc-preserve-motion` for essential animations.

### Changed
- None.

### Fixed
- None.

### Removed
- None.

## [1.4.21] - 2025-11-13

### Added
- None.

### Changed
- None.

### Fixed
- None.

### Removed
- Dropped the visible "Click to cycle alignment" helper text from the Text Align card now that the control's behavior is self-evident and reinforced via screen reader guidance.

## [1.4.20] - 2025-11-12

### Added
- None.

### Changed
- Replaced the Text Align button grid with a single clickable card that cycles through Start, Center, End, and Justify while updating icons, announcements, and saved states.

### Fixed
- None.

### Removed
- Retired the four-button Text Align group now that the card itself handles cycling through alignments.

## [1.4.19] - 2025-11-11

### Added
- None.

### Changed
- Refined the text alignment helpers so they explicitly skip `#accessibility-modal`, keeping WCAG/EAA-compliant overrides focused on host-page content while preserving polite announcements and stored states.

### Fixed
- Corrected a regression where choosing a Text Align option adjusted the accessibility modal instead of the site content.

### Removed
- None.

## [1.4.18] - 2025-11-10

### Added
- Introduced a keyboard-navigable Text Align button group with Start, Center, End, and Justify options that surface polite screen reader announcements.

### Changed
- Applied `data-acc-text-align` helpers and WCAG/EAA-driven styling so user-selected alignment overrides conflicting author styles while respecting document direction.

### Fixed
- Migrated legacy left/center/right settings to the new alignment model and ensured resets restore the original site alignment safely.

### Removed
- None.

## [1.4.17] - 2025-11-09

### Added
- None.

### Changed
- None.

### Fixed
- Ensured the Text Align control synchronises styles across `<html>` and `<body>` so page content responds correctly and the widget icon resets cleanly.

### Removed
- None.

## [1.4.16] - 2025-11-08

### Added
- None.

### Changed
- None.

### Fixed
- Shifted the Font Size control to rely on dataset-tracked scaling for registered host elements so the accessibility modal's content and layout stay untouched.

### Removed
- None.

## [1.4.15] - 2025-11-07

### Added
- None.

### Changed
- None.

### Fixed
- Escaped Tailwind bracket utility selectors before sampling modal typography so `querySelector` no longer throws syntax errors when measuring font sizes.

### Removed
- None.

## [1.4.14] - 2025-11-06

### Added
- None.

### Changed
- None.

### Fixed
- Captured the accessibility modal's baseline font metrics in CSS variables so the Font Size control leaves every widget element unchanged, even when saved zoom levels reapply on load.

### Removed
- None.

## [1.4.13] - 2025-11-05

### Added
- None.

### Changed
- None.

### Fixed
- Counter-scaled Tailwind typography utilities inside `#accessibility-modal` so the Font Size control leaves the widget interface unchanged while the host site zooms.

### Removed
- None.

## [1.4.12] - 2025-11-04

### Added
- None.

### Changed
- None.

### Fixed
- Ensured the Font Size control restores any inline font declarations and skips elements inside `#accessibility-modal` so the
  widget's own interface never receives unintended scaling.

### Removed
- None.

## [1.4.11] - 2025-11-03

### Added
- None.

### Changed
- None.

### Fixed
- Limited the **Hide Images** mode to URL-based backgrounds so elements like `#headerContent` keep their gradient styling while inline media and decorative photos still disappear.

### Removed
- None.

## [1.4.10] - 2025-11-02

### Added
- None.

### Changed
- None.

### Fixed
- Stopped the Font Size control from traversing the accessibility modal when building its scaling registry so the widget's labels no longer change size alongside the host page.
- Regenerated both `accessibility-menu.js` and `accessibility-menu.min.js` together to keep distributed bundles synchronized.

### Removed
- None.

## [1.4.9] - 2025-11-01

### Added
- None.

### Changed
- None.

### Fixed
- Restored the browser-default inline rendering for host audio, canvas, embed, iframe, img, object, svg, and video elements when the fallback Tailwind CDN build is injected while preserving block-level icons inside the accessibility widget.

### Removed
- None.

## [1.4.8] - 2025-10-31

### Added
- None.

### Changed
- None.

### Fixed
- Reapplied the browser-default inline rendering to host SVG elements when the fallback Tailwind CDN is injected so Tailwind's preflight no longer forces them to behave like block elements.

### Removed
- None.

## [1.4.7] - 2024-06-29

### Added
- None.

### Changed
- None.

### Fixed
- Applied CSS variables and a data attribute to propagate the scaled font sizes onto `<html>` and `<body>`, ensuring the Font S
ize control affects the entire site instead of only resizing the accessibility modal.

### Removed
- None.

## [1.4.6] - 2024-06-28

### Added
- None.

### Changed
- None.

### Fixed
- Calculated the font-scale against the page's initial pixel values and reapplied the scaled sizes to `<html>` and `<body>`, ensuring the font-size control enlarges site content instead of only shrinking the accessibility modal.

### Removed
- None.

## [1.4.5] - 2024-06-27

### Added
- None.

### Changed
- None.

### Fixed
- Captured the applied font-scale on the `<html>` element and counter-scaled the accessibility modal so the font-size control enlarges the host page without blowing up the widget itself.

### Removed
- None.

## [1.4.4] - 2024-06-26

### Added
- None.

### Changed
- None.

### Fixed
- Reworked the Font Size control to use percentage values on the `<html>` element so rem-based typography across the host site actually scales when the control is toggled.

### Removed
- None.

## [1.4.3] - 2024-06-25

### Added
- Coordinated vulnerability disclosure guidance that clarifies the safe testing scope.

### Changed
- Security response process now promises weekly status updates and documents how to request encrypted communication.

### Fixed
- None.

### Removed
- None.

## [1.4.2] - 2024-06-24

### Added
- None.

### Changed
- None.

### Fixed
- Applied the font size adjustments with inline `!important` rules on both the `<html>` and `<body>` elements so the typography control affects the entire page.

### Removed
- None.

## [1.4.1] - 2024-06-23

### Added
- None.

### Changed
- Smoothed the accessibility modal reveal/close transition with eased transforms that respect each docking position.

### Fixed
- Progress indicators now use darker tones so they stay visible atop the Tailwind cards.
- Custom cursor focus/mask/guide overlays are appended to the document body again, ensuring they cover the full page.

### Removed
- None.

## [1.4.0] - 2024-06-22

### Added
- Automatic Tailwind CSS injection (via CDN) when the host page does not already provide it, ensuring the refreshed visuals load consistently.

### Changed
- Restyled the accessibility menu with Tailwind CSS utilities, modern spacing, and updated typography for a more pleasant experience.
- Refined button, grid, and branding layouts to harmonise with the new Tailwind design language.

### Fixed
- None.

### Removed
- None.

## [1.3.4] - 2024-06-21

### Added
- Introduced Stiac Web Services ownership branding across the menu (UI badge, DOM metadata, and console notice) to highlight proprietary rights.

### Changed
- None.

### Fixed
- None.

### Removed
- None.

## [1.3.3] - 2024-06-20

### Added
- Support for `data-acc-video-embed` and `data-acc-preserve-video` attributes to fine tune hide-video behaviour for custom players.

### Changed
- None.

### Fixed
- Expanded the Hide Video toggle to cover iframe-based services (YouTube, Vimeo, Wistia, etc.), legacy `<embed>/<object>` players, and other tagged video containers.

### Removed
- None.

## [1.3.2] - 2024-06-19

### Added
- None.

### Changed
- None.

### Fixed
- Updated the Hide Images toggle to also cover inline SVG/picture elements and background images so imagery is consistently removed.

### Removed
- None.

## [1.3.1] - 2024-06-18

### Added
- None.

### Changed
- None.

### Fixed
- Corrected a stray closing brace so the browser can evaluate the script when embedded with a direct `<script>` tag.

### Removed
- None.

## [1.3.0] - 2024-06-17

### Added
- Helper utilities for managing text alignment icons to avoid stale UI states.

### Changed
- Standardized progress indicators across controls by reusing `updateProgress` for saturation, underline, typography, contrast, and cursor tools.
- Simplified text alignment logic to use shared icon templates and centralised state handling.
- Normalized cursor transitions to consistently reset document cursor styles and auxiliary guides.

### Fixed
- Resolved text alignment icon not reverting to its default glyph after reset or load.
- Ensured cursor guide mode reliably hides the custom cursor when switching to other cursor options and during state synchronization.

### Removed
- None.
