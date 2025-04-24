import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    Chip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
} from '@mui/material';
import {
    Kitchen,
    CheckCircle,
    LocalShipping,
    Restaurant,
    Timer,
} from '@mui/icons-material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const OrderProcessing = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        // Only fetch orders for the logged-in user
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/login');
            return;
        }
        fetchOrders(userData.id);
        const interval = setInterval(() => fetchOrders(userData.id), 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/orders/user/${userId}`);
            // Sort orders by creation time (newest first)
            const sortedOrders = response.data.sort((a, b) => 
                new Date(b.orderTime) - new Date(a.orderTime)
            );
            setOrders(sortedOrders);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            enqueueSnackbar('Failed to fetch orders', { variant: 'error' });
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:8080/api/orders/${orderId}/status`, {
                status: newStatus
            });
            fetchOrders(JSON.parse(localStorage.getItem('user')).id);
            enqueueSnackbar('Order status updated successfully', { variant: 'success' });
        } catch (error) {
            console.error('Error updating order status:', error);
            enqueueSnackbar('Failed to update order status', { variant: 'error' });
        }
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            PENDING: { color: 'warning', icon: <Timer /> },
            IN_PROGRESS: { color: 'info', icon: <Kitchen /> },
            READY: { color: 'success', icon: <CheckCircle /> },
            DELIVERED: { color: 'primary', icon: <LocalShipping /> }
        };

        const config = statusConfig[status] || { color: 'default', icon: null };

        return (
            <Chip
                icon={config.icon}
                label={status.replace('_', ' ')}
                color={config.color}
                sx={{ ml: 1 }}
            />
        );
    };

    const handleOpenDialog = (order) => {
        setSelectedOrder(order);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOrder(null);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4">
                    My Orders
                </Typography>
            </Box>
            <Grid container spacing={3}>
                {orders.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography variant="body1">No orders found.</Typography>
                    </Grid>
                ) : (
                    orders.map(order => (
                        <Grid item xs={12} sm={6} md={4} key={order.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle2">Order #{order.id}</Typography>
                                    <Typography variant="body2">Items: {order.items.length}</Typography>
                                    <Typography variant="body2">Total: ₹{order.totalAmount.toFixed(2)}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate('/bills', { state: { user: order.user, orders: [order] } })}
                                    >
                                        Process Payment
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
};

export default OrderProcessing;