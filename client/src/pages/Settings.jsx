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
    IconButton
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
import { adminAPI } from '../services/api';

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
    const [activeTab, setActiveTab] = useState(0);
    
    // Mock data for testing (this would normally come from API)
    const mockProfileData = {
        firstName: 'John',
        lastName: 'Doe',
        email: localStorage.getItem('userEmail') || 'admin@imvest.com',
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
        try {
            setLoadingProfile(true);
            
            // Attempt to get profile from API
            const response = await adminAPI.getProfile();
            console.log('API Response:', response);
            
            // Check if response has data property (common API pattern)
            const userData = response.data || response;
            
            if (userData && userData.firstName) {
                // API returned valid data
                setProfileSettings({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || localStorage.getItem('userEmail') || '',
                    role: userData.role || localStorage.getItem('userRole') || 'admin',
                    permissions: userData.permissions || []
                });
            } else {
                // API didn't return expected fields, use mock data
                console.log('Using mock data due to incomplete API response');
                setProfileSettings(mockProfileData);
            }
            
            console.log('Profile settings after update:', profileSettings);
            setLoadingProfile(false);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            
            // API failed, use mock data
            console.log('Using mock data due to API error');
            setProfileSettings(mockProfileData);
            
            setNotification({
                open: true,
                message: 'Could not load profile data from server, using default values',
                type: 'warning'
            });
            
            setLoadingProfile(false);
        }
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
        try {
            setLoading(true);
            const response = await adminAPI.updateProfile({
                firstName: profileSettings.firstName,
                lastName: profileSettings.lastName,
                email: profileSettings.email
            });
            
            setNotification({
                open: true,
                message: 'Profile updated successfully',
                type: 'success'
            });
            setLoading(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            setNotification({
                open: true,
                message: error.message || 'Failed to update profile',
                type: 'error'
            });
            setLoading(false);
        }
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

        try {
            setLoading(true);
            const response = await adminAPI.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            
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
        } catch (error) {
            console.error('Failed to change password:', error);
            setNotification({
                open: true,
                message: error.message || 'Failed to change password',
                type: 'error'
            });
            setLoading(false);
        }
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
            <Snackbar 
                open={notification.open} 
                autoHideDuration={6000} 
                onClose={() => setNotification({...notification, open: false})}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    severity={notification.type}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={() => setNotification({...notification, open: false})}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    }
                >
                    {notification.message}
                </Alert>
            </Snackbar>

            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="primary">
                    Home / Settings
                </Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                Settings
            </Typography>

            <Paper sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
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
                                <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Person sx={{ mr: 2, color: 'primary.main' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
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
                                            />
                                        </Grid>
                                    </Grid>

                                    <Button
                                        variant="contained"
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                        onClick={handleSaveProfile}
                                        disabled={loading}
                                        sx={{ mt: 3 }}
                                    >
                                        {loading ? 'Saving...' : 'Save Profile'}
                                    </Button>
                                </Paper>
                            </div>

                            <div className="col-12 col-md-4">
                                <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <ManageAccounts sx={{ mr: 2, color: 'primary.main' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            Account Info
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Account Type
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {profileSettings.role === 'super_admin' ? 'Super Admin' : 
                                             profileSettings.role === 'admin' ? 'Administrator' : 'Manager'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Permissions
                                        </Typography>
                                        {profileSettings.permissions && profileSettings.permissions.length > 0 ? (
                                            profileSettings.permissions.map((permission, index) => (
                                                <Typography key={index} variant="body2">
                                                    • {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </Typography>
                                            ))
                                        ) : profileSettings.role === 'super_admin' ? (
                                            <Typography variant="body2">• All permissions granted</Typography>
                                        ) : (
                                            <Typography variant="body2">No specific permissions</Typography>
                                        )}
                                    </Box>
                                </Paper>
                            </div>
                        </div>
                    )}

                    {/* PASSWORD TAB */}
                    {activeTab === 1 && (
                        <div className="row">
                            <div className="col-12 col-md-8">
                                <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Security sx={{ mr: 2, color: 'primary.main' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
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
                                            />
                                        </Grid>
                                    </Grid>

                                    <Button
                                        variant="contained"
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                        onClick={handleChangePassword}
                                        disabled={loading}
                                        sx={{ mt: 3 }}
                                        color="primary"
                                    >
                                        {loading ? 'Changing...' : 'Change Password'}
                                    </Button>
                                </Paper>
                            </div>

                            <div className="col-12 col-md-4">
                                <Paper sx={{ p: 3, borderRadius: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        Password Security Tips
                                    </Typography>
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        Change your password regularly for security.
                                    </Alert>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Strong passwords include:
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>• At least 8 characters</Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>• Upper and lowercase letters</Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>• Numbers and special characters</Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>• No personal information</Typography>
                                </Paper>
                            </div>
                        </div>
                    )}

                    {/* PREFERENCES TAB */}
                    {activeTab === 2 && (
                        <div className="row">
                            <div className="col-12 col-md-8">
                                <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Notifications sx={{ mr: 2, color: 'primary.main' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
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
                                            label="Email Notifications"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={preferenceSettings.darkMode}
                                                    onChange={handlePreferenceChange('darkMode')}
                                                    color="primary"
                                                />
                                            }
                                            label="Dark Mode"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={preferenceSettings.autoSave}
                                                    onChange={handlePreferenceChange('autoSave')}
                                                    color="primary"
                                                />
                                            }
                                            label="Auto Save"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={preferenceSettings.twoFactor}
                                                    onChange={handlePreferenceChange('twoFactor')}
                                                    color="primary"
                                                />
                                            }
                                            label="Two-Factor Authentication"
                                        />
                                    </Box>

                                    <Button
                                        variant="contained"
                                        startIcon={<Save />}
                                        onClick={handleSavePreferences}
                                        sx={{ mt: 3 }}
                                    >
                                        Save Preferences
                                    </Button>
                                </Paper>
                            </div>

                            <div className="col-12 col-md-4">
                                <Paper sx={{ p: 3, borderRadius: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Palette sx={{ mr: 2, color: 'primary.main' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            App Settings
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Your settings are automatically synced across all devices.
                                    </Typography>
                                    <Alert severity="info" sx={{ mt: 2 }}>
                                        Changes will take effect immediately after saving.
                                    </Alert>
                                </Paper>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Settings;
