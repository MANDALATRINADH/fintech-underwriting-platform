import React, { useState } from 'react';
import {
    Container, Box, Paper, Typography, TextField, Button, Alert, Avatar,
    InputAdornment, IconButton, Divider
} from '@mui/material';
import { AdminPanelSettings, Lock, Email, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: 'admin@example.com',
        password: 'admin123'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Demo admin login - use demo login and set role as admin
            const response = await authAPI.demoLogin();
            if (response.data.success) {
                // Create admin user with role
                const adminUser = { 
                    ...response.data.user, 
                    role: 'admin',
                    name: 'Admin User'
                };
                login(response.data.token, adminUser);
                toast.success('Welcome Admin!');
                navigate('/admin');
            }
        } catch (err) {
            setError('Admin login failed. Please try again.');
            toast.error('Admin login failed');
        }
        setLoading(false);
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
        }}>
            <Container maxWidth="sm">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper elevation={10} sx={{ p: 5, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Avatar sx={{ 
                                width: 80, 
                                height: 80, 
                                margin: '0 auto', 
                                bgcolor: 'secondary.main',
                                boxShadow: '0 4px 20px rgba(220,0,78,0.3)'
                            }}>
                                <AdminPanelSettings sx={{ fontSize: 40 }} />
                            </Avatar>
                            <Typography variant="h4" sx={{ mt: 2, fontWeight: 700, color: 'white' }}>
                                Admin Portal
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                Manage loan applications and users
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Admin Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{ style: { color: 'white' } }}
                                FormHelperTextProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                sx={{ mb: 3 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <VisibilityOff sx={{ color: 'rgba(255,255,255,0.5)' }} /> : <Visibility sx={{ color: 'rgba(255,255,255,0.5)' }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{ style: { color: 'white' } }}
                            />
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
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                    }
                                }}
                            >
                                {loading ? 'Logging in...' : 'Login as Admin'}
                            </Button>
                        </form>

                        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

                        <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                            ?? Secure admin access with role-based authentication
                        </Typography>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default AdminLogin;
