import React, { useState } from 'react';
import { User, Grievance, GrievanceStatus } from '../types';
import { api } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { StatusBadge } from '../components/StatusBadge';
import { Users, Search, FileBarChart, LayoutDashboard, AlertTriangle, CheckCircle, TrendingUp, Filter, MoreVertical, X } from 'lucide-react';
import { UserManagementModal } from '../components/UserManagementModal';

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

  // Controls the "Manage Users" popup
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // --- STATS LOGIC ---
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

  // Helper for nice Enum display
  const formatStatus = (status: string) => {
    if (status === 'All') return 'All Status';
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-8 animate-enter pb-10">

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Console</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            Welcome back, <span className="font-semibold text-indigo-600">{user.name}</span>
          </p>
        </div>

        {/* MANAGE USERS BUTTON */}
        <button
          onClick={() => setIsUserModalOpen(true)}
          className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5"
        >
          <Users className="h-4 w-4" />
          <span>Manage Users</span>
        </button>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Tickets', value: total, icon: LayoutDashboard, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { label: 'Pending', value: pending, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'Resolved', value: resolved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Escalated', value: escalated, icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white p-6 rounded-2xl shadow-sm border ${stat.border} hover:shadow-md transition-shadow duration-200 flex items-center justify-between`}>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <FileBarChart className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Ticket Status Overview</h3>
          </div>

          {/* FIX: Inline style prevents Recharts crash */}
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Placeholder */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
           <div className="relative z-10">
             <h3 className="text-xl font-bold mb-2">System Health</h3>
             <p className="text-indigo-100 text-sm">All systems are running smoothly. Database connectivity is stable.</p>
           </div>
           <div className="mt-8 relative z-10">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
                <CheckCircle className="h-5 w-5 text-emerald-300" />
                <span className="font-medium">Server Online</span>
              </div>
           </div>

           {/* Decorative circles */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/30 rounded-full -ml-10 -mb-10 blur-xl"></div>
        </div>
      </div>

      {/* --- MANAGEMENT TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Table Toolbar */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            Recent Complaints
            <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">{filteredGrievances.length}</span>
          </h3>

          <div className="flex w-full sm:w-auto gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="All">All Status</option>
                {Object.values(GrievanceStatus).map(s => (
                  <option key={s} value={s}>{formatStatus(s)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Issue Description</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredGrievances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No grievances found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredGrievances.map((grievance) => (
                  <React.Fragment key={grievance.id}>
                    <tr
                      className={`group transition-colors duration-150 ${
                        selectedGrievance?.id === grievance.id ? 'bg-indigo-50/60' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-sm ${
                            ['bg-purple-500', 'bg-indigo-500', 'bg-pink-500', 'bg-blue-500'][grievance.id % 4]
                          }`}>
                            {grievance.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-semibold text-gray-900">{grievance.userName}</p>
                            <p className="text-xs text-gray-500">ID: #{grievance.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 truncate max-w-xs font-medium" title={grievance.description}>
                          {grievance.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          {grievance.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={grievance.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedGrievance(selectedGrievance?.id === grievance.id ? null : grievance)}
                          className={`p-2 rounded-lg transition-all ${
                            selectedGrievance?.id === grievance.id
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                          }`}
                        >
                          {selectedGrievance?.id === grievance.id ? <X className="h-4 w-4" /> : <MoreVertical className="h-4 w-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDED ROW (RESOLUTION AREA) */}
                    {selectedGrievance?.id === grievance.id && (
                      <tr className="bg-indigo-50/60 animate-enter">
                        <td colSpan={5} className="px-6 pb-6 pt-2">
                          <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm ml-12">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-indigo-600" />
                                  Resolution Console
                                </h4>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="flex-1 space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Administrator Notes</label>
                                <textarea
                                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm resize-none"
                                  rows={3}
                                  placeholder="Enter resolution details or escalation reason..."
                                  value={resolutionNote}
                                  onChange={(e) => setResolutionNote(e.target.value)}
                                />
                              </div>

                              <div className="flex flex-col gap-2 min-w-[200px] justify-end">
                                <button
                                  onClick={() => handleStatusUpdate(grievance.id, GrievanceStatus.RESOLVED)}
                                  disabled={actionLoading}
                                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 transition-all hover:shadow-emerald-300 disabled:opacity-50 disabled:shadow-none"
                                >
                                  {actionLoading ? 'Processing...' : 'Mark Resolved'}
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(grievance.id, GrievanceStatus.ESCALATED)}
                                  disabled={actionLoading}
                                  className="w-full py-2.5 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                                >
                                  Escalate Ticket
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER MANAGEMENT MODAL */}
      <UserManagementModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          currentUser={user}
      />
    </div>
  );
};