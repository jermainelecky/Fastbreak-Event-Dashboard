/**
 * Generic server action wrapper for consistent error handling
 * All server actions should use this wrapper to ensure type safety and error handling
 */

import { Result, ok, err } from "./result";
import { AppError, DatabaseError, AuthenticationError } from "../types/errors";
import type { createClient } from "./supabase/server";

/**
 * Wraps a server action with consistent error handling
 * 
 * @param action - The async function to execute
 * @returns A Result type that's either success with data or failure with error
 * 
 * @example
 * ```typescript
 * export async function getEvents(): Promise<Result<Event[]>> {
 *   return withErrorHandling(async () => {
 *     const supabase = await createClient();
 *     const { data, error } = await supabase.from('events').select('*');
 *     if (error) throw new DatabaseError(error.message, error);
 *     return data;
 *   });
 * }
 * ```
 */
export async function withErrorHandling<T>(
  action: () => Promise<T>
): Promise<Result<T, AppError>> {
  try {
    const data = await action();
    return ok(data);
  } catch (error) {
    // If it's already an AppError, return it
    if (error instanceof AppError) {
      return err(error);
    }

    // If it's a database error from Supabase
    if (error && typeof error === "object" && "message" in error) {
      return err(new DatabaseError(String(error.message), error));
    }

    // Unknown error - wrap it
    return err(
      new DatabaseError(
        error instanceof Error ? error.message : "An unknown error occurred",
        error
      )
    );
  }
}

/**
 * Wraps a server action that requires authentication
 * Checks if user is authenticated before executing the action
 * 
 * @param supabase - The Supabase client instance
 * @param action - The async function to execute (receives user id)
 * @returns A Result type
 */
export async function withAuth<T>(
  supabase: Awaited<ReturnType<typeof createClient>>,
  action: (userId: string) => Promise<T>
): Promise<Result<T, AppError>> {
  return withErrorHandling(async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new AuthenticationError(
        "You must be logged in to perform this action"
      );
    }

    return await action(user.id);
  });
}
