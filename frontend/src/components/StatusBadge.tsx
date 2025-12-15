import React from 'react';
import { GrievanceStatus } from '../types';
import { Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface StatusBadgeProps {
  status: GrievanceStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = (s: GrievanceStatus) => {
    switch (s) {
      case GrievanceStatus.PENDING:
        return {
          container: 'bg-amber-50 border-amber-200 text-amber-700',
          dot: 'bg-amber-500',
          icon: <Clock className="w-3.5 h-3.5" />
        };
      case GrievanceStatus.IN_PROGRESS:
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-700',
          dot: 'bg-blue-500',
          icon: <RefreshCw className="w-3.5 h-3.5" />
        };
      case GrievanceStatus.RESOLVED:
        return {
          container: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />
        };
      case GrievanceStatus.ESCALATED:
        return {
          container: 'bg-red-50 border-red-200 text-red-700',
          dot: 'bg-red-500',
          icon: <AlertCircle className="w-3.5 h-3.5" />
        };
      default:
        return {
          container: 'bg-slate-50 border-slate-200 text-slate-600',
          dot: 'bg-slate-400',
          icon: null
        };
    }
  };

  const style = getStyles(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${style.container} transition-all duration-200 hover:shadow-sm`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${style.dot} animate-pulse`}></span>
      <span className="mr-1.5">{status}</span>
      {style.icon}
    </span>
  );
};
