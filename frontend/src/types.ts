export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  FACULTY = 'faculty'
}

export enum GrievanceStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  ESCALATED = 'Escalated'
}

export enum GrievanceCategory {
  ACADEMIC = 'Academic',
  FACILITY = 'Facility',
  ADMINISTRATION = 'Administration',
  HARASSMENT = 'Harassment',
  OTHER = 'Other'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string; // Added optional avatar support
  password?: string;
}

export interface Grievance {
  id: number;
  userId: string; // Ensuring we can track who created it
  userName: string;
  title?: string;
  description: string;
  category: GrievanceCategory;
  status: GrievanceStatus;
  createdAt: string;
  updatedAt: string;
  fileName?: string;
  resolutionNotes?: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  resolved: number;
  escalated: number;
}