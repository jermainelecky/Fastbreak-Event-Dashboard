import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/utils/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | Fastbreak Event Dashboard",
  description: "Sign in to your account",
};

export default async function LoginPage() {
  // Redirect if already logged in
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="sr-only">Sign in</h1>
        <h2 className="text-3xl font-bold">Welcome back</h2>
        <p className="mt-2 text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>
      <LoginForm />
    </div>
  </div>
  );
}
