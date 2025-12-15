import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { LogOut, ShieldCheck, Bell, ChevronDown } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Area */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              Grievance<span className="text-indigo-600">Sys</span>
            </span>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                {/* Notification Bell */}
                <button className="relative p-2 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-colors border border-transparent focus:outline-none"
                  >
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="hidden md:flex flex-col items-start text-left">
                      <span className="text-sm font-semibold text-slate-700 leading-none">{user.name}</span>
                      <span className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">{user.role}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none transform origin-top-right transition-all animate-enter">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={onLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
