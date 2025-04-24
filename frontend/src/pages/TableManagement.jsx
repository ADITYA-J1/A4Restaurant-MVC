import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
} from '@mui/material';
import {
    TableRestaurant as TableIcon,
    Event as EventIcon,
    CleaningServices as CleaningIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Person as PersonIcon,
    Cancel as CancelIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import axios, { endpoints } from '../services/axios';
import { useSnackbar } from 'notistack';

const TableManagement = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [reservationDetails, setReservationDetails] = useState({
        customerName: '',
        partySize: '',
        phoneNumber: '',
        specialRequests: '',
    });
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/tables');
            setTables(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching tables:', err);
            setError('Failed to fetch tables. Please try again later.');
            enqueueSnackbar('Error loading tables', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (tableId, newStatus) => {
        try {
            await axios.put(`/api/tables/${tableId}/status?status=${newStatus}`);
            setTables(tables.map(table =>
                table.id === tableId ? { ...table, status: newStatus } : table
            ));
            enqueueSnackbar('Table status updated successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to update table status', { variant: 'error' });
        }
    };

    const handleReservation = async (tableId) => {
        try {
            const requestBody = {
                ...reservationDetails,
                table: { id: tableId },
            };
            console.log('Reservation request body:', requestBody); // Debug log
            await axios.post('/api/tables/reservations', requestBody);
            // Update local state
            setTables(tables.map(table =>
                table.id === tableId
                    ? { ...table, status: 'RESERVED', reservation: reservationDetails }
                    : table
            ));
            // Close dialog and reset form
            setOpenDialog(false);
            setReservationDetails({
                customerName: '',
                partySize: '',
                phoneNumber: '',
                specialRequests: '',
            });
            enqueueSnackbar('Table reserved successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to reserve table', { variant: 'error' });
            if (error.response) {
                console.error('Backend error:', error.response.data);
            }
        }
    };

    const handleClearReservation = async (tableId) => {
        try {
            await axios.delete(`/api/tables/reservations/${tableId}`);
            fetchTables();
            enqueueSnackbar('Reservation cleared', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to clear reservation', { variant: 'error' });
        }
    };

    const handleDialogOpen = (table) => {
        setSelectedTable(table);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedTable(null);
        setReservationDetails({
            customerName: '',
            partySize: '',
            phoneNumber: '',
            specialRequests: '',
        });
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            AVAILABLE: { color: 'success', icon: <CheckCircleIcon />, label: 'Available' },
            RESERVED: { color: 'info', icon: <EventIcon />, label: 'Reserved' },
            OCCUPIED: { color: 'warning', icon: <TableIcon />, label: 'Occupied' },
            DIRTY: { color: 'error', icon: <WarningIcon />, label: 'Dirty' },
            CLEANING: { color: 'secondary', icon: <CleaningIcon />, label: 'Cleaning' }
        };

        const config = statusConfig[status] || { color: 'default', icon: null, label: status };

        return (
            <Chip
                icon={config.icon}
                label={config.label}
                color={config.color}
                sx={{ ml: 1 }}
            />
        );
    };

    const getAvailableActions = (table) => {
        const actions = [];
        if (table.status === 'AVAILABLE') {
            actions.push({
                label: 'Reserve',
                color: 'primary',
                action: () => handleDialogOpen(table),
            });
        } else if (table.status === 'RESERVED') {
            actions.push({
                label: 'Clear Reservation',
                color: 'secondary',
                action: () => handleClearReservation(table.id),
            });
        } else if (table.status === 'OCCUPIED') {
            actions.push({
                label: 'Mark as Dirty',
                color: 'error',
                action: () => handleStatusUpdate(table.id, 'DIRTY'),
            });
        } else if (table.status === 'DIRTY') {
            actions.push({
                label: 'Start Cleaning',
                color: 'secondary',
                action: () => handleStatusUpdate(table.id, 'CLEANING'),
            });
        } else if (table.status === 'CLEANING') {
            actions.push({
                label: 'Mark as Available',
                color: 'success',
                action: () => handleStatusUpdate(table.id, 'AVAILABLE'),
            });
        }
        return actions;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return 'success';
            case 'OCCUPIED':
                return 'error';
            case 'RESERVED':
                return 'warning';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Table Management
            </Typography>

            <Grid container spacing={3}>
                {tables.map((table) => (
                    <Grid item xs={12} sm={6} md={4} key={table.id}>
                        <Card 
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                            }}
                        >
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6">
                                        Table #{table.id}
                                    </Typography>
                                    <Chip
                                        label={table.status}
                                        color={getStatusColor(table.status)}
                                        size="small"
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Capacity: {table.capacity} people
                                </Typography>
                                {table.reservation && (
                                    <Box mt={2}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Reserved for:
                                        </Typography>
                                        <Typography variant="body2">
                                            {table.reservation.customerName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Party of {table.reservation.partySize}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0, flexWrap: 'wrap', gap: 1 }}>
                                {getAvailableActions(table).map((action, index) => (
                                    <Button
                                        key={index}
                                        size="small"
                                        color={action.color}
                                        variant="contained"
                                        onClick={action.action}
                                    >
                                        {action.label}
                                    </Button>
                                ))}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>Reserve Table {selectedTable?.id}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            label="Customer Name"
                            fullWidth
                            value={reservationDetails.customerName}
                            onChange={(e) => setReservationDetails({
                                ...reservationDetails,
                                customerName: e.target.value
                            })}
                            margin="normal"
                        />
                        <TextField
                            label="Party Size"
                            type="number"
                            fullWidth
                            value={reservationDetails.partySize}
                            onChange={(e) => setReservationDetails({
                                ...reservationDetails,
                                partySize: e.target.value
                            })}
                            margin="normal"
                        />
                        <TextField
                            label="Phone Number"
                            fullWidth
                            value={reservationDetails.phoneNumber}
                            onChange={(e) => setReservationDetails({
                                ...reservationDetails,
                                phoneNumber: e.target.value
                            })}
                            margin="normal"
                        />
                        <TextField
                            label="Special Requests"
                            fullWidth
                            multiline
                            rows={3}
                            value={reservationDetails.specialRequests}
                            onChange={(e) => setReservationDetails({
                                ...reservationDetails,
                                specialRequests: e.target.value
                            })}
                            margin="normal"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleReservation(selectedTable.id)}
                    >
                        Confirm Reservation
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TableManagement; 