import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Box,
    Tabs,
    Tab,
    IconButton,
    CircularProgress,
    Alert,
    Paper,
    Divider,
    Rating,
} from '@mui/material';
import {
    Add as AddIcon,
    ShoppingCart as CartIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import axios from '../services/axios';
import { useSnackbar } from 'notistack';

const CATEGORIES = [
    { id: 'NORTH_INDIAN', label: 'North Indian' },
    { id: 'SOUTH_INDIAN', label: 'South Indian' },
    { id: 'ITALIAN', label: 'Italian' },
    { id: 'MEXICAN', label: 'Mexican' },
    { id: 'CONTINENTAL', label: 'Continental' },
    { id: 'JAIN', label: 'Jain' }
];

const Menu = () => {
    const [menuItems, setMenuItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
    const [favorites, setFavorites] = useState([]);
    const { addToCart } = useCart();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchMenuItems();
        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/menu-items');
            // Group items by category
            const groupedItems = response.data.reduce((acc, item) => {
                if (!acc[item.category]) {
                    acc[item.category] = [];
                }
                acc[item.category].push(item);
                return acc;
            }, {});
            setMenuItems(groupedItems);
            setError(null);
        } catch (err) {
            setError('Failed to fetch menu items. Please try again later.');
            enqueueSnackbar('Error loading menu', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (item) => {
        addToCart(item);
    };

    const toggleFavorite = (itemId) => {
        const newFavorites = favorites.includes(itemId)
            ? favorites.filter(id => id !== itemId)
            : [...favorites, itemId];
        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
    };

    const handleCategoryChange = (event, newValue) => {
        setActiveCategory(newValue);
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
            <Typography variant="h4" gutterBottom>
                Our Menu
            </Typography>

            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={activeCategory}
                    onChange={handleCategoryChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    {CATEGORIES.map((category) => (
                        <Tab
                            key={category.id}
                            label={category.label}
                            value={category.id}
                            sx={{ fontWeight: 'bold' }}
                        />
                    ))}
                </Tabs>
            </Paper>

            {CATEGORIES.map((category) => (
                activeCategory === category.id && (
                    <Box key={category.id}>
                        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                            {category.label}
                        </Typography>
                        <Grid container spacing={3}>
                            {menuItems[category.id]?.map((item) => (
                                <Grid item xs={12} sm={6} md={4} key={item.id}>
                                    <Card 
                                        sx={{ 
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: (theme) => theme.shadows[4],
                                            },
                                        }}
                                    >
                                        {item.imageUrl && (
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={item.imageUrl}
                                                alt={item.name}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                        )}
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="start">
                                                <Typography variant="h6" gutterBottom>
                                                    {item.name}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => toggleFavorite(item.id)}
                                                    color="error"
                                                >
                                                    {favorites.includes(item.id) ? (
                                                        <FavoriteIcon />
                                                    ) : (
                                                        <FavoriteBorderIcon />
                                                    )}
                                                </IconButton>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {item.description}
                                            </Typography>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="h6" color="text.secondary">
                                                    ₹{item.price.toFixed(2)}
                                                </Typography>
                                                {item.rating > 0 && (
                                                    <Rating
                                                        value={item.rating}
                                                        readOnly
                                                        size="small"
                                                        precision={0.5}
                                                    />
                                                )}
                                            </Box>
                                            {item.spicyLevel && (
                                                <Box display="flex" gap={1} mt={1}>
                                                    {[...Array(item.spicyLevel)].map((_, index) => (
                                                        <span key={index} role="img" aria-label="spicy">
                                                            🌶️
                                                        </span>
                                                    ))}
                                                </Box>
                                            )}
                                        </CardContent>
                                        <Divider />
                                        <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color={item.available ? 'success.main' : 'error.main'}>
                                                {item.available ? 'In Stock' : 'Out of Stock'}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<AddIcon />}
                                                onClick={() => handleAddToCart(item)}
                                                disabled={!item.available}
                                            >
                                                Add to Cart
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                            {(!menuItems[category.id] || menuItems[category.id].length === 0) && (
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No items available in this category
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                )
            ))}
        </Container>
    );
};

export default Menu; 