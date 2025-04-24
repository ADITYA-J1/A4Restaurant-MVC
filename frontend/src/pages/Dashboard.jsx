import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    Card,
    CardContent,
    CardActions,
} from '@mui/material';
import {
    Restaurant as RestaurantIcon,
    EventSeat as EventSeatIcon,
    Receipt as ReceiptIcon,
    History as HistoryIcon,
    Fastfood as FastfoodIcon,
    RateReview as RateReviewIcon,
    PeopleAlt as PeopleAltIcon,
    LocalDining as LocalDiningIcon,
} from '@mui/icons-material';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const menuItems = [
        {
            title: 'View Menu',
            description: 'Browse our delicious menu items',
            icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
            path: '/menu',
            color: '#FF9800',
        },
        {
            title: 'Book a Table',
            description: 'Reserve your dining experience',
            icon: <EventSeatIcon sx={{ fontSize: 40 }} />,
            path: '/tables',
            color: '#2196F3',
        },
        {
            title: 'View Orders',
            description: 'Check your order history',
            icon: <ReceiptIcon sx={{ fontSize: 40 }} />,
            path: '/orders',
            color: '#4CAF50',
        },
        {
            title: 'Recent Orders',
            description: 'View your recent orders',
            icon: <HistoryIcon sx={{ fontSize: 40 }} />,
            path: '/orders',
            color: '#9C27B0',
        },
        {
            title: 'Queue Status',
            description: 'Check waiting queue status',
            icon: <PeopleAltIcon sx={{ fontSize: 40 }} />,
            path: '/queue',
            color: '#E91E63',
        },
        {
            title: 'Feedback',
            description: 'Share your dining experience',
            icon: <RateReviewIcon sx={{ fontSize: 40 }} />,
            path: '/feedback',
            color: '#00BCD4',
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Welcome back, {user?.name || 'Guest'}! 👋
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    What would you like to do today?
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {menuItems.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: (theme) => theme.shadows[8],
                                },
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                        backgroundColor: `${item.color}15`,
                                        color: item.color,
                                    }}
                                >
                                    {item.icon}
                                </Box>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {item.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {item.description}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        backgroundColor: item.color,
                                        '&:hover': {
                                            backgroundColor: item.color,
                                            opacity: 0.9,
                                        },
                                        px: 4,
                                    }}
                                >
                                    Go to {item.title}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Recent Activity Section */}
            <Box sx={{ mt: 6 }}>
                <Typography variant="h4" gutterBottom>
                    Recent Activity
                </Typography>
                <Paper sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <LocalDiningIcon sx={{ mr: 2, color: 'primary.main' }} />
                                <Typography variant="body1">
                                    No orders yet. Why not try our delicious menu?
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/menu')}
                                startIcon={<FastfoodIcon />}
                            >
                                Browse Menu
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
};

export default Dashboard; 