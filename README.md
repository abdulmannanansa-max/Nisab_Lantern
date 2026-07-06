# Nisab Lantern

Static React MVP for an Islamic daily utility hub. It runs entirely in the browser and is suitable for Cloudflare Pages.

## Tools included

- Prayer times from the Aladhan API
- Qibla compass using geolocation and device orientation
- Hijri and Gregorian date conversion
- Sehri and Iftar countdowns
- Zakat calculator
- Tasbeeh counter saved in `localStorage`
- Seeded city prayer-time URLs under `/prayer-times/:city`
- Original resources articles for Zakat, prayer-time methods, and Ramadan planning
- Policy pages for Privacy, Terms, Disclaimer, About, and Contact

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Deploy the `dist` folder to Cloudflare Pages. The `public/_redirects` file enables deep links such as `/prayer-times/mumbai` to load the static app.

Before applying to Google AdSense:

- Replace the placeholder publisher ID in `public/ads.txt`
- Replace `hello@nisablantern.com` with your real monitored contact email
- Update `public/sitemap.xml`, `public/robots.txt`, and `index.html` if your production domain is not `https://nisablantern.com`
- Keep HTTPS enabled at the host level; `public/_headers` adds HSTS/security headers for Cloudflare Pages
