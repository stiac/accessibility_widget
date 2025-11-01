# Accessibility Plugin


## Preview
[click here to see preview](https://olinke.com/accessibility-plugin/)

## Description

The Accessibility Plugin is a JavaScript library that helps improve the accessibility of your web applications. It provides a set of utility functions and components that can be easily integrated into your project.

- **Current Version:** `1.5.1`
- See [`CHANGELOG.md`](./CHANGELOG.md) for full release history and [`SOFTWARE_REPORT.md`](./SOFTWARE_REPORT.md) for status tracking.

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
- **Change Position**: You can change the position of the accessibility menu to `left`, `right`, `top` or `bottom` as User needs.
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
- In this div, you can find class `right` by **default**. You can change it to `left`, `right`, `top` or `bottom` as you need

### Styling

- The menu now uses Tailwind CSS classes. If your page does not already include Tailwind, the plugin injects the CDN build automatically when the panel loads.
- Adjust the colour scheme quickly by editing the CSS variables (`--acc_color_1` and `--acc_color_2`) at the top of `accessibility-menu.js`.

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
| `data-color-button-active` | CSS colour used for active cards, the close button, and the reset button background. | Any valid CSS colour (`#hex`, `rgb()`, etc.) | `#0f172a` |
| `data-color-button` | CSS colour used for icon/text colour on the elements above. | Any valid CSS colour | `#f8fafc` |
| `data-voce1` | Overrides the main heading inside the widget (useful for localisation/branding). | Free text | `Accessibility Tools` / translated value |
| `data-voce2` | Overrides the sub-heading tagline beneath the title. | Free text | `Fine-tune colours…` / translated value |
| `data-locales-path` | Overrides the folder that contains JSON locale files. Use when hosting the bundles outside the script directory. | Relative or absolute path ending in the folder containing locale JSON files. | `<script dir>/locales` when same origin, otherwise the host site's `/locales` folder |

All attributes are optional; omit any value to keep the default behaviour. Colours are validated at runtime, so unsupported values gracefully fall back to the defaults.

### Internationalisation

- Load the `i18n.js` helper **before** `accessibility-menu.js`. The helper auto-detects the browser language (`navigator.language`), falls back to English, and stores the user's manual selection in `localStorage` (`stiacAccessibilityLanguage`).
- Locale files live under `/locales/<lang>.json` by default (e.g., `/locales/en.json`). When the menu script runs from a different origin (such as a CDN), the loader now defaults to the host site's `/locales` directory to avoid CORS issues; adjust `data-locales-path` if your bundles live elsewhere. Each file mirrors the same structure so you can add new languages by dropping another JSON document and extending `SUPPORTED_LANGUAGES` in `accessibility-menu.js`.
- Use the built-in language selector inside the widget to switch languages. The control is fully keyboard accessible, updates the `<html lang>` attribute, and announces changes with `aria-live="polite"`.
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
