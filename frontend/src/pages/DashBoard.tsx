import React, { useEffect, useState } from 'react';
import { User, UserRole, Grievance } from '../types';
import { api } from '../services/api';
import { AdminDashBoard } from './AdminDashBoard';
import { StudentDashboard } from './StudentDashBoard';
import { Loader2 } from 'lucide-react';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const allGrievances = await api.getGrievances();

      if (user.role === UserRole.ADMIN) {
        setGrievances(allGrievances);
      } else {
        // Filter based on userId
        setGrievances(allGrievances.filter(g => g.userId === user.id));
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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (user.role === UserRole.ADMIN) {
    return <AdminDashBoard user={user} grievances={grievances} onUpdate={fetchData} />;
  }

  return <StudentDashboard user={user} grievances={grievances} onUpdate={fetchData} />;
};
