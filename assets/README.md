# The Black Robe — Book Website



## Files
- `index.html` — all the page content (headlines, blurb, sections)
- `styles.css` — the look (colours, fonts, layout, animations)
- `script.js` — scroll animations, ember particles, count-up stats
- `assets/` — images (cover, hero portrait, village, fire, silhouette)

## ✏️ Add your "Buy" links
Open `index.html` and find the block marked:

```
▼▼▼ EDIT YOUR STORE LINKS HERE ▼▼▼
```

Replace each `href="#"` with the real product URL, e.g.:

```html
<a class="buy-link" href="https://www.amazon.com/dp/XXXXXXXXX" target="_blank" rel="noopener">
```

Delete any store you aren't using; the grid re-flows automatically.

## 👀 Preview locally
From this folder, run:

```
python3 -m http.server 8755
```

Then open <http://localhost:8755> in a browser.

## 🚀 Publish (free options)
This is a plain static site — it works on any host. Easiest free routes:
- **Netlify** or **Vercel** — drag-and-drop this folder onto their dashboard.
- **GitHub Pages** — push the folder to a repo and enable Pages.
- **Cloudflare Pages** — connect a repo or upload directly.

## Swapping images
Replace files in `assets/` keeping the same names, or update the paths in
`index.html` / `styles.css`. Source art lives in `../Image/`.
