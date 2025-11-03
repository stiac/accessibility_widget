/* --------------------------------

File#: accessibility-widget.js
Title: Accessibility Widget
Descr: The Accessibility Plugin is a JavaScript library that helps improve the accessibility of your web applications. It provides a set of utility functions and components that can be easily integrated into your project.

License: Limited SWS - Proprietary software by Stiac Web Services (SWS). Unauthorized duplication or tampering is prohibited.
Usage: gebher.com/license

Demo & Report: https://olinke.com/accessibility-widget

-------------------------------- */

// Embed OpenDyslexic weights locally to avoid cross-origin font loads.
// The base64 payloads mirror the OTF releases published at
// https://raw.githubusercontent.com/antijingoist/open-dyslexic/master/otf/.
const OPEN_DYSLEXIC_STYLESHEET_ID = 'stiac-accessibility-open-dyslexic';
const DEFAULT_OPEN_DYSLEXIC_STYLESHEET = 'open-dyslexic.css';
let openDyslexicStylesheetPromise = null;

const accessibilityMenuStyles = `
    :root {
      --a11y-stiac-color-1: #036cff;
      --a11y-stiac-color-2: #f8fafc;
      --a11y-stiac-hover-color: #1f5dff;
      --a11y-stiac-hover-text-color: #f8fafc;
      --a11y-stiac-text-color: rgba(15, 23, 42, 0.85);
      --a11y-stiac-header-bg-color: #036cff;
      --a11y-stiac-header-text-color: #ffffff;
      --a11y-stiac-control-active-bg-color: #036cff;
      --a11y-stiac-control-active-text-color: #ffffff;
      --border_radius: 24px;
      --a11y-stiac-font-scale: 1;
    }

    /*
     * A dyslexia-friendly font stack is toggled via a lightweight stylesheet
     * that loads on demand when the control is activated. The widget keeps
     * its own typography intact so only host page content inherits the face.
     */
    html[data-a11y-stiac-font-scale-active] {
      font-size: var(--a11y-stiac-root-font-size, 100%) !important;
    }

    html[data-a11y-stiac-font-scale-active] body {
      font-size: var(--a11y-stiac-body-font-size, inherit) !important;
    }

    /*
     * Apply dyslexia-supportive font stack across the host page when the
     * dedicated control is active while leaving the widget typography
     * untouched for consistent UI rendering.
     */
    html[data-a11y-stiac-dyslexia-font] body :where(:not(#accessibility-modal, #accessibility-modal *)) {
      font-family: "OpenDyslexic", "OpenDyslexic3", "Atkinson Hyperlegible", "Lexend Deca", "Lexend", "Arial", "Verdana", sans-serif !important;
      letter-spacing: 0.02em;
    }

    /*
     * Tailwind's preflight sets inline media elements (audio, canvas, embed,
     * iframe, img, object, svg, video) to display: block. When we lazily load
     * the CDN build for hosts that do not already use Tailwind, that reset can
     * unexpectedly force inline media to break layouts on the surrounding
     * site. Mark the document when we inject our fallback Tailwind build and
     * restore the browser defaults for inline media while keeping the widget's
     * icons block-level for sizing consistency.
     */
    html[data-a11y-stiac-tailwind-fallback] audio,
    html[data-a11y-stiac-tailwind-fallback] canvas,
    html[data-a11y-stiac-tailwind-fallback] embed,
    html[data-a11y-stiac-tailwind-fallback] iframe,
    html[data-a11y-stiac-tailwind-fallback] img,
    html[data-a11y-stiac-tailwind-fallback] object,
    html[data-a11y-stiac-tailwind-fallback] svg,
    html[data-a11y-stiac-tailwind-fallback] video {
      display: inline;
      vertical-align: baseline;
    }

    html[data-a11y-stiac-tailwind-fallback] #accessibility-modal svg {
      display: block;
      vertical-align: middle;
    }

    /*
     * Text alignment helpers to comply with WCAG 2.1 Level A and the
     * European Accessibility Act. Users can align textual content according
     * to their reading preference without author styles fighting the choice.
     * The modal is excluded so that the control affects the host page only.
     */
    html[data-a11y-stiac-text-align="start"] body :where(:not(#accessibility-modal, #accessibility-modal *)) {
      text-align: start !important;
    }

    html[data-a11y-stiac-text-align="center"] body :where(:not(#accessibility-modal, #accessibility-modal *)) {
      text-align: center !important;
    }

    html[data-a11y-stiac-text-align="end"] body :where(:not(#accessibility-modal, #accessibility-modal *)) {
      text-align: end !important;
    }

    html[data-a11y-stiac-text-align="justify"] body :where(:not(#accessibility-modal, #accessibility-modal *)) {
      text-align: justify !important;
    }

    .a11y-stiac-sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    #accessibility-modal,
    #accessibility-modal * {
      transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.3s ease, transform 0.3s ease;
      font-family: "Inter", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: inherit;
      line-height: 1.25;
      letter-spacing: 0;
      user-select: none;
    }

    #accessibility-modal {
      font-size: var(--a11y-stiac-modal-font-size, calc(1rem / var(--a11y-stiac-font-scale, 1)));
    }

    #accessibility-modal * {
      font-size: inherit;
    }

    /*
     * Neutralise Tailwind typography utilities inside the accessibility modal when the
     * Font Size control scales the host page. These utilities rely on rem units which
     * follow the root font size, so we provide fixed pixel fallbacks based on the
     * widget's baseline measurements and counter-scale them with the active font factor
     * to keep the UI stable regardless of the applied zoom level.
     */
    #accessibility-modal .text-xs {
      font-size: var(--a11y-stiac-modal-text-xs, calc(0.75rem / var(--a11y-stiac-font-scale, 1)));
    }

    #accessibility-modal .text-sm {
      font-size: var(--a11y-stiac-modal-text-sm, calc(0.875rem / var(--a11y-stiac-font-scale, 1)));
    }

    #accessibility-modal .text-lg {
      font-size: var(--a11y-stiac-modal-text-lg, calc(1.125rem / var(--a11y-stiac-font-scale, 1)));
    }

    #accessibility-modal .text-[10px] {
      font-size: var(--a11y-stiac-modal-text-10, calc(10px / var(--a11y-stiac-font-scale, 1)));
    }

    #accessibility-modal .text-[11px] {
      font-size: var(--a11y-stiac-modal-text-11, calc(11px / var(--a11y-stiac-font-scale, 1)));
    }

    #accessibility-modal {
      position: fixed;
      top: 1.5rem;
      right: 1rem;
      max-width: 26rem;
      width: calc(100% - 2rem);
      max-height: 90vh;
      z-index: 99999999;
      text-align: left;
      --a11y-stiac-translate-x: 0;
      --a11y-stiac-transform-origin: top right;
      --a11y-stiac-open-radius: 24px;
      --a11y-stiac-closed-radius: 9999px;
      --a11y-stiac-launcher-shadow: 0 22px 36px -18px rgba(15, 23, 42, 0.55);
      transform-origin: var(--a11y-stiac-transform-origin);
      border-radius: var(--a11y-stiac-open-radius);
      transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.45s cubic-bezier(0.22, 1, 0.36, 1), width 0.35s ease, height 0.35s ease, opacity 0.35s ease, box-shadow 0.35s ease;
      opacity: 0;
      transform: translate3d(var(--a11y-stiac-translate-x), 16px, 0) scale(0.96);
      filter: saturate(100%) blur(0);
    }

    #accessibility-modal.is-ready {
      opacity: 1;
      transform: translate3d(var(--a11y-stiac-translate-x), 0, 0) scale(1);
    }

    /*
     * Animate the modal with a gentle overshoot so the expansion from the
     * launcher bubble feels responsive without being jarring.
     */
    #accessibility-modal.is-ready:not(.close) {
      animation: a11y-stiac-modal-open 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.28);
      animation-fill-mode: both;
    }

    @keyframes a11y-stiac-modal-open {
      0% {
        opacity: 0;
        transform: translate3d(var(--a11y-stiac-translate-x), 22px, 0) scale(0.9);
        filter: saturate(92%) blur(8px);
        border-radius: var(--a11y-stiac-closed-radius);
        box-shadow: var(--a11y-stiac-launcher-shadow, 0 22px 36px -18px rgba(15, 23, 42, 0.55));
      }
      55% {
        opacity: 1;
        transform: translate3d(var(--a11y-stiac-translate-x), -6px, 0) scale(1.02);
        filter: saturate(110%) blur(0);
        border-radius: calc(var(--a11y-stiac-open-radius) + 12px);
      }
      100% {
        opacity: 1;
        transform: translate3d(var(--a11y-stiac-translate-x), 0, 0) scale(1);
        filter: saturate(100%) blur(0);
        border-radius: var(--a11y-stiac-open-radius);
        box-shadow: var(--a11y-stiac-launcher-shadow, 0 22px 36px -18px rgba(15, 23, 42, 0.55));
      }
    }

    #accessibility-modal.is-ready.close {
      animation: a11y-stiac-modal-collapse 0.45s cubic-bezier(0.55, 0, 0.45, 1);
      animation-fill-mode: both;
    }

    @keyframes a11y-stiac-modal-collapse {
      0% {
        opacity: 1;
        transform: translate3d(var(--a11y-stiac-translate-x), 0, 0) scale(1);
        border-radius: var(--a11y-stiac-open-radius);
        box-shadow: var(--a11y-stiac-launcher-shadow, 0 22px 36px -18px rgba(15, 23, 42, 0.55));
      }
      100% {
        opacity: 1;
        transform: translate3d(var(--a11y-stiac-translate-x), 8px, 0) scale(0.94);
        border-radius: var(--a11y-stiac-closed-radius);
        box-shadow: var(--a11y-stiac-launcher-shadow, 0 22px 36px -18px rgba(15, 23, 42, 0.55));
      }
    }

    #accessibility-modal svg {
      width: 1.75rem;
      height: 1.75rem;
    }

    #accessibility-modal.close {
      width: 3.75rem;
      height: 3.75rem;
      min-width: 3.75rem;
      min-height: 3.75rem;
      border-radius: var(--a11y-stiac-closed-radius);
      overflow: hidden;
      opacity: 1;
      transform: translate3d(var(--a11y-stiac-translate-x), 8px, 0) scale(0.94);
      filter: saturate(100%) blur(0);
      box-shadow: var(--a11y-stiac-launcher-shadow, 0 22px 36px -18px rgba(15, 23, 42, 0.55));
    }

    #accessibility-modal.is-ready.close {
      transform: translate3d(var(--a11y-stiac-translate-x), 8px, 0) scale(0.94);
    }

    #accessibility-modal.close #headerContent,
    #accessibility-modal.close #accessibility-tools,
    #accessibility-modal.close #language-selector,
    #accessibility-modal.close #a11y-stiac-footer {
      display: none;
    }

    #accessibility-modal.close #closeBtn {
      inset: 0.5rem;
      position: absolute;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 9999px;
      margin: 0;
      box-shadow: var(--a11y-stiac-launcher-shadow, 0 22px 36px -18px rgba(15, 23, 42, 0.55));
    }

    #accessibility-modal.close #closeBtn svg {
      width: 2rem;
      height: 2rem;
    }

    #accessibility-modal:not(.close) {
      border-radius: 24px;
    }

    #accessibility-modal:not(.close) #closeBtn {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
    }

    #accessibility-modal.left {
      left: 1rem;
      right: auto;
      --a11y-stiac-translate-x: 0;
      --a11y-stiac-transform-origin: top left;
    }

    #accessibility-modal.right {
      right: 1rem;
      left: auto;
      --a11y-stiac-translate-x: 0;
      --a11y-stiac-transform-origin: top right;
    }

    #accessibility-modal.top {
      top: 1rem;
      bottom: auto;
      left: 50%;
      right: auto;
      --a11y-stiac-translate-x: -50%;
      --a11y-stiac-transform-origin: top center;
    }

    #accessibility-modal.bottom {
      top: auto;
      bottom: 1rem;
      left: 50%;
      right: auto;
      --a11y-stiac-translate-x: -50%;
      --a11y-stiac-transform-origin: bottom center;
    }

    #accessibility-modal.bottom-left {
      top: auto;
      bottom: 1rem;
      left: 1rem;
      right: auto;
      --a11y-stiac-translate-x: 0;
      --a11y-stiac-transform-origin: bottom left;
    }

    #accessibility-modal.bottom-right {
      top: auto;
      bottom: 1rem;
      right: 1rem;
      left: auto;
      --a11y-stiac-translate-x: 0;
      --a11y-stiac-transform-origin: bottom right;
    }

    #accessibility-modal #accessibility-tools {
      scrollbar-width: thin;
      /* Keep the tools grid visually centred beside the navigation column. */
      padding-right: 0.9rem;
    }

    #accessibility-modal #accessibility-tools::-webkit-scrollbar {
      width: 8px;
    }

    #accessibility-modal #accessibility-tools::-webkit-scrollbar-thumb {
      background: rgba(15, 23, 42, 0.35);
      border-radius: 9999px;
    }

    .a11y-stiac-item:hover .a11y-stiac-child {
      transform: translateY(-2px);
    }

    .a11y-stiac-child {
      border: 1px solid rgba(15, 23, 42, 0.1);
      background: var(--a11y-stiac-color-2);
      border-radius: 20px;
      box-shadow: none;
      color: var(--a11y-stiac-text-color);
      transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    }

    .a11y-stiac-child svg {
      color: inherit;
      fill: currentColor;
      transition: color 0.2s ease, fill 0.2s ease;
    }

    .a11y-stiac-child.active {
      background: var(--a11y-stiac-control-active-bg-color);
      color: var(--a11y-stiac-control-active-text-color);
      border-color: transparent;
    }

    .a11y-stiac-child:not(.active):hover,
    .a11y-stiac-child.active:hover,
    .a11y-stiac-item.group:hover .a11y-stiac-child {
      background: var(--a11y-stiac-hover-color);
      color: var(--a11y-stiac-hover-text-color);
    }

    .a11y-stiac-item.group:hover .a11y-stiac-child svg {
      color: inherit;
      fill: currentColor;
    }

    .a11y-stiac-progress-parent {
      width: 100%;
    }

    .a11y-stiac-progress-child {
      opacity: 1;
      background: rgba(15, 23, 42, 0.25);
      border-radius: 9999px;
      border: 1px solid rgba(15, 23, 42, 0.35);
      transition: opacity 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .a11y-stiac-progress-child.active {
      opacity: 1;
      background: var(--a11y-stiac-color-1);
      border-color: var(--a11y-stiac-color-1);
      box-shadow: 0 0 0 1px rgba(248, 250, 252, 0.65);
    }

    #headerContent {
      background: var(--a11y-stiac-header-bg-color) !important;
      color: var(--a11y-stiac-header-text-color) !important;
    }

    #headerContent * {
      color: var(--a11y-stiac-header-text-color) !important;
    }

    #closeBtn {
      background: var(--a11y-stiac-header-bg-color);
      color: var(--a11y-stiac-header-text-color);
      transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
    }

    #closeBtn:hover {
      background: var(--a11y-stiac-hover-color);
      color: var(--a11y-stiac-hover-text-color);
    }

    #closeBtn svg {
      color: inherit;
      fill: currentColor;
      transition: color 0.2s ease, fill 0.2s ease;
    }

    #reset-all {
      background: var(--a11y-stiac-header-bg-color);
      color: var(--a11y-stiac-header-text-color);
      transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
    }

    #reset-all:hover {
      background: var(--a11y-stiac-hover-color);
      color: var(--a11y-stiac-hover-text-color);
    }

    #change-positions button {
      background: var(--a11y-stiac-color-2);
      color: var(--a11y-stiac-text-color);
      border-color: transparent;
      transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    }

    #change-positions button svg {
      color: inherit;
      fill: currentColor;
      transition: color 0.2s ease, fill 0.2s ease;
    }

    #change-positions button:hover {
      background: var(--a11y-stiac-hover-color);
      color: var(--a11y-stiac-hover-text-color);
    }

    #change-positions button.active {
      background: var(--a11y-stiac-header-bg-color);
      color: var(--a11y-stiac-header-text-color);
      box-shadow: none;
    }

    #change-positions button.active:hover {
      background: var(--a11y-stiac-hover-color);
      color: var(--a11y-stiac-hover-text-color);
    }

    .a11y-stiac-item:hover .a11y-stiac-child.active {
      background: var(--a11y-stiac-hover-color);
      color: var(--a11y-stiac-hover-text-color);
    }

    .hidden {
      display: none !important;
    }

    .underline-style-0 a {
      text-decoration: none;
      background: black !important;
      color: yellow !important;
      font-weight: bolder;
    }

    .underline-style-0 a:hover,
    .underline-style-2 a:hover,
    .underline-style-1 a:hover {
      text-decoration: underline !important;
    }

    .underline-style-1 a {
      text-decoration: none;
      background: #FFD740 !important;
      color: #005A9C !important;
      font-weight: bolder;
    }

    .underline-style-2 a {
      text-decoration: none;
      background: white !important;
      color: black !important;
      font-weight: bolder;
    }

    .hide-images :where(img, picture, svg, canvas, [role="img"], object[type^="image"], embed[type^="image"]) {
      display: none !important;
    }

    .hide-images [data-a11y-stiac-preserve-images] :where(img, picture, svg, canvas, [role="img"], object[type^="image"], embed[type^="image"]) {
      display: initial !important;
    }

    .hide-video :where(
        video,
        iframe[src*="youtube.com"],
        iframe[src*="youtu.be"],
        iframe[src*="player.vimeo.com"],
        iframe[src*="vimeo.com"],
        iframe[src*="dailymotion.com"],
        iframe[src*="facebook.com/plugins/video"],
        iframe[src*="loom.com"],
        iframe[src*="wistia"],
        iframe[src*="streamable.com"],
        iframe[src*="vidyard"],
        iframe[src*="jwplayer"],
        iframe[src*="brightcove"],
        iframe[src*="spotlightr"],
        iframe[src*="mux.com"],
        iframe[src*="video"]:not([src*="document"]),
        embed[type^="video"],
        embed[src$=".mp4"],
        embed[src$=".webm"],
        embed[src$=".ogv"],
        object[type^="video"],
        object[data$=".mp4"],
        object[data$=".webm"],
        object[data$=".ogv"],
        [data-a11y-stiac-video-embed]
      ) {
      display: none !important;
    }

    .hide-video [data-a11y-stiac-preserve-video] {
      display: initial !important;
    }

    /*
     * Reduce Motion applies a WCAG 2.1 Level A friendly blanket to the host page by
     * pausing CSS driven transitions/animations, disabling smooth scrolling, and
     * allowing the widget itself to continue operating normally.
     */
    @media (prefers-reduced-motion: reduce) {
      #accessibility-modal {
        transition-duration: 0.001ms !important;
      }

      #accessibility-modal.is-ready:not(.close) {
        animation: none !important;
      }
    }

    html.reduce-motion body :where(:not(#accessibility-modal, #accessibility-modal *)),
    html.reduce-motion body :where(:not(#accessibility-modal, #accessibility-modal *))::before,
    html.reduce-motion body :where(:not(#accessibility-modal, #accessibility-modal *))::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      animation-name: none !important;
      animation-play-state: paused !important;
      transition-delay: 0s !important;
      transition-duration: 0.001ms !important;
      transition-property: none !important;
      scroll-behavior: auto !important;
    }

    html.reduce-motion #accessibility-modal.is-ready:not(.close) {
      animation: none !important;
    }

    html.reduce-motion body marquee,
    html.reduce-motion body blink {
      animation: none !important;
      -webkit-animation: none !important;
      scroll-behavior: auto !important;
    }

    .line-height-0 * {
      line-height: 1.5;
    }

    .line-height-1 * {
      line-height: 1.8;
    }

    .line-height-2 * {
      line-height: 2;
    }

    #cursor {
      position: fixed;
      z-index: 999999999;
      pointer-events: none;
      top: 0;
      left: 0;
    }

    #cursor.cursor-0 {
      width: 50px;
      height: auto;
      aspect-ratio: 1/1;
      background: rgba(255, 0, 0, 0.5);
      border: 2px solid var(--a11y-stiac-color-2);
      box-shadow: 0 0 20px 0 var(--a11y-stiac-color-2);
      border-radius: 50%;
      mix-blend-mode: difference;
      transition: all 0.1s ease;
      transform-origin: center;
      transform: translate(-50%, -50%);
    }

    #cursor.cursor-1 {
      width: 100%;
      height: 15vh;
      background: transparent;
      border: 10px solid var(--a11y-stiac-color-2);
      border-left: 0;
      border-right: 0;
      box-shadow: 0 0 0 100vh rgb(0 0 0 / 50%);
      transition: none;
      transform: translate(0, -50%);
    }

    #cursor.cursor-2 {
      width: 25vw;
      height: 8px;
      background: var(--a11y-stiac-color-1);
      border: yellow 2px solid;
      transition: all 0.1s ease;
      transform-origin: center;
      transform: translate(-50%, 50%);
    }

    #triangle-cursor {
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid yellow;
      position: fixed;
      top: 0;
      left: 0;
      transform: translate(-50%, -50%);
      transition: all 0.1s ease;
      z-index: 999999998;
      pointer-events: none;
      display: none;
    }
`;
// Template block for the optional position controls. Having a dedicated
// constant keeps the main widget layout readable and allows runtime toggling.
const changePositionsControlsHTML = `
        <!--change positions-->
        <div id="change-positions" class="flex flex-wrap items-center justify-center gap-3">
          <button
            id="align-a11y-stiac-top"
            type="button"
            class="flex h-12 w-12 items-center justify-center rounded-xl shadow-inner shadow-slate-900/5 ring-1 ring-slate-900/10 transition focus:outline-none focus:ring-2 focus:ring-slate-900/40"
            aria-pressed="false"
            aria-label="Dock widget to the top edge"
            title="Dock widget to the top edge"
            data-i18n-attr="aria-label:controls.position.top, title:controls.position.top"
          ><!-- Render the icon as a block element so it stays optically centered inside the flex button. -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="block h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4.47 10.53a.75.75 0 0 0 1.06 0L9.25 6.81V19a.75.75 0 0 0 1.5 0V6.81l3.72 3.72a.75.75 0 1 0 1.06-1.06l-5-5a.75.75 0 0 0-1.06 0l-5 5a.75.75 0 0 0 0 1.06Z"
                fill="currentColor"
              />
            </svg></button>
          <button
            id="align-a11y-stiac-top-left"
            type="button"
            class="flex h-12 w-12 items-center justify-center rounded-xl shadow-inner shadow-slate-900/5 ring-1 ring-slate-900/10 transition focus:outline-none focus:ring-2 focus:ring-slate-900/40"
            aria-pressed="false"
            aria-label="Dock widget to the top-left corner"
            title="Dock widget to the top-left corner"
            data-i18n-attr="aria-label:controls.position.topLeft, title:controls.position.topLeft"
          ><!-- Render the icon as a block element so it stays optically centered inside the flex button. -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="block h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10.53 4.47a.75.75 0 0 1 0 1.06L6.81 9.25H19a.75.75 0 0 1 0 1.5H6.81l3.72 3.72a.75.75 0 1 1-1.06 1.06l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 0 1 1.06 0Z"
                fill="currentColor"
                transform="rotate(45 12 12)"
              />
            </svg></button>
          <button
            id="align-a11y-stiac-bottom"
            type="button"
            class="flex h-12 w-12 items-center justify-center rounded-xl shadow-inner shadow-slate-900/5 ring-1 ring-slate-900/10 transition focus:outline-none focus:ring-2 focus:ring-slate-900/40"
            aria-pressed="false"
            aria-label="Dock widget to the bottom edge"
            title="Dock widget to the bottom edge"
            data-i18n-attr="aria-label:controls.position.bottom, title:controls.position.bottom"
          ><!-- Render the icon as a block element so it stays optically centered inside the flex button. -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="block h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M19.53 13.47a.75.75 0 0 0-1.06 0L14.75 17.19V5a.75.75 0 0 0-1.5 0v12.19l-3.72-3.72a.75.75 0 1 0-1.06 1.06l5 5a.75.75 0 0 0 1.06 0l5-5a.75.75 0 0 0 0-1.06Z"
                fill="currentColor"
              />
            </svg></button>
          <button
            id="align-a11y-stiac-bottom-left"
            type="button"
            class="flex h-12 w-12 items-center justify-center rounded-xl shadow-inner shadow-slate-900/5 ring-1 ring-slate-900/10 transition focus:outline-none focus:ring-2 focus:ring-slate-900/40"
            aria-pressed="false"
            aria-label="Dock widget to the bottom-left corner"
            title="Dock widget to the bottom-left corner"
            data-i18n-attr="aria-label:controls.position.bottomLeft, title:controls.position.bottomLeft"
          ><!-- Render the icon as a block element so it stays optically centered inside the flex button. -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="block h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M13.47 19.53a.75.75 0 0 1 0-1.06l3.72-3.72H5a.75.75 0 0 1 0-1.5h12.19l-3.72-3.72a.75.75 0 1 1 1.06-1.06l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06 0Z"
                fill="currentColor"
                transform="rotate(45 12 12)"
              />
            </svg></button>
          <button
            id="align-a11y-stiac-bottom-right"
            type="button"
            class="flex h-12 w-12 items-center justify-center rounded-xl shadow-inner shadow-slate-900/5 ring-1 ring-slate-900/10 transition focus:outline-none focus:ring-2 focus:ring-slate-900/40"
            aria-pressed="false"
            aria-label="Dock widget to the bottom-right corner"
            title="Dock widget to the bottom-right corner"
            data-i18n-attr="aria-label:controls.position.bottomRight, title:controls.position.bottomRight"
          ><!-- Render the icon as a block element so it stays optically centered inside the flex button. -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="block h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M19.53 10.53a.75.75 0 0 0-1.06 0L14.75 6.81V19a.75.75 0 0 1-1.5 0V6.81l-3.72 3.72a.75.75 0 0 1-1.06-1.06l5-5a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06Z"
                fill="currentColor"
              />
            </svg></button>
          <button
            id="align-a11y-stiac-top-right"
            type="button"
            class="flex h-12 w-12 items-center justify-center rounded-xl shadow-inner shadow-slate-900/5 ring-1 ring-slate-900/10 transition focus:outline-none focus:ring-2 focus:ring-slate-900/40"
            aria-pressed="false"
            aria-label="Dock widget to the top-right corner"
            title="Dock widget to the top-right corner"
            data-i18n-attr="aria-label:controls.position.topRight, title:controls.position.topRight"
          ><!-- Render the icon as a block element so it stays optically centered inside the flex button. -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="block h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M13.47 4.47a.75.75 0 0 0 0 1.06l3.72 3.72H5a.75.75 0 0 0 0 1.5h12.19l-3.72 3.72a.75.75 0 1 0 1.06 1.06l5-5a.75.75 0 0 0 0-1.06l-5-5a.75.75 0 0 0-1.06 0Z"
                fill="currentColor"
                transform="rotate(-45 12 12)"
              />
            </svg></button>
        </div>`;

