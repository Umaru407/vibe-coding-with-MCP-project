"use client";

import {
  PromptInput,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { useChatInputContext } from "./ChatInputContext";

export function ChatInput() {
  const { input, setInput, onSubmit } = useChatInputContext();

  return (
    <div className="before:from-background w-full px-4 pb-4 before:pointer-events-none before:absolute before:bottom-full before:left-0 before:h-24 before:w-full before:bg-linear-to-t before:from-0% before:to-transparent before:to-80% before:content-[''] md:px-12 md:pb-6">
      <PromptInput onSubmit={onSubmit}>
        <PromptInputTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入訊息..."
        />
      </PromptInput>
    </div>
  );
}
