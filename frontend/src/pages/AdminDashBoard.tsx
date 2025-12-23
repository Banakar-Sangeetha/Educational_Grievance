import React, { useState } from 'react';
import { User, Grievance, GrievanceStatus } from '../types';
import { api } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { StatusBadge } from '../components/StatusBadge';
import { Users, Search, FileBarChart, LayoutDashboard, AlertTriangle, CheckCircle } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  grievances: Grievance[];
  onUpdate: () => void;
}

export const AdminDashBoard: React.FC<AdminDashboardProps> = ({ user, grievances, onUpdate }) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // --- FIX: ROBUST COUNTING LOGIC (Case Insensitive) ---
  const total = grievances.length;

  const pending = grievances.filter(g => g.status.toUpperCase() === 'PENDING').length;
  const inProgress = grievances.filter(g => g.status.toUpperCase() === 'IN_PROGRESS').length;
  const resolved = grievances.filter(g => g.status.toUpperCase() === 'RESOLVED').length;
  const escalated = grievances.filter(g => g.status.toUpperCase() === 'ESCALATED').length;

  const chartData = [
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'In Progress', value: inProgress, color: '#3b82f6' },
    { name: 'Resolved', value: resolved, color: '#10b981' },
    { name: 'Escalated', value: escalated, color: '#ef4444' },
  ];

  const filteredGrievances = grievances.filter(g => {
    const matchesSearch = g.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          g.description.toLowerCase().includes(searchTerm.toLowerCase());

    // FIX: Compare statuses case-insensitively
    const matchesStatus = filterStatus === 'All' || g.status.toUpperCase() === filterStatus.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (id: number, newStatus: GrievanceStatus) => {
    setActionLoading(true);
    try {
      await api.updateGrievance(id, {
        status: newStatus,
        resolutionNotes: resolutionNote || undefined
      });
      setResolutionNote('');
      setSelectedGrievance(null);
      onUpdate();
    } catch (e) {
      alert("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-enter">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Console</h1>
          <p className="text-gray-500 mt-1">Overview of system performance and grievance resolution.</p>
        </div>
        <button className="btn-secondary">
          <Users className="h-4 w-4 mr-2" />
          Manage Users
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Tickets', value: total, icon: LayoutDashboard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Pending', value: pending, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Resolved', value: resolved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Escalated', value: escalated, icon: Users, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, idx) => (
          <div key={idx} className="glass-card p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <FileBarChart className="w-5 h-5 mr-2 text-indigo-500" />
            Status Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-center bg-indigo-50/50 border-dashed border-2 border-indigo-200">
           <div className="text-center">
              <p className="text-indigo-400 font-medium">Activity Analytics Coming Soon</p>
           </div>
        </div>
      </div>

      {/* Management Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-4 justify-between items-center">
          <h3 className="font-bold text-gray-800">Recent Complaints</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredGrievances.map((grievance) => (
                <React.Fragment key={grievance.id}>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {grievance.userName.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{grievance.userName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 truncate max-w-xs" title={grievance.description}>{grievance.description}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">
                        {grievance.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={grievance.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedGrievance(selectedGrievance?.id === grievance.id ? null : grievance)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                        >
                          {selectedGrievance?.id === grievance.id ? 'Close' : 'Manage'}
                        </button>
                    </td>
                  </tr>

                  {selectedGrievance?.id === grievance.id && (
                    <tr className="bg-indigo-50/50">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm animate-enter">
                          <h4 className="font-bold text-gray-900 mb-2">Resolve Complaint</h4>
                          <div className="flex gap-4">
                            <textarea
                              className="flex-1 input-primary"
                              rows={2}
                              placeholder="Enter resolution notes..."
                              value={resolutionNote}
                              onChange={(e) => setResolutionNote(e.target.value)}
                            />
                            <div className="flex flex-col gap-2 min-w-[150px]">
                              <button
                                onClick={() => handleStatusUpdate(grievance.id, GrievanceStatus.RESOLVED)}
                                disabled={actionLoading}
                                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                              >
                                {actionLoading ? 'Saving...' : 'Mark Resolved'}
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(grievance.id, GrievanceStatus.ESCALATED)}
                                disabled={actionLoading}
                                className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                              >
                                Escalate
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};