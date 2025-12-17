import React, { useState } from 'react';
import { User, Grievance, GrievanceStatus, GrievanceCategory } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import {
  CheckCircle,
  Clock,
  Search,
  MessageSquare,
  GraduationCap,
  AlertCircle,
  Download
} from 'lucide-react';

interface FacultyDashboardProps {
  user: User;
  grievances: Grievance[];
  onUpdate: () => void;
}

export const FacultyDashBoard: React.FC<FacultyDashboardProps> = ({ user, grievances, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  const relevantGrievances = grievances.filter(g =>
    g.category === GrievanceCategory.ACADEMIC ||
    g.category === GrievanceCategory.FACULTY ||
    g.category === GrievanceCategory.OTHER
  );

  const filteredGrievances = relevantGrievances.filter(g => {
    const matchesSearch = g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          g.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || g.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = relevantGrievances.filter(g => g.status === GrievanceStatus.PENDING).length;
  const resolvedCount = relevantGrievances.filter(g => g.status === GrievanceStatus.RESOLVED).length;

  const handleUpdate = async (status: GrievanceStatus) => {
    if (!selectedGrievance) return;
    setLoadingAction(true);
    try {
      await api.updateGrievance(selectedGrievance.id, {
        status: status,
        resolutionNotes: resolutionNote
      });
      setSelectedGrievance(null);
      setResolutionNote('');
      onUpdate();
    } catch (e) {
      alert("Failed to update grievance");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="space-y-8 animate-enter">
      <div className="flex justify-between items-center border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            Faculty Portal
          </h1>
          <p className="text-gray-500 mt-1">Manage academic inquiries and student grievances.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-amber-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Actions</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{pendingCount}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-emerald-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Resolved Cases</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{resolvedCount}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-4 justify-between items-center">
          <h3 className="font-bold text-gray-800">Student Requests</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search student or issue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Status</option>
              {Object.values(GrievanceStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredGrievances.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No grievances found matching your criteria.
            </div>
          ) : (
            filteredGrievances.map((grievance) => (
              <div key={grievance.id} className="group hover:bg-slate-50 transition-colors">
                <div className="p-6 flex flex-col sm:flex-row gap-4">

                  <div className="flex items-start min-w-[180px]">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {grievance.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-bold text-gray-900">{grievance.userName}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                        {grievance.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-gray-800 text-sm leading-relaxed">{grievance.description}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(grievance.createdAt).toLocaleDateString()}
                      </span>

                      {/* DOWNLOAD BUTTON */}
                      {grievance.fileName && (
                         <a
                           href={`http://localhost:8080/api/grievances/download/${grievance.id}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition-colors"
                         >
                           <Download className="h-3 w-3" />
                           Attachment ({grievance.fileName})
                         </a>
                       )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 min-w-[140px]">
                    <StatusBadge status={grievance.status} />
                    <button
                      onClick={() => setSelectedGrievance(selectedGrievance?.id === grievance.id ? null : grievance)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      {selectedGrievance?.id === grievance.id ? 'Cancel' : 'Review'}
                    </button>
                  </div>
                </div>

                {selectedGrievance?.id === grievance.id && (
                  <div className="px-6 pb-6 pt-2 bg-indigo-50/30 border-t border-indigo-100 animate-enter">
                    <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                      <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Add Resolution Notes
                      </h4>
                      <textarea
                        className="w-full input-primary text-sm"
                        rows={3}
                        placeholder="Explain the resolution or ask for more details..."
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                      />
                      <div className="flex justify-end gap-3 mt-3">
                        <button
                          disabled={loadingAction}
                          onClick={() => handleUpdate(GrievanceStatus.IN_PROGRESS)}
                          className="px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-sm font-medium transition-colors"
                        >
                          Mark In Progress
                        </button>
                        <button
                          disabled={loadingAction}
                          onClick={() => handleUpdate(GrievanceStatus.RESOLVED)}
                          className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                          {loadingAction ? 'Updating...' : 'Resolve Issue'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};