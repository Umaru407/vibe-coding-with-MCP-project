import { titlePrompt } from "@/lib/ai/prompts";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText, UIMessage } from "ai";
const openrouterApiKey = process.env.OPENROUTER_API_KEY;
if (!openrouterApiKey) {
  throw new Error("API Key is missing.");
}
const openrouter = createOpenRouter({
  apiKey: openrouterApiKey,
});

//   const result = streamText({
//     model: openrouter.chat("google/gemini-2.5-flash-lite"),
export function getTextFromMessage(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part as { type: "text"; text: string }).text)
    .join("");
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  const { text: title } = await generateText({
    model: openrouter.chat("google/gemini-2.5-flash-lite"),
    system: titlePrompt,
    prompt: getTextFromMessage(message),
  });

  return title;
}
