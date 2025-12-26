"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    // 自動建立新聊天並重定向
    const createNewChat = async () => {
      try {
        const response = await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "新對話" }),
        });

        if (response.ok) {
          const data = await response.json();
          router.push(`/chat/${data.chat.id}`);
        }
      } catch (error) {
        console.error("Failed to create chat:", error);
      }
    };

    createNewChat();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-muted-foreground">建立新對話中...</div>
    </div>
  );
}
