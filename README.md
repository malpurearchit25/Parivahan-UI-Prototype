# Parivahan UI Prototype

An independent, responsive transport services frontend built with HTML, CSS, and vanilla JavaScript. Rebuilt from a first-year web development coursework project, with clearer navigation and working demo interactions.

**Student prototype, not an official government service.** No real applications, payments, document uploads, or live record lookups are supported.

## Run locally

No package installation or build step is needed. From this folder:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. You can also open index.html directly; the project uses classic deferred scripts and bundled data rather than a backend.

## Explore

- Four pages: overview, driving licence, vehicle services, and more services.
- Twelve service guides with category filters and text search.
- Native accessible guide dialogs, keyboard dismissal, FAQs, and mobile navigation.
- Sample vehicle and licence lookups with explicit fictional results.
- Scripted local help panel; no AI subscription or API is required.
- Responsive desktop and phone layouts, visible focus states, a skip link, and reduced-motion support.
- No third-party scripts, fonts, analytics, or asset CDN dependencies.

Try the sample buttons on the overview page, or enter DEMO-CAR-001 under Vehicle and DEMO-DL-001 under Driving licence. Other identifiers show an empty-state message. Nothing entered into the lookup is stored or transmitted by the application.

## Structure

```text
index.html                   Overview and sample lookup
 driving-license.html        Driving licence guides
 vehicle-registration.html   Vehicle guides
 other-services.html         Additional service guides
 assets/styles.css           Shared responsive design
 assets/app.js               Search, dialogs, lookup, navigation, help
 assets/data.js              Twelve illustrative service guides
 assets/favicon.svg          Original concept mark
 scripts/check.py            Local link and HTML integrity checks
```

## Checks

```sh
python scripts/check.py
node --check assets/app.js
node --check assets/data.js
```

GitHub Actions runs these checks on each push and pull request. Browser verification is documented in docs/VALIDATION.md.

## Hosting

This is a static site. To use GitHub Pages, choose Settings → Pages → Deploy from a branch → main → root. Hosting must be enabled separately; uploading this repository does not automatically publish a live site. Relative asset and page links also work under a repository subpath.

## Scope and attribution

The original coursework explored a Parivahan-style transport website. This version retains that concept while replacing the interface, styling, scripts, and sample data. The original government logo, video, editor files, artificial visitor counts, and nonfunctional localhost chatbot are not included.

The P-arrow concept mark and road illustration are original SVG/CSS assets created for this version. The external Parivahan link is provided for visitors seeking official services. This project claims no government affiliation or endorsement. Service guides are illustrative, not authoritative requirements; current requirements must be checked with the relevant official service.

There is no backend, account system, application submission, real record verification, or payment integration. The help guide is deterministic, not an AI system. A project-wide license has not been selected.
