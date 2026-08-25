import React from 'react';
import { Box, Container } from '@mui/material';
import Navigation from './Navigation';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navigation />
            <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
                <Container maxWidth="xl" sx={{ py: 3 }}>
                    <Outlet />
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default Layout;
