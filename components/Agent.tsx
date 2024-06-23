import React from 'react';
import AgentImage from './images/agentImage.png';

interface AgentComponentProps {
  active: boolean;
  text: string;
  onAgentClick: () => void;
}

const AgentComponent: React.FC<AgentComponentProps> = ({
  active,
  text,
  onAgentClick,
}) => {
  return (
    <div className="border border-gray-300 p-5 rounded-md text-center">
      <h2 className="text-2xl font-bold mb-2">{text}</h2>
      <div
        className="relative inline-block my-5"
        style={{
          transform: active ? 'scale(1.2)' : 'scale(0.9)',
          transition: 'transform 0.3s ease-in-out',
        }}
        onClick={onAgentClick}
      >
        <img src={AgentImage.src} alt="Agent State" className="max-w-full h-auto" />
      </div>
    </div>
  );
};

export default AgentComponent;