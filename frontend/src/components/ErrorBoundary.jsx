import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        // You can also log the error to an error reporting service here
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="100vh"
                    p={3}
                    textAlign="center"
                >
                    <Typography variant="h4" component="h1" gutterBottom color="error">
                        Oops! Something went wrong
                    </Typography>
                    <Typography variant="body1" color="textSecondary" paragraph>
                        We're sorry for the inconvenience. Please try refreshing the page or return to the homepage.
                    </Typography>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <Box my={3} textAlign="left" width="100%" maxWidth="800px">
                            <Typography variant="h6" gutterBottom>
                                Error Details:
                            </Typography>
                            <pre style={{ 
                                overflow: 'auto', 
                                padding: '1rem', 
                                backgroundColor: '#f5f5f5',
                                borderRadius: '4px'
                            }}>
                                {this.state.error.toString()}
                                {'\n'}
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleReset}
                        sx={{ mt: 2 }}
                    >
                        Return to Homepage
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 