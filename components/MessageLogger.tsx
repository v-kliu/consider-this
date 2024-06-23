"use client";

import { useEffect } from "react";
import { addMessageToConversation } from "@/utils/supabaseClient";
import * as R from "remeda";

interface MessageLoggerProps {
  role: string;
  content: string;
  conversationId: string;
  messageIndex: number;
  attributes: Record<string, number>;
}

const MessageLogger = ({ role, content, conversationId, messageIndex, attributes }: MessageLoggerProps) => {
  useEffect(() => {

    const top3 = R.pipe(
        attributes,
        R.entries(),
        R.sortBy(R.pathOr([1], 0)),
        R.reverse(),
        R.take(3)
      );

    const top3Dict = top3.reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
    }, {} as Record<string, number>);

    const updateMessage = async () => {
      if (role && content) {
        const messageContent = role === "user" ? { from: role, from_content: content, from_attributes: top3Dict } : { to: role, to_content: content, to_attributes: top3Dict };
        
        // Update the message in the conversation
        await addMessageToConversation(conversationId, messageIndex, messageContent);
      }
    };

    updateMessage();
  }, [role, content, conversationId, messageIndex]);

  return null; // This component does not render anything visible
};

export default MessageLogger;
