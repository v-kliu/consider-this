"use client";

import { SetStateAction, useState } from "react";
import ChatBox from "./ChatBox";

export default function ClientComponent({ accessToken }: { accessToken: string; }) {
  const [started, setStarted] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'Alice', text: 'Hello, how are you?' },
  ]);

  const handleStart = () => {
    setStarted(true);
  };

  const handleNewMessageChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { sender: 'You', text: newMessage }]);
      setNewMessage(''); // Clear input after sending
    }
  };

  return (
    <div className="relative grow flex flex-col mx-auto w-full overflow-hidden h-screen dark:bg-gray-900">
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
          {/* test ChatBox */}
          {/* <div className="flex-1 p-4">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={handleNewMessageChange}
                className="flex-1 p-2 border-2 border-gray-200 rounded-md"
                placeholder="Type your message here..."
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div> */}
          <ChatBox messages={messages} />
        </>
      )}
    </div>
  );
}
