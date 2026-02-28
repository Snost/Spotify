"use client";
import { useState } from "react";
import { useAuthStore } from "@/shared/stores/auth.store";
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
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterEmailPage() {
  const router = useRouter();
const registerUser = useAuthStore((s) => s.register);
const [serverError, setServerError] = useState<string | null>(null);
  const schema = useMemo(
    () =>
      yup.object({
        name: yup.string().trim().required("Введи імʼя"),
        email: yup
          .string()
          .trim()
          .required("Введи email")
          .email("Невірний формат email"),
        password: yup
          .string()
          .required("Введи пароль")
          .min(6, "Пароль має бути мінімум 6 символів"),
        confirmPassword: yup
          .string()
          .required("Підтверди пароль")
          .oneOf([yup.ref("password")], "Паролі не співпадають"),
      }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
  setServerError(null);

  try {
    await registerUser({
      email: data.email.trim(),
      password: data.password,
      displayName: data.name.trim(),
    });

    router.replace("/home");
  } catch (e: any) {
    setServerError(e?.message ?? "Не вдалося зареєструватися. Спробуй ще раз.");
  }
};

  return (
    <div className="min-h-dvh bg-[#0D1B2A]">
      <div className="mx-auto min-h-dvh w-full max-w-[402px] px-4">
        <div className="flex min-h-dvh flex-col">
          {/* Status bar area: 50 */}
          <div className="h-[50px]" />

          {/* Top bar: back 24x24 + title 254x24 */}
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
              Створити акаунт
            </div>
          </div>

          {/* Form content */}
          <form className="mt-[14px]" onSubmit={handleSubmit(onSubmit)}>
            {/* 1) Як вас звати? (label 370x24) */}
            <div className="h-[24px] w-[370px] text-[20px] leading-[20px] font-semibold text-[#F0EEE9]">
              Як вас звати?
            </div>
            <div className="mt-[10px]">
              <Input
                {...register("name")}
                autoComplete="name"
                error={errors.name?.message}
              />
            </div>

            <div className="h-[24px]" />

            {/* 2) Адреса електронної пошти (label 370x24) */}
            <div className="h-[24px] w-[370px] text-[20px] leading-[20px] font-semibold text-[#F0EEE9]">
              Адреса електронної пошти
            </div>
            <div className="mt-[10px]">
              <Input
                {...register("email")}
                autoComplete="email"
                error={errors.email?.message}
              />
            </div>

            <div className="h-[24px]" />

            {/* 3) Пароль */}
            <div className="h-[24px] w-[370px] text-[20px] leading-[20px] font-semibold text-[#F0EEE9]">
              Пароль
            </div>
            <div className="mt-[10px]">
              <Input
                type="password"
                {...register("password")}
                autoComplete="new-password"
                error={errors.password?.message}
              />
            </div>

            <div className="h-[24px]" />

            {/* 4) Підтвердіть пароль */}
            <div className="h-[24px] w-[370px] text-[20px] leading-[20px] font-semibold text-[#F0EEE9]">
              Підтвердіть пароль
            </div>
            <div className="mt-[10px]">
              <Input
                type="password"
                {...register("confirmPassword")}
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
              />
            </div>

            {/* Spacer before button (370x60) */}
            <div className="h-[60px]" />

            {/* Button 370x50, bg #F0EEE9 */}
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
              {isSubmitting ? "Зачекай..." : "Зареєструватися"}
            </button>
{serverError ? (
  <div className="mt-3 w-[370px] text-center text-[12px] font-semibold text-red-300">
    {serverError}
  </div>
) : null}
            {/* Legal text 370x24 */}
      <div className="mt-[10px] w-[370px]">
  <p className="m-0 text-center text-[10px] leading-[12px] font-semibold text-[#F0EEE980]">
    Натискаючи &quot;Зареєструватися&quot;, ви погоджуєтеся з Умовами
    використання та Політикою конфіденційності.
  </p>
</div>
          </form>

          <div className="flex-1" />
          {/* bottom safe area: 34 */}
          <div className="h-[34px]" />
        </div>
      </div>
    </div>
  );
}