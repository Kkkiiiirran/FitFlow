import { calculateAngle } from "./calculateAngle";

export function setupPlank(
  webcamRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setSeconds: (n: number) => void
) {
  let seconds = 0;
  let holding = false;
  let lastTick = Date.now();
  let stableSince = 0;
  const STABLE_REQUIRED = 700;

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

  function visible(lm: any) {
    if (!lm) return false;
    const vis = lm.visibility ?? 1;
    return vis > 0.55 && lm.x >= 0 && lm.x <= 1 && lm.y >= 0 && lm.y <= 1;
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
      const elbowL = lm[13];
      const hipL = lm[23];
      const kneeL = lm[25];
      const ankleL = lm[27];

      const shoulderR = lm[12];
      const elbowR = lm[14];
      const hipR = lm[24];
      const kneeR = lm[26];
      const ankleR = lm[28];

      const shouldersVisible = visible(shoulderL) || visible(shoulderR);
      const hipsVisible = visible(hipL) || visible(hipR);
      const anklesVisible = visible(ankleL) || visible(ankleR);
      const kneesVisible = visible(kneeL) || visible(kneeR);

      let torsoHorizontal = false;
      if (shouldersVisible && hipsVisible) {
        const s = visible(shoulderL) ? shoulderL : shoulderR;
        const h = visible(hipL) ? hipL : hipR;
        const dx = Math.abs(h.x - s.x);
        const dy = Math.abs(h.y - s.y);
        torsoHorizontal = dx > dy * 1.2;
      }

      const leftLegHorizontal =
        visible(kneeL) && visible(ankleL)
          ? Math.abs(ankleL.x - kneeL.x) > Math.abs(ankleL.y - kneeL.y) * 0.6
          : false;
      const rightLegHorizontal =
        visible(kneeR) && visible(ankleR)
          ? Math.abs(ankleR.x - kneeR.x) > Math.abs(ankleR.y - kneeR.y) * 0.6
          : false;

      const legsStraight =
        (leftLegHorizontal && visible(hipL) && visible(kneeL) && visible(ankleL)) ||
        (rightLegHorizontal && visible(hipR) && visible(kneeR) && visible(ankleR));

      const shoulderAboveElbow =
        (visible(shoulderL) && visible(elbowL) && shoulderL.y < elbowL.y) ||
        (visible(shoulderR) && visible(elbowR) && shoulderR.y < elbowR.y);

      const inPlank =
        shouldersVisible && hipsVisible && anklesVisible && kneesVisible && torsoHorizontal && legsStraight && shoulderAboveElbow;

      const now = Date.now();

      if (inPlank) {
        if (!holding) {
          if (stableSince === 0) stableSince = now;
          if (now - stableSince >= STABLE_REQUIRED) {
            holding = true;
            lastTick = now;
          }
        } else {
          if (now - lastTick >= 1000) {
            seconds += 1;
            lastTick = now;
            setSeconds(seconds);
          }
        }
      } else {
        holding = false;
        stableSince = 0;
      }

      ctx.fillStyle = inPlank ? "lime" : "red";
      ctx.font = "18px Arial";
      const displayAngle =
        visible(hipL) && visible(shoulderL)
          ? Math.round(
              calculateAngle(
                { x: shoulderL.x, y: shoulderL.y },
                { x: hipL.x, y: hipL.y },
                { x: ankleL.x, y: ankleL.y }
              )
            )
          : visible(hipR) && visible(shoulderR)
          ? Math.round(
              calculateAngle(
                { x: shoulderR.x, y: shoulderR.y },
                { x: hipR.x, y: hipR.y },
                { x: ankleR.x, y: ankleR.y }
              )
            )
          : 0;

      const hx = (visible(hipL) ? hipL.x : hipR.x) * canvas.width;
      const hy = (visible(hipL) ? hipL.y : hipR.y) * canvas.height;
      ctx.fillText(`Plank ${displayAngle}°`, hx || 10, (hy || 30) - 10);
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