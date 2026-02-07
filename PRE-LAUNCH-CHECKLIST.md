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

### 4. Hosting with Cloudflare

- **Cloudflare Pages (recommended):** Connect your repo (GitHub/GitLab) to Cloudflare Pages. Build command: leave empty (static site). Build output: `/` (root). Cloudflare will serve your files and use `404.html` automatically for 404s.
- **HTTPS:** Cloudflare provides free SSL. In the dashboard: **SSL/TLS** → **Overview** → set to **Full** or **Full (strict)** if your origin has a certificate. Enable **Always Use HTTPS** under **SSL/TLS** → **Edge Certificates**.
- **Redirects (optional):** To force `www` → root (or root → `www`), use **Rules** → **Redirect Rules** (or **Page Rules** on older plans). Example: If canonical is `https://airoam.com.au`, redirect `https://www.airoam.com.au/*` to `https://airoam.com.au/$1`.
- **Caching:** Static assets are cached at the edge by default. For longer cache on images/CSS/JS, use **Caching** → **Configuration** → **Browser Cache TTL** or **Cache Rules**.
- **Custom domain:** In your Cloudflare Pages/Workers project, add **Custom domains** → `airoam.com.au` (and `www` if you use it). See **Replacing your existing airoam.com.au site** below.

### 5. Replacing your existing airoam.com.au site

You already have airoam.com.au live elsewhere and want this new site to take over. Your domain stays at the same registrar; only where the domain *points* changes.

**Step 1 – Deploy the new site (no domain yet)**  
- Deploy via Wrangler/Pages so the new site is live on a Cloudflare URL (e.g. `airoam-website.pages.dev` or `*.workers.dev`).  
- Open that URL in a browser and confirm the new site looks correct.

**Step 2 – Where to add the custom domain (Workers)**

1. In the Cloudflare dashboard, go to **Workers & Pages** (left sidebar).
2. On the **Overview** tab you’ll see your project (e.g. **airoam-website**). **Click the project name** to open it (don’t stay on the list view).
3. In the project’s top menu, open **Settings**.
4. In the left sidebar of Settings, find **Domains & Routes**.
5. Click **Add** → **Custom Domain**.
6. Enter `airoam.com.au` (and add `www.airoam.com.au` separately if you use www), then **Add Custom Domain**.

If you don’t see **Domains & Routes**, you may be on the **Overview** of the Workers & Pages list. Click through into the **individual Worker/Pages project** first, then **Settings** → **Domains & Routes**.

**Step 3 – Decide where airoam.com.au DNS is managed**

- **If airoam.com.au is already added as a site in Cloudflare** (you use Cloudflare nameservers for it):  
  - After adding the custom domain in the Worker (step 2 above), Cloudflare will create or update the DNS records so `airoam.com.au` points at this project. Your old host stops getting traffic for that domain once that’s active.  
  - No changes are needed at your registrar; nameservers stay as they are.

- **If airoam.com.au is not on Cloudflare** (DNS is only at your registrar or another host):  
  - In Cloudflare dashboard (not Workers & Pages): **Websites** → **Add a site** → enter `airoam.com.au`.  
  - Cloudflare will show you **two nameservers** (e.g. `xxx.ns.cloudflare.com` and `yyy.ns.cloudflare.com`).  
  - At your **domain provider (registrar)**: replace the current nameservers with these two. Save.  
  - After DNS propagates (often 5–60 minutes), add the custom domain in the Worker as in Step 2 above.  
  - Once that’s active, airoam.com.au will show the new site and the old one will no longer receive traffic for that domain.

**Step 4 – Optional: redirect www to apex (or the other way)**  
- If you want `https://www.airoam.com.au` to redirect to `https://airoam.com.au` (or vice versa), use **Websites** → **airoam.com.au** → **Rules** → **Redirect Rules** in the Cloudflare zone for airoam.com.au.

**What happens to the old site**  
- The old site stays on its current host; you can keep or remove it later.  
- As soon as airoam.com.au points to the new project, all traffic goes to the new site.

---

**Point your existing domain (already in Cloudflare) at the new project**

Because airoam.com.au is already in Cloudflare and used by your old site, you need to *move* the domain from the old setup to the new Worker project.

**Option A – Old site is another Cloudflare project (Pages or Worker)**  
1. Go to **Workers & Pages** → click the **old** project (the one currently serving airoam.com.au).  
2. Open **Settings** → **Domains & Routes**. You should see `airoam.com.au` (and maybe `www.airoam.com.au`).  
3. **Remove** that custom domain (e.g. click the three dots or **Remove** next to it). Confirm. The domain will stop pointing at the old project.  
4. Go back to **Workers & Pages** → click your **new** project (e.g. **airoam-website**).  
5. **Settings** → **Domains & Routes** → **Add** → **Custom Domain** → enter `airoam.com.au` (and add `www.airoam.com.au` if you use it).  
6. Save. Within a minute or two, airoam.com.au will serve the new site.

**Option B – Old site is external (e.g. shared hosting, Wix, Squarespace) and Cloudflare is only DNS**  
1. Go to **Websites** → **airoam.com.au** → **DNS** → **Records**.  
2. Find the record that points the domain to the old host (e.g. a **CNAME** to the old host, or an **A** record). Note it down if you might need to revert.  
3. **Delete** that record (or edit it—you’ll point the domain to the Worker in the next step).  
4. Go to **Workers & Pages** → your **new** project → **Settings** → **Domains & Routes** → **Add** → **Custom Domain** → `airoam.com.au` (and `www.airoam.com.au` if needed).  
5. Cloudflare will create the correct DNS record for the Worker. airoam.com.au will then serve the new site.

You don’t change anything under “Domain management” for the zone itself—you only change which **project** (or which DNS record) the domain points to.

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
