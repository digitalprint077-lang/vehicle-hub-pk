# Vehicle Hub PK

Public guides, official Excise/licence portal links, and free vehicle tools for Pakistan.

## Deploy (Cloudflare Pages)

1. Open [Cloudflare Dashboard → Workers & Pages](https://dash.cloudflare.com/) → **Create** → **Pages** → **Connect to Git**
2. Select repo: `digitalprint077-lang/vehicle-hub-pk`
3. Build settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `/`
4. Deploy → attach your custom domain under **Custom domains**

## Growth checklist (priority)

Spend most effort here — not more homepage polish.

1. **Get users**
   - Attach a custom domain and share province + tool pages in WhatsApp / Facebook groups
   - Post one useful tool at a time (EMI, plate codes, verification) with a short how-to
2. **SEO**
   - Google Search Console → add property → submit `sitemap.xml`
   - After custom domain is live, set `origin` in `js/site-config.js` and update `robots.txt` + `sitemap.xml` URLs
   - Keep title/description unique per page (already present on guides/tools)
3. **Useful tools**
   - Ship tools people search for; use feedback to pick the next one
4. **Feedback**
   - Set `feedbackEmail` in `js/site-config.js` (FormSubmit delivers to that inbox)
   - Review Contact → Send feedback reports weekly
5. **Analytics**
   - Cloudflare → Web Analytics → paste token into `js/site-config.js` → `analytics.cloudflareToken`
   - Or set `analytics.ga4Id` (`G-XXXXXXXX`) for Google Analytics 4

## Config files

| File | Purpose |
|------|---------|
| `js/site-config.js` | Site origin, analytics tokens, feedback email |
| `js/ads-config.js` | AdSense client/slots when approved |
| `robots.txt` / `sitemap.xml` | Crawler discovery |

## Related

Staff login / route permits stay in a separate repository:

- https://github.com/digitalprint077-lang/punjab-route-permit
- https://pdtg-transport-punjab.com/admin.html
