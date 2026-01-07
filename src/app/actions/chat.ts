"use server";

import { auth } from "@/lib/auth";
import { getUserChats } from "@/lib/db/chat";
import { headers } from "next/headers";

// const PAGE_SIZE = 20;

export async function getUserChatsAction(offset: number, pageSize: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  const chats = await getUserChats(session.user.id, pageSize, offset);
  return chats;
}
