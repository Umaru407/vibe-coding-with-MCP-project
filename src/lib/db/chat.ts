import { pool } from "@/lib/db";
import type { Chat, ChatMessage, SaveMessageInput } from "@/types/chat";

/**
 * 建立新的聊天對話
 */
export async function createChat(
  userId: string,
  title: string = "新對話"
): Promise<Chat> {
  const result = await pool.query<Chat>(
    "INSERT INTO chat (user_id, title) VALUES ($1, $2) RETURNING *",
    [userId, title]
  );
  return result.rows[0];
}

/**
 * 取得使用者的所有聊天對話
 */
export async function getUserChats(userId: string): Promise<Chat[]> {
  const result = await pool.query<Chat>(
    "SELECT * FROM chat WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
}

/**
 * 取得特定聊天對話（含權限驗證）
 */
export async function getChatById(
  chatId: string,
  userId: string
): Promise<Chat | null> {
  const result = await pool.query<Chat>(
    "SELECT * FROM chat WHERE id = $1 AND user_id = $2",
    [chatId, userId]
  );
  return result.rows[0] || null;
}

/**
 * 更新聊天標題
 */
export async function updateChatTitle(
  chatId: string,
  userId: string,
  title: string
): Promise<Chat | null> {
  const result = await pool.query<Chat>(
    "UPDATE chat SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [title, chatId, userId]
  );
  return result.rows[0] || null;
}

/**
 * 刪除聊天對話（會自動刪除相關訊息，因為有 foreign key cascade）
 */
export async function deleteChat(
  chatId: string,
  userId: string
): Promise<boolean> {
  const result = await pool.query(
    "DELETE FROM chat WHERE id = $1 AND user_id = $2",
    [chatId, userId]
  );
  return result.rowCount !== null && result.rowCount > 0;
}

/**
 * 儲存訊息到資料庫
 */
export async function saveMessage(
  chatId: string,
  message: SaveMessageInput
): Promise<ChatMessage> {
  const result = await pool.query<ChatMessage>(
    `INSERT INTO message (chat_id, role, parts, attachments) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [
      chatId,
      message.role,
      JSON.stringify(message.parts),
      JSON.stringify(message.attachments || []),
    ]
  );
  return result.rows[0];
}

/**
 * 取得聊天的所有訊息
 */
export async function getChatMessages(
  chatId: string,
  userId: string
): Promise<ChatMessage[]> {
  // 先驗證使用者是否有權限存取這個聊天
  const chat = await getChatById(chatId, userId);
  if (!chat) {
    throw new Error("Chat not found or access denied");
  }

  const result = await pool.query<ChatMessage>(
    "SELECT * FROM message WHERE chat_id = $1 ORDER BY created_at ASC",
    [chatId]
  );
  return result.rows;
}
