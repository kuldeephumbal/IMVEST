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
    IconButton,
    Link
} from '@mui/material';
import {
    Lock,
    Visibility,
    VisibilityOff,
    ArrowBack
} from '@mui/icons-material';

const ResetPassword = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!formData.newPassword || !formData.confirmPassword) {
            alert('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            alert('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            alert('Passwords do not match');
            setLoading(false);
            return;
        }

        // TODO: Add API call here
        // Simulate success
        alert('Password reset successfully! You can now login with your new password.');

        setTimeout(() => {
            navigate('/login');
        }, 2000);

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
                            Reset Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enter your new password
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            name="newPassword"
                            type={showPassword ? 'text' : 'password'}
                            label="New Password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            margin="normal"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            fullWidth
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            label="Confirm New Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            margin="normal"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={toggleConfirmPasswordVisibility}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
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
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Link
                                component={RouterLink}
                                to="/verify-otp"
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
                                Back to OTP Verification
                            </Link>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ResetPassword; 