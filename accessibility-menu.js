// Accessibility Menu for Stiac Web Services
// Proprietary software by Stiac Web Services (SWS). Unauthorized duplication or tampering is prohibited.

const accessibilityMenuStyles = `
    :root {
      --acc_color_1: #0f172a;
      --acc_color_2: #f8fafc;
      --border_radius: 24px;
      --acc-font-scale: 1;
    }

    html[data-acc-font-scale-active] {
      font-size: var(--acc-root-font-size, 100%) !important;
    }

    html[data-acc-font-scale-active] body {
      font-size: var(--acc-body-font-size, inherit) !important;
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
    html[data-acc-tailwind-fallback] audio,
    html[data-acc-tailwind-fallback] canvas,
    html[data-acc-tailwind-fallback] embed,
    html[data-acc-tailwind-fallback] iframe,
    html[data-acc-tailwind-fallback] img,
    html[data-acc-tailwind-fallback] object,
    html[data-acc-tailwind-fallback] svg,
    html[data-acc-tailwind-fallback] video {
      display: inline;
      vertical-align: baseline;
    }

    html[data-acc-tailwind-fallback] #accessibility-modal svg {
      display: block;
      vertical-align: middle;
    }

    /*
     * Text alignment helpers to comply with WCAG 2.1 Level A and the
     * European Accessibility Act. Users can align textual content according
     * to their reading preference without author styles fighting the choice.
     */
    html[data-acc-text-align="start"],
    html[data-acc-text-align="start"] body,
    html[data-acc-text-align="start"] body :where(h1, h2, h3, h4, h5, h6, p, li, dd, dt, blockquote, pre, code, span, a, label, legend, figcaption, table, th, td, caption) {
      text-align: start !important;
    }

    html[data-acc-text-align="center"],
    html[data-acc-text-align="center"] body,
    html[data-acc-text-align="center"] body :where(h1, h2, h3, h4, h5, h6, p, li, dd, dt, blockquote, pre, code, span, a, label, legend, figcaption, table, th, td, caption) {
      text-align: center !important;
    }

    html[data-acc-text-align="end"],
    html[data-acc-text-align="end"] body,
    html[data-acc-text-align="end"] body :where(h1, h2, h3, h4, h5, h6, p, li, dd, dt, blockquote, pre, code, span, a, label, legend, figcaption, table, th, td, caption) {
      text-align: end !important;
    }

    html[data-acc-text-align="justify"],
    html[data-acc-text-align="justify"] body,
    html[data-acc-text-align="justify"] body :where(h1, h2, h3, h4, h5, h6, p, li, dd, dt, blockquote, pre, code, span, a, label, legend, figcaption, table, th, td, caption) {
      text-align: justify !important;
    }

    .acc-sr-only {
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

    #text-align .acc-align-option {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-radius: 0.75rem;
      border: 1px solid rgba(15, 23, 42, 0.15);
      background-color: rgba(248, 250, 252, 0.85);
      color: var(--acc_color_1);
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.5rem 0.75rem;
      width: 100%;
      transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }

    #text-align .acc-align-option[aria-pressed="true"] {
      background-color: var(--acc_color_1);
      color: var(--acc_color_2);
      border-color: var(--acc_color_1);
      box-shadow: 0 12px 30px -18px rgba(15, 23, 42, 0.7);
    }

    #text-align .acc-align-option:focus-visible {
      outline: 2px solid rgba(15, 23, 42, 0.45);
      outline-offset: 2px;
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
      font-size: var(--acc-modal-font-size, calc(1rem / var(--acc-font-scale, 1)));
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
      font-size: var(--acc-modal-text-xs, calc(0.75rem / var(--acc-font-scale, 1)));
    }

    #accessibility-modal .text-sm {
      font-size: var(--acc-modal-text-sm, calc(0.875rem / var(--acc-font-scale, 1)));
    }

    #accessibility-modal .text-lg {
      font-size: var(--acc-modal-text-lg, calc(1.125rem / var(--acc-font-scale, 1)));
    }

    #accessibility-modal .text-[10px] {
      font-size: var(--acc-modal-text-10, calc(10px / var(--acc-font-scale, 1)));
    }

    #accessibility-modal .text-[11px] {
      font-size: var(--acc-modal-text-11, calc(11px / var(--acc-font-scale, 1)));
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
      --acc-translate-x: 0;
      --acc-transform-origin: top right;
      transform-origin: var(--acc-transform-origin);
      transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.35s ease, width 0.35s ease, height 0.35s ease, opacity 0.35s ease;
      opacity: 0;
      transform: translate3d(var(--acc-translate-x), 16px, 0) scale(0.96);
    }

    #accessibility-modal.is-ready {
      opacity: 1;
      transform: translate3d(var(--acc-translate-x), 0, 0) scale(1);
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
      border-radius: 9999px;
      overflow: hidden;
      opacity: 1;
      transform: translate3d(var(--acc-translate-x), 8px, 0) scale(0.94);
    }

    #accessibility-modal.is-ready.close {
      transform: translate3d(var(--acc-translate-x), 8px, 0) scale(0.94);
    }

    #accessibility-modal.close #headerContent,
    #accessibility-modal.close #accessibility-tools,
    #accessibility-modal.close #acc-footer {
      display: none;
    }

    #accessibility-modal.close #closeBtn {
      inset: 0.5rem;
      position: absolute;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 9999px;
      margin: 0;
      box-shadow: none;
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
      --acc-translate-x: 0;
      --acc-transform-origin: top left;
    }

    #accessibility-modal.right {
      right: 1rem;
      left: auto;
      --acc-translate-x: 0;
      --acc-transform-origin: top right;
    }

    #accessibility-modal.top {
      top: 1rem;
      bottom: auto;
      left: 50%;
      right: auto;
      --acc-translate-x: -50%;
      --acc-transform-origin: top center;
    }

    #accessibility-modal.bottom {
      top: auto;
      bottom: 1rem;
      left: 50%;
      right: auto;
      --acc-translate-x: -50%;
      --acc-transform-origin: bottom center;
    }

    #accessibility-modal #accessibility-tools {
      scrollbar-width: thin;
    }

    #accessibility-modal #accessibility-tools::-webkit-scrollbar {
      width: 8px;
    }

    #accessibility-modal #accessibility-tools::-webkit-scrollbar-thumb {
      background: rgba(15, 23, 42, 0.35);
      border-radius: 9999px;
    }

    .acc-item:hover .acc-child {
      transform: translateY(-2px);
    }

    .acc-child {
      border: 1px solid rgba(15, 23, 42, 0.1);
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20px;
      box-shadow: none;
      color: rgba(15, 23, 42, 0.85);
    }

    .acc-child.active {
      background: var(--acc_color_1);
      color: var(--acc_color_2);
      border-color: transparent;
    }

    .acc-child.active svg {
      color: var(--acc_color_2);
      fill: currentColor;
    }

    .acc-progress-parent {
      width: 100%;
    }

    .acc-progress-child {
      opacity: 1;
      background: rgba(15, 23, 42, 0.25);
      border-radius: 9999px;
      border: 1px solid rgba(15, 23, 42, 0.35);
      transition: opacity 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .acc-progress-child.active {
      opacity: 1;
      background: var(--acc_color_1);
      border-color: var(--acc_color_1);
      box-shadow: 0 0 0 1px rgba(248, 250, 252, 0.65);
    }

    #change-positions button.active {
      background: var(--acc_color_1);
      color: var(--acc_color_2);
      box-shadow: none;
    }

    #change-positions button.active svg {
      fill: currentColor;
    }

    #reset-all:hover,
    #change-positions button:hover,
    .acc-item:hover .acc-child.active {
      filter: brightness(1.05);
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

    .hide-images [data-acc-preserve-images] :where(img, picture, svg, canvas, [role="img"], object[type^="image"], embed[type^="image"]) {
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
        [data-acc-video-embed]
      ) {
      display: none !important;
    }

    .hide-video [data-acc-preserve-video] {
      display: initial !important;
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
      border: 2px solid var(--acc_color_2);
      box-shadow: 0 0 20px 0 var(--acc_color_2);
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
      border: 10px solid var(--acc_color_2);
      border-left: 0;
      border-right: 0;
      box-shadow: 0 0 0 100vh rgb(0 0 0 / 50%);
      transition: none;
      transform: translate(0, -50%);
    }

    #cursor.cursor-2 {
      width: 25vw;
      height: 8px;
      background: var(--acc_color_1);
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
const accessibilityMenuHTML = `
    <div id="accessibility-modal" class="right close fixed z-[99999999] flex w-[calc(100%-2rem)] max-w-md flex-col gap-6 overflow-hidden rounded-3xl bg-white/95 text-slate-900 shadow-2xl shadow-slate-900/30 ring-1 ring-slate-900/10 backdrop-blur-lg max-h-[90vh]" data-acc-preserve-images>
      <button id="closeBtn" class="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/40 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/40" aria-label="Toggle accessibility panel">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-universal-access-circle" viewBox="0 0 16 16">
          <path d="M8 4.143A1.071 1.071 0 1 0 8 2a1.071 1.071 0 0 0 0 2.143m-4.668 1.47 3.24.316v2.5l-.323 4.585A.383.383 0 0 0 7 13.14l.826-4.017c.045-.18.301-.18.346 0L9 13.139a.383.383 0 0 0 .752-.125L9.43 8.43v-2.5l3.239-.316a.38.38 0 0 0-.047-.756H3.379a.38.38 0 0 0-.047.756Z" />
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8" />
        </svg>
      </button>
      <div id="headerContent" class="mx-6 mt-8 flex flex-col gap-2 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-slate-100 shadow-lg shadow-slate-900/40">
        <p class="text-lg font-semibold tracking-tight">Accessibility Tools</p>
        <span class="text-sm font-normal text-slate-300">Fine-tune colours, typography and focus helpers with a refreshed look.</span>
      </div>
      <div id="accessibility-tools" class="grid max-h-[45vh] grid-cols-1 gap-4 overflow-y-auto px-6 pb-6 sm:grid-cols-2">

        <!--invert colors-->
        <div class="acc-item group">
          <div class="acc-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 p-5 text-center text-sm font-semibold text-slate-700 shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200" id="invert-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-droplet-half" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M7.21.8C7.69.295 8 0 8 0q.164.544.371 1.038c.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8m.413 1.021A31 31 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10c0 0 2.5 1.5 5 .5s5-.5 5-.5c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z" />
              <path fill-rule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87z" />
            </svg>
            <p class="text-xs font-semibold uppercase tracking-wide">Invert Colours</p>
            <div class="acc-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="acc-progress-child acc-progress-child-1 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-2 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-3 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--grayscale-->
        <div class="acc-item group">
          <div class="acc-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 p-5 text-center text-sm font-semibold text-slate-700 shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200" id="grayscale">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-half" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 0 8 1zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16" />
            </svg>
            <p class="text-xs font-semibold uppercase tracking-wide">Grayscale</p>
            <div class="acc-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="acc-progress-child acc-progress-child-1 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-2 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-3 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--saturation-->
        <div class="acc-item group">
          <div class="acc-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 p-5 text-center text-sm font-semibold text-slate-700 shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200" id="saturation">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-palette" viewBox="0 0 16 16">
              <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
              <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8m-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7" />
            </svg>
            <p class="text-xs font-semibold uppercase tracking-wide">Low Saturation</p>
            <div class="acc-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="acc-progress-child acc-progress-child-1 active h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-2 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--links highlight-->
        <div class="acc-item group">
          <div class="acc-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 p-5 text-center text-sm font-semibold text-slate-700 shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200" id="underline">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
              <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
              <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
            </svg>
            <p class="text-xs font-semibold uppercase tracking-wide">Links Highlight</p>
            <div class="acc-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="acc-progress-child acc-progress-child-1 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-2 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-3 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--font size-->
        <div class="acc-item group">
          <div class="acc-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 p-5 text-center text-sm font-semibold text-slate-700 shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200" id="font-size">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 12V17H17.5C17.7761 17 18 17.2239 18 17.5C18 17.7761 17.7761 18 17.5 18H15.5C15.2239 18 15 17.7761 15 17.5C15 17.2239 15.2239 17 15.5 17H16V12H14V12.5C14 12.7761 13.7761 13 13.5 13C13.2239 13 13 12.7761 13 12.5V11.5C13 11.2239 13.2239 11 13.5 11H19.5C19.7761 11 20 11.2239 20 11.5V12.5C20 12.7761 19.7761 13 19.5 13C19.2239 13 19 12.7761 19 12.5V12H17ZM10 6V17H11.5C11.7761 17 12 17.2239 12 17.5C12 17.7761 11.7761 18 11.5 18H7.5C7.22386 18 7 17.7761 7 17.5C7 17.2239 7.22386 17 7.5 17H9V6H5V7.5C5 7.77614 4.77614 8 4.5 8C4.22386 8 4 7.77614 4 7.5V5.5C4 5.22386 4.22386 5 4.5 5H14.5C14.7761 5 15 5.22386 15 5.5V7.5C15 7.77614 14.7761 8 14.5 8C14.2239 8 14 7.77614 14 7.5V6H10Z" fill="currentColor" />
            </svg>
            <p class="text-xs font-semibold uppercase tracking-wide">Font Size</p>
            <div class="acc-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="acc-progress-child acc-progress-child-1 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-2 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-3 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--line height-->
        <div class="acc-item group">
          <div class="acc-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 p-5 text-center text-sm font-semibold text-slate-700 shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200" id="line-height">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5.70711V17.2929L20.1464 16.1464C20.3417 15.9512 20.6583 15.9512 20.8536 16.1464C21.0488 16.3417 21.0488 16.6583 20.8536 16.8536L18.8536 18.8536C18.6583 19.0488 18.3417 19.0488 18.1464 18.8536L16.1464 16.8536C15.9512 16.6583 15.9512 16.3417 16.1464 16.1464C16.3417 15.9512 16.6583 15.9512 16.8536 16.1464L18 17.2929V5.70711L16.8536 6.85355C16.6583 7.04882 16.3417 7.04882 16.1464 6.85355C15.9512 6.65829 15.9512 6.34171 16.1464 6.14645L18.1464 4.14645C18.3417 3.95118 18.6583 3.95118 18.8536 4.14645L20.8536 6.14645C21.0488 6.34171 21.0488 6.65829 20.8536 6.85355C20.6583 7.04882 20.3417 7.04882 20.1464 6.85355L19 5.70711ZM8 18V5H4V6.5C4 6.77614 3.77614 7 3.5 7C3.22386 7 3 6.77614 3 6.5V4.5C3 4.22386 3.22386 4 3.5 4H13.5C13.7761 4 14 4.22386 14 4.5V6.5C14 6.77614 13.7761 7 13.5 7C13.2239 7 13 6.77614 13 6.5V5H9V18H10.5C10.7761 18 11 18.2239 11 18.5C11 18.7761 10.7761 19 10.5 19H6.5C6.22386 19 6 18.7761 6 18.5C6 18.2239 6.22386 18 6.5 18H8Z" fill="currentColor" />
            </svg>
            <p class="text-xs font-semibold uppercase tracking-wide">Line Height</p>
            <div class="acc-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="acc-progress-child acc-progress-child-1 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-2 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-3 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--letter spacing-->
        <div class="acc-item group">
          <div class="acc-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 p-5 text-center text-sm font-semibold text-slate-700 shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200" id="letter-spacing">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5.70711V17.2929L20.1464 16.1464C20.3417 15.9512 20.6583 15.9512 20.8536 16.1464C21.0488 16.3417 21.0488 16.6583 20.8536 16.8536L18.8536 18.8536C18.6583 19.0488 18.3417 19.0488 18.1464 18.8536L16.1464 16.8536C15.9512 16.6583 15.9512 16.3417 16.1464 16.1464C16.3417 15.9512 16.6583 15.9512 16.8536 16.1464L18 17.2929V5.70711L16.8536 6.85355C16.6583 7.04882 16.3417 7.04882 16.1464 6.85355C15.9512 6.65829 15.9512 6.34171 16.1464 6.14645L18.1464 4.14645C18.3417 3.95118 18.6583 3.95118 18.8536 4.14645L20.8536 6.14645C21.0488 6.34171 21.0488 6.65829 20.8536 6.85355C20.6583 7.04882 20.3417 7.04882 20.1464 6.85355L19 5.70711ZM8 18V5H4V6.5C4 6.77614 3.77614 7 3.5 7C3.22386 7 3 6.77614 3 6.5V4.5C3 4.22386 3.22386 4 3.5 4H13.5C13.7761 4 14 4.22386 14 4.5V6.5C14 6.77614 13.7761 7 13.5 7C13.2239 7 13 6.77614 13 6.5V5H9V18H10.5C10.7761 18 11 18.2239 11 18.5C11 18.7761 10.7761 19 10.5 19H6.5C6.22386 19 6 18.7761 6 18.5C6 18.2239 6.22386 18 6.5 18H8Z" fill="currentColor" />
            </svg>
            <p class="text-xs font-semibold uppercase tracking-wide">Letter Spacing</p>
            <div class="acc-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="acc-progress-child acc-progress-child-1 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-2 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-3 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--text align-->
        <div class="acc-item group">
          <div class="acc-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 p-5 text-center text-sm font-semibold text-slate-700 shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200" id="text-align" role="group" aria-labelledby="text-align-label" aria-describedby="text-align-description">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-text-align-icon>
              <path d="M4.5 7C4.22386 7 4 6.77614 4 6.5C4 6.22386 4.22386 6 4.5 6H19.5C19.7761 6 20 6.22386 20 6.5C20 6.77614 19.7761 7 19.5 7H4.5ZM4.5 15C4.22386 15 4 14.7761 4 14.5C4 14.2239 4.22386 14 4.5 14H19.5C19.7761 14 20 14.2239 20 14.5C20 14.7761 19.7761 15 19.5 15H4.5ZM4.5 11C4.22386 11 4 10.7761 4 10.5C4 10.2239 4.22386 10 4.5 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H4.5ZM4.5 19C4.22386 19 4 18.7761 4 18.5C4 18.2239 4.22386 18 4.5 18H13.5C13.7761 18 14 18.2239 14 18.5C14 18.7761 13.7761 19 13.5 19H4.5Z" fill="currentColor"/>
            </svg>
            <p class="text-xs font-semibold uppercase tracking-wide" id="text-align-label">Text Align</p>
            <p id="text-align-description" class="acc-sr-only">Choose how text should align across the page. Select the same option again to return to the default alignment.</p>
            <div class="mt-1 grid w-full grid-cols-2 gap-2" role="group" aria-label="Text alignment options">
              <button type="button" class="acc-align-option" data-text-align-option="start">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                  <path d="M4.5 7C4.22386 7 4 6.77614 4 6.5C4 6.22386 4.22386 6 4.5 6H19.5C19.7761 6 20 6.22386 20 6.5C20 6.77614 19.7761 7 19.5 7H4.5ZM4.5 15C4.22386 15 4 14.7761 4 14.5C4 14.2239 4.22386 14 4.5 14H19.5C19.7761 14 20 14.2239 20 14.5C20 14.7761 19.7761 15 19.5 15H4.5ZM4.5 11C4.22386 11 4 10.7761 4 10.5C4 10.2239 4.22386 10 4.5 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H4.5ZM4.5 19C4.22386 19 4 18.7761 4 18.5C4 18.2239 4.22386 18 4.5 18H13.5C13.7761 18 14 18.2239 14 18.5C14 18.7761 13.7761 19 13.5 19H4.5Z" fill="currentColor"/>
                </svg>
                <span>Start</span>
              </button>
              <button type="button" class="acc-align-option" data-text-align-option="center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                  <path d="M4.5 7C4.22386 7 4 6.77614 4 6.5C4 6.22386 4.22386 6 4.5 6H19.5C19.7761 6 20 6.22386 20 6.5C20 6.77614 19.7761 7 19.5 7H4.5ZM4.5 15C4.22386 15 4 14.7761 4 14.5C4 14.2239 4.22386 14 4.5 14H19.5C19.7761 14 20 14.2239 20 14.5C20 14.7761 19.7761 15 19.5 15H4.5ZM7.5 11C7.22386 11 7 10.7761 7 10.5C7 10.2239 7.22386 10 7.5 10H16.5C16.7761 10 17 10.2239 17 10.5C17 10.7761 16.7761 11 16.5 11H7.5ZM7.5 19C7.22386 19 7 18.7761 7 18.5C7 18.2239 7.22386 18 7.5 18H16.5C16.7761 18 17 18.2239 17 18.5C17 18.7761 16.7761 19 16.5 19H7.5Z" fill="currentColor"/>
                </svg>
                <span>Center</span>
              </button>
              <button type="button" class="acc-align-option" data-text-align-option="end">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                  <path d="M4.5 7C4.22386 7 4 6.77614 4 6.5C4 6.22386 4.22386 6 4.5 6H19.5C19.7761 6 20 6.22386 20 6.5C20 6.77614 19.7761 7 19.5 7H4.5ZM4.5 15C4.22386 15 4 14.7761 4 14.5C4 14.2239 4.22386 14 4.5 14H19.5C19.7761 14 20 14.2239 20 14.5C20 14.7761 19.7761 15 19.5 15H4.5ZM10.5 11C10.2239 11 10 10.7761 10 10.5C10 10.2239 10.2239 10 10.5 10H19.5C19.7761 10 20 10.2239 20 10.5C20 10.7761 19.7761 11 19.5 11H10.5ZM10.5 19C10.2239 19 10 18.7761 10 18.5C10 18.2239 10.2239 18 10.5 18H19.5C19.7761 18 20 18.2239 20 18.5C20 18.7761 19.7761 19 19.5 19H10.5Z" fill="currentColor"/>
                </svg>
                <span>End</span>
              </button>
              <button type="button" class="acc-align-option" data-text-align-option="justify">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                  <path d="M4.5 6H19.5C19.7761 6 20 5.77614 20 5.5C20 5.22386 19.7761 5 19.5 5H4.5C4.22386 5 4 5.22386 4 5.5C4 5.77614 4.22386 6 4.5 6ZM4.5 10H19.5C19.7761 10 20 9.77614 20 9.5C20 9.22386 19.7761 9 19.5 9H4.5C4.22386 9 4 9.22386 4 9.5C4 9.77614 4.22386 10 4.5 10ZM4.5 14H19.5C19.7761 14 20 13.7761 20 13.5C20 13.2239 19.7761 13 19.5 13H4.5C4.22386 13 4 13.2239 4 13.5C4 13.7761 4.22386 14 4.5 14ZM4.5 18H19.5C19.7761 18 20 17.7761 20 17.5C20 17.2239 19.7761 17 19.5 17H4.5C4.22386 17 4 17.2239 4 17.5C4 17.7761 4.22386 18 4.5 18Z" fill="currentColor"/>
                </svg>
                <span>Justify</span>
              </button>
            </div>
            <p class="acc-sr-only" data-text-align-status role="status" aria-live="polite"></p>
            <div class="acc-progress-parent hidden mt-3 flex w-full items-center justify-between gap-2" aria-hidden="true">
              <div class="acc-progress-child acc-progress-child-1 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-2 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-3 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-4 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--contrast-->
        <div class="acc-item group">
          <div class="acc-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 p-5 text-center text-sm font-semibold text-slate-700 shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200" id="contrast">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-transparency" viewBox="0 0 16 16">
              <path d="M0 6.5a6.5 6.5 0 0 1 12.346-2.846 6.5 6.5 0 1 1-8.691 8.691A6.5 6.5 0 0 1 0 6.5m5.144 6.358a5.5 5.5 0 1 0 7.714-7.714 6.5 6.5 0 0 1-7.714 7.714m-.733-1.269q.546.226 1.144.33l-1.474-1.474q.104.597.33 1.144m2.614.386a5.5 5.5 0 0 0 1.173-.242L4.374 7.91a6 6 0 0 0-.296 1.118zm2.157-.672q.446-.25.838-.576L5.418 6.126a6 6 0 0 0-.587.826zm1.545-1.284q.325-.39.576-.837L6.953 4.83a6 6 0 0 0-.827.587l4.6 4.602Zm1.006-1.822q.183-.562.242-1.172L9.028 4.078q-.58.096-1.118.296l3.823 3.824Zm.186-2.642a5.5 5.5 0 0 0-.33-1.144 5.5 5.5 0 0 0-1.144-.33z" />
            </svg>
            <p class="text-xs font-semibold uppercase tracking-wide">Contrast</p>
            <div class="acc-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="acc-progress-child acc-progress-child-1 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-2 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-3 h-1 flex-1"></div>
            </div>
          </div>
        </div>

        <!--hide images-->
        <div class="acc-item group">
          <div class="acc-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 p-5 text-center text-sm font-semibold text-slate-700 shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200" id="hide-images">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.8,4L4.8,4l1,1L4.8,4z M19.7,19L19.7,19l0.8,0.8L19.7,19z" />
              <path d="M18,7h-2c-0.5,0-1,0.5-1,1v2c0,0.5,0.5,1,1,1h2c0.5,0,1-0.5,1-1V8C19,7.5,18.5,7,18,7z M18,10h-2V8h2V10z" />
              <path d="M22,6.5v11c0,0.6-0.2,1.1-0.6,1.6l-0.6-0.6l-0.1-0.1l-4.9-4.9l0.3-0.3c0.2-0.2,0.5-0.2,0.7,0l4.2,4.1V6.5	C21,5.7,20.3,5,19.5,5H7.4l-1-1h13.1C20.9,4,22,5.1,22,6.5z" />
              <path d="M1.9,1.1L1.1,1.9l2.4,2.4C2.6,4.6,2,5.5,2,6.5v11C2,18.9,3.1,20,4.5,20h14.8l2.9,2.9l0.7-0.7L1.9,1.1z M3,6.5	C3,5.8,3.5,5.1,4.3,5l10,10l-0.8,0.8l-5.7-5.6c-0.2-0.2-0.5-0.2-0.7,0L3,14.3V6.5z M4.5,19C3.7,19,3,18.3,3,17.5v-1.8l4.5-4.5	l5.7,5.6c0.2,0.2,0.5,0.2,0.7,0l1.1-1.1l3.3,3.3H4.5z" />
            </svg>
            <p class="text-xs font-semibold uppercase tracking-wide">Hide Image</p>
          </div>
        </div>

        <!--hide video-->
        <div class="acc-item group">
          <div class="acc-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 p-5 text-center text-sm font-semibold text-slate-700 shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200" id="hide-video">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-video-off" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M10.961 12.365a2 2 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518zM1.428 4.18A1 1 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634zM15 11.73l-3.5-1.555v-4.35L15 4.269zm-4.407 3.56-10-14 .814-.58 10 14z" />
            </svg>
            <p class="text-xs font-semibold uppercase tracking-wide">Hide Video</p>
          </div>
        </div>

        <!--change cursor-->
        <div class="acc-item group">
          <div class="acc-child flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 p-5 text-center text-sm font-semibold text-slate-700 shadow-md ring-1 ring-inset ring-slate-900/10 transition duration-200" id="change-cursor">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.85333 19.8536C8.58758 20.1193 8.13463 20.0079 8.02253 19.6492L3.02253 3.64915C2.90221 3.26413 3.26389 2.90246 3.64891 3.02278L19.6489 8.02278C20.0076 8.13487 20.1191 8.58782 19.8533 8.85357L16.2069 12.5L20.8533 17.1465C21.0486 17.3417 21.0486 17.6583 20.8533 17.8536L17.8533 20.8536C17.6581 21.0488 17.3415 21.0488 17.1462 20.8536L12.4998 16.2071L8.85333 19.8536ZM4.26173 4.26197L8.73053 18.5621L12.1462 15.1465C12.3415 14.9512 12.6581 14.9512 12.8533 15.1465L17.4998 19.7929L19.7927 17.5L15.1462 12.8536C14.951 12.6583 14.951 12.3417 15.1462 12.1465L18.5619 8.73078L4.26173 4.26197Z" fill="currentColor" />
            </svg>
            <p class="text-xs font-semibold uppercase tracking-wide">Change Cursors</p>
            <div class="acc-progress-parent hidden mt-1 flex w-full items-center justify-between gap-2">
              <div class="acc-progress-child acc-progress-child-1 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-2 h-1 flex-1"></div>
              <div class="acc-progress-child acc-progress-child-3 h-1 flex-1"></div>
            </div>
          </div>
        </div>
      </div>

      <!--cursor and triangle cursor-->
      <div id="cursor"></div>
      <div id="triangle-cursor"></div>

      <!--accessibility modal footer-->
      <div id="acc-footer" class="flex flex-col gap-4 border-t border-slate-900/10 bg-white/90 px-6 py-5 shadow-inner shadow-slate-900/5">

        <!--reset all-->
        <button id="reset-all" class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/40">
          Reset All
        </button>

        <!--change positions-->
        <div id="change-positions" class="flex flex-wrap items-center justify-center gap-3">
          <button id="align-acc-left" class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-slate-700 shadow-inner shadow-slate-900/5 ring-1 ring-slate-900/10 transition hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-900/40"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-align-start" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5" />
              <path d="M3 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
            </svg></button>
          <button id="align-acc-top" class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-slate-700 shadow-inner shadow-slate-900/5 ring-1 ring-slate-900/10 transition hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-900/40"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-align-top" viewBox="0 0 16 16">
              <rect width="4" height="12" rx="1" transform="matrix(1 0 0 -1 6 15)" />
              <path d="M1.5 2a.5.5 0 0 1 0-1zm13-1a.5.5 0 0 1 0 1zm-13 0h13v1h-13z" />
            </svg></button>
          <button id="align-acc-bottom" class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-slate-700 shadow-inner shadow-slate-900/5 ring-1 ring-slate-900/10 transition hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-900/40"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-align-bottom" viewBox="0 0 16 16">
              <rect width="4" height="12" x="6" y="1" rx="1" />
              <path d="M1.5 14a.5.5 0 0 0 0 1zm13 1a.5.5 0 0 0 0-1zm-13 0h13v-1h-13z" />
            </svg></button>
          <button id="align-acc-right" class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-slate-700 shadow-inner shadow-slate-900/5 ring-1 ring-slate-900/10 transition hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-900/40"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-align-end" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M14.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5" />
              <path d="M13 7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1z" />
            </svg></button>
        </div>
        <div id="stiac-sws-branding" class="stiac-sws-badge text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500" role="note" aria-label="Software protetto da Stiac Web Services">
          <strong class="block text-xs tracking-[0.35em] text-slate-600">Stiac Web Services</strong>
          <span class="text-[10px] font-normal tracking-[0.3em] text-slate-400">Proprietary Accessibility Suite</span>
        </div>
      </div>
    </div>
