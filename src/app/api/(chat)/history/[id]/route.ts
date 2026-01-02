import { auth } from "@/lib/auth";
import { deleteChat } from "@/lib/db/chat";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * DELETE /api/history/[id]
 * 刪除指定的聊天記錄
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 驗證使用者身份
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: chatId } = await params;

    // 刪除聊天記錄
    const deleted = await deleteChat(chatId, session.user.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Chat not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
