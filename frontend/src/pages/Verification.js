import React, { useState, useEffect, useCallback } from 'react';
import {
    Grid, Typography, Box, TextField, Button, Alert,
    Card, CardContent, Chip, Stepper, Step, StepLabel,
    Avatar, Grow, MenuItem, CircularProgress, Divider,
    Paper, IconButton, Collapse, Tooltip
} from '@mui/material';
import {
    VerifiedUser, CreditCard, Phone, Person, CheckCircle,
    Send, Verified, AccountBalance, Work, Business,
    AttachMoney, Save, Pending, Email, AttachFile,
    ExpandMore, ExpandLess, CloudUpload, Delete, Description
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { verificationAPI, profileAPI } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

const steps = ['Enter Details', 'Verify OTP', 'Complete'];

const Verification = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [referenceId, setReferenceId] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState({
        offerLetter: null,
        paySlip: null,
        experienceLetter: null
    });
    
    const [aadhaarData, setAadhaarData] = useState({ number: '', phone: '' });
    const [aadhaarOTP, setAadhaarOTP] = useState('');
    const [panData, setPanData] = useState({ number: '', name: '', dob: '' });
    const [panVerified, setPanVerified] = useState(false);
    const [employmentData, setEmploymentData] = useState({
        companyName: '',
        companyAddress: '',
        companyWebsite: '',
        companyPhone: '',
        companyEmail: '',
        hrName: '',
        hrEmail: '',
        hrPhone: '',
        hrDesignation: '',
        jobTitle: '',
        jobDescription: '',
        department: '',
        reportingManager: '',
        salary: '',
        salaryStructure: '',
        employmentStartDate: '',
        employmentEndDate: '',
        previousEmployer: '',
        previousJobTitle: '',
        experienceYears: '',
        employmentStatus: 'employed',
        annualIncome: '',
        offerLetter: '',
        paySlip: '',
        experienceLetter: ''
    });

    // File Upload Handlers
    const onDropOffer = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setUploadedFiles(prev => ({ ...prev, offerLetter: file }));
            setEmploymentData(prev => ({ ...prev, offerLetter: file.name }));
            toast.success('Offer Letter uploaded: ' + file.name);
        }
    }, []);

    const onDropPaySlip = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setUploadedFiles(prev => ({ ...prev, paySlip: file }));
            setEmploymentData(prev => ({ ...prev, paySlip: file.name }));
            toast.success('Pay Slip uploaded: ' + file.name);
        }
    }, []);

    const onDropExperience = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setUploadedFiles(prev => ({ ...prev, experienceLetter: file }));
            setEmploymentData(prev => ({ ...prev, experienceLetter: file.name }));
            toast.success('Experience Letter uploaded: ' + file.name);
        }
    }, []);

    const { getRootProps: getOfferProps, getInputProps: getOfferInputProps } = useDropzone({
        onDrop: onDropOffer,
        accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png'] },
        maxSize: 5242880,
        maxFiles: 1
    });

    const { getRootProps: getPaySlipProps, getInputProps: getPaySlipInputProps } = useDropzone({
        onDrop: onDropPaySlip,
        accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png'] },
        maxSize: 5242880,
        maxFiles: 1
    });

    const { getRootProps: getExperienceProps, getInputProps: getExperienceInputProps } = useDropzone({
        onDrop: onDropExperience,
        accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png'] },
        maxSize: 5242880,
        maxFiles: 1
    });

    const removeFile = (type) => {
        setUploadedFiles(prev => ({ ...prev, [type]: null }));
        setEmploymentData(prev => ({ ...prev, [type]: '' }));
        toast.info('File removed');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login again');
            navigate('/login');
        }
    }, [navigate]);

    const getStatusChip = (isVerified, label) => {
        if (isVerified) {
            return <Chip icon={<CheckCircle />} label="Verified" color="success" size="small" />;
        }
        return <Chip icon={<Pending />} label="Pending" color="warning" size="small" />;
    };

    const handleAadhaarOTP = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        const cleanAadhaar = aadhaarData.number.replace(/[^0-9]/g, '');
        if (cleanAadhaar.length !== 12) {
            setError('Aadhaar must be exactly 12 digits');
            toast.error('Invalid Aadhaar number');
            setLoading(false);
            return;
        }

        const cleanPhone = aadhaarData.phone.replace(/[^0-9]/g, '');
        if (cleanPhone.length !== 10) {
            setError('Phone must be exactly 10 digits');
            toast.error('Invalid phone number');
            setLoading(false);
            return;
        }

        try {
            const response = await verificationAPI.generateAadhaarOTP(cleanAadhaar, cleanPhone);
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
            if (err.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                logout();
                navigate('/login');
            } else {
                setError('Failed to send OTP');
                toast.error('Failed to send OTP');
            }
        }
        setLoading(false);
    };

    const handleAadhaarVerify = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await verificationAPI.verifyAadhaarOTP(referenceId, aadhaarOTP);
            if (response.data.verified) {
                setActiveStep(2);
                setSuccess('Aadhaar verified successfully!');
                updateUser({
                    ...user,
                    verificationStatus: { ...user.verificationStatus, aadhaar: true }
                });
                toast.success('Aadhaar verified!');
            } else {
                setError('Invalid OTP');
                toast.error('Invalid OTP');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                logout();
                navigate('/login');
            } else {
                setError('Verification failed');
                toast.error('Verification failed');
            }
        }
        setLoading(false);
    };

    const handlePANVerify = async () => {
        setLoading(true);
        setError('');

        const cleanPan = panData.number.toUpperCase().replace(/[^0-9A-Z]/g, '');
        if (cleanPan.length !== 10) {
            setError('PAN must be exactly 10 characters');
            toast.error('Invalid PAN format');
            setLoading(false);
            return;
        }

        if (!panData.name) {
            setError('Please enter your name as per PAN');
            toast.error('Name required');
            setLoading(false);
            return;
        }

        try {
            const response = await verificationAPI.verifyPAN(cleanPan, panData.name, panData.dob);
            if (response.data.verified) {
                setPanVerified(true);
                setSuccess('PAN verified successfully!');
                updateUser({
                    ...user,
                    verificationStatus: { ...user.verificationStatus, pan: true },
                    profile: { ...user.profile, panNumber: cleanPan }
                });
                toast.success('PAN verified!');
            } else {
                setError(response.data.error || 'Invalid PAN details');
                toast.error(response.data.error || 'Invalid PAN details');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                logout();
                navigate('/login');
            } else {
                setError(err.response?.data?.error || 'Verification failed');
                toast.error(err.response?.data?.error || 'Verification failed');
            }
        }
        setLoading(false);
    };

    const handleEmploymentVerify = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        if (!employmentData.companyName) {
            setError('Please enter company name');
            toast.error('Company name required');
            setLoading(false);
            return;
        }

        if (!employmentData.jobTitle) {
            setError('Please enter job title');
            toast.error('Job title required');
            setLoading(false);
            return;
        }

        if (!employmentData.hrEmail) {
            setError('Please enter HR email for verification');
            toast.error('HR email required');
            setLoading(false);
            return;
        }

        if (!employmentData.salary) {
            setError('Please enter your monthly salary');
            toast.error('Salary required');
            setLoading(false);
            return;
        }

        try {
            const response = await profileAPI.updateEmployment(employmentData);
            
            if (response.data.success) {
                const updatedUser = {
                    ...user,
                    profile: {
                        ...user.profile,
                        ...response.data.profile
                    }
                };
                updateUser(updatedUser);
                setSuccess('Employment details saved successfully!');
                toast.success('Employment details saved!');
            } else {
                setError(response.data.error || 'Failed to save');
                toast.error(response.data.error || 'Failed to save');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                logout();
                navigate('/login');
            } else {
                const errorMsg = err.response?.data?.error || err.message || 'Failed to save';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        }
        setLoading(false);
    };

    return (
        <Box>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Identity & Employment Verification
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Complete your verification to access all features
                </Typography>
            </motion.div>

            <Grid container spacing={4}>
                {/* Aadhaar Verification */}
                <Grid item xs={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card sx={{ borderRadius: 4, boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Avatar sx={{ bgcolor: user?.verificationStatus?.aadhaar ? '#00c853' : '#ff6f00', width: 45, height: 45 }}>
                                        {user?.verificationStatus?.aadhaar ? <CheckCircle /> : <Pending />}
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                        Aadhaar Verification
                                    </Typography>
                                    {getStatusChip(user?.verificationStatus?.aadhaar, 'Aadhaar')}
                                </Box>

                                {user?.verificationStatus?.aadhaar ? (
                                    <Alert severity="success" icon={<CheckCircle />} sx={{ borderRadius: 2, fontSize: '0.875rem' }}>
                                        ✅ Aadhaar already verified
                                    </Alert>
                                ) : (
                                    <>
                                        <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
                                            {steps.map((label) => (
                                                <Step key={label}>
                                                    <StepLabel>{label}</StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>

                                        {error && <Alert severity="error" sx={{ mb: 2, fontSize: '0.875rem' }}>{error}</Alert>}
                                        {success && <Alert severity="success" sx={{ mb: 2, fontSize: '0.875rem' }}>{success}</Alert>}

                                        {activeStep === 0 && (
                                            <Box>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Aadhaar Number"
                                                    placeholder="123456789012"
                                                    value={aadhaarData.number}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        if (value.length <= 12) {
                                                            setAadhaarData({...aadhaarData, number: value});
                                                        }
                                                    }}
                                                    sx={{ mb: 1.5 }}
                                                    helperText="12 digits only"
                                                />
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Phone Number"
                                                    placeholder="9876543210"
                                                    value={aadhaarData.phone}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        if (value.length <= 10) {
                                                            setAadhaarData({...aadhaarData, phone: value});
                                                        }
                                                    }}
                                                    sx={{ mb: 1.5 }}
                                                    helperText="10 digits only"
                                                />
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    size="medium"
                                                    onClick={handleAadhaarOTP}
                                                    disabled={loading || aadhaarData.number.length !== 12 || aadhaarData.phone.length !== 10}
                                                    sx={{ py: 1, borderRadius: 2 }}
                                                    startIcon={<Send />}
                                                >
                                                    {loading ? <CircularProgress size={20} /> : 'Send OTP'}
                                                </Button>
                                            </Box>
                                        )}

                                        {activeStep === 1 && (
                                            <Box>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Enter OTP"
                                                    placeholder="123456"
                                                    value={aadhaarOTP}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        if (value.length <= 6) {
                                                            setAadhaarOTP(value);
                                                        }
                                                    }}
                                                    sx={{ mb: 1.5 }}
                                                    autoFocus
                                                    helperText="Demo OTP: 123456"
                                                />
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    size="medium"
                                                    onClick={handleAadhaarVerify}
                                                    disabled={loading || aadhaarOTP.length !== 6}
                                                    sx={{ py: 1, borderRadius: 2 }}
                                                >
                                                    {loading ? <CircularProgress size={20} /> : 'Verify OTP'}
                                                </Button>
                                                <Button
                                                    fullWidth
                                                    variant="text"
                                                    size="small"
                                                    sx={{ mt: 0.5 }}
                                                    onClick={handleAadhaarOTP}
                                                >
                                                    Resend OTP
                                                </Button>
                                            </Box>
                                        )}

                                        {activeStep === 2 && (
                                            <Grow in={true}>
                                                <Alert severity="success" sx={{ p: 1.5, borderRadius: 2 }}>
                                                    <Typography variant="subtitle1">✅ Aadhaar Verified Successfully</Typography>
                                                </Alert>
                                            </Grow>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                {/* PAN Verification */}
                <Grid item xs={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Card sx={{ borderRadius: 4, boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Avatar sx={{ bgcolor: user?.verificationStatus?.pan ? '#00c853' : '#ff6f00', width: 45, height: 45 }}>
                                        {user?.verificationStatus?.pan ? <CheckCircle /> : <Pending />}
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                        PAN Verification
                                    </Typography>
                                    {getStatusChip(user?.verificationStatus?.pan, 'PAN')}
                                </Box>

                                {user?.verificationStatus?.pan ? (
                                    <Alert severity="success" icon={<CheckCircle />} sx={{ borderRadius: 2, fontSize: '0.875rem' }}>
                                        ✅ PAN already verified
                                    </Alert>
                                ) : (
                                    <Box>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="PAN Number"
                                            placeholder="ABCDE1234F"
                                            value={panData.number}
                                            onChange={(e) => {
                                                const value = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '');
                                                if (value.length <= 10) {
                                                    setPanData({...panData, number: value});
                                                }
                                            }}
                                            sx={{ mb: 1.5 }}
                                            helperText="5 letters + 4 digits + 1 letter"
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Full Name (as per PAN)"
                                            value={panData.name}
                                            onChange={(e) => setPanData({...panData, name: e.target.value})}
                                            sx={{ mb: 1.5 }}
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Date of Birth"
                                            type="date"
                                            value={panData.dob}
                                            onChange={(e) => setPanData({...panData, dob: e.target.value})}
                                            sx={{ mb: 1.5 }}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="medium"
                                            onClick={handlePANVerify}
                                            disabled={loading || panData.number.length !== 10 || !panData.name}
                                            sx={{ py: 1, borderRadius: 2 }}
                                            startIcon={<Verified />}
                                        >
                                            {loading ? <CircularProgress size={20} /> : 'Verify PAN'}
                                        </Button>

                                        {panVerified && (
                                            <Grow in={true}>
                                                <Alert severity="success" sx={{ mt: 1.5, p: 1.5, borderRadius: 2 }}>
                                                    <Typography variant="subtitle1">✅ PAN Verified Successfully</Typography>
                                                </Alert>
                                            </Grow>
                                        )}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                {/* Employment Verification - Compact Form */}
                <Grid item xs={12}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <Card sx={{ borderRadius: 4, boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Avatar sx={{ bgcolor: user?.profile?.companyName ? '#00c853' : '#ff6f00', width: 45, height: 45 }}>
                                        {user?.profile?.companyName ? <CheckCircle /> : <Work />}
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                        Employment Verification
                                    </Typography>
                                    <Chip
                                        label={user?.profile?.companyName ? 'Verified' : 'Pending'}
                                        color={user?.profile?.companyName ? 'success' : 'warning'}
                                        size="small"
                                        sx={{ ml: 'auto' }}
                                    />
                                </Box>

                                <Typography variant="caption" sx={{ color: '#ff6f00', display: 'block', mb: 2 }}>
                                    ⚠️ Required fields: Company Name, Job Title, HR Email, Salary
                                </Typography>

                                <Grid container spacing={2}>
                                    {/* Company Details - 2 columns */}
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0d47a1', fontSize: '0.8rem', mb: 1 }}>
                                            🏢 Company Details
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Company Name *"
                                            placeholder="Enter company name"
                                            value={employmentData.companyName}
                                            onChange={(e) => setEmploymentData({...employmentData, companyName: e.target.value})}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Company Website"
                                            placeholder="www.company.com"
                                            value={employmentData.companyWebsite}
                                            onChange={(e) => setEmploymentData({...employmentData, companyWebsite: e.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Company Address"
                                            placeholder="Enter full company address"
                                            value={employmentData.companyAddress}
                                            onChange={(e) => setEmploymentData({...employmentData, companyAddress: e.target.value})}
                                            multiline
                                            rows={2}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Company Phone"
                                            placeholder="0123456789"
                                            value={employmentData.companyPhone}
                                            onChange={(e) => setEmploymentData({...employmentData, companyPhone: e.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Company Email"
                                            placeholder="info@company.com"
                                            value={employmentData.companyEmail}
                                            onChange={(e) => setEmploymentData({...employmentData, companyEmail: e.target.value})}
                                        />
                                    </Grid>

                                    {/* HR Contact Details */}
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0d47a1', fontSize: '0.8rem', mb: 1 }}>
                                            👤 HR Contact Details
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="HR/Manager Name *"
                                            placeholder="Enter HR name"
                                            value={employmentData.hrName}
                                            onChange={(e) => setEmploymentData({...employmentData, hrName: e.target.value})}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="HR Designation"
                                            placeholder="HR Manager"
                                            value={employmentData.hrDesignation}
                                            onChange={(e) => setEmploymentData({...employmentData, hrDesignation: e.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="HR Email *"
                                            placeholder="hr@company.com"
                                            value={employmentData.hrEmail}
                                            onChange={(e) => setEmploymentData({...employmentData, hrEmail: e.target.value})}
                                            required
                                            helperText="We'll send verification email here"
                                            InputProps={{
                                                startAdornment: <Email sx={{ mr: 1, color: 'gray', fontSize: '1rem' }} />
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="HR Phone"
                                            placeholder="9876543210"
                                            value={employmentData.hrPhone}
                                            onChange={(e) => setEmploymentData({...employmentData, hrPhone: e.target.value})}
                                        />
                                    </Grid>

                                    {/* Job Details */}
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0d47a1', fontSize: '0.8rem', mb: 1 }}>
                                            💼 Job Details
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Job Title *"
                                            placeholder="Enter job title"
                                            value={employmentData.jobTitle}
                                            onChange={(e) => setEmploymentData({...employmentData, jobTitle: e.target.value})}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Department"
                                            placeholder="Engineering / Sales"
                                            value={employmentData.department}
                                            onChange={(e) => setEmploymentData({...employmentData, department: e.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Job Description"
                                            placeholder="Brief description of your role"
                                            value={employmentData.jobDescription}
                                            onChange={(e) => setEmploymentData({...employmentData, jobDescription: e.target.value})}
                                            multiline
                                            rows={2}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Reporting Manager"
                                            placeholder="Manager name"
                                            value={employmentData.reportingManager}
                                            onChange={(e) => setEmploymentData({...employmentData, reportingManager: e.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Monthly Salary (₹) *"
                                            placeholder="Enter salary"
                                            type="number"
                                            value={employmentData.salary}
                                            onChange={(e) => setEmploymentData({...employmentData, salary: e.target.value})}
                                            required
                                            InputProps={{
                                                startAdornment: <AttachMoney sx={{ mr: 1, color: 'gray', fontSize: '1rem' }} />
                                            }}
                                        />
                                    </Grid>

                                    {/* Advanced Options - Collapsible */}
                                    <Grid item xs={12}>
                                        <Button
                                            size="small"
                                            onClick={() => setShowAdvanced(!showAdvanced)}
                                            sx={{ textTransform: 'none', color: '#0d47a1' }}
                                        >
                                            {showAdvanced ? <ExpandLess /> : <ExpandMore />}
                                            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                                        </Button>
                                    </Grid>

                                    <Collapse in={showAdvanced} timeout="auto" unmountOnExit>
                                        <Grid container spacing={2} sx={{ mt: 1 }}>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0d47a1', fontSize: '0.8rem', mb: 1 }}>
                                                    📅 Employment History
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Start Date"
                                                    type="date"
                                                    value={employmentData.employmentStartDate}
                                                    onChange={(e) => setEmploymentData({...employmentData, employmentStartDate: e.target.value})}
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="End Date (if applicable)"
                                                    type="date"
                                                    value={employmentData.employmentEndDate}
                                                    onChange={(e) => setEmploymentData({...employmentData, employmentEndDate: e.target.value})}
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Previous Employer"
                                                    placeholder="Previous company"
                                                    value={employmentData.previousEmployer}
                                                    onChange={(e) => setEmploymentData({...employmentData, previousEmployer: e.target.value})}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Previous Job Title"
                                                    placeholder="Your previous role"
                                                    value={employmentData.previousJobTitle}
                                                    onChange={(e) => setEmploymentData({...employmentData, previousJobTitle: e.target.value})}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Experience (Years)"
                                                    type="number"
                                                    value={employmentData.experienceYears}
                                                    onChange={(e) => setEmploymentData({...employmentData, experienceYears: e.target.value})}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    select
                                                    label="Employment Status"
                                                    value={employmentData.employmentStatus}
                                                    onChange={(e) => setEmploymentData({...employmentData, employmentStatus: e.target.value})}
                                                >
                                                    <MenuItem value="employed">Employed</MenuItem>
                                                    <MenuItem value="self-employed">Self-Employed</MenuItem>
                                                    <MenuItem value="business">Business Owner</MenuItem>
                                                    <MenuItem value="freelancer">Freelancer</MenuItem>
                                                    <MenuItem value="student">Student</MenuItem>
                                                    <MenuItem value="unemployed">Unemployed</MenuItem>
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Annual Income (₹)"
                                                    placeholder="Enter annual income"
                                                    type="number"
                                                    value={employmentData.annualIncome}
                                                    onChange={(e) => setEmploymentData({...employmentData, annualIncome: e.target.value})}
                                                    InputProps={{
                                                        startAdornment: <AttachMoney sx={{ mr: 1, color: 'gray', fontSize: '1rem' }} />
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Salary Structure"
                                                    placeholder="Basic + HRA + Allowances"
                                                    value={employmentData.salaryStructure}
                                                    onChange={(e) => setEmploymentData({...employmentData, salaryStructure: e.target.value})}
                                                />
                                            </Grid>

                                            {/* File Upload Section */}
                                            <Grid item xs={12}>
                                                <Divider sx={{ my: 1 }} />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0d47a1', fontSize: '0.8rem', mb: 1 }}>
                                                    📄 Upload Documents (Optional)
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Max 5MB each. Supported: PDF, JPG, PNG
                                                </Typography>
                                            </Grid>

                                            {/* Offer Letter Upload */}
                                            <Grid item xs={12} md={4}>
                                                <Paper
                                                    {...getOfferProps()}
                                                    sx={{
                                                        p: 1.5,
                                                        border: '2px dashed #ccc',
                                                        borderRadius: 2,
                                                        cursor: 'pointer',
                                                        textAlign: 'center',
                                                        '&:hover': { borderColor: '#0d47a1', bgcolor: '#f5f5f5' },
                                                        minHeight: '80px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <input {...getOfferInputProps()} />
                                                    {uploadedFiles.offerLetter ? (
                                                        <Box>
                                                            <Description color="primary" />
                                                            <Typography variant="caption" display="block" noWrap>
                                                                {uploadedFiles.offerLetter.name}
                                                            </Typography>
                                                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); removeFile('offerLetter'); }}>
                                                                <Delete fontSize="small" color="error" />
                                                            </IconButton>
                                                        </Box>
                                                    ) : (
                                                        <>
                                                            <CloudUpload sx={{ color: '#999', fontSize: 24 }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                Offer Letter
                                                            </Typography>
                                                        </>
                                                    )}
                                                </Paper>
                                            </Grid>

                                            {/* Pay Slip Upload */}
                                            <Grid item xs={12} md={4}>
                                                <Paper
                                                    {...getPaySlipProps()}
                                                    sx={{
                                                        p: 1.5,
                                                        border: '2px dashed #ccc',
                                                        borderRadius: 2,
                                                        cursor: 'pointer',
                                                        textAlign: 'center',
                                                        '&:hover': { borderColor: '#0d47a1', bgcolor: '#f5f5f5' },
                                                        minHeight: '80px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <input {...getPaySlipInputProps()} />
                                                    {uploadedFiles.paySlip ? (
                                                        <Box>
                                                            <Description color="primary" />
                                                            <Typography variant="caption" display="block" noWrap>
                                                                {uploadedFiles.paySlip.name}
                                                            </Typography>
                                                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); removeFile('paySlip'); }}>
                                                                <Delete fontSize="small" color="error" />
                                                            </IconButton>
                                                        </Box>
                                                    ) : (
                                                        <>
                                                            <CloudUpload sx={{ color: '#999', fontSize: 24 }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                Pay Slip
                                                            </Typography>
                                                        </>
                                                    )}
                                                </Paper>
                                            </Grid>

                                            {/* Experience Letter Upload */}
                                            <Grid item xs={12} md={4}>
                                                <Paper
                                                    {...getExperienceProps()}
                                                    sx={{
                                                        p: 1.5,
                                                        border: '2px dashed #ccc',
                                                        borderRadius: 2,
                                                        cursor: 'pointer',
                                                        textAlign: 'center',
                                                        '&:hover': { borderColor: '#0d47a1', bgcolor: '#f5f5f5' },
                                                        minHeight: '80px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <input {...getExperienceInputProps()} />
                                                    {uploadedFiles.experienceLetter ? (
                                                        <Box>
                                                            <Description color="primary" />
                                                            <Typography variant="caption" display="block" noWrap>
                                                                {uploadedFiles.experienceLetter.name}
                                                            </Typography>
                                                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); removeFile('experienceLetter'); }}>
                                                                <Delete fontSize="small" color="error" />
                                                            </IconButton>
                                                        </Box>
                                                    ) : (
                                                        <>
                                                            <CloudUpload sx={{ color: '#999', fontSize: 24 }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                Experience Letter
                                                            </Typography>
                                                        </>
                                                    )}
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Collapse>
                                </Grid>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="medium"
                                    onClick={handleEmploymentVerify}
                                    disabled={loading || !employmentData.companyName || !employmentData.jobTitle || !employmentData.hrEmail}
                                    sx={{ mt: 2, py: 1.5, borderRadius: 2 }}
                                    startIcon={<Save />}
                                >
                                    {loading ? <CircularProgress size={20} /> : 'Save Employment Details'}
                                </Button>

                                {success && (
                                    <Grow in={true}>
                                        <Alert severity="success" sx={{ mt: 1.5, p: 1.5, borderRadius: 2 }}>
                                            <Typography variant="subtitle2">✅ Employment Details Saved Successfully</Typography>
                                            <Typography variant="caption">Your details will be verified by our team.</Typography>
                                        </Alert>
                                    </Grow>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Verification;
