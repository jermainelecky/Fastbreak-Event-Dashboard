import { createClient } from "@/lib/utils/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

/**
 * Auth callback handler
 * Handles OAuth callbacks and email confirmation redirects
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to the specified page or dashboard
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
