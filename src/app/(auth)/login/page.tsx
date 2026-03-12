"use client";

import { AuthShell } from "@/shared/ui/layout/AuthShell";
import { AuthOptionsScreen } from "@/features/auth/ui/auth-options-screen";

export default function LoginPage() {
  return (
    <AuthShell>
      <AuthOptionsScreen
        title="Увійти в GROOV"
        emailHref="/login/email"
        bottomHref="/register"
        bottomText="Зареєструватися"
        bottomVariant="plain"
      />
    </AuthShell>
  );
}