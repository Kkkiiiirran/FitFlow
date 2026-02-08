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
  "lateral-raise": "Lateral Raise"
};

const ExercisePanel = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [reps, setReps] = useState(0);
  const [stage, setStage] = useState("Ready");
  const [isSaving, setIsSaving] = useState(false);
  const { startWorkout, addExercise, finishWorkout, isRecording } = useWorkoutTracking();

  const exerciseName = ID_TO_NAME[exerciseId || ""] || (exerciseId
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
      if (success) {
        navigate("/profile");
      } else {
        alert("Failed to save workout");
      }
    } catch (error) {
      alert("Failed to save workout. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
     
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

   
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
       
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {exerciseName}
            </h1>
            <p className="text-xl text-muted-foreground">
              Follow the on-screen guide and maintain proper form
            </p>
          </div>

       
          <div className="relative bg-gradient-to-br from-card to-muted/30 rounded-3xl overflow-hidden shadow-2xl border border-border animate-slide-up">
        
            <div className="absolute top-6 left-6 z-20 space-y-4">
        
              <div className="bg-background/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-border min-w-[140px]">
                <div className="text-sm text-muted-foreground mb-1">Reps</div>
                <div className="text-5xl font-bold text-primary">{reps}</div>
              </div>


              <div className="bg-background/90 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-border min-w-[140px]">
                <div className="text-sm text-muted-foreground mb-1">Stage</div>
                <div className="text-lg font-semibold text-foreground">{stage}</div>
              </div>

              <div className="bg-background/90 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-border flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isActive ? "bg-secondary animate-pulse" : "bg-muted"
                  }`}
                />
                <span className="text-sm font-medium">
                  {isActive ? "Recording" : "Stopped"}
                </span>
              </div>
            </div>


            <div className="aspect-video bg-muted/50 flex items-center justify-center relative">
  {isActive ? (
    <CameraPosePanel
  exerciseId={exerciseId}
  onCountChange={(n) => setReps(n)}
  onStageChange={(s) => setStage(s)}
/>
  ) : (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse-slow">
          <Dumbbell className="h-12 w-12 text-primary" />
        </div>
        <p className="text-lg text-muted-foreground">Press Start to begin</p>
      </div>
    </div>
  )}
</div>


 
            <div className="p-6 bg-background/50 backdrop-blur-sm border-t border-border">
              <div className="flex items-center justify-center gap-4">
                {!isActive ? (
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleStart}
                    className="px-8"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start Exercise
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handlePause}
                    className="px-8"
                  >
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleReset}
                  className="px-8"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
                {(isRecording || isActive || reps > 0) && authService.isAuthenticated() && (
                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleFinishWorkout}
                    disabled={isSaving}
                    className="px-8 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="mr-2 h-5 w-5" />
                    {isSaving ? "Saving..." : "Finish & Save"}
                  </Button>
                )}
              </div>
            </div>
          </div>

 
          <div className="mt-8 bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-xl font-bold mb-4">Form Tips</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Keep your back straight and core engaged throughout the movement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Control the weight on both the lifting and lowering phases</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Breathe out during exertion and breathe in during the return phase</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Position yourself so your full body is visible in the camera frame</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisePanel;
