// Component for ChatBox on the bottom of the screen

import React from 'react';

// Interface for individual message
interface Message {
    sender: string;
    text: string;
}

// Props for the ChatBox component
interface ChatBoxProps {
    messages: Message[];
}

// ChatBox component
const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
    return (
        // Container for the chat box, fixed at the bottom of the screen
        <div className="fixed bottom-0 left-0 right-0 h-1/3 bg-[#6b4018] p-4 rounded-t-lg shadow-md overflow-y-auto">
            {/* Container for the messages, with spacing between each message */}
            <div className="space-y-4">
                {/* Map through the messages array and render each message */}
                {messages.map((msg, index) => (
                    // Each message container with padding and background color
                    <div key={index} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
                        {/* Display the sender of the message */}
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{msg.sender}:</p>
                        {/* Display the text of the message */}
                        <p className="text-gray-800 dark:text-gray-300">{msg.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatBox;
