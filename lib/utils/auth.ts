/**
 * Authentication helper utilities
 * Server-side only functions for checking authentication status
 */

import { createClient } from "./supabase/server";
import { AuthenticationError } from "../types/errors";

/**
 * Gets the current authenticated user
 * @returns The user object if authenticated, null otherwise
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Requires authentication - throws if user is not authenticated
 * @returns The authenticated user
 * @throws AuthenticationError if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError("You must be logged in to access this resource");
  }
  return user;
}

/**
 * Checks if the current user is authenticated
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
