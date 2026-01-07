import { getChatMessages } from "@/lib/db/chat";
import { convertToUIMessages } from "@/lib/utils";
import Chat from "@/components/chat/Chat";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  const messagesFromDb = await getChatMessages(id);

  console.log("messagesFromDb", messagesFromDb);

  const uiMessages = convertToUIMessages(messagesFromDb as any);

  return <Chat initialMessages={uiMessages} id={id} />;
}