const accessibilityMenuHTML = `
    <div id="accessibility-modal" class="bottom close fixed z-[99999999] flex w-[calc(100%-2rem)] max-w-md flex-col gap-6 overflow-hidden rounded-3xl bg-white/95 text-slate-900 shadow-2xl shadow-slate-900/30 ring-1 ring-slate-900/10 backdrop-blur-lg max-h-[90vh]" data-a11y-stiac-preserve-images>
      <button id="closeBtn" class="z-10 flex h-12 w-12 items-center justify-center rounded-full shadow-lg shadow-slate-900/40 transition focus:outline-none focus:ring-2 focus:ring-slate-900/40" aria-label="Toggle accessibility panel" data-i18n-attr="aria-label:controls.panelToggle.ariaLabel">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-universal-access-circle" viewBox="0 0 16 16">
          <path d="M8 4.143A1.071 1.071 0 1 0 8 2a1.071 1.071 0 0 0 0 2.143m-4.668 1.47 3.24.316v2.5l-.323 4.585A.383.383 0 0 0 7 13.14l.826-4.017c.045-.18.301-.18.346 0L9 13.139a.383.383 0 0 0 .752-.125L9.43 8.43v-2.5l3.239-.316a.38.38 0 0 0-.047-.756H3.379a.38.38 0 0 0-.047.756Z"></path>
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8"></path>
        </svg>
      </button>
      <div id="headerContent" class="mx-6 mt-8 flex flex-col gap-2 rounded-2xl px-6 py-5 shadow-lg shadow-slate-900/40">
        <p class="text-lg font-semibold tracking-tight" data-i18n="controls.heading.title">Accessibility Tools</p>
        <span class="text-sm font-normal text-slate-300" data-i18n="controls.heading.subtitle">Fine-tune colours, typography and focus helpers with a refreshed look.</span>
      </div>
      <div id="language-selector" class="mx-6 -mt-2 flex flex-col gap-2 rounded-2xl bg-white/80 px-6 py-4 text-slate-700 ring-1 ring-inset ring-slate-900/10">
        <label id="a11y-stiac-language-label" for="a11y-stiac-language-select" class="text-xs font-semibold uppercase tracking-wide text-slate-600" data-i18n="language.selectorLabel">Language</label>
        <div class="relative mt-1">
          <button id="a11y-stiac-language-trigger" type="button" class="a11y-stiac-language-trigger inline-flex w-full items-center justify-between gap-3 rounded-xl border border-slate-900/10 bg-white/95 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/40" aria-haspopup="listbox" aria-expanded="false" aria-describedby="a11y-stiac-language-help" aria-labelledby="a11y-stiac-language-label a11y-stiac-language-active-label" aria-controls="a11y-stiac-language-dropdown">
            <span class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 ring-1 ring-inset ring-slate-900/10" data-language-active-icon>
                <svg class="h-6 w-6 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M3 12h18"></path>
                  <path d="M12 3a15 15 0 0 1 0 18"></path>
                  <path d="M12 3a15 15 0 0 0 0 18"></path>
                </svg>
              </span>
              <span id="a11y-stiac-language-active-label" class="text-sm font-medium text-slate-700" data-language-active-label>English</span>
            </span>
            <svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 0 1 1.08 1.04l-4.25 4.25a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
          <div id="a11y-stiac-language-dropdown" class="a11y-stiac-language-dropdown absolute left-0 right-0 z-20 mt-3 hidden rounded-2xl border border-slate-900/10 bg-white/95 shadow-xl shadow-slate-900/20 backdrop-blur" data-language-dropdown>
            <ul class="max-h-60 overflow-y-auto py-2" role="listbox" aria-labelledby="a11y-stiac-language-label" data-language-options></ul>
          </div>
        </div>
        <select id="a11y-stiac-language-select" class="a11y-stiac-sr-only" aria-describedby="a11y-stiac-language-help"></select>
        <p id="a11y-stiac-language-help" class="text-xs text-slate-500" data-i18n="language.selectorDescription">Choose the language used for the accessibility tools interface.</p>
      </div>
      <div id="accessibility-tools" class="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto px-4 pb-6 sm:max-h-[45vh] sm:gap-4 sm:px-6">

        <!--invert colors-->
        <div class="a11y-stiac-item group">
          <div class="a11y-stiac-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center text-sm font-semibold shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200 sm:p-5" id="invert-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-droplet-half" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M7.21.8C7.69.295 8 0 8 0q.164.544.371 1.038c.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8m.413 1.021A31 31 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10c0 0 2.5 1.5 5 .5s5-.5 5-.5c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z" />
              <path fill-rule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87z" />
            </svg>
            <p class="text-[13px] font-semibold uppercase tracking-wide sm:text-xs" data-i18n="controls.invertColours.label">Invert Colours</p>
            <div class="a11y-stiac-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-1 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-2 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-3 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--grayscale-->
        <div class="a11y-stiac-item group">
          <div class="a11y-stiac-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center text-sm font-semibold shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200 sm:p-5" id="grayscale">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-half" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 0 8 1zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16" />
            </svg>
            <p class="text-[13px] font-semibold uppercase tracking-wide sm:text-xs" data-i18n="controls.grayscale.label">Grayscale</p>
            <div class="a11y-stiac-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-1 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-2 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-3 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--saturation-->
        <div class="a11y-stiac-item group">
          <div class="a11y-stiac-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center text-sm font-semibold shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200 sm:p-5" id="saturation">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-palette" viewBox="0 0 16 16">
              <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
              <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8m-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7" />
            </svg>
            <p class="text-[13px] font-semibold uppercase tracking-wide sm:text-xs" data-i18n="controls.lowSaturation.label">Low Saturation</p>
            <div class="a11y-stiac-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-1 active h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-2 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--links highlight-->
        <div class="a11y-stiac-item group">
          <div class="a11y-stiac-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center text-sm font-semibold shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200 sm:p-5" id="underline">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
              <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
              <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
            </svg>
            <p class="text-[13px] font-semibold uppercase tracking-wide sm:text-xs" data-i18n="controls.linksHighlight.label">Links Highlight</p>
            <div class="a11y-stiac-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-1 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-2 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-3 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--font size-->
        <div class="a11y-stiac-item group">
          <div class="a11y-stiac-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center text-sm font-semibold shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200 sm:p-5" id="font-size">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 12V17H17.5C17.7761 17 18 17.2239 18 17.5C18 17.7761 17.7761 18 17.5 18H15.5C15.2239 18 15 17.7761 15 17.5C15 17.2239 15.2239 17 15.5 17H16V12H14V12.5C14 12.7761 13.7761 13 13.5 13C13.2239 13 13 12.7761 13 12.5V11.5C13 11.2239 13.2239 11 13.5 11H19.5C19.7761 11 20 11.2239 20 11.5V12.5C20 12.7761 19.7761 13 19.5 13C19.2239 13 19 12.7761 19 12.5V12H17ZM10 6V17H11.5C11.7761 17 12 17.2239 12 17.5C12 17.7761 11.7761 18 11.5 18H7.5C7.22386 18 7 17.7761 7 17.5C7 17.2239 7.22386 17 7.5 17H9V6H5V7.5C5 7.77614 4.77614 8 4.5 8C4.22386 8 4 7.77614 4 7.5V5.5C4 5.22386 4.22386 5 4.5 5H14.5C14.7761 5 15 5.22386 15 5.5V7.5C15 7.77614 14.7761 8 14.5 8C14.2239 8 14 7.77614 14 7.5V6H10Z" fill="currentColor" />
            </svg>
            <p class="text-[13px] font-semibold uppercase tracking-wide sm:text-xs" data-i18n="controls.fontSize.label">Font Size</p>
            <div class="a11y-stiac-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-1 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-2 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-3 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--line height-->
        <div class="a11y-stiac-item group">
          <div class="a11y-stiac-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center text-sm font-semibold shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200 sm:p-5" id="line-height">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5.70711V17.2929L20.1464 16.1464C20.3417 15.9512 20.6583 15.9512 20.8536 16.1464C21.0488 16.3417 21.0488 16.6583 20.8536 16.8536L18.8536 18.8536C18.6583 19.0488 18.3417 19.0488 18.1464 18.8536L16.1464 16.8536C15.9512 16.6583 15.9512 16.3417 16.1464 16.1464C16.3417 15.9512 16.6583 15.9512 16.8536 16.1464L18 17.2929V5.70711L16.8536 6.85355C16.6583 7.04882 16.3417 7.04882 16.1464 6.85355C15.9512 6.65829 15.9512 6.34171 16.1464 6.14645L18.1464 4.14645C18.3417 3.95118 18.6583 3.95118 18.8536 4.14645L20.8536 6.14645C21.0488 6.34171 21.0488 6.65829 20.8536 6.85355C20.6583 7.04882 20.3417 7.04882 20.1464 6.85355L19 5.70711ZM8 18V5H4V6.5C4 6.77614 3.77614 7 3.5 7C3.22386 7 3 6.77614 3 6.5V4.5C3 4.22386 3.22386 4 3.5 4H13.5C13.7761 4 14 4.22386 14 4.5V6.5C14 6.77614 13.7761 7 13.5 7C13.2239 7 13 6.77614 13 6.5V5H9V18H10.5C10.7761 18 11 18.2239 11 18.5C11 18.7761 10.7761 19 10.5 19H6.5C6.22386 19 6 18.7761 6 18.5C6 18.2239 6.22386 18 6.5 18H8Z" fill="currentColor" />
            </svg>
            <p class="text-[13px] font-semibold uppercase tracking-wide sm:text-xs" data-i18n="controls.lineHeight.label">Line Height</p>
            <div class="a11y-stiac-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-1 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-2 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-3 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--letter spacing-->
        <div class="a11y-stiac-item group">
          <div class="a11y-stiac-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center text-sm font-semibold shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200 sm:p-5" id="letter-spacing">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5.70711V17.2929L20.1464 16.1464C20.3417 15.9512 20.6583 15.9512 20.8536 16.1464C21.0488 16.3417 21.0488 16.6583 20.8536 16.8536L18.8536 18.8536C18.6583 19.0488 18.3417 19.0488 18.1464 18.8536L16.1464 16.8536C15.9512 16.6583 15.9512 16.3417 16.1464 16.1464C16.3417 15.9512 16.6583 15.9512 16.8536 16.1464L18 17.2929V5.70711L16.8536 6.85355C16.6583 7.04882 16.3417 7.04882 16.1464 6.85355C15.9512 6.65829 15.9512 6.34171 16.1464 6.14645L18.1464 4.14645C18.3417 3.95118 18.6583 3.95118 18.8536 4.14645L20.8536 6.14645C21.0488 6.34171 21.0488 6.65829 20.8536 6.85355C20.6583 7.04882 20.3417 7.04882 20.1464 6.85355L19 5.70711ZM8 18V5H4V6.5C4 6.77614 3.77614 7 3.5 7C3.22386 7 3 6.77614 3 6.5V4.5C3 4.22386 3.22386 4 3.5 4H13.5C13.7761 4 14 4.22386 14 4.5V6.5C14 6.77614 13.7761 7 13.5 7C13.2239 7 13 6.77614 13 6.5V5H9V18H10.5C10.7761 18 11 18.2239 11 18.5C11 18.7761 10.7761 19 10.5 19H6.5C6.22386 19 6 18.7761 6 18.5C6 18.2239 6.22386 18 6.5 18H8Z" fill="currentColor" />
            </svg>
            <p class="text-[13px] font-semibold uppercase tracking-wide sm:text-xs" data-i18n="controls.letterSpacing.label">Letter Spacing</p>
            <div class="a11y-stiac-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-1 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-2 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-3 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--dyslexia friendly font toggle-->
        <div class="a11y-stiac-item group">
          <div class="a11y-stiac-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center text-sm font-semibold shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200 sm:p-5" id="font-dyslexia" aria-describedby="font-dyslexia-description">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 5C3.11929 5 2 6.11929 2 7.5V16.5C2 17.8807 3.11929 19 4.5 19H11.75C13.1307 19 14.25 17.8807 14.25 16.5V13.75H19.5C20.8807 13.75 22 12.6307 22 11.25V7.5C22 6.11929 20.8807 5 19.5 5H4.5ZM4 7.5C4 7.22386 4.22386 7 4.5 7H11.5C11.7761 7 12 7.22386 12 7.5V9C12 9.27614 11.7761 9.5 11.5 9.5H6.75V16.5C6.75 16.7761 6.52614 17 6.25 17H4.5C4.22386 17 4 16.7761 4 16.5V7.5ZM14 7.5C14 7.22386 14.2239 7 14.5 7H19.5C19.7761 7 20 7.22386 20 7.5V11.25C20 11.5261 19.7761 11.75 19.5 11.75H14.5C14.2239 11.75 14 11.5261 14 11.25V7.5Z" fill="currentColor" />
            </svg>
            <p class="text-[13px] font-semibold uppercase tracking-wide sm:text-xs" data-i18n="controls.fontDyslexia.label">Font Dyslexia</p>
            <p id="font-dyslexia-description" class="a11y-stiac-sr-only" data-i18n="controls.fontDyslexia.description">Toggle a dyslexia-friendly font stack across the page without altering the accessibility menu.</p>
          </div>
        </div>

        <!--text align-->
        <div class="a11y-stiac-item group">
          <div class="a11y-stiac-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center text-sm font-semibold shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200 sm:p-5" id="text-align" aria-labelledby="text-align-label" aria-describedby="text-align-description">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-text-align-icon>
              <path d="M4.5 7C4.22386 7 4 6.77614 4 6.5C4 6.22386 4.22386 6 4.5 6H19.5C19.7761 6 20 6.22386 20 6.5C20 6.77614 19.7761 7 19.5 7H4.5ZM4.5 15C4.22386 15 4 14.7761 4 14.5C4 14.2239 4.22386 14 4.5 14H19.5C19.7761 14 20 14.2239 20 14.5C20 14.7761 19.7761 15 19.5 15H4.5ZM4.5 11C4.22386 11 4 10.7761 4 10.5C4 10.2239 4.22386 10 4.5 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H4.5ZM4.5 19C4.22386 19 4 18.7761 4 18.5C4 18.2239 4.22386 18 4.5 18H13.5C13.7761 18 14 18.2239 14 18.5C14 18.7761 13.7761 19 13.5 19H4.5Z" fill="currentColor"/>
            </svg>
            <p class="text-[13px] font-semibold uppercase tracking-wide sm:text-xs" id="text-align-label" data-i18n="controls.textAlign.label">Text Align</p>
            <p id="text-align-description" class="a11y-stiac-sr-only" data-i18n="controls.textAlign.description">Choose how text should align across the page. Click repeatedly to cycle through the available alignments; after the last option the alignment returns to the site default.</p>
            <p class="a11y-stiac-sr-only" data-text-align-status role="status" aria-live="polite"></p>
            <div class="a11y-stiac-progress-parent hidden mt-3 flex w-full items-center justify-between gap-2" aria-hidden="true">
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-1 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-2 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-3 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-4 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--contrast-->
        <div class="a11y-stiac-item group">
          <div class="a11y-stiac-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center text-sm font-semibold shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200 sm:p-5" id="contrast">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-transparency" viewBox="0 0 16 16">
              <path d="M0 6.5a6.5 6.5 0 0 1 12.346-2.846 6.5 6.5 0 1 1-8.691 8.691A6.5 6.5 0 0 1 0 6.5m5.144 6.358a5.5 5.5 0 1 0 7.714-7.714 6.5 6.5 0 0 1-7.714 7.714m-.733-1.269q.546.226 1.144.33l-1.474-1.474q.104.597.33 1.144m2.614.386a5.5 5.5 0 0 0 1.173-.242L4.374 7.91a6 6 0 0 0-.296 1.118zm2.157-.672q.446-.25.838-.576L5.418 6.126a6 6 0 0 0-.587.826zm1.545-1.284q.325-.39.576-.837L6.953 4.83a6 6 0 0 0-.827.587l4.6 4.602Zm1.006-1.822q.183-.562.242-1.172L9.028 4.078q-.58.096-1.118.296l3.823 3.824Zm.186-2.642a5.5 5.5 0 0 0-.33-1.144 5.5 5.5 0 0 0-1.144-.33z" />
            </svg>
            <p class="text-[13px] font-semibold uppercase tracking-wide sm:text-xs" data-i18n="controls.contrast.label">Contrast</p>
            <div class="a11y-stiac-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-1 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-2 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-3 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--hide images-->
        <div class="a11y-stiac-item group">
          <div class="a11y-stiac-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center text-sm font-semibold shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200 sm:p-5" id="hide-images">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.8,4L4.8,4l1,1L4.8,4z M19.7,19L19.7,19l0.8,0.8L19.7,19z" />
              <path d="M18,7h-2c-0.5,0-1,0.5-1,1v2c0,0.5,0.5,1,1,1h2c0.5,0,1-0.5,1-1V8C19,7.5,18.5,7,18,7z M18,10h-2V8h2V10z" />
              <path d="M22,6.5v11c0,0.6-0.2,1.1-0.6,1.6l-0.6-0.6l-0.1-0.1l-4.9-4.9l0.3-0.3c0.2-0.2,0.5-0.2,0.7,0l4.2,4.1V6.5	C21,5.7,20.3,5,19.5,5H7.4l-1-1h13.1C20.9,4,22,5.1,22,6.5z" />
              <path d="M1.9,1.1L1.1,1.9l2.4,2.4C2.6,4.6,2,5.5,2,6.5v11C2,18.9,3.1,20,4.5,20h14.8l2.9,2.9l0.7-0.7L1.9,1.1z M3,6.5	C3,5.8,3.5,5.1,4.3,5l10,10l-0.8,0.8l-5.7-5.6c-0.2-0.2-0.5-0.2-0.7,0L3,14.3V6.5z M4.5,19C3.7,19,3,18.3,3,17.5v-1.8l4.5-4.5	l5.7,5.6c0.2,0.2,0.5,0.2,0.7,0l1.1-1.1l3.3,3.3H4.5z" />
            </svg>
            <p class="text-[13px] font-semibold uppercase tracking-wide sm:text-xs" data-i18n="controls.hideImages.label">Hide Image</p>
          </div>
        </div>

        <!--hide video-->
        <div class="a11y-stiac-item group">
          <div class="a11y-stiac-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center text-sm font-semibold shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200 sm:p-5" id="hide-video">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-video-off" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M10.961 12.365a2 2 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518zM1.428 4.18A1 1 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634zM15 11.73l-3.5-1.555v-4.35L15 4.269zm-4.407 3.56-10-14 .814-.58 10 14z" />
            </svg>
            <p class="text-[13px] font-semibold uppercase tracking-wide sm:text-xs" data-i18n="controls.hideVideo.label">Hide Video</p>
          </div>
        </div>

        <!--reduce motion-->
        <div class="a11y-stiac-item group">
          <div class="a11y-stiac-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center text-sm font-semibold shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200 sm:p-5" id="reduce-motion" aria-describedby="reduce-motion-description">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm-2.5-11.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0v-6a.5.5 0 0 1 .5-.5Zm5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0v-6a.5.5 0 0 1 .5-.5Z" fill="currentColor" />
            </svg>
            <p class="text-[13px] font-semibold uppercase tracking-wide sm:text-xs" data-i18n="controls.reduceMotion.label">Reduce Motion</p>
            <p id="reduce-motion-description" class="a11y-stiac-sr-only" data-i18n="controls.reduceMotion.description">Stop animated, blinking, and flashing visuals from playing automatically across the page.</p>
          </div>
        </div>

        <!--change cursor-->
        <div class="a11y-stiac-item group">
          <div class="a11y-stiac-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center text-sm font-semibold shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200 sm:p-5" id="change-cursor">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.85333 19.8536C8.58758 20.1193 8.13463 20.0079 8.02253 19.6492L3.02253 3.64915C2.90221 3.26413 3.26389 2.90246 3.64891 3.02278L19.6489 8.02278C20.0076 8.13487 20.1191 8.58782 19.8533 8.85357L16.2069 12.5L20.8533 17.1465C21.0486 17.3417 21.0486 17.6583 20.8533 17.8536L17.8533 20.8536C17.6581 21.0488 17.3415 21.0488 17.1462 20.8536L12.4998 16.2071L8.85333 19.8536ZM4.26173 4.26197L8.73053 18.5621L12.1462 15.1465C12.3415 14.9512 12.6581 14.9512 12.8533 15.1465L17.4998 19.7929L19.7927 17.5L15.1462 12.8536C14.951 12.6583 14.951 12.3417 15.1462 12.1465L18.5619 8.73078L4.26173 4.26197Z" fill="currentColor" />
            </svg>
            <p class="text-[13px] font-semibold uppercase tracking-wide sm:text-xs" data-i18n="controls.changeCursors.label">Change Cursors</p>
            <div class="a11y-stiac-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-1 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-2 h-1 flex-1"></div>
              <div class="a11y-stiac-progress-child a11y-stiac-progress-child-3 h-1 flex-1"></div>
            </div>
          </div>
        </div>
      </div>

      <!--cursor and triangle cursor-->
      <div id="cursor"></div>
      <div id="triangle-cursor"></div>

      <!--accessibility modal footer-->
      <div id="a11y-stiac-footer" class="flex flex-col gap-4 border-t border-slate-900/10 bg-white/90 px-6 py-5 shadow-inner shadow-slate-900/5">

        <!--reset all-->
        <button id="reset-all" class="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold shadow-lg shadow-slate-900/30 transition focus:outline-none focus:ring-2 focus:ring-slate-900/40" data-i18n="controls.resetAll.label">
          Reset All
        </button>

        {{ changePositionsControls }}
        <p id="a11y-stiac-language-announcement" class="a11y-stiac-sr-only" aria-live="polite" role="status"></p>
        <div id="stiac-sws-branding" class="stiac-sws-badge text-center text-[11px] font-semibold tracking-[0.3em] text-slate-500" role="note" aria-label="Powered by Stiac Web Services">
          <a
            href="https://olinke.com/vy9reypj2j"
            target="_blank"
            rel="noopener noreferrer"
            class="block text-xs tracking-[0.35em] text-slate-600"
          >
            Powered by Stiac Web Services
          </a>
        </div>
      </div>
    </div>
`;

