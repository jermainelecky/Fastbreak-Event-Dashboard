# Fastbreak Event Dashboard

Sports Event Management Application - Interview Dev Challenge

To see the phased approach taken to set this up, view the [PHASED_IMPLEMENTATION.md](./PHASED_IMPLEMENTAITON.md).

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier works fine)
- Google Cloud (optional) (free tier)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase and Google OAuth Client

Follow the instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
- Create a Supabase project
- Get your API keys
- Set up environment variables
- Create the database schema
- Set up Google OAuth Client (optional)

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  (auth)/               # Auth routes (unauthenticated)
    login/
    signup/
  (protected)/          # Routes requiring authentication
    dashboard/
    events/
      create/
      [id]/             # Event detail & edit
  api/
    auth/callback/      # OAuth & email confirmation callback
  layout.tsx
  page.tsx
lib/
  actions/              # Server actions (auth, events, venues)
  types/                # Shared TypeScript types (database, API, errors)
  utils/                # Helpers (auth, cn, toast, protected-route)
    supabase/           # Supabase client (server, client, middleware)
components/
  auth/                 # Login form, signup form
  dashboard/            # Dashboard content
  events/               # Event list, card, form, filters
  ui/                   # Shadcn UI components
hooks/                  # useToast
supabase/
  migrations/           # SQL schema & seed
__tests__/              # Jest tests
```

This structure was chosen to match Next.js App Router, keep server vs client and feature boundaries clear, and make the codebase easy to navigate and safe for server-only code.

- **Route groups** - clear split between unauthenticated and authenticated areas and layouts
- `lib/actions` vs `lib/utils` - server-only vs shared helpers
- `components/` **by feature +** `ui/` - "where does this UI belong?" and "what's generic?"
- `lib/types`, `hooks/`, `supabase/migrations/`, `__tests__/` - one clear place for types, app-wide hooks, DB definition, and tests, following common Next/React/Supabase conventions.
- **No** `src/` **directory** - Next.js works the same with or without `src/`. Keeping `app/`, `lib/`, `components/` at the root keeps paths shorter and matches the default layout.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
