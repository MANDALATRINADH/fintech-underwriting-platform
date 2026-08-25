import React from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Button, Avatar } from '@mui/material';
import { VerifiedUser, CreditCard, TrendingUp, Shield, ArrowForward } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const stats = [
        { title: 'Aadhaar', value: user?.verificationStatus?.aadhaar ? 'Verified' : 'Pending', icon: <VerifiedUser />, color: user?.verificationStatus?.aadhaar ? '#2e7d32' : '#ed6c02' },
        { title: 'PAN', value: user?.verificationStatus?.pan ? 'Verified' : 'Pending', icon: <CreditCard />, color: user?.verificationStatus?.pan ? '#2e7d32' : '#ed6c02' },
        { title: 'Credit Score', value: '720', icon: <TrendingUp />, color: '#1976d2' },
        { title: 'Fraud Score', value: '15%', icon: <Shield />, color: '#2e7d32' },
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Welcome back, {user?.name || 'User'}! 👋</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Here's your financial health overview</Typography>

            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{stat.title}</Typography>
                                        <Typography variant="h6">{stat.value}</Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: stat.color + '20', color: stat.color }}>{stat.icon}</Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Button variant="outlined" startIcon={<VerifiedUser />} onClick={() => navigate('/verification')}>Verify Aadhaar</Button>
                            <Button variant="outlined" startIcon={<CreditCard />} onClick={() => navigate('/verification')}>Verify PAN</Button>
                            <Button variant="contained" startIcon={<ArrowForward />} onClick={() => navigate('/application')}>Apply for Loan</Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
