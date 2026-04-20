# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**三角洲租号平台** (Delta Game Account Rental Platform) - A gaming account rental/sales platform with a public-facing marketing site and an admin backend.

## Tech Stack

- React 19 + TypeScript
- Vite 7 (build tool)
- Tailwind CSS v3.4 with shadcn/ui component library
- React Router v7 (HashRouter for SPA routing)
- GSAP + ScrollTrigger (animations)
- React Hook Form + Zod (form validation)
- Recharts (admin dashboard charts)

## Common Commands

```bash
cd app
npm run dev          # Start development server
npm run build        # Production build to dist/
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Architecture

### Public Frontend (Landing Site)
- Entry: `app/src/main.tsx` → `App.tsx`
- Sections in `app/src/sections/` (Hero, About, WhyChooseUs, CTA, Footer, etc.)
- Pages: `RentPage` (`/rent`), `SellPage` (`/sell`)

### Admin Backend
- Located in `app/src/pages/admin/`
- Routes protected by secret path in `src/config/admin.ts` (`ADMIN_PATH`, default `/x9k7m3p2`)
- Admin pages: Dashboard, RentAccounts, SellAccounts, Users, Settings
- Auth handled by `AuthGuard` component + localStorage JWT pattern

### Routing
- Uses `HashRouter` (important: all routes are hash-based, e.g., `/#/rent`, `/#/x9k7m3p2/dashboard`)
- Admin route prefix comes from `ADMIN_CONFIG.ADMIN_PATH`

### Component Library
- shadcn/ui components in `app/src/components/ui/`
- Import pattern: `import { Button } from '@/components/ui/button'`
- Primary color: `#d0ff59` (lime green)

## Key Files

| File | Purpose |
|------|---------|
| `app/src/config/admin.ts` | Admin path, credentials, JWT config, auth helpers |
| `app/src/App.tsx` | Route definitions, GSAP plugin registration |
| `app/src/components/Watermark.tsx` | Watermark overlay for public pages |
| `app/src/pages/admin/AdminLayout.tsx` | Admin shell with sidebar + `AuthGuard` |

## Build Output

- Production build outputs to `dist/`
- `vite.config.ts` sets `base: './'` for relative asset paths
