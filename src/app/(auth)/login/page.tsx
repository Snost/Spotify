"use client";

import { AuthOptionsScreen } from "@/features/auth/ui/auth-options-screen";

export default function LoginStartPage() {
  return (
    <AuthOptionsScreen
      title="Увійти в GROOV"
      emailHref="/login/email"
      bottomHref="/register"
      bottomText="Зареєструватися"
    />
  );
}