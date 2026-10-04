# Golden Tulip Holland Resort Batu — Interactive Prototype

Responsive hotel profile, room and facility catalogue, 360° tour, GT AI chat, and an interactive hotel CMS prototype.

## Run locally

```bash
npm run dev
```

Open `http://127.0.0.1:4173`.

## Build

```bash
npm run build
```

The production-ready static files are written to `dist/`.

## Gemini demo

Open **CMS Admin → GT AI**, add a Gemini API key, and click **Save for this session**. The key is held in `sessionStorage` for prototype testing and is never included in the repository. A production implementation should proxy Gemini through a server-side Cloudflare Worker secret.

## Prototype storage

CMS text settings and uploaded preview images are stored in the current browser only. This keeps the prototype safe to try without a real hotel database or production authentication.
