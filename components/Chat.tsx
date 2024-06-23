"use client"; // Add this line at the top

import { ComponentRef, useRef, useState } from "react";
import ChatBox from "./ChatBox";
import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import Agent from "./Agent";

// Initial config setup
const CONFIG_ONE = "5a0c849f-bf21-4f9d-97f0-958ff8619fba";
const CONFIG_TWO = "dbe866f5-2bb7-44df-a73c-846feb59f4ec";

export default function ClientComponent({ accessToken }: { accessToken: string; }) {
  const [started, setStarted] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(CONFIG_ONE);
  const [voiceProviderKey, setVoiceProviderKey] = useState(0);
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'Alice', text: 'Hello, how are you?' },
  ]);
  const [agentOneData, setAgentOneData] = useState([
    {
      initialActive: true,
      initialReveal: true,
      initialIdea: true,
      text: 'Agent 1',
    }
  ]);
  const [agentTwoData, setAgentTwoData] = useState([
    {
      initialActive: false,
      initialReveal: false,
      initialIdea: false,
      text: 'Agent 2',
    }
  ]);

  const handleStart = () => {
    setStarted(true);
  };

  const handleNewMessageChange = (e: { target: { value: string; }; }) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { sender: 'You', text: newMessage }]);
      setNewMessage('');
    }
  };

  // Functions to switch configs
  const switchToConfig1 = () => {
    setCurrentConfig(CONFIG_ONE);
    setVoiceProviderKey(prevKey => prevKey + 1);
  };

  const switchToConfig2 = () => {
    setCurrentConfig(CONFIG_TWO);
    setVoiceProviderKey(prevKey => prevKey + 1); 
  };

  const handleAgentReveal = async () => {
    try {
      const response = await fetch(`/api/reveal?config=${currentConfig}`);
      const data = await response.json();
      console.log("Agent reveal data:", data);
    } catch (error) {
      console.error("Error revealing agent:", error);
    }
  };

  return (
    <div className="relative grow flex flex-col mx-auto w-full h-screen overflow-hidden dark:bg-gray-900">
      {!started && (
        <div className="mt-40">
          {/* Project Description */}
          <div className="p-4 bg-gray-100 dark:bg-gray-800 text-center rounded-md mb-4 mx-auto w-3/4">
            <h1 className="text-2xl font-bold mb-2 text-black dark:text-gray-100">Consider-This</h1>
            <p className="text-lg text-black dark:text-gray-300">
              The AI Socratic Seminar project aims to facilitate open discussions and provide differing viewpoints, leveraging Hume's
              empathetic model to foster understanding and empathy among participants. This innovative platform encourages meaningful
              dialogue and the exchange of diverse perspectives.
            </p>
          </div>

          {/* Start Button */}
          <div className="p-4 text-center rounded-md mb-4 mx-auto w-3/4">
            <button
              onClick={handleStart}
              className="bg-[#ee8822] text-black py-2 px-4 rounded-sm border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1),8px_8px_0px_rgba(0,0,0,0.25)] hover:bg-[#b3c8e3] hover:shadow-[2px_2px_0px_rgba(0,0,0,1),4px_4px_0px_rgba(0,0,0,0.25)] hover:translate-x-1 hover:translate-y-1 dark:bg-[#a2b8d4] dark:hover:bg-[#90a7c5] font-bold transition-transform duration-150"
            >
              Start
            </button>
          </div>
        </div>
      )}

      {started && (
        <>
          {/* ChatBox */}
          <ChatBox messages={messages} />
            
          {/* Agents */}
          <div className="flex flex-row space-x-4">
            <div className="w-full md:w-1/2 p-2">
              {agentOneData.map((agent, index) => (
                <Agent
                  key={`agentOne-${index}`}
                  initialActive={agent.initialActive}
                  initialReveal={agent.initialReveal}
                  initialIdea={agent.initialIdea}
                  text={agent.text}
                  agentOneReveal={switchToConfig2}
                />
              ))}
            </div>
            <div className="w-full md:w-1/2 p-2">
              {agentTwoData.map((agent, index) => (
                <Agent
                  key={`agentTwo-${index}`}
                  initialActive={agent.initialActive}
                  initialReveal={agent.initialReveal}
                  initialIdea={agent.initialIdea}
                  text={agent.text}
                  agentOneReveal={switchToConfig1}
                />
              ))}
            </div>
          </div>

          <VoiceProvider
            key={voiceProviderKey} 
            configId={currentConfig}
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

          <ChatBox messages={messages} />
        </>
      )}
    </div>
  );
}
