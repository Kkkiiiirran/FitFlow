import { Button } from "@/components/ui/button";
import { Dumbbell, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const exercises = [
  {
    id: "bicep-curl",
    name: "Bicep Curl",
    description: "Build stronger arms with proper bicep curl form and technique",
    difficulty: "Beginner",
    targetMuscle: "Biceps",
    reps: "12-15",
  },
  {id: "squats",
    name: "Squats",
    description: "Build stronger arms with proper bicep curl form and technique",
    difficulty: "Beginner",
    targetMuscle: "Thighs",
    reps: "12-15",},
    {
  id: "plank",
  name: "Plank",
  description: "Strengthen your core by holding a straight-body plank position",
  difficulty: "Beginner",
  targetMuscle: "Core",
  reps: "Time-based",
},
{
  id: "crunches",
  name: "Crunches",
  description: "Strengthen your abdominal muscles by lifting your upper body using controlled core movement",
  difficulty: "Intermediate",
  targetMuscle: "Core",
  reps: "12–20",
},

  // {
  //   id: "triceps-kickback",
  //   name: "Triceps Kickback",
  //   description: "Tone your triceps with controlled kickback movements",
  //   difficulty: "Beginner",
  //   targetMuscle: "Triceps",
  //   reps: "10-12",
  // },
  {
    id: "shoulder-press",
    name: "Shoulder Press",
    description: "Develop strong shoulders with overhead pressing motion",
    difficulty: "Intermediate",
    targetMuscle: "Shoulders",
    reps: "8-12",
  },
  {
    id: "lateral-raise",
    name: "Lateral Raise",
    description: "Sculpt your shoulders with lateral deltoid isolation",
    difficulty: "Beginner",
    targetMuscle: "Shoulders",
    reps: "12-15",
  },
  {
  id: "lunges",
  name: "Lunges",
  description: "Build lower body strength by stepping forward and lowering your hips until both knees are bent at about 90 degrees",
  difficulty: "advanced",
  targetMuscle: "Quadriceps, Glutes",
  reps: "10–12 each leg",
}
  // {
  //   id: "front-raise",
  //   name: "Front Raise",
  //   description: "Target the anterior deltoids with controlled front raises",
  //   difficulty: "Beginner",
  //   targetMuscle: "Shoulders",
  //   reps: "10-15",
  // },
  // {
  //   id: "hammer-curl",
  //   name: "Hammer Curl",
  //   description: "Build forearm and bicep strength with neutral grip curls",
  //   difficulty: "Beginner",
  //   targetMuscle: "Biceps & Forearms",
  //   reps: "10-12",
  // },
];

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

const ExerciseSelection = () => {
  return (
    <div className="min-h-screen bg-background px-10 ">
      <Header />

      {/* Content */}
      <div className="container mx-auto px-4 ">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h2 className="text-3xl md:text-3xl font-bold mb-4">
            Choose Your <span className="text-primary">Exercise</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Select an exercise to start your workout with AI-powered form tracking
          </p>
        </div>

        {/* Exercise Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 m-10" >
          {exercises.map((exercise, index) => (
            <Link
              key={exercise.id}
              to={`/exercise/${exercise.id}`}
              className="block animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="group relative bg-gradient-card rounded-2xl  p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-border hover:border-primary/50 h-full">
            
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>

              
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                  {exercise.name}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {exercise.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Target Muscle</span>
                    <span className="font-medium text-foreground">{exercise.targetMuscle}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Recommended Reps</span>
                    <span className="font-medium text-foreground">{exercise.reps}</span>
                  </div>
                </div>

                
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center px-3  rounded-full text-xs font-medium border ${getDifficultyColor(
                      exercise.difficulty
                    )}`}
                  >
                    {exercise.difficulty}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:text-primary transition-colors duration-300"
                  >
                    Start →
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseSelection;
