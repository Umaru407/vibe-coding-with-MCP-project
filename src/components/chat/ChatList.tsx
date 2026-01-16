"use client";

import { useEffect, useMemo, useRef, useState, useCallback, memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MessageSquare, Trash2, Loader2 } from "lucide-react";
import type { Chat } from "@/types/db";
import { getUserChatsAction } from "@/app/actions/chat";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

interface ChatListProps {
  /** 初始聊天列表，由 Server Component 傳入 */
  initialChats: Chat[];
}

// 聊天項目元件 - 記憶化以避免不必要的重新渲染
const ChatItem = memo(function ChatItem({
  chat,
  isActive,
  onChatClick,
  onDeleteClick,
  isDeleting,
}: {
  chat: Chat;
  isActive: boolean;
  onChatClick: (chatId: string) => void;
  onDeleteClick: (chatId: string, e: React.MouseEvent) => void;
  isDeleting: boolean;
}) {
  return (
    <SidebarMenuItem key={chat.id}>
      <SidebarMenuButton
        isActive={isActive}
        onClick={() => onChatClick(chat.id)}
        tooltip={chat.title}
      >
        <MessageSquare className="h-4 w-4 shrink-0" />
        <span className="truncate">{chat.title}</span>
      </SidebarMenuButton>
      <SidebarMenuAction
        showOnHover
        onClick={(e) => onDeleteClick(chat.id, e)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="text-destructive h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="text-destructive h-4 w-4" />
        )}
        <span className="sr-only">刪除</span>
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
});

/**
 * 聊天列表 - Client Component
 * 處理聊天列表的互動邏輯：導航、刪除、optimistic updates、無限滾動 (TanStack Query)
 */
export function ChatList({ initialChats }: ChatListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [chatId, setChatId] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const { isMobile, setOpenMobile } = useSidebar();

  // 從路徑中提取目前的 chatId
  const currentChatId = useMemo(() => {
    return pathname.split("/").pop();
  }, [pathname]);

  useEffect(() => {
    setChatId(null);
  }, [currentChatId]);

  // 使用 TanStack Query 處理無限滾動 (每頁 20 筆)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["chats"],
      queryFn: ({ pageParam = 0 }) => getUserChatsAction(pageParam, 20),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        // 如果上一頁資料少於 20 筆，表示沒有更多資料了
        if (lastPage.length < 20) return undefined;
        // 下一頁的 offset 是目前所有頁面的資料總數
        return allPages.flatMap((p) => p).length;
      },
      initialData: {
        pages: [initialChats],
        pageParams: [0],
      },
      staleTime: 60 * 1000, // 1 分鐘內不重新 fetch
    });

  const chats = useMemo(
    () => data?.pages.flatMap((page) => page) ?? [],
    [data],
  );

  // 處理刪除 mutation
  const deleteMutation = useMutation({
    mutationFn: async (chatId: string) => {
      const response = await fetch(`/api/history/${chatId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }
      return chatId;
    },
    onSuccess: (deletedChatId) => {
      // 使用函式式更新以確保穩定性
      queryClient.setQueryData(["chats"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: Chat[]) =>
            page.filter((chat) => chat.id !== deletedChatId),
          ),
        };
      });

      // 如果刪除的是目前的聊天，導航到新聊天
      if (deletedChatId === currentChatId || deletedChatId === chatId) {
        setChatId("chat");
        router.push("/chat");
      }
    },
    onError: (error) => {
      console.error("Failed to delete chat:", error);
      alert("刪除對話失敗，請稍後再試");
    },
  });

  // 無限滾動 Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const activeChatId = chatId ?? currentChatId;

  // 使用 useCallback 穩定事件處理器，避免子元件不必要的重新渲染
  const handleChatClick = useCallback(
    (chatId: string) => {
      setChatId(chatId);
      router.push(`/chat/${chatId}`);
      // router.push 本身已經使用 transition，不需要額外的 startTransition
      if (isMobile) {
        setOpenMobile(false);
      }
    },
    [router, isMobile, setOpenMobile],
  );

  const handleDeleteChat = useCallback(
    (chatId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!confirm("確定要刪除這個對話嗎？")) {
        return;
      }
      deleteMutation.mutate(chatId);
    },
    [deleteMutation],
  );

  if (status === "success" && chats.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm group-data-[collapsible=icon]:hidden">
        還沒有對話
      </div>
    );
  }

  return (
    <>
      <SidebarMenu>
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={activeChatId === chat.id}
            onChatClick={handleChatClick}
            onDeleteClick={handleDeleteChat}
            isDeleting={
              deleteMutation.isPending && deleteMutation.variables === chat.id
            }
          />
        ))}
      </SidebarMenu>
      {hasNextPage && (
        <div ref={observerTarget} className="flex justify-center p-4">
          {isFetchingNextPage ? (
            <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
          ) : (
            <div className="h-4" /> // Placeholder for observer
          )}
        </div>
      )}
    </>
  );
}
