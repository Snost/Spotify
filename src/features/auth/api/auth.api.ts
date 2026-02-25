import { apiFetch } from "@/api/client";
import type { AuthResponse, LoginBody, RegisterBody } from "./auth.types";

export function login(body: LoginBody) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function register(body: RegisterBody) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function refresh() {
  return apiFetch<AuthResponse>("/auth/refresh", {
    method: "POST",
  });
}
