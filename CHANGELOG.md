# Changelog

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
