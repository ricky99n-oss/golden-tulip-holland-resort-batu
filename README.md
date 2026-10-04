# Golden Tulip Holland Resort Batu

Interactive hotel website prototype with responsive company profile, room and facility catalogue, 360° tour, GT AI chat, and a hotel CMS demo.

- Production: https://golden-tulip-holland-resort-batu.pages.dev
- Repository: https://github.com/ricky99n-oss/golden-tulip-holland-resort-batu
- Local folder: `C:\Users\THINKPAD\Developer\golden-tulip-batu`

## Local development

```bash
npm run dev
```

Open `http://127.0.0.1:4173`.

## Build

```bash
npm run build
```

Production files are written to `dist/`.

## Deploy to Cloudflare Pages

```bash
npm run deploy
```

The deployment targets the existing Cloudflare Pages project `golden-tulip-holland-resort-batu`.

## Gemini prototype

Open **CMS Admin → GT AI**, add a Gemini API key, and click **Save for this session**. The key remains in `sessionStorage` and is never committed. For production, proxy Gemini through a server-side Worker secret.

## Prototype storage

CMS text settings and uploaded preview images are stored in the current browser only. No production hotel database or authentication is included in this prototype.
