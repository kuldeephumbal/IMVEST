import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
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
    Security,
    ArrowBack
} from '@mui/icons-material';

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            // If no email in state, redirect back to forgot password
            navigate('/forgot-password');
        }
    }, [location.state, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!otp) {
            alert('Please enter the OTP');
            setLoading(false);
            return;
        }

        if (otp.length !== 6) {
            alert('OTP must be 6 digits');
            setLoading(false);
            return;
        }

        // TODO: Add API call here
        // Simulate success
        setTimeout(() => {
            navigate('/reset-password', { state: { email, otp } });
        }, 1000);

        setLoading(false);
    };

    const handleResendOTP = async () => {
        setLoading(true);
        // TODO: Add API call here
        alert('OTP resent successfully');
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
                            Verify OTP
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enter the 6-digit OTP sent to {email}
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            name="otp"
                            label="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            margin="normal"
                            required
                            inputProps={{
                                maxLength: 6,
                                pattern: '[0-9]*'
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Security color="action" />
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
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button
                                variant="text"
                                onClick={handleResendOTP}
                                disabled={loading}
                                sx={{
                                    color: '#3b82f6',
                                    fontSize: '14px',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                Resend OTP
                            </Button>
                        </Box>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Link
                                component={RouterLink}
                                to="/forgot-password"
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
                                Back to Forgot Password
                            </Link>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default VerifyOTP; 