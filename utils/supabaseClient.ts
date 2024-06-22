import { InsertConversationPayload } from '@/types/types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or anonymous key is not defined");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const insertConversation = async (payload: InsertConversationPayload) => {
  const { data, error } = await supabase
    .from('conversations')
    .insert([payload]);

  if (error) {
    throw error;
  }
  return data;
};
