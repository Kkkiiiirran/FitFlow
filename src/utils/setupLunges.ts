import { calculateAngle } from "./calculateAngle";

export function setupLunges(
  webcamRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setCounter: (n: number) => void,
  setStage: (s: string) => void
) {
  let stage: "up" | "down" = "up";
  let counter = 0;
  let cooldown = 0;

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
      const lm = results.poseLandmarks;

      (window as any).drawConnectors(
        ctx,
        lm,
        (window as any).POSE_CONNECTIONS,
        { color: "white", lineWidth: 3 }
      );

      (window as any).drawLandmarks(ctx, lm, {
        color: "red",
        lineWidth: 2,
      });

      const hipL = lm[23];
      const kneeL = lm[25];
      const ankleL = lm[27];

      const hipR = lm[24];
      const kneeR = lm[26];
      const ankleR = lm[28];

      const angleL = calculateAngle(
        { x: hipL.x, y: hipL.y },
        { x: kneeL.x, y: kneeL.y },
        { x: ankleL.x, y: ankleL.y }
      );

      const angleR = calculateAngle(
        { x: hipR.x, y: hipR.y },
        { x: kneeR.x, y: kneeR.y },
        { x: ankleR.x, y: ankleR.y }
      );

      const kneeAngle = Math.min(angleL, angleR);

      if (cooldown > 0) cooldown--;

      if (kneeAngle > 160) {
        stage = "up";
        setStage("Up");
      }

      if (kneeAngle < 100 && stage === "up" && cooldown === 0) {
        stage = "down";
        counter += 1;
        cooldown = 12;
        setCounter(counter);
        setStage("Down");
      }

      ctx.fillStyle = "yellow";
      ctx.font = "18px Arial";
      ctx.fillText(
        `${Math.round(kneeAngle)}°`,
        kneeL.x * canvas.width,
        kneeL.y * canvas.height - 10
      );
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