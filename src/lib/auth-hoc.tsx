import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ComponentType } from "react";

/**
 * 可用的使用者角色類型
 */
export type UserRole = "admin" | "user" | "guest";

/**
 * 權限配置選項
 */
export interface AuthConfig {
  /** 允許的角色列表，至少需要其中一個角色 */
  allowedRoles?: UserRole[];
  /** 是否需要認證（預設為 true） */
  requireAuth?: boolean;
  /** 未登入時的重定向路徑（預設為 /auth） */
  unauthenticatedRedirectTo?: string;
  /** 未授權（已登入但權限不足）時的重定向路徑（預設為 /unauthorized） */
  unauthorizedRedirectTo?: string;
  /** 自訂權限檢查函數 */
  customCheck?: (session: any) => boolean;
}

/**
 * hoc組件：為頁面添加權限控制
 *
 * @example
 * ```tsx
 * // 只允許 admin 訪問
 * export default withAuth(AdminPage, { allowedRoles: ["admin"] });
 *
 * // 允許 admin 或 user 訪問
 * export default withAuth(DashboardPage, { allowedRoles: ["admin", "user"] });
 *
 * // 自訂權限檢查
 * export default withAuth(SpecialPage, {
 *   customCheck: (session) => session?.user.email.endsWith("@company.com")
 * });
 * ```
 */
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  config: AuthConfig = {}
) {
  const {
    allowedRoles,
    requireAuth = true,
    unauthenticatedRedirectTo = "/auth",
    unauthorizedRedirectTo = "/unauthorized",
    customCheck,
  } = config;

  return async function AuthWrapper(props: P) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // 檢查是否需要認證（未登入）
    if (requireAuth && !session) {
      redirect(unauthenticatedRedirectTo);
    }

    // 執行自訂檢查（已登入但未通過自訂檢查）
    if (customCheck && !customCheck(session)) {
      redirect(unauthorizedRedirectTo);
    }

    // 檢查角色權限（已登入但角色不符）
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = session?.user?.role as UserRole | undefined;

      if (!userRole || !allowedRoles.includes(userRole)) {
        redirect(unauthorizedRedirectTo);
      }
    }

    // 通過所有檢查，渲染組件
    return <Component {...props} />;
  };
}

/**
 * 便捷函數：只允許 admin 訪問
 */
export function withAdminAuth<P extends object>(Component: ComponentType<P>) {
  return withAuth(Component, { allowedRoles: ["admin"] });
}

/**
 * 便捷函數：允許已登入的使用者訪問
 */
export function withUserAuth<P extends object>(Component: ComponentType<P>) {
  return withAuth(Component, { allowedRoles: ["admin", "user"] });
}
