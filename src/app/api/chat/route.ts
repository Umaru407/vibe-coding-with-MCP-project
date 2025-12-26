import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error("API Key is missing.");
  }

  const google = createGoogleGenerativeAI({
    apiKey: false ? "test" : geminiApiKey,
  });

  const result = streamText({
    model: google("gemini-2.5-flash-lite"),
    messages: convertToModelMessages(messages),
  });

  console.log("result", result);

  return result.toUIMessageStreamResponse();
}
