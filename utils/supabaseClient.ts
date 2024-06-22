// supabaseUtils.ts
import { InsertConversationPayload, MessageContent } from '@/types/types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or anonymous key is not defined");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface ConversationData {
  id: string;
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
  messageContent: MessageContent
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

  // Add new message to the conversation
  const updatedConversation = {
    ...conversationData.conversation,
    [messageId]: messageContent,
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