import { getChatMessages } from "@/lib/db/chat";
import { convertToUIMessages } from "@/lib/utils";
import Chat from "@/components/chat/Chat";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<ChatPageSkeleton />}>
      <ChatPage params={params} />
    </Suspense>
  );
}

/**
 * 聊天頁面 - Async Server Component
 * 直接在伺服器端 await 獲取資料
 */
async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  const messagesFromDb = await getChatMessages(id);
  const uiMessages = convertToUIMessages(messagesFromDb as any);

  return <Chat initialMessages={uiMessages} id={id} />;
}

function ChatPageSkeleton() {
  return (
    <div className="flex items-center justify-center h-full animate-pulse">
      聊天紀錄載入中...
    </div>
  );
}
