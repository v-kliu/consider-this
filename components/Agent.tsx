import React, { useState } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import AgentImage from './images/agentImage.png';

interface AgentComponentProps {
  initialActive?: boolean;
  initialReveal?: boolean;
  initialIdea?: boolean;
  text?: string;
  agentOneReveal?: () => void;
}

const AgentComponent: React.FC<AgentComponentProps> = ({
  initialActive = false,
  initialReveal = false,
  initialIdea = false,
  text = 'Agent Component',
  agentOneReveal = () => {},
}) => {
  const [active, setActive] = useState(initialActive);
  const [reveal, setReveal] = useState(initialReveal);
  const [idea, setIdea] = useState(initialIdea);

  const toggleActive = () => setActive(!active);
  const toggleReveal = () => setReveal(!reveal);
  const toggleIdea = () => setIdea(!idea);

  const handleRevealClick = (): void => {
    toggleReveal();  
  };

  return (
    <div className="border border-gray-300 p-5 rounded-md text-center">
      <h2 className="text-2xl font-bold mb-2">{text}</h2>
      <div className="relative inline-block my-5">
        {idea && (
          <FaExclamationCircle
            style={{
              position: 'absolute',
              top: '-35px',
              right: '-35px',
              transform: 'translate(-50%, -50%)',
              width: '20%',
              height: '20%',
              filter: active ? 'drop-shadow(0 0 10px rgba(255, 240, 0, 0.7))' : 'none',
              transition: 'filter 0.3s ease-in-out',
            }}
            onClick={agentOneReveal}
          />
        )}
        <div
          className={`relative inline-block ${active ? 'silhouette-glow' : ''}`}
        >
          <img src={AgentImage.src} alt="Agent State" className="max-w-full h-auto" />
        </div>
      </div>
      <style jsx>{`
        .silhouette-glow {
          filter: drop-shadow(0 0 10px rgba(255, 240, 0, 0.7));
          transition: filter 0.3s ease-in-out;
        }
        .silhouette-glow img {
          filter: brightness(100%);
        }
      `}</style>
    </div>
  );
};

export default AgentComponent;
