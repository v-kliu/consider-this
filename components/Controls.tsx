// Component used to control the voice recognition, and switching between agents

"use client";

// Import necessary modules and components
import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Mic, MicOff, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Toggle } from "./ui/toggle";
import MicFFT from "./MicFFT";
import { cn } from "@/utils";
import { useEffect, useState } from "react";
import fetchConversationData from "@/utils/fetchConversationData";
import { fetchConversationContextAndLastMessage, handleEndCall, updateLastMessage } from "@/utils/supabaseClient";
import { HumeClient } from "hume";
import AgentComponent from "./Agent";

// Get configuration IDs from environment variables
const CONFIG_ONE = process.env.NEXT_PUBLIC_AGENT_CONFIG_ONE as string;
const CONFIG_TWO = process.env.NEXT_PUBLIC_AGENT_CONFIG_TWO as string;

// Define the props for the ChatStage component
interface ChatStageProps {
  conversationId: string;
  configId: string;
  setConfigId: (configId: string) => void;
  setStarted: (started: boolean) => void;
  client: HumeClient | null;
}

// Define the ChatStage component
const ChatStage: React.FC<ChatStageProps> = ({ conversationId, configId, setConfigId, setStarted, client }) => {
  // Destructure methods and state from the useVoice hook
  const { connect, disconnect, status, isMuted, unmute, mute, micFft, lastVoiceMessage, sendAssistantInput } = useVoice();
  
  // Local state to manage conversation data and agent states
  const [conversation, setConversation] = useState<any>({});
  const [agents, setAgents] = useState([
    { active: true, text: 'Melody' },
    { active: false, text: 'Charles' }
  ]);

  // Function to switch between configurations and update agent states
  const switchToConfig1 = () => {
    handleSwitchPersona();
    if (configId === CONFIG_TWO) {
      setAgents([
        { active: false, text: 'Melody' },
        { active: true, text: 'Charles' }
      ]);
    } else {
      setAgents([
        { active: true, text: 'Melody' },
        { active: false, text: 'Charles' }
      ]);
    }
  };

  // Fetch conversation data when conversationId changes
  useEffect(() => {
    const fetchData = async () => {
      const conversationData = await fetchConversationData(conversationId);
      setConversation(conversationData);
    };

    fetchData();
  }, [conversationId]);

  // Function to handle switching personas
  const handleSwitchPersona = async () => {
    await handleEndCall(conversationId, disconnect);

    // Update the last_message column with the lastVoiceMessage value
    if (lastVoiceMessage) {
      await updateLastMessage(conversationId, lastVoiceMessage.message.content);
    }

    // Fetch the conversation context and last message
    const returnString = await fetchConversationContextAndLastMessage(conversationId);

    // Change the config ID (switch between CONFIG_ONE and CONFIG_TWO)
    const newConfigId = configId === CONFIG_ONE ? CONFIG_TWO : CONFIG_ONE;

    console.log(newConfigId);

    setConfigId(newConfigId);
    setStarted(false); // Restart the conversation

    // Reconnect with the new config ID
    // await client?.empathicVoice.chat.connect({
    //   configId: newConfigId,
    // });

    setStarted(true); // Continue the conversation

    try {
      sendAssistantInput(returnString);
    } catch (error) {
      console.error("Error sending assistant input:");
    }

    connect()
      .then(() => { })
      .catch(() => { })
      .finally(() => { });
  };

  return (
    <div>
      <div className="flex flex-row space-x-4">
        {agents.map((agent, index) => (
          <div key={index} className="w-full md:w-1/2 p-2 pixelate bg-[#E6D7A5] border-4 border-[#915018] rounded-lg">
            <AgentComponent
              active={agent.active}
              text={agent.text}
              onAgentClick={switchToConfig1}
            />
          </div>
        ))}
      </div>
      {/* Uncomment and adjust the following section if needed for additional controls */}
      {/* <div
        className={
          cn(
            "fixed bottom-0 left-0 w-full p-4 flex items-center justify-center",
            "bg-gradient-to-t from-card via-card/90 to-card/0",
          )
        }
      >
        <AnimatePresence>
          {status.value === "connected" ? (
            <motion.div
              initial={{
                y: "100%",
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: "100%",
                opacity: 0,
              }}
              className={
                "p-4 bg-card border border-border rounded-lg shadow-sm flex items-center gap-4"
              }
            >
              <Toggle
                pressed={!isMuted}
                onPressedChange={() => {
                  if (isMuted) {
                    unmute();
                  } else {
                    mute();
                  }
                }}
              >
                {isMuted ? (
                  <MicOff className={"size-4"} />
                ) : (
                  <Mic className={"size-4"} />
                )}
              </Toggle>

              <div className={"relative grid h-8 w-48 shrink grow-0"}>
                <MicFFT fft={micFft} className={"fill-current"} />
              </div>

              <Button
                className={"flex items-center gap-1"}
                onClick={() => handleEndCall(conversationId, disconnect)}
                variant={"destructive"}
              >
                <span>
                  <Phone
                    className={"size-4 opacity-50"}
                    strokeWidth={2}
                    stroke={"currentColor"}
                  />
                </span>
                <span>End Call</span>
              </Button>
              <Button
                className={"flex items-center gap-1"}
                onClick={handleSwitchPersona}
                variant={"destructive"}
              >
                <span>
                  <Phone
                    className={"size-4 opacity-50"}
                    strokeWidth={2}
                    stroke={"currentColor"}
                  />
                </span>
                <span>Switch Personas</span>
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div> */}
    </div>
  );
}

export default ChatStage;
