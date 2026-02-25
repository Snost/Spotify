"use client";

import { useMutation } from "@tanstack/react-query";
import { login, register } from "../api/auth.api";
import type { AuthResponse, LoginBody, RegisterBody } from "../api/auth.types";
import { useAuth } from "./auth-context";

export function useLoginMutation() {
  const { setAccessToken } = useAuth();

  return useMutation<AuthResponse, Error, LoginBody>({
    mutationFn: login,
    onSuccess: (data) => setAccessToken(data.accessToken),
  });
}

export function useRegisterMutation() {
  const { setAccessToken } = useAuth();

  return useMutation<AuthResponse, Error, RegisterBody>({
    mutationFn: register,
    onSuccess: (data) => setAccessToken(data.accessToken),
  });
}
