import { redirect } from "next/navigation";
import { getChatById, getChatMessages } from "@/lib/db/chat";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Chat from "@/components/chat/Chat";
import { convertToUIMessages } from "@/lib/utils";

interface ChatLoaderProps {
  chatId: string;
}

export async function ChatLoader({ chatId }: ChatLoaderProps) {
  // 驗證 session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/api/auth");
  }

  // 載入聊天資料
  const chat = await getChatById(chatId);

  if (!chat) {
    redirect("/");
  }

  // 載入訊息
  const messagesFromDb = await getChatMessages(chatId);
  const uiMessages = convertToUIMessages(messagesFromDb as any);

  return <Chat initialMessages={uiMessages} id={chatId} />;
}
