type AuthAction = "login" | "signup" | "reset";

const SIGNUP_ERROR_KEYS: Record<string, string> = {
  "auth/operation-not-allowed": "authMethodDisabled",
  "auth/email-already-in-use": "emailInUse",
  "auth/invalid-email": "invalidEmail",
  "auth/weak-password": "passwordTooShort",
};

const LOGIN_ERROR_KEYS: Record<string, string> = {
  "auth/invalid-credential": "loginError",
  "auth/wrong-password": "loginError",
  "auth/user-not-found": "loginError",
  "auth/invalid-email": "invalidEmail",
  "auth/operation-not-allowed": "authMethodDisabled",
};

const RESET_ERROR_KEYS: Record<string, string> = {
  "auth/invalid-email": "invalidEmail",
  "auth/missing-email": "invalidEmail",
  "auth/user-not-found": "resetError",
  "auth/operation-not-allowed": "authMethodDisabled",
};

export function getAuthErrorKey(error: unknown, action: AuthAction): string {
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code: string }).code)
      : null;

  if (process.env.NODE_ENV === "development" && code) {
    console.error(`Firebase Auth error [${action}]:`, code);
  }

  if (!code) {
    if (action === "login") return "loginError";
    if (action === "reset") return "resetError";
    return "signupError";
  }

  const map =
    action === "login"
      ? LOGIN_ERROR_KEYS
      : action === "reset"
        ? RESET_ERROR_KEYS
        : SIGNUP_ERROR_KEYS;

  if (action === "login") return map[code] ?? "loginError";
  if (action === "reset") return map[code] ?? "resetError";
  return map[code] ?? "signupError";
}
