import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider,
    Alert,
    CircularProgress,
    Grid,
    MenuItem,
    Tabs,
    Tab,
    Snackbar,
    IconButton,
    Card,
    CardContent
} from '@mui/material';
import {
    Save,
    Notifications,
    Security,
    Palette,
    Person,
    ManageAccounts,
    LockReset,
    Close
} from '@mui/icons-material';
import CustomBreadcrumb from '../components/CustomBreadcrumb';

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
    const [activeTab, setActiveTab] = useState(0);

    // Mock data for testing (this would normally come from API)
    const mockProfileData = {
        firstName: 'John',
        lastName: 'Doe',
        email: localStorage.getItem('userEmail') || 'admin@cust.com',
        role: localStorage.getItem('userRole') || 'admin',
        permissions: ['approve_clients', 'view_reports', 'user_management']
    };

    // Profile settings state
    const [profileSettings, setProfileSettings] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        permissions: []
    });

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Notification/preference settings
    const [preferenceSettings, setPreferenceSettings] = useState({
        notifications: true,
        darkMode: true,
        autoSave: false,
        twoFactor: true
    });

    // Load user profile data on component mount
    useEffect(() => {
        console.log('Settings component mounted');
        fetchProfileData();
    }, []);

    // Debug log whenever profile settings change
    useEffect(() => {
        console.log('Current profile settings:', profileSettings);
    }, [profileSettings]);

    const fetchProfileData = async () => {
        // TODO: Add API call here
        setLoadingProfile(true);

        // Use mock data
        console.log('Using mock data');
        setProfileSettings(mockProfileData);

        console.log('Profile settings after update:', profileSettings);
        setLoadingProfile(false);
    };

    const handleProfileChange = (field) => (event) => {
        setProfileSettings({
            ...profileSettings,
            [field]: event.target.value
        });
    };

    const handlePasswordChange = (field) => (event) => {
        setPasswordData({
            ...passwordData,
            [field]: event.target.value
        });
    };

    const handlePreferenceChange = (field) => (event) => {
        setPreferenceSettings({
            ...preferenceSettings,
            [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
        });
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleSaveProfile = async () => {
        // TODO: Add API call here
        setLoading(true);

        setNotification({
            open: true,
            message: 'Profile updated successfully',
            type: 'success'
        });
        setLoading(false);
    };

    const handleChangePassword = async () => {
        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setNotification({
                open: true,
                message: 'New passwords do not match',
                type: 'error'
            });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setNotification({
                open: true,
                message: 'Password must be at least 6 characters',
                type: 'error'
            });
            return;
        }

        // TODO: Add API call here
        setLoading(true);

        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });

        setNotification({
            open: true,
            message: 'Password changed successfully',
            type: 'success'
        });
        setLoading(false);
    };

    const handleSavePreferences = () => {
        // Here you would typically call an API to save preferences
        console.log('Preferences saved:', preferenceSettings);
        setNotification({
            open: true,
            message: 'Preferences saved successfully',
            type: 'success'
        });
    };

    return (
        <>
            <CustomBreadcrumb />

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    severity={notification.type}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={() => setNotification({ ...notification, open: false })}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    }
                >
                    {notification.message}
                </Alert>
            </Snackbar>

            <Paper
                sx={{
                    mb: 3,
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden'
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    sx={{
                        '& .MuiTab-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-selected': {
                                color: '#60a5fa'
                            }
                        }
                    }}
                >
                    <Tab icon={<Person />} label="Profile" />
                    <Tab icon={<LockReset />} label="Password" />
                    <Tab icon={<Notifications />} label="Preferences" />
                </Tabs>
            </Paper>

            {loadingProfile ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <div className="container-fluid">
                    {/* PROFILE TAB */}
                    {activeTab === 0 && (
                        <div className="row">
                            <div className="col-12 col-md-8">
                                <Card sx={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '20px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Person sx={{ mr: 2, color: '#60a5fa' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                                Profile Settings
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="First Name"
                                                    value={profileSettings.firstName}
                                                    onChange={handleProfileChange('firstName')}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    InputProps={{
                                                        readOnly: loadingProfile
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            color: 'white',
                                                            '& fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.3)'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.5)'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            '&.Mui-focused': {
                                                                color: '#60a5fa'
                                                            }
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Last Name"
                                                    value={profileSettings.lastName}
                                                    onChange={handleProfileChange('lastName')}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    InputProps={{
                                                        readOnly: loadingProfile
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            color: 'white',
                                                            '& fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.3)'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.5)'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            '&.Mui-focused': {
                                                                color: '#60a5fa'
                                                            }
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Email Address"
                                                    type="email"
                                                    value={profileSettings.email}
                                                    onChange={handleProfileChange('email')}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    InputProps={{
                                                        readOnly: loadingProfile
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            color: 'white',
                                                            '& fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.3)'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.5)'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            '&.Mui-focused': {
                                                                color: '#60a5fa'
                                                            }
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Role"
                                                    value={profileSettings.role === 'super_admin' ? 'Super Admin' :
                                                        profileSettings.role === 'admin' ? 'Administrator' : 'Manager'}
                                                    variant="outlined"
                                                    margin="normal"
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    helperText="Your role cannot be changed"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            color: 'rgba(255, 255, 255, 0.6)',
                                                            '& fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.3)'
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            color: 'rgba(255, 255, 255, 0.7)'
                                                        },
                                                        '& .MuiFormHelperText-root': {
                                                            color: 'rgba(255, 255, 255, 0.5)'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Button
                                            variant="contained"
                                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                            onClick={handleSaveProfile}
                                            disabled={loading}
                                            sx={{
                                                mt: 3,
                                                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                                }
                                            }}
                                        >
                                            {loading ? 'Saving...' : 'Save Profile'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="col-12 col-md-4">
                                <Card sx={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '20px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <ManageAccounts sx={{ mr: 2, color: '#60a5fa' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                                Account Info
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                                Account Type
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>
                                                {profileSettings.role === 'super_admin' ? 'Super Admin' :
                                                    profileSettings.role === 'admin' ? 'Administrator' : 'Manager'}
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                                Permissions
                                            </Typography>
                                            {profileSettings.permissions && profileSettings.permissions.length > 0 ? (
                                                profileSettings.permissions.map((permission, index) => (
                                                    <Typography key={index} variant="body2" sx={{ color: 'white', mb: 0.5 }}>
                                                        • {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </Typography>
                                                ))
                                            ) : profileSettings.role === 'super_admin' ? (
                                                <Typography variant="body2" sx={{ color: 'white' }}>• All permissions granted</Typography>
                                            ) : (
                                                <Typography variant="body2" sx={{ color: 'white' }}>No specific permissions</Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* PASSWORD TAB */}
                    {activeTab === 1 && (
                        <div className="row">
                            <div className="col-12 col-md-8">
                                <Card sx={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '20px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Security sx={{ mr: 2, color: '#60a5fa' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                                Change Password
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    type="password"
                                                    label="Current Password"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange('currentPassword')}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            color: 'white',
                                                            '& fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.3)'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.5)'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            '&.Mui-focused': {
                                                                color: '#60a5fa'
                                                            }
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    type="password"
                                                    label="New Password"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange('newPassword')}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    helperText="Minimum 6 characters"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            color: 'white',
                                                            '& fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.3)'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.5)'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            '&.Mui-focused': {
                                                                color: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiFormHelperText-root': {
                                                            color: 'rgba(255, 255, 255, 0.5)'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    type="password"
                                                    label="Confirm New Password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange('confirmPassword')}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
                                                    helperText={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' ? "Passwords don't match" : ""}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            color: 'white',
                                                            '& fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.3)'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.5)'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            '&.Mui-focused': {
                                                                color: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiFormHelperText-root': {
                                                            color: 'rgba(255, 255, 255, 0.5)'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Button
                                            variant="contained"
                                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                            onClick={handleChangePassword}
                                            disabled={loading}
                                            sx={{
                                                mt: 3,
                                                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                                }
                                            }}
                                            color="primary"
                                        >
                                            {loading ? 'Changing...' : 'Change Password'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="col-12 col-md-4">
                                <Card sx={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '20px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                                            Password Security Tips
                                        </Typography>
                                        <Alert
                                            severity="info"
                                            sx={{
                                                mb: 2,
                                                background: 'rgba(33, 150, 243, 0.1)',
                                                color: 'white',
                                                border: '1px solid rgba(33, 150, 243, 0.3)',
                                                '& .MuiAlert-icon': {
                                                    color: '#60a5fa'
                                                }
                                            }}
                                        >
                                            Change your password regularly for security.
                                        </Alert>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                            Strong passwords include:
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>• At least 8 characters</Typography>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>• Upper and lowercase letters</Typography>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>• Numbers and special characters</Typography>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>• No personal information</Typography>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* PREFERENCES TAB */}
                    {activeTab === 2 && (
                        <div className="row">
                            <div className="col-12 col-md-8">
                                <Card sx={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '20px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Notifications sx={{ mr: 2, color: '#60a5fa' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                                Notification Preferences
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={preferenceSettings.notifications}
                                                        onChange={handlePreferenceChange('notifications')}
                                                        color="primary"
                                                    />
                                                }
                                                label={<Typography sx={{ color: 'white' }}>Email Notifications</Typography>}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={preferenceSettings.darkMode}
                                                        onChange={handlePreferenceChange('darkMode')}
                                                        color="primary"
                                                    />
                                                }
                                                label={<Typography sx={{ color: 'white' }}>Dark Mode</Typography>}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={preferenceSettings.autoSave}
                                                        onChange={handlePreferenceChange('autoSave')}
                                                        color="primary"
                                                    />
                                                }
                                                label={<Typography sx={{ color: 'white' }}>Auto Save</Typography>}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={preferenceSettings.twoFactor}
                                                        onChange={handlePreferenceChange('twoFactor')}
                                                        color="primary"
                                                    />
                                                }
                                                label={<Typography sx={{ color: 'white' }}>Two-Factor Authentication</Typography>}
                                            />
                                        </Box>

                                        <Button
                                            variant="contained"
                                            startIcon={<Save />}
                                            onClick={handleSavePreferences}
                                            sx={{
                                                mt: 3,
                                                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                                }
                                            }}
                                        >
                                            Save Preferences
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="col-12 col-md-4">
                                <Card sx={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '20px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Palette sx={{ mr: 2, color: '#60a5fa' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                                App Settings
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                            Your settings are automatically synced across all devices.
                                        </Typography>
                                        <Alert
                                            severity="info"
                                            sx={{
                                                mt: 2,
                                                background: 'rgba(33, 150, 243, 0.1)',
                                                color: 'white',
                                                border: '1px solid rgba(33, 150, 243, 0.3)',
                                                '& .MuiAlert-icon': {
                                                    color: '#60a5fa'
                                                }
                                            }}
                                        >
                                            Changes will take effect immediately after saving.
                                        </Alert>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Settings;
