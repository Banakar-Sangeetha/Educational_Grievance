import React, { useState } from 'react';
import { api } from '../services/api';
import { User, UserRole } from '../types';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal'; // <--- IMPORT THIS
import { Loader2, AlertCircle, GraduationCap, Briefcase, ShieldCheck, ArrowRight, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  onRegisterClick: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false); // <--- NEW STATE

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const user = await api.login(email, password, role);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (r: UserRole) => {
    switch (r) {
      case UserRole.STUDENT: return <GraduationCap className="h-6 w-6" />;
      case UserRole.FACULTY: return <Briefcase className="h-6 w-6" />;
      case UserRole.ADMIN: return <ShieldCheck className="h-6 w-6" />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* ... (Left Side Visuals remain same) ... */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900">
         {/* ... (Keep existing visual code) ... */}
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-fuchsia-800 opacity-90"></div>
         <div className="relative z-10 flex flex-col justify-center px-16 h-full text-white">
           <h1 className="text-5xl font-extrabold leading-tight mb-6">UniVoice Portal</h1>
         </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-gray-50/50">
        <div className="w-full max-w-md space-y-8 animate-enter">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-500">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 shrink-0" />
              <div><p className="text-sm text-red-700 mt-1">{error}</p></div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* ... (Role Buttons Code Remains Same) ... */}
             <div className="grid grid-cols-3 gap-3">
                {[UserRole.STUDENT, UserRole.FACULTY, UserRole.ADMIN].map((r) => (
                  <button
                    key={r} type="button" onClick={() => setRole(r)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 outline-none ${role === r ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm' : 'border-gray-200 bg-white text-gray-500 hover:border-indigo-200'}`}
                  >
                    <div className={`mb-2 ${role === r ? 'text-indigo-600' : 'text-gray-400'}`}>{getRoleIcon(r)}</div>
                    <span className="text-xs font-bold uppercase tracking-wider">{r}</span>
                  </button>
                ))}
              </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input type="email" required className="input-primary" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>

                  {/* --- FORGOT PASSWORD LINK --- */}
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input type="password" required className="input-primary pl-10" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base shadow-xl">
              {loading ? <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> : <>Sign In to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></>}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button type="button" onClick={onRegisterClick} className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">Create an account</button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* --- ADD MODAL HERE --- */}
      <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => setIsForgotModalOpen(false)} />
    </div>
  );
};