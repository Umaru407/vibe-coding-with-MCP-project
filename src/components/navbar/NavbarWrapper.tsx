"use client";

import { Navbar } from "./Navbar";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { signOut } from "@/actions/auth-actions";
import { useEffect } from "react";

export function NavbarWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending, refetch } = authClient.useSession();

  // 監聽路由變化，重新獲取 session
  useEffect(() => {
    refetch();
  }, [pathname, refetch]);

  const handleUserItemClick = async (item: string) => {
    console.log("User clicked:", item);

    switch (item) {
      case "profile":
        router.push("/user-profile");
        break;
      case "settings":
        router.push("/settings");
        break;
      case "logout":
        // 呼叫登出 Server Action
        try {
          await signOut();
          // 登出後手動刷新 session
          await refetch();
        } catch (error) {
          console.error("Logout error:", error);
        }
        break;
      default:
        break;
    }
  };

  const handleNavItemClick = (href: string) => {
    console.log("Nav clicked:", href);
    router.push(href);
  };

  const handleInfoItemClick = (item: string) => {
    console.log("Info clicked:", item);
    // 處理資訊選單點擊
  };

  const handleNotificationItemClick = (item: string) => {
    console.log("Notification clicked:", item);
    // 處理通知點擊
  };

  // 如果正在載入，可以顯示骨架屏或簡化版 Navbar
  if (isPending) {
    return (
      <Navbar
        userName="載入中..."
        userEmail=""
        onUserItemClick={handleUserItemClick}
        onNavItemClick={handleNavItemClick}
        onInfoItemClick={handleInfoItemClick}
        onNotificationItemClick={handleNotificationItemClick}
      />
    );
  }

  return (
    <Navbar
      userName={session?.user?.name || "訪客"}
      userEmail={session?.user?.email || ""}
      userAvatar={session?.user?.image || undefined}
      onUserItemClick={handleUserItemClick}
      onNavItemClick={handleNavItemClick}
      onInfoItemClick={handleInfoItemClick}
      onNotificationItemClick={handleNotificationItemClick}
    />
  );
}
