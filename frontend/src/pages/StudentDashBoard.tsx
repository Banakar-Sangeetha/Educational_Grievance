import React, { useState } from 'react';
import { User, Grievance, UserRole } from '../types'; // Import UserRole
import { StatusBadge } from '../components/StatusBadge';
import { SubmitGrievanceModal } from '../pages/SubmitGrievanceModal';
import {
  Plus,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  Download // Import Download icon
} from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  grievances: Grievance[];
  onUpdate: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, grievances, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // --- DYNAMIC TITLE LOGIC ---
  const dashboardTitle = user.role === UserRole.FACULTY ? "Faculty Portal" : "Student Portal";
  const dashboardSubtitle = user.role === UserRole.FACULTY
    ? "Manage your faculty-related inquiries."
    : "Submit and track your academic grievances.";

  const filteredGrievances = grievances.filter(g => {
    const matchesSearch = g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          g.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = grievances.filter(g => g.status === 'PENDING').length;
  const resolvedCount = grievances.filter(g => g.status === 'RESOLVED').length;

  return (
    <div className="space-y-8 animate-enter">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            {dashboardTitle} {/* <--- Uses dynamic title */}
          </h1>
          <p className="text-gray-500 mt-1">{dashboardSubtitle}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-indigo-200"
        >
          <Plus className="h-5 w-5" />
          New Grievance
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-indigo-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Submitted</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{grievances.length}</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl">
            <Clock className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
        {/* ... (Keep other stats cards same) ... */}
      </div>

      {/* List Section */}
      <div className="glass-card overflow-hidden">
        {/* ... (Keep Filter/Search Inputs same) ... */}

        <div className="divide-y divide-gray-100">
          {filteredGrievances.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="inline-flex p-4 rounded-full bg-gray-50 mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <p>No grievances found.</p>
            </div>
          ) : (
            filteredGrievances.map((grievance) => (
              <div key={grievance.id} className="p-6 hover:bg-slate-50 transition-all duration-200">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {grievance.category}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(grievance.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium leading-relaxed">{grievance.description}</p>

                    {/* DOWNLOAD LINK (If file exists) */}
                    {grievance.fileName && (
                      <div className="pt-2">
                         <a
                           href={`http://localhost:8080/api/grievances/download/${grievance.id}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                         >
                           <Download className="h-3 w-3" />
                           View Attachment ({grievance.fileName})
                         </a>
                      </div>
                    )}

                    {grievance.resolutionNotes && (
                      <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-100">
                        <p className="text-sm font-semibold text-green-800 mb-1 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Resolution Notes
                        </p>
                        <p className="text-sm text-green-700">{grievance.resolutionNotes}</p>
                      </div>
                    )}
                  </div>
                  <StatusBadge status={grievance.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <SubmitGrievanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onSuccess={() => {
          setIsModalOpen(false);
          onUpdate();
        }}
      />
    </div>
  );
};