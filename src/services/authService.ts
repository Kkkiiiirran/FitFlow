const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface WorkoutData {
  exercises: Array<{
    name: string;
    sets?: number;
    reps?: number;
    duration?: number;
  }>;
  duration: number;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;
  }

  async signup(name: string, email: string, password: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.error || `Signup failed (${response.status})`);
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.error || `Login failed (${response.status})`);
    }

    const data: AuthResponse = await response.json();
    this.token = data.token;
    this.user = data.user;
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  async recordWorkout(workoutData: WorkoutData): Promise<void> {
    if (!this.token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(workoutData)
    });

    if (!response.ok) {
      throw new Error('Failed to record workout');
    }
  }

  async getHeatmapData(userId: number): Promise<Array<{ activity_date: string; workout_count: number }>> {
    if (!this.token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/heatmap/${userId}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch heatmap data');
    }

    return response.json();
  }

  async getUserStats(userId: number): Promise<{ totalWorkouts: number; totalMinutes: number; currentStreak: number }> {
    if (!this.token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/user-stats/${userId}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user stats');
    }

    return response.json();
  }
}

export const authService = new AuthService();