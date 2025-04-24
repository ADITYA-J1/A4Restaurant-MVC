import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    IconButton,
    Button,
    Box,
    TextField,
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Delete as DeleteIcon,
    ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = (itemId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) {
            removeFromCart(itemId);
        } else {
            updateQuantity(itemId, newQuantity);
        }
    };

    const handlePlaceOrder = () => {
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        Your cart is empty
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        Add some delicious items to your cart
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/menu')}
                        sx={{ mt: 2 }}
                    >
                        Browse Menu
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Your Order
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cart.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Typography variant="subtitle1">{item.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.description}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    <Box display="flex" alignItems="center" justifyContent="center">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        <TextField
                                            size="small"
                                            value={item.quantity}
                                            InputProps={{
                                                readOnly: true,
                                                sx: { width: '60px', mx: 1, textAlign: 'center' },
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="error"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box
                sx={{
                    mt: 4,
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Order Summary
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="subtitle1">Total:</Typography>
                    <Typography variant="h6">₹{getCartTotal().toFixed(2)}</Typography>
                </Box>
                <Box display="flex" gap={2}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={clearCart}
                    >
                        Clear Cart
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePlaceOrder}
                        fullWidth
                    >
                        Place Order
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Cart;