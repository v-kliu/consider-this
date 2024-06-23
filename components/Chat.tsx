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
