import {
  streamText,
  UIMessage,
  convertToModelMessages,
  generateId,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { tools } from "@/lib/ai/tools";
import {
  saveMessage,
  getChatById,
  saveChat,
  getChatMessages,
} from "@/lib/db/chat";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateTitleFromUserMessage } from "@/app/actions/ai";
import { convertToUIMessages, generateUUID } from "@/lib/utils";

export async function POST(req: Request) {
  const { chatId, message }: { chatId: string; message: UIMessage } =
    await req.json();

  try {
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openrouterApiKey) {
      throw new Error("API Key is missing.");
    }

    // 並行化獨立的異步操作：驗證使用者和取得 chat
    const [session, chat] = await Promise.all([
      auth.api.getSession({
        headers: await headers(),
      }),
      getChatById(chatId),
    ]);

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 如果有 chatId，驗證使用者是否有權限存取
    if (chat) {
      if (chat.userId !== session.user.id) {
        return new Response("Unauthorized", { status: 401 });
      }
    } else {
      // 新對話 - 使用臨時標題，背景生成真正的標題
      // 先建立聊天記錄以便立即開始對話
      await saveChat({
        chatId: chatId,
        userId: session.user.id,
        title: "New chat",
      });

      // 背景生成標題並更新（不阻塞串流回應）
      generateTitleFromUserMessage(message).then((title) => {
        // 異步更新標題，不等待結果
        saveChat({
          chatId: chatId,
          userId: session.user.id,
          title: title,
        }).catch((error) => {
          console.error("Failed to update chat title:", error);
        });
      });
    }

    // 先儲存使用者訊息
    await saveMessage({
      messages: [
        {
          id: message.id,
          createdAt: new Date().toISOString(),
          role: "user",
          parts: message.parts,
          attachments: [],
          chatId: chatId,
        },
      ],
    });

    // 然後取得包含新訊息的完整歷史
    const chatMessages = await getChatMessages(chatId);

    const uiMessages = convertToUIMessages(chatMessages);

    const openrouter = createOpenRouter({
      apiKey: openrouterApiKey,
    });

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const result = streamText({
          model: openrouter.chat("google/gemini-2.5-flash-lite"),
          messages: convertToModelMessages(uiMessages),
          tools,
        });

        result.consumeStream();

        writer.merge(result.toUIMessageStream());
      },
      generateId: generateUUID,

      onError: (error) => {
        console.error("Stream error:", error);
        return "An unknown error occurred.";
      },
      onFinish: async ({ messages }) => {
        await saveMessage({
          messages: messages.map((currentMessage) => ({
            id: currentMessage.id,
            role: currentMessage.role,
            parts: currentMessage.parts,
            createdAt: new Date().toISOString(),
            attachments: [],
            chatId: chatId,
          })),
        });
      },
    });

    return createUIMessageStreamResponse({
      status: 200,
      statusText: "OK",
      headers: {
        "Custom-Header": "value",
      },
      stream: stream,
    });
  } catch (error) {
    console.error("Error in chat POST request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
