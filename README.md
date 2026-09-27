# otunfikayo.com

Personal site for **Fikayo Otun**. Static HTML/CSS/JS, ready for GitHub Pages.

## Preview locally

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## GitHub Pages setup

1. Repo **Settings → Pages**.
2. Source: **Deploy from a branch**.
3. Branch: `main` (or your default), folder: **/ (root)**.
4. Save. Project site URL:

   `https://ofotun.github.io/otunfikayo.com/`

5. For a custom domain (`otunfikayo.com`), add a `CNAME` file at the repo root with that hostname, set the custom domain in Pages settings, and point DNS at GitHub Pages. Enable **Enforce HTTPS** once the certificate provisions.

`.nojekyll` is present so GitHub Pages serves files as-is (no Jekyll processing).

## Structure

| Path | Purpose |
|------|---------|
| `index.html` | Home |
| `offerings.html` | Architecture / AI / Advisory |
| `author.html` | MbDD book presence |
| `about.html` | About |
| `writing.html` | Writing stub |
| `contact.html` | Contact (Linktree + LinkedIn) |
| `css/styles.css` | Site styles |
| `js/main.js` | Nav + reveal motion |
| `favicon.ico` / `favicon-*.png` / `apple-touch-icon.png` | Brand mark favicons |
| `assets/of-mark.png` | Source OF monogram |

No build step required.

## Links

- Linktree: https://linktr.ee/ofotun
- LinkedIn: https://linkedin.com/in/ofotun
