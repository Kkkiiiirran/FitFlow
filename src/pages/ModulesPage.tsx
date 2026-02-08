import { Button } from "@/components/ui/button";
import { Dumbbell, ArrowLeft, Play, Clock, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";

interface WorkoutModule {
  id: string;
  name: string;
  exerciseIds: string[];
  duration: string;
  intensity: string;
}

const workoutModules: WorkoutModule[] = [
  {
    id: "upper-body-blast",
    name: "Upper Body Blast",
    exerciseIds: ["bicep-curl", "squats", "shoulder-press"],
    duration: "25 min",
    intensity: "Medium",
  },
  {
    id: "core-crusher",
    name: "Core Crusher",
    exerciseIds: ["plank", "crunches", "russian-twists"],
    duration: "20 min",
    intensity: "High",
  },
  {
    id: "leg-day-power",
    name: "Leg Day Power",
    exerciseIds: ["squats", "lunges", "calf-raises"],
    duration: "30 min",
    intensity: "High",
  },
];

export default function ModulesPage() {
  const navigate = useNavigate();

  const handleStartModule = (moduleId: string) => {
    if (!moduleId) return;
    navigate(`/modules/${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 lg:px-28 py-10">
        {/* Header */}
        <div className="mb-10">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-6 -ml-3 text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Workout <span className="text-gradient-primary">Modules</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl">
            Choose a guided workout combining multiple exercises into one powerful session.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutModules.map((module) => (
            <div
              key={module.id}
              className="group relative rounded-3xl border border-border bg-card hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 overflow-hidden"
            >
              {/* Glow hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />

              <div className="p-6 relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
                      <Dumbbell className="h-6 w-6 text-primary" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold group-hover:text-primary transition">
                        {module.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Guided Workout
                      </p>
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-secondary text-xs">
                    <Clock className="w-3 h-3" />
                    {module.duration}
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-secondary text-xs">
                    <Zap className="w-3 h-3" />
                    {module.intensity}
                  </div>
                </div>

                {/* Exercises */}
                <div className="mb-6">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    Exercises
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {module.exerciseIds.map((eid) => (
                      <span
                        key={eid}
                        className="px-3 py-1 text-xs rounded-md bg-muted border border-border capitalize"
                      >
                        {eid.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={() => handleStartModule(module.id)}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Module
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}