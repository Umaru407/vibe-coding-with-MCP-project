"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Send } from "lucide-react";
import { DefaultChatTransport } from "ai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 ">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <h2 className="text-2xl font-semibold mb-2">開始與 AI 對話</h2>
            <p>輸入訊息開始聊天</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <div className="text-sm font-semibold mb-1">
                {message.role === "user" ? "你" : "AI 助手"}
              </div>
              <div className="whitespace-pre-wrap">
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return <div key={`${message.id}-${i}`}>{part.text}</div>;
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput("");
        }}
        className="flex gap-2 sticky bottom-4 "
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder="輸入訊息..."
          className="dark:bg-background bg-background"
          // className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button type="submit" disabled={!input.trim()}>
          <Send size={20} />
          發送
        </Button>
      </form>
    </div>
  );
}
