import React, { useState, useEffect, useRef } from 'react';
import {
    Grid, Paper, Typography, Box, Card, CardContent, Avatar,
    Divider, Button, Chip, List, ListItem, ListItemIcon, ListItemText,
    TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    CircularProgress, MenuItem, IconButton, Badge, Alert
} from '@mui/material';
import {
    Person, Email, Phone, LocationOn, VerifiedUser,
    CalendarToday, Edit, Save, Cancel, Work, AttachMoney,
    Close, PhotoCamera
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        employmentStatus: 'employed',
        annualIncome: 0,
        dateOfBirth: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                address: user.profile?.address || '',
                employmentStatus: user.profile?.employmentStatus || 'employed',
                annualIncome: user.profile?.annualIncome || 0,
                dateOfBirth: user.profile?.dateOfBirth || ''
            });
        }
    }, [user]);

    const handleOpenDialog = (type) => {
        setError('');
        setDialogType(type);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogType('');
        setError('');
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                localStorage.setItem('profileImage', reader.result);
                toast.success('Profile photo updated!');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('Sending profile data:', formData);
            const response = await profileAPI.updateProfile(formData);
            console.log('Response:', response.data);
            
            if (response.data.success) {
                updateUser(response.data.user);
                toast.success('Profile updated successfully!');
                handleCloseDialog();
            } else {
                setError(response.data.error || 'Failed to update profile');
                toast.error(response.data.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Update error:', error);
            const errorMsg = error.response?.data?.error || error.message || 'Failed to update profile';
            setError(errorMsg);
            toast.error(errorMsg);
        }
        setLoading(false);
    };

    const handleSaveName = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await profileAPI.updateName(formData.name);
            if (response.data.success) {
                const updatedUser = { ...user, name: response.data.name };
                updateUser(updatedUser);
                toast.success('Name updated successfully!');
                handleCloseDialog();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to update name';
            setError(errorMsg);
            toast.error(errorMsg);
        }
        setLoading(false);
    };

    const handleSavePhone = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await profileAPI.updatePhone(formData.phone);
            if (response.data.success) {
                const updatedUser = { ...user, phone: response.data.phone };
                updateUser(updatedUser);
                toast.success('Phone updated successfully!');
                handleCloseDialog();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to update phone';
            setError(errorMsg);
            toast.error(errorMsg);
        }
        setLoading(false);
    };

    const handleSaveAddress = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await profileAPI.updateAddress(formData.address);
            if (response.data.success) {
                const updatedUser = { 
                    ...user, 
                    profile: { ...user.profile, address: response.data.profile.address }
                };
                updateUser(updatedUser);
                toast.success('Address updated successfully!');
                handleCloseDialog();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to update address';
            setError(errorMsg);
            toast.error(errorMsg);
        }
        setLoading(false);
    };

    const handleSaveEmployment = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await profileAPI.updateEmployment(
                formData.employmentStatus,
                formData.annualIncome
            );
            if (response.data.success) {
                const updatedUser = { 
                    ...user, 
                    profile: { 
                        ...user.profile, 
                        employmentStatus: response.data.profile.employmentStatus,
                        annualIncome: response.data.profile.annualIncome
                    }
                };
                updateUser(updatedUser);
                toast.success('Employment details updated successfully!');
                handleCloseDialog();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to update employment';
            setError(errorMsg);
            toast.error(errorMsg);
        }
        setLoading(false);
    };

    const handleSave = () => {
        switch(dialogType) {
            case 'full':
                handleSaveProfile();
                break;
            case 'name':
                handleSaveName();
                break;
            case 'phone':
                handleSavePhone();
                break;
            case 'address':
                handleSaveAddress();
                break;
            case 'employment':
                handleSaveEmployment();
                break;
            default:
                handleSaveProfile();
        }
    };

    const profileInfo = [
        { icon: <Person />, label: 'Full Name', value: user?.name || 'Demo User', editType: 'name' },
        { icon: <Email />, label: 'Email', value: user?.email || 'demo@example.com', editType: 'email' },
        { icon: <Phone />, label: 'Phone', value: user?.phone || '9876543210', editType: 'phone' },
        { icon: <LocationOn />, label: 'Address', value: user?.profile?.address || 'Not set', editType: 'address' },
        { icon: <Work />, label: 'Employment Status', value: user?.profile?.employmentStatus || 'Employed', editType: 'employment' },
        { icon: <AttachMoney />, label: 'Annual Income', value: '₹' + (user?.profile?.annualIncome?.toLocaleString() || '0'), editType: 'employment' },
        { icon: <CalendarToday />, label: 'Date of Birth', value: user?.profile?.dateOfBirth || 'Not set', editType: 'full' },
    ];

    const userAvatar = profileImage || user?.picture || '';

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        My Profile
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your personal information
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => handleOpenDialog('full')}
                >
                    Edit Profile
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ textAlign: 'center', p: 3 }}>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                <IconButton
                                    size="small"
                                    sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <PhotoCamera fontSize="small" />
                                </IconButton>
                            }
                        >
                            <Avatar
                                src={userAvatar}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    margin: '0 auto',
                                    bgcolor: 'primary.main',
                                    fontSize: 48
                                }}
                            >
                                {user?.name?.charAt(0) || 'D'}
                            </Avatar>
                        </Badge>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                        <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                            {user?.name || 'Demo User'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user?.email || 'demo@example.com'}
                        </Typography>
                        <Chip
                            label={user?.verificationStatus?.aadhaar && user?.verificationStatus?.pan ? 'Verified' : 'Pending'}
                            color={user?.verificationStatus?.aadhaar && user?.verificationStatus?.pan ? 'success' : 'warning'}
                            size="small"
                            sx={{ mt: 1 }}
                        />
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<PhotoCamera />}
                            onClick={() => fileInputRef.current?.click()}
                            sx={{ mt: 2 }}
                        >
                            Upload Photo
                        </Button>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Personal Information
                            </Typography>
                            <List>
                                {profileInfo.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem>
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            <ListItemText
                                                primary={item.label}
                                                secondary={item.value}
                                                primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                                                secondaryTypographyProps={{ variant: 'body1', sx: { fontWeight: 500 } }}
                                            />
                                            {item.editType !== 'email' && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<Edit />}
                                                    onClick={() => handleOpenDialog(item.editType)}
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                        </ListItem>
                                        {index < profileInfo.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {dialogType === 'full' ? 'Edit Profile' : 
                         dialogType === 'name' ? 'Edit Name' :
                         dialogType === 'phone' ? 'Edit Phone' :
                         dialogType === 'address' ? 'Edit Address' :
                         dialogType === 'employment' ? 'Edit Employment' : 'Edit'}
                        <IconButton onClick={handleCloseDialog} size="small">
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    
                    {dialogType === 'full' && (
                        <Box sx={{ mt: 1 }}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                multiline
                                rows={2}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                            />
                        </Box>
                    )}

                    {dialogType === 'name' && (
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            sx={{ mt: 1 }}
                        />
                    )}

                    {dialogType === 'phone' && (
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            sx={{ mt: 1 }}
                        />
                    )}

                    {dialogType === 'address' && (
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            multiline
                            rows={3}
                            sx={{ mt: 1 }}
                        />
                    )}

                    {dialogType === 'employment' && (
                        <Box sx={{ mt: 1 }}>
                            <TextField
                                fullWidth
                                select
                                label="Employment Status"
                                name="employmentStatus"
                                value={formData.employmentStatus}
                                onChange={handleInputChange}
                                sx={{ mb: 2 }}
                            >
                                <MenuItem value="employed">Employed</MenuItem>
                                <MenuItem value="self-employed">Self-Employed</MenuItem>
                                <MenuItem value="business">Business Owner</MenuItem>
                                <MenuItem value="freelancer">Freelancer</MenuItem>
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="unemployed">Unemployed</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                label="Annual Income (₹)"
                                name="annualIncome"
                                type="number"
                                value={formData.annualIncome}
                                onChange={handleInputChange}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} startIcon={<Cancel />}>
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSave} 
                        startIcon={<Save />}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Profile;
