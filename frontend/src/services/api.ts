import { Grievance, UserRole, User, GrievanceStatus, GrievanceCategory } from '../types';

const API_URL = 'http://localhost:8080/api/grievances';
const CURRENT_USER_KEY = 'gms_current_user';

export const api = {

  login: async (email: string, password?: string, role?: UserRole): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid credentials");
      }

      const user = await response.json();
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;

    } catch (e: any) {
      console.error("Login Error:", e);
      throw e;
    }
  },

  register: async (name: string, email: string, role: UserRole, password?: string): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, password })
      });

      if (!response.ok) {
        throw new Error("Registration failed. Email might already exist.");
      }

      const user = await response.json();
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;

    } catch (e) {
      console.error("Registration Error:", e);
      throw e;
    }
  },

  logout: async () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  getGrievances: async (): Promise<Grievance[]> => {
    try {
      const response = await fetch(`${API_URL}/getAll`);
      if (!response.ok) throw new Error('Failed to fetch grievances');

      const data = await response.json();
      return data;
    } catch (e) {
      console.error("Fetch Error:", e);
      throw new Error("Could not load grievances. Is the backend running?");
    }
  },

  // UPDATED: Now accepts FormData for file uploads
  createGrievance: async (formData: FormData): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        body: formData, // No JSON headers here!
      });
      if (!response.ok) throw new Error('Failed to create grievance');
      return await response.text();
    } catch (e) {
      console.error("Create Error:", e);
      throw e;
    }
  },

  updateGrievance: async (id: number, updates: Partial<Grievance>) => {
    try {
      const response = await fetch(`${API_URL}/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update grievance');
      return await response.json();
    } catch (e) {
      console.error("Update Error:", e);
      throw e;
    }
  }
};