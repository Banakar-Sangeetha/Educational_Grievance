import React, { useState } from 'react';
import { User, GrievanceCategory } from '../types';
import { api } from '../services/api';
import { X, Upload, Loader2, Send } from 'lucide-react';

interface SubmitGrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSuccess: () => void;
}

export const SubmitGrievanceModal: React.FC<SubmitGrievanceModalProps> = ({ isOpen, onClose, user, onSuccess }) => {
  const [category, setCategory] = useState<GrievanceCategory>(GrievanceCategory.ACADEMIC);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createGrievance({
        userId: user.id,
        userName: user.name,
        category,
        description,
      });
      setDescription('');
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full animate-enter">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Send className="h-4 w-4" />
              Submit Grievance
            </h3>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GrievanceCategory)}
                  className="input-primary"
                >
                  {Object.values(GrievanceCategory).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-primary"
                  placeholder="Describe your issue in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Attachment</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3 text-base shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Ticket'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
