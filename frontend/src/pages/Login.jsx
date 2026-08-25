import React, { useState } from 'react';
import {
    Container, Box, Paper, Typography, TextField, Button, Alert, Divider, Avatar
} from '@mui/material';
import { AccountBalance, Email, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDemoLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await authAPI.demoLogin();
            if (response.data.success) {
                login(response.data.token, response.data.user);
                toast.success('Welcome to AdaptiveTrust!');
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Demo login failed. Please try again.');
            toast.error('Login failed');
        }
        setLoading(false);
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Avatar sx={{ width: 80, height: 80, margin: '0 auto', bgcolor: 'primary.main' }}>
                            <AccountBalance sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>AdaptiveTrust</Typography>
                        <Typography variant="body2" color="text.secondary">Smart Underwriting Platform</Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleDemoLogin}
                        disabled={loading}
                        sx={{ py: 1.5, fontSize: '1rem' }}
                    >
                        {loading ? 'Loading...' : 'Demo Login'}
                    </Button>

                    <Divider sx={{ my: 3 }}>OR</Divider>

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                        🔒 Your data is encrypted and secure
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
