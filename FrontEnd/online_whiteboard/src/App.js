import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Home from './components/Home';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if session token exists in local storage
    const token = localStorage.getItem('authToken');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (data) => {
    setLoggedIn(true);
    setUserData(data);
    console.log(data);
  };

  const handleRegisterSuccess = () => {
    return <Navigate to="/login" />;
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserData(null);
    localStorage.removeItem('authToken');
    return <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={loggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={loggedIn ? <Navigate to="/home" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/register"
          element={loggedIn ? <Navigate to="/login" /> : <RegisterPage onRegisterSuccess={handleRegisterSuccess} />}
        />
        <Route
          path="/home"
          element={loggedIn ? <Home userData={userData} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
