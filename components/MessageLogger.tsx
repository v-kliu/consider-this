"use client";

import { useEffect } from "react";
import { addMessageToConversation } from "@/utils/supabaseClient";

interface MessageLoggerProps {
  role: string;
  content: string;
  conversationId: string;
  messageIndex: number;
}

const MessageLogger = ({ role, content, conversationId, messageIndex }: MessageLoggerProps) => {
  useEffect(() => {
    const updateMessage = async () => {
      if (role && content) {
        console.log("Role:", role);
        console.log("Content:", content);
        const messageContent = role === "user" ? { from: role, from_content: content } : { to: role, to_content: content };
        
        // Update the message in the conversation
        await addMessageToConversation(conversationId, messageIndex, messageContent);
      }
    };

    updateMessage();
  }, [role, content, conversationId, messageIndex]);

  return null; // This component does not render anything visible
};

export default MessageLogger;
