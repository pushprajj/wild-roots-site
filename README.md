# Wild Roots International LLP — Website

Production marketing site for **Wild Roots International LLP**, built from the design
handoff in `references/Wildroots International redesign (2).zip` (the recommended
"Dark-Nav-Polished" home variant) plus the company profile and product list documents.

## Structure

```
site/               ← the deployable web root (pure static HTML/CSS/JS, no build step)
  index.html        Home (hero, marquee, stats, portfolio rail, value chain, FAQ, enquiry)
  products.html     Product catalogue with live search + category filter (16 cards)
  about.html        Company story, commitments, journey, pull quote
  credentials.html  Statutory registrations (REDACTED PDFs in assets/docs/ — regenerate with
                    tools/redact_docs.py from references/registration; never copy originals here)
  contact.html      Contact details + enquiry form
  404.html          Not-found page (uses absolute paths — configure your host to serve it)
  robots.txt        + sitemap.xml (both reference https://wildrootsint.in — update if the domain differs)
  css/styles.css    Full design system (tokens, typography, animations, responsive rules)
  js/main.js        FAQ accordion + enquiry form handling
  js/chat.js        tawk.to live-chat loader (property/widget IDs at the top)
  js/products.js    Product catalogue data + search/filter
  assets/           Logo SVGs (assets/logo/, from references/WILD ROOTS LOGO.pdf), favicon, photography
references/         Client-supplied source material (not deployed)
```

## Current deployment

Live at **https://wr.corpmos.com** — served by this box's nginx from `/var/www/wr-corpmos-com`
(config: `/etc/nginx/sites-available/wr-corpmos-com`, TLS via certbot/Let's Encrypt, auto-renewing).

To publish changes after editing `site/`, run `./deploy.sh` — it copies the site into
place and stamps `?v=<timestamp>` onto the CSS/JS references so browser caches
(nginx serves assets with a 7-day cache) are busted on every deploy.

When moving to the final domain, update `site/robots.txt` and `site/sitemap.xml`
(they currently reference wr.corpmos.com).

## Hosting

Run `./build_zip.sh` to produce `dist/wild-roots-site-<date>.zip` — the web-root contents of
`site/` with cache-busting asset versions stamped in. Unzip it into the host's web root
(`public_html` on cPanel) so `index.html` sits at the top level. The enquiry form posts to the
relay at `https://wr.corpmos.com/api/enquiry` (CORS-enabled), so it keeps working from any
domain as long as this box stays up; if the relay is unreachable it falls back to a mailto link.

The site is fully static — upload the **contents of `site/`** to any host:

- **Netlify / Vercel / Cloudflare Pages**: drag-and-drop the `site` folder, or point the
  project at this repo with `site` as the publish directory. 404 handling works out of the box.
- **GitHub Pages**: publish the `site` folder (e.g. via an action or a `gh-pages` branch).
- **cPanel / shared hosting / S3**: copy the contents of `site/` into the web root
  (`public_html`). For Apache, map the error page with `ErrorDocument 404 /404.html`.

No build step, no dependencies. Google Fonts is the only external request.

## Before go-live checklist

1. **Enquiry form** posts to `/api/enquiry`, a small Node relay on this box
   (`/opt/wr-enquiry/server.js`, systemd service `wr-enquiry`) that emails submissions
   via Postfix to `contact@wildrootsint.in`. Change the destination with the `TO=`
   environment line in `/etc/systemd/system/wr-enquiry.service`. The mailto fallback in
   `site/js/main.js` (`CONTACT_EMAIL`) is used only if the relay is unreachable.
2. **Photography.** `site/assets/img/` holds Pexels-licensed photos (free for commercial use,
   no attribution required; sources listed in `tools/image-sources.md`). Swap any for the
   client's own images keeping the filename.
3. **Confirm the domain** in `site/robots.txt` and `site/sitemap.xml`
   (currently `https://wildrootsint.in`).
4. **Verify contact details** (phones, email, office address) on the Contact page and in
   the Home enquiry section.
5. Keep copy traceable to `references/WRI-profile.docx` and `Our Product List.docx` —
   don't add product varieties, grades or operational claims that aren't in them.

## Design notes

- Design tokens (colors, type scale, motion) live at the top of `css/styles.css` and
  match the handoff exactly: cream `#faf8f2` / ink `#14181d`, tri-color accents
  brand indigo `#271451` · magenta `#d5286f` · brand green `#00963f` (indigo and green
  are taken from the logo; dark sections use a lighter indigo tint), Cormorant Garamond +
  Jost + Libre Franklin.
- All animations respect `prefers-reduced-motion`.
- Accessibility from the handoff is preserved: skip link, focus-visible rings,
  `aria-expanded` on the FAQ, labelled scroll region for the portfolio rail,
  `aria-live` form confirmations, ≥44px touch targets.
