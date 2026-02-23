# Fastbreak Event Dashboard

Sports Event Management Application - Interview Dev Challenge

## Decisions
- Decided to go with email/password authentication instead of google 0Auth sign in:
  - Simplet setup: no Google Cloud console or 0Auth app
  - Faster to implement: no external service configuration
  - Better for demos: fewer moving parts
  - Still demonstrates authentication implementation
  - Standard approach for most apps
- Since Venues can be used my multiple leagues, venues are shared across all users rather than user-specific.
- For security, only the user who created the event can edit or delete it.
- Type Safety & Error handling:
  - All database operations are typed
  - All actions return `Result<T, AppError>`
  - Database types vs. domain types
  - Types grouped by concern (database, API, errors)

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier works fine)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

Follow the instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
- Create a Supabase project
- Get your API keys
- Set up environment variables
- Create the database schema

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/                    # Next.js App Router pages and layouts
lib/                    # Utility functions and server actions
  actions/              # Server actions for database operations
  utils/                # Helper utilities
    supabase/           # Supabase client configurations
components/             # React components
```

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn (to be installed)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
