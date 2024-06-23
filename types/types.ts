export interface MessageContent {
  from?: string;
  from_content?: string;
  from_attributes?: {};
  to?: string;
  to_content?: string;
  to_attributes?: {};
  conversation_context?: string;
}

export interface Conversation {
  [key: number]: MessageContent;
}

export interface InsertConversationPayload {
  conversation: Conversation;
  participants: string[];
}

export interface Msg {
  type: string;
  message: {
    role: string;
    content: string;
  };
  models?: {
    prosody?: {
      scores?: Record<string, any>;
    };
  };
}