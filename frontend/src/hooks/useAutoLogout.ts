import { useEffect, useRef } from 'react';

export const useAutoLogout = (logoutCallback: () => void, timeoutMs: number = 300000) => {
  // 300,000 ms = 5 minutes
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        // Trigger logout if timer finishes
        logoutCallback();
        alert("Session expired due to inactivity.");
      }, timeoutMs);
    };

    // Events to watch
    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    // Attach listeners
    events.forEach(event => window.addEventListener(event, resetTimer));

    // Start timer immediately on load
    resetTimer();

    // Cleanup
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [logoutCallback, timeoutMs]);
};