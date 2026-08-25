import React, { useState } from 'react';
import {
    Container, Box, Paper, Typography, Button, Alert,
    Divider, Avatar, Tab, Tabs, Chip, TextField,
    InputAdornment, IconButton
} from '@mui/material';
import { 
    AccountBalance, Person, AdminPanelSettings, Security,
    Email, Lock, Visibility, VisibilityOff, PersonAdd
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [role, setRole] = useState('customer');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });

    const handleRoleChange = (event, newValue) => {
        setRole(newValue);
        setError('');
        setIsSignup(false);
        if (newValue === 'admin') {
            setFormData({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'admin123',
                phone: ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: ''
            });
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleToggleMode = () => {
        setIsSignup(!isSignup);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            toast.error('Email and password are required');
            setLoading(false);
            return;
        }

        try {
            let response;
            
            if (isSignup && role === 'customer') {
                // Customer Signup
                if (!formData.name) {
                    setError('Name is required for signup');
                    toast.error('Name is required');
                    setLoading(false);
                    return;
                }
                response = await authAPI.signup({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone
                });
            } else if (role === 'admin') {
                // Admin Login
                response = await authAPI.adminLogin({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                // Customer Login
                response = await authAPI.customerLogin({
                    email: formData.email,
                    password: formData.password
                });
            }

            if (response.data && response.data.success) {
                const userData = response.data.user;
                login(response.data.token, userData);
                toast.success(isSignup ? 'Account created successfully!' : 'Welcome back!');
                navigate(role === 'admin' ? '/admin' : '/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            toast.error(err.response?.data?.error || 'Login failed');
        }
        setLoading(false);
    };

    const handleDemoLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await authAPI.demoLogin();
            if (response.data && response.data.success) {
                const userData = response.data.user;
                login(response.data.token, userData);
                toast.success('Welcome Demo User!');
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Demo login failed');
            toast.error('Demo login failed');
        }
        setLoading(false);
    };

    const getTitle = () => {
        if (role === 'admin') return 'Admin Login';
        if (isSignup) return 'Create Account';
        return 'Customer Login';
    };

    const getButtonText = () => {
        if (role === 'admin') return '🔐 Admin Login';
        if (isSignup) return 'Create Account';
        return '👤 Customer Login';
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 30%, #b3e5fc 70%, #e1f5fe 100%)'
        }}>
            <Container maxWidth="sm">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: '#ffffff' }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Avatar sx={{
                                width: 72,
                                height: 72,
                                margin: '0 auto',
                                background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)'
                            }}>
                                <AccountBalance sx={{ fontSize: 36, color: '#ffffff' }} />
                            </Avatar>
                            <Typography variant="h4" sx={{ mt: 2, fontWeight: 700, color: '#1a2e1a' }}>
                                AdaptiveTrust
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#4a6a4a' }}>
                                Smart Underwriting Platform
                            </Typography>
                        </Box>

                        <Tabs
                            value={role}
                            onChange={handleRoleChange}
                            variant="fullWidth"
                            sx={{
                                mb: 3,
                                bgcolor: '#f0f5f0',
                                borderRadius: 2,
                                '& .MuiTab-root': {
                                    color: '#4a6a4a',
                                    fontWeight: 600,
                                    '&.Mui-selected': {
                                        color: '#ffffff',
                                        background: role === 'admin'
                                            ? 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)'
                                            : 'linear-gradient(135deg, #ff6f00 0%, #ffab00 100%)',
                                        borderRadius: 2,
                                        boxShadow: role === 'admin'
                                            ? '0 4px 20px rgba(13,71,161,0.3)'
                                            : '0 4px 20px rgba(255,111,0,0.3)'
                                    }
                                },
                                '& .MuiTabs-indicator': { display: 'none' }
                            }}
                        >
                            <Tab icon={<Person />} label="Customer" value="customer" />
                            <Tab icon={<AdminPanelSettings />} label="Admin" value="admin" />
                        </Tabs>

                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Chip
                                label={role === 'admin' ? '🔐 Admin Access' : isSignup ? '📝 Sign Up' : '👤 Customer Login'}
                                sx={{
                                    bgcolor: role === 'admin' ? 'rgba(13,71,161,0.08)' : isSignup ? 'rgba(0,200,0,0.08)' : 'rgba(255,111,0,0.08)',
                                    color: role === 'admin' ? '#0d47a1' : isSignup ? '#2e7d32' : '#ff6f00',
                                    fontWeight: 600
                                }}
                            />
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            {isSignup && role === 'customer' && (
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    sx={{ mb: 2 }}
                                    required
                                />
                            )}
                            
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                sx={{ mb: 2 }}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: '#8aaa8a' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleInputChange}
                                sx={{ mb: isSignup && role === 'customer' ? 2 : 3 }}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: '#8aaa8a' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {isSignup && role === 'customer' && (
                                <TextField
                                    fullWidth
                                    label="Phone Number (Optional)"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    sx={{ mb: 2 }}
                                />
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    py: 1.8,
                                    borderRadius: 3,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    background: role === 'admin'
                                        ? 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)'
                                        : isSignup
                                        ? 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)'
                                        : 'linear-gradient(135deg, #ff6f00 0%, #ffab00 100%)',
                                    textTransform: 'none',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
                                    }
                                }}
                            >
                                {loading ? 'Processing...' : getButtonText()}
                            </Button>
                        </form>

                        {role === 'customer' && (
                            <>
                                <Divider sx={{ my: 3 }}>
                                    {isSignup ? 'Already have an account?' : 'New user?'}
                                </Divider>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="large"
                                    onClick={handleToggleMode}
                                    sx={{
                                        py: 1.8,
                                        borderRadius: 3,
                                        borderColor: isSignup ? '#2e7d32' : '#ff6f00',
                                        color: isSignup ? '#2e7d32' : '#ff6f00',
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: isSignup ? '#1b5e20' : '#e65100',
                                            background: isSignup ? 'rgba(46,125,50,0.05)' : 'rgba(255,111,0,0.05)'
                                        }
                                    }}
                                    startIcon={isSignup ? <Person /> : <PersonAdd />}
                                >
                                    {isSignup ? 'Login to Existing Account' : 'Create New Account'}
                                </Button>

                                <Divider sx={{ my: 3 }}>or</Divider>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="large"
                                    onClick={handleDemoLogin}
                                    disabled={loading}
                                    sx={{
                                        py: 1.8,
                                        borderRadius: 3,
                                        borderColor: '#0d47a1',
                                        color: '#0d47a1',
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: '#1976d2',
                                            background: 'rgba(13,71,161,0.05)'
                                        }
                                    }}
                                >
                                    🚀 Demo Login
                                </Button>
                            </>
                        )}

                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: '#8aaa8a' }}>
                            <Security sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                            Secure & Encrypted Platform
                        </Typography>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Login;
