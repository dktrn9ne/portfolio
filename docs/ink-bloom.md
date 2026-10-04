# Hero ink bloom

An original Canvas2D top-edge orange wash inspired by the public visual preview
at https://annnimate.com/animations/ink-bloom. No paid component source was used.

The effect reads the existing `--accent` token (#ff5a1f), paints a cached
multiscale noise field, and fades into the existing ink background. Only a small
area around a nearby mouse or pen reacts. A fast damped spring drives the edge;
a slower spring drives the lower plume, forming a diagonal trail during lateral
movement and a small settling swing on release. Local noise displacement adds
flow within that plume while the rest continues to drift slowly.

The enhanced decorative layer is fixed at the viewport top and is 380px
high on desktop, 320px on tablet, and 270px on mobile, independently of the
full-page `main#top`. It sits below content,
never receives pointer events, and has no accessible name or focus target.
The portrait keeps its cutout, dither, color lens, toggle, and caption. Its empty
background is transparent so the shallow wash can extend behind the top edge.
The enhanced header is translucent only within 24px of the page top; scrolling
restores its existing dark background. Failed or unavailable enhancement leaves
the standard dark header. The shared layer avoids the former hard occlusion at
the header boundary and gives the organic plume visible depth below navigation.

Scrolling retracts both the ink depth and opacity within that stationary canvas,
fully retracting at 260px and stopping its animation until the page returns.
The unenhanced CSS fallback remains anchored to the document top.

The canvas is capped at 420x120 pixels, with a cached noise texture and up to25
frames/second for a fine pointer or 10 for a coarse pointer. There are no touch
handlers and no new runtime dependencies. Painting pauses when the layer is
offscreen or the document is hidden. Listeners/observer are cleaned up on page
exit and suspended/restored for the browser back-forward cache.

Reduced motion draws one static frame and ignores cursor motion. JavaScript or
Canvas unavailability leaves the CSS gradient wash, readable text, working links,
and accessible original portrait. The existing reduced-motion ticker behavior
is preserved. This visual enhancement makes no product or performance claims.

The motion correction was informed by hands-on interaction with the public
reference in desktop Chrome using working NVIDIA WebGL2, including idle drift,
close attraction, lateral trailing, release/settling and fixed-canvas scroll
retraction. The original Canvas2D rendering is an approximation of the observed
behavior, not a copy of the reference shader or a claim of pixel equivalence.

Run `npm test` for math/portrait unit checks, then serve the checkout at port8765
and run `npm run test:browser` for portrait and ink-bloom browser checks.
Chromium screenshots and JSON results are written to `test-results/` in CI.
