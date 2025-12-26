export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  role: string;
  parts: any; // JSON - storing message parts from AI SDK
  attachments: any; // JSON - storing file attachments
  created_at: string;
}

export interface CreateChatInput {
  title: string;
}

export interface SaveMessageInput {
  role: string;
  parts: any;
  attachments?: any;
}
