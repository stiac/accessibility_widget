# Accessibility Plugin


## Preview
[click here to see preview](https://olinke.com/accessibility-plugin/)

## Description

The Accessibility Plugin is a JavaScript library that helps improve the accessibility of your web applications. It provides a set of utility functions and components that can be easily integrated into your project.

- **Current Version:** `1.4.5`
- See [`CHANGELOG.md`](./CHANGELOG.md) for full release history and [`SOFTWARE_REPORT.md`](./SOFTWARE_REPORT.md) for status tracking.

## What's New in 1.4.5

- Corrected the font-size tool to enlarge the host page while counter-scaling the accessibility widget via a root-level CSS variable, keeping the modal readable as the site grows.

## What's New in 1.4.4

- Fixed the font-size control so the root element receives percentage-based values, ensuring rem and Tailwind typography scale across the host site instead of staying locked to the default browser size.

## What's New in 1.4.3

- Expanded the security policy with coordinated disclosure guidance, clearer update timelines, and encrypted reporting options.

## What's New in 1.4.2

- Ensured the Font Size control scales the entire host page by applying the selected value with `!important` to both the `<html>` and `<body>` elements.

## What's New in 1.4.1

- Reworked the modal reveal/close motion with eased transforms so the panel opens smoothly from its anchored corner or edge.
- Deepened progress indicators to keep them visible atop the softened Tailwind cards.
- Restored the custom cursor overlays so focus, mask, and guide modes affect the full page again.

## What's New in 1.4.0

- Rebuilt the accessibility modal with Tailwind CSS utilities for a more spacious, contemporary presentation.
- Auto-load Tailwind CSS from the CDN when it is not already available so the refreshed styling works out-of-the-box.

## What's New in 1.3.4

- Added an in-app Stiac Web Services ownership badge, dataset markers, and a console notice to reinforce proprietary branding and discourage unauthorized modifications.

## What's New in 1.3.3

- Extended the "Hide video" control so it now removes common iframe-based players (YouTube, Vimeo, Wistia, etc.), classic `<embed>`/`<object>` integrations, and any element tagged with `data-acc-video-embed`.
- Added a `data-acc-preserve-video` escape hatch so site owners can opt specific players back in when the global hide mode is active.

## What's New in 1.3.2

- Extended the "Hide image" control so it now removes inline pictures, SVGs, and CSS background images while keeping the accessibility menu visible.

## What's New in 1.3.1

- Fixed a stray closing brace so the script parses correctly when linked directly via `<script src="./assets/js/accessibility.js" defer></script>` without bundling.

## What's New in 1.3.0

- Unified all progressive controls so that their progress bars stay in sync across clicks, resets, and saved sessions.
- Updated text alignment handling to reuse shared SVG templates and restore the default icon reliably after resets.
- Normalized cursor behaviour so switching away from the reading guide returns the document cursor and hides guide indicators.

## Features

- **Invert Colors**: Inverts the colors of the page to improve readability for users with visual impairments.
- **Grayscale**: Converts the page grayscale to improve readability for users with visual impairments.
- **Low Saturation**: Reduces the saturation of the page to improve readability for users with visual impairments.
- **High Saturation**: Increases the saturation of the page to improve readability for users with visual impairments.
- **Link Highlight**: Highlights all links on the page to make them easier to identify for users with visual impairments.
- **Font Size**: Increases the font size of the page to improve readability for users with visual impairments.
- **Line Height**: Increases the line height of the page to improve readability for users with visual impairments.
- **Letter Spacing**: Increases the letter spacing of the page to improve readability for users with visual impairments.
- **Text Alignment**: Changes the text alignment of the page to improve readability for users with visual impairments.
- **Low Contrast**: Reduces the contrast of the page to improve readability for users with visual impairments.
- **High Contrast**: Increases the contrast of the page to improve readability for users with visual impairments.
- **Extra Contrast**: Increases the contrast of the page even further to improve readability for users with visual impairments.
- **Hide Images**: Hides all images on the page to improve readability for users with visual impairments.
- **Hide Videos**: Hides native video tags, common iframe players, and plugin embeds (with an opt-out via `data-acc-preserve-video`) to reduce motion for users who prefer a still experience.
- **Big Circle Cursor**: Changes the cursor to a big circle to improve visibility for users with visual impairments.
- **Reading Mask**: Highlights the current line of text being read to improve focus for users with visual impairments.
- **Reading Guide**: Makes it easier to read long lines of text by Long Highlight Cursor.
- **Reset**: Resets all accessibility settings to their default values.
- **Close**: Closes the accessibility menu.
- **Change Position**: You can change the position of the accessibility menu to `left`, `right`, `top` or `bottom` as User needs.
- **Save Settings**: Save the current settings to the local storage and load them when the page is reloaded.

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

## Customization

### Change Position

- In the js file, you can find the `first div` with `id` as `accessibility-modal`
- In this div, you can find class `right` by **default**. You can change it to `left`, `right`, `top` or `bottom` as you need

### Styling

- The menu now uses Tailwind CSS classes. If your page does not already include Tailwind, the plugin injects the CDN build automatically when the panel loads.
- Adjust the colour scheme quickly by editing the CSS variables (`--acc_color_1` and `--acc_color_2`) at the top of `accessibility-menu.js`.

### Fine-tune Video Visibility

- Add `data-acc-video-embed` to any custom wrapper that should respond to the **Hide Videos** toggle (useful for bespoke players or CMS shortcodes).
- Add `data-acc-preserve-video` directly on a video/iframe/embed element to keep it visible even while the global hide toggle is active.


## Preview

<video style='width:100%; height:auto;' src='https://github.com/PrabothCharith/accessibility-plugin/assets/91902549/e310ea92-e434-4c35-a2d5-f1c99547e98e'></video>
# accessibility_widget
# accessibility_widget
# accessibility_widget
