"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/shared/ui/input";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 18l-6-6 6-6"
        stroke="#F0EEE9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type FormValues = {
  login: string;
  password: string;
};

export default function LoginEmailPage() {
  const router = useRouter();

  const schema = useMemo(
    () =>
      yup.object({
        login: yup
          .string()
          .trim()
          .required("Введи email або ім’я користувача"),
        password: yup
          .string()
          .required("Введи пароль")
          .min(6, "Пароль має бути мінімум 6 символів"),
      }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange", // щоб isValid оновлювався одразу
    defaultValues: { login: "", password: "" },
  });

  const onSubmit = async (data: FormValues) => {
    // поки без бекенду — просто показуємо що працює
    console.log("LOGIN SUBMIT", data);

    // тимчасово можна зробити фейковий перехід:
    // router.push("/home");
  };

  return (
    <div className="min-h-dvh bg-[#0D1B2A]">
      <div className="mx-auto min-h-dvh w-full max-w-[402px] px-4">
        <div className="flex min-h-dvh flex-col">
          {/* Status bar */}
          <div className="h-[50px]" />

          {/* Top bar */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="grid h-[24px] w-[24px] place-items-center"
              aria-label="Back"
            >
              <BackIcon />
            </button>

            <div className="h-[24px] w-[254px] text-center text-[20px] leading-[20px] font-semibold text-[#F0EEE9]">
              З поверненням
            </div>
          </div>

          {/* FORM */}
          <form className="mt-[46px]" onSubmit={handleSubmit(onSubmit)}>
            {/* Label 1 */}
            <div className="h-[48px] w-[370px] text-[20px] leading-[20px] font-semibold text-[#F0EEE9]">
              Адреса електронної пошти або ім’я користувача
            </div>

            {/* Input 1 */}
            <div className="mt-[10px]">
              <Input
                {...register("login")}
                autoComplete="username"
                error={errors.login?.message}
              />
            </div>

            <div className="h-[24px]" />

            {/* Label 2 */}
            <div className="h-[24px] w-[370px] text-[20px] leading-[20px] font-semibold text-[#F0EEE9]">
              Пароль
            </div>

            {/* Input 2 */}
            <div className="mt-[10px]">
              <Input
                type="password"
                {...register("password")}
                autoComplete="current-password"
                error={errors.password?.message}
              />
            </div>

            <div className="h-[60px]" />

            {/* Button */}
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="
                h-[50px] w-[370px] rounded-[16px]
                bg-[#F0EEE9] text-[#0D1B2A]
                font-semibold
                transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                disabled:bg-[#D8D5CF] disabled:text-[#6B7280]
                disabled:cursor-not-allowed
                active:bg-[#778DA9] active:text-[#0D1B2A]
              "
            >
              {isSubmitting ? "Зачекай..." : "Увійти"}
            </button>
          </form>

          <div className="flex-1" />
          <div className="h-[34px]" />
        </div>
      </div>
    </div>
  );
}