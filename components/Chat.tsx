"use client"; // Add this line at the top

import React from "react";
import { useState } from "react";
import ChatBox from "./ChatBox";
import Agent from "./Agent";

export default function ClientComponent({ accessToken }: { accessToken: string; }) {
  const [started, setStarted] = useState(false);
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
      setNewMessage(''); // Clear input after sending
    }
  };

  const handleAgentReveal = () => {
    console.log("MODIFY THIS TO BE API CALL")
  };

  return (
    <div className="relative grow flex flex-col mx-auto w-full h-screen overflow-hidden dark:bg-gray-900">
      {!started && (
        <>
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
        </>
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
                  key={index}
                  initialActive={agent.initialActive}
                  initialReveal={agent.initialReveal}
                  initialIdea={agent.initialIdea}
                  text={agent.text}
                  agentOneReveal={handleAgentReveal}
                />
              ))}
            </div>
            <div className="w-full md:w-1/2 p-2">
              {agentTwoData.map((agent, index) => (
                <Agent
                  key={index}
                  initialActive={agent.initialActive}
                  initialReveal={agent.initialReveal}
                  initialIdea={agent.initialIdea}
                  text={agent.text}
                  agentOneReveal={handleAgentReveal}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
