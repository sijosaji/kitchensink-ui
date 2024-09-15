import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';

const App = () => {
    const [tokens, setTokens] = useState({
        accessToken: localStorage.getItem('accessToken')
    });

    const handleLogin = (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setTokens({ accessToken});
    };

    const isAuthenticated = !!tokens.accessToken;

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage setTokens={handleLogin} />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
