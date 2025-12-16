import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/DashBoard";
import { api } from "./services/api";
import { User } from "./types";
import { useAutoLogout } from "./hooks/useAutoLogout";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState("login");

  useEffect(() => {
    const currentUser = api.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setCurrentView("dashboard");
    }
  }, []);

  const handleLogout = useCallback(() => {
    api.logout();
    setUser(null);
    setCurrentView("login");
  }, []);

  useAutoLogout(handleLogout, user ? 300000 : 999999999);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView("dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {user && <Navbar user={user} onLogout={handleLogout} />}

      <main className={user ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : ""}>

        {!user && currentView === "login" && (
          <Login
            onLogin={handleLogin}
            onRegisterClick={() => setCurrentView("register")}
          />
        )}

        {!user && currentView === "register" && (
          <Register
            onRegister={handleLogin}
            onLoginClick={() => setCurrentView("login")}
          />
        )}

        {user && currentView === "dashboard" && (
           <Dashboard user={user} />
        )}
      </main>
    </div>
  );
}

export default App;