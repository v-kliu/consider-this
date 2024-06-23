"use client";

import { useState, useRef, useEffect, ComponentRef } from "react";
import { VoiceProvider } from "@humeai/voice-react";
import ChatBox from "./ChatBox";
import logo from './logos/socratesLogo.png';
import CustomTypingEffect from './CustomTypingEffect';

import { Footer } from "./Footer";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { HumeClient } from "hume";
import { ConversationData, fetchConversationContextAndLastMessage, insertNewConversation } from "@/utils/supabaseClient";
import AgentComponent from "./Agent";

const CONFIG_ONE = "5a0c849f-bf21-4f9d-97f0-958ff8619fba";
const CONFIG_TWO = "dbe866f5-2bb7-44df-a73c-846feb59f4ec";

export default function ClientComponent({ accessToken }: { accessToken: string }) {
  const [started, setStarted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [configId, setConfigId] = useState<string>('dabbd347-11ff-46a6-9a94-4117b1f7ccf9');
  const [client, setClient] = useState<HumeClient | null>(null);
  const [initialContext, setInitialContext] = useState<string | null>(null);
  const [currentConfig, setCurrentConfig] = useState(CONFIG_ONE);
  const [voiceProviderKey, setVoiceProviderKey] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([{ sender: 'Alice', text: 'Hello, how are you?' }]);

  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

  useEffect(() => {
    if (configId && conversationId) {
      const fetchData = async () => {
        const resultString = await fetchConversationContextAndLastMessage(conversationId);
        setInitialContext(resultString);
      };
      fetchData();
    }
  }, [configId, conversationId]);

  const handleStart = async () => {
    try {
      const conversationData: ConversationData[] = await insertNewConversation();
      if (!conversationData || conversationData.length === 0) {
        throw new Error("Failed to insert new conversation");
      }

      const newConversationId = conversationData[0].id;
      setConversationId(newConversationId);

      const humeClient = new HumeClient({
        apiKey: process.env.HUME_API_KEY!,
        secretKey: process.env.HUME_CLIENT_SECRET!,
      });
      setClient(humeClient);

    } catch (error) {
      console.error('Error handling conversation:', error);
    }

    setStarted(true);
  };

  const handleNewMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { sender: 'You', text: newMessage }]);
      setNewMessage('');
    }
  };




  return (
    <div className="relative grow flex flex-col mx-auto w-full h-screen overflow-hidden dark:bg-gray-900 bg-[#F4EDD8]">
      {!started && (

        <>
          <div className="flex flex-col items-center justify-center h-full mt-[-5%]">
            <div className="text-center">
              <img src={logo.src} alt="Logo" className="mx-auto mb-4" style={{ width: '125px', height: '125px' }} />
              <h1 className="text-4xl font-semibold mb-4 leading-relaxed text-black">Consider This</h1>
              <CustomTypingEffect
                lines={[
                  "Facilitate open discussions and gain diverse viewpoints with our AI Socratic Seminar platform."
                ]}
                speed={100}
                eraseDelay={2000}
                typingDelay={200}
                pauseDelay={4000}
              />
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
          <Footer />
        </>

      )}

      {started && (
        <>
          {started && conversationId && initialContext && (
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
          )}

          <div className="bg-[#E7D7A5] text-[#6C3F18] border-4 border-[#915018] p-4 m-4 rounded-md pixelate">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 bg-[#F4EDD8] p-2 rounded-md border-2 border-[#915018] ${message.sender === 'You' ? 'text-right' : 'text-left'
                  }`}
              >
                <span className="font-bold">{message.sender}:</span> {message.text}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
