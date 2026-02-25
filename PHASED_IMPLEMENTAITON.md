# Sports Event Management App

## Implementation Phases

### Phase 1: Project Setup & Foundation

#### 1. Initialize Next.js 15 with TypeScript
- Set up App Router structure
- Configure TypeScript strict mode
- Set up Tailwind CSS
- Install and configure Shadcn UI

#### 2. Supabase Setup
- Create Supabase project
- Set up environment variables
- Configure Supabase client (server-side only)
- Set up authentication providers (Email + Google OAuth)

#### 3. Database Schema Design
```
Tables:
- events (id, name, sport_type, date_time, description, created_by, created_at, updated_at)
- venues (id, name, address, capacity, created_at, updated_at)
- event_venues (event_id, venue_id) - junction table for many-to-many
```

**Questions to decide:**
- Should venues be user-specific or shared across all users?
- Should users be able to edit/delete other users' events, or only their own?

---

### Phase 2: Core Infrastructure

#### 4. Type Safety & Error Handling
- Create shared TypeScript types/interfaces
- Build generic server action wrapper for consistent error handling
- Define Result<T, E> pattern or similar for type-safe responses

#### 5. Authentication Infrastructure
- Server action for login/signup
- Server action for logout
- Middleware for protected routes
- Auth helper utilities

#### 6. Server Actions Structure
- `lib/actions/events.ts` - CRUD operations
- `lib/actions/venues.ts` - Venue operations
- `lib/actions/auth.ts` - Authentication
- Generic action wrapper for error handling

---

### Phase 3: UI Components & Pages

#### 7. Core UI Components (Shadcn)
- Form components (with react-hook-form integration)
- Toast/notification system
- Loading states
- Search/filter components

#### 8. Authentication Pages
- Login page
- Sign up page
- Auth callback handler

#### 9. Dashboard/Home Page
- Event list display
- Search functionality
- Filter by sport type
- Responsive grid/list toggle
- Navigation to create/edit

#### 10. Event Management Pages
- Create event form
- Edit event form
- Delete confirmation

---

### Phase 4: Polish

#### 11. App Shell & Event Details
- Protected layout with header and logout
- Event details page for a single event

#### 12. Testing & Refinement
- Test all CRUD operations
- Test authentication flows
- Polish UI/UX

---

## Key Architectural Decisions

### 1. Database Schema
- **Events table**: Core event information
- **Venues table**: Reusable venue data
- **Event_Venues junction**: Many-to-many relationship
- **Consideration**: Should venues be user-specific or shared?

### 2. Server Actions Pattern
```typescript
// Generic wrapper approach
async function withErrorHandling<T>(
  action: () => Promise<T>
): Promise<Result<T, Error>>
```

### 3. Type Safety Strategy
- Shared types in `types/` directory
- Database types from Supabase CLI (optional but recommended)
- Form validation types with Zod (Shadcn uses this)

### 4. File Structure
```
app/
  (auth)/
    login/
    signup/
  (protected)/
    dashboard/
    events/
      create/
      [id]/
        edit/
  api/
    auth/
      callback/
lib/
  actions/
    events.ts
    venues.ts
    auth.ts
  utils/
    supabase.ts (server client)
    errors.ts
    types.ts
  types/
    index.ts
components/
  ui/ (shadcn components)
  events/
  forms/
```

### 5. Search & Filter Strategy
- Server actions that accept search/filter params
- Refetch from database (not client-side filtering)
- Debounced search input
- URL params for shareable filtered views (optional)

---

## Recommended Implementation Order

1. **Project Initialization** (Next.js, dependencies, Shadcn setup)
2. **Supabase Setup** (project, auth config, database schema)
3. **Type Definitions** (events, venues, user, etc.)
4. **Server Action Infrastructure** (error handling wrapper, Supabase client helper)
5. **Authentication** (auth actions, middleware, login/signup pages)
6. **Database Operations** (event CRUD server actions)
7. **Dashboard UI** (event list, search, filters)
8. **Event Forms** (create/edit with Shadcn Form)
9. **Polish** (loading states, toasts, error handling)

---

## Questions to Consider

1. **Venues**: Should venues be shared across users or user-specific?
2. **Permissions**: Can users edit/delete other users' events, or only their own?
3. **Sport Types**: Hardcoded enum or dynamic from database?
4. **Date/Time**: What's the timezone handling strategy?
5. **Pagination**: Is pagination needed for large event lists?

---

## Notes

- All database interactions must be server-side
- Prefer Server Actions over API Routes
- Use Shadcn Form component with react-hook-form for all forms
- Implement consistent error handling and type safety
- Include meaningful README.md with architecture decisions and trade-offs
