/**
 * Middleware utilities for route protection
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./supabase/middleware";

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = ["/login", "/signup"];

/**
 * Check if a path is a public route
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if a path requires authentication
 */
export function requiresAuth(pathname: string): boolean {
  // API routes and static files don't require auth
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return false;
  }

  // Public routes don't require auth
  if (isPublicRoute(pathname)) {
    return false;
  }

  // Root path - redirect to dashboard if authenticated
  if (pathname === "/") {
    return false; // We'll handle redirect in the page
  }

  // All other routes require auth
  return true;
}

/**
 * Enhanced middleware that handles authentication and redirects
 */
export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Update session (refresh if needed)
  const response = await updateSession(request);

  // Check if route requires authentication
  if (!requiresAuth(pathname)) {
    return response;
  }

  // For protected routes, check authentication
  // We'll check this in the middleware by looking at the response
  // If user is not authenticated, they'll be redirected by the page component
  // or we can add a check here if needed

  return response;
}
