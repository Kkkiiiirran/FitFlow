import { calculateAngle } from "./calculateAngle";

export function setupLateralRaise(
  webcamRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setCounter: (n: number) => void,
  setStage: (s: string) => void
) {
  let stage: "up" | "down" = "down";
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

      (window as any).drawConnectors(ctx, lm, (window as any).POSE_CONNECTIONS, {
        color: "white",
        lineWidth: 3,
      });

      (window as any).drawLandmarks(ctx, lm, {
        color: "red",
        lineWidth: 2,
      });

      const hipL = lm[23];
      const shoulderL = lm[11];
      const elbowL = lm[13];

      const angleL = calculateAngle(
        { x: hipL.x, y: hipL.y },
        { x: shoulderL.x, y: shoulderL.y },
        { x: elbowL.x, y: elbowL.y }
      );

      const hipR = lm[24];
      const shoulderR = lm[12];
      const elbowR = lm[14];

      const angleR = calculateAngle(
        { x: hipR.x, y: hipR.y },
        { x: shoulderR.x, y: shoulderR.y },
        { x: elbowR.x, y: elbowR.y }
      );

      const armAngle = Math.max(angleL, angleR);

      const armDiff = Math.abs(angleL - angleR);
      const swinging = armDiff > 65;

      if (cooldown > 0) cooldown--;

      const DOWN_THRESHOLD = 65;
      const UP_MIN = 85;
      const UP_MAX = 125;

      if (armAngle < DOWN_THRESHOLD) {
        stage = "down";
        if (!swinging) setStage("Down");
      }

      if (
        armAngle > UP_MIN &&
        armAngle < UP_MAX &&
        stage === "down" &&
        cooldown === 0
      ) {
        stage = "up";
        counter += 1;
        cooldown = 12;
        setCounter(counter);
        if (!swinging) setStage("Up");
      }

      ctx.fillStyle = "yellow";
      ctx.font = "18px Arial";
      ctx.fillText(
        `${Math.round(armAngle)}°`,
        shoulderL.x * canvas.width,
        shoulderL.y * canvas.height - 10
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