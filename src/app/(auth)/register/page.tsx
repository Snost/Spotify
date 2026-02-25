"use client";

import { AuthOptionsScreen } from "@/features/auth/ui/auth-options-screen";

export default function RegisterOptionsPage() {
  return (
    <AuthOptionsScreen
      title="Відкрий світ музики"
      emailHref="/register/email"
      bottomHref="/login"
      bottomText="УВІЙТИ"
    />
  );
}