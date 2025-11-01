# Roadmap

## Near Term
- Add automated regression coverage for `syncControls` and persistence helpers.
- Add regression coverage to ensure the segmented Text Align control persists start/center/end/justify selections and announces state changes correctly.
- Provide UI feedback for binary toggles without progress indicators (e.g., grayscale) to reinforce state changes.
- Introduce a lightweight lint/check step to catch syntax errors before publishing script updates.
- Add a smoke test ensuring the modal's baseline font variables keep widget UI elements excluded from global font-size scaling routines.
- Add automated checks that language auto-detection prefers stored/browser/document locales over defaults when initialising.
- Add regression coverage to ensure the embedded OpenDyslexic data URIs load reliably and surface graceful fallbacks if fonts are blocked locally.
- Add automated checks that confirm each locale JSON file exposes all `data-i18n` keys and passes basic plural/interpolation tests.
- Add integration coverage ensuring the locale loader falls back to the host site's `/locales` directory when scripts load from a CDN without CORS headers.
- Add integration coverage to confirm embedded locale fallbacks keep the widget translated when network requests fail or are blocked.

## Mid Term
- Offer configuration API for customizing control order and visibility without editing source.
- Publish refreshed minified bundle aligned with the source refactor.

## Long Term
- Investigate framework-agnostic build tooling to distribute ES module and modern bundler targets.
- Expand accessibility checks (e.g., font contrast analyzer) with optional integrations.
