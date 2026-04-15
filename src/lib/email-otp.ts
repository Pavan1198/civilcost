import type { User } from "@/context/AuthContext";

const authApiBaseUrl = import.meta.env.VITE_AUTH_API_BASE_URL?.trim().replace(/\/$/, "");

type VerifyEmailOtpResponse = {
  verified?: boolean;
  message?: string;
  user?: Partial<User>;
  profile?: Partial<User>;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  userType?: User["userType"];
};

export const isEmailOtpConfigured = Boolean(authApiBaseUrl);

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  if (!authApiBaseUrl) {
    throw new Error("Email OTP API is not configured.");
  }

  const response = await fetch(`${authApiBaseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({} as Record<string, unknown>));

  if (!response.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : "The OTP request failed. Please try again.";
    throw new Error(message);
  }

  return data as T;
}

export async function sendEmailOtp(email: string) {
  await postJson("/auth/email/send-otp", { email });
}

export async function verifyEmailOtp(email: string, otp: string) {
  const response = await postJson<VerifyEmailOtpResponse>(
    "/auth/email/verify-otp",
    { email, otp },
  );

  if (response.verified === false) {
    throw new Error(response.message || "The OTP is invalid or expired.");
  }

  const profile = response.user ?? response.profile ?? response;
  const hasProfileData =
    Boolean(profile.name) ||
    Boolean(profile.email) ||
    Boolean(profile.phone) ||
    Boolean(profile.location) ||
    Boolean(profile.userType);

  return hasProfileData
    ? {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        userType: profile.userType,
      }
    : null;
}
