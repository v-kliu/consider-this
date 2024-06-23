"use client";

import { useState, useRef, ComponentRef, useEffect } from "react";
import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { HumeClient } from "hume";
import { ConversationData, addMessageToConversation, fetchConversationContextAndLastMessage, insertNewConversation } from "@/utils/supabaseClient";
import logo from './logos/socratesLogo.png';

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const [started, setStarted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [configId, setConfigId] = useState<string>('dabbd347-11ff-46a6-9a94-4117b1f7ccf9'); // Initial config ID
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const [client, setClient] = useState<HumeClient | null>(null);
  const [initialContext, setInitialContext] = useState<string | null>(null);

  useEffect(() => {
    if (configId && conversationId) {
      console.log("I'm fetching context!")
      console.log(conversationId)
      const fetchData = async () => {
        const resultString = await fetchConversationContextAndLastMessage(conversationId);
        setInitialContext(resultString);
      };
      fetchData();
    }
  }, [configId, conversationId]);

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
      
      <div className="relative grow flex flex-col mx-auto w-full h-screen overflow-hidden dark:bg-gray-900 bg-[#F4EDD8]">
        {!started && (
        <div className="flex flex-col items-center p-4 justify-center h-full mt-[-5%]">
          <div className="text-center">
            {/* Logo */}
            <img src={logo.src} alt="Logo" className="mx-auto mb-4" style={{ width: '125px', height: '125px' }} />

            <h1 className="text-4xl font-semibold mb-4 leading-relaxed text-black">Lesson 1: AI </h1>
            {/* <CustomTypingEffect
              lines={[
                "Facilitate open discussions and gain diverse viewpoints with our AI Socratic Seminar platform."
              ]}
              speed={100}
              eraseDelay={2000}
              typingDelay={200}
              pauseDelay={4000}
            /> */}
            <div className="text-sm text-stone-400 mx-auto p-4 leading-loose">
              Challenge what you know (and what you don't!) <br/> with our AI Socratic Seminar platform!
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleStart}
              className="bg-[#ee8822] text-black py-2 px-4 rounded-sm border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1),8px_8px_0px_rgba(0,0,0,0.25)] hover:bg-[#b3c8e3] hover:shadow-[2px_2px_0px_rgba(0,0,0,1),4px_4px_0px_rgba(0,0,0,0.25)] hover:translate-x-1 hover:translate-y-1 dark:bg-[#a2b8d4] dark:hover:bg-[#90a7c5] font-bold transition-transform duration-150"
            >
              Start
            </button>
          </div>
        </div>
        )}



      {
        started && conversationId && initialContext &&(
          <VoiceProvider
            sessionSettings={{ context: { text: initialContext, type: 'temporary' } }}
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
