import { Button } from "@/components/ui/button";
import { Dumbbell, ArrowLeft, Target, RotateCcw, Zap, Clock } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";

interface Exercise {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  targetMuscle: string;
  reps: string;
}

interface WorkoutModule {
  id: string;
  name: string;
  exerciseIds: string[];
  duration: string;
  intensity: string;
}

const exercises: Exercise[] = [
  { id: "bicep-curl", name: "Bicep Curl", description: "Build stronger arms with proper bicep curl form and technique", difficulty: "Beginner", targetMuscle: "Biceps", reps: "12-15" },
  { id: "squats", name: "Squats", description: "Build lower body strength with proper squat form and depth", difficulty: "Beginner", targetMuscle: "Thighs", reps: "12-15" },
  { id: "plank", name: "Plank", description: "Strengthen your core by holding a straight-body plank position", difficulty: "Beginner", targetMuscle: "Core", reps: "Time-based" },
  { id: "crunches", name: "Crunches", description: "Strengthen your abdominal muscles by lifting your upper body using controlled core movement", difficulty: "Intermediate", targetMuscle: "Core", reps: "12–20" },
  { id: "russian-twists", name: "Russian Twists", description: "Engage your obliques with rotational core movements for a stronger midsection", difficulty: "Intermediate", targetMuscle: "Core", reps: "15–20" },
  { id: "shoulder-press", name: "Shoulder Press", description: "Develop strong shoulders with overhead pressing motion", difficulty: "Intermediate", targetMuscle: "Shoulders", reps: "8-12" },
  { id: "lateral-raise", name: "Lateral Raise", description: "Sculpt your shoulders with lateral deltoid isolation", difficulty: "Beginner", targetMuscle: "Shoulders", reps: "12-15" },
  { id: "lunges", name: "Lunges", description: "Build lower body strength by stepping forward and lowering your hips until both knees are bent at about 90 degrees", difficulty: "Advanced", targetMuscle: "Quadriceps, Glutes", reps: "10–12 each leg" },
  { id: "calf-raises", name: "Calf Raises", description: "Strengthen and define your calves by rising onto your toes with controlled motion", difficulty: "Beginner", targetMuscle: "Calves", reps: "15-20" },
];

const workoutModules: WorkoutModule[] = [
  { id: "upper-body-blast", name: "Upper Body Blast", exerciseIds: ["bicep-curl", "squats", "shoulder-press"], duration: "25 min", intensity: "Medium" },
  { id: "core-crusher", name: "Core Crusher", exerciseIds: ["plank", "crunches", "russian-twists"], duration: "20 min", intensity: "High" },
  { id: "leg-day-power", name: "Leg Day Power", exerciseIds: ["squats", "lunges", "calf-raises"], duration: "30 min", intensity: "High" },
];

function getModuleById(moduleId?: string): WorkoutModule | undefined {
  return workoutModules.find((m) => m.id === moduleId);
}

function getExercisesByModuleId(moduleId?: string): Exercise[] {
  const module = getModuleById(moduleId);
  if (!module) return [];
  return module.exerciseIds
    .map((eid) => exercises.find((e) => e.id === eid))
    .filter(Boolean) as Exercise[];
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "bg-secondary/10 text-secondary border-secondary/20";
    case "intermediate":
      return "bg-accent/10 text-accent border-accent/20";
    case "advanced":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
};

export default function ModuleDetailPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const module = getModuleById(moduleId);
  const moduleExercises = getExercisesByModuleId(moduleId);

  if (!module) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Module Not Found</h1>
          <p className="text-muted-foreground mb-8">This workout module does not exist.</p>
          <Link to="/modules">
            <Button variant="hero">Back to Modules</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 lg:px-28 py-10">
        <Link to="/modules">
          <Button variant="ghost" size="sm" className="mb-6 -ml-3 text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Modules
          </Button>
        </Link>

        <h1 className="text-3xl md:text-3xl font-bold mb-2">{module.name}</h1>
        <p className="text-muted-foreground mb-6">Complete all exercises to finish this module.</p>

        <div className="flex gap-3 mb-8 text-white">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm text-white">
            <Clock className="w-4 h-4" />
            {module.duration}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm">
            <Zap className="w-4 h-4" />
            {module.intensity}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm">
            <Dumbbell className="w-4 h-4" />
            {moduleExercises.length} Exercises
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {moduleExercises.map((exercise, index) => (
            <div key={exercise.id} className="rounded-2xl border bg-card p-6 hover:shadow-md transition">
              <div className="flex justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-primary" />
                </div>
                {/* <span className="text-xs bg-secondary px-2 py-1 rounded-md">#{index + 1}</span> */}
              </div>

              <h3 className="text-lg font-semibold mb-1">{exercise.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{exercise.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-sm">
                  <Target className="w-3 h-3 inline mr-1" />
                  {exercise.targetMuscle}
                </div>
                <div className="text-sm">
                  <RotateCcw className="w-3 h-3 inline mr-1" />
                  {exercise.reps}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </span>

                <Button size="sm" variant="hero" onClick={() => navigate(`/exercise/${exercise.id}`)}>
                  Start →
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}