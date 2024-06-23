"use client";
import { cn } from "@/utils";
import { useVoice } from "@humeai/voice-react";
import Expressions from "./Expressions";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentRef, forwardRef, useEffect } from "react";
import { addMessageToConversation } from "@/utils/supabaseClient";

const Messages = forwardRef<
  ComponentRef<typeof motion.div>,
  { conversationId: string }
>(function Messages({ conversationId }, ref) {
  const { messages } = useVoice();
  
  useEffect(() => {
    const handleMessages = async () => {
      for (let index = 0; index < messages.length; index++) {
        const msg = messages[index];
        if (msg.type === "user_message" || msg.type === "assistant_message") {
          const { role, content } = msg.message;
          const messageContent = role === "user" ? { from: role, from_content: content } : { to: role, to_content: content };

          // Add or update the message in the conversation
          await addMessageToConversation(conversationId, index, messageContent);
        }
      }
    };

    handleMessages();
  }, [messages, conversationId]);

  return (
    <motion.div
      layoutScroll
      className={"grow rounded-md overflow-auto p-4"}
      ref={ref}
    >
      <motion.div
        className={"max-w-2xl mx-auto w-full flex flex-col gap-4 pb-24"}
      >
        <AnimatePresence mode={"popLayout"}>
          {messages.map((msg, index) => {
            if (
              msg.type === "user_message" ||
              msg.type === "assistant_message"
            ) {
              
              // Store the message content and role in variables
              const { role, content } = msg.message;
              
              return (
                <motion.div
                  key={msg.type + index}
                  className={cn(
                    "w-[80%]",
                    "bg-card",
                    "border border-border rounded",
                    msg.type === "user_message" ? "ml-auto" : ""
                  )}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 0,
                  }}
                >
                  <div
                    className={cn(
                      "text-xs capitalize font-medium leading-none opacity-50 pt-4 px-3"
                    )}
                  >
                    {role}
                  </div>
                  <div className={"pb-3 px-3"}>{content}</div>
                  <Expressions values={msg.models.prosody?.scores ?? {}} />
                </motion.div>
              );
            }

            return null;
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

export default Messages;
