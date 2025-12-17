import React, { useState } from 'react';
import { api } from '../services/api';
import { User, UserRole } from '../types';
import {
  Loader2,
  AlertCircle,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  Lock
} from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      // This will now throw a specific error if backend rejects it
      const user = await api.login(email, password, role);
      onLogin(user);
    } catch (err: any) {
      // FIX: Use the actual error message from the backend/api.ts
      // This will now say "Invalid credentials" or "User not found"
      setError(err.message || 'Login failed. Please try again.');
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
      {/* LEFT SIDE - Colorful Visuals */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-fuchsia-800 opacity-90"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 h-full text-white">
          <div className="mb-8">
             <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 mb-6 shadow-xl">
               <ShieldCheck className="h-8 w-8 text-indigo-300 mr-3" />
               <span className="text-2xl font-bold tracking-tight text-white">UniVoice</span>
             </div>
             <h1 className="text-5xl font-extrabold leading-tight mb-6">
               Empowering Your <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-pink-200">Campus Experience</span>
             </h1>
             <p className="text-lg text-indigo-100 max-w-md leading-relaxed">
               Welcome to the centralized Grievance Redressal Portal.
               Submit tickets, track resolutions, and communicate securely with administration.
             </p>
          </div>
          <div className="mt-12 text-xs text-indigo-200/60 font-medium">
            © 2025 University Administration System. Secure connection.
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-gray-50/50">
        <div className="w-full max-w-md space-y-8 animate-enter">

          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-500">
              Please enter your details to sign in.
            </p>
          </div>

          {/* ERROR ALERT BOX */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Login Failed</h3>
                {/* This will now show the specific reason */}
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Role Selection Tabs */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 block">Select your role</label>
              <div className="grid grid-cols-3 gap-3">
                {[UserRole.STUDENT, UserRole.FACULTY, UserRole.ADMIN].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`
                      relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 outline-none
                      ${role === r
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-indigo-200 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className={`mb-2 ${role === r ? 'text-indigo-600' : 'text-gray-400'}`}>
                      {getRoleIcon(r)}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{r}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  className="input-primary"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="input-primary pl-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onRegisterClick}
                  className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
                >
                  Create an account
                </button>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};