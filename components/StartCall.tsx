import { useEffect, useRef } from "react";
import { useVoice } from "@humeai/voice-react";

export default function StartCall() {
  const { status, connect } = useVoice();
  const hasConnectedRef = useRef(false);

  return (
    <AnimatePresence>
      {status.value !== "connected" ? (
        <motion.div
          className={"fixed inset-0 p-4 flex items-center justify-center bg-background"}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={{
            initial: { opacity: 0 },
            enter: { opacity: 1 },
            exit: { opacity: 0 },
          }}
        >
          <AnimatePresence>
            <motion.div
              variants={{
                initial: { scale: 0.5 },
                enter: { scale: 1 },
                exit: { scale: 0.5 },
              }}
            >
              <Button
                className={"z-50 flex items-center gap-1.5"}
                onClick={() => {
                  connect()
                    .then(() => {})
                    .catch(() => {})
                    .finally(() => {});
                }}
              >
                <span>
                  <Phone
                    className={"size-4 opacity-50"}
                    strokeWidth={2}
                    stroke={"currentColor"}
                  />
                </span>
                <span>Consider This:</span>
              </Button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

<!--   useEffect(() => {
    if (!hasConnectedRef.current && status.value !== "connected") {
      hasConnectedRef.current = true;
      connect()
        .then(() => { })
        .catch(() => { })
        .finally(() => { });
    }
  }, [status, connect]);

  return null; -->

}
