"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

type ActionState = {
  error?: string;
  email?: string;
  name?: string;
  password?: string;
} | null;

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/auth");
}

export async function signIn(formData: FormData): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message, email };
    }
    return { error: "登入失敗，請稍後再試", email };
  }

  redirect("/");
}

export async function signUp(formData: FormData): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message, email, name };
    }
    return { error: "註冊失敗，請稍後再試", email, name };
  }
  redirect("/");
}

export async function signInWithGoogle() {
  const { redirect: shouldRedirect, url } = await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: "/auth/callback",
    },
  });

  if (shouldRedirect && url) {
    redirect(url);
  }
}

export async function setPassword(formData: FormData): Promise<ActionState> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password.length < 8) {
    return { error: "密碼長度至少需 8 個字元" };
  }

  if (password !== confirmPassword) {
    return { error: "確認密碼不一致" };
  }

  try {
    const headersList = await headers();
    await auth.api.setPassword({
      body: {
        newPassword: password,
      },
      headers: headersList,
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message };
    }
    return { error: "設定密碼失敗，請稍後再試" };
  }

  redirect("/");
}
