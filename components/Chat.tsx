"use client";

import { useState, useRef, ComponentRef } from "react";
import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { HumeClient } from "hume";
import { ConversationData, addMessageToConversation, insertNewConversation } from "@/utils/supabaseClient";

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const [started, setStarted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [configId, setConfigId] = useState<string>('384018bf-9638-4236-a762-f45d589f2c00'); // Initial config ID
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const [client, setClient] = useState<HumeClient | null>(null);

  console.log("Chat:");
  console.log(configId);

  const handleStart = async () => {
    try {
      const conversationData: ConversationData[] = await insertNewConversation();
      if (!conversationData || conversationData.length === 0) {
        throw new Error("Failed to insert new conversation");
      }

      const newConversationId = conversationData[0].id;
      setConversationId(newConversationId);

      // Initialize Hume client
      const humeClient = new HumeClient({
        apiKey: process.env.HUME_API_KEY!,
        secretKey: process.env.HUME_CLIENT_SECRET!,
      });
      setClient(humeClient);

      // const socket = await humeClient.empathicVoice.chat.connect({
      //   configId,
      // });

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
        started && conversationId && (
          <VoiceProvider
            configId={configId}
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
            <Messages ref={ref} conversationId={conversationId} />
            <Controls conversationId={conversationId} configId={configId} setConfigId={setConfigId} setStarted={setStarted} client={client} />
            <StartCall />
          </VoiceProvider>
        )
      }
    </div >
  );
}
