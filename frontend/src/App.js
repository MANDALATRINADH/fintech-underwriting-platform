import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { theme } from './styles/theme';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Verification from './pages/Verification';
import Application from './pages/Application';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Layout from './components/Layout/Layout';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/admin-login" />;
    if (user.role !== 'admin') return <Navigate to="/dashboard" />;
    return children;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <Toaster 
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            borderRadius: '12px',
                            padding: '16px',
                            fontSize: '14px'
                        }
                    }}
                />
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route element={<Layout />}>
                            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/verification" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
                            <Route path="/application" element={<ProtectedRoute><Application /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
