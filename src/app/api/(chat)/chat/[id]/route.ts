import { streamText, UIMessage, convertToModelMessages, generateId } from "ai";
import { tools } from "@/lib/ai/tools";
import { saveMessage, getChatById, saveChat } from "@/lib/db/chat";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateTitleFromUserMessage } from "@/app/actions/ai";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
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
    console.log("userMessage", userMessage);
    await saveMessage({
      messages: [
        {
          chatId: currentChatId,
          id: userMessage.id,
          role: "user",
          parts: userMessage.parts,
          attachments: [],
          createdAt: new Date().toISOString(),
        },
      ],
    });
    console.log("userMessage saved");
  }

  const openrouter = createOpenRouter({
    apiKey: openrouterApiKey,
  });

  const result = streamText({
    model: openrouter.chat("google/gemini-2.5-flash-lite"),
    messages: convertToModelMessages(messages),
    tools: tools,
    // onFinish: async ({ messages }) => {
    //   await saveMessage({
    //     messages: messages.map((currentMessage) => ({
    //       id: currentMessage.id,
    //       role: currentMessage.role,
    //       parts: currentMessage.parts,
    //       createdAt: new Date().toISOString(),
    //       attachments: [],
    //       chatId: currentChatId,
    //     })),
    //   });
    // },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveMessage({
        messages: messages.map((currentMessage) => ({
          id: currentMessage.id,
          role: currentMessage.role,
          parts: currentMessage.parts,
          createdAt: new Date().toISOString(),
          attachments: [],
          chatId: currentChatId,
        })),
      });
    },
  });
}
