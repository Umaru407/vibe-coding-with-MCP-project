"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, error, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleSubmit = (message: PromptInputMessage) => {
    sendMessage({ text: message.text });
    setInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 gap-4">
      <Conversation>
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="開始與 AI 對話"
              description="輸入訊息開始聊天"
            />
          ) : (
            messages.map((message) => {
              // Extract text content from parts to handle multi-modal messages or standard structural changes
              const content = message.parts
                ? message.parts
                    .filter((part) => part.type === "text")
                    .map((part) => part.text)
                    .join("")
                : "";

              return (
                <Message
                  key={message.id}
                  from={message.role === "user" ? "user" : "assistant"}
                >
                  <MessageContent>
                    {message.role === "user" ? (
                      content
                    ) : (
                      <MessageResponse>{content}</MessageResponse>
                    )}
                  </MessageContent>
                </Message>
              );
            })
          )}

          {status === "error" && (
            <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-xl border p-4 ">
              <h3 className="text-destructive mb-2 font-bold">Error</h3>
              <p className=" text-xs opacity-70">{error?.message}</p>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput
        onSubmit={handleSubmit}
        className="sticky bottom-4 bg-background"
      >
        <PromptInputTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入訊息..."
        />
      </PromptInput>
    </div>
  );
}
