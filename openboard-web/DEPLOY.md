# Deploying OpenBoard Website to Cloudflare Pages

This website is built with **Next.js 16 (App Router)** and pre-renders into a static output directory (`out/`) with dynamic OpenGraph images, sitemaps, and RSS/meta feeds ready for Cloudflare Pages global edge CDN.

---

## Method 1: Instant CLI Deployment (via Wrangler)

Wrangler is already installed in `openboard-web`.

### Step 1: Login to Cloudflare
In your terminal, run:
```bash
npx wrangler login
```
*This opens your default browser to authorize your Cloudflare account.*

### Step 2: Deploy
From the root directory:
```bash
npm run deploy:site
```
*Or from inside `openboard-web/`:*
```bash
npm run deploy
```

Wrangler will build all 52 static routes and publish to Cloudflare Pages, giving you a live URL like `https://openboard-web.pages.dev`.

---

## Method 2: Automatic Git CI/CD (Recommended for Production)

Whenever you push to `master`, Cloudflare Pages can automatically rebuild and deploy your site.

### Step-by-step Setup:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. In the left navigation, click **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Select the GitHub repository: `atpaawej/openboard`.
4. Configure the build settings:
   - **Project name**: `openboard-web` (or `openboard`)
   - **Production branch**: `master`
   - **Framework preset**: `None` (or `Next.js (Static HTML Export)`)
   - **Root directory**: `openboard-web`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
5. Under **Environment variables**, add:
   - `NODE_VERSION` = `20`
6. Click **Save and Deploy**.

---

## Custom Domain Setup
In your Cloudflare Pages dashboard:
1. Go to **openboard-web** -> **Custom domains**
2. Click **Set up a custom domain**
3. Enter `openboard.dev` (and `www.openboard.dev`)
4. Cloudflare automatically sets up DNS records, SSL/TLS certificates, and HTTP/3 edge caching.