const VALID_MODAL_POSITIONS = ['left', 'top', 'bottom', 'right', 'bottom-left', 'bottom-right'];

/**
 * Normalise widget placement requests so we always apply a known alignment class.
 * Accepts both the modal position keywords (e.g. "bottom-left") and alignment
 * control identifiers (e.g. "align-a11y-stiac-bottom-left").
 * @param {string} value - Raw configuration string provided by the host page.
 * @param {string} fallback - Safe position to use when the provided value is invalid.
 * @returns {string} Sanitised position class.
 */
function normalisePositionClass(value, fallback = 'bottom') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmedValue = value.trim().toLowerCase();
    if (!trimmedValue) {
        return fallback;
    }
    const withoutPrefix = trimmedValue.startsWith('align-a11y-stiac-')
        ? trimmedValue.substring('align-a11y-stiac-'.length)
        : trimmedValue;
    return VALID_MODAL_POSITIONS.includes(withoutPrefix) ? withoutPrefix : fallback;
}

function resolveWidgetScriptConfig() {
    const defaults = {
        defaultLanguage: 'en',
        mode: 'production',
        colorButtonActive: '#036cff',
        colorButton: '#f8fafc',
        colorButtonHover: '',
        colorText: '',
        colorHeaderBackground: '',
        colorHeaderText: '#ffffff',
        colorControlActive: '',
        colorControlActiveText: '#ffffff',
        defaultPosition: 'bottom-left',
        voce1: '',
        voce2: '',
        localesPath: '',
        assetBasePath: '',
        openDyslexicStylesheet: '',
        injectTailwind: true,
        tailwindStylesheet: 'accessibility-tailwind.css',
        tailwindCdnUrl: '',
        translateLanguageNames: false,
        preserveLanguageIcons: false,
        positionControlsEnabled: false
    };

    if (typeof document === 'undefined') {
        return defaults;
    }

    const locateScript = () => {
        if (document.currentScript) {
            return document.currentScript;
        }
        const scripts = document.querySelectorAll('script[src]');
        for (let index = scripts.length - 1; index >= 0; index -= 1) {
            const candidate = scripts[index];
            if (!candidate || typeof candidate.src !== 'string') {
                continue;
            }
            const srcName = candidate.src.split('?')[0].split('#')[0];
            if (!srcName) {
                continue;
            }
            const fileName = srcName.substring(srcName.lastIndexOf('/') + 1);
            if (fileName.includes('accessibility-menu')) {
                return candidate;
            }
        }
        return null;
    };

    const script = locateScript();
    if (!script || !script.dataset) {
        return defaults;
    }

    const config = { ...defaults };

    if (typeof script.src === 'string' && script.src.trim()) {
        const srcName = script.src.split('?')[0].split('#')[0];
        const slashIndex = srcName.lastIndexOf('/');
        if (slashIndex !== -1) {
            config.assetBasePath = srcName.substring(0, slashIndex + 1);
        }
    }

    if (typeof script.dataset.assetsPath === 'string' && script.dataset.assetsPath.trim()) {
        const trimmed = script.dataset.assetsPath.trim();
        config.assetBasePath = trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
    }

    if (typeof script.dataset.defaultLanguage === 'string' && script.dataset.defaultLanguage.trim()) {
        config.defaultLanguage = script.dataset.defaultLanguage.trim().toLowerCase();
    }

    if (typeof script.dataset.mode === 'string' && script.dataset.mode.trim()) {
        config.mode = script.dataset.mode.trim().toLowerCase();
    }

    if (typeof script.dataset.colorButtonActive === 'string' && script.dataset.colorButtonActive.trim()) {
        config.colorButtonActive = script.dataset.colorButtonActive.trim();
    }

    if (typeof script.dataset.colorButton === 'string' && script.dataset.colorButton.trim()) {
        config.colorButton = script.dataset.colorButton.trim();
    }

    if (typeof script.dataset.colorButtonHover === 'string' && script.dataset.colorButtonHover.trim()) {
        config.colorButtonHover = script.dataset.colorButtonHover.trim();
    }

    if (typeof script.dataset.colorText === 'string' && script.dataset.colorText.trim()) {
        config.colorText = script.dataset.colorText.trim();
    }

    if (typeof script.dataset.colorHeaderBackground === 'string' && script.dataset.colorHeaderBackground.trim()) {
        config.colorHeaderBackground = script.dataset.colorHeaderBackground.trim();
    }

    if (typeof script.dataset.colorHeaderText === 'string' && script.dataset.colorHeaderText.trim()) {
        config.colorHeaderText = script.dataset.colorHeaderText.trim();
    }

    if (typeof script.dataset.colorControlActive === 'string' && script.dataset.colorControlActive.trim()) {
        config.colorControlActive = script.dataset.colorControlActive.trim();
    }

    if (typeof script.dataset.colorControlActiveText === 'string' && script.dataset.colorControlActiveText.trim()) {
        config.colorControlActiveText = script.dataset.colorControlActiveText.trim();
    }

    if (typeof script.dataset.defaultPosition === 'string' && script.dataset.defaultPosition.trim()) {
        config.defaultPosition = script.dataset.defaultPosition.trim();
    } else if (typeof script.dataset.position === 'string' && script.dataset.position.trim()) {
        config.defaultPosition = script.dataset.position.trim();
    }

    if (typeof script.dataset.voce1 === 'string' && script.dataset.voce1.trim()) {
        config.voce1 = script.dataset.voce1.trim();
    }

    if (typeof script.dataset.voce2 === 'string' && script.dataset.voce2.trim()) {
        config.voce2 = script.dataset.voce2.trim();
    }

    if (typeof script.dataset.localesPath === 'string' && script.dataset.localesPath.trim()) {
        config.localesPath = script.dataset.localesPath.trim();
    }

    if (typeof script.dataset.openDyslexicStylesheet === 'string' && script.dataset.openDyslexicStylesheet.trim()) {
        config.openDyslexicStylesheet = script.dataset.openDyslexicStylesheet.trim();
    }

    if (typeof script.dataset.tailwind === 'string' && script.dataset.tailwind.trim()) {
        const rawPreference = script.dataset.tailwind.trim().toLowerCase();
        const truthyValues = ['1', 'true', 'yes', 'on'];
        const falsyValues = ['0', 'false', 'no', 'off'];
        if (truthyValues.includes(rawPreference)) {
            config.injectTailwind = true;
        } else if (falsyValues.includes(rawPreference)) {
            config.injectTailwind = false;
        }
    }

    if (typeof script.dataset.tailwindStylesheet === 'string' && script.dataset.tailwindStylesheet.trim()) {
        config.tailwindStylesheet = script.dataset.tailwindStylesheet.trim();
    }

    if (typeof script.dataset.tailwindCdn === 'string' && script.dataset.tailwindCdn.trim()) {
        config.tailwindCdnUrl = script.dataset.tailwindCdn.trim();
    } else if (typeof script.dataset.tailwindCdnUrl === 'string' && script.dataset.tailwindCdnUrl.trim()) {
        config.tailwindCdnUrl = script.dataset.tailwindCdnUrl.trim();
    }

    if (typeof script.dataset.translateLanguageNames === 'string' && script.dataset.translateLanguageNames.trim()) {
        const rawPreference = script.dataset.translateLanguageNames.trim().toLowerCase();
        const truthyValues = ['1', 'true', 'yes', 'on'];
        const falsyValues = ['0', 'false', 'no', 'off'];
        if (truthyValues.includes(rawPreference)) {
            config.translateLanguageNames = true;
        } else if (falsyValues.includes(rawPreference)) {
            config.translateLanguageNames = false;
        }
    }

    if (typeof script.dataset.preserveLanguageIcons === 'string' && script.dataset.preserveLanguageIcons.trim()) {
        const rawPreference = script.dataset.preserveLanguageIcons.trim().toLowerCase();
        const truthyValues = ['1', 'true', 'yes', 'on'];
        const falsyValues = ['0', 'false', 'no', 'off'];
        if (truthyValues.includes(rawPreference)) {
            config.preserveLanguageIcons = true;
        } else if (falsyValues.includes(rawPreference)) {
            config.preserveLanguageIcons = false;
        }
    }

    const positionControlsPreference = typeof script.dataset.positionControls === 'string'
        ? script.dataset.positionControls
        : script.dataset.enablePositionControls;
    if (typeof positionControlsPreference === 'string' && positionControlsPreference.trim()) {
        const rawPreference = positionControlsPreference.trim().toLowerCase();
        const truthyValues = ['1', 'true', 'yes', 'on'];
        const falsyValues = ['0', 'false', 'no', 'off'];
        if (truthyValues.includes(rawPreference)) {
            config.positionControlsEnabled = true;
        } else if (falsyValues.includes(rawPreference)) {
            config.positionControlsEnabled = false;
        }
    }

    config.defaultPosition = normalisePositionClass(config.defaultPosition, defaults.defaultPosition);

    return config;
}

const widgetScriptConfig = resolveWidgetScriptConfig();
const DEFAULT_MODAL_POSITION = normalisePositionClass(widgetScriptConfig.defaultPosition, 'bottom-left');

function resolveOpenDyslexicStylesheetHref() {
    if (widgetScriptConfig.openDyslexicStylesheet) {
        return widgetScriptConfig.openDyslexicStylesheet;
    }
    const basePath = widgetScriptConfig.assetBasePath || '';
    if (basePath) {
        return basePath.endsWith('/')
            ? `${basePath}${DEFAULT_OPEN_DYSLEXIC_STYLESHEET}`
            : `${basePath}/${DEFAULT_OPEN_DYSLEXIC_STYLESHEET}`;
    }
    return DEFAULT_OPEN_DYSLEXIC_STYLESHEET;
}

function resolveTailwindAsset() {
    const stylesheetPreference = typeof widgetScriptConfig.tailwindStylesheet === 'string'
        ? widgetScriptConfig.tailwindStylesheet.trim()
        : '';
    if (stylesheetPreference) {
        if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(stylesheetPreference) || stylesheetPreference.startsWith('/')) {
            return { type: 'link', href: stylesheetPreference };
        }
        const basePath = widgetScriptConfig.assetBasePath || '';
        const resolvedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
        return { type: 'link', href: `${resolvedBase}${stylesheetPreference}` };
    }

    const cdnPreference = typeof widgetScriptConfig.tailwindCdnUrl === 'string'
        ? widgetScriptConfig.tailwindCdnUrl.trim()
        : '';
    if (cdnPreference) {
        const isStylesheet = /\.css(?:$|[?#])/i.test(cdnPreference);
        return { type: isStylesheet ? 'link' : 'script', href: cdnPreference };
    }

    return null;
}

function ensureOpenDyslexicStylesheet() {
    if (typeof document === 'undefined') {
        return Promise.resolve();
    }
    if (document.getElementById(OPEN_DYSLEXIC_STYLESHEET_ID)) {
        return Promise.resolve();
    }
    if (openDyslexicStylesheetPromise) {
        return openDyslexicStylesheetPromise;
    }
    if (!document.head) {
        return Promise.resolve();
    }

    const href = resolveOpenDyslexicStylesheetHref();
    openDyslexicStylesheetPromise = new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.id = OPEN_DYSLEXIC_STYLESHEET_ID;
        link.rel = 'stylesheet';
        link.href = href;
        link.setAttribute('data-owner', 'stiac-accessibility');
        link.onload = () => resolve();
        link.onerror = (event) => {
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
            openDyslexicStylesheetPromise = null;
            reject(new Error(`Failed to load OpenDyslexic stylesheet from ${href}`));
        };
        document.head.appendChild(link);
    });

    return openDyslexicStylesheetPromise;
}

// Locale bundles embedded directly within the widget so we can serve translations without
// depending on external JSON requests (useful when CORS is blocked or files cannot be hosted
// separately). These mirror the JSON documents found in the `/locales` directory.
const EMBEDDED_LOCALES = {
    'de': {
        "language": {
            "code": "de",
            "name": "Deutsch",
            "selectorLabel": "Sprache",
            "selectorDescription": "Wählen Sie die Sprache für die Oberfläche der Barrierefreiheits-Werkzeuge.",
            "announcement": "Sprache auf {{language}} geändert."
        },
        "controls": {
            "panelToggle": {
                "ariaLabel": "Barrierefreiheitsmenü ein- oder ausblenden"
            },
            "heading": {
                "title": "Barrierefreiheits-Werkzeuge",
                "subtitle": "Optimieren Sie Farben, Typografie und Fokus-Hilfen mit einer überarbeiteten Oberfläche."
            },
            "invertColours": {
                "label": "Farben invertieren"
            },
            "grayscale": {
                "label": "Graustufen"
            },
            "lowSaturation": {
                "label": "Geringe Sättigung"
            },
            "linksHighlight": {
                "label": "Links hervorheben"
            },
            "fontSize": {
                "label": "Schriftgröße"
            },
            "lineHeight": {
                "label": "Zeilenhöhe"
            },
            "letterSpacing": {
                "label": "Zeichenabstand"
            },
            "fontDyslexia": {
                "label": "Schrift für Dyslexie",
                "description": "Aktiviert eine dyslexiefreundliche Schrift auf der gesamten Seite, ohne das Barrierefreiheitsmenü zu verändern."
            },
            "textAlign": {
                "label": "Textausrichtung",
                "description": "Bestimmen Sie, wie Text auf der Seite ausgerichtet wird. Wiederholtes Klicken wechselt durch die verfügbaren Ausrichtungen; nach der letzten Option wird die Standardausrichtung wiederhergestellt.",
                "status": {
                    "start": "den Anfangsrand",
                    "center": "die Mitte",
                    "end": "den Endrand",
                    "justify": "Blocksatz",
                    "reset": "die Standardausrichtung der Seite"
                }
            },
            "contrast": {
                "label": "Kontrast"
            },
            "hideImages": {
                "label": "Bilder ausblenden"
            },
            "hideVideo": {
                "label": "Videos ausblenden"
            },
            "reduceMotion": {
                "label": "Animationen reduzieren",
                "description": "Stoppt animierte, blinkende und flackernde Inhalte, damit sie nicht automatisch abgespielt werden."
            },
            "changeCursors": {
                "label": "Cursor ändern"
            },
            "resetAll": {
                "label": "Alles zurücksetzen"
            },
            "position": {
                "left": "Widget links andocken",
                "top": "Widget am oberen Rand andocken",
                "topLeft": "Widget in der oberen linken Ecke andocken",
                "topRight": "Widget in der oberen rechten Ecke andocken",
                "bottom": "Widget am unteren Rand andocken",
                "bottomLeft": "Widget in der unteren linken Ecke andocken",
                "bottomRight": "Widget in der unteren rechten Ecke andocken",
                "right": "Widget rechts andocken"
            }
        },
        "announcements": {
            "textAlign": {
                "set": "Textausrichtung auf {{value}} gesetzt.",
                "reset": "Textausrichtung auf die Standardeinstellung der Seite zurückgesetzt."
            }
        },
        "languageNames": {
            "en": "Englisch",
            "it": "Italienisch",
            "fr": "Französisch",
            "de": "Deutsch",
            "es": "Spanisch",
            "pt": "Portugiesisch"
        }
    },
    'en': {
        "language": {
            "code": "en",
            "name": "English",
            "selectorLabel": "Language",
            "selectorDescription": "Choose the language used for the accessibility tools interface.",
            "announcement": "Language changed to {{language}}."
        },
        "controls": {
            "panelToggle": {
                "ariaLabel": "Toggle accessibility panel"
            },
            "heading": {
                "title": "Accessibility Tools",
                "subtitle": "Fine-tune colours, typography and focus helpers with a refreshed look."
            },
            "invertColours": {
                "label": "Invert Colours"
            },
            "grayscale": {
                "label": "Grayscale"
            },
            "lowSaturation": {
                "label": "Low Saturation"
            },
            "linksHighlight": {
                "label": "Links Highlight"
            },
            "fontSize": {
                "label": "Font Size"
            },
            "lineHeight": {
                "label": "Line Height"
            },
            "letterSpacing": {
                "label": "Letter Spacing"
            },
            "fontDyslexia": {
                "label": "Font Dyslexia",
                "description": "Toggle a dyslexia-friendly font stack across the page without altering the accessibility menu."
            },
            "textAlign": {
                "label": "Text Align",
                "description": "Choose how text should align across the page. Click repeatedly to cycle through the available alignments; after the last option the alignment returns to the site default.",
                "status": {
                    "start": "the start edge",
                    "center": "the center",
                    "end": "the end edge",
                    "justify": "full justification",
                    "reset": "the site default alignment"
                }
            },
            "contrast": {
                "label": "Contrast"
            },
            "hideImages": {
                "label": "Hide Image"
            },
            "hideVideo": {
                "label": "Hide Video"
            },
            "reduceMotion": {
                "label": "Reduce Motion",
                "description": "Stop animated, blinking, and flashing visuals from playing automatically across the page."
            },
            "changeCursors": {
                "label": "Change Cursors"
            },
            "resetAll": {
                "label": "Reset All"
            },
            "position": {
                "left": "Dock widget to the left edge",
                "top": "Dock widget to the top edge",
                "topLeft": "Dock widget to the top-left corner",
                "topRight": "Dock widget to the top-right corner",
                "bottom": "Dock widget to the bottom edge",
                "bottomLeft": "Dock widget to the bottom-left corner",
                "bottomRight": "Dock widget to the bottom-right corner",
                "right": "Dock widget to the right edge"
            }
        },
        "announcements": {
            "textAlign": {
                "set": "Text alignment set to {{value}}.",
                "reset": "Text alignment restored to the site default."
            }
        },
        "languageNames": {
            "en": "English",
            "it": "Italian",
            "fr": "French",
            "de": "German",
            "es": "Spanish",
            "pt": "Portuguese"
        }
    },
    'es': {
        "language": {
            "code": "es",
            "name": "Español",
            "selectorLabel": "Idioma",
            "selectorDescription": "Elija el idioma utilizado para la interfaz de las herramientas de accesibilidad.",
            "announcement": "Idioma cambiado a {{language}}."
        },
        "controls": {
            "panelToggle": {
                "ariaLabel": "Abrir o cerrar el panel de accesibilidad"
            },
            "heading": {
                "title": "Herramientas de accesibilidad",
                "subtitle": "Ajuste colores, tipografía y ayudas de enfoque con una interfaz renovada."
            },
            "invertColours": {
                "label": "Invertir colores"
            },
            "grayscale": {
                "label": "Escala de grises"
            },
            "lowSaturation": {
                "label": "Baja saturación"
            },
            "linksHighlight": {
                "label": "Resaltar enlaces"
            },
            "fontSize": {
                "label": "Tamaño de letra"
            },
            "lineHeight": {
                "label": "Altura de línea"
            },
            "letterSpacing": {
                "label": "Espaciado entre letras"
            },
            "fontDyslexia": {
                "label": "Fuente para dislexia",
                "description": "Activa una familia de letras adecuada a la dislexia en toda la página sin alterar el menú de accesibilidad."
            },
            "textAlign": {
                "label": "Alinear texto",
                "description": "Decida cómo se alinea el texto en la página. Haga clic repetidamente para recorrer las alineaciones disponibles; tras la última opción se restablece la alineación predeterminada del sitio.",
                "status": {
                    "start": "el inicio",
                    "center": "el centro",
                    "end": "el extremo",
                    "justify": "el justificado",
                    "reset": "la alineación predeterminada del sitio"
                }
            },
            "contrast": {
                "label": "Contraste"
            },
            "hideImages": {
                "label": "Ocultar imágenes"
            },
            "hideVideo": {
                "label": "Ocultar vídeos"
            },
            "reduceMotion": {
                "label": "Reducir movimiento",
                "description": "Detiene que los elementos animados, parpadeantes o intermitentes se reproduzcan automáticamente en la página."
            },
            "changeCursors": {
                "label": "Cambiar cursores"
            },
            "resetAll": {
                "label": "Restablecer todo"
            },
            "position": {
                "left": "Acoplar el widget al borde izquierdo",
                "top": "Acoplar el widget al borde superior",
                "topLeft": "Acoplar el widget a la esquina superior izquierda",
                "topRight": "Acoplar el widget a la esquina superior derecha",
                "bottom": "Acoplar el widget al borde inferior",
                "bottomLeft": "Acoplar el widget a la esquina inferior izquierda",
                "bottomRight": "Acoplar el widget a la esquina inferior derecha",
                "right": "Acoplar el widget al borde derecho"
            }
        },
        "announcements": {
            "textAlign": {
                "set": "Alineación de texto establecida en {{value}}.",
                "reset": "Alineación de texto restablecida a la configuración predeterminada del sitio."
            }
        },
        "languageNames": {
            "en": "Inglés",
            "it": "Italiano",
            "fr": "Francés",
            "de": "Alemán",
            "es": "Español",
            "pt": "Portugués"
        }
    },
    'fr': {
        "language": {
            "code": "fr",
            "name": "Français",
            "selectorLabel": "Langue",
            "selectorDescription": "Choisissez la langue utilisée pour l'interface des outils d'accessibilité.",
            "announcement": "Langue changée en {{language}}."
        },
        "controls": {
            "panelToggle": {
                "ariaLabel": "Ouvrir ou fermer le panneau d'accessibilité"
            },
            "heading": {
                "title": "Outils d'accessibilité",
                "subtitle": "Ajustez couleurs, typographie et aides au focus avec une nouvelle interface."
            },
            "invertColours": {
                "label": "Inverser les couleurs"
            },
            "grayscale": {
                "label": "Niveaux de gris"
            },
            "lowSaturation": {
                "label": "Faible saturation"
            },
            "linksHighlight": {
                "label": "Mettre les liens en évidence"
            },
            "fontSize": {
                "label": "Taille de police"
            },
            "lineHeight": {
                "label": "Interligne"
            },
            "letterSpacing": {
                "label": "Espacement des lettres"
            },
            "fontDyslexia": {
                "label": "Police dyslexie",
                "description": "Activez une police adaptée à la dyslexie sur toute la page sans modifier le menu d'accessibilité."
            },
            "textAlign": {
                "label": "Alignement du texte",
                "description": "Choisissez l'alignement du texte sur la page. Cliquez plusieurs fois pour parcourir les options disponibles ; après la dernière, l'alignement par défaut du site est rétabli.",
                "status": {
                    "start": "le bord initial",
                    "center": "le centre",
                    "end": "le bord final",
                    "justify": "la justification",
                    "reset": "l'alignement par défaut du site"
                }
            },
            "contrast": {
                "label": "Contraste"
            },
            "hideImages": {
                "label": "Masquer les images"
            },
            "hideVideo": {
                "label": "Masquer les vidéos"
            },
            "reduceMotion": {
                "label": "Réduire les animations",
                "description": "Empêche la lecture automatique des éléments animés, clignotants ou scintillants sur la page."
            },
            "changeCursors": {
                "label": "Modifier les curseurs"
            },
            "resetAll": {
                "label": "Réinitialiser tout"
            },
            "position": {
                "left": "Ancrer le widget sur le bord gauche",
                "top": "Ancrer le widget sur le bord supérieur",
                "topLeft": "Ancrer le widget dans le coin supérieur gauche",
                "topRight": "Ancrer le widget dans le coin supérieur droit",
                "bottom": "Ancrer le widget sur le bord inférieur",
                "bottomLeft": "Ancrer le widget dans le coin inférieur gauche",
                "bottomRight": "Ancrer le widget dans le coin inférieur droit",
                "right": "Ancrer le widget sur le bord droit"
            }
        },
        "announcements": {
            "textAlign": {
                "set": "Alignement du texte défini sur {{value}}.",
                "reset": "Alignement du texte rétabli sur la valeur par défaut du site."
            }
        },
        "languageNames": {
            "en": "Anglais",
            "it": "Italien",
            "fr": "Français",
            "de": "Allemand",
            "es": "Espagnol",
            "pt": "Portugais"
        }
    },
    'it': {
        "language": {
            "code": "it",
            "name": "Italiano",
            "selectorLabel": "Lingua",
            "selectorDescription": "Scegli la lingua utilizzata per l'interfaccia degli strumenti di accessibilità.",
            "announcement": "Lingua impostata su {{language}}."
        },
        "controls": {
            "panelToggle": {
                "ariaLabel": "Apri o chiudi il pannello di accessibilità"
            },
            "heading": {
                "title": "Strumenti di Accessibilità",
                "subtitle": "Personalizza colori, tipografia e aiuti al focus con un'interfaccia aggiornata."
            },
            "invertColours": {
                "label": "Inverti Colori"
            },
            "grayscale": {
                "label": "Scala di grigi"
            },
            "lowSaturation": {
                "label": "Bassa Saturazione"
            },
            "linksHighlight": {
                "label": "Evidenzia Link"
            },
            "fontSize": {
                "label": "Dimensione Testo"
            },
            "lineHeight": {
                "label": "Interlinea"
            },
            "letterSpacing": {
                "label": "Spaziatura Lettere"
            },
            "fontDyslexia": {
                "label": "Font per Dislessia",
                "description": "Attiva un set di caratteri adatto alla dislessia sull'intera pagina senza modificare il menu di accessibilità."
            },
            "textAlign": {
                "label": "Allineamento del testo",
                "description": "Scegli come allineare il testo nella pagina. Clicca più volte per scorrere le opzioni disponibili; dopo l'ultima scelta viene ripristinato l'allineamento predefinito del sito.",
                "status": {
                    "start": "il margine iniziale",
                    "center": "il centro",
                    "end": "il margine finale",
                    "justify": "la giustificazione",
                    "reset": "l'allineamento predefinito del sito"
                }
            },
            "contrast": {
                "label": "Contrasto"
            },
            "hideImages": {
                "label": "Nascondi immagini"
            },
            "hideVideo": {
                "label": "Nascondi video"
            },
            "reduceMotion": {
                "label": "Riduci animazioni",
                "description": "Interrompe la riproduzione automatica di elementi animati, lampeggianti o sfarfallanti nella pagina."
            },
            "changeCursors": {
                "label": "Cambia cursori"
            },
            "resetAll": {
                "label": "Reimposta tutto"
            },
            "position": {
                "left": "Aggancia il widget al bordo sinistro",
                "top": "Aggancia il widget al bordo superiore",
                "topLeft": "Aggancia il widget all'angolo in alto a sinistra",
                "topRight": "Aggancia il widget all'angolo in alto a destra",
                "bottom": "Aggancia il widget al bordo inferiore",
                "bottomLeft": "Aggancia il widget all'angolo in basso a sinistra",
                "bottomRight": "Aggancia il widget all'angolo in basso a destra",
                "right": "Aggancia il widget al bordo destro"
            }
        },
        "announcements": {
            "textAlign": {
                "set": "Allineamento del testo impostato su {{value}}.",
                "reset": "Allineamento del testo ripristinato all'impostazione predefinita del sito."
            }
        },
        "languageNames": {
            "en": "Inglese",
            "it": "Italiano",
            "fr": "Francese",
            "de": "Tedesco",
            "es": "Spagnolo",
            "pt": "Portoghese"
        }
    },
    'pt': {
        "language": {
            "code": "pt",
            "name": "Português",
            "selectorLabel": "Idioma",
            "selectorDescription": "Escolha o idioma utilizado na interface das ferramentas de acessibilidade.",
            "announcement": "Idioma alterado para {{language}}."
        },
        "controls": {
            "panelToggle": {
                "ariaLabel": "Abrir ou fechar o painel de acessibilidade"
            },
            "heading": {
                "title": "Ferramentas de acessibilidade",
                "subtitle": "Ajuste cores, tipografia e auxiliares de foco com uma interface renovada."
            },
            "invertColours": {
                "label": "Inverter cores"
            },
            "grayscale": {
                "label": "Tons de cinza"
            },
            "lowSaturation": {
                "label": "Baixa saturação"
            },
            "linksHighlight": {
                "label": "Realçar ligações"
            },
            "fontSize": {
                "label": "Tamanho da fonte"
            },
            "lineHeight": {
                "label": "Altura da linha"
            },
            "letterSpacing": {
                "label": "Espaçamento entre letras"
            },
            "fontDyslexia": {
                "label": "Fonte para dislexia",
                "description": "Ativa uma família de letras adequada à dislexia em toda a página sem alterar o menu de acessibilidade."
            },
            "textAlign": {
                "label": "Alinhamento do texto",
                "description": "Escolha como o texto deve ser alinhado na página. Clique repetidamente para percorrer as opções disponíveis; após a última opção o alinhamento padrão do site é restaurado.",
                "status": {
                    "start": "a margem inicial",
                    "center": "o centro",
                    "end": "a margem final",
                    "justify": "a justificação",
                    "reset": "o alinhamento padrão do site"
                }
            },
            "contrast": {
                "label": "Contraste"
            },
            "hideImages": {
                "label": "Ocultar imagens"
            },
            "hideVideo": {
                "label": "Ocultar vídeos"
            },
            "reduceMotion": {
                "label": "Reduzir movimento",
                "description": "Impede que elementos animados, intermitentes ou cintilantes sejam reproduzidos automaticamente na página."
            },
            "changeCursors": {
                "label": "Alterar cursores"
            },
            "resetAll": {
                "label": "Repor tudo"
            },
            "position": {
                "left": "Ancorar o widget ao bordo esquerdo",
                "top": "Ancorar o widget ao bordo superior",
                "topLeft": "Ancorar o widget ao canto superior esquerdo",
                "topRight": "Ancorar o widget ao canto superior direito",
                "bottom": "Ancorar o widget ao bordo inferior",
                "bottomLeft": "Ancorar o widget ao canto inferior esquerdo",
                "bottomRight": "Ancorar o widget ao canto inferior direito",
                "right": "Ancorar o widget ao bordo direito"
            }
        },
        "announcements": {
            "textAlign": {
                "set": "Alinhamento do texto definido para {{value}}.",
                "reset": "Alinhamento do texto reposto para a predefinição do site."
            }
        },
        "languageNames": {
            "en": "Inglês",
            "it": "Italiano",
            "fr": "Francês",
            "de": "Alemão",
            "es": "Espanhol",
            "pt": "Português"
        }
    }
};

