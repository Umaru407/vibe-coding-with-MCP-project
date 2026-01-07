"use client";

import Chat from "@/components/chat/Chat";
import { generateUUID } from "@/lib/utils";

export default function NewChatPage() {
  const id = generateUUID();

  return <Chat id={id} />;
}
