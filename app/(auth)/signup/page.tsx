import { Metadata } from "next";
import { SignUpForm } from "@/components/auth/signup-form";
import { getCurrentUser } from "@/lib/utils/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up | Fastbreak Event Dashboard",
  description: "Create a new account",
};

export default async function SignUpPage() {
  // Redirect if already logged in
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="mt-2 text-gray-500">
            Sign up to start managing your sports events
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
