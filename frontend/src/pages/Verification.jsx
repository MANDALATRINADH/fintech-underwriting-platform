import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, TextField, Button, Alert, Card, CardContent, Chip, Stepper, Step, StepLabel } from '@mui/material';
import { VerifiedUser, CreditCard, Phone, Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { verificationAPI } from '../services/api';
import toast from 'react-hot-toast';

const steps = ['Enter Details', 'Verify OTP', 'Complete'];

const Verification = () => {
    const { user, updateUser } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [referenceId, setReferenceId] = useState('');
    const [aadhaarData, setAadhaarData] = useState({ number: '', phone: '' });
    const [aadhaarOTP, setAadhaarOTP] = useState('');
    const [panData, setPanData] = useState({ number: '', name: '' });

    const handleAadhaarOTP = async () => {
        setLoading(true); setError(''); setSuccess('');
        try {
            const response = await verificationAPI.generateAadhaarOTP(aadhaarData.number, aadhaarData.phone);
            if (response.data.success) {
                setReferenceId(response.data.referenceId);
                setActiveStep(1);
                setSuccess('OTP sent successfully!');
                toast.success('OTP sent to your phone');
            } else {
                setError(response.data.error);
                toast.error(response.data.error);
            }
        } catch (err) {
            setError('Failed to send OTP');
            toast.error('Failed to send OTP');
        }
        setLoading(false);
    };

    const handleAadhaarVerify = async () => {
        setLoading(true); setError('');
        try {
            const response = await verificationAPI.verifyAadhaarOTP(referenceId, aadhaarOTP);
            if (response.data.verified) {
                setActiveStep(2);
                setSuccess('Aadhaar verified successfully!');
                updateUser({ ...user, verificationStatus: { ...user.verificationStatus, aadhaar: true } });
                toast.success('Aadhaar verified!');
            } else {
                setError('Invalid OTP');
                toast.error('Invalid OTP');
            }
        } catch (err) {
            setError('Verification failed');
            toast.error('Verification failed');
        }
        setLoading(false);
    };

    const handlePANVerify = async () => {
        setLoading(true); setError('');
        try {
            const response = await verificationAPI.verifyPAN(panData.number, panData.name);
            if (response.data.verified) {
                setSuccess('PAN verified successfully!');
                updateUser({ ...user, verificationStatus: { ...user.verificationStatus, pan: true } });
                toast.success('PAN verified!');
            } else {
                setError('Invalid PAN details');
                toast.error('Invalid PAN details');
            }
        } catch (err) {
            setError('Verification failed');
            toast.error('Verification failed');
        }
        setLoading(false);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Identity Verification</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Verify your identity to access all features</Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <VerifiedUser color="primary" sx={{ fontSize: 30 }} />
                                <Typography variant="h6">Aadhaar Verification</Typography>
                                <Chip label={user?.verificationStatus?.aadhaar ? 'Verified ✅' : 'Pending'} color={user?.verificationStatus?.aadhaar ? 'success' : 'warning'} size="small" sx={{ ml: 'auto' }} />
                            </Box>

                            {user?.verificationStatus?.aadhaar ? (
                                <Alert severity="success">✅ Aadhaar already verified</Alert>
                            ) : (
                                <>
                                    <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                                        {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                                    </Stepper>

                                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                                    {activeStep === 0 && (
                                        <Box>
                                            <TextField fullWidth label="Aadhaar Number" placeholder="XXXX-XXXX-XXXX" value={aadhaarData.number} onChange={(e) => setAadhaarData({...aadhaarData, number: e.target.value})} sx={{ mb: 2 }} />
                                            <TextField fullWidth label="Phone Number" placeholder="XXXXXXXXXX" value={aadhaarData.phone} onChange={(e) => setAadhaarData({...aadhaarData, phone: e.target.value})} InputProps={{ startAdornment: <Phone /> }} sx={{ mb: 2 }} />
                                            <Button fullWidth variant="contained" onClick={handleAadhaarOTP} disabled={loading || !aadhaarData.number || !aadhaarData.phone}>Send OTP</Button>
                                        </Box>
                                    )}

                                    {activeStep === 1 && (
                                        <Box>
                                            <TextField fullWidth label="Enter OTP" placeholder="123456" value={aadhaarOTP} onChange={(e) => setAadhaarOTP(e.target.value)} sx={{ mb: 2 }} autoFocus />
                                            <Button fullWidth variant="contained" onClick={handleAadhaarVerify} disabled={loading || aadhaarOTP.length !== 6}>Verify OTP</Button>
                                            <Button fullWidth variant="text" sx={{ mt: 1 }} onClick={handleAadhaarOTP}>Resend OTP</Button>
                                        </Box>
                                    )}

                                    {activeStep === 2 && <Alert severity="success">✅ Aadhaar verified successfully!</Alert>}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <CreditCard color="primary" sx={{ fontSize: 30 }} />
                                <Typography variant="h6">PAN Verification</Typography>
                                <Chip label={user?.verificationStatus?.pan ? 'Verified ✅' : 'Pending'} color={user?.verificationStatus?.pan ? 'success' : 'warning'} size="small" sx={{ ml: 'auto' }} />
                            </Box>

                            {user?.verificationStatus?.pan ? (
                                <Alert severity="success">✅ PAN already verified</Alert>
                            ) : (
                                <Box>
                                    <TextField fullWidth label="PAN Number" placeholder="ABCDE1234F" value={panData.number} onChange={(e) => setPanData({...panData, number: e.target.value.toUpperCase()})} sx={{ mb: 2 }} />
                                    <TextField fullWidth label="Full Name (as per PAN)" value={panData.name} onChange={(e) => setPanData({...panData, name: e.target.value})} InputProps={{ startAdornment: <Person /> }} sx={{ mb: 2 }} />
                                    <Button fullWidth variant="contained" onClick={handlePANVerify} disabled={loading || panData.number.length !== 10 || !panData.name}>Verify PAN</Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Verification;
