export interface MessageContent {
    from: string;
    from_content: string;
    from_attributes: string;
    to: string;
    to_content: string;
    to_attributes: string;
  }
  
  export interface Conversation {
    [key: number]: MessageContent;
  }
  
  export interface InsertConversationPayload {
    conversation: Conversation;
    participants: string[];
  }