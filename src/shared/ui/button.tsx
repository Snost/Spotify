"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";

type Variant = "primary" | "light" | "outline";
type Size = "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  pressDelayMs?: number;
};

const base =
  "inline-flex items-center justify-center font-semibold " +
  "transition-colors duration-[300ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]";

const sizes: Record<Size, string> = {
  md: "h-[50px] w-[214px] rounded-[16px]",
  lg: "h-[60px] w-[370px] rounded-[20px]",
};

export function Button({
  variant = "primary",
  size = "md",
  pressDelayMs = 800,
  className,
  children,
  ...props
}: Props) {
  const [pressed, setPressed] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleDown = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setPressed(true);
  };

  const handleUp = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      setPressed(false);
    }, pressDelayMs);
  };

  // 🎯 ЛОГІКА КОЛЬОРІВ ЯК У FIGMA
  const getStyles = () => {
    if (variant === "primary") {
      return pressed
        ? "bg-[rgb(var(--accent))] text-[rgb(var(--text-dark))]"
        : "bg-[rgb(var(--primary))] text-[rgb(var(--accent))]";
    }

    if (variant === "outline") {
      return pressed
        ? "bg-[rgb(var(--accent))] text-[rgb(var(--text-dark))]"
        : "border border-[rgb(var(--accent))] text-[rgb(var(--accent))]";
    }

    if (variant === "light") {
      return pressed
        ? "bg-[rgb(var(--primary))] text-[rgb(var(--accent))]"
        : "bg-[rgb(var(--accent))] text-[rgb(var(--text-dark))]";
    }

    return "";
  };

  return (
    <button
      className={cn(base, sizes[size], getStyles(), className)}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerLeave={handleUp}
      {...props}
    >
      {children}
    </button>
  );
}