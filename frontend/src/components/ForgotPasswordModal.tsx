import React, { useState } from 'react';
import { X, Mail, Lock, KeyRound, Loader2 } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Pass
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrorMsg('');

    try {
      // NOTE: Ensure port matches your backend (8080 or 9090)
      const res = await fetch('http://localhost:8080/api/grievances/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        // Throw the specific error from the backend (e.g. "Email not found")
        throw new Error(data.message || "Something went wrong");
      }

      setMessage("OTP sent! (Check your email or console)");
      setStep(2);

    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:8080/api/grievances/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Invalid OTP");

      alert("Password reset successfully! Please Login.");
      onClose();
      // Reset State
      setStep(1);
      setEmail('');
      setOtp('');
      setNewPassword('');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-enter relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
        <p className="text-sm text-gray-500 mb-6">
          {step === 1 ? "Enter your email to receive an OTP." : "Enter the OTP sent to your email."}
        </p>

        {/* Success Message */}
        {message && <p className="text-green-600 text-sm mb-4 bg-green-50 p-3 rounded-lg border border-green-100">{message}</p>}

        {/* Error Message */}
        {errorMsg && <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-100">{errorMsg}</p>}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email" required
                  className="input-primary pl-10"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2">
              {loading ? <Loader2 className="animate-spin mx-auto"/> : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <div className="relative mt-1">
                <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text" required
                  className="input-primary pl-10"
                  value={otp} onChange={e => setOtp(e.target.value)}
                  placeholder="123456"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password" required
                  className="input-primary pl-10"
                  value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2">
              {loading ? <Loader2 className="animate-spin mx-auto"/> : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};