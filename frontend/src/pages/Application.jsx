import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, TextField, Button, Alert, Card, CardContent, MenuItem } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { applicationAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Application = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [formData, setFormData] = useState({
        loanAmount: 200000,
        loanPurpose: 'Personal',
        tenure: 36
    });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await applicationAPI.submit(formData);
            if (response.data.success) {
                setResult(response.data.application);
                toast.success('Application submitted!');
            }
        } catch (err) {
            toast.error('Submission failed');
        }
        setLoading(false);
    };

    const isEligible = user?.verificationStatus?.aadhaar && user?.verificationStatus?.pan;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Loan Application</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Apply for a loan with confidence</Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            {!isEligible && (
                                <Alert severity="warning" sx={{ mb: 3 }}>
                                    Please complete Aadhaar and PAN verification before applying.
                                    <Button size="small" onClick={() => navigate('/verification')} sx={{ ml: 2 }}>Verify Now</Button>
                                </Alert>
                            )}

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Loan Amount (₹)" type="number" value={formData.loanAmount} onChange={(e) => setFormData({...formData, loanAmount: parseInt(e.target.value)})} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Purpose" select value={formData.loanPurpose} onChange={(e) => setFormData({...formData, loanPurpose: e.target.value})}>
                                        {['Personal', 'Home', 'Car', 'Education', 'Business'].map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Tenure (months)" type="number" value={formData.tenure} onChange={(e) => setFormData({...formData, tenure: parseInt(e.target.value)})} />
                                </Grid>
                            </Grid>

                            <Button fullWidth variant="contained" size="large" onClick={handleSubmit} disabled={loading || !isEligible} sx={{ mt: 3, py: 1.5 }}>
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Application Summary</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">Loan Amount</Typography>
                                <Typography variant="h6">₹{formData.loanAmount?.toLocaleString()}</Typography>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">Purpose</Typography>
                                <Typography variant="body1">{formData.loanPurpose}</Typography>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">Tenure</Typography>
                                <Typography variant="body1">{formData.tenure} months</Typography>
                            </Box>
                            {result && (
                                <Alert severity={result.decision === 'APPROVE' ? 'success' : 'warning'} sx={{ mt: 2 }}>
                                    Decision: {result.decision}
                                    <Typography variant="caption" display="block">{result.explanation}</Typography>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Application;
