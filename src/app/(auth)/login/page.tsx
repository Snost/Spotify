"use client";

import Image from "next/image";
import Link from "next/link";
import { AuthOptionButton } from "@/features/auth/ui/auth-option-button";

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

export default function LoginStartPage() {
  return (
    <div className="min-h-dvh bg-[rgb(var(--bg))]">
      {/* фіксуємо iPhone frame */}
      <div className="mx-auto min-h-dvh w-full max-w-[402px] px-4">
        {/* робимо вертикальну сітку з точними відступами */}
        <div className="flex min-h-dvh flex-col">
          {/* top spacer до лого (top:180) */}
          <div className="h-[180px]" />

          {/* logo 98x98 radius 20 */}
          <div className="mx-auto relative h-[98px] w-[98px] overflow-hidden rounded-[20px]">
            <Image
              src="/groov-logo.png"
              alt="Groov Logo"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* spacer до заголовка (top:298, logo top 180 + 98 = 278 => треба ще 20px) */}
          <div className="h-[20px]" />

          {/* title 370x29, font 24, line-height 100% */}
          <h1 className="mx-auto h-[29px] w-[370px] text-center text-[24px] leading-[24px] font-semibold text-[rgb(var(--accent))]">
            Увійти в GROOV
          </h1>

          {/* spacer до кнопок: перша кнопка top 520 => зараз ми на 298+29=327; треба 193px */}
          <div className="h-[193px]" />

          {/* buttons block */}
          <div className="space-y-5">
         <Link href="/login/email">
  <AuthOptionButton icon={<MailIcon />} variant="filled">
    Продовжити за допомогою <br /> електронної пошти
  </AuthOptionButton>
</Link>

            <AuthOptionButton icon={<GoogleIcon />}>
              Продовжити за допомогою Google
            </AuthOptionButton>

            <AuthOptionButton icon={<AppleIcon />}>
              Продовжити за допомогою Apple
            </AuthOptionButton>
          </div>

          {/* register text: висота 40, ширина 370 */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/register"
              className="h-[40px] w-[370px] text-center text-[24px] leading-[24px] font-semibold text-[rgb(var(--accent))]"
            >
              Зареєструватися
            </Link>
          </div>

          {/* bottom safe area */}
          <div className="flex-1" />
          <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
      </div>
    </div>
  );
}