import { Grievance, GrievanceCategory, GrievanceStatus } from '../types';
import { INITIAL_GRIEVANCES } from './mockData';

// Simulating a backend store
let grievances: Grievance[] = [...INITIAL_GRIEVANCES];

export const GrievanceService = {
  getAll: async (): Promise<Grievance[]> => {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => resolve([...grievances]), 500);
    });
  },

  add: async (
    title: string, 
    description: string, 
    category: GrievanceCategory, 
    userEmail: string
  ): Promise<Grievance> => {
    return new Promise((resolve) => {
      const newGrievance: Grievance = {
        id: grievances.length > 0 ? Math.max(...grievances.map(g => g.id)) + 1 : 1,
        title,
        description,
        category,
        status: GrievanceStatus.OPEN,
        submittedBy: userEmail,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      grievances = [newGrievance, ...grievances];
      setTimeout(() => resolve(newGrievance), 500);
    });
  },

  updateStatus: async (id: number, status: GrievanceStatus, resolutionNotes?: string): Promise<Grievance> => {
    return new Promise((resolve, reject) => {
      const index = grievances.findIndex(g => g.id === id);
      if (index === -1) {
        reject(new Error("Grievance not found"));
        return;
      }

      const updatedGrievance = {
        ...grievances[index],
        status,
        updatedAt: new Date().toISOString(),
        ...(resolutionNotes && { resolutionNotes })
      };
      
      grievances[index] = updatedGrievance;
      setTimeout(() => resolve(updatedGrievance), 500);
    });
  },

  getStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          total: grievances.length,
          pending: grievances.filter(g => g.status === GrievanceStatus.OPEN).length,
          resolved: grievances.filter(g => g.status === GrievanceStatus.RESOLVED).length,
          escalated: grievances.filter(g => g.status === GrievanceStatus.ESCALATED).length,
        });
      }, 300);
    });
  }
};