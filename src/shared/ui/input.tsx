import React from "react";
import { cn } from "@/shared/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-[370px]">
        <input
          ref={ref}
          className={cn(
            // Figma размеровка
            "h-[60px] w-[370px] rounded-[15px]",
            // padding 5 (в фігмі)
            "px-[5px] py-[5px]",
            // colors
            "bg-[#1B263B] text-[#F0EEE9]",
            "border border-[#778DA9]",
            // behavior
            "outline-none",
            "transition-colors duration-[300ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]",
            // focus: зробимо трошки світліше, але в межах палітри
            "focus:border-[#F0EEE9]",
            error ? "border-red-400" : "",
            className
          )}
          {...props}
        />
        {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
      </div>
    );
  }
);

Input.displayName = "Input";