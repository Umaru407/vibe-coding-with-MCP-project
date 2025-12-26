"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquarePlus, Trash2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Chat } from "@/types/chat";

interface ChatSidebarProps {
  className?: string;
}

export function ChatSidebar({ className }: ChatSidebarProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // 從路徑中提取目前的 chatId
  const currentChatId = pathname.split("/").pop();

  // 載入聊天列表
  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats");
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats);
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "新對話" }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/chat/${data.chat.id}`);
        fetchChats(); // 重新載入列表
      }
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("確定要刪除這個對話嗎？")) {
      return;
    }

    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setChats(chats.filter((chat) => chat.id !== chatId));
        // 如果刪除的是目前的聊天，導航到新聊天
        if (chatId === currentChatId) {
          router.push("/chat");
        }
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  return (
    <>
      {/* 手機版開關按鈕 */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* 側邊欄 */}
      <div
        className={cn(
          "flex flex-col h-full bg-background border-r transition-all duration-300",
          isOpen ? "w-64" : "w-0 md:w-64",
          "md:relative absolute inset-y-0 left-0 z-40",
          className
        )}
      >
        <div className="p-4 border-b">
          <Button onClick={handleNewChat} className="w-full" variant="default">
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            新對話
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {loading ? (
              <div className="text-sm text-muted-foreground p-4 text-center">
                載入中...
              </div>
            ) : chats.length === 0 ? (
              <div className="text-sm text-muted-foreground p-4 text-center">
                還沒有對話
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "group flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors",
                    currentChatId === chat.id && "bg-accent"
                  )}
                  onClick={() => router.push(`/chat/${chat.id}`)}
                >
                  <div className="flex-1 truncate">
                    <div className="text-sm font-medium truncate">
                      {chat.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(chat.created_at).toLocaleDateString("zh-TW")}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* 手機版遮罩 */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
