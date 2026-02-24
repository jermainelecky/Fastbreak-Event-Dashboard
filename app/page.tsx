import { getCurrentUser } from "@/lib/utils/auth";
import { redirect } from "next/navigation";

/**
 * Root page - redirects based on authentication status
 * - If authenticated: redirect to /dashboard
 * - If not authenticated: redirect to /login
 */
export default async function Home() {
  const user = await getCurrentUser();
  
  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
