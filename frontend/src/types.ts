export enum UserRole {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN' // New Role
}

export enum GrievanceStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  ESCALATED = 'ESCALATED'
}

export enum GrievanceCategory {
  ACADEMIC = 'ACADEMIC',
  FACILITY = 'FACILITY',
  ADMINISTRATION = 'ADMINISTRATION',
  HARASSMENT = 'HARASSMENT',
  OTHER = 'OTHER',
  FACULTY = 'FACULTY'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  password?: string;
}

export interface Grievance {
  id: number;
  userId: string;
  userName: string;
  title?: string;
  description: string;
  category: GrievanceCategory;
  status: GrievanceStatus;
  createdAt: string;
  updatedAt?: string;
  fileName?: string;
  resolutionNotes?: string;
  assignedRole?: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  resolved: number;
  escalated: number;
}