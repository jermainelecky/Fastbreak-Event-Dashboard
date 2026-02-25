"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils/cn";

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  spinnerSize?: "sm" | "md" | "lg";
}

export function LoadingOverlay({
  isLoading,
  children,
  className,
  spinnerSize = "md",
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50 rounded-md">
          <LoadingSpinner size={spinnerSize} />
        </div>
      )}
    </div>
  );
}
