import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    Grid,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Box textAlign="center" mb={4}>
                        <RestaurantIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h3" component="h1" gutterBottom>
                            Welcome to A4 Restaurant
                        </Typography>
                        <Typography variant="h6" color="text.secondary" paragraph>
                            Experience the finest dining with our state-of-the-art restaurant management system
                        </Typography>
                    </Box>

                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} md={6}>
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                onClick={() => navigate('/login')}
                                startIcon={<LoginIcon />}
                                sx={{
                                    py: 2,
                                    backgroundColor: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                }}
                            >
                                Login
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button
                                fullWidth
                                size="large"
                                variant="outlined"
                                onClick={() => navigate('/register')}
                                startIcon={<PersonAddIcon />}
                                sx={{ py: 2 }}
                            >
                                Register
                            </Button>
                        </Grid>
                    </Grid>

                    <Box mt={4} textAlign="center">
                        <Typography variant="body1" color="text.secondary">
                            Experience seamless restaurant management with our comprehensive solution
                        </Typography>
                        <Box mt={2} display="flex" justifyContent="center" gap={2}>
                            <Typography variant="body2" color="text.secondary">
                                • Order Management
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • Table Reservations
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • Customer Feedback
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Landing;
