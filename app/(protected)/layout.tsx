import type { ReactNode } from "react";
import Link from "next/link";
import { signOutAndRedirect } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="font-semibold text-lg">
            Fastbreak Event Dashboard
          </Link>
          <form action={signOutAndRedirect}>
            <Button type="submit" variant="outline" size="sm">
              Logout
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

