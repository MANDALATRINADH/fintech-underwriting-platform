import React, { useState, useEffect } from 'react';
import {
    Grid, Paper, Typography, Box, Card, CardContent, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Alert, Avatar, Divider,
    CircularProgress, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails,
    List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import {
    Assignment, CheckCircle, Cancel, Refresh, Visibility,
    Pending, HourglassEmpty, ExitToApp, ExpandMore,
    Business, Person, Email, Phone, LocationOn, Work,
    AttachMoney, CalendarToday, Description, VerifiedUser,
    CreditCard, AccountBalance, FileCopy
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const Admin = () => {
    const { user, logout } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [reviewData, setReviewData] = useState({
        decision: 'APPROVED',
        decisionReason: ''
    });
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await adminAPI.getApplications();
            if (response.data && response.data.success) {
                setApplications(response.data.applications || []);
                const count = response.data.applications?.length || 0;
                toast.success('Loaded ' + count + ' applications');
            } else {
                toast.error('Failed to load applications');
            }
        } catch (error) {
            setError('Failed to load applications');
            toast.error('Failed to load applications');
        }
        setLoading(false);
    };

    const handleReview = (application) => {
        console.log('📋 Reviewing application:', application);
        setSelectedApp(application);
        setReviewData({
            decision: 'APPROVED',
            decisionReason: ''
        });
        setDialogOpen(true);
    };

    const handleSubmitReview = async () => {
        if (!selectedApp) {
            toast.error('No application selected');
            return;
        }

        const appId = selectedApp._id || selectedApp.id;
        if (!appId) {
            toast.error('Invalid application ID');
            return;
        }

        setLoading(true);
        try {
            const response = await adminAPI.reviewApplication(
                appId,
                {
                    decision: reviewData.decision,
                    decisionReason: reviewData.decisionReason
                }
            );

            if (response.data && response.data.success) {
                toast.success('Application ' + reviewData.decision + ' successfully!');
                setDialogOpen(false);
                loadApplications();
            } else {
                toast.error(response.data?.error || 'Failed to review application');
            }
        } catch (error) {
            toast.error('Failed to review application');
        }
        setLoading(false);
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    const getStatusChip = (status) => {
        switch(status) {
            case 'APPROVED':
                return <Chip icon={<CheckCircle />} label="Approved" color="success" size="small" />;
            case 'REJECTED':
                return <Chip icon={<Cancel />} label="Rejected" color="error" size="small" />;
            case 'REVIEW':
                return <Chip icon={<HourglassEmpty />} label="Needs Info" color="warning" size="small" />;
            default:
                return <Chip icon={<Pending />} label="Pending" color="default" size="small" />;
        }
    };

    const pendingCount = applications.filter(a => a.decision === 'PENDING').length;
    const approvedCount = applications.filter(a => a.decision === 'APPROVED').length;
    const rejectedCount = applications.filter(a => a.decision === 'REJECTED').length;

    const filteredApplications = tabValue === 0 
        ? applications 
        : tabValue === 1 
        ? applications.filter(a => a.decision === 'PENDING')
        : applications.filter(a => a.decision !== 'PENDING');

    const stats = [
        { title: 'Total Applications', value: applications.length, icon: <Assignment />, color: '#0d47a1' },
        { title: 'Pending Review', value: pendingCount, icon: <Pending />, color: '#ff6f00' },
        { title: 'Approved', value: approvedCount, icon: <CheckCircle />, color: '#00c853' },
        { title: 'Rejected', value: rejectedCount, icon: <Cancel />, color: '#d50000' },
    ];

    // Helper to get customer profile data
    const getCustomerProfile = (app) => {
        const profile = app.userId?.profile || {};
        return profile;
    };

    // Helper to render customer details in review dialog
    const renderCustomerDetails = (app) => {
        const profile = getCustomerProfile(app);
        const user = app.userId || {};

        return (
            <Box sx={{ mt: 2 }}>
                {/* Personal Information */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0d47a1', mb: 1 }}>
                    👤 Personal Information
                </Typography>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Name</Typography>
                        <Typography variant="body2">{user.name || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Email</Typography>
                        <Typography variant="body2">{user.email || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Phone</Typography>
                        <Typography variant="body2">{user.phone || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                        <Typography variant="body2">{profile.dateOfBirth || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Address</Typography>
                        <Typography variant="body2">{profile.address || 'N/A'}</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Employment Details */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0d47a1', mb: 1 }}>
                    💼 Employment Details
                </Typography>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Company Name</Typography>
                        <Typography variant="body2">{profile.companyName || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Job Title</Typography>
                        <Typography variant="body2">{profile.jobTitle || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Department</Typography>
                        <Typography variant="body2">{profile.department || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Experience</Typography>
                        <Typography variant="body2">{profile.experienceYears || '0'} years</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Monthly Salary</Typography>
                        <Typography variant="body2">₹{profile.salary || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Employment Status</Typography>
                        <Typography variant="body2">{profile.employmentStatus || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Company Address</Typography>
                        <Typography variant="body2">{profile.companyAddress || 'N/A'}</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* HR Contact Details */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0d47a1', mb: 1 }}>
                    👤 HR Contact Details
                </Typography>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">HR Name</Typography>
                        <Typography variant="body2">{profile.hrName || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">HR Designation</Typography>
                        <Typography variant="body2">{profile.hrDesignation || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">HR Email</Typography>
                        <Typography variant="body2">{profile.hrEmail || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">HR Phone</Typography>
                        <Typography variant="body2">{profile.hrPhone || 'N/A'}</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Verification Status */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0d47a1', mb: 1 }}>
                    ✅ Verification Status
                </Typography>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Aadhaar</Typography>
                        <Chip 
                            label={user?.verificationStatus?.aadhaar ? 'Verified' : 'Pending'} 
                            color={user?.verificationStatus?.aadhaar ? 'success' : 'warning'}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">PAN</Typography>
                        <Chip 
                            label={user?.verificationStatus?.pan ? 'Verified' : 'Pending'} 
                            color={user?.verificationStatus?.pan ? 'success' : 'warning'}
                            size="small"
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Loan Application Details */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0d47a1', mb: 1 }}>
                    📋 Loan Application
                </Typography>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Loan Amount</Typography>
                        <Typography variant="body2">₹{app.loanAmount?.toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Purpose</Typography>
                        <Typography variant="body2">{app.loanPurpose}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Tenure</Typography>
                        <Typography variant="body2">{app.tenure} months</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Employment Type</Typography>
                        <Typography variant="body2">{app.employmentType}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Annual Income</Typography>
                        <Typography variant="body2">₹{app.annualIncome?.toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Existing EMI</Typography>
                        <Typography variant="body2">₹{app.existingEmi || 0}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Credit Risk</Typography>
                        <Typography variant="body2">{app.riskScore?.credit || 'N/A'}/100</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Fraud Risk</Typography>
                        <Typography variant="body2">{app.riskScore?.fraud || 'N/A'}/100</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Submitted At</Typography>
                        <Typography variant="body2">{new Date(app.createdAt).toLocaleString()}</Typography>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage loan applications and users
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                        variant="outlined" 
                        startIcon={<Refresh />} 
                        onClick={loadApplications}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        startIcon={<ExitToApp />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            {stat.title}
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                            {stat.value}
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: stat.color + '20', color: stat.color, width: 48, height: 48 }}>
                                        {stat.icon}
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Loan Applications
                    </Typography>
                    <Chip 
                        label={pendingCount + ' Pending'} 
                        color="warning" 
                        size="small"
                        icon={<Pending />}
                    />
                </Box>

                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
                    <Tab label="All" />
                    <Tab label="Pending" icon={<Pending />} iconPosition="start" />
                    <Tab label="Reviewed" icon={<CheckCircle />} iconPosition="start" />
                </Tabs>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ m: 2 }}>
                        {error}
                        <Button size="small" onClick={loadApplications} sx={{ ml: 2 }}>
                            Retry
                        </Button>
                    </Alert>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Applicant</TableCell>
                                    <TableCell>Loan Amount</TableCell>
                                    <TableCell>Purpose</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredApplications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                                                No applications found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredApplications.map((app) => (
                                        <TableRow key={app._id || app.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar sx={{ width: 30, height: 30 }}>
                                                        {app.userId?.name?.charAt(0) || 'U'}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2">{app.userId?.name || 'Unknown'}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {app.userId?.email || 'No email'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>₹{app.loanAmount?.toLocaleString()}</TableCell>
                                            <TableCell>{app.loanPurpose}</TableCell>
                                            <TableCell>{getStatusChip(app.decision)}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<Visibility />}
                                                    onClick={() => handleReview(app)}
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    Review
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Review Dialog - Complete Customer Details */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Assignment />
                        Review Application - {selectedApp?.userId?.name || 'Unknown'}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedApp && (
                        <>
                            {renderCustomerDetails(selectedApp)}

                            <Divider sx={{ my: 2 }} />

                            {/* Admin Decision Section */}
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0d47a1', mb: 1 }}>
                                🔐 Admin Decision
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                label="Decision"
                                value={reviewData.decision}
                                onChange={(e) => setReviewData({...reviewData, decision: e.target.value})}
                                sx={{ mb: 2 }}
                            >
                                <MenuItem value="APPROVED">✅ Approve</MenuItem>
                                <MenuItem value="REJECTED">❌ Reject</MenuItem>
                                <MenuItem value="REVIEW">🔄 Request Changes</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                label="Reason / Comments"
                                multiline
                                rows={3}
                                value={reviewData.decisionReason}
                                onChange={(e) => setReviewData({...reviewData, decisionReason: e.target.value})}
                                placeholder="Provide reason for your decision..."
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSubmitReview}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} /> : 'Submit Decision'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Admin;
