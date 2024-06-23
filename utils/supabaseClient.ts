import { createClient } from '@supabase/supabase-js';
import fetchConversationData from './fetchConversationData';
import formatConversation from './formatConversation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or anonymous key is not defined");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface MessageAttributes {
  [key: string]: string;
}

export interface MessageContent {
  from?: string;
  from_content?: string;
  from_attributes?: MessageAttributes;
  to?: string;
  to_content?: string;
  to_attributes?: MessageAttributes;
}

export interface ConversationData {
  id: string;
  conversation: { [key: number]: MessageContent };
  participants: string[];
}

export interface InsertConversationPayload {
  conversation: { [key: number]: MessageContent };
  participants: string[];
}

export const insertNewConversation = async (): Promise<ConversationData[]> => {
  const payload: InsertConversationPayload = {
    conversation: {},
    participants: [],
  };

  const { data, error } = await supabase
    .from('conversations')
    .insert([payload])
    .select();

  if (error) {
    throw error;
  }
  return data as ConversationData[];
};

export const addMessageToConversation = async (
  conversationId: string,
  messageId: number,
  messageContent: Partial<MessageContent> = {}
): Promise<ConversationData[]> => {
  // Fetch the current conversation
  const { data: conversationData, error: fetchError } = await supabase
    .from('conversations')
    .select('conversation')
    .eq('id', conversationId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  // Function to truncate content after '{'
  const truncateContent = (content: string | undefined): string | undefined => {
    if (content && content.includes('{')) {
      return content.split('{')[0];
    }
    return content;
  };

  // Apply truncation to the messageContent fields
  const truncatedMessageContent = {
    ...messageContent,
    from_content: truncateContent(messageContent.from_content),
    to_content: truncateContent(messageContent.to_content),
  };

  // Add or update message in the conversation
  const updatedConversation = {
    ...conversationData.conversation,
    [messageId]: {
      ...conversationData.conversation[messageId],
      ...truncatedMessageContent,
    },
  };

  const { data, error } = await supabase
    .from('conversations')
    .update({ conversation: updatedConversation })
    .eq('id', conversationId)
    .select();

  if (error) {
    throw error;
  }
  return data as ConversationData[];
};

export const updateFormattedConversation = async (
  conversationId: string,
  formattedConversation: string
): Promise<ConversationData[]> => {
  // Fetch the current conversation context
  const { data: currentData, error: fetchError } = await supabase
    .from('conversations')
    .select('conversation_context')
    .eq('id', conversationId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  // Add new conversation_context
  const updatedContext = formattedConversation;

  const { data, error } = await supabase
    .from('conversations')
    .update({
      conversation: {}, // Clear the conversation column
      conversation_context: updatedContext
    })
    .eq('id', conversationId)
    .select();

  if (error) {
    throw error;
  }
  return data as ConversationData[];
};

export const handleEndCall = async (conversationId: string, disconnect: () => void) => {
  const conversationData = await fetchConversationData(conversationId);
  const formattedConversation = formatConversation(conversationData);
  console.log('Formatted Conversation:', formattedConversation); // For debugging

  // Update the conversation in Supabase
  await updateFormattedConversation(conversationId, formattedConversation);

  // Call the disconnect function
  disconnect();
};

export const updateLastMessage = async (
  conversationId: string,
  lastMessage: string
): Promise<void> => {
  const { error } = await supabase
    .from('conversations')
    .update({ last_message: lastMessage })
    .eq('id', conversationId);

  if (error) {
    throw error;
  }
};

export const fetchConversationContextAndLastMessage = async (
  conversationId: string
): Promise<string> => {
  const { data, error } = await supabase
    .from('conversations')
    .select('conversation_context, last_message')
    .eq('id', conversationId)
    .single();

  if (error) {
    throw error;
  }

  const result = {
    conversationContext: data.conversation_context,
    lastMessage: data.last_message,
  };

  // Convert everything to a string
  const resultString = JSON.stringify(result);

  return resultString;
};

export const clearConversationContext = async (conversationId: string): Promise<void> => {
  const { error } = await supabase
    .from('conversations')
    .update({ conversation_context: '' })
    .eq('id', conversationId);

  if (error) {
    throw error;
  }
};
