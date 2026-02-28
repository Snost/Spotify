import Link from "next/link";
import { cn } from "@/shared/lib/cn";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function AuthLinkButton({ href, children, className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "block h-[40px] w-[370px]",
        "text-center text-[16px] font-semibold leading-[40px]",
        "text-[#F0EEE9]",
        "transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
        "active:text-[#778DA9] active:scale-[0.98]",
        className
      )}
    >
      {children}
    </Link>
  );
}