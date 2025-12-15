"use client";

import { signIn, signUp } from "@/actions/auth-actions";

import { useActionState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthPage() {
  const { isSignUp, setIsSignUp } = useAuthStore();
  const [signInState, signInAction, isSignInPending] = useActionState(
    signIn,
    null
  );
  const [signUpState, signUpAction, isSignUpPending] = useActionState(
    signUp,
    null
  );

  const currentAction = isSignUp ? signUpAction : signInAction;
  const currentState = isSignUp ? signUpState : signInState;
  const isPending = isSignUp ? isSignUpPending : isSignInPending;

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
          action={currentAction}
          key={isSignUp ? "signup" : "signin"}
        >
          {currentState?.error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {currentState.error}
            </div>
          )}
          <div className="-space-y-px rounded-md shadow-sm">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="sr-only">
                  姓名
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  defaultValue={currentState?.name || ""}
                  className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  placeholder="姓名"
                />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">
                電子郵件
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={currentState?.email || ""}
                className={`relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 ${
                  isSignUp ? "" : "rounded-t-md"
                }`}
                placeholder="電子郵件"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                密碼
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                placeholder="密碼"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {isPending ? "處理中..." : isSignUp ? "註冊" : "登入"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button
            type="button"
            className="text-sm text-indigo-600 hover:text-indigo-500"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "已有帳號？登入" : "沒有帳號？註冊"}
          </button>
        </div>
      </div>
    </div>
  );
}
