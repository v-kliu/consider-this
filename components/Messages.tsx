"use client";
import { cn } from "@/utils";
import { useVoice } from "@humeai/voice-react";
import Expressions from "./Expressions";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentRef, forwardRef } from "react";
import MessageLogger from "./MessageLogger";

const Messages = forwardRef<
  ComponentRef<typeof motion.div>,
  { conversationId: string }
>(function Messages({ conversationId }, ref) {
  const { messages } = useVoice();

  return (
        <AnimatePresence mode={"popLayout"}>
          {messages.map((msg, index) => {
            if (
              msg.type === "user_message" ||
              msg.type === "assistant_message"
            ) {
              
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
                    {msg.message.role}
                  </div>
                  <div className={"pb-3 px-3"}>{msg.message.content}</div>
                  <Expressions values={msg.models.prosody?.scores ?? {}} />
                  <MessageLogger role={msg.message.role} content={msg.message.content} attributes={msg.models.prosody?.scores ?? {}} conversationId={conversationId} messageIndex={index -2} />
                </motion.div>
              );
            }
            return null;
          })}
        </AnimatePresence> 
  );
});

export default Messages;
