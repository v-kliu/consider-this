// Componene that logs message details to backend whenever a new message is created

"use client";

// Import necessary modules and utilities
import { useEffect } from "react";
import { addMessageToConversation } from "@/utils/supabaseClient";
import * as R from "remeda";

// Define the props for the MessageLogger component
interface MessageLoggerProps {
  role: string;
  content: string;
  conversationId: string;
  messageIndex: number;
  attributes: Record<string, number>;
}

// Define the MessageLogger component
const MessageLogger = ({ role, content, conversationId, messageIndex, attributes }: MessageLoggerProps) => {
  useEffect(() => {
    // Process the top 3 attributes and format them to 2 significant figures
    const top3Dict = R.pipe(
      attributes,
      R.entries(),
      R.sortBy(R.pathOr([1], 0)),
      R.reverse(),
      R.take(3),
      R.reduce((acc, [key, value]) => {
        acc[key] = value.toFixed(2); // Format to 2 significant figures and convert to string
        return acc;
      }, {} as Record<string, string>)
    );

    // Define an async function to update the message
    const updateMessage = async () => {
      if (role && content) {
        // Create the message content based on the role
        const messageContent = role === "user"
          ? { from: role, from_content: content, from_attributes: top3Dict }
          : { to: role, to_content: content, to_attributes: top3Dict };
        
        // Update the message in the conversation
        await addMessageToConversation(conversationId, messageIndex, messageContent);
      }
    };

    // Call the updateMessage function
    updateMessage();
  }, [role, content, conversationId, messageIndex, attributes]);

  return null; // This component does not render anything visible
};

export default MessageLogger;