// Merge embedded locales onto the global namespace so the shared i18n helper can resolve
// translations without relying on cross-origin JSON fetches.
if (typeof window !== 'undefined') {
    const currentLocales = (window.AccessibilityWidgetEmbeddedLocales && typeof window.AccessibilityWidgetEmbeddedLocales === 'object')
        ? window.AccessibilityWidgetEmbeddedLocales
        : {};
    const mergedLocales = { ...currentLocales, ...EMBEDDED_LOCALES };
    window.AccessibilityWidgetEmbeddedLocales = mergedLocales;
    window.STIAC_ACCESSIBILITY_LOCALES = mergedLocales;
}

const SUPPORTED_LANGUAGES = ['en', 'it', 'fr', 'de', 'es', 'pt'];
const FALLBACK_LANGUAGE_NAMES = {
    en: 'English',
    it: 'Italian',
    fr: 'French',
    de: 'German',
    es: 'Spanish',
    pt: 'Portuguese'
};
const NATIVE_LANGUAGE_NAMES = {
    en: 'English',
    it: 'Italiano',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
    pt: 'Português'
};
const LANGUAGE_ICONS = {
    en: `<svg aria-hidden="true" class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#fff"></rect>
            <path d="M1.638,5.846H30.362c-.711-1.108-1.947-1.846-3.362-1.846H5c-1.414,0-2.65,.738-3.362,1.846Z" fill="#a62842"></path>
            <path d="M2.03,7.692c-.008,.103-.03,.202-.03,.308v1.539H31v-1.539c0-.105-.022-.204-.03-.308H2.03Z" fill="#a62842"></path>
            <path d="M2 11.385H31V13.231H2z" fill="#a62842"></path>
            <path d="M2 15.077H31V16.923000000000002H2z" fill="#a62842"></path>
            <path d="M1 18.769H31V20.615H1z" fill="#a62842"></path>
            <path d="M1,24c0,.105,.023,.204,.031,.308H30.969c.008-.103,.031-.202,.031-.308v-1.539H1v1.539Z" fill="#a62842"></path>
            <path d="M30.362,26.154H1.638c.711,1.108,1.947,1.846,3.362,1.846H27c1.414,0,2.65-.738,3.362-1.846Z" fill="#a62842"></path>
            <path d="M5,4h11v12.923H1V8c0-2.208,1.792-4,4-4Z" fill="#102d5e"></path>
            <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
            <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
            <path d="M4.601 7.463L5.193 7.033 4.462 7.033 4.236 6.338 4.01 7.033 3.279 7.033 3.87 7.463 3.644 8.158 4.236 7.729 4.827 8.158 4.601 7.463z" fill="#fff"></path>
            <path d="M7.58 7.463L8.172 7.033 7.441 7.033 7.215 6.338 6.989 7.033 6.258 7.033 6.849 7.463 6.623 8.158 7.215 7.729 7.806 8.158 7.58 7.463z" fill="#fff"></path>
            <path d="M10.56 7.463L11.151 7.033 10.42 7.033 10.194 6.338 9.968 7.033 9.237 7.033 9.828 7.463 9.603 8.158 10.194 7.729 10.785 8.158 10.56 7.463z" fill="#fff"></path>
            <path d="M6.066 9.283L6.658 8.854 5.927 8.854 5.701 8.158 5.475 8.854 4.744 8.854 5.335 9.283 5.109 9.979 5.701 9.549 6.292 9.979 6.066 9.283z" fill="#fff"></path>
            <path d="M9.046 9.283L9.637 8.854 8.906 8.854 8.68 8.158 8.454 8.854 7.723 8.854 8.314 9.283 8.089 9.979 8.68 9.549 9.271 9.979 9.046 9.283z" fill="#fff"></path>
            <path d="M12.025 9.283L12.616 8.854 11.885 8.854 11.659 8.158 11.433 8.854 10.702 8.854 11.294 9.283 11.068 9.979 11.659 9.549 12.251 9.979 12.025 9.283z" fill="#fff"></path>
            <path d="M6.066 12.924L6.658 12.494 5.927 12.494 5.701 11.799 5.475 12.494 4.744 12.494 5.335 12.924 5.109 13.619 5.701 13.19 6.292 13.619 6.066 12.924z" fill="#fff"></path>
            <path d="M9.046 12.924L9.637 12.494 8.906 12.494 8.68 11.799 8.454 12.494 7.723 12.494 8.314 12.924 8.089 13.619 8.68 13.19 9.271 13.619 9.046 12.924z" fill="#fff"></path>
            <path d="M12.025 12.924L12.616 12.494 11.885 12.494 11.659 11.799 11.433 12.494 10.702 12.494 11.294 12.924 11.068 13.619 11.659 13.19 12.251 13.619 12.025 12.924z" fill="#fff"></path>
            <path d="M13.539 7.463L14.13 7.033 13.399 7.033 13.173 6.338 12.947 7.033 12.216 7.033 12.808 7.463 12.582 8.158 13.173 7.729 13.765 8.158 13.539 7.463z" fill="#fff"></path>
            <path d="M4.601 11.104L5.193 10.674 4.462 10.674 4.236 9.979 4.01 10.674 3.279 10.674 3.87 11.104 3.644 11.799 4.236 11.369 4.827 11.799 4.601 11.104z" fill="#fff"></path>
            <path d="M7.58 11.104L8.172 10.674 7.441 10.674 7.215 9.979 6.989 10.674 6.258 10.674 6.849 11.104 6.623 11.799 7.215 11.369 7.806 11.799 7.58 11.104z" fill="#fff"></path>
            <path d="M10.56 11.104L11.151 10.674 10.42 10.674 10.194 9.979 9.968 10.674 9.237 10.674 9.828 11.104 9.603 11.799 10.194 11.369 10.785 11.799 10.56 11.104z" fill="#fff"></path>
            <path d="M13.539 11.104L14.13 10.674 13.399 10.674 13.173 9.979 12.947 10.674 12.216 10.674 12.808 11.104 12.582 11.799 13.173 11.369 13.765 11.799 13.539 11.104z" fill="#fff"></path>
            <path d="M4.601 14.744L5.193 14.315 4.462 14.315 4.236 13.619 4.01 14.315 3.279 14.315 3.87 14.744 3.644 15.44 4.236 15.01 4.827 15.44 4.601 14.744z" fill="#fff"></path>
            <path d="M7.58 14.744L8.172 14.315 7.441 14.315 7.215 13.619 6.989 14.315 6.258 14.315 6.849 14.744 6.623 15.44 7.215 15.01 7.806 15.44 7.58 14.744z" fill="#fff"></path>
            <path d="M10.56 14.744L11.151 14.315 10.42 14.315 10.194 13.619 9.968 14.315 9.237 14.315 9.828 14.744 9.603 15.44 10.194 15.01 10.785 15.44 10.56 14.744z" fill="#fff"></path>
            <path d="M13.539 14.744L14.13 14.315 13.399 14.315 13.173 13.619 12.947 14.315 12.216 14.315 12.808 14.744 12.582 15.44 13.173 15.01 13.765 15.44 13.539 14.744z" fill="#fff"></path>
        </svg>`,
    it: `<svg aria-hidden="true" class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <path fill="#fff" d="M10 4H22V28H10z"></path>
            <path d="M5,4h6V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" fill="#41914d"></path>
            <path d="M25,4h6V28h-6c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" transform="rotate(180 26 16)" fill="#bf393b"></path>
            <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
            <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
        </svg>`,
    fr: `<svg aria-hidden="true" class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <path fill="#fff" d="M10 4H22V28H10z"></path>
            <path d="M5,4h6V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" fill="#092050"></path>
            <path d="M25,4h6V28h-6c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" transform="rotate(180 26 16)" fill="#be2a2c"></path>
            <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
            <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
        </svg>`,
    de: `<svg aria-hidden="true" class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <path fill="#cc2b1d" d="M1 11H31V21H1z"></path>
            <path d="M5,4H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z"></path>
            <path d="M5,20H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" transform="rotate(180 16 24)" fill="#f8d147"></path>
            <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
            <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
        </svg>`,
    es: `<svg aria-hidden="true" class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <path fill="#f1c142" d="M1 10H31V22H1z"></path>
            <path d="M5,4H27c2.208,0,4,1.792,4,4v3H1v-3c0-2.208,1.792-4,4-4Z" fill="#a0251e"></path>
            <path d="M5,21H27c2.208,0,4,1.792,4,4v3H1v-3c0-2.208,1.792-4,4-4Z" transform="rotate(180 16 24.5)" fill="#a0251e"></path>
            <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
            <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
            <path d="M12.614,13.091c.066-.031,.055-.14-.016-.157,.057-.047,.02-.15-.055-.148,.04-.057-.012-.144-.082-.13,.021-.062-.042-.127-.104-.105,.01-.068-.071-.119-.127-.081,.004-.068-.081-.112-.134-.069-.01-.071-.11-.095-.15-.035-.014-.068-.111-.087-.149-.028-.027-.055-.114-.057-.144-.004-.03-.047-.107-.045-.136,.002-.018-.028-.057-.044-.09-.034,.009-.065-.066-.115-.122-.082,.002-.07-.087-.111-.138-.064-.013-.064-.103-.087-.144-.036-.02-.063-.114-.075-.148-.017-.036-.056-.129-.042-.147,.022-.041-.055-.135-.031-.146,.036-.011-.008-.023-.014-.037-.016,.006-.008,.01-.016,.015-.025h.002c.058-.107,.004-.256-.106-.298v-.098h.099v-.154h-.099v-.101h-.151v.101h-.099v.154h.099v.096c-.113,.04-.169,.191-.11,.299h.002c.004,.008,.009,.017,.014,.024-.015,.002-.029,.008-.04,.017-.011-.067-.106-.091-.146-.036-.018-.064-.111-.078-.147-.022-.034-.057-.128-.046-.148,.017-.041-.052-.131-.028-.144,.036-.051-.047-.139-.006-.138,.064-.056-.033-.131,.017-.122,.082-.034-.01-.072,.006-.091,.034-.029-.047-.106-.049-.136-.002-.03-.054-.117-.051-.143,.004-.037-.059-.135-.04-.149,.028-.039-.06-.14-.037-.15,.035-.053-.043-.138,0-.134,.069-.056-.038-.137,.013-.127,.081-.062-.021-.125,.044-.104,.105-.05-.009-.096,.033-.096,.084h0c0,.017,.005,.033,.014,.047-.075-.002-.111,.101-.055,.148-.071,.017-.082,.125-.016,.157-.061,.035-.047,.138,.022,.154-.013,.015-.021,.034-.021,.055h0c0,.042,.03,.077,.069,.084-.023,.048,.009,.11,.06,.118-.013,.03-.012,.073-.012,.106,.09-.019,.2,.006,.239,.11-.015,.068,.065,.156,.138,.146,.06,.085,.133,.165,.251,.197-.021,.093,.064,.093,.123,.118-.013,.016-.043,.063-.055,.081,.024,.013,.087,.041,.113,.051,.005,.019,.004,.028,.004,.031,.091,.501,2.534,.502,2.616-.001v-.002s.004,.003,.004,.004c0-.003-.001-.011,.004-.031l.118-.042-.062-.09c.056-.028,.145-.025,.123-.119,.119-.032,.193-.112,.253-.198,.073,.01,.153-.078,.138-.146,.039-.104,.15-.129,.239-.11,0-.035,.002-.078-.013-.109,.044-.014,.07-.071,.049-.115,.062-.009,.091-.093,.048-.139,.069-.016,.083-.12,.022-.154Zm-.296-.114c0,.049-.012,.098-.034,.141-.198-.137-.477-.238-.694-.214-.002-.009-.006-.017-.011-.024,0,0,0-.001,0-.002,.064-.021,.074-.12,.015-.153,0,0,0,0,0,0,.048-.032,.045-.113-.005-.141,.328-.039,.728,.09,.728,.393Zm-.956-.275c0,.063-.02,.124-.054,.175-.274-.059-.412-.169-.717-.185-.007-.082-.005-.171-.011-.254,.246-.19,.81-.062,.783,.264Zm-1.191-.164c-.002,.05-.003,.102-.007,.151-.302,.013-.449,.122-.719,.185-.26-.406,.415-.676,.73-.436-.002,.033-.005,.067-.004,.101Zm-1.046,.117c0,.028,.014,.053,.034,.069,0,0,0,0,0,0-.058,.033-.049,.132,.015,.152,0,0,0,.001,0,.002-.005,.007-.008,.015-.011,.024-.219-.024-.495,.067-.698,.206-.155-.377,.323-.576,.698-.525-.023,.015-.039,.041-.039,.072Zm3.065-.115s0,0,0,0c0,0,0,0,0,0,0,0,0,0,0,0Zm-3.113,1.798v.002s-.002,0-.003,.002c0-.001,.002-.003,.003-.003Z" fill="#9b8028"></path>
            <path d="M14.133,16.856c.275-.65,.201-.508-.319-.787v-.873c.149-.099-.094-.121,.05-.235h.072v-.339h-.99v.339h.075c.136,.102-.091,.146,.05,.235v.76c-.524-.007-.771,.066-.679,.576h.039s0,0,0,0l.016,.036c.14-.063,.372-.107,.624-.119v.224c-.384,.029-.42,.608,0,.8v1.291c-.053,.017-.069,.089-.024,.123,.007,.065-.058,.092-.113,.083,0,.026,0,.237,0,.269-.044,.024-.113,.03-.17,.028v.108s0,0,0,0v.107s0,0,0,0v.107s0,0,0,0v.108s0,0,0,0v.186c.459-.068,.895-.068,1.353,0v-.616c-.057,.002-.124-.004-.17-.028,0-.033,0-.241,0-.268-.054,.008-.118-.017-.113-.081,.048-.033,.034-.108-.021-.126v-.932c.038,.017,.073,.035,.105,.053-.105,.119-.092,.326,.031,.429l.057-.053c.222-.329,.396-.743-.193-.896v-.35c.177-.019,.289-.074,.319-.158Z" fill="#9b8028"></path>
            <path d="M8.36,16.058c-.153-.062-.39-.098-.653-.102v-.76c.094-.041,.034-.115-.013-.159,.02-.038,.092-.057,.056-.115h.043v-.261h-.912v.261h.039c-.037,.059,.039,.078,.057,.115-.047,.042-.108,.118-.014,.159v.873c-.644,.133-.611,.748,0,.945v.35c-.59,.154-.415,.567-.193,.896l.057,.053c.123-.103,.136-.31,.031-.429,.032-.018,.067-.036,.105-.053v.932c-.055,.018-.069,.093-.021,.126,.005,.064-.059,.089-.113,.081,0,.026,0,.236,0,.268-.045,.024-.113,.031-.17,.028v.401h0v.215c.459-.068,.895-.068,1.352,0v-.186s0,0,0,0v-.108s0,0,0,0v-.107s0,0,0,0v-.107s0,0,0,0v-.108c-.056,.002-.124-.004-.169-.028,0-.033,0-.241,0-.269-.055,.008-.119-.018-.113-.083,.045-.034,.03-.107-.024-.124v-1.29c.421-.192,.383-.772,0-.8v-.224c.575,.035,.796,.314,.653-.392Z" fill="#9b8028"></path>
            <path d="M12.531,14.533h-4.28l.003,2.572v1.485c0,.432,.226,.822,.591,1.019,.473,.252,1.024,.391,1.552,.391s1.064-.135,1.544-.391c.364-.197,.591-.587,.591-1.019v-4.057Z" fill="#a0251e"></path>
        </svg>`,
    pt: `<svg aria-hidden="true" class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <path d="M5,4H13V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" fill="#2b6519"></path>
            <path d="M16,4h15V28h-15c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" transform="rotate(180 21.5 16)" fill="#ea3323"></path>
            <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
            <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
            <circle cx="12" cy="16" r="5" fill="#ff5"></circle>
            <path d="M14.562,13.529l-5.125-.006v3.431h0c.004,.672,.271,1.307,.753,1.787,.491,.489,1.132,.759,1.805,.759,.684,0,1.328-.267,1.813-.75,.485-.484,.753-1.126,.753-1.808v-3.413Z" fill="#ea3323"></path>
        </svg>`
};

const FALLBACK_TEXT_ALIGN_STATUS = {
    start: 'the start edge',
    center: 'the center',
    end: 'the end edge',
    justify: 'full justification',
    reset: 'the site default alignment'
};
const FALLBACK_TEXT_ALIGN_ANNOUNCEMENTS = {
    set: 'Text alignment set to {{value}}.',
    reset: 'Text alignment restored to the site default.'
};

let activeTranslations = {};

function formatWidgetTemplate(template, params = {}) {
    if (typeof template !== 'string') {
        return '';
    }
    const safeParams = params && typeof params === 'object' ? params : {};
    return template.replace(/\{\{\s*(.+?)\s*\}\}/g, (match, token) => {
        const key = token.trim();
        if (Object.prototype.hasOwnProperty.call(safeParams, key)) {
            return safeParams[key];
        }
        return '';
    });
}

function getLanguageNames() {
    if (!widgetScriptConfig.translateLanguageNames) {
        return NATIVE_LANGUAGE_NAMES;
    }
    if (activeTranslations && activeTranslations.languageNames) {
        return activeTranslations.languageNames;
    }
    return FALLBACK_LANGUAGE_NAMES;
}

function describeTextAlignValue(value) {
    const statusMap = activeTranslations
        && activeTranslations.controls
        && activeTranslations.controls.textAlign
        && activeTranslations.controls.textAlign.status
        ? activeTranslations.controls.textAlign.status
        : {};
    if (value && typeof statusMap[value] === 'string') {
        return statusMap[value];
    }
    if (value && Object.prototype.hasOwnProperty.call(FALLBACK_TEXT_ALIGN_STATUS, value)) {
        return FALLBACK_TEXT_ALIGN_STATUS[value];
    }
    if (typeof statusMap.reset === 'string') {
        return statusMap.reset;
    }
    return FALLBACK_TEXT_ALIGN_STATUS.reset;
}

