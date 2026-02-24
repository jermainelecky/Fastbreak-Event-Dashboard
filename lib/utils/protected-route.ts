/**
 * Utilities for handling protected routes in pages/components
 * Use this in page components or layouts to check authentication
 */

import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";

/**
 * Redirects to login if user is not authenticated
 * Use this at the top of protected page components or layouts
 * 
 * @param redirectTo - Optional redirect path after login (default: current path)
 */
export async function requireAuthOrRedirect(redirectTo?: string) {
  const user = await getCurrentUser();
  if (!user) {
    const loginUrl = `/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`;
    redirect(loginUrl);
  }
  return user;
}

/**
 * Gets the current user or redirects to login
 * Shorthand for requireAuthOrRedirect
 */
export async function getAuthUserOrRedirect() {
  return requireAuthOrRedirect();
}
