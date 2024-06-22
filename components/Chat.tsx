"use client";

import { useState, useRef, ComponentRef } from "react";
import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { MessageContent } from "@/types/types";
import { ConversationData, addMessageToConversation, insertNewConversation } from "@/utils/supabaseClient";

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const [started, setStarted] = useState(false);
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

  const handleStart = async () => {
    try {
      // Insert a new conversation
      console.log('Inserting new conversation...');

      const conversationData: ConversationData[] = await insertNewConversation();
      if (!conversationData || conversationData.length === 0) {
        throw new Error("Failed to insert new conversation");
      }

      console.log('New conversation inserted successfully:', conversationData);

      // Get the conversation ID
      console.log('Getting conversation ID...');
      const conversationId = conversationData[0].id;
      console.log('Conversation ID:', conversationId);

      // Add an empty message to the conversation
      console.log('Adding empty message to the conversation...');
      await addMessageToConversation(conversationId, 0);
      console.log('Empty message added successfully to the conversation');

      // Define partial message content to update
      const message1: Partial<MessageContent> = {
        from: "Lucas",
        from_content: "I love you!",
        from_attributes: "heartfelt, excited, happy",
      };

      const message2: Partial<MessageContent> = {
        to: "Victor",
        to_content: "That's crazy dawg",
        to_attributes: "confused, amused, entertained",
      };

      // Update the messages in the conversation
      await addMessageToConversation(conversationId, 0, message1);
      await addMessageToConversation(conversationId, 0, message2);
      await addMessageToConversation(conversationId, 1, message1);
      await addMessageToConversation(conversationId, 1, message2);

      console.log('Messages added successfully to the conversation');

    } catch (error) {
      console.error('Error handling conversation:', error);
    }

    setStarted(true);
  };

  return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px] dark:bg-gray-900"
      }
    >


      
      {!started && (
        <div className="mt-40">
          {/* Project Description */}
          <div className="p-4 bg-gray-100 dark:bg-gray-800 text-center rounded-md mb-4 mx-auto w-3/4">
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Project Luarnisplon</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              This project aims to provide seamless voice interaction through advanced AI technology.
              Experience the next level of communication with our innovative platform.
            </p>
          </div>

          {/* Start Button */}
          <div className="p-4 bg-gray-100 dark:bg-gray-800 text-center rounded-md mb-4 mx-auto w-3/4">
            <button
              onClick={handleStart}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800"
            >
              Start
            </button>
          </div>
        </div>
      )}



      {
        started && (
          <VoiceProvider
            auth={{ type: "accessToken", value: accessToken }}
            onMessage={() => {
              if (timeout.current) {
                window.clearTimeout(timeout.current);
              }

              timeout.current = window.setTimeout(() => {
                if (ref.current) {
                  const scrollHeight = ref.current.scrollHeight;

                  ref.current.scrollTo({
                    top: scrollHeight,
                    behavior: "smooth",
                  });
                }
              }, 200);
            }}
          >
            <Messages ref={ref} />
            <Controls />
            <StartCall />
          </VoiceProvider>
        )
      }
    </div >
  );
}
