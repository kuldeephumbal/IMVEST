import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton
} from '@mui/material';
import {
    Email,
    Lock,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import { useToast } from '../contexts/ToastContext';
import { adminAPI } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const { showSuccess, showError, showWarning } = useToast();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check if user is already logged in
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const adminToken = localStorage.getItem('adminToken');
        
        if (isLoggedIn && adminToken) {
            navigate('/dashboard');
        }
    }, [navigate]);



    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!formData.email || !formData.password) {
            showError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (!formData.email.includes('@')) {
            showError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            // Call the API
            const response = await adminAPI.login({
                email: formData.email,
                password: formData.password
            });

            // Store data in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('adminToken', response.token);
            localStorage.setItem('adminData', JSON.stringify(response.admin));
            localStorage.setItem('userRole', response.admin.role);
            localStorage.setItem('userEmail', response.admin.email);

            // Show success message based on detected role
            const roleLabels = {
                super_admin: 'Super Admin',
                admin: 'Admin',
                manager: 'Manager'
            };
            
            const roleLabel = roleLabels[response.admin.role] || 'Admin';
            showSuccess(`Welcome back, ${response.admin.firstName}! You are logged in as ${roleLabel}`, {
                autoClose: 3000
            });

            // Navigate to dashboard
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (error) {
            console.error('Login error:', error);
            
            // Set loading to false immediately
            setLoading(false);
            
            // Show error message
            const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
            showError(errorMessage);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                            IMVEST
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Admin Login
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            name="email"
                            type="email"
                            label="Email Address"
                            value={formData.email}
                            onChange={handleChange}
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

                        <TextField
                            fullWidth
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            value={formData.password}
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
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
