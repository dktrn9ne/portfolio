# Hero ink bloom

An original Canvas2D top-edge orange wash inspired by the public visual preview
at https://annnimate.com/animations/ink-bloom. No paid component source was used.

The effect reads the existing `--accent` token (#ff5a1f), paints a cached
multiscale noise field, and fades into the existing ink background. Only a small
area around a nearby mouse or pen deepens; two easing stages give the response
weight while the rest continues to drift slowly.

The dedicated decorative layer reaches 270px into the hero on desktop, 210px
on tablet, and 170px on mobile, plus the height of the header above it,
independently of the full-page `main#top`. It sits below content,
never receives pointer events, and has no accessible name or focus target.
The portrait keeps its cutout, dither, color lens, toggle, and caption. Its empty
background is transparent so the shallow wash can extend behind the top edge.

The canvas is capped at 420x120 pixels, with a cached noise texture and about 15
frames/second for a fine pointer or 10 for a coarse pointer. There are no touch
handlers and no new runtime dependencies. Painting pauses when the layer is
offscreen or the document is hidden. Listeners/observer are cleaned up on page
exit and suspended/restored for the browser back-forward cache.

Reduced motion draws one static frame and ignores cursor motion. JavaScript or
Canvas unavailability leaves the CSS gradient wash, readable text, working links,
and accessible original portrait. The existing reduced-motion ticker behavior
is preserved. This visual enhancement makes no product or performance claims.

Run `npm test` for math/portrait unit checks, then serve the checkout at port8765
and run `npm run test:browser` for portrait and ink-bloom browser checks.
Chromium screenshots and JSON results are written to `test-results/` in CI.
