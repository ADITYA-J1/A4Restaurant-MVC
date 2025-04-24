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
    Rating,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
} from '@mui/material';
import {
    Star as StarIcon,
    CheckCircle as CheckCircleIcon,
    Comment as CommentIcon,
    Close as CloseIcon,
    Feedback as FeedbackIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import axios, { endpoints } from '../services/axios';
import { useSnackbar } from 'notistack';

const FeedbackProcessing = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [response, setResponse] = useState('');
    const [error, setError] = useState(null);
    const [newFeedback, setNewFeedback] = useState({
        rating: 0,
        comment: '',
        customerName: '',
    });
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/feedbacks');
            setFeedbacks(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching feedbacks:', err);
            setError('Failed to fetch feedback data. Please try again later.');
            enqueueSnackbar('Error loading feedbacks', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (feedbackId, newStatus) => {
        try {
            await axios.put(`http://localhost:8080/api/feedbacks/${feedbackId}/status`, {
                status: newStatus
            });
            fetchFeedbacks();
            enqueueSnackbar('Feedback status updated successfully', { variant: 'success' });
        } catch (error) {
            console.error('Error updating feedback status:', error);
            enqueueSnackbar('Failed to update feedback status', { variant: 'error' });
        }
    };

    const handleOpenDialog = (feedback) => {
        setSelectedFeedback(feedback);
        setResponse(feedback.response || '');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedFeedback(null);
        setResponse('');
    };

    const handleSubmitResponse = async () => {
        try {
            await axios.put(`http://localhost:8080/api/feedbacks/${selectedFeedback.id}/response`, {
                response
            });
            fetchFeedbacks();
            handleCloseDialog();
            enqueueSnackbar('Response submitted successfully', { variant: 'success' });
        } catch (error) {
            console.error('Error submitting response:', error);
            enqueueSnackbar('Failed to submit response', { variant: 'error' });
        }
    };

    const handleSubmitFeedback = async () => {
        try {
            if (!newFeedback.rating || !newFeedback.comment || !newFeedback.customerName) {
                enqueueSnackbar('Please fill in all required fields', { variant: 'warning' });
                return;
            }

            const response = await axios.post('/api/feedbacks', newFeedback);
            setFeedbacks([response.data, ...feedbacks]);
            setOpenDialog(false);
            resetForm();
            enqueueSnackbar('Feedback submitted successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to submit feedback', { variant: 'error' });
        }
    };

    const resetForm = () => {
        setNewFeedback({
            rating: 0,
            comment: '',
            customerName: '',
        });
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        resetForm();
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            NEW: { color: 'warning', icon: <StarIcon /> },
            REVIEWED: { color: 'info', icon: <CheckCircleIcon /> },
            RESPONDED: { color: 'success', icon: <CommentIcon /> },
            CLOSED: { color: 'default', icon: <CloseIcon /> }
        };

        const config = statusConfig[status] || { color: 'default', icon: null };

        return (
            <Chip
                icon={config.icon}
                label={status}
                color={config.color}
                sx={{ ml: 1 }}
            />
        );
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4">
                    Customer Feedback
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    Add Feedback
                </Button>
            </Box>

            <Grid container spacing={3}>
                {feedbacks.map((feedback) => (
                    <Grid item xs={12} md={6} key={feedback.id}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6" color="text.primary">
                                        {feedback.customerName || 'Anonymous'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Rating
                                            value={feedback.rating}
                                            readOnly
                                            precision={0.5}
                                            icon={<StarIcon fontSize="inherit" />}
                                        />
                                    </Box>
                                </Box>
                                <Typography variant="body1" color="text.secondary" paragraph>
                                    {feedback.comment || feedback.message || ''}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {feedback.createdAt ? new Date(feedback.createdAt).toLocaleString() : ''}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                {feedbacks.length === 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <FeedbackIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                No feedback yet
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Be the first to share your dining experience
                            </Typography>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>Share Your Feedback</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            label="Your Name"
                            fullWidth
                            value={newFeedback.customerName}
                            onChange={(e) => setNewFeedback({
                                ...newFeedback,
                                customerName: e.target.value
                            })}
                            margin="normal"
                            required
                        />
                        <Box sx={{ my: 2 }}>
                            <Typography component="legend">Rating</Typography>
                            <Rating
                                value={newFeedback.rating}
                                onChange={(event, newValue) => {
                                    setNewFeedback({
                                        ...newFeedback,
                                        rating: newValue
                                    });
                                }}
                                precision={0.5}
                                size="large"
                            />
                        </Box>
                        <TextField
                            label="Your Feedback"
                            fullWidth
                            multiline
                            rows={4}
                            value={newFeedback.comment}
                            onChange={(e) => setNewFeedback({
                                ...newFeedback,
                                comment: e.target.value
                            })}
                            margin="normal"
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitFeedback}
                    >
                        Submit Feedback
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default FeedbackProcessing; 