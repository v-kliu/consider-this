import React from 'react';

interface Message {
    sender: string;
    text: string;
}

interface ChatBoxProps {
    messages: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-1/3 bg-[#6b4018] p-4 rounded-t-lg shadow-md overflow-y-auto">
            <div className="space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{msg.sender}:</p>
                        <p className="text-gray-800 dark:text-gray-300">{msg.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatBox;