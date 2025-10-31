# Roadmap

## Near Term
- Add automated regression coverage for `syncControls` and persistence helpers.
- Add regression coverage to ensure the optional Text Align segmented control respects enable/disable configuration while persisting start/center/end/justify selections and polite announcements.
- Provide UI feedback for binary toggles without progress indicators (e.g., grayscale) to reinforce state changes.
- Introduce a lightweight lint/check step to catch syntax errors before publishing script updates.
- Add a smoke test ensuring the modal's baseline font variables keep widget UI elements excluded from global font-size scaling routines.

## Mid Term
- Offer configuration API for customizing control order and visibility without editing source.
- Publish refreshed minified bundle aligned with the source refactor.

## Long Term
- Investigate framework-agnostic build tooling to distribute ES module and modern bundler targets.
- Expand accessibility checks (e.g., font contrast analyzer) with optional integrations.
