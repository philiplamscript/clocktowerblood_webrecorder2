# Deployment

BOTCT-ClockTracker is a static Vite + React SPA. Build once, host the `dist/` folder on any static file server. There is no backend and no CI workflow in this repo yet — deploy manually until you add one.

## Build

```bash
npm install
npm run build
```

Output: `dist/` (HTML, JS, CSS, and assets from `public/`).

## Local production check

```bash
npm run preview
```

Opens a local server against the production build so you can verify before uploading.

## Environment variables

Optional. Used only by the About popup links. Set them in a local `.env` (gitignored) or in your host’s env UI. Rebuild after changing them — Vite inlines `VITE_*` at build time.

| Variable | Purpose |
| :--- | :--- |
| `VITE_SUPPORT_EMAIL` | Feedback / bug-report mailto in About |
| `VITE_GITHUB_URL` | Source / GitHub link in About |
| `VITE_BUYMEACOFFEE_URL` | Support link in About |

If unset, those About actions simply have empty targets.

Do **not** bake a Gemini API key into `VITE_*` or the static build. Each user pastes their own key in Settings; it is stored only in that browser (`ct_secret_gemini_api_key`) and is excluded from theme/config export.

Example `.env`:

```env
VITE_SUPPORT_EMAIL=you@example.com
VITE_GITHUB_URL=https://github.com/your/repo
VITE_BUYMEACOFFEE_URL=https://buymeacoffee.com/you
```

## Hosting

Serve the contents of `dist/` as a static site. The app has a single route (`/`); no SPA rewrite rules are required for deep links today.

Works with common hosts, for example:

- Netlify / Vercel / Cloudflare Pages — point the publish directory at `dist`, build command `npm run build`
- GitHub Pages — upload or Actions-publish `dist`
- Any CDN or object storage (S3 + CloudFront, etc.) that serves static files

### Base path (subpath hosts)

Vite defaults to `base: '/'` (see `vite.config.ts`). If you host under a subpath (e.g. GitHub project pages at `https://user.github.io/repo-name/`), set:

```ts
// vite.config.ts
export default defineConfig({
  base: '/repo-name/',
  // ...
})
```

Then rebuild. Root-domain hosts do not need this change.

## Client data

Game sessions, themes, and preferences live in the browser’s **localStorage**. Deploying a new build does not migrate or wipe user data on their device. Export/import in Settings is how users move sessions between devices.

## Scripts reference

| Script | Command |
| :--- | :--- |
| Dev server | `npm run dev` |
| Typecheck + production build | `npm run build` |
| Preview production build | `npm run preview` |
| Lint | `npm run lint` |
