import React, { useState } from 'react';
import { User, Grievance, GrievanceStatus } from '../types';
import { PlusCircle, FileText, Clock, CheckCircle, Search, Filter } from 'lucide-react';
import { SubmitGrievanceModal } from './SubmitGrievanceModal';
import { StatusBadge } from '../components/StatusBadge';

interface StudentDashboardProps {
  user: User;
  grievances: Grievance[];
  onUpdate: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, grievances, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredGrievances = grievances.filter(g => {
    if (statusFilter === 'ALL') return true;
    return g.status === statusFilter;
  });

  const stats = {
    total: grievances.length,
    pending: grievances.filter(g => g.status === GrievanceStatus.PENDING).length,
    resolved: grievances.filter(g => g.status === GrievanceStatus.RESOLVED).length,
  };

  return (
    <div className="space-y-8 animate-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
          <p className="text-slate-500 mt-2">Track and manage your submitted grievances.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary shadow-indigo-500/25"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          New Grievance
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="glass-card p-6 border-l-4 border-indigo-500">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Total Submitted</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-amber-500">
          <div className="flex items-center">
             <div className="p-3 bg-amber-50 rounded-xl">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-emerald-500">
          <div className="flex items-center">
             <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Resolved</p>
              <p className="text-2xl font-bold text-slate-900">{stats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input-primary pl-10"
            placeholder="Search by ID or description..."
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-primary py-2 pr-8"
          >
            <option value="ALL">All Statuses</option>
            {Object.values(GrievanceStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grievance Cards List */}
      <div className="space-y-4">
        {filteredGrievances.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <FileText className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No grievances found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new ticket.</p>
          </div>
        ) : (
          filteredGrievances.map((grievance) => (
            <div key={grievance.id} className="glass-card p-6 flex flex-col sm:flex-row gap-4 sm:items-center hover:border-indigo-300 group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                    {grievance.category}
                  </span>
                  <span className="text-xs text-gray-400">
                     • ID: #{grievance.id} • {new Date(grievance.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {grievance.description.substring(0, 80)}...
                </h4>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 min-w-[200px]">
                <StatusBadge status={grievance.status} />
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
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
