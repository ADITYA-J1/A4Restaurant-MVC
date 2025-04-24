import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Alert,
    CircularProgress,
    IconButton,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    AccessTime as AccessTimeIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import axios from '../services/axios';
import { useSnackbar } from 'notistack';

const CustomerQueue = () => {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerDetails, setCustomerDetails] = useState({
        customerName: '',
        partySize: '',
        phoneNumber: '',
        specialRequests: '',
    });
    const { enqueueSnackbar } = useSnackbar();

    const fetchQueue = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/queue');
            setQueue(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch queue data. Please try again later.');
            enqueueSnackbar('Error loading queue', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
        // Set up polling every 30 seconds
        const interval = setInterval(fetchQueue, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleAddToQueue = async () => {
        try {
            await axios.post('/api/queue', customerDetails);
            fetchQueue();
            setOpenDialog(false);
            resetCustomerDetails();
            enqueueSnackbar('Customer added to queue successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to add customer to queue', { variant: 'error' });
        }
    };

    const handleUpdateEstimatedTime = async (customerId, minutes) => {
        try {
            await axios.put(`/api/queue/${customerId}/estimate`, { 
                estimatedWaitMinutes: minutes 
            });
            fetchQueue();
            enqueueSnackbar('Wait time updated successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(`Failed to update wait time: ${error.response?.data?.message || error.message}`, { 
                variant: 'error' 
            });
        }
    };

    const handleRemoveFromQueue = async (customerId) => {
        try {
            await axios.delete(`/api/queue/${customerId}`);
            fetchQueue();
            enqueueSnackbar('Customer removed from queue', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to remove customer from queue', { variant: 'error' });
        }
    };

    const resetCustomerDetails = () => {
        setCustomerDetails({
            customerName: '',
            partySize: '',
            phoneNumber: '',
            specialRequests: '',
        });
    };

    const calculateWaitTime = (position) => {
        // Estimate 15 minutes per group ahead in queue
        const estimatedMinutes = position * 15;
        const hours = Math.floor(estimatedMinutes / 60);
        const minutes = estimatedMinutes % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Customer Queue
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    Add to Queue
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Position</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="center">Party Size</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell align="center">Wait Time</TableCell>
                            <TableCell>Special Requests</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {queue.map((customer, index) => (
                            <TableRow key={customer.id}>
                                <TableCell>
                                    <Chip
                                        label={`#${index + 1}`}
                                        color="primary"
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{customer.customerName}</TableCell>
                                <TableCell align="center">
                                    <Chip
                                        icon={<PersonIcon />}
                                        label={customer.partySize}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{customer.phoneNumber}</TableCell>
                                <TableCell align="center">
                                    <Box display="flex" alignItems="center" justifyContent="center">
                                        <AccessTimeIcon sx={{ mr: 1, fontSize: 16 }} />
                                        {customer.estimatedWaitMinutes 
                                            ? `${customer.estimatedWaitMinutes}m`
                                            : calculateWaitTime(index + 1)}
                                    </Box>
                                </TableCell>
                                <TableCell>{customer.specialRequests}</TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            const currentWait = customer.estimatedWaitMinutes || (index + 1) * 15;
                                            handleUpdateEstimatedTime(customer.id, currentWait);
                                        }}
                                    >
                                        
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleRemoveFromQueue(customer.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {queue.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="body1" color="text.secondary">
                                        No customers in queue
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => {
                setOpenDialog(false);
                resetCustomerDetails();
            }} maxWidth="sm" fullWidth>
                <DialogTitle>Add Customer to Queue</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            label="Customer Name"
                            fullWidth
                            value={customerDetails.customerName}
                            onChange={(e) => setCustomerDetails({
                                ...customerDetails,
                                customerName: e.target.value
                            })}
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Party Size"
                            type="number"
                            fullWidth
                            value={customerDetails.partySize}
                            onChange={(e) => setCustomerDetails({
                                ...customerDetails,
                                partySize: e.target.value
                            })}
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Phone Number"
                            fullWidth
                            value={customerDetails.phoneNumber}
                            onChange={(e) => setCustomerDetails({
                                ...customerDetails,
                                phoneNumber: e.target.value
                            })}
                            margin="normal"
                        />
                        <TextField
                            label="Special Requests"
                            fullWidth
                            multiline
                            rows={3}
                            value={customerDetails.specialRequests}
                            onChange={(e) => setCustomerDetails({
                                ...customerDetails,
                                specialRequests: e.target.value
                            })}
                            margin="normal"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenDialog(false);
                        resetCustomerDetails();
                    }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddToQueue}
                        disabled={!customerDetails.customerName || !customerDetails.partySize}
                    >
                        Add to Queue
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CustomerQueue; 