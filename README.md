# FITFLOW

An intelligent **AI-powered fitness trainer** that uses real-time pose detection to track exercises, count reps, correct posture, and guide users with voice + audio feedback — all directly from the browser.

Built using **MediaPipe Pose + React + TypeScript**, this system acts like a **personal smart workout coach**.

## Features

### Real-time AI Posture Tracking
- Detects full body pose using **MediaPipe Pose**
- Tracks joints, angles, and body alignment
- Visual skeleton overlay on live camera
- Real-time posture correction
- Smooth landmark tracking for stable detection



### Automated Rep Counting & Feedback
- Detects exercise stages (Up / Down)
- Counts reps automatically
- Filters incorrect / half reps
- Displays:
  - Rep count
  - Current stage
  - Joint angle
- Detects bad form & warns user
- Real-time canvas overlay



### Smart Personal Workout Coach
Acts like an AI trainer:

- Guides user during workout
- Detects:
  - Bad posture
  - Incomplete movement
  - Fast / slow reps
  - Body imbalance
- Gives suggestions:
  - "Raise arm higher"
  - "Slow down"
  - "Keep elbow steady"
  - "Good rep!"



### Voice Assistant (Hands-Free Control)

Control workouts without touching the screen using voice commands:

- **"Start workout"**
- **"Pause"**
- **"Resume"**
- **"Stop workout"**
- **"Switch exercise"**

<!-- Powered by **Browser Speech Recognition API**. -->



###  Audio Feedback & Motivation

Real-time sound guidance:

- Announces rep count
- Stage feedback: `"Up"` / `"Down"`
- Motivational cues:
  - "Great rep!"
  - "Keep going!"
  - "Halfway there!"
  - "Finish strong!"



## Supported Exercises

- Bicep Curl (`setupBicepCurl.ts`)
- Lateral Raise (`setupLateralRaise.ts`)
- Shoulder Press (`setupShoulderPress.ts`)
- Squats (`setupSquats.ts`)



## Project Structure
``` src/
│
├── pages/
│ ├── AuthPage.tsx
│ ├── CameraPosePanel.tsx # Webcam + Pose Detection UI
│ ├── ExercisePanel.tsx # Exercise tracking logic & display
│ ├── ExerciseSelection.tsx # Exercise chooser
│ ├── HomePage.tsx
│ ├── ProfileDashboard.tsx
│ ├── RecipesPage.tsx
│ └── NotFound.tsx
│
├── exercises/
│ ├── calculateAngle.ts 
│ ├── motivation.ts 
│ ├── setupBicepCurl.ts 
│ ├── setupLateralRaise.ts 
│ ├── setupShoulderPress.ts 
│ └── setupSquats.ts 
│
└── utils/
```


## Tech Stack

- React + TypeScript
- MediaPipe Pose
- HTML5 Canvas
- Web Speech API
- Tensor-based pose estimation
- Real-time video processing



## How It Works

1. Webcam captures live video
2. MediaPipe detects body landmarks
3. Joint angles are calculated
4. Exercise logic determines:
   - Stage (Up/Down)
   - Rep count
   - Form correctness
5. UI + Audio + Voice assistant provide feedback



