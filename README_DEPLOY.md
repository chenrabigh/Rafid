# Deploy RAFID (Option 1)

## 1) Backend on Railway

1. Create a Railway project and connect your GitHub repo.
2. Add service with `Node.js` and deployment from repo.
3. Set start command: `npm run api` and root path to repo root.
4. Add environment variables:
   - `DATABASE_URL=file:./dev.db` (for demo) or your production database.
   - `JWT_SECRET=your-secret`
5. Deploy.
6. Confirm health: `https://<railway-url>/api/health` returns JSON.

## 2) Frontend on Vercel

1. Create a Vercel project and connect your repo.
2. Set project root to `client/`.
3. Set build command: `npm install && npm run build`.
4. Set output directory: `dist`.
5. Add environment variable:
   - `VITE_API_BASE_URL=https://<railway-url>/api`
6. Deploy.
7. Your single public app URL is `https://<your-vercel-app>.vercel.app`.

## 3) Test

- Open deployed frontend URL.
- Click Enter Platform.
- Login with seeded user: `buyer@rafid.com` / `password` (or register new).
- Create request/listing and run Smart Matching.

## 4) Quick local run after config

- `npm run api` (backend)
- `npm run dev` (frontend)

---

**Note:** If deploying both as one app later (single host), serve built frontend from backend and use one URL.
