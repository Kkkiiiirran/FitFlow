import { calculateAngle } from "./calculateAngle";

export function setupBicepCurl(
  webcamRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setCounter: (n: number) => void,
  setStage: (s: string) => void
) {
  let stage: "up" | "down" = "down";
  let counter = 0;

  const pose = new (window as any).Pose({
    locateFile: (file: string) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  pose.onResults((results: any) => {
    if (!canvasRef.current || !webcamRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const video = webcamRef.current;

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.poseLandmarks) {
      
      (window as any).drawConnectors(
        ctx,
        results.poseLandmarks,
        (window as any).POSE_CONNECTIONS,
        { color: "white", lineWidth: 3 }
      );

      (window as any).drawLandmarks(ctx, results.poseLandmarks, {
        color: "red",
        lineWidth: 2,
      });

      const shoulder = results.poseLandmarks[11];
      const elbow = results.poseLandmarks[13];
      const wrist = results.poseLandmarks[15];

      const angle = calculateAngle(
        { x: shoulder.x, y: shoulder.y },
        { x: elbow.x, y: elbow.y },
        { x: wrist.x, y: wrist.y }
      );


      if (angle > 160) {
        stage = "down";
        setStage("Down");
      }

      if (angle < 40 && stage === "down") {
        stage = "up";
        counter += 1;
        setCounter(counter);
        setStage("Up");
      }
    }

    ctx.restore();
  });

  
  if (webcamRef.current) {
    const camera = new (window as any).Camera(webcamRef.current, {
      onFrame: async () => {
        await pose.send({ image: webcamRef.current! });
      },
      width: 640,
      height: 480,
    });

    camera.start();
  }
}
