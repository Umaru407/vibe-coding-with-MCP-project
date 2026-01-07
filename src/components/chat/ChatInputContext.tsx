"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { PromptInputMessage } from "@/components/ai-elements/prompt-input";

interface ChatInputContextType {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  registerSubmitHandler: (
    handler: (message: PromptInputMessage) => void,
  ) => void;
  onSubmit: (message: PromptInputMessage) => void;
}

const ChatInputContext = createContext<ChatInputContextType | undefined>(
  undefined,
);

export function ChatInputProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitHandler, setSubmitHandler] = useState<
    ((message: PromptInputMessage) => void) | null
  >(null);

  const registerSubmitHandler = useCallback(
    (handler: (message: PromptInputMessage) => void) => {
      setSubmitHandler(() => handler);
    },
    [],
  );

  const onSubmit = useCallback(
    (message: PromptInputMessage) => {
      if (submitHandler) {
        submitHandler(message);
      } else {
        console.warn("No submit handler registered for ChatInput");
      }
    },
    [submitHandler],
  );

  return (
    <ChatInputContext.Provider
      value={{
        input,
        setInput,
        isLoading,
        setIsLoading,
        registerSubmitHandler,
        onSubmit,
      }}
    >
      {children}
    </ChatInputContext.Provider>
  );
}

export function useChatInputContext() {
  const context = useContext(ChatInputContext);
  if (context === undefined) {
    throw new Error(
      "useChatInputContext must be used within a ChatInputProvider",
    );
  }
  return context;
}
