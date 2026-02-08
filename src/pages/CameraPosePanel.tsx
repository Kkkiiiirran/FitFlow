import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

import { setupBicepCurl } from "../utils/setupBicepCurl";
import { setupSquats } from "../utils/setupSquats";
import { setupShoulderPress } from "../utils/setupShoulderPress";
import { setupLateralRaise } from "../utils/setupLateralRaise";
import { setupPlank } from "../utils/setupPlank";
import { setupLunges } from "../utils/setupLunges";
import { getMotivationMessage } from "../utils/motivation";

interface CameraPosePanelProps {
  exerciseId: string;
  onCountChange: (n: number) => void;
  onStageChange: (s: string) => void;
}

const MILESTONES = [1, 3, 5, 10, 15, 20, 30, 40, 50, 60, 70];

const INITIAL_MESSAGES = [
  "Great start! Keep going",
  "Nice rep! Stay strong",
  "You're doing amazing!",
  "Keep pushing, you got this!",
  "Form looks solid 👌",
  "Strong work! Stay focused!",
  "Consistency wins",
  "Keep breathing, keep moving!",
  "Power through!",
  "Excellent effort!"
];

type SetupFn = (
  videoRefObj: { current: HTMLVideoElement },
  canvasRef: React.RefObject<HTMLCanvasElement>,
  onCountChange: (n: number) => void,
  onStageChange: (s: string) => void
) => void;

export default function CameraPosePanel({
  exerciseId,
  onCountChange,
  onStageChange,
}: CameraPosePanelProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [motivation, setMotivation] = useState<string>("");
  const [messagePool, setMessagePool] =
    useState<string[]>(INITIAL_MESSAGES);

  const speakMotivation = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleUserMedia = () => {
    const video = webcamRef.current?.video;
    if (!video) return;

    video.onloadedmetadata = () => {
      if (!canvasRef.current) return;

      const videoRefObj = { current: video };

      const setupMap: Record<string, SetupFn> = {
        "bicep-curl": setupBicepCurl,
        "squats": setupSquats,
        "shoulder-press": setupShoulderPress,
        "lateral-raise": setupLateralRaise,
        "plank": setupPlank,
        "lunges": setupLunges,
      };

      const setupFn = setupMap[exerciseId];
      if (!setupFn) {
        console.error("Unknown exercise:", exerciseId);
        return;
      }

      setupFn(
        videoRefObj,
        canvasRef,
        async (n: number) => {
          onCountChange(n);

          if (MILESTONES.includes(n)) {
            const instantMsg =
              messagePool[
                Math.floor(Math.random() * messagePool.length)
              ];

            setMotivation(instantMsg);
            speakMotivation(instantMsg);

            getMotivationMessage(n)
              .then((aiMsg) => {
                if (!aiMsg) return;
                setMessagePool((prev) => [...prev, aiMsg]);
              })
              .catch(() => {});
          }
        },
        onStageChange
      );
    };
  };

  return (
    <div className="relative w-100 max-w-[640px] mx-auto">
      <Webcam
        ref={webcamRef}
        onUserMedia={handleUserMedia}
        className="rounded-xl overflow-hidden"
        videoConstraints={{ facingMode: "user" }}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {motivation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg animate-bounce">
          {motivation}
        </div>
      )}
    </div>
  );
}