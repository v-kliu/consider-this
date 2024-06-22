"use client";

import { useState, useRef, ComponentRef } from "react";
import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";

import { MessageContent, InsertConversationPayload } from "@/types/types";
import { insertConversation } from "@/utils/supabaseClient";

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const [started, setStarted] = useState(false);
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

  const handleStart = async () => {
    // Define the messages
    const message1: MessageContent = {
      from: "Lucas",
      from_content: "I love you!",
      from_attributes: "heartfelt, excited, happy",
      to: "Victor",
      to_content: "That's crazy dawg",
      to_attributes: "confused, amused, entertained",
    };

    const message2: MessageContent = {
      from: "Victor",
      from_content: "Really? Tell me more!",
      from_attributes: "curious, excited, happy",
      to: "Lucas",
      to_content: "Of course, I will!",
      to_attributes: "confident, happy, enthusiastic",
    };

    // Define the conversation structure
    const conversation = {
      0: message1,
      1: message2,
    };

    const payload: InsertConversationPayload = {
      conversation,
      participants: ["Lucas", "Victor"],
    };

    try {
      const data = await insertConversation(payload);
      console.log('Conversation inserted successfully:', data);
    } catch (error) {
      console.error('Error inserting conversation:', error);
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
