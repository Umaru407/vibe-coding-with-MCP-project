import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { tools } from "@/lib/ai/tools";
import { saveMessage, createChat, getChatById } from "@/lib/db/chat";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[]; chatId?: string } =
    await req.json();

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
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

  // 如果有 chatId，驗證使用者是否有權限存取
  let currentChatId = chatId;
  if (chatId) {
    const chat = await getChatById(chatId, userId);
    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }
  } else {
    // 如果沒有 chatId，建立新聊天
    const newChat = await createChat(userId, "新對話");
    currentChatId = newChat.id;
  }

  // 儲存使用者訊息（最後一則）
  const userMessage = messages[messages.length - 1];
  if (userMessage && currentChatId) {
    await saveMessage(currentChatId, {
      role: userMessage.role,
      parts: userMessage.parts || [],
      attachments: [],
    });
  }

  const google = createGoogleGenerativeAI({
    apiKey: false ? "test" : geminiApiKey,
  });

  const result = streamText({
    model: google("gemini-2.5-flash-lite"),
    messages: convertToModelMessages(messages),
    tools: tools,
  });

  // console.log("result", result);

  return result.toUIMessageStreamResponse({
    headers: {
      "X-Chat-Id": currentChatId || "",
    },
  });
}
