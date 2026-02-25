"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/features/auth/model/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WelcomePage() {
  const { isAuthed } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthed) router.replace("/home");
  }, [isAuthed, router]);

  return (
    <div className="min-h-dvh bg-[rgb(var(--bg))]">
      <div className="mx-auto min-h-dvh w-full max-w-[402px] px-4">
        <div className="flex min-h-dvh flex-col">
          {/* статус-бар зона як у Figma: 50px */}
          <div className="h-[50px]" />

          {/* верхній відступ до лого git */}
          <div className="h-[110px]" />

          {/* logo 98x98 */}
          <div className="mx-auto relative h-[98px] w-[98px] overflow-hidden rounded-[20px]">
            <Image
              src="/groov-logo.png"
              alt="Groov Logo"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* відступ до заголовка */}
          <div className="h-[18px]" />

          {/* title 370x24 */}
          <h1 className="mx-auto w-[370px] text-center text-[20px] font-semibold text-[rgb(var(--accent))] leading-[24px]">
            Почни слухати зараз
          </h1>

          {/* subtitle 370x24 */}
          <p className="mx-auto mt-2 w-[370px] text-center text-[16px] text-[rgb(var(--accent))] leading-[24px] opacity-90">
            Музика, що відчуває тебе
          </p>

          {/* тягнемо кнопки вниз */}
          <div className="flex-1" />

          {/* кнопки: 370x50 */}
        <div className="space-y-4 pb-[calc(60px+env(safe-area-inset-bottom))]">
            <Link href="/register" className="block">
              <button
                className="h-[50px] w-[370px] rounded-[16px] bg-[rgb(var(--secondary))] text-[rgb(var(--accent))] font-semibold
                           transition-colors duration-[300ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]
                           active:bg-[rgb(var(--accent))] active:text-[rgb(var(--text-dark))]"
              >
                Зареєструватися безкоштовно
              </button>
            </Link>

            <Link href="/login" className="block">
              <button
                className="h-[50px] w-[370px] rounded-[16px] border border-[rgb(var(--accent))] text-[rgb(var(--accent))] font-semibold
                           transition-colors duration-[300ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]
                           active:bg-[rgb(var(--accent))] active:text-[rgb(var(--text-dark))]"
              >
                Увійти
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}