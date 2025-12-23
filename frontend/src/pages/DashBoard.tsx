import React, { useEffect, useState } from 'react';
import { User, UserRole, Grievance } from '../types';
import { api } from '../services/api';
import { AdminDashBoard } from './AdminDashBoard';
import { StudentDashboard } from './StudentDashBoard'; // Used for both Student & Faculty
import { Loader2 } from 'lucide-react';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);

  const userRole = user.role ? user.role.toUpperCase() : 'STUDENT';

  const fetchData = async () => {
    setLoading(true);
    try {
      const allGrievances = await api.getGrievances();

      if (userRole === 'ADMIN') {
        // Admin sees EVERYONE'S data
        setGrievances(allGrievances);
      }
      else {
        // Faculty AND Students see ONLY THEIR OWN data
        const myGrievances = allGrievances.filter(g => g.userId === user.id);
        setGrievances(myGrievances);
      }
    } catch (error) {
      console.error('Failed to fetch grievances', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
         <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  // --- ROUTING ---

  // 1. Admin gets the special Resolution Dashboard
  if (userRole === 'ADMIN') {
    return <AdminDashBoard user={user} grievances={grievances} onUpdate={fetchData} />;
  }

  // 2. Everyone else (Faculty & Student) gets the Submission Dashboard
  // The Component inside determines the title based on user.role
  return <StudentDashboard user={user} grievances={grievances} onUpdate={fetchData} />;
};