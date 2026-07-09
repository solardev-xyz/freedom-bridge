# freedom-bridge

The wallet bridge page for [Freedom browser](https://github.com/solardev-xyz/freedom-browser)'s
phone signing.

Freedom desktop shows a dual-purpose QR for every remote-signing
request: `https://<bridge-origin>/#openlv://<session>`. Phones running
freedom mobile claim the session natively (via QR scan in the app, the
page's "Open in Freedom app" button, or — once deployed — a universal
link). Every other phone lands here: the page joins the
[openlv](https://github.com/v3xlabs/open-lavatory) session encoded in
the URL fragment and forwards the browser's JSON-RPC signing requests
to whatever wallet opened the page (`window.ethereum` — MetaMask,
Rainbow, Trust, … in-app browsers), behind a strict method allowlist.

Static and self-contained: no backend, no analytics, no external
requests beyond the signaling relay named in the session code
(ciphertext only) and WebRTC. The session secret lives in
`location.hash`, which browsers do not send to any server.

## Files

- `index.html`, `bridge.js` — the page.
- `openlv.esm.js` — vendored bundle of the `@openlv/*` SDK
  (LGPL-3.0-only, [v3xlabs/open-lavatory](https://github.com/v3xlabs/open-lavatory)).
  **Generated — do not edit.** Regenerate from a sibling
  `freedom-browser` checkout with `npm run vendor:openlv`, which syncs
  this repo's copy (and freedom-browser's renderer copy) from one
  build so they can never drift.

## Development

Serve locally from a sibling `freedom-browser` checkout:
`npm run bridge:serve` (port 8797). The remote-signing E2E there
drives this page in Chromium with a fake `window.ethereum` as the
"phone".

## Deployment

Deployed as a Swarm site behind an ENS name (interim origin:
`freedom.florianglatz.eth.limo`; production hostname TBD). Re-upload
all three files whenever any of them changes — freedom desktop's QR
points at this origin (`BRIDGE_ORIGIN` in freedom-browser's
`src/renderer/lib/wallet/remote-session.js`).

Extracted from `freedom-browser` (branch `feature/openlv`, PR #159),
where the page originally lived under `bridge/`.
