import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import { CartProvider } from './context/CartContext';
import { SnackbarProvider } from 'notistack';
import Navigation from './components/Navigation';
import Menu from './pages/Menu';
import OrderProcessing from './pages/OrderProcessing';
import CustomerQueue from './pages/CustomerQueue';
import FeedbackProcessing from './pages/FeedbackProcessing';
import BillPayment from './pages/BillPayment'; 
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import TableManagement from './pages/TableManagement';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

const theme = createTheme({
    palette: {
        primary: {
            main: '#f57c00', // Orange color
        },
        secondary: {
            main: '#1976d2', // Blue color
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
    },
});

const PrivateRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    return user ? children : <Navigate to="/login" />;
};

const AuthLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Navigation />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: '100vh',
                    backgroundColor: (theme) => theme.palette.grey[100],
                    p: 3,
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider 
                maxSnack={3} 
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <CartProvider>
                    <Router>
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<Landing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected routes */}
                            <Route path="/dashboard" element={
                                <PrivateRoute>
                                    <AuthLayout>
                                        <Dashboard />
                                    </AuthLayout>
                                </PrivateRoute>
                            } />
                            <Route path="/menu" element={
                                <PrivateRoute>
                                    <AuthLayout>
                                        <Menu />
                                    </AuthLayout>
                                </PrivateRoute>
                            } />
                            <Route path="/cart" element={
                                <PrivateRoute>
                                    <AuthLayout>
                                        <Cart />
                                    </AuthLayout>
                                </PrivateRoute>
                            } />
                            <Route path="/checkout" element={
                                <PrivateRoute>
                                    <AuthLayout>
                                        <Checkout />
                                    </AuthLayout>
                                </PrivateRoute>
                            } />
                            <Route path="/orders" element={
                                <PrivateRoute>
                                    <AuthLayout>
                                        <OrderProcessing />
                                    </AuthLayout>
                                </PrivateRoute>
                            } />
                            <Route path="/tables" element={
                                <PrivateRoute>
                                    <AuthLayout>
                                        <TableManagement />
                                    </AuthLayout>
                                </PrivateRoute>
                            } />
                            <Route path="/queue" element={
                                <PrivateRoute>
                                    <AuthLayout>
                                        <CustomerQueue />
                                    </AuthLayout>
                                </PrivateRoute>
                            } />
                            <Route path="/feedback" element={
                                <PrivateRoute>
                                    <AuthLayout>
                                        <FeedbackProcessing />
                                    </AuthLayout>
                                </PrivateRoute>
                            } />
                            <Route path="/bills" element={
                                <PrivateRoute>
                                    <AuthLayout>
                                        <BillPayment />
                                    </AuthLayout>
                                </PrivateRoute>
                            } />
                            {/* <Route path="/bill-processing" element={
                                <PrivateRoute>
                                    <AuthLayout>
                                        <BillProcessing />
                                    </AuthLayout>
                                </PrivateRoute>
                            } /> */}
                            {/* Catch all route */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Router>
                </CartProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App; 