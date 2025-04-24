import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
    TextField,
    Grid,
    Divider,
    Stepper,
    Step,
    StepLabel,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Select,
    MenuItem,
    InputLabel,
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from '../services/axios';

const steps = ['Table Selection', 'Order Review', 'Confirm Order'];

// Utility to get or generate a visit/session ID (persisted in localStorage for the session)
function getVisitId() {
    let visitId = localStorage.getItem('visitId');
    if (!visitId) {
        visitId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem('visitId', visitId);
    }
    return visitId;
}

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [activeStep, setActiveStep] = useState(0);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [loading, setLoading] = useState(true);

    const visitId = getVisitId();

    useEffect(() => {
        fetchAvailableTables();
    }, []);

    const fetchAvailableTables = async () => {
        try {
            const response = await axios.get('/api/tables/available');
            setTables(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tables:', error);
            enqueueSnackbar('Failed to fetch available tables', { variant: 'error' });
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            // Place order
            handlePlaceOrder();
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handlePlaceOrder = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData) {
                navigate('/login');
                return;
            }

            // Get the selected table details
            const selectedTableDetails = tables.find(t => t.id === selectedTable);
            if (!selectedTableDetails) {
                enqueueSnackbar('Please select a table', { variant: 'error' });
                return;
            }

            // 1. Reserve the table before placing the order
            try {
                await axios.post('/api/tables/reservations', { table: { id: selectedTable } });
            } catch (reservationError) {
                enqueueSnackbar('Failed to reserve table. It may have just been reserved by someone else. Please select another.', { variant: 'error' });
                fetchAvailableTables();
                return;
            }

            // 2. Create order object with complete user and table information
            const orderData = {
                user: {
                    id: userData.id
                },
                table: {
                    id: selectedTableDetails.id
                },
                items: cart.map(item => ({
                    menuItem: { id: item.id },
                    quantity: item.quantity,
                    specialInstructions: specialInstructions,
                    status: 'PENDING'
                })),
                status: 'PENDING',
                orderTime: new Date().toISOString(),
                totalAmount: getCartTotal(),
                visitId, // <-- add this field
            };

            // Debug: Log the payload being sent
            console.log('Order payload:', JSON.stringify(orderData, null, 2));

            // 3. Place the order
            const response = await axios.post('/api/orders', orderData);
            clearCart();
            setActiveStep(activeStep + 1); // Move to next step
            enqueueSnackbar('Order placed successfully!', { variant: 'success' });
        } catch (error) {
            console.error('Error placing order:', error);
            enqueueSnackbar('Failed to place order', { variant: 'error' });
        }
    };

    const isStepValid = () => {
        if (activeStep === 0) {
            return selectedTable !== '';
        }
        return true;
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="table-select-label">Select Table</InputLabel>
                                <Select
                                    labelId="table-select-label"
                                    value={selectedTable}
                                    label="Select Table"
                                    onChange={(e) => setSelectedTable(e.target.value)}
                                >
                                    {tables.map((table) => (
                                        <MenuItem key={table.id} value={table.id}>
                                            Table {table.tableNumber} (Capacity: {table.capacity})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Special Instructions"
                                multiline
                                rows={3}
                                value={specialInstructions}
                                onChange={(e) => setSpecialInstructions(e.target.value)}
                                placeholder="Any special requests or allergies?"
                            />
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Order Summary
                        </Typography>
                        <Box sx={{ mb: 3 }}>
                            {cart.map((item) => (
                                <Box
                                    key={item.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 1,
                                    }}
                                >
                                    <Typography>
                                        {item.name} x {item.quantity}
                                    </Typography>
                                    <Typography>₹{(item.price * item.quantity).toFixed(2)}</Typography>
                                </Box>
                            ))}
                            <Divider sx={{ my: 2 }} />
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontWeight: 'bold',
                                }}
                            >
                                <Typography>Total</Typography>
                                <Typography>₹{getCartTotal().toFixed(2)}</Typography>
                            </Box>
                        </Box>
                        <Typography variant="h6" gutterBottom>
                            Table Details
                        </Typography>
                        {selectedTable && (
                            <Typography>
                                Table: {tables.find(t => t.id === selectedTable)?.tableNumber}
                            </Typography>
                        )}
                        {specialInstructions && (
                            <>
                                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                                    Special Instructions:
                                </Typography>
                                <Typography>{specialInstructions}</Typography>
                            </>
                        )}
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>Confirm Order</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ mb: 2 }}>
                            {cart.map((item, idx) => (
                                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography>{item.name} x {item.quantity}</Typography>
                                    <Typography>₹{(item.price * item.quantity).toFixed(2)}</Typography>
                                </Box>
                            ))}
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                <Typography>Subtotal</Typography>
                                <Typography>₹{getCartTotal().toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                <Typography>Total</Typography>
                                <Typography>₹{getCartTotal().toFixed(2)}</Typography>
                            </Box>
                        </Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Table: {tables.find(t => t.id === selectedTable)?.tableNumber}
                        </Typography>
                        {specialInstructions && (
                            <>
                                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                                    Special Instructions:
                                </Typography>
                                <Typography>{specialInstructions}</Typography>
                            </>
                        )}
                    </Box>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>Loading available tables...</Typography>
                </Paper>
            </Container>
        );
    }

    if (tables.length === 0) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        No tables available
                    </Typography>
                    <Typography paragraph>
                        All tables are currently occupied. Please wait for a table to become available.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/menu')}
                    >
                        Return to Menu
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Place Order
                </Typography>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {renderStepContent(activeStep)}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={!isStepValid()}
                    >
                        {activeStep === steps.length - 1 ? 'Confirm Order' : 'Next'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Checkout;