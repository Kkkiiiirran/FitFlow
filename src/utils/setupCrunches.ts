import { calculateAngle } from "./calculateAngle";

export function setupCrunches(
  webcamRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setCounter: (n: number) => void,
  setStage: (s: string) => void
) {
  let stage: "up" | "down" = "down";
  let counter = 0;
  let cooldown = 0;
  let prevAngle = 180;
  let smoothed = 180;

  const pose = new (window as any).Pose({
    locateFile: (file: string) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.65,
    minTrackingConfidence: 0.65,
  });

  function visible(lm: any) {
    if (!lm) return false;
    const vis = lm.visibility ?? 1;
    return vis > 0.5 && lm.x >= 0 && lm.x <= 1 && lm.y >= 0 && lm.y <= 1;
  }

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
      const lm = results.poseLandmarks;

      (window as any).drawConnectors(ctx, lm, (window as any).POSE_CONNECTIONS, {
        color: "white",
        lineWidth: 3,
      });
      (window as any).drawLandmarks(ctx, lm, { color: "red", lineWidth: 2 });

      const shoulderL = lm[11];
      const hipL = lm[23];
      const kneeL = lm[25];

      const shoulderR = lm[12];
      const hipR = lm[24];
      const kneeR = lm[26];

      const leftVisible = visible(shoulderL) && visible(hipL) && visible(kneeL);
      const rightVisible =
        visible(shoulderR) && visible(hipR) && visible(kneeR);

      if (!leftVisible && !rightVisible) {
        ctx.fillStyle = "orange";
        ctx.font = "18px Arial";
        ctx.fillText("Move into view", 10, 30);
        ctx.restore();
        return;
      }

      const angleL = leftVisible
        ? calculateAngle(
            { x: shoulderL.x, y: shoulderL.y },
            { x: hipL.x, y: hipL.y },
            { x: kneeL.x, y: kneeL.y }
          )
        : 180;

      const angleR = rightVisible
        ? calculateAngle(
            { x: shoulderR.x, y: shoulderR.y },
            { x: hipR.x, y: hipR.y },
            { x: kneeR.x, y: kneeR.y }
          )
        : 180;

      const rawAngle = (angleL + angleR) / 2;
      smoothed = rawAngle * 0.25 + smoothed * 0.75;

      if (cooldown > 0) cooldown--;

      const DOWN_THRESH = 160;
      const UP_THRESH = 110;

      if (smoothed > DOWN_THRESH) {
        if (stage !== "down") {
          stage = "down";
          setStage("Down");
        }
      }

      if (smoothed < UP_THRESH && stage === "down" && cooldown === 0) {
        stage = "up";
        counter += 1;
        cooldown = 10;
        setCounter(counter);
        setStage("Up");
      }

      ctx.fillStyle = "yellow";
      ctx.font = "18px Arial";
      const drawX = (visible(hipL) ? hipL.x : hipR.x) * canvas.width || 10;
      const drawY = (visible(hipL) ? hipL.y : hipR.y) * canvas.height - 10 || 30;
      ctx.fillText(`${Math.round(smoothed)}°`, drawX, drawY);
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