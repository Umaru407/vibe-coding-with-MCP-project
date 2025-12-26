"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
import { WeatherCard } from "@/components/weather-card";

export default function ChatDetailPage() {
  const params = useParams();
  const chatId = params.id as string;
  const [input, setInput] = useState("");
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const { messages, sendMessage, error, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    async onFinish({ message }) {
      // 當收到助理回應後，儲存到資料庫
      if (message.role === "assistant") {
        try {
          await fetch(`/api/chats/${chatId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: message.role,
              parts: message.parts,
              attachments: [],
            }),
          });
        } catch (error) {
          console.error("Failed to save assistant message:", error);
        }
      }
    },
  });

  // 載入歷史訊息
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/chats/${chatId}`);
        if (response.ok) {
          const data = await response.json();
          // 將資料庫訊息轉換為 UI 訊息格式
          const formattedMessages: UIMessage[] = data.messages.map(
            (msg: any) => ({
              id: msg.id,
              role: msg.role,
              parts: msg.parts,
            })
          );
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [chatId, setMessages]);

  const handleSubmit = (message: PromptInputMessage) => {
    sendMessage(
      { text: message.text },
      {
        body: {
          chatId, // 在發送訊息時傳遞 chatId
        },
      }
    );
    setInput("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">載入中...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full max-w-4xl mx-auto p-4 gap-4">
      <Conversation>
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="開始與 AI 對話"
              description="輸入訊息開始聊天"
            />
          ) : (
            messages.map((message) => {
              return (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    {message.role === "user" ? (
                      // 使用者訊息：直接顯示文字內容
                      <>
                        {message.parts
                          ?.filter((part) => part.type === "text")
                          .map((part, idx) => (
                            <span key={idx}>{part.text}</span>
                          ))}
                      </>
                    ) : (
                      // AI 訊息：處理文字和工具調用
                      <>
                        {/* 顯示文字部分 */}
                        {message.parts
                          ?.filter((part) => part.type === "text")
                          .map((part) => part.text)
                          .join("") && (
                          <MessageResponse>
                            {message.parts
                              ?.filter((part) => part.type === "text")
                              .map((part) => part.text)
                              .join("")}
                          </MessageResponse>
                        )}

                        {/* 顯示工具調用結果 */}
                        {message.parts?.map((part, idx) => {
                          if (
                            part.type === "tool-displayWeather" &&
                            part.state === "output-available"
                          ) {
                            return (
                              <WeatherCard
                                key={idx}
                                data={
                                  part.output as {
                                    weather: string;
                                    temperature: number;
                                    location: string;
                                  }
                                }
                              />
                            );
                          }
                          return null;
                        })}
                      </>
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