function buildTextAlignAnnouncement(type, description) {
    const announcementMap = activeTranslations
        && activeTranslations.announcements
        && activeTranslations.announcements.textAlign
        ? activeTranslations.announcements.textAlign
        : {};
    if (type === 'set') {
        const template = announcementMap.set || FALLBACK_TEXT_ALIGN_ANNOUNCEMENTS.set;
        return formatWidgetTemplate(template, { value: description });
    }
    const template = announcementMap.reset || FALLBACK_TEXT_ALIGN_ANNOUNCEMENTS.reset;
    return formatWidgetTemplate(template, { value: description });
}

function sanitiseWidgetColor(value, fallback) {
    if (typeof value !== 'string' || !value.trim()) {
        return fallback;
    }
    const trimmed = value.trim();
    const hexPattern = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
    if (hexPattern.test(trimmed)) {
        return trimmed;
    }
    if (typeof window !== 'undefined' && window.CSS && typeof window.CSS.supports === 'function') {
        if (window.CSS.supports('color', trimmed)) {
            return trimmed;
        }
    }
    return fallback;
}

function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
}

function parseCssColor(value) {
    if (typeof document === 'undefined' || !document.body || typeof value !== 'string' || !value.trim()) {
        return null;
    }
    const probe = document.createElement('span');
    probe.style.color = value;
    probe.style.position = 'absolute';
    probe.style.left = '-9999px';
    probe.style.top = '-9999px';
    probe.style.pointerEvents = 'none';
    document.body.appendChild(probe);
    const computed = window.getComputedStyle(probe).color;
    probe.remove();
    const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/i);
    if (!match) {
        return null;
    }
    return {
        r: Number.parseInt(match[1], 10),
        g: Number.parseInt(match[2], 10),
        b: Number.parseInt(match[3], 10),
        a: match[4] !== undefined ? Number.parseFloat(match[4]) : 1
    };
}

function rgbToHsl(r, g, b) {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    let hue = 0;
    let saturation = 0;
    const lightness = (max + min) / 2;

    if (max !== min) {
        const delta = max - min;
        saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
        switch (max) {
        case red:
            hue = ((green - blue) / delta + (green < blue ? 6 : 0));
            break;
        case green:
            hue = ((blue - red) / delta + 2);
            break;
        default:
            hue = ((red - green) / delta + 4);
            break;
        }
        hue /= 6;
    }

    return { h: hue, s: saturation, l: lightness };
}

