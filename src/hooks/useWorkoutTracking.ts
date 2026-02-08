import { useState } from 'react';
import { authService, WorkoutData } from '@/services/authService';

export const useWorkoutTracking = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<{
    exercises: Array<{ name: string; sets?: number; reps?: number; duration?: number }>;
    startTime: Date;
  } | null>(null);

  const startWorkout = () => {
    setCurrentWorkout({
      exercises: [],
      startTime: new Date()
    });
    setIsRecording(true);
  };

  const addExercise = (exercise: { name: string; sets?: number; reps?: number; duration?: number }) => {
    if (!currentWorkout) return;
    
    setCurrentWorkout(prev => ({
      ...prev!,
      exercises: [...prev!.exercises, exercise]
    }));
  };

  const finishWorkout = async (additionalExercise?: { name: string; sets?: number; reps?: number; duration?: number }): Promise<boolean> => {
    if (!currentWorkout && !additionalExercise) return false;
    
    try {
      const startTime = currentWorkout?.startTime ?? new Date();
      const duration = Math.round((Date.now() - startTime.getTime()) / 60000); // minutes
      const exercises = [...(currentWorkout?.exercises ?? []), ...(additionalExercise ? [additionalExercise] : [])];
      
      if (exercises.length === 0) return false;
      
      const workoutData: WorkoutData = {
        exercises,
        duration: Math.max(1, duration) // Minimum 1 minute
      };
      
      await authService.recordWorkout(workoutData);
      
      setCurrentWorkout(null);
      setIsRecording(false);
      
      return true;
    } catch (error) {
      console.error('Failed to record workout:', error);
      return false;
    }
  };

  const cancelWorkout = () => {
    setCurrentWorkout(null);
    setIsRecording(false);
  };

  return {
    isRecording,
    currentWorkout,
    startWorkout,
    addExercise,
    finishWorkout,
    cancelWorkout
  };
};