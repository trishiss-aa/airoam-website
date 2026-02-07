# Pre-launch checklist – Airoam website

Use this before publishing to ensure optimisation, security, and the best experience for users.

---

## Done in this pass

- **Footer logo path fixed** – `index.html` footer used `images/` (lowercase); corrected to `Images/` so the logo loads on case-sensitive servers (e.g. Linux).
- **Lazy loading** – `loading="lazy"` added to the four blog card images in the “Latest posts” section on `index.html` (below-the-fold).
- **robots.txt** – Added at site root. Allows all crawlers and points to `sitemap.xml`.
- **sitemap.xml** – Added with homepage, blog listing, and all blog posts. Submit this in Google Search Console after launch.
- **404.html** – Custom “Page not found” page at site root. Cloudflare Pages will use it automatically for 404s.

---

## Before you go live

### 1. Social sharing images (OG / Twitter)

- **Current:** `index.html` and `blog.html` reference `https://airoam.com.au/images/og-image.jpg` and `blog-og.jpg`, which do not exist in your `Images/` folder.
- **Action:** Create and upload:
  - **og-image.jpg** – 1200×630px, represents the brand/homepage. Save to `Images/` and ensure your live URLs use the correct path (e.g. `https://airoam.com.au/Images/og-image.jpg` if that’s how the server serves it).
  - **blog-og.jpg** – Same dimensions for the blog listing. Update `blog.html` OG meta to point to the real path (e.g. `Images/blog-og.jpg` or full URL).
- **Optional:** Set `og:image:width` and `og:image:height` (1200 and 630) for more reliable previews.

### 2. Schema logo

- **Current:** Organisation schema uses `https://airoam.com.au/images/logo.png`, which is not in the repo.
- **Action:** Either add `Images/logo.png` (e.g. square logo, 512×512 or similar) and change schema to `https://airoam.com.au/Images/logo.png`, or point schema to an existing asset (e.g. `Images/airoam-logo-black.svg`) if your preferred tool supports SVG.

### 3. HTTPS (Cloudflare)

- **Action:** In Cloudflare dashboard: **SSL/TLS** → **Edge Certificates** → turn **Always Use HTTPS** on. Set SSL mode to **Full** or **Full (strict)**.
- **404 page:** A custom `404.html` is included at the root. On **Cloudflare Pages** it is used automatically for 404 responses; no extra config needed.

### 5. Hosting with Cloudflare

- **Cloudflare Pages (recommended):** Connect your repo (GitHub/GitLab) to Cloudflare Pages. Build command: leave empty (static site). Build output: `/` (root). Cloudflare will serve your files and use `404.html` automatically.
- **HTTPS:** Cloudflare provides free SSL. In the dashboard: **SSL/TLS** → **Overview** → set to **Full** or **Full (strict)** if your origin has a certificate. Enable **Always Use HTTPS** under **SSL/TLS** → **Edge Certificates**.
- **Redirects (optional):** To force `www` → root (or root → `www`), use **Rules** → **Redirect Rules** (or **Page Rules** on older plans). Example: If canonical is `https://airoam.com.au`, redirect `https://www.airoam.com.au/*` to `https://airoam.com.au/$1`.
- **Caching:** Static assets are cached at the edge by default. For longer cache on images/CSS/JS, use **Caching** → **Configuration** → **Browser Cache TTL** or **Cache Rules**.
- **Custom domain:** In your Cloudflare Pages project, add **Custom domains** → `airoam.com.au` (and `www` if you use it). Cloudflare will prompt you to add the required DNS records at your registrar.

### 6. Forms (Formspree)

- **Current:** Contact and subscribe forms post to Formspree. No API keys are exposed in the front end.
- **Action:** In Formspree, turn on reCAPTCHA or similar if you want to reduce spam. Confirm email notifications and any redirect/thank-you URLs.

### 7. Performance (optional)

- **Images:** Compress JPGs/PNGs (e.g. TinyPNG, ImageOptim) before or after upload to keep file sizes small.
- **Fonts:** You already use `preconnect` for Google Fonts; consider `font-display: swap` in the font URL if not already (e.g. `&display=swap` in the stylesheet link).
- **Caching:** On the server, set cache headers for static assets (e.g. 1 year for images with a versioned or hashed filename if you change them often).

### 8. After launch

- **Google Search Console** – Add the property, confirm ownership, submit `sitemap.xml` (e.g. `https://airoam.com.au/sitemap.xml`).
- **Analytics** – If you use Google Analytics (or similar), add the script and confirm it fires on the main template(s).
- **Test on real devices** – Quick pass on mobile and desktop for nav, forms, blog infinite scroll, and key links.

---

## Quick reference

| Item                         | Status / action                                      |
|-----------------------------|------------------------------------------------------|
| Footer logo path            | Fixed (`Images/`)                                    |
| Lazy loading (blog cards)   | Added on index                                       |
| robots.txt                  | Added                                                |
| sitemap.xml                 | Added                                                |
| OG / Twitter images         | Add og-image.jpg and blog-og.jpg; fix meta URLs      |
| Schema logo                 | Add logo.png or point to existing asset              |
| HTTPS                       | Enable and enforce on hosting                        |
| 404 page                    | Done (`404.html` at root; auto-used on Cloudflare Pages) |
| Cloudflare HTTPS / SSL      | Enable Always Use HTTPS in dashboard                 |
| Formspree spam protection   | Optional: enable in Formspree                        |
| Search Console + sitemap    | After launch                                         |

Once the OG images and schema logo are in place and HTTPS is enforced, the site is in good shape for a confident launch.
