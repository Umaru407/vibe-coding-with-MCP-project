import { auth } from "@/lib/auth";
import { getUserChats } from "@/lib/db/chat";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * GET /api/history
 * 取得當前使用者的所有聊天歷史記錄
 */
export async function GET() {
  try {
    // 驗證使用者身份
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 取得使用者的所有聊天記錄
    const chats = await getUserChats(session.user.id);

    return NextResponse.json({
      chats,
      total: chats.length,
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
