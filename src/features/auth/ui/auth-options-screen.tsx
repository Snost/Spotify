"use client";

import Image from "next/image";
import Link from "next/link";
import { AuthOptionButton } from "@/features/auth/ui/auth-option-button";

type Props = {
  title: string;
  emailHref: string;
  bottomHref: string;
  bottomText: string;
};

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6.5h16v11H4v-11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m4.5 7 7.2 6.1c.2.2.5.2.7 0L19.5 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoogleIcon() {
  return <span className="text-lg font-extrabold leading-none">G</span>;
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.7 13.2c0-2 1.7-3 1.8-3.1-1-1.4-2.6-1.6-3.1-1.6-1.3-.1-2.6.8-3.3.8-.7 0-1.8-.8-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.8 2.2 1.1 0 1.6-.7 3-0.7 1.4 0 1.8.7 3 .7 1.2 0 2-.9 2.7-2 .8-1.2 1.2-2.4 1.2-2.5-.1 0-2.6-1-2.6-4.1zM14.8 6.7c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.6.7-1.1 1.7-.9 2.7 1 .1 1.9-.5 2.5-1.3z" />
    </svg>
  );
}

export function AuthOptionsScreen({
  title,
  emailHref,
  bottomHref,
  bottomText,
}: Props) {
  return (
    <div className="min-h-dvh bg-[rgb(var(--bg))]">
      <div className="mx-auto min-h-dvh w-full max-w-[402px] px-4">
        <div className="flex min-h-dvh flex-col">
          <div className="mx-auto w-[370px] flex-1">
            {/* ✅ ідентичний каркас */}
            <div className="h-[50px]" />
            <div className="h-[130px]" />

            <div className="flex flex-col items-center">
              <div className="relative h-[98px] w-[98px] overflow-hidden rounded-[20px]">
                <Image
                  src="/groov-logo.png"
                  alt="Groov Logo"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <div className="h-[20px]" />

              <h1 className="text-center text-[24px] leading-[24px] font-semibold text-[rgb(var(--accent))]">
                {title}
              </h1>
            </div>

            <div className="h-[193px]" />

            <div className="space-y-[10px]">
              <Link href={emailHref} className="block">
                <AuthOptionButton icon={<MailIcon />} variant="filled">
                  Продовжити за допомогою <br /> електронної пошти
                </AuthOptionButton>
              </Link>

              <AuthOptionButton icon={<GoogleIcon />} variant="outline">
                Продовжити за допомогою Google
              </AuthOptionButton>

              <AuthOptionButton icon={<AppleIcon />} variant="outline">
                Продовжити за допомогою Apple
              </AuthOptionButton>
            </div>

            <div className="mt-[16px]">
              <Link
                href={bottomHref}
                className="block h-[40px] w-[370px] text-center text-[16px] font-semibold leading-[40px] text-[rgb(var(--accent))]"
              >
                {bottomText}
              </Link>
            </div>
          </div>

          <div className="h-[34px]" />
        </div>
      </div>
    </div>
  );
}