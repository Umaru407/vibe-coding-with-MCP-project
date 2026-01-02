import { Suspense } from "react";
import { ChatLoader } from "./ChatLoader";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<ChatLoadingFallback />}>
      <ChatLoader chatId={id} />
    </Suspense>
  );
}

function ChatLoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-muted-foreground animate-pulse">載入對話中...</div>
    </div>
  );
}
