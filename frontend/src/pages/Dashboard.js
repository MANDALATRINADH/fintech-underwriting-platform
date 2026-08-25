import React, { useState, useEffect } from 'react';
import {
    Grid, Paper, Typography, Box, Card, CardContent, Button, Avatar,
    LinearProgress, Chip, IconButton, Divider, useTheme
} from '@mui/material';
import {
    VerifiedUser, CreditCard, TrendingUp, Shield, ArrowForward,
    AccountBalance, Payment, Timeline, Assessment, Analytics,
    Notifications, Settings, Person, History, Download
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    const stats = [
        { 
            title: 'Credit Score', 
            value: user?.profile?.creditScore || 720, 
            icon: <TrendingUp />, 
            color: '#1976d2',
            change: '+12',
            changeType: 'positive'
        },
        { 
            title: 'Aadhaar Status', 
            value: user?.verificationStatus?.aadhaar ? 'Verified' : 'Pending', 
            icon: <VerifiedUser />, 
            color: user?.verificationStatus?.aadhaar ? '#2e7d32' : '#ed6c02',
            change: user?.verificationStatus?.aadhaar ? '✅' : '⏳',
            changeType: user?.verificationStatus?.aadhaar ? 'positive' : 'warning'
        },
        { 
            title: 'PAN Status', 
            value: user?.verificationStatus?.pan ? 'Verified' : 'Pending', 
            icon: <CreditCard />, 
            color: user?.verificationStatus?.pan ? '#2e7d32' : '#ed6c02',
            change: user?.verificationStatus?.pan ? '✅' : '⏳',
            changeType: user?.verificationStatus?.pan ? 'positive' : 'warning'
        },
        { 
            title: 'Fraud Score', 
            value: '15%', 
            icon: <Shield />, 
            color: '#2e7d32',
            change: '-5%',
            changeType: 'positive'
        }
    ];

    const riskData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
            {
                label: 'Risk Score',
                data: [65, 59, 80, 81, 56, 55, 40, 35],
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Fraud Score',
                data: [28, 48, 40, 19, 86, 27, 90, 35],
                borderColor: '#dc004e',
                backgroundColor: 'rgba(220, 0, 78, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ]
    };

    const approvalData = {
        labels: ['Approved', 'Reviewed', 'Declined'],
        datasets: [
            {
                data: [65, 25, 10],
                backgroundColor: ['#2e7d32', '#ed6c02', '#d32f2f'],
                borderWidth: 0,
            }
        ]
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            Welcome back, {user?.name || 'User'}! 👋
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Here's your financial health overview
                        </Typography>
                    </motion.div>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton>
                        <Notifications />
                    </IconButton>
                    <IconButton onClick={() => navigate('/profile')}>
                        <Settings />
                    </IconButton>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 40px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {stat.title}
                                            </Typography>
                                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                                {stat.value}
                                            </Typography>
                                            <Chip
                                                label={stat.change}
                                                size="small"
                                                color={stat.changeType === 'positive' ? 'success' : 'warning'}
                                                sx={{ mt: 0.5 }}
                                            />
                                        </Box>
                                        <Avatar sx={{ bgcolor: stat.color + '20', color: stat.color, width: 48, height: 48 }}>
                                            {stat.icon}
                                        </Avatar>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}

                <Grid item xs={12} md={8}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Risk & Fraud Trend Analysis
                                </Typography>
                                <Chip label="Last 8 months" size="small" />
                            </Box>
                            <Box sx={{ height: 300 }}>
                                <Line
                                    data={riskData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'top' }
                                        },
                                        scales: {
                                            y: { beginAtZero: true }
                                        }
                                    }}
                                />
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                <Grid item xs={12} md={4}>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Application Status
                            </Typography>
                            <Box sx={{ height: 200, display: 'flex', justifyContent: 'center' }}>
                                <Doughnut
                                    data={approvalData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'bottom' }
                                        }
                                    }}
                                />
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                <Grid item xs={12}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Quick Actions
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<VerifiedUser />}
                                    onClick={() => navigate('/verification')}
                                    sx={{ borderRadius: 2, px: 3, py: 1.5 }}
                                >
                                    Verify Aadhaar
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<CreditCard />}
                                    onClick={() => navigate('/verification')}
                                    sx={{ borderRadius: 2, px: 3, py: 1.5 }}
                                >
                                    Verify PAN
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<ArrowForward />}
                                    onClick={() => navigate('/application')}
                                    sx={{ borderRadius: 2, px: 3, py: 1.5 }}
                                >
                                    Apply for Loan
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<History />}
                                    sx={{ borderRadius: 2, px: 3, py: 1.5 }}
                                >
                                    View History
                                </Button>
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
