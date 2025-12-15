import { Grievance, Role, User } from '../types';

// API Configuration
const API_URL = 'http://localhost:8080/api';

// Helper for storing session
const CURRENT_USER_KEY = 'gms_current_user';

export const api = {
  // Authentication
  login: async (email: string, password?: string): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Login failed');
    }

    const user: User = await response.json();
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  register: async (name: string, email: string, role: Role, password?: string): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        role,
        password: password || 'password' // Default password if not provided in simple UI
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Registration failed');
    }

    const user: User = await response.json();
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: async () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Grievances
  getGrievances: async (): Promise<Grievance[]> => {
    const response = await fetch(`${API_URL}/grievances`);
    if (!response.ok) throw new Error('Failed to fetch grievances');
    return await response.json();
  },

  createGrievance: async (grievance: Omit<Grievance, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Grievance> => {
    const response = await fetch(`${API_URL}/grievances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grievance),
    });

    if (!response.ok) throw new Error('Failed to create grievance');
    return await response.json();
  },

  updateGrievance: async (id: string, updates: Partial<Grievance>): Promise<Grievance> => {
    const response = await fetch(`${API_URL}/grievances/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error('Failed to update grievance');
    return await response.json();
  }
};