`;
// Ensure Tailwind CSS is available for the redesigned panel.
function ensureTailwindCSSLoaded() {
    if (typeof window !== 'undefined' && (window.tailwind || document.getElementById('stiac-accessibility-tailwind'))) {
        return;
    }

    const existingTailwindAsset = document.querySelector('script[src*="tailwindcss.com"]') || document.querySelector('link[href*="tailwind"]');
    if (existingTailwindAsset || !document.head) {
        return;
    }

    if (document.documentElement && !document.documentElement.hasAttribute('data-acc-tailwind-fallback')) {
        document.documentElement.setAttribute('data-acc-tailwind-fallback', 'true');
    }

    const tailwindScript = document.createElement('script');
    tailwindScript.id = 'stiac-accessibility-tailwind';
    tailwindScript.src = 'https://cdn.tailwindcss.com?plugins=forms,typography';
    tailwindScript.defer = true;
    tailwindScript.setAttribute('data-owner', 'stiac-accessibility');
    document.head.appendChild(tailwindScript);
}

document.addEventListener("DOMContentLoaded", function() {

    ensureTailwindCSSLoaded();

    const accessibilityMenuStyleElement = document.createElement("style");
    accessibilityMenuStyleElement.innerHTML = accessibilityMenuStyles;
    document.head.appendChild(accessibilityMenuStyleElement);

    document.body.insertAdjacentHTML("beforeend", accessibilityMenuHTML);

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
    const accessibilityTools = document.getElementById('accessibility-tools');

    accessibilityModal.classList.add('stiac-sws-protected');
    accessibilityModal.setAttribute('data-stiac-owner', 'Stiac Web Services');

    // Trigger the refined reveal transition once the modal has been added to the DOM.
    requestAnimationFrame(() => {
        accessibilityModal.classList.add('is-ready');
    });

    console.info('Stiac Web Services Accessibility Suite - Software proprietario, uso non autorizzato vietato.');

    closeBtn.addEventListener('click', () => {
        accessibilityModalOpenCloseToggle();
    });

    function accessibilityModalOpenCloseToggle() {
        accessibilityModal.classList.toggle('close');
        closeBtn.innerHTML = accessibilityModal.classList.contains('close') ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-universal-access-circle" viewBox="0 0 16 16">\n' +
            '  <path d="M8 4.143A1.071 1.071 0 1 0 8 2a1.071 1.071 0 0 0 0 2.143m-4.668 1.47 3.24.316v2.5l-.323 4.585A.383.383 0 0 0 7 13.14l.826-4.017c.045-.18.301-.18.346 0L9 13.139a.383.383 0 0 0 .752-.125L9.43 8.43v-2.5l3.239-.316a.38.38 0 0 0-.047-.756H3.379a.38.38 0 0 0-.047.756Z"/>\n' +
            '  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8"/>\n' +
            '</svg>' : accessibilityModal.classList.contains('top') ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">\n' +
            '  <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>\n' +
            '</svg>' : accessibilityModal.classList.contains('bottom') ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">\n' +
            '  <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>\n' +
            '</svg>' : accessibilityModal.classList.contains('left') ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">\n' +
            '  <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>\n' +
            '</svg>' : accessibilityModal.classList.contains('right') ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">\n' +
            '  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>\n' +
            '</svg>' : '';
    }

    const accItems = document.querySelectorAll('.acc-item');

    accItems.forEach(item => {
        const trigger = item.querySelector('.acc-child');
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
        accessibilityModal.style.setProperty('--acc-modal-font-size', formatPixels(modalFontMetrics.base));
        accessibilityModal.style.setProperty('--acc-modal-text-xs', formatPixels(modalFontMetrics.textXs));
        accessibilityModal.style.setProperty('--acc-modal-text-sm', formatPixels(modalFontMetrics.textSm));
        accessibilityModal.style.setProperty('--acc-modal-text-lg', formatPixels(modalFontMetrics.textLg));
        accessibilityModal.style.setProperty('--acc-modal-text-10', formatPixels(modalFontMetrics.text10));
        accessibilityModal.style.setProperty('--acc-modal-text-11', formatPixels(modalFontMetrics.text11));
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
        if (element.closest('[data-acc-preserve-images]')) {
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
                element.dataset.accBgImageInlineValue = inlineValue;
                element.dataset.accBgImageHadInline = 'true';
                if (inlinePriority) {
                    element.dataset.accBgImageInlinePriority = inlinePriority;
                } else {
                    delete element.dataset.accBgImageInlinePriority;
                }
            } else {
                element.dataset.accBgImageHadInline = 'false';
                delete element.dataset.accBgImageInlineValue;
                delete element.dataset.accBgImageInlinePriority;
            }

            element.style.setProperty('background-image', 'none', 'important');
            hideImageBackgroundElements.add(element);
        });
    }

    function resetHideImagesBackgrounds() {
        hideImageBackgroundElements.forEach((element) => {
            if (element.dataset.accBgImageHadInline === 'true') {
                const inlineValue = element.dataset.accBgImageInlineValue || '';
                const inlinePriority = element.dataset.accBgImageInlinePriority || '';
                element.style.setProperty('background-image', inlineValue, inlinePriority);
            } else {
                element.style.removeProperty('background-image');
            }

            delete element.dataset.accBgImageInlineValue;
            delete element.dataset.accBgImageInlinePriority;
            delete element.dataset.accBgImageHadInline;
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
    const textAlignOptionButtons = textAlignControl ? Array.from(textAlignControl.querySelectorAll('[data-text-align-option]')) : [];
    const TEXT_ALIGN_SEQUENCE = ['start', 'center', 'end', 'justify'];
    const textAlignIcons = {
        start: `<path d="M4.5 7C4.22386 7 4 6.77614 4 6.5C4 6.22386 4.22386 6 4.5 6H19.5C19.7761 6 20 6.22386 20 6.5C20 6.77614 19.7761 7 19.5 7H4.5ZM4.5 15C4.22386 15 4 14.7761 4 14.5C4 14.2239 4.22386 14 4.5 14H19.5C19.7761 14 20 14.2239 20 14.5C20 14.7761 19.7761 15 19.5 15H4.5ZM4.5 11C4.22386 11 4 10.7761 4 10.5C4 10.2239 4.22386 10 4.5 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H4.5ZM4.5 19C4.22386 19 4 18.7761 4 18.5C4 18.2239 4.22386 18 4.5 18H13.5C13.7761 18 14 18.2239 14 18.5C14 18.7761 13.7761 19 13.5 19H4.5Z" fill="currentColor"/>`,
        center: `<path d="M4.5 7C4.22386 7 4 6.77614 4 6.5C4 6.22386 4.22386 6 4.5 6H19.5C19.7761 6 20 6.22386 20 6.5C20 6.77614 19.7761 7 19.5 7H4.5ZM4.5 15C4.22386 15 4 14.7761 4 14.5C4 14.2239 4.22386 14 4.5 14H19.5C19.7761 14 20 14.2239 20 14.5C20 14.7761 19.7761 15 19.5 15H4.5ZM7.5 11C7.22386 11 7 10.7761 7 10.5C7 10.2239 7.22386 10 7.5 10H16.5C16.7761 10 17 10.2239 17 10.5C17 10.7761 16.7761 11 16.5 11H7.5ZM7.5 19C7.22386 19 7 18.7761 7 18.5C7 18.2239 7.22386 18 7.5 18H16.5C16.7761 18 17 18.2239 17 18.5C17 18.7761 16.7761 19 16.5 19H7.5Z" fill="currentColor"/>`,
        end: `<path d="M4.5 7C4.22386 7 4 6.77614 4 6.5C4 6.22386 4.22386 6 4.5 6H19.5C19.7761 6 20 6.22386 20 6.5C20 6.77614 19.7761 7 19.5 7H4.5ZM4.5 15C4.22386 15 4 14.7761 4 14.5C4 14.2239 4.22386 14 4.5 14H19.5C19.7761 14 20 14.2239 20 14.5C20 14.7761 19.7761 15 19.5 15H4.5ZM10.5 11C10.2239 11 10 10.7761 10 10.5C10 10.2239 10.2239 10 10.5 10H19.5C19.7761 10 20 10.2239 20 10.5C20 10.7761 19.7761 11 19.5 11H10.5ZM10.5 19C10.2239 19 10 18.7761 10 18.5C10 18.2239 10.2239 18 10.5 18H19.5C19.7761 18 20 18.2239 20 18.5C20 18.7761 19.7761 19 19.5 19H10.5Z" fill="currentColor"/>`,
        justify: `<path d="M4.5 6H19.5C19.7761 6 20 5.77614 20 5.5C20 5.22386 19.7761 5 19.5 5H4.5C4.22386 5 4 5.22386 4 5.5C4 5.77614 4.22386 6 4.5 6ZM4.5 10H19.5C19.7761 10 20 9.77614 20 9.5C20 9.22386 19.7761 9 19.5 9H4.5C4.22386 9 4 9.22386 4 9.5C4 9.77614 4.22386 10 4.5 10ZM4.5 14H19.5C19.7761 14 20 13.7761 20 13.5C20 13.2239 19.7761 13 19.5 13H4.5C4.22386 13 4 13.2239 4 13.5C4 13.7761 4.22386 14 4.5 14ZM4.5 18H19.5C19.7761 18 20 17.7761 20 17.5C20 17.2239 19.7761 17 19.5 17H4.5C4.22386 17 4 17.2239 4 17.5C4 17.7761 4.22386 18 4.5 18Z" fill="currentColor"/>`
    };
    // Mirror text alignment across `<html>` and `<body>` so the host page responds
    // while keeping compatibility with previously saved settings.
    const getDocumentTextAlign = () => {
        if (bodyElement && bodyElement.style.textAlign) {
            return bodyElement.style.textAlign;
        }
        return docElement.style.textAlign || '';
    };

    const setDocumentTextAlign = (value) => {
        const safeValue = value || '';
        if (bodyElement) {
            bodyElement.style.textAlign = safeValue;
        }
        docElement.style.textAlign = safeValue;
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

    const describeTextAlignValue = (value) => {
        switch (value) {
            case 'start':
                return 'the start edge';
            case 'center':
                return 'the center';
            case 'end':
                return 'the end edge';
            case 'justify':
                return 'full justification';
            default:
                return 'the site default alignment';
        }
    };

    const getDocumentTextAlign = () => {
        if (docElement.dataset && docElement.dataset.accTextAlignValue) {
            const datasetValue = normaliseTextAlignValue(docElement.dataset.accTextAlignValue);
            if (datasetValue) {
                return datasetValue;
            }
        }
        const attributeValue = normaliseTextAlignValue(docElement.getAttribute('data-acc-text-align'));
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
            docElement.setAttribute('data-acc-text-align', safeValue);
            docElement.dataset.accTextAlignValue = safeValue;
        } else {
            docElement.removeAttribute('data-acc-text-align');
            if (docElement.dataset) {
                delete docElement.dataset.accTextAlignValue;
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

        textAlignOptionButtons.forEach((button) => {
            const optionValue = normaliseTextAlignValue(button.getAttribute('data-text-align-option'));
            const isActive = currentValue === optionValue && Boolean(optionValue);
            button.setAttribute('aria-pressed', String(isActive));
        });

        if (textAlignStatusElement) {
            if (announce) {
                const description = describeTextAlignValue(currentValue);
                textAlignStatusElement.textContent = currentValue
                    ? `Text alignment set to ${description}.`
                    : 'Text alignment restored to the site default.';
            } else {
                textAlignStatusElement.textContent = '';
            }
        }
    }

    const STORAGE_KEY = 'accessibility-settings';

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
        element.querySelectorAll('path').forEach(icon => {
            icon.style.fill = isActive ? 'var(--acc_color_2)' : 'var(--acc_color_1)';
        });
    }

    function updateProgress(element, activeIndex) {
        if (!element) {
            return;
        }
        const progressParent = element.querySelector('.acc-progress-parent');
        if (!progressParent) {
            return;
        }
        if (activeIndex < 0) {
            progressParent.classList.add('hidden');
        } else {
            progressParent.classList.remove('hidden');
        }
        progressParent.querySelectorAll('.acc-progress-child').forEach((child, index) => {
            child.classList.toggle('active', index === activeIndex);
        });
    }


    const alignAccLeft = document.getElementById('align-acc-left');
    const alignAccTop = document.getElementById('align-acc-top');
    const alignAccBottom = document.getElementById('align-acc-bottom');
    const alignAccRight = document.getElementById('align-acc-right');

    positionActiveStatus();

    alignAccLeft.addEventListener('click', () => {
        accessibilityModalOpenCloseToggle()
        accessibilityModal.classList.remove('top');
        accessibilityModal.classList.remove('bottom');
        accessibilityModal.classList.remove('right');
        accessibilityModal.classList.add('left');
        positionActiveStatus();
        saveSettings();
    });

    alignAccTop.addEventListener('click', () => {
        accessibilityModalOpenCloseToggle()
        accessibilityModal.classList.remove('left');
        accessibilityModal.classList.remove('bottom');
        accessibilityModal.classList.remove('right');
        accessibilityModal.classList.add('top');
        positionActiveStatus();
        saveSettings();
    });

    alignAccBottom.addEventListener('click', () => {
        accessibilityModalOpenCloseToggle()
        accessibilityModal.classList.remove('left');
        accessibilityModal.classList.remove('top');
        accessibilityModal.classList.remove('right');
        accessibilityModal.classList.add('bottom');
        positionActiveStatus();
        saveSettings();
    });

    alignAccRight.addEventListener('click', () => {
        accessibilityModalOpenCloseToggle()
        accessibilityModal.classList.remove('left');
        accessibilityModal.classList.remove('top');
        accessibilityModal.classList.remove('bottom');
        accessibilityModal.classList.add('right');
        positionActiveStatus();
        saveSettings();
    });

    function positionActiveStatus() {
        if (accessibilityModal.classList.contains('left')) {
            alignAccLeft.classList.add('active');
            alignAccTop.classList.remove('active');
            alignAccBottom.classList.remove('active');
            alignAccRight.classList.remove('active');
        } else if (accessibilityModal.classList.contains('top')) {
            alignAccTop.classList.add('active');
            alignAccLeft.classList.remove('active');
            alignAccBottom.classList.remove('active');
            alignAccRight.classList.remove('active');
        } else if (accessibilityModal.classList.contains('bottom')) {
            alignAccBottom.classList.add('active');
            alignAccTop.classList.remove('active');
            alignAccLeft.classList.remove('active');
            alignAccRight.classList.remove('active');
        } else if (accessibilityModal.classList.contains('right')) {
            alignAccRight.classList.add('active');
            alignAccTop.classList.remove('active');
            alignAccBottom.classList.remove('active');
            alignAccLeft.classList.remove('active');
        }
    }

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
            docElement.dataset.accFontSizeValue = fontSizeValue;
            docElement.dataset.accFontScale = String(fontScale);
            applyFontScaleToRegisteredElements(fontScale);
        } else {
            applyFontScaleToRegisteredElements(null);
            activeFontScale = 1;
            delete docElement.dataset.accFontSizeValue;
            delete docElement.dataset.accFontScale;
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

    if (textAlignControl && textAlignOptionButtons.length > 0) {
        const optionCount = textAlignOptionButtons.length;
        const focusOptionAt = (index) => {
            if (!textAlignOptionButtons[index]) {
                return;
            }
            textAlignOptionButtons[index].focus();
        };

        const handleTextAlignSelection = (targetValue) => {
            const safeTarget = normaliseTextAlignValue(targetValue);
            const currentValue = getDocumentTextAlign();
            const nextValue = currentValue === safeTarget ? '' : safeTarget;
            setDocumentTextAlign(nextValue);
            syncTextAlignUI({ announce: true });
            saveSettings();
        };

        textAlignOptionButtons.forEach((button, index) => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                handleTextAlignSelection(button.getAttribute('data-text-align-option'));
            });

            button.addEventListener('keydown', (event) => {
                const { key } = event;
                if (key === 'ArrowRight' || key === 'ArrowDown') {
                    event.preventDefault();
                    const nextIndex = (index + 1) % optionCount;
                    focusOptionAt(nextIndex);
                } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
                    event.preventDefault();
                    const previousIndex = (index - 1 + optionCount) % optionCount;
                    focusOptionAt(previousIndex);
                } else if (key === 'Home') {
                    event.preventDefault();
                    focusOptionAt(0);
                } else if (key === 'End') {
                    event.preventDefault();
                    focusOptionAt(optionCount - 1);
                } else if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
                    event.preventDefault();
                    button.click();
                }
            });
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
        setHideImagesActive(false);
        docElement.classList.remove('hide-video');

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
            version: 2,
            filters: {
                invert: filterState.invert,
                grayscale: filterState.grayscale,
                saturation: filterState.saturation,
                contrast: filterState.contrast
            },
            underline: docElement.classList.contains('underline-style-2') ? 'style-2' : docElement.classList.contains('underline-style-1') ? 'style-1' : docElement.classList.contains('underline-style-0') ? 'style-0' : 'default',
            fontSize: docElement.dataset.accFontSizeValue || '',
            lineHeight: docElement.classList.contains('line-height-2') ? 'line-height-2' : docElement.classList.contains('line-height-1') ? 'line-height-1' : docElement.classList.contains('line-height-0') ? 'line-height-0' : 'default',
            letterSpacing: docElement.style.letterSpacing || '',
            textAlign: getDocumentTextAlign(),
            hideImages: docElement.classList.contains('hide-images'),
            hideVideo: docElement.classList.contains('hide-video'),
            cursor: cursor.classList.contains('cursor-2') ? 'guide' : cursor.classList.contains('cursor-1') ? 'mask' : cursor.classList.contains('cursor-0') ? 'focus' : 'default',
            position: accessibilityModal.classList.contains('left') ? 'left' : accessibilityModal.classList.contains('top') ? 'top' : accessibilityModal.classList.contains('bottom') ? 'bottom' : 'right'
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
            version: 2,
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
            hideImages: Boolean(legacy.hideImages),
            hideVideo: Boolean(legacy.hideVideo),
            cursor: legacy.cursor2 ? 'guide' : legacy.cursor1 ? 'mask' : legacy.cursor0 ? 'focus' : 'default',
            position: legacy.accPosition || 'right'
        };
    }

    function applySavedSettings(settings) {
        if (!settings) {
            return;
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
        setHideImagesActive(Boolean(settings.hideImages));
        docElement.classList.toggle('hide-video', Boolean(settings.hideVideo));

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

        accessibilityModal.classList.remove('left', 'top', 'bottom', 'right');
        accessibilityModal.classList.add(settings.position || 'right');
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
        const storedFontSizeValue = docElement.dataset.accFontSizeValue || '';
        const storedFontScale = parseFloat(docElement.dataset.accFontScale || '');
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

        positionActiveStatus();
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
    }

    syncControls();

    accItems.forEach(item => {
        item.querySelectorAll('path').forEach(icon => {
            icon.style.fill = item.querySelector('.acc-child').classList.contains('active') ? 'var(--acc_color_2)' : 'var(--acc_color_1)';
        });
    });

});
