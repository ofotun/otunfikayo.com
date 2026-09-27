# otunfikayo.com

Personal site for **Fikayo Otun** — static HTML/CSS/JS, ready for GitHub Pages.

## Preview locally

Open `index.html` in a browser, or serve the repo root:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## GitHub Pages setup

1. Repo **Settings → Pages**.
2. Source: **Deploy from a branch**.
3. Branch: `main` (or your default), folder: **/ (root)**.
4. Save. The project site will be available at:

   `https://ofotun.github.io/otunfikayo.com/`

5. Custom domain: this repo includes a `CNAME` with `otunfikayo.com`. In Pages settings, set the custom domain to `otunfikayo.com` and configure DNS (A/ALIAS or CNAME) at your registrar to point at GitHub Pages. Enable **Enforce HTTPS** once the certificate provisions.

`.nojekyll` is present so GitHub Pages serves files as-is (no Jekyll processing).

## Structure

| Path | Purpose |
|------|---------|
| `index.html` | Home |
| `offerings.html` | Architecture / AI / Advisory |
| `author.html` | MbDD book presence |
| `about.html` | About |
| `writing.html` | Writing stub |
| `contact.html` | Contact (Linktree CTA) |
| `css/styles.css` | Site styles |
| `js/main.js` | Nav + reveal motion |
| `CNAME` | Custom domain |

No build step required.
