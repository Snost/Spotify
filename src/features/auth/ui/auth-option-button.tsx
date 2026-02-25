import React from "react";
import { cn } from "@/shared/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: "filled" | "outline";
};

/**
 * Figma behavior:
 * - Google/Apple: 1 line, no dots
 * - Email: can be 2 lines
 * - text visually centered
 */
export function AuthOptionButton({
  icon,
  children,
  variant = "outline",
  className,
  ...props
}: Props) {
  const isFilled = variant === "filled";

  return (
    <button
      className={cn(
        "h-[60px] w-[370px] rounded-[20px] px-4",
        "grid grid-cols-[44px_1fr] items-center gap-3",
        "transition",
        isFilled
          ? "bg-[rgb(var(--secondary))] text-[rgb(var(--accent))]"
          : "border border-[rgb(var(--accent))] text-[rgb(var(--accent))]",
        className
      )}
      {...props}
    >
      {/* icon box */}
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[rgb(var(--accent))] text-[rgb(var(--text-dark))]">
        {icon}
      </span>

      {/* label */}
      <span
        className={cn(
          "text-center font-semibold leading-[16px]",
          // filled (email) — можна 2 рядки
         isFilled ? "text-[15px] whitespace-normal" : "text-[16px] whitespace-nowrap"
        )}
        style={{
          // це трюк щоб текст реально стояв по центру кнопки як у Figma:
          // робимо внутрішній блок шириною 370-32-44-12 = ~282 і центруємо його
          width: "282px",
          justifySelf: "center",
        }}
      >
        {children}
      </span>
    </button>
  );
}