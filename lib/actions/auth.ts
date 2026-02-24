/**
 * Authentication server actions
 * All authentication operations happen server-side
 */

"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { withErrorHandling } from "@/lib/utils/actions";
import type { Result } from "@/lib/utils/result";
import type { AppError } from "@/lib/types/errors";
import { ValidationError, AuthenticationError } from "@/lib/types/errors";
import { redirect } from "next/navigation";

/**
 * Sign up with email and password
 */
export async function signUp(
  email: string,
  password: string
): Promise<Result<{ user: { id: string; email: string } }, AppError>> {
  return withErrorHandling(async () => {
    // Validation
    if (!email || !email.includes("@")) {
      throw new ValidationError("Valid email is required", "email");
    }
    if (!password || password.length < 6) {
      throw new ValidationError(
        "Password must be at least 6 characters",
        "password"
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new AuthenticationError(error.message);
    }

    if (!data.user) {
      throw new AuthenticationError("Failed to create user");
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email || email,
      },
    };
  });
}

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<Result<{ user: { id: string; email: string } }, AppError>> {
  return withErrorHandling(async () => {
    // Validation
    if (!email || !email.includes("@")) {
      throw new ValidationError("Valid email is required", "email");
    }
    if (!password) {
      throw new ValidationError("Password is required", "password");
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new AuthenticationError(error.message);
    }

    if (!data.user) {
      throw new AuthenticationError("Failed to sign in");
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email || email,
      },
    };
  });
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<Result<void, AppError>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new AuthenticationError(error.message);
    }
  });
}

/**
 * Sign out and redirect to login page
 * Use this in logout buttons/components
 */
export async function signOutAndRedirect() {
  const result = await signOut();
  if (result.success) {
    redirect("/login");
  }
  // If sign out fails, still redirect (user might already be logged out)
  redirect("/login");
}
