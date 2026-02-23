# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: `fastbreak-event-dashboard` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to you
5. Wait for the project to be created (takes a few minutes)

## 2. Get Your API Keys

1. In your Supabase project dashboard, go to **Project Settings** → **API Keys** → **Legacy anon, service_role API keys** 
   - take not of the **anon public** url 
2.  In your Supabase project dashboard, go to **Project Settings** → **Data API**
   - Take note of the **API URL**


## 3. Set Up Environment Variables

1. Create a `.env.local` file in the root of your project
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values from step 2.

## 4. Database Schema

The database tables will be created in the next step (Phase 1, Step 3). For now, Supabase is ready to use.

## Notes

- The `.env.local` file is already in `.gitignore` - never commit your API keys
- The server-side Supabase client is configured in `lib/utils/supabase/server.ts`
- All database operations will happen server-side through Server Actions
- The middleware is set up to handle session refresh automatically
