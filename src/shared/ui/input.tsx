import React from "react";
import { cn } from "@/shared/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, Props>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl px-4 text-sm bg-[rgb(var(--surface))] text-[rgb(var(--text))] " +
          "border border-[rgb(var(--border))] placeholder:text-[rgb(var(--muted))] " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] " +
          "disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
