import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserChats, createChat } from "@/lib/db/chat";
import { headers } from "next/headers";

/**
 * GET /api/chats
 * 取得當前使用者的所有聊天對話
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await getUserChats(session.user.id);
    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chats
 * 建立新的聊天對話
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title } = body;

    const chat = await createChat(session.user.id, title || "新對話");
    return NextResponse.json({ chat }, { status: 201 });
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}
