import { pool } from "@/lib/db";
import { Chat, Message } from "@/types/db";
// import type { Chat, ChatMessage, SaveMessageInput } from "@/types/chat";

/**
 * 建立新的聊天對話
 */
export async function saveChat({
  chatId,
  userId,
  title = "新對話",
}: {
  chatId: string;
  userId: string;
  title?: string;
}): Promise<Chat> {
  const result = await pool.query<Chat>(
    `INSERT INTO chat ("id", "userId", "title") VALUES ($1, $2, $3) RETURNING *`,
    [chatId, userId, title],
  );
  return result.rows[0];
}

/**
 * 取得使用者的所有聊天對話
 */
export async function getUserChats(
  userId: string,
  limit: number = 20,
  offset: number = 0,
): Promise<Chat[]> {
  const result = await pool.query<Chat>(
    `SELECT * FROM chat WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );
  return result.rows;
}

/**
 * 取得特定聊天對話
 */
export async function getChatById(chatId: string): Promise<Chat | null> {
  const result = await pool.query<Chat>(`SELECT * FROM chat WHERE "id" = $1`, [
    chatId,
  ]);
  return result.rows[0] || null;
}

/**
 * 更新聊天標題
 */
export async function updateChatTitle(
  chatId: string,
  userId: string,
  title: string,
): Promise<Chat | null> {
  const result = await pool.query<Chat>(
    `UPDATE chat SET "title" = $1 WHERE "id" = $2 AND "userId" = $3 RETURNING *`,
    [title, chatId, userId],
  );
  return result.rows[0] || null;
}

/**
 * 刪除聊天對話（會自動刪除相關訊息，因為有 foreign key cascade）
 */
export async function deleteChat(
  chatId: string,
  userId: string,
): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM chat WHERE "id" = $1 AND "userId" = $2`,
    [chatId, userId],
  );

  return result.rowCount !== null && result.rowCount > 0;
}

/**
 * 儲存訊息到資料庫
 */
export async function saveMessage(
  chatId: string,
  message: Partial<Message>,
): Promise<Message> {
  const result = await pool.query<Message>(
    `INSERT INTO message ("chatId", "role", "parts", "attachments") 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [
      chatId,
      message.role,
      JSON.stringify(message.parts),
      JSON.stringify(message.attachments || []),
    ],
  );
  return result.rows[0];
}

/**
 * 取得聊天的所有訊息
 */
export async function getChatMessages(chatId: string): Promise<Message[]> {
  // 先驗證使用者是否有權限存取這個聊天
  const chat = await getChatById(chatId);

  if (!chat) {
    throw new Error("Chat not found or access denied");
  }

  const result = await pool.query<Message>(
    `SELECT * FROM message WHERE "chatId" = $1 ORDER BY "createdAt" ASC`,
    [chatId],
  );
  return result.rows;
}
