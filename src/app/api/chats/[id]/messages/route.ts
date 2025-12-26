import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveMessage, getChatById } from "@/lib/db/chat";
import { headers } from "next/headers";

/**
 * POST /api/chats/[id]/messages
 * 儲存訊息到聊天
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: chatId } = await params;

    // 驗證使用者是否有權限存取這個聊天
    const chat = await getChatById(chatId, session.user.id);
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const body = await req.json();
    const { role, parts, attachments } = body;

    const savedMessage = await saveMessage(chatId, {
      role,
      parts,
      attachments: attachments || [],
    });

    return NextResponse.json({ message: savedMessage }, { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
