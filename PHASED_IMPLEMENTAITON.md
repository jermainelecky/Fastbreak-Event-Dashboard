# Sports Event Management App

## Implementation Phases

### Phase 1: Project Setup & Foundation

#### 1. Initialize Next.js 15 with TypeScript
- Using npm
- Set up App Router structure
- Configured TypeScript strict mode for catching more bugs at compile time
- Set up Tailwind CSS
- Set up ESLint to enforce consistent styling and to catch issues
- Install and configure Shadcn UI with expected starting components (Button, Card, Form, Input) to create a shared design system from the beginning

#### 2. Supabase Setup
- Created Supabase project
- Set up environment variables
- Configured Supabase clients (server-side + client-side auth)
- Set up authentication providers (Email + Google OAuth)

#### 3. Database Schema Design
```
Tables:
- events (id, name, sport_type, date_time, description, created_by, created_at, updated_at)
- venues (id, name, address, capacity, created_at, updated_at)
- event_venues (event_id, venue_id) - junction table for many-to-many
```

**Decisions made:**
- Venues should be shared across all users.
- Only users who are event owners Should be able to edit/delete events.

---

### Phase 2: Core Infrastructure

#### 4. Type Safety & Error Handling
- Created shared TypeScript types/interfaces to keep app in sync.
- Built generic server action wrapper for consistent error handling
- Defined `Result<T, E>` pattern for type-safe responses

#### 5. Authentication Infrastructure
- Created server actions for login/signup
- Created server actions for logout
- Created middleware for protected routes to refresh the Supabase auth session on each request so cookies stay valid
  - Enforced by calling `requireAuthOrRedirect()` in protected pages/layouts, which redirects to login when there's no user.
- Added Auth helper utilities:
  - `getCurrentUser()`
  - `requireAuth()`
  - `isAuthenticated()`
  - `getAuthUserOrRedirect()`

#### 6. Server Actions Structure
- `lib/actions/events.ts` - CRUD operations
- `lib/actions/venues.ts` - Venue operations
- `lib/actions/auth.ts` - Authentication

---

### Phase 3: UI Components & Pages

#### 7. Core UI Components (Shadcn)
- Created Form components (with react-hook-form integration)
- Created a Toast/notification system that calls `showSuccessToast()` or `handleServerActionResult()` utilities that calls the `toast()` hook, which updates toast state. `Toaster` reads the state and renders each toast using components from `components/ui/toast.tsx`
- Built Loading states
  - Form submit is tracked with `isLoading(useState)`
  - Dashbard refetch is tracked with `isPending(usetransition)`
  - Event delete is tracked with `isDeleting(useState)`
  - `LoadingSpinner` for forms, and `Skeleton` for the event-list are the shared building blocks
- Implemented Search/filter components
  - Search bar can search by name
  - Filer by sport
  - Sort by date, name, or venue
  - Sort in ascending or descending order

#### 8. Authentication Pages
- Built login page that guards the route and redirects if already loggin in
  - `signIn()` server action that was built in earlier phase does the actual sign-in with Supabase then redirects to `/dashboard`
  - Google - OAuth redirects to Google callback and then to `/dashboard`
  - the client handles loading state, toasts, and redirect after success
- Built sign up page for first time users
  - Signup page (server) - if user is already loggin in, it redirects to `/dashboard`. otherwise it renders form
  - SignUpForm (client) - uses Zod `signUpSchema` and `react-hook-form`
  - Email/password - form submits `signUp(email, password)` server action to Supabase signUp and redirects to `/dashboard`
  - Google - Same OAuth flow as login. redirects to Google callback and then to `/dashboard`
  - Client - shows toast and, on success, `router.push("/dashboard")`

#### 9. Dashboard
- Event list display
- Search functionality
- Filter by sport type
- Responsive grid/list toggles
- Navigation to create/edit

#### 10. Event Management Pages
- Create event form with `createEvent(eventData)` server action built from earlier phases
- Edit event form with `updateEvent(event.id, eventData)` server action built from earlier phases
- Delete confirmation with immediate removal from event list display

---

### Phase 4: Polish

#### 11. App Shell & Event Details
- Protected layout with header and logout
- Event details page for a single event

#### 12. Testing & Refinement
- Wrote unit test for all CRUD operations using Jest
- Wrote unit test for all authentication flows using Jest
- I used Jest because it can validate auth and event logic without spinning up the full app
- Polished UI for responsive pages
