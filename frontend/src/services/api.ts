import { Grievance, UserRole, User, GrievanceStatus, GrievanceCategory } from '../types';

const API_URL = 'http://localhost:8080/api/grievances';
const CURRENT_USER_KEY = 'gms_current_user';

// Mock data updated with correct Enum values
const MOCK_GRIEVANCES: Grievance[] = [
  {
    id: 1,
    userId: 'u1',
    userName: 'Sangeeta Student',
    title: 'Wi-Fi Connection Issue',
    description: 'The Wi-Fi in the library has been down for 2 days. It disrupts our research work significantly.',
    category: GrievanceCategory.FACILITY,
    status: GrievanceStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    userId: 'u1',
    userName: 'Sangeeta Student',
    title: 'Grade Discrepancy',
    description: 'My grade for CS101 is incorrect on the portal.',
    category: GrievanceCategory.ACADEMIC,
    status: GrievanceStatus.IN_PROGRESS,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    userId: 'u2',
    userName: 'John Doe',
    title: 'Harassment Report',
    description: 'Reporting an incident at the cafeteria.',
    category: GrievanceCategory.HARASSMENT,
    status: GrievanceStatus.ESCALATED,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const api = {
  login: async (email: string, password?: string, role?: UserRole): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (!password || password.length < 4) throw new Error("Invalid credentials.");

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email: email,
      role: role || UserRole.STUDENT
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  register: async (name: string, email: string, role: UserRole, password?: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role
    };
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

  getGrievances: async (): Promise<Grievance[]> => {
    try {
      const response = await fetch(`${API_URL}/getAll`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      return data;
    } catch (e) {
      console.warn("Backend offline, using mock data.");
      return MOCK_GRIEVANCES;
    }
  },

  createGrievance: async (grievance: Partial<Grievance>): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grievance),
      });
      if (!response.ok) throw new Error('Failed to create');
      return await response.text();
    } catch (e) {
      console.warn("Backend offline, simulating creation.");
      return "Success";
    }
  },

  updateGrievance: async (id: number, updates: Partial<Grievance>) => {
    try {
      const response = await fetch(`${API_URL}/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update');
    } catch (e) {
      console.warn("Backend offline, simulating update.");
      return;
    }
  }
};