function hslToRgb(h, s, l) {
    if (s === 0) {
        const value = Math.round(l * 255);
        return { r: value, g: value, b: value };
    }

    const hueToRgb = (p, q, t) => {
        let temp = t;
        if (temp < 0) {
            temp += 1;
        }
        if (temp > 1) {
            temp -= 1;
        }
        if (temp < 1 / 6) {
            return p + (q - p) * 6 * temp;
        }
        if (temp < 1 / 2) {
            return q;
        }
        if (temp < 2 / 3) {
            return p + (q - p) * (2 / 3 - temp) * 6;
        }
        return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    return {
        r: Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
        g: Math.round(hueToRgb(p, q, h) * 255),
        b: Math.round(hueToRgb(p, q, h - 1 / 3) * 255)
    };
}

function formatColor({ r, g, b, a }) {
    const red = clamp(Math.round(r), 0, 255);
    const green = clamp(Math.round(g), 0, 255);
    const blue = clamp(Math.round(b), 0, 255);
    if (typeof a === 'number' && a >= 0 && a < 1) {
        const alpha = Math.round(a * 1000) / 1000;
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }
    const toHex = (component) => component.toString(16).padStart(2, '0');
    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function adjustColorLightness(color, amount) {
    const parsed = typeof color === 'string' ? parseCssColor(color) : color;
    if (!parsed) {
        return null;
    }
    const { h, s, l } = rgbToHsl(parsed.r, parsed.g, parsed.b);
    const adjustedLightness = clamp(l + amount, 0, 1);
    const rgb = hslToRgb(h, s, adjustedLightness);
    return formatColor({ ...rgb, a: parsed.a });
}

function relativeLuminance({ r, g, b }) {
    const normalised = [r, g, b].map(component => {
        const channel = component / 255;
        return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * normalised[0] + 0.7152 * normalised[1] + 0.0722 * normalised[2];
}

function contrastRatio(luminosityA, luminosityB) {
    const lighter = Math.max(luminosityA, luminosityB);
    const darker = Math.min(luminosityA, luminosityB);
    return (lighter + 0.05) / (darker + 0.05);
}

function deriveHoverColor(baseColor) {
    const parsed = parseCssColor(baseColor);
    if (!parsed) {
        return baseColor;
    }
    const luminosity = relativeLuminance(parsed);
    const adjustment = luminosity > 0.55 ? -0.15 : 0.15;
    const adjusted = adjustColorLightness(parsed, adjustment);
    return adjusted || baseColor;
}

function escapeCssIdentifier(value) {
    if (typeof value === 'undefined' || value === null) {
        return '';
    }
    const stringValue = String(value);
    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
        return CSS.escape(stringValue);
    }
    return stringValue.replace(/[^a-zA-Z0-9_-]/g, (character) => `\\${character}`);
}

function normaliseAriaLabelledbyTargets(root = document) {
    if (!root || typeof root.querySelectorAll !== 'function') {
        return;
    }

    const doc = root.nodeType === 9 ? root : root.ownerDocument || document;
    if (!doc || typeof doc.querySelectorAll !== 'function') {
        return;
    }

    const idUsageCounts = Object.create(null);
    const elementsWithId = doc.querySelectorAll('[id]');
    for (let i = 0; i < elementsWithId.length; i += 1) {
        const existingId = elementsWithId[i].id;
        if (!existingId) {
            continue;
        }
        const trimmedId = existingId.trim();
        if (!trimmedId) {
            continue;
        }
        idUsageCounts[trimmedId] = (idUsageCounts[trimmedId] || 0) + 1;
    }

    let dedupeCounter = 0;
    const getUniqueId = (baseId) => {
        const normalisedBase = baseId && baseId.trim() ? baseId.trim() : 'a11y-label';
        let candidate = '';
        do {
            dedupeCounter += 1;
            candidate = `${normalisedBase}-a11ystiac-${dedupeCounter}`;
        } while (doc.getElementById && doc.getElementById(candidate));
        return candidate;
    };

    // Track synthetic labels so we can reuse them on subsequent passes without mutating host IDs.
    const proxyAttribute = 'data-a11y-stiac-aria-proxy';

    const extractLabelText = (node) => {
        if (!node) {
            return '';
        }
        if (typeof node.getAttribute === 'function') {
            const labelledValue = node.getAttribute('aria-label');
            if (labelledValue && labelledValue.trim()) {
                return labelledValue.trim();
            }
        }
        if (typeof node.textContent === 'string') {
            const textValue = node.textContent.replace(/\s+/g, ' ').trim();
            if (textValue) {
                return textValue;
            }
        }
        return '';
    };

    const ensureProxyLabel = (element, token, textValue) => {
        if (!element || !textValue || typeof doc.createElement !== 'function') {
            return null;
        }

        if (typeof element.querySelectorAll === 'function') {
            const proxies = element.querySelectorAll(`[${proxyAttribute}]`);
            for (let index = 0; index < proxies.length; index += 1) {
                const proxyCandidate = proxies[index];
                if (proxyCandidate && proxyCandidate.getAttribute && proxyCandidate.getAttribute(proxyAttribute) === token && proxyCandidate.id) {
                    return proxyCandidate.id;
                }
            }
        }

        const proxyId = getUniqueId(token || 'a11y-label');
        const proxy = doc.createElement('span');
        proxy.id = proxyId;
        proxy.className = 'a11y-stiac-sr-only';
        proxy.setAttribute(proxyAttribute, token);
        proxy.textContent = textValue;

        if (typeof element.insertBefore === 'function') {
            element.insertBefore(proxy, element.firstChild || null);
        } else if (typeof element.appendChild === 'function') {
            element.appendChild(proxy);
        } else {
            return null;
        }

        return proxyId;
    };

    // When the referenced ID is missing or lives outside the current element, derive
    // a stable label from the visible heading/text content so assistive tech still
    // receives a meaningful accessible name.
    const findFallbackLabelText = (element) => {
        if (!element || typeof element.querySelectorAll !== 'function') {
            return '';
        }

        const textCandidates = element.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, b, em, span, p');
        for (let index = 0; index < textCandidates.length; index += 1) {
            const extracted = extractLabelText(textCandidates[index]);
            if (extracted) {
                return extracted;
            }
        }

        if (typeof element.textContent === 'string') {
            const fallback = element.textContent.replace(/\s+/g, ' ').trim();
            if (fallback) {
                return fallback;
            }
        }

        return '';
    };

    const labelledElements = root.querySelectorAll('[aria-labelledby]');
    for (let elementIndex = 0; elementIndex < labelledElements.length; elementIndex += 1) {
        const element = labelledElements[elementIndex];
        const ariaValue = element.getAttribute('aria-labelledby');
        if (!ariaValue) {
            continue;
        }

        const rawTokens = ariaValue.split(/\s+/);
        const resolvedTokens = [];
        let mutated = false;

        for (let tokenIndex = 0; tokenIndex < rawTokens.length; tokenIndex += 1) {
            const token = rawTokens[tokenIndex] && rawTokens[tokenIndex].trim();
            if (!token) {
                continue;
            }

            const usageCount = idUsageCounts[token] || 0;
            let newToken = token;

            let scopedLabel = null;
            if (typeof element.querySelector === 'function') {
                try {
                    scopedLabel = element.querySelector(`#${escapeCssIdentifier(token)}`);
                } catch (error) {
                    scopedLabel = null;
                }
            }

            if (usageCount > 1 && scopedLabel) {
                const labelText = extractLabelText(scopedLabel);
                if (labelText) {
                    const proxyId = ensureProxyLabel(element, token, labelText);
                    if (proxyId) {
                        newToken = proxyId;
                        mutated = true;
                    }
                }
            } else if (usageCount === 0) {
                const sourceText = scopedLabel ? extractLabelText(scopedLabel) : findFallbackLabelText(element);
                if (sourceText) {
                    const proxyId = ensureProxyLabel(element, token, sourceText);
                    if (proxyId) {
                        newToken = proxyId;
                        mutated = true;
                    }
                }
            }

            const scopedLabelInsideElement = scopedLabel && typeof element.contains === 'function' ? element.contains(scopedLabel) : false;
            if (newToken === token && usageCount > 1 && (!scopedLabel || !scopedLabelInsideElement)) {
                const fallbackText = findFallbackLabelText(element);
                if (fallbackText) {
                    const proxyId = ensureProxyLabel(element, token, fallbackText);
                    if (proxyId) {
                        newToken = proxyId;
                        mutated = true;
                    }
                }
            }

            resolvedTokens.push(newToken);
        }

        if (mutated && resolvedTokens.length) {
            element.setAttribute('aria-labelledby', resolvedTokens.join(' '));
        }
    }
}

function deriveReadableTextColor(backgroundColor, candidates = []) {
    const background = parseCssColor(backgroundColor);
    if (!background) {
        return candidates.find(Boolean) || '#ffffff';
    }
    const backgroundLuminosity = relativeLuminance(background);
    let bestCandidate = null;
    let bestRatio = 0;
    candidates.filter(Boolean).forEach(candidate => {
        const parsedCandidate = parseCssColor(candidate);
        if (!parsedCandidate) {
            return;
        }
        const ratio = contrastRatio(backgroundLuminosity, relativeLuminance(parsedCandidate));
        if (ratio > bestRatio) {
            bestRatio = ratio;
            bestCandidate = candidate;
        }
    });
    if (bestCandidate) {
        return bestCandidate;
    }
    return backgroundLuminosity > 0.55 ? '#0f172a' : '#f8fafc';
}

// Ensure Tailwind CSS is available for the redesigned panel.
function ensureTailwindCSSLoaded() {
    if (!widgetScriptConfig.injectTailwind) {
        return;
    }
    if (typeof document === 'undefined') {
        return;
    }
    if (typeof window !== 'undefined' && (window.tailwind || document.getElementById('stiac-accessibility-tailwind'))) {
        return;
    }

    if (!document.head) {
        return;
    }

    const existingTailwindAsset = document.querySelector('link[href*="tailwind"]')
        || document.querySelector('style[data-tailwind]')
        || document.querySelector('script[src*="tailwindcss.com"]');
    if (existingTailwindAsset) {
        return;
    }

    const tailwindAsset = resolveTailwindAsset();
    if (!tailwindAsset || !tailwindAsset.href) {
        return;
    }

    if (document.documentElement && !document.documentElement.hasAttribute('data-a11y-stiac-tailwind-fallback')) {
        document.documentElement.setAttribute('data-a11y-stiac-tailwind-fallback', 'true');
    }

    if (tailwindAsset.type === 'script') {
        const tailwindScript = document.createElement('script');
        tailwindScript.id = 'stiac-accessibility-tailwind';
        tailwindScript.src = tailwindAsset.href;
        tailwindScript.defer = true;
        tailwindScript.setAttribute('data-owner', 'stiac-accessibility');
        document.head.appendChild(tailwindScript);
        return;
    }

    const tailwindLink = document.createElement('link');
    tailwindLink.id = 'stiac-accessibility-tailwind';
    tailwindLink.rel = 'stylesheet';
    tailwindLink.href = tailwindAsset.href;
    tailwindLink.setAttribute('data-owner', 'stiac-accessibility');
    document.head.appendChild(tailwindLink);
}

// Guard against double execution when the bundle is injected after DOMContentLoaded
// or multiple times across the host page.
let widgetInitialised = false;

function initialiseAccessibilityWidget() {
    if (widgetInitialised) {
        return;
    }
    widgetInitialised = true;

    if (typeof document === 'undefined') {
        return;
    }

    normaliseAriaLabelledbyTargets(document);

    const resolvedColors = {
        active: sanitiseWidgetColor(widgetScriptConfig.colorButtonActive, '#036cff'),
        inactive: sanitiseWidgetColor(widgetScriptConfig.colorButton, '#f8fafc')
    };

    const hoverPreference = sanitiseWidgetColor(widgetScriptConfig.colorButtonHover, null);
    const textPreference = sanitiseWidgetColor(widgetScriptConfig.colorText, null);
    const headerBackgroundPreference = sanitiseWidgetColor(widgetScriptConfig.colorHeaderBackground, null);
    const headerTextPreference = sanitiseWidgetColor(widgetScriptConfig.colorHeaderText, null);
    const controlActiveBackgroundPreference = sanitiseWidgetColor(widgetScriptConfig.colorControlActive, null);
    const controlActiveTextPreference = sanitiseWidgetColor(widgetScriptConfig.colorControlActiveText, null);
    const headerBackgroundColor = headerBackgroundPreference || '#036cff';
    const textColor = textPreference || 'rgba(15, 23, 42, 0.85)';
    const controlActiveBackgroundColor = controlActiveBackgroundPreference || headerBackgroundColor;
    const headerTextColor = headerTextPreference
        || deriveReadableTextColor(headerBackgroundColor, [
            textPreference,
            resolvedColors.inactive,
            '#ffffff',
            '#000000',
            textColor
        ]);
    const controlActiveTextColor = controlActiveTextPreference
        || deriveReadableTextColor(controlActiveBackgroundColor, [
            headerTextPreference,
            headerTextColor,
            resolvedColors.inactive,
            textColor,
            '#ffffff',
            '#000000'
        ]);
    const hoverColor = hoverPreference
        || deriveHoverColor(controlActiveBackgroundColor)
        || controlActiveBackgroundColor;
    const hoverTextColor = deriveReadableTextColor(hoverColor, [
        headerTextPreference,
        headerTextColor,
        resolvedColors.inactive,
        textColor,
        '#ffffff',
        '#000000'
    ]);

    if (document.documentElement && document.documentElement.style) {
        document.documentElement.style.setProperty('--a11y-stiac-color-1', resolvedColors.active);
        document.documentElement.style.setProperty('--a11y-stiac-color-2', resolvedColors.inactive);
        document.documentElement.style.setProperty('--a11y-stiac-hover-color', hoverColor);
        document.documentElement.style.setProperty('--a11y-stiac-hover-text-color', hoverTextColor);
        document.documentElement.style.setProperty('--a11y-stiac-text-color', textColor);
        document.documentElement.style.setProperty('--a11y-stiac-header-bg-color', headerBackgroundColor);
        document.documentElement.style.setProperty('--a11y-stiac-header-text-color', headerTextColor);
        document.documentElement.style.setProperty('--a11y-stiac-control-active-bg-color', controlActiveBackgroundColor);
        document.documentElement.style.setProperty('--a11y-stiac-control-active-text-color', controlActiveTextColor);
    }

    ensureTailwindCSSLoaded();

    const accessibilityMenuStyleElement = document.createElement("style");
    accessibilityMenuStyleElement.innerHTML = accessibilityMenuStyles;
    document.head.appendChild(accessibilityMenuStyleElement);

    const shouldRenderPositionControls = widgetScriptConfig.positionControlsEnabled === true;
    const widgetMarkup = formatWidgetTemplate(accessibilityMenuHTML, {
        changePositionsControls: shouldRenderPositionControls ? changePositionsControlsHTML : ''
    });

    document.body.insertAdjacentHTML("beforeend", widgetMarkup);

    // Promote cursor overlays to the body so they are not clipped by the modal container.
    const injectedCursor = document.getElementById('cursor');
    const injectedTriangleCursor = document.getElementById('triangle-cursor');
    if (injectedCursor) {
        document.body.appendChild(injectedCursor);
    }
    if (injectedTriangleCursor) {
        document.body.appendChild(injectedTriangleCursor);
    }

    //accessibility tool
    const accessibilityModal = document.getElementById('accessibility-modal');
    const closeBtn = document.getElementById('closeBtn');
    const headingTitleElement = accessibilityModal ? accessibilityModal.querySelector('[data-i18n="controls.heading.title"]') : null;
    const headingSubtitleElement = accessibilityModal ? accessibilityModal.querySelector('[data-i18n="controls.heading.subtitle"]') : null;
    const languageSelectElement = document.getElementById('a11y-stiac-language-select');
    const languageAnnouncementElement = document.getElementById('a11y-stiac-language-announcement');
    const languageSelectorContainer = document.getElementById('language-selector');
    const languageTriggerButton = document.getElementById('a11y-stiac-language-trigger');
    const languageDropdownElement = document.getElementById('a11y-stiac-language-dropdown');
    const languageOptionsListElement = languageDropdownElement ? languageDropdownElement.querySelector('[data-language-options]') : null;
    const languageActiveLabelElement = document.querySelector('[data-language-active-label]');
    const languageActiveIconElement = document.querySelector('[data-language-active-icon]');

    // Hide language icons when the Hide Images tool is active unless the embedding script
    // explicitly opts to preserve them via `data-preserve-language-icons`.
    const shouldHideLanguageIcons = () => {
        if (widgetScriptConfig && widgetScriptConfig.preserveLanguageIcons) {
            return false;
        }
        if (typeof document === 'undefined' || !document.documentElement) {
            return false;
        }
        return document.documentElement.classList.contains('hide-images');
    };

    const updateLanguageIconsVisibility = () => {
        const hideIcons = shouldHideLanguageIcons();
        if (languageActiveIconElement) {
            languageActiveIconElement.classList.toggle('hidden', hideIcons);
        }
        if (languageOptionsListElement) {
            languageOptionsListElement.querySelectorAll('[data-language-icon]').forEach((iconElement) => {
                iconElement.classList.toggle('hidden', hideIcons);
            });
        }
    };
    let languageDropdownOpen = false;
    let focusedLanguageIndex = -1;

    const getLanguageOptionElements = () => {
        if (!languageOptionsListElement) {
            return [];
        }
        return Array.from(languageOptionsListElement.querySelectorAll('[data-language-option]'));
    };

    const updateActiveLanguageDisplay = (languageCode, names) => {
        if (!languageActiveLabelElement) {
            return;
        }
        const labelSource = names && typeof names[languageCode] === 'string'
            ? names[languageCode]
            : FALLBACK_LANGUAGE_NAMES[languageCode] || languageCode;
        languageActiveLabelElement.textContent = labelSource;
        if (languageActiveIconElement) {
            const iconMarkup = LANGUAGE_ICONS[languageCode] || LANGUAGE_ICONS.en;
            languageActiveIconElement.innerHTML = iconMarkup;
        }
        updateLanguageIconsVisibility();
    };

    const closeLanguageDropdown = (options = {}) => {
        if (!languageDropdownElement || !languageTriggerButton) {
            return;
        }
        languageDropdownElement.classList.add('hidden');
        languageTriggerButton.setAttribute('aria-expanded', 'false');
        languageDropdownOpen = false;
        focusedLanguageIndex = -1;
        if (options.focusTrigger) {
            languageTriggerButton.focus();
        }
    };

    const openLanguageDropdown = () => {
        if (!languageDropdownElement || !languageTriggerButton) {
            return;
        }
        languageDropdownElement.classList.remove('hidden');
        languageTriggerButton.setAttribute('aria-expanded', 'true');
        languageDropdownOpen = true;
    };

    const focusLanguageOption = (index) => {
        const options = getLanguageOptionElements();
        if (!options.length) {
            return;
        }
        const safeIndex = (index + options.length) % options.length;
        const option = options[safeIndex];
        if (option) {
            option.focus();
            focusedLanguageIndex = safeIndex;
            if (languageOptionsListElement) {
                languageOptionsListElement.setAttribute('aria-activedescendant', option.id);
            }
        }
    };

    const selectLanguageFromDropdown = (languageCode) => {
        if (!languageSelectElement) {
            return;
        }
        languageSelectElement.value = languageCode;
        updateActiveLanguageDisplay(languageCode, getLanguageNames());
        const changeEvent = new Event('change', { bubbles: true });
        languageSelectElement.dispatchEvent(changeEvent);
    };

    const handleLanguageTriggerKeydown = (event) => {
        if (!languageDropdownElement) {
            return;
        }
        if (event.key === 'ArrowDown' || event.key === 'Down') {
            event.preventDefault();
            if (!languageDropdownOpen) {
                openLanguageDropdown();
            }
            const options = getLanguageOptionElements();
            const selectedIndex = options.findIndex((option) => option.getAttribute('aria-selected') === 'true');
            focusLanguageOption(selectedIndex >= 0 ? selectedIndex : 0);
        } else if (event.key === 'ArrowUp' || event.key === 'Up') {
            event.preventDefault();
            if (!languageDropdownOpen) {
                openLanguageDropdown();
            }
            const options = getLanguageOptionElements();
            const selectedIndex = options.findIndex((option) => option.getAttribute('aria-selected') === 'true');
            const targetIndex = selectedIndex >= 0 ? selectedIndex : options.length - 1;
            focusLanguageOption(targetIndex);
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (languageDropdownOpen) {
                closeLanguageDropdown({ focusTrigger: false });
            } else {
                openLanguageDropdown();
                const options = getLanguageOptionElements();
                const selectedIndex = options.findIndex((option) => option.getAttribute('aria-selected') === 'true');
                focusLanguageOption(selectedIndex >= 0 ? selectedIndex : 0);
            }
        } else if (event.key === 'Escape' && languageDropdownOpen) {
            event.preventDefault();
            closeLanguageDropdown({ focusTrigger: true });
        }
    };

    const handleLanguageDropdownKeydown = (event) => {
        if (!languageDropdownOpen) {
            return;
        }
        if (event.key === 'ArrowDown' || event.key === 'Down') {
            event.preventDefault();
            focusLanguageOption(focusedLanguageIndex + 1);
        } else if (event.key === 'ArrowUp' || event.key === 'Up') {
            event.preventDefault();
            focusLanguageOption(focusedLanguageIndex - 1);
        } else if (event.key === 'Home') {
            event.preventDefault();
            focusLanguageOption(0);
        } else if (event.key === 'End') {
            event.preventDefault();
            const options = getLanguageOptionElements();
            focusLanguageOption(options.length - 1);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            closeLanguageDropdown({ focusTrigger: true });
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const options = getLanguageOptionElements();
            const activeOption = options[focusedLanguageIndex];
            if (activeOption) {
                selectLanguageFromDropdown(activeOption.getAttribute('data-language-option'));
                closeLanguageDropdown({ focusTrigger: true });
            }
        }
    };

    const handleDocumentClick = (event) => {
        if (!languageDropdownOpen || !languageSelectorContainer) {
            return;
        }
        if (!languageSelectorContainer.contains(event.target)) {
            closeLanguageDropdown({ focusTrigger: false });
        }
    };

    if (languageTriggerButton) {
        languageTriggerButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (languageDropdownOpen) {
                closeLanguageDropdown({ focusTrigger: false });
            } else {
                openLanguageDropdown();
                const options = getLanguageOptionElements();
                const selectedIndex = options.findIndex((option) => option.getAttribute('aria-selected') === 'true');
                focusLanguageOption(selectedIndex >= 0 ? selectedIndex : 0);
            }
        });
        languageTriggerButton.addEventListener('keydown', handleLanguageTriggerKeydown);
    }

    if (typeof document !== 'undefined' && document.addEventListener) {
        document.addEventListener('click', handleDocumentClick, true);
    }

    const applyWidgetOverrides = () => {
        if (headingTitleElement && widgetScriptConfig.voce1) {
            headingTitleElement.textContent = widgetScriptConfig.voce1;
        }
        if (headingSubtitleElement && widgetScriptConfig.voce2) {
            headingSubtitleElement.textContent = widgetScriptConfig.voce2;
        }
    };

    const renderLanguageOptions = (languageCode) => {
        if (!languageSelectElement) {
            return;
        }
        const names = getLanguageNames();
        const selectFragment = document.createDocumentFragment();
        const dropdownFragment = document.createDocumentFragment();
        const resolvedLanguage = SUPPORTED_LANGUAGES.includes(languageCode)
            ? languageCode
            : (SUPPORTED_LANGUAGES.includes(widgetScriptConfig.defaultLanguage) ? widgetScriptConfig.defaultLanguage : SUPPORTED_LANGUAGES[0]);

        SUPPORTED_LANGUAGES.forEach((code, index) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = names[code] || FALLBACK_LANGUAGE_NAMES[code] || code;
            selectFragment.appendChild(option);

            if (languageOptionsListElement) {
                const listItem = document.createElement('li');
                listItem.setAttribute('role', 'presentation');

                const optionButton = document.createElement('button');
                optionButton.type = 'button';
                optionButton.className = 'a11y-stiac-language-option flex w-full items-center justify-between gap-3 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/40';
                optionButton.setAttribute('role', 'option');
                optionButton.setAttribute('id', `a11y-stiac-language-option-${code}`);
                optionButton.setAttribute('data-language-option', code);
                optionButton.setAttribute('aria-selected', code === resolvedLanguage ? 'true' : 'false');
                optionButton.innerHTML = `
                    <span class="flex flex-1 items-center gap-3">
                        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 ring-1 ring-inset ring-slate-900/10" data-language-icon>${LANGUAGE_ICONS[code] || LANGUAGE_ICONS.en}</span>
                        <span class="flex-1 text-left font-medium ${code === resolvedLanguage ? 'text-slate-900' : 'text-slate-600'}">${names[code] || FALLBACK_LANGUAGE_NAMES[code] || code}</span>
                    </span>
                    <span class="text-slate-400 ${code === resolvedLanguage ? 'opacity-100' : 'opacity-0'}" aria-hidden="true">✓</span>
                `;
                if (code === resolvedLanguage) {
                    optionButton.classList.add('bg-slate-100', 'text-slate-900');
                }
                optionButton.addEventListener('click', () => {
                    selectLanguageFromDropdown(code);
                    closeLanguageDropdown({ focusTrigger: true });
                });
                optionButton.addEventListener('focus', () => {
                    focusedLanguageIndex = index;
                });
                optionButton.addEventListener('keydown', handleLanguageDropdownKeydown);
                listItem.appendChild(optionButton);
                dropdownFragment.appendChild(listItem);
            }
        });

        languageSelectElement.innerHTML = '';
        languageSelectElement.appendChild(selectFragment);
        languageSelectElement.value = resolvedLanguage;

        if (languageOptionsListElement) {
            languageOptionsListElement.innerHTML = '';
            languageOptionsListElement.appendChild(dropdownFragment);
            languageOptionsListElement.setAttribute('aria-activedescendant', `a11y-stiac-language-option-${resolvedLanguage}`);
        }

        updateActiveLanguageDisplay(resolvedLanguage, names);
        updateLanguageIconsVisibility();
    };

    const i18nApi = typeof window !== 'undefined' ? window.AccessibilityI18n : null;

    // Wire the widget to the shared i18n helper so translations load asynchronously, update the
    // `lang` attribute, and announce language switches via the dedicated live region.
    if (i18nApi && typeof i18nApi.init === 'function') {
        i18nApi.init({
            defaultLanguage: widgetScriptConfig.defaultLanguage,
            fallbackLanguage: 'en',
            supportedLanguages: SUPPORTED_LANGUAGES,
            localesPath: widgetScriptConfig.localesPath,
            root: accessibilityModal,
            liveRegion: languageAnnouncementElement,
            onLanguageApplied: (payload) => {
                activeTranslations = payload && payload.translations ? payload.translations : {};
                applyWidgetOverrides();
                renderLanguageOptions(payload && payload.language ? payload.language : widgetScriptConfig.defaultLanguage);
                if (languageSelectElement && payload && payload.language) {
                    languageSelectElement.value = payload.language;
                }
                syncTextAlignUI({ announce: false });
            }
        }).then((state) => {
            if (languageSelectElement) {
                languageSelectElement.removeAttribute('disabled');
                languageSelectElement.addEventListener('change', (event) => {
                    const selectedLanguage = event.target.value;
                    if (SUPPORTED_LANGUAGES.includes(selectedLanguage)) {
                        i18nApi.setLanguage(selectedLanguage, { root: accessibilityModal, announce: true });
                    }
                });
                if (state && state.language && SUPPORTED_LANGUAGES.includes(state.language)) {
                    renderLanguageOptions(state.language);
                    languageSelectElement.value = state.language;
                } else {
                    renderLanguageOptions(widgetScriptConfig.defaultLanguage);
                }
            }
        }).catch((error) => {
            if (typeof console !== 'undefined' && console && typeof console.error === 'function') {
                console.error('[Accessibility Widget] Failed to initialise translations', error);
            }
            renderLanguageOptions(widgetScriptConfig.defaultLanguage);
            applyWidgetOverrides();
            if (languageSelectElement) {
                languageSelectElement.setAttribute('disabled', 'disabled');
            }
        });
    } else {
        if (typeof console !== 'undefined' && console && typeof console.warn === 'function') {
            console.warn('[Accessibility Widget] AccessibilityI18n module is unavailable; default English labels will be used.');
        }
        renderLanguageOptions(widgetScriptConfig.defaultLanguage);
        applyWidgetOverrides();
        if (languageSelectElement) {
            languageSelectElement.setAttribute('disabled', 'disabled');
        }
    }

    if (widgetScriptConfig.mode === 'debug' && typeof console !== 'undefined' && console && typeof console.debug === 'function') {
        console.debug('[Accessibility Widget] configuration', widgetScriptConfig);
    }

    accessibilityModal.classList.add('stiac-sws-protected');
    accessibilityModal.setAttribute('data-stiac-owner', 'Powered by Stiac Web Services');

    const resetAllButton = document.getElementById('reset-all');
    if (resetAllButton) {
        resetAllButton.style.backgroundColor = headerBackgroundColor;
        resetAllButton.style.color = headerTextColor;
    }

    if (closeBtn) {
        closeBtn.style.backgroundColor = headerBackgroundColor;
        closeBtn.style.color = headerTextColor;
    }

    // Trigger the refined reveal transition once the modal has been added to the DOM.
    requestAnimationFrame(() => {
        accessibilityModal.classList.add('is-ready');
    });

    //console.info('Accessibility Widget v1.7.0 - Powered by Stiac Web Services');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            accessibilityModalOpenCloseToggle();
        });
    }

    function applyAccessibilityToolsScrollbarPadding() {
        const toolsContainer = document.getElementById('accessibility-tools');

        if (!toolsContainer || typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
            return;
        }

        const computedStyle = window.getComputedStyle(toolsContainer);

        if (!toolsContainer.dataset.a11yStiacBasePaddingRight) {
            const initialPadding = parseFloat(computedStyle.paddingRight);
            toolsContainer.dataset.a11yStiacBasePaddingRight = Number.isFinite(initialPadding) ? String(initialPadding) : '0';
        }

        const basePaddingRight = parseFloat(toolsContainer.dataset.a11yStiacBasePaddingRight) || 0;
        const scrollbarWidth = Math.max(toolsContainer.offsetWidth - toolsContainer.clientWidth, 0);

        if (scrollbarWidth > 0) {
            // Offset the right padding by the scrollbar width so the card grid remains centred.
            toolsContainer.style.paddingRight = `${basePaddingRight + scrollbarWidth}px`;
            toolsContainer.dataset.a11yStiacScrollbarPaddingApplied = 'true';
        } else if (toolsContainer.dataset.a11yStiacScrollbarPaddingApplied) {
            // Reset any inline padding so Tailwind's base spacing is restored when no scrollbar is present.
            toolsContainer.style.paddingRight = '';
            delete toolsContainer.dataset.a11yStiacScrollbarPaddingApplied;
        }
    }

    function accessibilityModalOpenCloseToggle() {
        const isClosing = accessibilityModal.classList.toggle('close');
        updateCloseButtonIcon();
        if (!isClosing) {
            requestAnimationFrame(() => {
                applyAccessibilityToolsScrollbarPadding();
            });
        }
    }

    applyAccessibilityToolsScrollbarPadding();

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('resize', applyAccessibilityToolsScrollbarPadding);
    }

    function getCloseButtonIconMarkup(isClosed) {
        if (isClosed) {
            return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-universal-access-circle" viewBox="0 0 16 16">\n' +
                '  <path d="M8 4.143A1.071 1.071 0 1 0 8 2a1.071 1.071 0 0 0 0 2.143m-4.668 1.47 3.24.316v2.5l-.323 4.585A.383.383 0 0 0 7 13.14l.826-4.017c.045-.18.301-.18.346 0L9 13.139a.383.383 0 0 0 .752-.125L9.43 8.43v-2.5l3.239-.316a.38.38 0 0 0-.047-.756H3.379a.38.38 0 0 0-.047.756Z"></path>\n' +
                '  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8"></path>\n' +
                '</svg>';
        }

        return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">\n' +
            '  <path d="M2.146 2.146a.5.5 0 0 1 .708 0L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854a.5.5 0 0 1 0-.708"/>\n' +
            '</svg>';
    }

    function updateCloseButtonIcon() {
        if (!closeBtn) {
            return;
        }
        const isClosed = accessibilityModal.classList.contains('close');
        // Show the accessibility glyph while the modal is closed and switch to an "X" when it opens.
        closeBtn.innerHTML = getCloseButtonIconMarkup(isClosed);
    }

    const accItems = document.querySelectorAll('.a11y-stiac-item');

    accItems.forEach(item => {
        const trigger = item.querySelector('.a11y-stiac-child');
        if (!trigger) {
            return;
        }
        trigger.setAttribute('role', 'button');
        if (!trigger.hasAttribute('tabindex')) {
            trigger.setAttribute('tabindex', '0');
        }
        trigger.setAttribute('aria-pressed', 'false');
        trigger.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                trigger.click();
            }
        });
    });

    const docElement = document.documentElement;
    const bodyElement = document.body;
    if (docElement && docElement.dataset && docElement.dataset.a11yStiacDyslexiaFont) {
        ensureOpenDyslexicStylesheet().catch((error) => {
            if (widgetScriptConfig.mode === 'debug' && typeof console !== 'undefined' && console && typeof console.warn === 'function') {
                console.warn('[Accessibility Widget] failed to preload OpenDyslexic font stylesheet', error);
            }
        });
    }
    const systemReduceMotionQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    let pendingSystemReduceMotion = systemReduceMotionQuery ? systemReduceMotionQuery.matches : false;
    let reduceMotionPreferenceLocked = false;
    const defaultRootFontSize = (() => {
        const computed = parseFloat(window.getComputedStyle(docElement).fontSize);
        return Number.isFinite(computed) && computed > 0 ? computed : 16;
    })();
    const defaultBodyFontSize = (() => {
        if (!bodyElement) {
            return defaultRootFontSize;
        }
        const computed = parseFloat(window.getComputedStyle(bodyElement).fontSize);
        return Number.isFinite(computed) && computed > 0 ? computed : defaultRootFontSize;
    })();

    // Capture the modal's baseline font metrics so we can freeze them in CSS variables and
    // prevent the Font Size control from propagating to the widget interface.
    const modalFontMetrics = (() => {
        if (!accessibilityModal) {
            return null;
        }

        const parseSize = (value, fallback) => {
            const parsed = parseFloat(value);
            return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
        };

        const resolveModalSize = () => {
            const computed = window.getComputedStyle(accessibilityModal).fontSize;
            return parseSize(computed, defaultBodyFontSize);
        };

        const baseSize = resolveModalSize();

        const resolveFallback = (fallback) => (typeof fallback === 'function' ? fallback(baseSize) : fallback);

        const sampleSize = (selector, fallback) => {
            const target = accessibilityModal.querySelector(selector);
            const fallbackValue = resolveFallback(fallback);
            if (!target) {
                return fallbackValue;
            }
            const computed = window.getComputedStyle(target).fontSize;
            return parseSize(computed, fallbackValue);
        };

        return {
            base: baseSize,
            textXs: sampleSize('.text-xs', (value) => value * 0.75),
            textSm: sampleSize('.text-sm', (value) => value * 0.875),
            textLg: sampleSize('.text-lg', (value) => value * 1.125),
            // Escape Tailwind's bracketed utilities so querySelector resolves them without errors.
            text10: sampleSize('.text-\\[10px\\]', 10),
            text11: sampleSize('.text-\\[11px\\]', 11)
        };
    })();

    if (modalFontMetrics) {
        const formatPixels = (value) => `${Math.round(value * 1000) / 1000}px`;
        accessibilityModal.style.setProperty('--a11y-stiac-modal-font-size', formatPixels(modalFontMetrics.base));
        accessibilityModal.style.setProperty('--a11y-stiac-modal-text-xs', formatPixels(modalFontMetrics.textXs));
        accessibilityModal.style.setProperty('--a11y-stiac-modal-text-sm', formatPixels(modalFontMetrics.textSm));
        accessibilityModal.style.setProperty('--a11y-stiac-modal-text-lg', formatPixels(modalFontMetrics.textLg));
        accessibilityModal.style.setProperty('--a11y-stiac-modal-text-10', formatPixels(modalFontMetrics.text10));
        accessibilityModal.style.setProperty('--a11y-stiac-modal-text-11', formatPixels(modalFontMetrics.text11));
    }

    // Track host elements whose CSS background images are temporarily disabled by the Hide Images control.
    const hideImageBackgroundElements = new Set();
    let hideImagesObserver = null;

    function elementIsInsideAccessibilityWidget(element) {
        if (!element || !accessibilityModal) {
            return false;
        }
        return element === accessibilityModal || accessibilityModal.contains(element);
    }

    function shouldProcessBackgroundImage(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            return false;
        }
        if (element === docElement || element === bodyElement) {
            return false;
        }
        if (elementIsInsideAccessibilityWidget(element)) {
            return false;
        }
        if (element.closest('[data-a11y-stiac-preserve-images]')) {
            return false;
        }
        return true;
    }

    function gatherBackgroundTargets(root) {
        const targets = [];
        if (shouldProcessBackgroundImage(root)) {
            targets.push(root);
        }
        if (root && typeof root.querySelectorAll === 'function') {
            root.querySelectorAll('*').forEach((element) => {
                if (shouldProcessBackgroundImage(element)) {
                    targets.push(element);
                }
            });
        }
        return targets;
    }

    function applyHideImagesToBackgrounds(root = docElement) {
        const targets = gatherBackgroundTargets(root);
        targets.forEach((element) => {
            if (hideImageBackgroundElements.has(element)) {
                return;
            }

            const computed = window.getComputedStyle(element);
            const backgroundImage = computed ? computed.backgroundImage : '';

            if (!backgroundImage || backgroundImage === 'none' || !backgroundImage.includes('url(')) {
                return;
            }

            const inlineValue = element.style.getPropertyValue('background-image');
            const inlinePriority = element.style.getPropertyPriority('background-image');

            if (inlineValue) {
                element.dataset.a11yStiacBgImageInlineValue = inlineValue;
                element.dataset.a11yStiacBgImageHadInline = 'true';
                if (inlinePriority) {
                    element.dataset.a11yStiacBgImageInlinePriority = inlinePriority;
                } else {
                    delete element.dataset.a11yStiacBgImageInlinePriority;
                }
            } else {
                element.dataset.a11yStiacBgImageHadInline = 'false';
                delete element.dataset.a11yStiacBgImageInlineValue;
                delete element.dataset.a11yStiacBgImageInlinePriority;
            }

            element.style.setProperty('background-image', 'none', 'important');
            hideImageBackgroundElements.add(element);
        });
    }

    function resetHideImagesBackgrounds() {
        hideImageBackgroundElements.forEach((element) => {
            if (element.dataset.a11yStiacBgImageHadInline === 'true') {
                const inlineValue = element.dataset.a11yStiacBgImageInlineValue || '';
                const inlinePriority = element.dataset.a11yStiacBgImageInlinePriority || '';
                element.style.setProperty('background-image', inlineValue, inlinePriority);
            } else {
                element.style.removeProperty('background-image');
            }

            delete element.dataset.a11yStiacBgImageInlineValue;
            delete element.dataset.a11yStiacBgImageInlinePriority;
            delete element.dataset.a11yStiacBgImageHadInline;
        });

        hideImageBackgroundElements.clear();
    }

    function ensureHideImagesObserver() {
        if (hideImagesObserver) {
            return;
        }

        hideImagesObserver = new MutationObserver((mutations) => {
            if (!docElement.classList.contains('hide-images')) {
                return;
            }

            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        applyHideImagesToBackgrounds(node);
                    }
                });
            });
        });

        hideImagesObserver.observe(docElement, { childList: true, subtree: true });
    }

    function disconnectHideImagesObserver() {
        if (!hideImagesObserver) {
            return;
        }

        hideImagesObserver.disconnect();
        hideImagesObserver = null;
    }

    // Toggle the Hide Images state while keeping gradients and other non-image backgrounds intact.
    function setHideImagesActive(active) {
        const shouldActivate = Boolean(active);
        docElement.classList.toggle('hide-images', shouldActivate);

        if (shouldActivate) {
            applyHideImagesToBackgrounds();
            ensureHideImagesObserver();
        } else {
            disconnectHideImagesObserver();
            resetHideImagesBackgrounds();
        }
        updateLanguageIconsVisibility();
    }

    // Track motion-heavy media so Reduce Motion can pause and resume them safely.
    const reduceMotionPausedMedia = new Set();
    const reduceMotionMarquees = new Set();
    let reduceMotionObserver = null;

    function shouldProcessMotionTarget(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            return false;
        }
        if (elementIsInsideAccessibilityWidget(element)) {
            return false;
        }
        if (element.closest && element.closest('[data-a11y-stiac-preserve-motion]')) {
            return false;
        }
        return true;
    }

    function collectMotionTargets(root) {
        if (!root || root.nodeType !== Node.ELEMENT_NODE) {
            return [];
        }

        const selectors = 'video, audio, marquee';
        const candidates = [];

        if (root.matches && root.matches(selectors) && shouldProcessMotionTarget(root)) {
            candidates.push(root);
        }

        if (typeof root.querySelectorAll === 'function') {
            root.querySelectorAll(selectors).forEach((element) => {
                if (shouldProcessMotionTarget(element)) {
                    candidates.push(element);
                }
            });
        }

        return candidates;
    }

    function pauseMotionTargets(root) {
        collectMotionTargets(root).forEach((element) => {
            if (element instanceof HTMLMediaElement) {
                const wasPlaying = !element.paused;
                if (wasPlaying && typeof element.pause === 'function') {
                    element.pause();
                }

                if (element.loop) {
                    element.dataset.a11yStiacReduceMotionWasLooping = 'true';
                    element.loop = false;
                }

                if (element.autoplay) {
                    element.dataset.a11yStiacReduceMotionWasAutoplay = 'true';
                    if (element.hasAttribute('autoplay')) {
                        element.dataset.a11yStiacReduceMotionHadAutoplayAttr = 'true';
                    }
                    element.autoplay = false;
                    element.removeAttribute('autoplay');
                }

                if (wasPlaying) {
                    element.dataset.a11yStiacReduceMotionPaused = 'true';
                }

                reduceMotionPausedMedia.add(element);
            } else if (element.tagName && element.tagName.toLowerCase() === 'marquee') {
                if (!reduceMotionMarquees.has(element)) {
                    element.dataset.a11yStiacReduceMotionScrollAmount = element.getAttribute('scrollamount') || '';
                    element.dataset.a11yStiacReduceMotionBehavior = element.getAttribute('behavior') || '';
                    element.setAttribute('scrollamount', '0');
                    if (typeof element.stop === 'function') {
                        element.stop();
                    }
                    reduceMotionMarquees.add(element);
                }
            }
        });
    }

    function resumeMotionTargets() {
        reduceMotionPausedMedia.forEach((element) => {
            if (!(element instanceof HTMLMediaElement)) {
                return;
            }

            const wasLooping = element.dataset.a11yStiacReduceMotionWasLooping === 'true';
            const wasAutoplay = element.dataset.a11yStiacReduceMotionWasAutoplay === 'true';
            const hadAutoplayAttr = element.dataset.a11yStiacReduceMotionHadAutoplayAttr === 'true';
            const shouldResume = element.dataset.a11yStiacReduceMotionPaused === 'true';

            if (wasLooping) {
                element.loop = true;
            }

            if (wasAutoplay) {
                element.autoplay = true;
            }

            if (hadAutoplayAttr) {
                element.setAttribute('autoplay', '');
            }

            delete element.dataset.a11yStiacReduceMotionWasLooping;
            delete element.dataset.a11yStiacReduceMotionWasAutoplay;
            delete element.dataset.a11yStiacReduceMotionHadAutoplayAttr;
            delete element.dataset.a11yStiacReduceMotionPaused;

            if (shouldResume && typeof element.play === 'function') {
                const playPromise = element.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    // Browsers may block autoplay after user intervention requirements; ignore those rejections silently.
                    playPromise.catch(() => {});
                }
            }
        });
        reduceMotionPausedMedia.clear();

        reduceMotionMarquees.forEach((element) => {
            const storedAmount = element.dataset.a11yStiacReduceMotionScrollAmount || '';
            const storedBehavior = element.dataset.a11yStiacReduceMotionBehavior || '';

            if (storedAmount) {
                element.setAttribute('scrollamount', storedAmount);
            } else {
                element.removeAttribute('scrollamount');
            }

            if (storedBehavior) {
                element.setAttribute('behavior', storedBehavior);
            } else {
                element.removeAttribute('behavior');
            }

            if (typeof element.start === 'function') {
                element.start();
            }

            delete element.dataset.a11yStiacReduceMotionScrollAmount;
            delete element.dataset.a11yStiacReduceMotionBehavior;
        });
        reduceMotionMarquees.clear();
    }

    function ensureReduceMotionObserver() {
        if (reduceMotionObserver) {
            return;
        }

        reduceMotionObserver = new MutationObserver((mutations) => {
            if (!docElement.classList.contains('reduce-motion')) {
                return;
            }

            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        pauseMotionTargets(node);
                    }
                });
            });
        });

        reduceMotionObserver.observe(docElement, { childList: true, subtree: true });
    }

    function disconnectReduceMotionObserver() {
        if (!reduceMotionObserver) {
            return;
        }

        reduceMotionObserver.disconnect();
        reduceMotionObserver = null;
    }

    function setReduceMotionActive(active) {
        const shouldActivate = Boolean(active);
        docElement.classList.toggle('reduce-motion', shouldActivate);

        if (shouldActivate) {
            docElement.setAttribute('data-a11y-stiac-reduce-motion', 'true');
            pauseMotionTargets(docElement);
            ensureReduceMotionObserver();
        } else {
            docElement.removeAttribute('data-a11y-stiac-reduce-motion');
            resumeMotionTargets();
            disconnectReduceMotionObserver();
        }
    }

    if (systemReduceMotionQuery) {
        const handleSystemReduceMotionChange = (event) => {
            pendingSystemReduceMotion = event.matches;
            if (!reduceMotionPreferenceLocked) {
                setReduceMotionActive(event.matches);
                if (typeof syncControls === 'function') {
                    syncControls();
                }
            }
        };

        if (typeof systemReduceMotionQuery.addEventListener === 'function') {
            systemReduceMotionQuery.addEventListener('change', handleSystemReduceMotionChange);
        } else if (typeof systemReduceMotionQuery.addListener === 'function') {
            systemReduceMotionQuery.addListener(handleSystemReduceMotionChange);
        }
    }

    // Maintain a registry of elements whose text should scale so pixel-based typography also grows with the Font Size control.
    const textElementRegistry = new Map();
    let activeFontScale = 1;
    const TEXT_ELEMENT_SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'META', 'TITLE', 'LINK']);

    function shouldSkipFontTarget(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            return true;
        }
        if (element === docElement || element === bodyElement) {
            return true;
        }
        if (accessibilityModal && (element === accessibilityModal || accessibilityModal.contains(element))) {
            return true;
        }
        if (element.closest && element.closest('#accessibility-modal')) {
            return true;
        }
        return TEXT_ELEMENT_SKIP_TAGS.has(element.tagName);
    }

    function elementHasReadableTextContent(element) {
        if (!element || !element.childNodes) {
            return false;
        }
        for (let i = 0; i < element.childNodes.length; i += 1) {
            const child = element.childNodes[i];
            if (child.nodeType === Node.TEXT_NODE && child.textContent && child.textContent.trim().length > 0) {
                return true;
            }
        }
        return false;
    }

    function registerTextElement(element) {
        if (!element || textElementRegistry.has(element)) {
            return;
        }
        const computedSize = parseFloat(window.getComputedStyle(element).fontSize);
        if (!Number.isFinite(computedSize) || computedSize <= 0) {
            return;
        }
        const inlineValue = element.style.fontSize || '';
        const inlinePriority = element.style.getPropertyPriority('font-size') || '';
        const baseline = activeFontScale && activeFontScale > 0 ? computedSize / activeFontScale : computedSize;
        textElementRegistry.set(element, {
            originalSize: baseline,
            inlineValue,
            inlinePriority
        });
    }

    function scanForTextElements(rootNode) {
        if (!rootNode) {
            return;
        }

        const nodesToProcess = [];
        if (rootNode.nodeType === Node.ELEMENT_NODE && !shouldSkipFontTarget(rootNode) && elementHasReadableTextContent(rootNode)) {
            nodesToProcess.push(rootNode);
        }

        if (rootNode.nodeType === Node.ELEMENT_NODE) {
            const walker = document.createTreeWalker(
                rootNode,
                NodeFilter.SHOW_ELEMENT,
                {
                    acceptNode(node) {
                        if (accessibilityModal && (node === accessibilityModal || accessibilityModal.contains(node))) {
                            // Reject the node and its descendants when it belongs to the accessibility modal
                            // so the widget's own interface never receives inline font overrides.
                            return NodeFilter.FILTER_REJECT;
                        }
                        if (shouldSkipFontTarget(node)) {
                            return NodeFilter.FILTER_SKIP;
                        }
                        return elementHasReadableTextContent(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                    }
                },
                false
            );

            let current = walker.nextNode();
            while (current) {
                nodesToProcess.push(current);
                current = walker.nextNode();
            }
        }

        nodesToProcess.forEach(registerTextElement);
    }

    function unregisterTextElements(rootNode) {
        if (!rootNode || rootNode.nodeType !== Node.ELEMENT_NODE) {
            return;
        }
        const elementsToRemove = [];
        textElementRegistry.forEach((_, element) => {
            if (element === rootNode || (rootNode.contains && rootNode.contains(element))) {
                elementsToRemove.push(element);
            }
        });
        elementsToRemove.forEach((element) => {
            textElementRegistry.delete(element);
        });
    }

    function applyFontScaleToRegisteredElements(fontScale) {
        textElementRegistry.forEach((meta, element) => {
            const shouldRemove = !element || !element.isConnected || shouldSkipFontTarget(element);

            if (shouldRemove) {
                if (element && meta) {
                    element.style.removeProperty('font-size');
                    if (meta.inlineValue) {
                        element.style.setProperty('font-size', meta.inlineValue, meta.inlinePriority || '');
                    }
                }
                textElementRegistry.delete(element);
                return;
            }

            if (fontScale && fontScale > 0) {
                const targetSize = meta.originalSize * fontScale;
                element.style.setProperty('font-size', `${targetSize}px`, 'important');
            } else {
                element.style.removeProperty('font-size');
                if (meta.inlineValue) {
                    element.style.setProperty('font-size', meta.inlineValue, meta.inlinePriority || '');
                }
            }
        });
    }

    const observerRoot = bodyElement || docElement;
    if (observerRoot) {
        scanForTextElements(observerRoot);
        if (typeof MutationObserver === 'function') {
            const dynamicContentObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            scanForTextElements(node);
                        } else if (node.nodeType === Node.TEXT_NODE && node.parentElement && !shouldSkipFontTarget(node.parentElement)) {
                            registerTextElement(node.parentElement);
                        }
                    });
                    mutation.removedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            unregisterTextElements(node);
                        } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
                            unregisterTextElements(node.parentElement);
                        }
                    });
                });
            });
            dynamicContentObserver.observe(observerRoot, { childList: true, subtree: true });
        }
    }
    const filterState = {
        invert: false,
        grayscale: false,
        saturation: 'default',
        contrast: 'default'
    };

    const textAlignControl = document.querySelector('#text-align');
    const textAlignIconElement = textAlignControl ? textAlignControl.querySelector('[data-text-align-icon]') : null;
    const textAlignDefaultIcon = textAlignIconElement ? textAlignIconElement.innerHTML : '';
    const textAlignStatusElement = textAlignControl ? textAlignControl.querySelector('[data-text-align-status]') : null;
    const TEXT_ALIGN_SEQUENCE = ['start', 'center', 'end', 'justify'];
    const textAlignIcons = {
        start: `<path d="M4.5 7C4.22386 7 4 6.77614 4 6.5C4 6.22386 4.22386 6 4.5 6H19.5C19.7761 6 20 6.22386 20 6.5C20 6.77614 19.7761 7 19.5 7H4.5ZM4.5 15C4.22386 15 4 14.7761 4 14.5C4 14.2239 4.22386 14 4.5 14H19.5C19.7761 14 20 14.2239 20 14.5C20 14.7761 19.7761 15 19.5 15H4.5ZM4.5 11C4.22386 11 4 10.7761 4 10.5C4 10.2239 4.22386 10 4.5 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H4.5ZM4.5 19C4.22386 19 4 18.7761 4 18.5C4 18.2239 4.22386 18 4.5 18H13.5C13.7761 18 14 18.2239 14 18.5C14 18.7761 13.7761 19 13.5 19H4.5Z" fill="currentColor"/>`,
        center: `<path d="M4.5 7C4.22386 7 4 6.77614 4 6.5C4 6.22386 4.22386 6 4.5 6H19.5C19.7761 6 20 6.22386 20 6.5C20 6.77614 19.7761 7 19.5 7H4.5ZM4.5 15C4.22386 15 4 14.7761 4 14.5C4 14.2239 4.22386 14 4.5 14H19.5C19.7761 14 20 14.2239 20 14.5C20 14.7761 19.7761 15 19.5 15H4.5ZM7.5 11C7.22386 11 7 10.7761 7 10.5C7 10.2239 7.22386 10 7.5 10H16.5C16.7761 10 17 10.2239 17 10.5C17 10.7761 16.7761 11 16.5 11H7.5ZM7.5 19C7.22386 19 7 18.7761 7 18.5C7 18.2239 7.22386 18 7.5 18H16.5C16.7761 18 17 18.2239 17 18.5C17 18.7761 16.7761 19 16.5 19H7.5Z" fill="currentColor"/>`,
        end: `<path d="M4.5 7C4.22386 7 4 6.77614 4 6.5C4 6.22386 4.22386 6 4.5 6H19.5C19.7761 6 20 6.22386 20 6.5C20 6.77614 19.7761 7 19.5 7H4.5ZM4.5 15C4.22386 15 4 14.7761 4 14.5C4 14.2239 4.22386 14 4.5 14H19.5C19.7761 14 20 14.2239 20 14.5C20 14.7761 19.7761 15 19.5 15H4.5ZM10.5 11C10.2239 11 10 10.7761 10 10.5C10 10.2239 10.2239 10 10.5 10H19.5C19.7761 10 20 10.2239 20 10.5C20 10.7761 19.7761 11 19.5 11H10.5ZM10.5 19C10.2239 19 10 18.7761 10 18.5C10 18.2239 10.2239 18 10.5 18H19.5C19.7761 18 20 18.2239 20 18.5C20 18.7761 19.7761 19 19.5 19H10.5Z" fill="currentColor"/>`,
        justify: `<path d="M4.5 6H19.5C19.7761 6 20 5.77614 20 5.5C20 5.22386 19.7761 5 19.5 5H4.5C4.22386 5 4 5.22386 4 5.5C4 5.77614 4.22386 6 4.5 6ZM4.5 10H19.5C19.7761 10 20 9.77614 20 9.5C20 9.22386 19.7761 9 19.5 9H4.5C4.22386 9 4 9.22386 4 9.5C4 9.77614 4.22386 10 4.5 10ZM4.5 14H19.5C19.7761 14 20 13.7761 20 13.5C20 13.2239 19.7761 13 19.5 13H4.5C4.22386 13 4 13.2239 4 13.5C4 13.7761 4.22386 14 4.5 14ZM4.5 18H19.5C19.7761 18 20 17.7761 20 17.5C20 17.2239 19.7761 17 19.5 17H4.5C4.22386 17 4 17.2239 4 17.5C4 17.7761 4.22386 18 4.5 18Z" fill="currentColor"/>`
    };

    const initialDocumentAlignment = {
        html: docElement.style.textAlign || '',
        body: bodyElement ? bodyElement.style.textAlign || '' : ''
    };

    const normaliseTextAlignValue = (value) => {
        if (!value && value !== 0) {
            return '';
        }
        const normalised = String(value).trim().toLowerCase();
        if (!normalised) {
            return '';
        }
        if (normalised === 'left' || normalised === 'start') {
            return 'start';
        }
        if (normalised === 'right' || normalised === 'end') {
            return 'end';
        }
        if (normalised === 'center' || normalised === 'centre') {
            return 'center';
        }
        if (normalised === 'justify') {
            return 'justify';
        }
        return '';
    };

    const getDocumentTextAlign = () => {
        if (docElement.dataset && docElement.dataset.a11yStiacTextAlignValue) {
            const datasetValue = normaliseTextAlignValue(docElement.dataset.a11yStiacTextAlignValue);
            if (datasetValue) {
                return datasetValue;
            }
        }
        const attributeValue = normaliseTextAlignValue(docElement.getAttribute('data-a11y-stiac-text-align'));
        if (attributeValue) {
            return attributeValue;
        }
        const bodyValue = bodyElement ? normaliseTextAlignValue(bodyElement.style.textAlign) : '';
        if (bodyValue) {
            return bodyValue;
        }
        return normaliseTextAlignValue(docElement.style.textAlign);
    };

    const setDocumentTextAlign = (value) => {
        const safeValue = normaliseTextAlignValue(value);
        if (safeValue) {
            docElement.setAttribute('data-a11y-stiac-text-align', safeValue);
            docElement.dataset.a11yStiacTextAlignValue = safeValue;
        } else {
            docElement.removeAttribute('data-a11y-stiac-text-align');
            if (docElement.dataset) {
                delete docElement.dataset.a11yStiacTextAlignValue;
            }
        }
        if (bodyElement) {
            bodyElement.style.textAlign = initialDocumentAlignment.body;
        }
        docElement.style.textAlign = initialDocumentAlignment.html;
    };


    function syncTextAlignUI(options = {}) {
        const { announce = false } = options;
        if (!textAlignControl) {
            return;
        }
        const currentValue = getDocumentTextAlign();
        const progressIndex = currentValue ? TEXT_ALIGN_SEQUENCE.indexOf(currentValue) : -1;

        if (textAlignIconElement) {
            const iconMarkup = currentValue ? textAlignIcons[currentValue] : textAlignDefaultIcon;
            if (iconMarkup) {
                textAlignIconElement.innerHTML = iconMarkup;
            }
        }

        textAlignControl.classList.toggle('active', Boolean(currentValue));
        updateProgress(textAlignControl, typeof progressIndex === 'number' ? progressIndex : -1);

        if (textAlignStatusElement) {
            if (announce) {
                if (currentValue) {
                    const description = describeTextAlignValue(currentValue);
                    textAlignStatusElement.textContent = buildTextAlignAnnouncement('set', description);
                } else {
                    const description = describeTextAlignValue('');
                    textAlignStatusElement.textContent = buildTextAlignAnnouncement('reset', description);
                }
            } else {
                textAlignStatusElement.textContent = '';
            }
        }
    }

    const STORAGE_KEY = 'a11y-stiac-settings';

    function applyFilterState() {
        const filters = [];
        if (filterState.invert) {
            filters.push('invert(1)');
        }
        if (filterState.grayscale) {
            filters.push('grayscale(1)');
        }
        if (filterState.saturation === 'low') {
            filters.push('saturate(20%)');
        } else if (filterState.saturation === 'high') {
            filters.push('saturate(200%)');
        }
        if (filterState.contrast === 'low') {
            filters.push('contrast(0.5)');
        } else if (filterState.contrast === 'high') {
            filters.push('contrast(1.5)');
        } else if (filterState.contrast === 'extra') {
            filters.push('contrast(2)');
        }
        docElement.style.filter = filters.join(' ');
    }

    function setControlActiveState(element, isActive) {
        if (!element) {
            return;
        }
        element.classList.toggle('active', isActive);
        element.setAttribute('aria-pressed', String(Boolean(isActive)));
        const targetColor = isActive ? 'var(--a11y-stiac-header-text-color)' : 'var(--a11y-stiac-text-color)';
        element.style.color = targetColor;
        element.querySelectorAll('svg').forEach(icon => {
            icon.style.color = targetColor;
            icon.style.fill = 'currentColor';
        });
    }

    function updateProgress(element, activeIndex) {
        if (!element) {
            return;
        }
        const progressParent = element.querySelector('.a11y-stiac-progress-parent');
        if (!progressParent) {
            return;
        }
        if (activeIndex < 0) {
            progressParent.classList.add('hidden');
        } else {
            progressParent.classList.remove('hidden');
        }
        progressParent.querySelectorAll('.a11y-stiac-progress-child').forEach((child, index) => {
            child.classList.toggle('active', index === activeIndex);
        });
    }


    const alignAccTopLeft = document.getElementById('align-a11y-stiac-top-left');
    const alignAccTop = document.getElementById('align-a11y-stiac-top');
    const alignAccBottom = document.getElementById('align-a11y-stiac-bottom');
    const alignAccBottomLeft = document.getElementById('align-a11y-stiac-bottom-left');
    const alignAccBottomRight = document.getElementById('align-a11y-stiac-bottom-right');
    const alignAccTopRight = document.getElementById('align-a11y-stiac-top-right');

    const positionClasses = [...VALID_MODAL_POSITIONS];
    const positionControls = [
        { element: alignAccTopLeft, className: 'left' },
        { element: alignAccTop, className: 'top' },
        { element: alignAccBottom, className: 'bottom' },
        { element: alignAccBottomLeft, className: 'bottom-left' },
        { element: alignAccBottomRight, className: 'bottom-right' },
        { element: alignAccTopRight, className: 'right' }
    ];

    if (!accessibilityModal.classList.contains(DEFAULT_MODAL_POSITION)) {
        positionClasses.forEach(existingClass => {
            accessibilityModal.classList.remove(existingClass);
        });
        accessibilityModal.classList.add(DEFAULT_MODAL_POSITION);
    }

    function getCurrentPosition() {
        const activeClass = positionClasses.find(positionClass => accessibilityModal.classList.contains(positionClass));
        return activeClass || DEFAULT_MODAL_POSITION;
    }

    function updatePositionControls() {
        const currentPosition = getCurrentPosition();
        positionControls.forEach(control => {
            if (!control.element) {
                return;
            }
            const isActive = control.className === currentPosition;
            control.element.classList.toggle('active', isActive);
            // Keep pressed state in sync so assistive technologies announce the active placement.
            control.element.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    function setModalPosition(positionClass) {
        const safePosition = normalisePositionClass(positionClass, getCurrentPosition());
        accessibilityModalOpenCloseToggle();
        positionClasses.forEach(existingClass => {
            accessibilityModal.classList.remove(existingClass);
        });
        accessibilityModal.classList.add(safePosition);
        updatePositionControls();
        updateCloseButtonIcon();
        saveSettings();
    }

    updatePositionControls();
    updateCloseButtonIcon();

    positionControls.forEach(control => {
        if (!control.element) {
            return;
        }
        control.element.addEventListener('click', () => {
            setModalPosition(control.className);
        });
    });

    document.querySelector('#invert-colors').addEventListener('click', () => {
        const item = document.querySelector('#invert-colors');
        filterState.invert = !filterState.invert;
        applyFilterState();
        setControlActiveState(item, filterState.invert);
        saveSettings();
    });

    document.querySelector('#grayscale').addEventListener('click', () => {
        const item = document.querySelector('#grayscale');
        filterState.grayscale = !filterState.grayscale;
        applyFilterState();
        setControlActiveState(item, filterState.grayscale);
        saveSettings();
    });

    let saturationClickCount = 0;
    document.querySelector('#saturation').addEventListener('click', () => {
        const item = document.querySelector('#saturation');
        const label = item.querySelector('p');
        let progressIndex = -1;

        if (saturationClickCount === 0) {
            filterState.saturation = 'low';
            saturationClickCount = 1;
            progressIndex = 0;
            if (label) {
                label.innerText = 'Low Saturation';
            }
        } else if (saturationClickCount === 1) {
            filterState.saturation = 'high';
            saturationClickCount = 2;
            progressIndex = 1;
            if (label) {
                label.innerText = 'High Saturation';
            }
        } else {
            filterState.saturation = 'default';
            saturationClickCount = 0;
            progressIndex = -1;
            if (label) {
                label.innerText = 'Saturation';
            }
        }

        updateProgress(item, progressIndex);
        setControlActiveState(item, filterState.saturation !== 'default');
        applyFilterState();
        saveSettings();
    });

    let underlineClickCount = 0;
    document.querySelector('#underline').addEventListener('click', () => {
        const item = document.querySelector('#underline');
        let progressIndex = -1;

        if (underlineClickCount === 0) {
            docElement.classList.add('underline-style-0');
            docElement.classList.remove('underline-style-1', 'underline-style-2');
            underlineClickCount = 1;
            progressIndex = 0;
        } else if (underlineClickCount === 1) {
            docElement.classList.remove('underline-style-0');
            docElement.classList.add('underline-style-1');
            docElement.classList.remove('underline-style-2');
            underlineClickCount = 2;
            progressIndex = 1;
        } else if (underlineClickCount === 2) {
            docElement.classList.remove('underline-style-0', 'underline-style-1');
            docElement.classList.add('underline-style-2');
            underlineClickCount = 3;
            progressIndex = 2;
        } else {
            docElement.classList.remove('underline-style-0', 'underline-style-1', 'underline-style-2');
            underlineClickCount = 0;
            progressIndex = -1;
        }

        updateProgress(item, progressIndex);
        setControlActiveState(item, underlineClickCount !== 0);
        saveSettings();
    });

    function resolveFontScale(value) {
        if (!value) {
            return null;
        }
        const normalizedValue = value.trim().toLowerCase();
        if (!normalizedValue) {
            return null;
        }
        let fontScale = null;
        if (normalizedValue.endsWith('%')) {
            const parsedPercent = parseFloat(normalizedValue);
            fontScale = Number.isFinite(parsedPercent) && parsedPercent > 0 ? parsedPercent / 100 : null;
        } else if (normalizedValue.endsWith('rem') || normalizedValue.endsWith('em')) {
            const parsedRelative = parseFloat(normalizedValue);
            fontScale = Number.isFinite(parsedRelative) && parsedRelative > 0 ? parsedRelative : null;
        } else if (normalizedValue.endsWith('px')) {
            const parsedPixels = parseFloat(normalizedValue);
            fontScale = Number.isFinite(parsedPixels) && parsedPixels > 0 ? parsedPixels / defaultRootFontSize : null;
        } else {
            const parsedPlain = parseFloat(normalizedValue);
            if (Number.isFinite(parsedPlain) && parsedPlain > 0) {
                fontScale = parsedPlain > 10 ? parsedPlain / 100 : parsedPlain;
            }
        }
        return fontScale && fontScale > 0 ? fontScale : null;
    }

    // Apply font scaling to both the root element and body so rem- and px-based layouts respond consistently.
    function applyGlobalFontSize(value) {
        const fontSizeValue = value || '';
        if (fontSizeValue) {
            const fontScale = resolveFontScale(fontSizeValue) || 1;
            if (observerRoot) {
                scanForTextElements(observerRoot);
            }
            activeFontScale = fontScale;
            docElement.dataset.a11yStiacFontSizeValue = fontSizeValue;
            docElement.dataset.a11yStiacFontScale = String(fontScale);
            applyFontScaleToRegisteredElements(fontScale);
        } else {
            applyFontScaleToRegisteredElements(null);
            activeFontScale = 1;
            delete docElement.dataset.a11yStiacFontSizeValue;
            delete docElement.dataset.a11yStiacFontScale;
        }
    }

    let fontSizeClickCount = 0;
    document.querySelector('#font-size').addEventListener('click', () => {
        const item = document.querySelector('#font-size');
        let progressIndex = -1;

        if (fontSizeClickCount === 0) {
            applyGlobalFontSize('130%');
            fontSizeClickCount = 1;
            progressIndex = 0;
        } else if (fontSizeClickCount === 1) {
            applyGlobalFontSize('150%');
            fontSizeClickCount = 2;
            progressIndex = 1;
        } else if (fontSizeClickCount === 2) {
            applyGlobalFontSize('180%');
            fontSizeClickCount = 3;
            progressIndex = 2;
        } else {
            applyGlobalFontSize('');
            fontSizeClickCount = 0;
            progressIndex = -1;
        }

        updateProgress(item, progressIndex);
        setControlActiveState(item, fontSizeClickCount !== 0);
        saveSettings();
    });

    let lineHeightClickCount = 0;
    document.querySelector('#line-height').addEventListener('click', () => {
        const item = document.querySelector('#line-height');
        let progressIndex = -1;

        if (lineHeightClickCount === 0) {
            docElement.classList.add('line-height-0');
            docElement.classList.remove('line-height-1', 'line-height-2');
            lineHeightClickCount = 1;
            progressIndex = 0;
        } else if (lineHeightClickCount === 1) {
            docElement.classList.remove('line-height-0');
            docElement.classList.add('line-height-1');
            docElement.classList.remove('line-height-2');
            lineHeightClickCount = 2;
            progressIndex = 1;
        } else if (lineHeightClickCount === 2) {
            docElement.classList.remove('line-height-0', 'line-height-1');
            docElement.classList.add('line-height-2');
            lineHeightClickCount = 3;
            progressIndex = 2;
        } else {
            docElement.classList.remove('line-height-0', 'line-height-1', 'line-height-2');
            lineHeightClickCount = 0;
            progressIndex = -1;
        }

        updateProgress(item, progressIndex);
        setControlActiveState(item, lineHeightClickCount !== 0);
        saveSettings();
    });

    let letterSpacingClickCount = 0;
    document.querySelector('#letter-spacing').addEventListener('click', () => {
        const item = document.querySelector('#letter-spacing');
        let progressIndex = -1;

        if (letterSpacingClickCount === 0) {
            docElement.style.letterSpacing = '0.1rem';
            letterSpacingClickCount = 1;
            progressIndex = 0;
        } else if (letterSpacingClickCount === 1) {
            docElement.style.letterSpacing = '0.2rem';
            letterSpacingClickCount = 2;
            progressIndex = 1;
        } else if (letterSpacingClickCount === 2) {
            docElement.style.letterSpacing = '0.3rem';
            letterSpacingClickCount = 3;
            progressIndex = 2;
        } else {
            docElement.style.letterSpacing = '';
            letterSpacingClickCount = 0;
            progressIndex = -1;
        }

        updateProgress(item, progressIndex);
        setControlActiveState(item, letterSpacingClickCount !== 0);
        saveSettings();
    });

    const dyslexiaFontControl = document.querySelector('#font-dyslexia');
    if (dyslexiaFontControl) {
        dyslexiaFontControl.addEventListener('click', () => {
            const nextState = !docElement.dataset.a11yStiacDyslexiaFont;
            if (nextState) {
                ensureOpenDyslexicStylesheet().catch((error) => {
                    if (widgetScriptConfig.mode === 'debug' && typeof console !== 'undefined' && console && typeof console.warn === 'function') {
                        console.warn('[Accessibility Widget] failed to load OpenDyslexic stylesheet', error);
                    }
                });
                docElement.dataset.a11yStiacDyslexiaFont = 'true';
            } else {
                delete docElement.dataset.a11yStiacDyslexiaFont;
            }
            setControlActiveState(dyslexiaFontControl, nextState);
            saveSettings();
        });
    }

    if (textAlignControl) {
        // Cycle the document text alignment each time the card is activated.
        textAlignControl.addEventListener('click', () => {
            const currentValue = getDocumentTextAlign();
            if (!currentValue) {
                setDocumentTextAlign(TEXT_ALIGN_SEQUENCE[0]);
            } else {
                const currentIndex = TEXT_ALIGN_SEQUENCE.indexOf(currentValue);
                const isKnownValue = currentIndex >= 0;
                if (!isKnownValue || currentIndex === TEXT_ALIGN_SEQUENCE.length - 1) {
                    setDocumentTextAlign('');
                } else {
                    setDocumentTextAlign(TEXT_ALIGN_SEQUENCE[currentIndex + 1]);
                }
            }

            syncTextAlignUI({ announce: true });
            saveSettings();
        });
    }

    let contrastClickCount = 0;
    document.querySelector('#contrast').addEventListener('click', () => {
        const item = document.querySelector('#contrast');
        let progressIndex = -1;

        if (contrastClickCount === 0) {
            filterState.contrast = 'low';
            contrastClickCount = 1;
            progressIndex = 0;
        } else if (contrastClickCount === 1) {
            filterState.contrast = 'high';
            contrastClickCount = 2;
            progressIndex = 1;
        } else if (contrastClickCount === 2) {
            filterState.contrast = 'extra';
            contrastClickCount = 3;
            progressIndex = 2;
        } else {
            filterState.contrast = 'default';
            contrastClickCount = 0;
            progressIndex = -1;
        }

        updateProgress(item, progressIndex);
        setControlActiveState(item, contrastClickCount !== 0);
        applyFilterState();
        saveSettings();
    });

    document.querySelector('#hide-images').addEventListener('click', () => {
        const item = document.querySelector('#hide-images');
        const nextState = !docElement.classList.contains('hide-images');
        setHideImagesActive(nextState);
        setControlActiveState(item, nextState);
        saveSettings();
    });

    document.querySelector('#hide-video').addEventListener('click', () => {
        const item = document.querySelector('#hide-video');
        const nextState = !docElement.classList.contains('hide-video');
        docElement.classList.toggle('hide-video');
        setControlActiveState(item, nextState);
        saveSettings();
    });

    document.querySelector('#reduce-motion').addEventListener('click', () => {
        const item = document.querySelector('#reduce-motion');
        const nextState = !docElement.classList.contains('reduce-motion');
        reduceMotionPreferenceLocked = true;
        setReduceMotionActive(nextState);
        setControlActiveState(item, nextState);
        saveSettings();
    });

    let cursorClickCount = 0;
    // Rotate between the three custom cursor styles and ensure the browser cursor/guide triangle reset appropriately.
    document.querySelector('#change-cursor').addEventListener('click', () => {
        const item = document.querySelector('#change-cursor');
        const cursor = document.querySelector('#cursor');
        const triangle = document.getElementById('triangle-cursor');
        let progressIndex = -1;

        if (triangle) {
            triangle.style.display = 'none';
        }

        if (cursorClickCount === 0) {
            cursor.classList.add('cursor-0');
            cursor.classList.remove('cursor-1', 'cursor-2');
            cursor.style.width = '50px';
            cursor.style.height = '50px';
            docElement.style.cursor = '';
            cursorClickCount = 1;
            progressIndex = 0;
        } else if (cursorClickCount === 1) {
            cursor.classList.remove('cursor-0');
            cursor.classList.add('cursor-1');
            cursor.classList.remove('cursor-2');
            cursor.style.width = '100%';
            cursor.style.height = '15vh';
            docElement.style.cursor = '';
            cursorClickCount = 2;
            progressIndex = 1;
        } else if (cursorClickCount === 2) {
            cursor.classList.remove('cursor-0', 'cursor-1');
            cursor.classList.add('cursor-2');
            docElement.style.cursor = 'none';
            cursor.style.width = '25vw';
            cursor.style.height = '8px';
            if (triangle) {
                triangle.style.display = 'block';
            }
            cursorClickCount = 3;
            progressIndex = 2;
        } else {
            cursor.classList.remove('cursor-0', 'cursor-1', 'cursor-2');
            docElement.style.cursor = '';
            cursor.style.width = '';
            cursor.style.height = '';
            cursorClickCount = 0;
            progressIndex = -1;
        }

        updateProgress(item, progressIndex);
        setControlActiveState(item, cursorClickCount !== 0);
        saveSettings();
    });

    //cursor
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', e => {
        if (cursor.classList.contains('cursor-0')) {
            cursor.style.top = e.clientY + 'px';
            cursor.style.left = e.clientX + 'px';
        } else if (cursor.classList.contains('cursor-1')) {
            cursor.style.top = e.clientY + 'px';
            cursor.style.left = 0;
        } else if (cursor.classList.contains('cursor-2')) {
            cursor.style.top = e.clientY + 'px';
            if (e.clientX < window.innerWidth / 8) {
                cursor.style.left = window.innerWidth / 8 + 'px';
            } else if (e.clientX > window.innerWidth - window.innerWidth / 8) {
                cursor.style.left = window.innerWidth - window.innerWidth / 8 + 'px';
            } else {
                cursor.style.left = e.clientX + 'px';
            }
            const triangle = document.getElementById('triangle-cursor');
            triangle.style.top = e.clientY + 'px';
            triangle.style.left = e.clientX + 'px';
        }
    });

    document.querySelectorAll('a,button').forEach(a => {
        a.addEventListener('mouseover', () => {
            if (cursor.classList.contains('cursor-0')) {
                cursor.style.width = '100px';
                cursor.style.height = '100px';
            }
        });
        a.addEventListener('mouseleave', () => {
            if (cursor.classList.contains('cursor-0')) {
                cursor.style.width = '50px';
                cursor.style.height = '50px';
            }
        });
    });

    document.querySelector('#reset-all').addEventListener('click', () => {
        const cursorElement = document.getElementById('cursor');
        const triangle = document.getElementById('triangle-cursor');

        filterState.invert = false;
        filterState.grayscale = false;
        filterState.saturation = 'default';
        filterState.contrast = 'default';
        applyFilterState();

        docElement.classList.remove('underline-style-0', 'underline-style-1', 'underline-style-2');
        applyGlobalFontSize('');
        docElement.classList.remove('line-height-0', 'line-height-1', 'line-height-2');
        docElement.style.letterSpacing = '';
        setDocumentTextAlign('');
        syncTextAlignUI();
        delete docElement.dataset.a11yStiacDyslexiaFont;
        setHideImagesActive(false);
        docElement.classList.remove('hide-video');
        setReduceMotionActive(false);
        reduceMotionPreferenceLocked = false;
        if (pendingSystemReduceMotion) {
            setReduceMotionActive(true);
        }

        if (cursorElement) {
            cursorElement.classList.remove('cursor-0', 'cursor-1', 'cursor-2');
            cursorElement.style.width = '';
            cursorElement.style.height = '';
        }
        docElement.style.cursor = '';
        if (triangle) {
            triangle.style.display = 'none';
        }

        saturationClickCount = 0;
        underlineClickCount = 0;
        fontSizeClickCount = 0;
        lineHeightClickCount = 0;
        letterSpacingClickCount = 0;
        contrastClickCount = 0;
        cursorClickCount = 0;

        syncControls();
        saveSettings();
    });

    //save the user's settings in local storage
    function saveSettings() {
        const settings = {
            version: 4,
            filters: {
                invert: filterState.invert,
                grayscale: filterState.grayscale,
                saturation: filterState.saturation,
                contrast: filterState.contrast
            },
            underline: docElement.classList.contains('underline-style-2') ? 'style-2' : docElement.classList.contains('underline-style-1') ? 'style-1' : docElement.classList.contains('underline-style-0') ? 'style-0' : 'default',
            fontSize: docElement.dataset.a11yStiacFontSizeValue || '',
            lineHeight: docElement.classList.contains('line-height-2') ? 'line-height-2' : docElement.classList.contains('line-height-1') ? 'line-height-1' : docElement.classList.contains('line-height-0') ? 'line-height-0' : 'default',
            letterSpacing: docElement.style.letterSpacing || '',
            textAlign: getDocumentTextAlign(),
            dyslexiaFont: Boolean(docElement.dataset.a11yStiacDyslexiaFont),
            hideImages: docElement.classList.contains('hide-images'),
            hideVideo: docElement.classList.contains('hide-video'),
            reduceMotion: docElement.classList.contains('reduce-motion'),
            cursor: cursor.classList.contains('cursor-2') ? 'guide' : cursor.classList.contains('cursor-1') ? 'mask' : cursor.classList.contains('cursor-0') ? 'focus' : 'default',
            position: getCurrentPosition()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    //save the user's settings in local storage when the page is refreshed or closed
    window.addEventListener('beforeunload', saveSettings);

    //load the user's settings from local storage
    function migrateLegacySettings(legacy) {
        if (!legacy || typeof legacy !== 'object') {
            return null;
        }
        return {
            version: 4,
            filters: {
                invert: Boolean(legacy.invertColors),
                grayscale: Boolean(legacy.grayscale),
                saturation: legacy.highSaturation ? 'high' : legacy.lowSaturation ? 'low' : 'default',
                contrast: legacy.contrastStyle2 ? 'extra' : legacy.contrastStyle1 ? 'high' : legacy.contrastStyle0 ? 'low' : 'default'
            },
            underline: legacy.underlineStyle2 ? 'style-2' : legacy.underlineStyle1 ? 'style-1' : legacy.underlineStyle0 ? 'style-0' : 'default',
            fontSize: legacy.fontSize || '',
            lineHeight: legacy.lineHeight2 ? 'line-height-2' : legacy.lineHeight1 ? 'line-height-1' : legacy.lineHeight0 ? 'line-height-0' : 'default',
            letterSpacing: legacy.letterSpacing || '',
            textAlign: legacy.textAlign || '',
            dyslexiaFont: Boolean(legacy.dyslexiaFont),
            hideImages: Boolean(legacy.hideImages),
            hideVideo: Boolean(legacy.hideVideo),
            reduceMotion: Boolean(legacy.reduceMotion),
            cursor: legacy.cursor2 ? 'guide' : legacy.cursor1 ? 'mask' : legacy.cursor0 ? 'focus' : 'default',
            position: normalisePositionClass(legacy.accPosition, DEFAULT_MODAL_POSITION)
        };
    }

    function applySavedSettings(settings) {
        if (!settings) {
            return;
        }
        if (typeof settings.version === 'number' && settings.version < 4 && typeof settings.dyslexiaFont === 'undefined') {
            settings.dyslexiaFont = false;
        }
        if (settings.filters) {
            filterState.invert = Boolean(settings.filters.invert);
            filterState.grayscale = Boolean(settings.filters.grayscale);
            filterState.saturation = settings.filters.saturation || 'default';
            filterState.contrast = settings.filters.contrast || 'default';
            applyFilterState();
        }
        docElement.classList.toggle('underline-style-0', settings.underline === 'style-0');
        docElement.classList.toggle('underline-style-1', settings.underline === 'style-1');
        docElement.classList.toggle('underline-style-2', settings.underline === 'style-2');
        applyGlobalFontSize(settings.fontSize || '');
        docElement.classList.toggle('line-height-0', settings.lineHeight === 'line-height-0');
        docElement.classList.toggle('line-height-1', settings.lineHeight === 'line-height-1');
        docElement.classList.toggle('line-height-2', settings.lineHeight === 'line-height-2');
        docElement.style.letterSpacing = settings.letterSpacing || '';
        setDocumentTextAlign(settings.textAlign || '');
        if (settings.dyslexiaFont) {
            ensureOpenDyslexicStylesheet().catch((error) => {
                if (widgetScriptConfig.mode === 'debug' && typeof console !== 'undefined' && console && typeof console.warn === 'function') {
                    console.warn('[Accessibility Widget] failed to load OpenDyslexic stylesheet during restore', error);
                }
            });
            docElement.dataset.a11yStiacDyslexiaFont = 'true';
        } else {
            delete docElement.dataset.a11yStiacDyslexiaFont;
        }
        setHideImagesActive(Boolean(settings.hideImages));
        docElement.classList.toggle('hide-video', Boolean(settings.hideVideo));
        setReduceMotionActive(Boolean(settings.reduceMotion));

        cursor.classList.toggle('cursor-0', settings.cursor === 'focus');
        cursor.classList.toggle('cursor-1', settings.cursor === 'mask');
        cursor.classList.toggle('cursor-2', settings.cursor === 'guide');
        if (settings.cursor === 'focus') {
            cursor.style.width = '50px';
            cursor.style.height = '50px';
        } else if (settings.cursor === 'mask') {
            cursor.style.width = '100%';
            cursor.style.height = '15vh';
        } else if (settings.cursor === 'guide') {
            cursor.style.width = '25vw';
            cursor.style.height = '8px';
        } else {
            cursor.style.width = '';
            cursor.style.height = '';
        }
        docElement.style.cursor = settings.cursor === 'guide' ? 'none' : '';
        const triangle = document.getElementById('triangle-cursor');
        if (triangle) {
            triangle.style.display = settings.cursor === 'guide' ? 'block' : 'none';
        }

        positionClasses.forEach(positionClass => {
            accessibilityModal.classList.remove(positionClass);
        });
        const restoredPosition = normalisePositionClass(settings.position, DEFAULT_MODAL_POSITION);
        accessibilityModal.classList.add(restoredPosition);
        updatePositionControls();
        updateCloseButtonIcon();
    }

    function syncControls() {
        const invertItem = document.querySelector('#invert-colors');
        setControlActiveState(invertItem, filterState.invert);
        updateProgress(invertItem, -1);

        const grayscaleItem = document.querySelector('#grayscale');
        setControlActiveState(grayscaleItem, filterState.grayscale);
        updateProgress(grayscaleItem, -1);

        const saturationItem = document.querySelector('#saturation');
        const saturationLabel = saturationItem ? saturationItem.querySelector('p') : null;
        if (filterState.saturation === 'low') {
            saturationClickCount = 1;
            if (saturationLabel) {
                saturationLabel.innerText = 'Low Saturation';
            }
            updateProgress(saturationItem, 0);
            setControlActiveState(saturationItem, true);
        } else if (filterState.saturation === 'high') {
            saturationClickCount = 2;
            if (saturationLabel) {
                saturationLabel.innerText = 'High Saturation';
            }
            updateProgress(saturationItem, 1);
            setControlActiveState(saturationItem, true);
        } else {
            saturationClickCount = 0;
            if (saturationLabel) {
                saturationLabel.innerText = 'Saturation';
            }
            updateProgress(saturationItem, -1);
            setControlActiveState(saturationItem, false);
        }

        const underlineItem = document.querySelector('#underline');
        const underlineState = docElement.classList.contains('underline-style-2') ? 'style-2' : docElement.classList.contains('underline-style-1') ? 'style-1' : docElement.classList.contains('underline-style-0') ? 'style-0' : 'default';
        if (underlineState === 'style-0') {
            underlineClickCount = 1;
            updateProgress(underlineItem, 0);
            setControlActiveState(underlineItem, true);
        } else if (underlineState === 'style-1') {
            underlineClickCount = 2;
            updateProgress(underlineItem, 1);
            setControlActiveState(underlineItem, true);
        } else if (underlineState === 'style-2') {
            underlineClickCount = 3;
            updateProgress(underlineItem, 2);
            setControlActiveState(underlineItem, true);
        } else {
            underlineClickCount = 0;
            updateProgress(underlineItem, -1);
            setControlActiveState(underlineItem, false);
        }

        const fontSizeItem = document.querySelector('#font-size');
        const storedFontSizeValue = docElement.dataset.a11yStiacFontSizeValue || '';
        const storedFontScale = parseFloat(docElement.dataset.a11yStiacFontScale || '');
        const resolvedStoredScale = resolveFontScale(storedFontSizeValue);
        const currentFontScale = Number.isFinite(storedFontScale) && storedFontScale > 0
            ? storedFontScale
            : Number.isFinite(resolvedStoredScale) && resolvedStoredScale > 0
                ? resolvedStoredScale
                : activeFontScale || 1;
        const isApproximately = (value, target) => Math.abs(value - target) < 0.05;
        if (isApproximately(currentFontScale, 1.3)) {
            fontSizeClickCount = 1;
            updateProgress(fontSizeItem, 0);
            setControlActiveState(fontSizeItem, true);
        } else if (isApproximately(currentFontScale, 1.5)) {
            fontSizeClickCount = 2;
            updateProgress(fontSizeItem, 1);
            setControlActiveState(fontSizeItem, true);
        } else if (isApproximately(currentFontScale, 1.8)) {
            fontSizeClickCount = 3;
            updateProgress(fontSizeItem, 2);
            setControlActiveState(fontSizeItem, true);
        } else {
            fontSizeClickCount = 0;
            updateProgress(fontSizeItem, -1);
            setControlActiveState(fontSizeItem, false);
        }

        const lineHeightItem = document.querySelector('#line-height');
        if (docElement.classList.contains('line-height-0')) {
            lineHeightClickCount = 1;
            updateProgress(lineHeightItem, 0);
            setControlActiveState(lineHeightItem, true);
        } else if (docElement.classList.contains('line-height-1')) {
            lineHeightClickCount = 2;
            updateProgress(lineHeightItem, 1);
            setControlActiveState(lineHeightItem, true);
        } else if (docElement.classList.contains('line-height-2')) {
            lineHeightClickCount = 3;
            updateProgress(lineHeightItem, 2);
            setControlActiveState(lineHeightItem, true);
        } else {
            lineHeightClickCount = 0;
            updateProgress(lineHeightItem, -1);
            setControlActiveState(lineHeightItem, false);
        }

        const letterSpacingItem = document.querySelector('#letter-spacing');
        if (docElement.style.letterSpacing === '0.1rem') {
            letterSpacingClickCount = 1;
            updateProgress(letterSpacingItem, 0);
            setControlActiveState(letterSpacingItem, true);
        } else if (docElement.style.letterSpacing === '0.2rem') {
            letterSpacingClickCount = 2;
            updateProgress(letterSpacingItem, 1);
            setControlActiveState(letterSpacingItem, true);
        } else if (docElement.style.letterSpacing === '0.3rem') {
            letterSpacingClickCount = 3;
            updateProgress(letterSpacingItem, 2);
            setControlActiveState(letterSpacingItem, true);
        } else {
            letterSpacingClickCount = 0;
            updateProgress(letterSpacingItem, -1);
            setControlActiveState(letterSpacingItem, false);
        }

        const dyslexiaFontItem = document.querySelector('#font-dyslexia');
        const dyslexiaActive = Boolean(docElement.dataset.a11yStiacDyslexiaFont);
        setControlActiveState(dyslexiaFontItem, dyslexiaActive);
        updateProgress(dyslexiaFontItem, -1);

        syncTextAlignUI();

        if (filterState.contrast === 'low') {
            contrastClickCount = 1;
            updateProgress(document.querySelector('#contrast'), 0);
            setControlActiveState(document.querySelector('#contrast'), true);
        } else if (filterState.contrast === 'high') {
            contrastClickCount = 2;
            updateProgress(document.querySelector('#contrast'), 1);
            setControlActiveState(document.querySelector('#contrast'), true);
        } else if (filterState.contrast === 'extra') {
            contrastClickCount = 3;
            updateProgress(document.querySelector('#contrast'), 2);
            setControlActiveState(document.querySelector('#contrast'), true);
        } else {
            contrastClickCount = 0;
            updateProgress(document.querySelector('#contrast'), -1);
            setControlActiveState(document.querySelector('#contrast'), false);
        }

        const hideImagesItem = document.querySelector('#hide-images');
        const hideImagesActive = docElement.classList.contains('hide-images');
        setControlActiveState(hideImagesItem, hideImagesActive);
        const hideVideoItem = document.querySelector('#hide-video');
        const hideVideoActive = docElement.classList.contains('hide-video');
        setControlActiveState(hideVideoItem, hideVideoActive);

        const reduceMotionItem = document.querySelector('#reduce-motion');
        const reduceMotionActive = docElement.classList.contains('reduce-motion');
        setControlActiveState(reduceMotionItem, reduceMotionActive);

        const cursorItem = document.querySelector('#change-cursor');
        const triangle = document.getElementById('triangle-cursor');
        if (cursor.classList.contains('cursor-0')) {
            cursorClickCount = 1;
            cursor.style.width = '50px';
            cursor.style.height = '50px';
            docElement.style.cursor = '';
            if (triangle) {
                triangle.style.display = 'none';
            }
            updateProgress(cursorItem, 0);
            setControlActiveState(cursorItem, true);
        } else if (cursor.classList.contains('cursor-1')) {
            cursorClickCount = 2;
            cursor.style.width = '100%';
            cursor.style.height = '15vh';
            docElement.style.cursor = '';
            if (triangle) {
                triangle.style.display = 'none';
            }
            updateProgress(cursorItem, 1);
            setControlActiveState(cursorItem, true);
        } else if (cursor.classList.contains('cursor-2')) {
            cursorClickCount = 3;
            cursor.style.width = '25vw';
            cursor.style.height = '8px';
            docElement.style.cursor = 'none';
            if (triangle) {
                triangle.style.display = 'block';
            }
            updateProgress(cursorItem, 2);
            setControlActiveState(cursorItem, true);
        } else {
            cursorClickCount = 0;
            cursor.style.width = '';
            cursor.style.height = '';
            docElement.style.cursor = '';
            if (triangle) {
                triangle.style.display = 'none';
            }
            updateProgress(cursorItem, -1);
            setControlActiveState(cursorItem, false);
        }

        updatePositionControls();
    }

    const savedSettingsRaw = localStorage.getItem(STORAGE_KEY);
    let savedSettings = null;
    if (savedSettingsRaw) {
        try {
            const parsed = JSON.parse(savedSettingsRaw);
            savedSettings = parsed && parsed.version ? parsed : migrateLegacySettings(parsed);
        } catch (error) {
            savedSettings = null;
        }
    }

    if (savedSettings) {
        applySavedSettings(savedSettings);
        if (typeof savedSettings.reduceMotion === 'boolean') {
            reduceMotionPreferenceLocked = true;
        }
    }

    if (!reduceMotionPreferenceLocked && pendingSystemReduceMotion) {
        setReduceMotionActive(true);
    }

    syncControls();

    accItems.forEach(item => {
        const trigger = item.querySelector('.a11y-stiac-child');
        if (!trigger) {
            return;
        }
        const targetColor = trigger.classList.contains('active') ? 'var(--a11y-stiac-header-text-color)' : 'var(--a11y-stiac-text-color)';
        trigger.style.color = targetColor;
        trigger.querySelectorAll('svg').forEach(icon => {
            icon.style.color = targetColor;
            icon.style.fill = 'currentColor';
        });
    });

}

function scheduleAccessibilityWidgetInitialisation() {
    if (typeof document === 'undefined' || typeof document.addEventListener !== 'function') {
        initialiseAccessibilityWidget();
        return;
    }

    if (document.readyState === 'loading') {
        const onReady = () => {
            document.removeEventListener('DOMContentLoaded', onReady);
            initialiseAccessibilityWidget();
        };
        document.addEventListener('DOMContentLoaded', onReady);
        return;
    }

    initialiseAccessibilityWidget();
}

scheduleAccessibilityWidgetInitialisation();
