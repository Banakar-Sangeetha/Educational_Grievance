import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/DashBoard";
import { api } from "./services/api";
import { User } from "./types";
import { useAutoLogout } from "./hooks/useAutoLogout"; // Import the hook

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState("login");

  // 1. Initial Load
  useEffect(() => {
    const currentUser = api.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setCurrentView("dashboard");
    }
  }, []);

  // 2. Define Logout Logic
  const handleLogout = useCallback(() => {
    api.logout();
    setUser(null);
    setCurrentView("login");
  }, []);

  // 3. Activate Auto-Logout Hook (Only runs if user is logged in)
  // If user is null, the hook does nothing (conceptually)
  useAutoLogout(handleLogout, user ? 300000 : 999999999);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView("dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Hide Navbar on Login page for cleaner look */}
      {user && <Navbar user={user} onLogout={handleLogout} />}

      <main className={user ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : ""}>
        {!user && currentView === "login" && <Login onLogin={handleLogin} />}
        {!user && currentView === "register" && <Register onRegister={handleLogin} />}

        {user && currentView === "dashboard" && (
           <Dashboard user={user} />
        )}
      </main>
    </div>
  );
}

export default App;