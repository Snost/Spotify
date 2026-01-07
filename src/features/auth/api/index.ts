export async function login(dto: { email: string; password: string }) {
  console.log('login dto', dto)
  return { ok: true }
}

export async function register(dto: { email: string; password: string }) {
  console.log('register dto', dto)
  return { ok: true }
}
