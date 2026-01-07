import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserChats } from "@/lib/db/chat";
import type { Chat } from "@/types/db";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ChatList } from "./ChatList";
import { NewChatButton } from "./NewChatButton";

interface ChatSidebarProps {
  className?: string;
}

/**
 * 聊天列表骨架 - 載入中顯示
 */
function ChatListSkeleton() {
  return (
    <SidebarMenu>
      {Array.from({ length: 5 }).map((_, i) => (
        <SidebarMenuItem key={i}>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

/**
 * 聊天列表資料獲取 - Server Component (async)
 * 在伺服器端直接獲取使用者的聊天列表
 */
async function ChatListData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm group-data-[collapsible=icon]:hidden">
        請先登入
      </div>
    );
  }

  const chats: Chat[] = await getUserChats(session.user.id);
  return <ChatList initialChats={chats} />;
}

/**
 * 聊天側邊欄 - Server Component
 * 使用 Suspense 搭配 Skeleton 處理非同步資料載入
 */
export function ChatSidebar({ className }: ChatSidebarProps) {
  return (
    <Sidebar collapsible="icon" className={className}>
      <SidebarHeader className="p-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-end">
            <SidebarTrigger />
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <NewChatButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="group-data-[collapsible=icon]:no-scrollbar group-data-[collapsible=icon]:overflow-auto">
        <SidebarGroup>
          <SidebarGroupLabel>對話紀錄</SidebarGroupLabel>
          <SidebarGroupContent>
            {/* 使用 Suspense 包裹異步資料獲取，Skeleton 作為 fallback */}
            <Suspense fallback={<ChatListSkeleton />}>
              <ChatListData />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* <SidebarFooter className="p-2" /> */}
    </Sidebar>
  );
}
