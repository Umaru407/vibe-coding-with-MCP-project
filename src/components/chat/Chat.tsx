"use client";

import { useChat } from "@ai-sdk/react";
import { motion } from "motion/react";
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
import WeatherCard from "@/components/WeatherCard";
import { useChatInputContext } from "./ChatInputContext";
import { generateUUID } from "@/lib/utils";
import { GoogleWeatherData } from "@/types/weather";

export default function Chat({
  id,
  initialMessages,
}: {
  id?: string;
  initialMessages?: UIMessage[];
}) {
  const queryClient = useQueryClient();
  const { messages, sendMessage, error, status } = useChat<UIMessage>({
    id,
    generateId: generateUUID,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest(request) {
        return {
          body: {
            chatId: request.id,
            message: request.messages.at(-1),
            ...request.body,
          },
        };
      },
    }),
    messages: initialMessages,
    onFinish: (_response) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  const { setInput, setIsLoading, registerSubmitHandler } =
    useChatInputContext();

  const router = useRouter();
  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // When user navigates back/forward, refresh to sync with URL
      console.log("handlePopState");
      router.refresh();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  // Sync loading status
  useEffect(() => {
    setIsLoading(status === "streaming" || status === "submitted");
  }, [status, setIsLoading]);

  const handleSubmit = (
    // e: React.FormEvent<HTMLFormElement>,
    message: PromptInputMessage,
  ) => {
    const currentPath = window.location.pathname;

    // 如果是新對話 List 樂觀更新
    if (id && currentPath === "/chat") {
      window.history.pushState({}, "", `/chat/${id}`);
      console.log("pushState");

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

  // Register the submit handler so the context can call it
  useEffect(() => {
    registerSubmitHandler(handleSubmit);
  }, [registerSubmitHandler, messages, id, sendMessage, queryClient]); // Dependencies might need tuning, but handleSubmit is stable enough if we didn't use closure variables... wait, handleSubmit USES closure variables. so we do need to re-register.

  return (
    <motion.div
      className="mx-auto flex h-full w-full flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Conversation>
        <ConversationContent className="mx-auto max-w-4xl p-4 *:last:mb-10">
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
                        <div className="flex max-w-full min-w-0 flex-col gap-1 overflow-hidden">
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
                            // 工具執行成功
                            if (
                              part.type === "tool-displayWeather" &&
                              part.state === "output-available"
                            ) {
                              return (
                                <WeatherCard
                                  key={idx}
                                  weatherData={part.output as GoogleWeatherData}
                                />
                              );
                            }
                            // 工具執行失敗
                            if (
                              part.type === "tool-displayWeather" &&
                              part.state === "output-error"
                            ) {
                              return (
                                <div
                                  key={idx}
                                  className="border-destructive/50 bg-destructive/10 text-destructive rounded-xl border p-4"
                                >
                                  <h4 className="font-semibold">
                                    天氣查詢失敗
                                  </h4>
                                  <p className="text-sm opacity-70">
                                    {part.errorText ||
                                      "無法取得天氣資訊，請稍後再試"}
                                  </p>
                                </div>
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
                  <div className="flex max-w-full min-w-0 flex-col gap-1 overflow-hidden">
                    {/* Placeholder or empty div to maintain layout */}
                  </div>
                </div>
              </MessageContent>
            </Message>
          )}

          {status === "error" && (
            <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-xl border p-4">
              <h3 className="text-destructive mb-2 font-bold">Error</h3>
              <p className="text-xs opacity-70">{error?.message}</p>
            </div>
          )}
        </ConversationContent>

        <ConversationScrollButton />
      </Conversation>
    </motion.div>
  );
}
