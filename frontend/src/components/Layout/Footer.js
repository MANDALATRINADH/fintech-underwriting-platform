import React from 'react';
import { Box, Container, Typography, Grid, Link, Divider, IconButton } from '@mui/material';
import {
    Facebook,
    Twitter,
    LinkedIn,
    GitHub,
    Email,
    Phone,
    LocationOn,
    AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#1a1a2e',
                color: 'white',
                py: 4,
                mt: 'auto',
                borderTop: '1px solid rgba(255,255,255,0.1)'
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <AccountBalanceIcon sx={{ fontSize: 30 }} />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                AdaptiveTrust
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                            AI-powered underwriting platform that combines traditional credit information 
                            with validated alternative behavioural signals for smarter lending decisions.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'white' } }}>
                                <Facebook />
                            </IconButton>
                            <IconButton sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'white' } }}>
                                <Twitter />
                            </IconButton>
                            <IconButton sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'white' } }}>
                                <LinkedIn />
                            </IconButton>
                            <IconButton sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'white' } }}>
                                <GitHub />
                            </IconButton>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Products
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="/dashboard" color="rgba(255,255,255,0.7)" underline="hover">
                                Dashboard
                            </Link>
                            <Link href="/verification" color="rgba(255,255,255,0.7)" underline="hover">
                                Verification
                            </Link>
                            <Link href="/application" color="rgba(255,255,255,0.7)" underline="hover">
                                Loan Application
                            </Link>
                            <Link href="/profile" color="rgba(255,255,255,0.7)" underline="hover">
                                Profile
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Company
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="/about" color="rgba(255,255,255,0.7)" underline="hover">
                                About Us
                            </Link>
                            <Link href="/careers" color="rgba(255,255,255,0.7)" underline="hover">
                                Careers
                            </Link>
                            <Link href="/blog" color="rgba(255,255,255,0.7)" underline="hover">
                                Blog
                            </Link>
                            <Link href="/press" color="rgba(255,255,255,0.7)" underline="hover">
                                Press
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Contact Us
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    support@adaptivetrust.com
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    +91 1800-123-4567
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    Mumbai, Maharashtra, India
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        © 2026 AdaptiveTrust. All rights reserved.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Link href="/privacy" color="rgba(255,255,255,0.5)" underline="hover" variant="caption">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" color="rgba(255,255,255,0.5)" underline="hover" variant="caption">
                            Terms of Service
                        </Link>
                        <Link href="/cookies" color="rgba(255,255,255,0.5)" underline="hover" variant="caption">
                            Cookie Policy
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
