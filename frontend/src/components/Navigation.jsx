import React from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Badge,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Restaurant as RestaurantIcon,
    ShoppingCart as CartIcon,
    TableBar as TableIcon,
    PeopleAlt as QueueIcon,
    Feedback as FeedbackIcon,
    Receipt as BillIcon,
    Dashboard as DashboardIcon,
    ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navigation = () => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { cart } = useCart();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Menu', icon: <RestaurantIcon />, path: '/menu' },
        { text: 'Orders', icon: <CartIcon />, path: '/orders' },
        { text: 'Tables', icon: <TableIcon />, path: '/tables' },
        { text: 'Queue', icon: <QueueIcon />, path: '/queue' },
        { text: 'Feedback', icon: <FeedbackIcon />, path: '/feedback' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => setDrawerOpen(!drawerOpen)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        A4 Restaurant
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color="inherit"
                            onClick={() => navigate('/cart')}
                            sx={{ mr: 2 }}
                        >
                            <Badge badgeContent={cart.length} color="error">
                                <CartIcon />
                            </Badge>
                        </IconButton>
                        <Button color="inherit" onClick={handleLogout}>
                            <LogoutIcon sx={{ mr: 1 }} />
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                open={drawerOpen}
                sx={{
                    width: drawerOpen ? 240 : 72,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerOpen ? 240 : 72,
                        boxSizing: 'border-box',
                        transition: 'width 0.2s',
                        overflowX: 'hidden',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto', mt: 2 }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                key={item.text}
                                button
                                onClick={() => navigate(item.path)}
                                sx={{
                                    backgroundColor: isActive(item.path) ? 'action.selected' : 'transparent',
                                    borderRadius: 1,
                                    mx: 1,
                                    mb: 1,
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                {drawerOpen && <ListItemText primary={item.text} />}
                            </ListItem>
                        ))}
                        <Divider sx={{ my: 2 }} />
                        <ListItem
                            button
                            onClick={handleLogout}
                            sx={{ mx: 1 }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            {drawerOpen && <ListItemText primary="Logout" />}
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    ml: drawerOpen ? '240px' : '72px',
                    mt: '64px',
                    transition: 'margin-left 0.2s',
                }}
            >
                {/* Page content will be rendered here */}
            </Box>
        </>
    );
};

export default Navigation; 