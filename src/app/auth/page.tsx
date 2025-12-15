"use client";

import { signIn, signUp } from "@/actions/auth-actions";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  email: z.email("請輸入有效的電子郵件"),
  password: z.string().min(1, "請輸入密碼"),
});

const signUpSchema = z.object({
  name: z.string().min(1, "請輸入姓名"),
  email: z.email("請輸入有效的電子郵件"),
  password: z.string().min(8, "密碼長度至少需 8 個字元"),
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function AuthPage() {
  const { isSignUp, setIsSignUp, setError, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignInFormData | SignUpFormData>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(isSignUp ? { name: "" } : {}),
    },
  });

  const onSubmit = async (data: SignInFormData | SignUpFormData) => {
    setError(null);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (isSignUp && "name" in data) {
      formData.append("name", data.name);
    }

    try {
      const action = isSignUp ? signUp : signIn;
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      // 檢查是否為 Next.js 的 redirect 錯誤
      // redirect() 會拋出一個特殊的錯誤來觸發重定向,需要重新拋出它
      if (isRedirectError(error)) {
        throw error;
      }
      setError("發生未預期的錯誤,請稍後再試");
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    reset();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {isSignUp ? "建立您的帳號" : "登入您的帳號"}
          </h2>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          key={isSignUp ? "signup" : "signin"}
        >
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-4 rounded-md shadow-sm">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="sr-only">
                  姓名
                </label>
                <input
                  id="name"
                  type="text"
                  className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  placeholder="姓名"
                  {...register("name" as any)}
                />
                {isSignUp && errors && (errors as any).name && (
                  <p className="mt-1 text-xs text-red-600">
                    {(errors as any).name.message}
                  </p>
                )}
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">
                電子郵件
              </label>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                placeholder="電子郵件"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                密碼
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                placeholder="密碼"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "處理中..." : isSignUp ? "註冊" : "登入"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button
            type="button"
            className="text-sm text-indigo-600 hover:text-indigo-500"
            onClick={toggleMode}
          >
            {isSignUp ? "已有帳號？登入" : "沒有帳號？註冊"}
          </button>
        </div>
      </div>
    </div>
  );
}
