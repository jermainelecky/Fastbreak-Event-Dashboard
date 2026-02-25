import * as React from "react";
import { cn } from "@/lib/utils/cn";

const baseClasses =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<string, string> = {
  default: "bg-slate-900 text-white hover:bg-slate-800",
  outline: "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900",
  ghost: "hover:bg-gray-100 hover:text-gray-900",
};

const sizeClasses: Record<string, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  icon: "h-10 w-10",
};

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;

function getButtonClasses(
  variant: ButtonVariant = "default",
  size: ButtonSize = "default"
): string {
  return cn(
    baseClasses,
    variantClasses[variant] ?? variantClasses.default,
    sizeClasses[size] ?? sizeClasses.default
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(getButtonClasses(variant, size), className);
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(getButtonClasses(variant, size), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
