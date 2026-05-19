import { clearStoredTokens, getCurrentUser, loginUser } from "@/lib/api";
import type { LoginData } from "@/lib/api";

export async function login(data: LoginData) {
  await loginUser(data);
  return getCurrentUser();
}

export async function logout() {
  await clearStoredTokens();
}

export async function isAuthenticated() {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
}
