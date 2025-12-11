import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    InputAdornment,
    Link
} from '@mui/material';
import {
    Email,
    ArrowBack
} from '@mui/icons-material';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!email) {
            alert('Please enter your email address');
            setLoading(false);
            return;
        }

        if (!email.includes('@')) {
            alert('Please enter a valid email address');
            setLoading(false);
            return;
        }

        // TODO: Add API call here
        // Simulate success
        setTimeout(() => {
            navigate('/verify-otp', { state: { email } });
        }, 1000);

        setLoading(false);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: 2
            }}
        >
            <Card
                sx={{
                    maxWidth: 400,
                    width: '100%',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                color: '#3b82f6',
                                mb: 1
                            }}
                        >
                            CUST
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            Forgot Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enter your email address to receive a password reset OTP
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            name="email"
                            type="email"
                            label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="action" />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.5,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                                }
                            }}
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Link
                                component={RouterLink}
                                to="/login"
                                sx={{
                                    color: '#3b82f6',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 0.5,
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                <ArrowBack fontSize="small" />
                                Back to Login
                            </Link>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ForgotPassword; 