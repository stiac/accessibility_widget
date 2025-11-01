# Accessibility Plugin


## Preview
[click here to see preview](https://olinke.com/accessibility-plugin/)

## Description

The Accessibility Plugin is a JavaScript library that helps improve the accessibility of your web applications. It provides a set of utility functions and components that can be easily integrated into your project.

- **Current Version:** `1.5.22`
- See [`CHANGELOG.md`](./CHANGELOG.md) for full release history and [`SOFTWARE_REPORT.md`](./SOFTWARE_REPORT.md) for status tracking.

## What's New in 1.5.22

- Re-arranged the Change Positions controls into a spatial grid and parked the Reset button at the bottom of the footer so users can scan the dock options before reaching destructive actions.

## What's New in 1.5.21

- Rotated the top-left dock icon 45 degrees and repositioned its control next to the top alignment button so the visual order mirrors the widget placements.

## What's New in 1.5.20

- Locked the accessibility tools grid to a 0.9rem right padding so it stays aligned with the navigation column regardless of the scrollbar.

## What's New in 1.5.19

- Re-trigger the scrollbar padding measurement whenever the widget opens so the accessibility tools grid stays centred beside the navigation column.

## What's New in 1.5.18

- Balanced the right-side padding of the accessibility tools grid with the scrollbar width so the menu stays centred next to the navigation column.

## What's New in 1.5.17

- Default the header banner and active control text datasets to white so integrators automatically get high-contrast typography without specifying `data-color-header-text` or `data-color-control-active-text`.

## What's New in 1.5.16

- Default the Close toggle and Reset All button to the header palette so they immediately adopt the blue `#036cff` background and white text without requiring overrides.
- Apply the configured hover colours to entire accessibility cards (including SVG icons) even when the pointer rests on the `.acc-item.group` wrapper.

## What's New in 1.5.15

- Introduced dedicated dataset attributes and CSS variables for the header banner and control cards so their backgrounds and text/icon colours can be tuned independently from the global palette.
- Updated default branding to use a blue `#036cff` backdrop with high-contrast white typography across the header, Reset button, and active position toggles.

## What's New in 1.5.14

- Centered every Change Positions arrow icon within its control button to remove the slight visual offset that users reported.

## What's New in 1.5.13

- Rotated the bottom-left and bottom-right Change Positions arrows so they reuse the same directional glyph with consistent styling across every docking option.

## What's New in 1.5.12

- Replaced the Change Positions icons with directional arrows so each docking option immediately communicates the widget's target location.

## What's New in 1.5.11

- Added `data-color-button-hover`, `data-color-text`, and `data-color-header-text` script attributes so integrators can brand hover states and typography without editing the bundle.
- Updated the widget header, reset button, and control cards to pull their backgrounds, hover states, and icon fills from the configured palette with automatic contrast-aware fallbacks.
- Ensured the header banner now honours `data-color-button-active` so branding colours propagate across the entire launcher surface.

## What's New in 1.5.10

- Added localised aria labels and pressed state syncing to every Change Position control so screen readers can identify the bottom-left and bottom-right corner options alongside the existing edges.

## What's New in 1.5.9

- Added dedicated controls to pin the widget to the bottom-left or bottom-right corners alongside the existing edge positions, with icons and persistence wired into local storage.

## What's New in 1.5.8

- Replaced every language dropdown flag with the updated Italian, German, English, Spanish, French, and Portuguese SVG artwork provided by the design team.
- Documented and verified that the **Hide Images** toggle now hides the dropdown artwork by default while still allowing the `data-preserve-language-icons` script override to surface the icons when required.

## What's New in 1.5.7

- Refreshed the language selector flags with 32px SVG artwork for clearer national colours at any zoom level.
- Wired the **Hide Images** control to also hide language dropdown icons by default and introduced a `data-preserve-language-icons` override for sites that must keep the flags visible.

## What's New in 1.5.6

- Redesigned the language selector as a Tailwind-powered dropdown with inline SVG flags and enhanced keyboard support.
- Added a configurable `data-translate-language-names` attribute while keeping language labels in their native form (e.g., "Italiano") by default.

## What's New in 1.5.5

- Restored the launcher button shadow and replaced the clip-path morph with a smoother border-radius animation so the panel opens fluidly without sacrificing contrast.
- Honoured system-level motion preferences by auto-enabling the Reduce Motion mode when `prefers-reduced-motion` is detected and short-circuiting the reveal animation in CSS.
- Added a media-query fallback for browsers that prefer reduced motion so the modal open effect stays gentle even before the widget initialises.

## What's New in 1.5.4

- Reworked the launcher animation with clip-path driven transitions so the menu grows smoothly from the circular button without jarring shape changes.
- Hid the language selector stack whenever the widget is closed to stop stray labels from peeking outside the launcher bubble.

## What's New in 1.5.3

- Hardened the locale loader so it now tries the script's CDN directory first and only falls back to the host site's `/locales`
  folder if that fetch fails, eliminating `net::ERR_EMPTY_RESPONSE` errors when using versioned CDN paths.

## What's New in 1.5.2

- Refined the accessibility modal launch animation with a spring-like overshoot, smoother scaling, and blur easing so the panel grows from the launcher bubble more naturally while still respecting Reduce Motion preferences.

## What's New in 1.5.1

- Hardened the locale loader so it automatically falls back to the host site's `/locales` directory when the script runs from a different origin, eliminating browser-level CORS blocks for CDN installs. Added documentation clarifying how to self-host or override locale paths.

## What's New in 1.5.0

- Introduced an `i18n.js` runtime that detects the visitor language, loads JSON locale files asynchronously, persists selections, and keeps a polite live region in sync for screen readers.
- Added a keyboard-accessible language selector inside the widget together with six bundled locales (English, Italian, French, German, Spanish, Portuguese) plus scalable JSON structure for future languages.
- Replaced hard-coded strings with `data-i18n` and `data-i18n-attr` hooks so integrators can localise headings, descriptions, and ARIA labels without editing the main script.

## Features

- **Invert Colors**: Inverts the colors of the page to improve readability for users with visual impairments.
- **Grayscale**: Converts the page grayscale to improve readability for users with visual impairments.
- **Low Saturation**: Reduces the saturation of the page to improve readability for users with visual impairments.
- **High Saturation**: Increases the saturation of the page to improve readability for users with visual impairments.
- **Link Highlight**: Highlights all links on the page to make them easier to identify for users with visual impairments.
- **Font Size**: Increases the font size of the page to improve readability for users with visual impairments.
- **Line Height**: Increases the line height of the page to improve readability for users with visual impairments.
- **Letter Spacing**: Increases the letter spacing of the page to improve readability for users with visual impairments.
- **Font Dyslexia**: Replaces the host page typography with a dyslexia-friendly font stack powered by OpenDyslexic and supportive fallbacks without affecting the accessibility menu layout.
- **Text Alignment**: Cycle through Start, Center, End, and Justify by clicking the card; the preference overrides host styles while active and resets to default after the final option.
- **Low Contrast**: Reduces the contrast of the page to improve readability for users with visual impairments.
- **High Contrast**: Increases the contrast of the page to improve readability for users with visual impairments.
- **Extra Contrast**: Increases the contrast of the page even further to improve readability for users with visual impairments.
- **Hide Images**: Hides all images on the page to improve readability for users with visual impairments.
- **Hide Videos**: Hides native video tags, common iframe players, and plugin embeds (with an opt-out via `data-acc-preserve-video`) to reduce motion for users who prefer a still experience.
- **Reduce Motion**: Disables CSS animations and smooth scrolling while pausing autoplaying media and marquees to eliminate blinking or flashing movement on demand (use `data-acc-preserve-motion` to opt specific widgets out).
- **Big Circle Cursor**: Changes the cursor to a big circle to improve visibility for users with visual impairments.
- **Reading Mask**: Highlights the current line of text being read to improve focus for users with visual impairments.
- **Reading Guide**: Makes it easier to read long lines of text by Long Highlight Cursor.
- **Reset**: Resets all accessibility settings to their default values.
- **Close**: Closes the accessibility menu.
- **Change Position**: You can change the position of the accessibility menu to `left`, `right`, `top`, `bottom`, `bottom-left`, or `bottom-right` as user needs.
- **Save Settings**: Save the current settings to the local storage and load them when the page is reloaded.
- **Internationalisation**: Auto-detects the visitor language, offers six bundled translations, and exposes a keyboard-accessible language picker with polite announcements.

## Installation

You can install the Accessibility Plugin using npm. Run the following command in your project directory:

<pre><code>npm i accessibility-plugin</code></pre>

>[!tip]
> ### OR
> You can use this `CDN` easily.
> <pre><code><script src="https://cnd.stiac.it/accessibility/@1.3.2/dist/accessibility-menu.js"></script></code></pre>


<br/>

After installation, you can link the `javascript` file _normally_ using
<pre><code><script src="assets/app/accessibility/accessibility-menu.js"></script></code></pre>

### OR

You can use `min.js` file _as your requirement_
<pre><code><script src="assets/app/accessibility/accessibility-menu.js"></script></code></pre>

>[!important]
> **Link the `Javascript` file `after all javascript` for better output**
>
> **Tip:** Load `i18n.js` before the menu script so languages are available immediately.
> ```html
> <script src="assets/app/accessibility/i18n.js"></script>
> <script src="assets/app/accessibility/accessibility-menu.js" data-default-language="en"></script>
> ```

## Customization

### Change Position

- In the js file, you can find the `first div` with `id` as `accessibility-modal`
- In this div, you can find class `right` by **default**. You can change it to `left`, `right`, `top`, `bottom`, `bottom-left`, or `bottom-right` as you need

### Styling

- The menu now uses Tailwind CSS classes. If your page does not already include Tailwind, the plugin injects the CDN build automatically when the panel loads.
- Adjust the colour scheme quickly by editing the CSS variables (`--acc_color_1`, `--acc_color_2`, `--acc_hover_color`, `--acc_hover_text_color`, `--acc_text_color`, `--acc_header_bg_color`, `--acc_header_text_color`, `--acc_control_active_bg_color`, `--acc_control_active_text_color`) at the top of `accessibility-menu.js`.

### Script data attributes

You can fine-tune the widget without editing the bundle by adding configuration attributes to the embedding `<script>` tag:

```html
<script
  src="/assets/accessibility-menu.js"
  data-default-language="it"
  data-mode="debug"
  data-color-button-active="#0f172a"
  data-color-button="#ffffff"
  data-voce1="Strumenti di Accessibilità"
  data-voce2="Personalizza colori e tipografia in un clic"
  data-locales-path="/assets/locales"
></script>
```

| Attribute | Purpose | Accepted values | Default |
| --- | --- | --- | --- |
| `data-default-language` | Sets the UI language for headings, card labels, and screen-reader helpers. | `en`, `it` (other values fall back to English) | `en` |
| `data-mode` | Enables additional console output to verify the resolved configuration. | `production`, `debug` | `production` |
| `data-color-button-active` | Accent colour for controls such as the close button, progress indicators, and hover derivations. | Any valid CSS colour (`#hex`, `rgb()`, etc.) | `#0f172a` |
| `data-color-button` | CSS colour used for the idle background of cards and other neutral surfaces. | Any valid CSS colour | `#f8fafc` |
| `data-color-button-hover` | Optional CSS colour used for hover backgrounds. When omitted, the widget derives an accessible shade from `data-color-button-active`. | Any valid CSS colour | Derived automatically |
| `data-color-text` | Primary text and icon colour for idle controls and body copy inside the widget. | Any valid CSS colour | `rgba(15, 23, 42, 0.85)` |
| `data-color-header-background` | Background colour applied to the header banner, Reset button, and active Change Positions toggles. | Any valid CSS colour | `#036cff` |
| `data-color-header-text` | Overrides the text/icon colour used by the header banner and active Change Positions toggles. Falls back to the most legible option if omitted. | Any valid CSS colour | Derived from palette |
| `data-color-control-active` | Background colour for active accessibility cards inside the grid. | Any valid CSS colour | Matches header background by default |
| `data-color-control-active-text` | Overrides the text/icon colour used by active accessibility cards. Falls back to a contrast-safe value if omitted. | Any valid CSS colour | Derived from palette |
| `data-voce1` | Overrides the main heading inside the widget (useful for localisation/branding). | Free text | `Accessibility Tools` / translated value |
| `data-voce2` | Overrides the sub-heading tagline beneath the title. | Free text | `Fine-tune colours…` / translated value |
| `data-locales-path` | Overrides the folder that contains JSON locale files. Use when hosting the bundles outside the script directory. | Relative or absolute path ending in the folder containing locale JSON files. | `<script dir>/locales` when same origin, otherwise the host site's `/locales` folder |
| `data-translate-language-names` | Opt-in flag that translates the language names using the active locale instead of native endonyms. | `true`, `false`, `1`, `0`, `yes`, `no` | `false` |
| `data-preserve-language-icons` | Keeps the language dropdown icons visible even when the Hide Images control is active. | `true`, `false`, `1`, `0`, `yes`, `no` | `false` |

All attributes are optional; omit any value to keep the default behaviour. Colours are validated at runtime, so unsupported values gracefully fall back to the defaults.

### Internationalisation

- Load the `i18n.js` helper **before** `accessibility-menu.js`. The helper auto-detects the browser language (`navigator.language`), falls back to English, and stores the user's manual selection in `localStorage` (`stiacAccessibilityLanguage`).
- Locale files live under `/locales/<lang>.json` by default (e.g., `/locales/en.json`). The loader now checks the widget's embedded copies first, then attempts to fetch from the script directory (ideal for CDN/versioned builds) and, if that fails, gracefully falls back to the host site's `/locales` directory; adjust `data-locales-path` if your bundles live elsewhere. Each file mirrors the same structure so you can add new languages by dropping another JSON document and extending `SUPPORTED_LANGUAGES` in `accessibility-menu.js`.
- Use the built-in language selector inside the widget to switch languages. The control is fully keyboard accessible, updates the `<html lang>` attribute, and announces changes with `aria-live="polite"`. Language names stay in their native form by default; set `data-translate-language-names="true"` if you prefer them localised. When the **Hide Images** toggle is active the dropdown icons disappear automatically; add `data-preserve-language-icons="true"` if you need to keep them visible.
- Every translatable string inside the widget is decorated with `data-i18n` or `data-i18n-attr`. If you render custom markup alongside the menu, you can reuse the helper by applying the same attributes to your elements and calling `window.AccessibilityI18n.applyTranslations()`.
- If you host locale files in a different directory, set `data-locales-path` on the `<script>` tag or pass `localesPath` when calling `AccessibilityI18n.init`.

### Fine-tune Video Visibility

- Add `data-acc-video-embed` to any custom wrapper that should respond to the **Hide Videos** toggle (useful for bespoke players or CMS shortcodes).
- Add `data-acc-preserve-video` directly on a video/iframe/embed element to keep it visible even while the global hide toggle is active.


## Preview

<video style='width:100%; height:auto;' src='https://github.com/PrabothCharith/accessibility-plugin/assets/91902549/e310ea92-e434-4c35-a2d5-f1c99547e98e'></video>
# accessibility_widget
# accessibility_widget
# accessibility_widget

## License

This project is distributed under the Stiac Web Services Proprietary License. Commercial use, modification, and redistribution are prohibited unless you receive explicit written authorization from Stiac Web Services.
