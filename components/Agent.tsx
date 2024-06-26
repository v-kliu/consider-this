// Component for the Agent to be displayed on 2nd screen of Consider This

// Imports React and agent images
import React from 'react';
import CharlesPf from './images/Charles.png';
import MelodyPf from './images/Melody.png';

// Props for Agent
interface AgentComponentProps {
  active: boolean;
  text: string;
  onAgentClick: () => void;
}

// Agent component
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
          // If clicked and actively selected, scale agent image to be larger
          transform: active ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.3s ease-in-out',
        }}
        onClick={onAgentClick}
      > 
        {text === "Charles" ? (
          <img src={CharlesPf.src} alt={`${text} Profile`} className="max-w-full h-auto" style={{ transform: 'scale(0.7)' }} />
        ) : (
          <img src={MelodyPf.src} alt={`${text} Profile`} className="max-w-full h-auto" style={{ transform: 'scale(0.7)' }} />
        )}
      </div>
    </div>
  );
};

// Export Agent component
export default AgentComponent;
