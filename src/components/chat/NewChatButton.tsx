"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { MessageSquarePlus } from "lucide-react";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";

/**
 * 新對話按鈕 - Client Component
 * 處理導航至新對話頁面的邏輯
 */
export function NewChatButton() {
  const router = useRouter();
  const [_isPending, startTransition] = useTransition();

  const { isMobile, setOpenMobile } = useSidebar();

  const handleNewChat = () => {
    router.push("/chat");
    router.refresh();
    startTransition(() => {
      if (isMobile) {
        setOpenMobile(false);
      }
    });
  };

  return (
    <SidebarMenuButton onClick={handleNewChat} tooltip="新對話">
      <MessageSquarePlus className="h-4 w-4" />
      <span>新對話</span>
    </SidebarMenuButton>
  );
}
