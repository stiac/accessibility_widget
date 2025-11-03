# Accessibility Plugin


## Preview
[Click Here to See Preview](https://olinke.com/accessibility-widget/)

## Description

The Accessibility Plugin is a JavaScript library that helps improve the accessibility of your web applications. It provides a set of utility functions and components that can be easily integrated into your project.

- **Current Version:** `1.7.3`
- See [`CHANGELOG.md`](./CHANGELOG.md) for full release history and [`SOFTWARE_REPORT.md`](./SOFTWARE_REPORT.md) for status tracking.

## What's New in 1.7.3

- Generates hidden proxy labels when host pages duplicate heading IDs so `aria-labelledby` relationships stay intact without renaming the original markup. This prevents screen readers from losing descriptions that rely on shared identifiers.

## What's New in 1.7.2

- Normalizes duplicate `aria-labelledby` references so the widget can safely resolve accessible names even when host pages reuse heading IDs.

## What's New in 1.7.1

- Documented an HTML integration pitfall where duplicate heading IDs break the `aria-labelledby` linkage that the widget relies on to announce card labels correctly. A new troubleshooting section explains how to diagnose and fix the issue.

## What's New in 1.7.0

- Embedded every maintained locale bundle directly in `accessibility-menu.js` and exposed them through `window.AccessibilityWidgetEmbeddedLocales` so translations keep working even when cross-origin JSON requests are blocked.
- Added a local Tailwind CSS build pipeline (`npm run build:tailwind`) that compiles a minified `accessibility-tailwind.css` helper alongside the script for FTP-friendly deployments.
- Introduced the `data-tailwind-stylesheet` attribute and updated the loader to inject the packaged stylesheet by default, keeping CDN-based helpers optional for legacy setups.

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
- **Hide Videos**: Hides native video tags, common iframe players, and plugin embeds (with an opt-out via `data-a11y-stiac-preserve-video`) to reduce motion for users who prefer a still experience.
- **Reduce Motion**: Disables CSS animations and smooth scrolling while pausing autoplaying media and marquees to eliminate blinking or flashing movement on demand (use `data-a11y-stiac-preserve-motion` to opt specific widgets out).
- **Big Circle Cursor**: Changes the cursor to a big circle to improve visibility for users with visual impairments.
- **Reading Mask**: Highlights the current line of text being read to improve focus for users with visual impairments.
- **Reading Guide**: Makes it easier to read long lines of text by Long Highlight Cursor.
- **Reset**: Resets all accessibility settings to their default values.
- **Close**: Closes the accessibility menu.
- **Change Position**: Optionally expose footer controls (via `data-enable-position-controls="true"`) so end users can dock the widget to `left`, `right`, `top`, `bottom`, `bottom-left`, or `bottom-right` without editing code.
- **Save Settings**: Save the current settings to the local storage and load them when the page is reloaded.
- **Internationalisation**: Auto-detects the visitor language, fetches the six maintained translations (`en`, `it`, `fr`, `de`, `es`, `pt`) on demand, and exposes a keyboard-accessible language picker with polite announcements.

## Installation

You can install the Accessibility Plugin using npm. Run the following command in your project directory:

<pre><code>npm i accessibility-plugin</code></pre>

>[!tip]
> ### OR
> You can use this `CDN` easily.
> <pre><code><script src="https://cdn.jsdelivr.net/gh/stiac/accessibility_widget@main/i18n.js"></script>
<script src="https://cdn.jsdelivr.net/gh/stiac/accessibility_widget@main/accessibility-widget.js"></script></code></pre>


<br/>

After installation, you can link the `javascript` file _normally_ using
<pre><code><script src="assets/app/accessibility/accessibility-menu.js"></script></code></pre>

> Upload the generated `accessibility-tailwind.css` alongside the script so the fallback loader can serve Tailwind without relying on the CDN helper.

### OR

You can use `min.js` file _as your requirement_
<pre><code><script src="assets/app/accessibility/accessibility-widget.js"></script></code></pre>

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

- Enable the footer controls by adding `data-enable-position-controls="true"` (or `data-position-controls="true"`) to the embedding `<script>` tag when you want end users to move the widget.
- Set the default docking point with the existing `data-default-position` / `data-position` attributes or by editing the `#accessibility-modal` class if you are customising the markup directly.

### Styling

- The menu now uses Tailwind CSS classes. When the host page does not already include Tailwind, the widget injects the generated `accessibility-tailwind.css` helper from the same directory (set `data-tailwind="false"` to disable the helper, `data-tailwind-stylesheet` to point at a custom CSS file, or `data-tailwind-cdn` if you intentionally prefer the CDN script).
- Adjust the colour scheme quickly by editing the CSS variables (`--a11y-stiac-color-1`, `--a11y-stiac-color-2`, `--a11y-stiac-hover-color`, `--a11y-stiac-hover-text-color`, `--a11y-stiac-text-color`, `--a11y-stiac-header-bg-color`, `--a11y-stiac-header-text-color`, `--a11y-stiac-control-active-bg-color`, `--a11y-stiac-control-active-text-color`) at the top of `accessibility-menu.js`.

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

> [!note]
> Set `data-enable-position-controls="true"` (or `data-position-controls="true"`) if you want the Change Positions buttons to render for your visitors.

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
| `data-default-position`, `data-position` | Sets the initial docking point for the accessibility modal. Accepts keyword positions (`left`, `top`, `bottom`, `right`, `bottom-left`, `bottom-right`) or the equivalent `align-a11y-stiac-*` control IDs. | Listed keywords / IDs | `bottom-left` |
| `data-enable-position-controls`, `data-position-controls` | Opt-in flag that renders the Change Positions footer buttons so visitors can move the widget after load. | `true`, `false`, `1`, `0`, `yes`, `no` | `false` |
| `data-voce1` | Overrides the main heading inside the widget (useful for localisation/branding). | Free text | `Accessibility Tools` / translated value |
| `data-voce2` | Overrides the sub-heading tagline beneath the title. | Free text | `Fine-tune colours…` / translated value |
| `data-locales-path` | Overrides the folder that contains JSON locale files. Use when hosting the bundles outside the script directory. | Relative or absolute path ending in the folder containing locale JSON files. | `<script dir>/locales` when same origin, otherwise the host site's `/locales` folder |
| `data-assets-path` | Overrides the base path used for auxiliary assets such as `open-dyslexic.css`. Useful when the script is served from a CDN but supporting files live elsewhere. | Relative or absolute path ending with `/`. | Script directory |
| `data-open-dyslexic-stylesheet` | Points directly to a custom stylesheet that defines the OpenDyslexic font faces. | Absolute or relative URL to a CSS file. | `<assets-path>/open-dyslexic.css` |
| `data-tailwind` | Controls whether the fallback Tailwind helper is injected automatically. | `true`, `false`, `1`, `0`, `yes`, `no` | `true` (loads `accessibility-tailwind.css`) |
| `data-tailwind-stylesheet` | Points at a custom Tailwind CSS bundle that should be injected when the host does not already ship Tailwind. | Absolute or relative URL to a CSS file. | `<assets-path>/accessibility-tailwind.css` |
| `data-tailwind-cdn`, `data-tailwind-cdn-url` | Overrides the URL used when loading Tailwind as a script instead of a stylesheet. | Any valid script URL. | Not set (CDN disabled by default) |
| `data-translate-language-names` | Opt-in flag that translates the language names using the active locale instead of native endonyms. | `true`, `false`, `1`, `0`, `yes`, `no` | `false` |
| `data-preserve-language-icons` | Keeps the language dropdown icons visible even when the Hide Images control is active. | `true`, `false`, `1`, `0`, `yes`, `no` | `false` |

All attributes are optional; omit any value to keep the default behaviour. Colours are validated at runtime, so unsupported values gracefully fall back to the defaults.

#### Rebuilding the packaged Tailwind stylesheet

If you customise the widget markup or Tailwind configuration, regenerate `accessibility-tailwind.css` locally before uploading the files to your server:

1. `npm install`
2. `npm run build:tailwind`

The command scans `accessibility-menu.js`, compiles only the classes the widget needs, and writes a minified stylesheet next to the script so FTP-only deployments remain lightweight.

### Internationalisation

- The widget bundles translations for `en`, `it`, `fr`, `de`, `es`, and `pt` directly inside `accessibility-menu.js`, exposing them on `window.AccessibilityWidgetEmbeddedLocales` so language switches succeed even when remote JSON endpoints are unavailable.
- Load the `i18n.js` helper **before** `accessibility-menu.js`. The helper auto-detects the browser language (`navigator.language`), falls back to English, and stores the user's manual selection in `localStorage` (`stiacAccessibilityLanguage`).
- Locale files live under `/locales/<lang>.json` by default (e.g., `/locales/en.json`). The loader checks the script's embedded locale bundle first (covering the six maintained languages), then attempts to fetch from the script directory (ideal for CDN/versioned builds) and, if that fails, gracefully falls back to the host site's `/locales` directory; adjust `data-locales-path` or `data-assets-path` if your bundles live elsewhere. Each file mirrors the same structure so you can add new languages by dropping another JSON document and extending `SUPPORTED_LANGUAGES` in `accessibility-menu.js`.
- Use the built-in language selector inside the widget to switch languages. The control is fully keyboard accessible, updates the `<html lang>` attribute, and announces changes with `aria-live="polite"`. Language names stay in their native form by default; set `data-translate-language-names="true"` if you prefer them localised. When the **Hide Images** toggle is active the dropdown icons disappear automatically; add `data-preserve-language-icons="true"` if you need to keep them visible.
- Every translatable string inside the widget is decorated with `data-i18n` or `data-i18n-attr`. If you render custom markup alongside the menu, you can reuse the helper by applying the same attributes to your elements and calling `window.AccessibilityI18n.applyTranslations()`.
- If you host locale files in a different directory, set `data-locales-path` on the `<script>` tag or pass `localesPath` when calling `AccessibilityI18n.init`.

### Fine-tune Video Visibility

- Add `data-a11y-stiac-video-embed` to any custom wrapper that should respond to the **Hide Videos** toggle (useful for bespoke players or CMS shortcodes).
- Add `data-a11y-stiac-preserve-video` directly on a video/iframe/embed element to keep it visible even while the global hide toggle is active.


## Troubleshooting

### Duplicate heading IDs break card labelling

The widget resolves each card label by reading the anchor's `aria-labelledby`
attribute and fetching the referenced heading with
`document.getElementById`. When the host markup reuses the same `id` for every
`<h3>` element, the lookup always returns the first heading so later cards end
up with the wrong accessible name (or no label at all). The HTML fragment
below reproduces the issue:

```html
<a class="card-v9" aria-labelledby="card-title-2">
  <h3 id="card-title-1">Push Notifications</h3>
  <!-- ... -->
</a>
```

The anchor advertises `aria-labelledby="card-title-2"`, but no element with
that ID exists because every heading is stamped as `card-title-1`. Aside from
being invalid HTML (IDs must be unique), this mismatch stops the widget from
finding the expected heading and breaks the compatibility helpers that
announce the card copy to assistive technologies.

**Fix:** ensure each heading exposes a unique ID that matches the
`aria-labelledby` reference on its parent link:

```html
<a class="card-v9" aria-labelledby="card-title-2">
  <h3 id="card-title-2">Push Notifications</h3>
  <!-- ... -->
</a>
```

Repeat the pattern for every card so the DOM stays valid and the widget can
reliably map `aria-labelledby` attributes back to the intended text.

## Preview

<video style='width:100%; height:auto;' src='https://www.youtube.com/watch?v=lGgnvHaFSIg'></video>


## License

This project is distributed under the Stiac Web Services Proprietary License. Commercial use, modification, and redistribution are prohibited unless you receive explicit written authorization from Stiac Web Services.
