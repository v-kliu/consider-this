import { supabase } from "./supabaseClient";


const fetchConversationData = async (conversationId: string): Promise<any | null> => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (error) {
    console.error('Error fetching conversation data:', error);
    return null;
  }

  return data.conversation;
};

export default fetchConversationData;
