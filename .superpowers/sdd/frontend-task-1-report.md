# Frontend Task 1 Report — Next.js Scaffold

## Versions Installed

| Package       | Version   |
|---------------|-----------|
| Next.js       | 16.2.9    |
| React         | 19.2.4    |
| react-dom     | 19.2.4    |
| Tailwind CSS  | ^4 (v4)   |
| shadcn/ui CLI | 4.11.0    |
| better-auth   | ^1.6.20   |

## Files in `src/components/ui/`

```
alert-dialog.tsx
badge.tsx
button.tsx
card.tsx
dialog.tsx
input.tsx
label.tsx
select.tsx
sonner.tsx
textarea.tsx
```

All 10 components requested were created successfully.

## HTTP Status Code from Verification

- Port 3000 was already in use by another process (the backend or another service).
- Next.js dev server automatically switched to **port 3001**.
- HTTP status from `curl http://localhost:3001`: **200**

## Steps Executed

1. **Create Next.js project**: Ran `create-next-app@latest` with flags `--typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --no-turbopack --yes`. Succeeded. Removed `.git` directory afterwards.

2. **Initialize shadcn/ui**: Ran `npx shadcn@latest init -d`. Detected Next.js + Tailwind v4 automatically. Created `components.json`, `src/components/ui/button.tsx`, and `src/lib/utils.ts`.

3. **Add shadcn components**: Ran `npx shadcn@latest add button input card dialog alert-dialog select badge label sonner textarea --overwrite --yes`. Created 9 new files; `button.tsx` was skipped (already existed, flagged as possibly identical).

4. **Install better-auth**: Ran `npm install better-auth`. Installed version 1.6.20 with 20 additional packages.

5. **Create `.env.local`**: Written with content `NEXT_PUBLIC_API_URL=http://localhost:3333`.

6. **Verification**: Dev server started on port 3001 (port 3000 was occupied). HTTP 200 confirmed. Dev server killed after verification.

## Issues Encountered

- **RTK proxy intercepting `npx`**: The RTK (Rust Token Killer) hook was intercepting bare `npx` calls and failing with `ENOENT` on `package.json`. Resolved by using the full binary path `/home/jpexati/.nvm/versions/node/v22.23.1/bin/npx` for all `npx` commands.
- **Port 3000 occupied**: Another process was already listening on port 3000. Next.js dev server automatically moved to port 3001. HTTP 200 confirmed on port 3001. This is expected in the dev environment; the frontend target port remains 3000 in production/clean startup.
- **Turbopack warning**: Despite `--no-turbopack` flag, the dev server reported using Turbopack (likely a Next.js 16 behavior change). This is cosmetic and does not affect functionality.
- **Workspace root warning**: Next.js detected multiple `package-lock.json` files in the monorepo. Cosmetic only; no impact on build.
