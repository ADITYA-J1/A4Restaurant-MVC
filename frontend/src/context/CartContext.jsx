import React, { createContext, useContext, useReducer } from 'react';
import { useSnackbar } from 'notistack';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }],
            };

        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
            };

        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };

        case 'CLEAR_CART':
            return {
                ...state,
                items: [],
            };

        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [cartState, dispatch] = useReducer(cartReducer, { items: [] });
    const { enqueueSnackbar } = useSnackbar();

    const addToCart = (item) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
        enqueueSnackbar(`${item.name} added to cart`, { variant: 'success' });
    };

    const removeFromCart = (itemId) => {
        dispatch({ type: 'REMOVE_ITEM', payload: itemId });
        enqueueSnackbar('Item removed from cart', { variant: 'success' });
    };

    const updateQuantity = (itemId, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
        enqueueSnackbar('Cart updated successfully', { variant: 'success' });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
        enqueueSnackbar('Cart cleared', { variant: 'info' });
    };

    const getCartTotal = () => {
        return cartState.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartItemCount = () => {
        return cartState.items.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart: cartState.items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartItemCount
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 