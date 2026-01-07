"use client";

import { useState } from "react";
import { setPassword } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import Link from "next/link";

const setPasswordSchema = z
  .object({
    password: z.string().min(8, "密碼長度至少需 8 個字元"),
    confirmPassword: z.string().min(8, "密碼長度至少需 8 個字元"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "確認密碼不一致",
    path: ["confirmPassword"],
  });

type SetPasswordFormData = z.infer<typeof setPasswordSchema>;

export default function SetPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
  });

  const onSubmit = async (data: SetPasswordFormData) => {
    setServerError(null);
    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    try {
      const result = await setPassword(formData);
      if (result?.error) {
        setServerError(result.error);
      }
    } catch (error) {
      // 檢查是否為 Next.js 的 redirect 錯誤
      // redirect() 會拋出一個特殊的錯誤來觸發重定向,需要重新拋出它
      if (isRedirectError(error)) {
        throw error;
      }
      setServerError("發生未預期的錯誤，請稍後再試");
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            設定密碼
          </CardTitle>
          <CardDescription className="text-center">
            為了您的帳號安全，請設定一組密碼以便日後登入。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">新密碼</Label>
              <Input
                id="password"
                type="password"
                placeholder="請輸入新密碼"
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">確認密碼</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="請再次輸入新密碼"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "設定中..." : "確認設定"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-muted-foreground"
                asChild
              >
                <Link href="/">以後再說</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
