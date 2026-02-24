/**
 * Utility functions for showing toast notifications
 * Use these in client components to show success/error messages
 */

import { toast } from "@/hooks/use-toast";

/**
 * Show a success toast notification
 */
export function showSuccessToast(title: string, description?: string) {
  toast({
    title,
    description,
    variant: "default",
  });
}

/**
 * Show an error toast notification
 */
export function showErrorToast(title: string, description?: string) {
  toast({
    title,
    description,
    variant: "destructive",
  });
}

/**
 * Handle a server action result and show appropriate toast
 * Use this in client components after calling server actions
 */
export function handleServerActionResult<T>(
  result: { success: boolean; data?: T; error?: { message: string } },
  options?: {
    successTitle?: string;
    successDescription?: string;
    onSuccess?: (data: T) => void;
    onError?: (error: { message: string }) => void;
  }
) {
  if (result.success && result.data) {
    showSuccessToast(
      options?.successTitle || "Success",
      options?.successDescription
    );
    options?.onSuccess?.(result.data);
  } else if (result.error) {
    showErrorToast("Error", result.error.message);
    options?.onError?.(result.error);
  }
}
