"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AiStatusIndicator } from "./AiStatusIndicator";
import { useQueryClient } from "@tanstack/react-query";
import type { Chat as ChatType } from "@/types/db";
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

export default function Chat({
  id,
  initialMessages,
}: {
  id?: string;
  initialMessages?: UIMessage[];
}) {
  const queryClient = useQueryClient();
  const { messages, sendMessage, error, status, setMessages } =
    useChat<UIMessage>({
      id,
      transport: new DefaultChatTransport({
        api: `/api/chat/${id}`,
      }),
      messages: initialMessages,
      onFinish: (_response) => {
        queryClient.invalidateQueries({ queryKey: ["chats"] });
      },
    });

  const [input, setInput] = useState("");

  const router = useRouter();
  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // When user navigates back/forward, refresh to sync with URL
      router.refresh();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  const handleSubmit = (
    // e: React.FormEvent<HTMLFormElement>,
    message: PromptInputMessage
  ) => {
    const currentPath = window.location.pathname;

    // 如果是新對話 List 樂觀更新
    if (id && currentPath === "/chat") {
      window.history.pushState({}, "", `/chat/${id}`);

      queryClient.setQueryData(["chats"], (oldData: any) => {
        if (!oldData) return oldData;

        const newChat: ChatType = {
          id: id,
          title: "New chat",
          createdAt: new Date(),
          userId: "",
        };

        // 將新對話插入到第一頁的最前面
        const newPages = [...oldData.pages];
        if (newPages.length > 0) {
          newPages[0] = [newChat, ...newPages[0]];
        } else {
          newPages[0] = [newChat];
        }

        return {
          ...oldData,
          pages: newPages,
        };
      });
    }

    sendMessage({ text: message.text });
    setInput("");
  };

  return (
    <div className="flex flex-col w-full h-full mx-auto ">
      <Conversation>
        <ConversationContent className="max-w-4xl mx-auto p-4 *:last:mb-10">
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="開始與 AI 對話"
              description="輸入訊息開始聊天"
            />
          ) : (
            messages.map((message, idx) => {
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
                      <div className="flex flex-row items-start gap-4">
                        <AiStatusIndicator
                          status={
                            idx === messages.length - 1 &&
                            status === "streaming"
                              ? "streaming"
                              : "completed"
                          }
                        />
                        <div className="flex flex-col gap-1 overflow-hidden min-w-0 max-w-full">
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
                        </div>
                      </div>
                    )}
                  </MessageContent>
                </Message>
              );
            })
          )}

          {(status === "submitted" ||
            (status === "streaming" &&
              messages[messages.length - 1]?.role === "user")) && (
            <Message from="assistant">
              <MessageContent>
                <div className="flex flex-row items-start gap-4">
                  <AiStatusIndicator status="streaming" />
                  <div className="flex flex-col gap-1 overflow-hidden min-w-0 max-w-full">
                    {/* Placeholder or empty div to maintain layout */}
                  </div>
                </div>
              </MessageContent>
            </Message>
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

      <div className="sticky w-full bottom-0 z-10 px-4 pb-4 md:px-12 md:pb-6 before:absolute before:bottom-full before:left-0 before:w-full before:h-24 before:bg-linear-to-t before:from-background before:from-5% before:to-transparent before:to-80% before:content-[''] before:pointer-events-none">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="輸入訊息..."
          />
        </PromptInput>
      </div>
    </div>
  );
}
