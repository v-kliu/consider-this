import { useEffect, useRef } from "react";
import { useVoice } from "@humeai/voice-react";

export default function StartCall() {
  const { status, connect } = useVoice();
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    if (!hasConnectedRef.current && status.value !== "connected") {
      hasConnectedRef.current = true;
      connect()
        .then(() => { })
        .catch(() => { })
        .finally(() => { });
    }
  }, [status, connect]);

  return null;
}
