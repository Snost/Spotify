"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/model/auth-context";
import { AuthLinkButton } from "@/shared/ui/auth-link-button";
import { AuthShell } from "@/shared/ui/layout/AuthShell";
import { AuthPageHero } from "@/features/auth/ui/AuthPageHero";
import { AuthPageActions } from "@/features/auth/ui/AuthPageActions";

export default function WelcomePage() {
  const { isAuthed } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthed) router.replace("/home");
  }, [isAuthed, router]);

  return (
    <AuthShell>
      <div className="flex min-h-dvh flex-col">
        <div className="h-[50px]" />

        <div className="flex flex-1 flex-col items-center">
          <div className="h-[110px]" />

          <AuthPageHero
            title="Почни слухати зараз"
            subtitle="Музика, що відчуває тебе"
          />

          <div className="flex-1" />

          <AuthPageActions>
            <AuthLinkButton
              href="/register"
              variant="filled"
              className="flex h-[50px] w-full items-center justify-center rounded-[16px] text-[16px] font-semibold"
            >
              Зареєструватися безкоштовно
            </AuthLinkButton>

            <AuthLinkButton
              href="/login"
              variant="outline"
              className="flex h-[50px] w-full items-center justify-center rounded-[16px] text-[16px] font-semibold"
            >
              Увійти
            </AuthLinkButton>
          </AuthPageActions>
        </div>
      </div>
    </AuthShell>
  );
}