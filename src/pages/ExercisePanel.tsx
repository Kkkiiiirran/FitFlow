import { Button } from "@/components/ui/button";
import CameraPosePanel from "./CameraPosePanel";
import { Dumbbell, ArrowLeft, Play, Pause, RotateCcw, Check } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useWorkoutTracking } from "@/hooks/useWorkoutTracking";
import { authService } from "@/services/authService";

const ID_TO_NAME: Record<string, string> = {
  "bicep-curl": "Bicep Curl",
  "squats": "Squats",
  "shoulder-press": "Shoulder Press",
  "push-ups": "Push-ups",
  "planks": "Planks",
  "lunges": "Lunges",
  "lateral-raise": "Lateral Raise",
  "crunches": "Crunches",
  // "lunges": "Lunges"
};

const ExercisePanel = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [reps, setReps] = useState(0);
  const [stage, setStage] = useState("Ready");
  const [isSaving, setIsSaving] = useState(false);
  const { startWorkout, finishWorkout, isRecording } = useWorkoutTracking();

  const exerciseName =
    ID_TO_NAME[exerciseId || ""] ||
    (exerciseId
      ?.split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || "Exercise");

  const handleStart = () => {
    if (!isRecording) startWorkout();
    setIsActive(true);
    setStage("Starting...");
  };

  const handlePause = () => {
    setIsActive(false);
    setStage("Paused");
  };

  const handleReset = () => {
    setIsActive(false);
    setReps(0);
    setStage("Ready");
  };

  const handleFinishWorkout = async () => {
    if (!authService.isAuthenticated()) {
      navigate("/auth");
      return;
    }
    setIsSaving(true);
    try {
      const success = await finishWorkout({ name: exerciseName, reps });
      if (success) navigate("/profile");
      else alert("Failed to save workout");
    } catch {
      alert("Failed to save workout. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FitFlow
            </span>
          </div>
          <Link to="/exercises">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exercises
            </Button>
          </Link>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 pt-24">
        <div className=" max-w-6xl">

          <div className="bg-gradient-to-br from-card to-muted/30 rounded-3xl shadow-xl border border-border p-6">

            {/* ===== LEFT TEXT + RIGHT VIDEO ===== */}
            <div className="flex  justify-center gap-8">

              {/* LEFT — STATS */}
              <div className="space-y-3 min-w-[180px]">

                <div className="bg-background/90 rounded-xl px-4 py-3 border border-border">
                  <div className="text-xs text-muted-foreground">Exercise</div>
                  <div className="text-xl font-bold text-primary">{exerciseName}</div>
                </div>

                <div className="bg-background/90 rounded-xl px-4 py-3 border border-border">
                  <div className="text-xs text-muted-foreground">{exerciseName == "Plank"? "Time": "Reps"}</div>
                  <div className="text-2xl font-bold text-primary">{reps}</div>
                </div>

                <div className="bg-background/90 rounded-xl px-4 py-3 border border-border">
                  <div className="text-xs text-muted-foreground">Stage</div>
                  <div className="text-sm font-semibold">{stage}</div>
                </div>

                <div className="bg-background/90 rounded-xl px-4 py-3 border border-border flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isActive ? "bg-secondary animate-pulse" : "bg-muted"
                    }`}
                  />
                  <span className="text-xs font-medium">
                    {isActive ? "Recording" : "Stopped"}
                  </span>
                </div>

              </div>

              {/* RIGHT — VIDEO */}
              <div className="aspect-video w-[700px] bg-muted/50 rounded-2xl overflow-hidden relative flex items-center justify-center">

                {isActive ? (
                  <CameraPosePanel
                    exerciseId={exerciseId}
                    onCountChange={setReps}
                    onStageChange={setStage}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Dumbbell className="h-10 w-10 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Press Start to begin</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CONTROLS */}
            <div className="mt-6 flex justify-center gap-4">
              {!isActive ? (
                <Button variant="hero" size="lg" onClick={handleStart}>
                  <Play className="mr-2 h-5 w-5" /> Start
                </Button>
              ) : (
                <Button variant="secondary" size="lg" onClick={handlePause}>
                  <Pause className="mr-2 h-5 w-5" /> Pause
                </Button>
              )}

              <Button variant="outline" size="lg" onClick={handleReset}>
                <RotateCcw className="mr-2 h-5 w-5" /> Reset
              </Button>

              {(isRecording || reps > 0) && authService.isAuthenticated() && (
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleFinishWorkout}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-2 h-5 w-5" />
                  {isSaving ? "Saving..." : "Finish & Save"}
                </Button>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ExercisePanel;