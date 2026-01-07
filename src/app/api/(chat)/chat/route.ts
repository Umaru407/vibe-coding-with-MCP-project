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
    // 驗證使用者
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const chat = await getChatById(chatId);

    // 如果有 chatId，驗證使用者是否有權限存取
    if (chat) {
      if (chat.userId !== session.user.id) {
        return new Response("Unauthorized", { status: 401 });
      }
    } else {
      //new chat
      const title = await generateTitleFromUserMessage(message);
      await saveChat({
        chatId: chatId,
        userId: session.user.id,
        title: title,
      });
    }
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

    const uiMessages = convertToUIMessages(await getChatMessages(chatId));

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
