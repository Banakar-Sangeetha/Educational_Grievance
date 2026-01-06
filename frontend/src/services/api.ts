import { Grievance, UserRole, User, GrievanceStatus, GrievanceCategory } from '../types';

const API_URL = 'http://localhost:8080/api/grievances';
const CURRENT_USER_KEY = 'gms_current_user';

export const api = {

  // --- AUTHENTICATION ---
  login: async (email: string, password?: string, role?: UserRole): Promise<User> => {
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
  },

  register: async (name: string, email: string, role: UserRole, password?: string): Promise<User> => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role, password })
    });
    if (!response.ok) throw new Error("Registration failed.");
    const user = await response.json();
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

  // --- GRIEVANCE MANAGEMENT ---
  getGrievances: async (): Promise<Grievance[]> => {
    const response = await fetch(`${API_URL}/getAll`);
    if (!response.ok) throw new Error('Failed to fetch grievances');
    return await response.json();
  },

  createGrievance: async (formData: FormData): Promise<any> => {
    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create grievance');
    return await response.text();
  },

  updateGrievance: async (id: number, updates: Partial<Grievance>) => {
    const response = await fetch(`${API_URL}/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update grievance');
    return await response.json();
  },

  // --- MISSING USER MANAGEMENT FUNCTIONS ---
  // (You were missing these!)

  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  },

  deleteUser: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  },

  updateUserRole: async (id: string, role: string): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    if (!response.ok) throw new Error("Failed to update role");
  }
};