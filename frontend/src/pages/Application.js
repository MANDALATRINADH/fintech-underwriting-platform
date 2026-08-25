import React, { useState, useEffect } from 'react';
import {
    Grid, Paper, Typography, Box, TextField, Button, Alert,
    Card, CardContent, MenuItem, Chip, CircularProgress,
    Divider, List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import {
    AttachMoney, Work, Business, Pending, CheckCircle,
    Cancel, Send, History, HourglassEmpty
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { applicationAPI } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Application = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    const [formData, setFormData] = useState({
        loanAmount: 200000,
        loanPurpose: 'Personal',
        tenure: 36,
        employmentType: 'salaried',
        annualIncome: 500000,
        existingEmi: 0
    });

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const response = await applicationAPI.getHistory();
            if (response.data.success) {
                setHistory(response.data.applications);
            }
        } catch (err) {
            console.error('Failed to load history:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setResult(null);

        if (!formData.loanAmount || formData.loanAmount <= 0) {
            setError('Please enter a valid loan amount');
            toast.error('Invalid loan amount');
            setLoading(false);
            return;
        }

        if (!formData.annualIncome || formData.annualIncome <= 0) {
            setError('Please enter your annual income');
            toast.error('Invalid income');
            setLoading(false);
            return;
        }

        try {
            const response = await applicationAPI.submit({
                loanAmount: parseInt(formData.loanAmount),
                loanPurpose: formData.loanPurpose,
                tenure: parseInt(formData.tenure),
                employmentType: formData.employmentType,
                annualIncome: parseInt(formData.annualIncome),
                existingEmi: parseInt(formData.existingEmi) || 0
            });

            if (response.data.success) {
                setResult(response.data.application);
                toast.success('Application submitted for admin review!');
                loadHistory();
                setFormData({
                    loanAmount: 200000,
                    loanPurpose: 'Personal',
                    tenure: 36,
                    employmentType: 'salaried',
                    annualIncome: 500000,
                    existingEmi: 0
                });
            } else {
                setError(response.data.error || 'Submission failed');
                toast.error(response.data.error || 'Submission failed');
            }
        } catch (err) {
            console.error('Submit error:', err);
            const errorMsg = err.response?.data?.error || 'Failed to submit application';
            setError(errorMsg);
            toast.error(errorMsg);
        }
        setLoading(false);
    };

    const getStatusDisplay = (status) => {
        switch(status) {
            case 'APPROVED':
                return <Chip icon={<CheckCircle />} label="Approved" color="success" />;
            case 'REJECTED':
                return <Chip icon={<Cancel />} label="Rejected" color="error" />;
            case 'REVIEW':
                return <Chip icon={<HourglassEmpty />} label="Needs Info" color="warning" />;
            default:
                return <Chip icon={<Pending />} label="Pending Review" color="default" />;
        }
    };

    const isEligible = user?.verificationStatus?.aadhaar && user?.verificationStatus?.pan;

    return (
        <Box>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Loan Application
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Apply for a loan and our admin team will review your application
                </Typography>
            </motion.div>

            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Card sx={{ borderRadius: 4, boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                        <CardContent sx={{ p: 4 }}>
                            {!isEligible && (
                                <Alert severity="warning" sx={{ mb: 3 }}>
                                    Please complete Aadhaar and PAN verification before applying.
                                </Alert>
                            )}

                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}

                            {result && result.decision === 'PENDING' && (
                                <Alert severity="info" icon={<Pending />} sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1">Application Submitted!</Typography>
                                    <Typography variant="body2">
                                        Your application has been sent to the admin team for review.
                                        You will be notified once a decision is made.
                                    </Typography>
                                </Alert>
                            )}

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Loan Amount (?)"
                                        name="loanAmount"
                                        type="number"
                                        value={formData.loanAmount}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: <AttachMoney sx={{ mr: 1, color: 'gray' }} />
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Loan Purpose"
                                        name="loanPurpose"
                                        value={formData.loanPurpose}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="Personal">Personal</MenuItem>
                                        <MenuItem value="Home">Home</MenuItem>
                                        <MenuItem value="Car">Car</MenuItem>
                                        <MenuItem value="Education">Education</MenuItem>
                                        <MenuItem value="Business">Business</MenuItem>
                                        <MenuItem value="Medical">Medical</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Tenure (months)"
                                        name="tenure"
                                        type="number"
                                        value={formData.tenure}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Employment Type"
                                        name="employmentType"
                                        value={formData.employmentType}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="salaried">Salaried</MenuItem>
                                        <MenuItem value="self-employed">Self-Employed</MenuItem>
                                        <MenuItem value="business">Business Owner</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Annual Income (?)"
                                        name="annualIncome"
                                        type="number"
                                        value={formData.annualIncome}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: <AttachMoney sx={{ mr: 1, color: 'gray' }} />
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Existing EMI (?)"
                                        name="existingEmi"
                                        type="number"
                                        value={formData.existingEmi}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: <AttachMoney sx={{ mr: 1, color: 'gray' }} />
                                        }}
                                        helperText="Monthly EMI payments you already have"
                                    />
                                </Grid>
                            </Grid>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleSubmit}
                                disabled={loading || !isEligible}
                                sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
                                startIcon={loading ? <CircularProgress size={24} /> : <Send />}
                            >
                                {loading ? 'Submitting...' : 'Submit for Admin Review'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Card sx={{ borderRadius: 4, boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Application History
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            {history.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                                    No applications yet
                                </Typography>
                            ) : (
                                <List>
                                    {history.map((app) => (
                                        <ListItem key={app.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: '1px solid #eee' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                <Typography variant="subtitle2">
                                                    ?{app.loanAmount?.toLocaleString()}
                                                </Typography>
                                                {getStatusDisplay(app.decision)}
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {app.loanPurpose} ? {new Date(app.createdAt).toLocaleDateString()}
                                            </Typography>
                                            {app.decision === 'PENDING' && (
                                                <Typography variant="caption" color="warning.main">
                                                    ? Awaiting admin review
                                                </Typography>
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Application;
