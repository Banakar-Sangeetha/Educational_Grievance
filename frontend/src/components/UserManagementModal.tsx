import React, { useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import { X, Trash2, Shield, GraduationCap, Briefcase, Loader2, UserCog } from 'lucide-react';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User; // We need to know who is looking to filter the list
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await api.getAllUsers();

      // --- HIERARCHY LOGIC ---
      let filteredUsers: User[] = [];

      if (currentUser.role === UserRole.SUPER_ADMIN) {
        // Super Admin manages only ADMINS
        filteredUsers = allUsers.filter(u => u.role === UserRole.ADMIN);
      } else if (currentUser.role === UserRole.ADMIN) {
        // Admin manages STUDENTS and FACULTY
        filteredUsers = allUsers.filter(u =>
          u.role === UserRole.STUDENT || u.role === UserRole.FACULTY
        );
      }

      setUsers(filteredUsers);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to remove this user? This cannot be undone.")) return;

    setProcessingId(userId);
    try {
      await api.deleteUser(userId);
      // Remove from local list immediately
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      alert("Failed to delete user.");
    } finally {
      setProcessingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Manage Users
            </h3>
            <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found for you to manage.
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-100 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm
                        ${user.role === UserRole.ADMIN ? 'bg-purple-500' :
                          user.role === UserRole.FACULTY ? 'bg-indigo-500' : 'bg-emerald-500'}`
                      }>
                        {user.role === UserRole.ADMIN && <Shield className="h-5 w-5" />}
                        {user.role === UserRole.FACULTY && <Briefcase className="h-5 w-5" />}
                        {user.role === UserRole.STUDENT && <GraduationCap className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2 py-1 bg-white border border-gray-200 rounded-md text-gray-600 uppercase">
                        {user.role}
                      </span>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={processingId === user.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete User"
                      >
                        {processingId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};