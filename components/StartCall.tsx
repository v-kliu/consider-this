// Component ensures a voice connection is established on page load

import { useEffect, useRef } from "react";
import { useVoice } from "@humeai/voice-react";

// Define the StartCall component
export default function StartCall() {
  // Destructure status and connect function from the useVoice hook
  const { status, connect } = useVoice();
  
  // Create a ref to track if the connection has been initiated
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    
    // Check if the connection has not been initiated and the status is not "connected"
    if (!hasConnectedRef.current && status.value !== "connected") {
      // Set the ref to true to prevent re-connection
      hasConnectedRef.current = true;
      
      // Attempt to establish the connection
      connect()
        .then(() => { /* Connection successful */ })
        .catch(() => { /* Handle connection error */ })
        .finally(() => { /* Clean up if needed */ });
    }
  }, [status, connect]); // Dependencies: status and connect

  return null; // This component does not render anything visible
}
