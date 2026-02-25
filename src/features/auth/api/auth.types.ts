export type LoginBody = { email: string; password: string };
export type RegisterBody = { email: string; password: string; name?: string };

export type AuthResponse = { accessToken: string };
