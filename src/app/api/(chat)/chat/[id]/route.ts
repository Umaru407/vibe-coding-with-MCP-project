import { streamText, UIMessage, convertToModelMessages, generateId } from "ai";
import { tools } from "@/lib/ai/tools";
import { saveMessage, getChatById, saveChat } from "@/lib/db/chat";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateTitleFromUserMessage } from "@/app/actions/ai";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const { id: chatId } = await params;

  const openrouterApiKey = process.env.OPENROUTER_API_KEY;
  if (!openrouterApiKey) {
    throw new Error("API Key is missing.");
  }
  // 驗證使用者
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  // 取得最後一則訊息（應該是使用者訊息）
  const userMessage = messages[messages.length - 1];

  // 如果有 chatId，驗證使用者是否有權限存取
  let currentChatId = chatId;
  if (chatId) {
    const chat = await getChatById(chatId);
    if (!chat) {
      const newChat = await saveChat({
        chatId: chatId,
        userId: userId,
        title: await generateTitleFromUserMessage({ message: userMessage }),
      });
      currentChatId = newChat.id;
    }
  }
  // 儲存使用者訊息
  if (userMessage?.role === "user" && currentChatId) {
    await saveMessage(currentChatId, {
      role: userMessage.role,
      parts: userMessage.parts || [],
      attachments: [],
    });
  }

  const openrouter = createOpenRouter({
    apiKey: openrouterApiKey,
  });

  const result = streamText({
    model: openrouter.chat("google/gemini-2.5-flash-lite"),
    messages: convertToModelMessages(messages),
    tools: tools,
    async onFinish({ response }) {
      // 儲存助理回應（所有完成的訊息）
      if (currentChatId && response.messages.length > 0) {
        for (const message of response.messages) {
          if (message.role === "assistant") {
            await saveMessage(currentChatId, {
              role: message.role,
              parts: message.content,
              attachments: [],
            });
          }
        }
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
