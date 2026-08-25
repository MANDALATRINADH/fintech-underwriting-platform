import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem,
    IconButton, Box, Container, Badge, Drawer, List, ListItem,
    ListItemIcon, ListItemText, Divider, useTheme, useMediaQuery,
    Chip
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    VerifiedUser as VerifiedIcon,
    CreditCard as CreditCardIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    Notifications as NotificationsIcon,
    Menu as MenuIcon,
    AccountBalance as AccountBalanceIcon,
    AdminPanelSettings as AdminPanelSettingsIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const isAdmin = user?.role === 'admin';
    const isCustomer = user?.role === 'customer' || user?.role === 'user';

    const customerMenuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Verification', icon: <VerifiedIcon />, path: '/verification' },
        { text: 'Loan Application', icon: <CreditCardIcon />, path: '/application' },
        { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    ];

    const adminMenuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
        { text: 'Applications', icon: <AssignmentIcon />, path: '/admin' },
        { text: 'Users', icon: <PeopleIcon />, path: '/admin' },
        { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    ];

    const menuItems = isAdmin ? adminMenuItems : customerMenuItems;

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleMenuClose();
    };

    const toggleDrawer = () => setDrawerOpen(!drawerOpen);

    const drawer = (
        <Box sx={{ width: 280 }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#0d47a1' }}>
                    <AccountBalanceIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0d47a1' }}>
                    {isAdmin ? 'Admin Panel' : 'AdaptiveTrust'}
                </Typography>
            </Box>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => {
                            navigate(item.path);
                            setDrawerOpen(false);
                        }}
                        selected={location.pathname === item.path}
                        sx={{
                            '&.Mui-selected': {
                                bgcolor: 'rgba(13,71,161,0.08)',
                                color: '#0d47a1',
                                '&:hover': { bgcolor: 'rgba(13,71,161,0.12)' }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: location.pathname === item.path ? '#0d47a1' : 'inherit' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="fixed" sx={{ 
                zIndex: 1201,
                background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)',
                boxShadow: '0 4px 20px rgba(13,71,161,0.3)'
            }}>
                <Container maxWidth="xl">
                    <Toolbar sx={{ px: { xs: 0, sm: 2 } }}>
                        {isMobile && (
                            <IconButton color="inherit" onClick={toggleDrawer} edge="start">
                                <MenuIcon />
                            </IconButton>
                        )}
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                            <AccountBalanceIcon sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }} />
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                                {isAdmin ? 'Admin Panel' : 'AdaptiveTrust'}
                            </Typography>
                            {isAdmin && (
                                <Chip 
                                    label="ADMIN" 
                                    size="small"
                                    sx={{ 
                                        ml: 2, 
                                        fontWeight: 700,
                                        bgcolor: 'rgba(255,255,255,0.15)',
                                        color: '#ffffff',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}
                                />
                            )}
                            {!isAdmin && (
                                <Chip 
                                    label="CUSTOMER" 
                                    size="small"
                                    sx={{ 
                                        ml: 2, 
                                        fontWeight: 700,
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        color: '#ffffff',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                />
                            )}
                        </Box>

                        {!isMobile && (
                            <Box sx={{ display: 'flex', gap: 1, mx: 2 }}>
                                {menuItems.map((item) => (
                                    <Button
                                        key={item.text}
                                        color="inherit"
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            fontWeight: location.pathname === item.path ? 700 : 400,
                                            borderBottom: location.pathname === item.path ? '2px solid #ffffff' : 'none',
                                            borderRadius: 0,
                                            color: '#ffffff',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.1)'
                                            }
                                        }}
                                    >
                                        {item.text}
                                    </Button>
                                ))}
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton color="inherit">
                                <Badge badgeContent={isAdmin ? 0 : 3} color="error">
                                    <NotificationsIcon sx={{ color: '#ffffff' }} />
                                </Badge>
                            </IconButton>
                            
                            {user && (
                                <>
                                    <Button
                                        color="inherit"
                                        onClick={handleMenuOpen}
                                        sx={{ 
                                            textTransform: 'none',
                                            color: '#ffffff',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.1)'
                                            }
                                        }}
                                    >
                                        <Avatar
                                            src={user.picture}
                                            sx={{ 
                                                width: 32, 
                                                height: 32, 
                                                mr: 1, 
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                color: '#ffffff'
                                            }}
                                        >
                                            {user.name?.charAt(0) || 'U'}
                                        </Avatar>
                                        <Typography sx={{ display: { xs: 'none', sm: 'block' }, color: '#ffffff' }}>
                                            {isAdmin ? 'Admin' : user.name}
                                        </Typography>
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    >
                                        <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                                            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                                            Profile
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem onClick={handleLogout}>
                                            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}
                sx={{ zIndex: 1300 }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navigation;
